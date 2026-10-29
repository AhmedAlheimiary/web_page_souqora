import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma, type PrismaTransaction } from "@/lib/db/prisma";
import { paymentRegistry } from "@/lib/payments/registry";
import type { PaymentProviderName } from "@/lib/payments/types";
import { OrderStatus, PaymentProviderType, PaymentStatus, ProductStatus } from "@prisma/client";
import { z } from "zod";

const checkoutRequestSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        variantId: z.string().uuid().optional(),
        quantity: z.number().int().positive().max(50),
      })
    )
    .min(1, "Cart cannot be empty"),
  shippingAddress: z.object({
    recipientName: z.string().min(2),
    phone: z.string().min(7),
    country: z.enum(["SA", "YE"]),
    city: z.string().min(2),
    street: z.string().min(2),
    buildingNumber: z.string().optional(),
    postalCode: z.string().optional(),
  }),
  paymentProvider: z.enum(["stripe", "bank_transfer"]),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required to checkout" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = checkoutRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid checkout payload", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { items, shippingAddress, paymentProvider } = result.data;
    const customerId = session.user.id;

    // 1. Server-side validation of products, category eligibility, and inventory
    const productIds = items.map((i) => i.productId);
    const dbProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        status: ProductStatus.ACTIVE,
      },
      include: {
        category: true,
        variants: true,
        seller: true,
      },
    });

    if (dbProducts.length !== productIds.length) {
      return NextResponse.json(
        { error: "One or more products in your cart are no longer available" },
        { status: 400 }
      );
    }

    // Verify all items belong to CART categories (no real-estate, vehicles, or restricted items)
    for (const prod of dbProducts) {
      if (prod.category.listingType !== "CART") {
        return NextResponse.json(
          {
            error: `Product "${prod.title}" belongs to a non-cart category (${prod.category.name}). Must use the dedicated inquiry workflow.`,
          },
          { status: 400 }
        );
      }
    }

    // 2. Canonical server-side financial calculations
    let subtotalAmount = 0;
    let commissionTotalAmount = 0;

    interface ValidatedItem {
      productId: string;
      sellerId: string;
      variantId?: string;
      productTitle: string;
      variantTitle?: string;
      unitPriceAmount: number;
      quantity: number;
      totalAmount: number;
      commissionRate: number;
      commissionAmount: number;
      sellerPayableAmount: number;
    }

    const validatedItems: ValidatedItem[] = [];

    for (const reqItem of items) {
      const dbProduct = dbProducts.find((p: (typeof dbProducts)[number]) => p.id === reqItem.productId)!;
      let unitPrice = dbProduct.priceAmount; // Canonical server price
      let variantTitle: string | undefined = undefined;

      if (reqItem.variantId) {
        const variant = dbProduct.variants.find((v: (typeof dbProduct.variants)[number]) => v.id === reqItem.variantId);
        if (!variant) {
          return NextResponse.json(
            { error: `Selected variant for "${dbProduct.title}" not found.` },
            { status: 400 }
          );
        }
        if (variant.stockQuantity < reqItem.quantity) {
          return NextResponse.json(
            {
              error: `Insufficient stock for "${dbProduct.title} - ${variant.title}". Available: ${variant.stockQuantity}`,
            },
            { status: 400 }
          );
        }
        unitPrice = variant.priceAmount;
        variantTitle = variant.title;
      }

      const itemTotal = unitPrice * reqItem.quantity;
      const commissionRate = dbProduct.seller.commissionRateOverride ?? 5.0; // 5% standard commission
      const itemCommission = Math.round(itemTotal * (commissionRate / 100));
      const sellerPayable = itemTotal - itemCommission;

      subtotalAmount += itemTotal;
      commissionTotalAmount += itemCommission;

      validatedItems.push({
        productId: dbProduct.id,
        sellerId: dbProduct.sellerId,
        variantId: reqItem.variantId,
        productTitle: dbProduct.title,
        variantTitle,
        unitPriceAmount: unitPrice,
        quantity: reqItem.quantity,
        totalAmount: itemTotal,
        commissionRate,
        commissionAmount: itemCommission,
        sellerPayableAmount: sellerPayable,
      });
    }

    const shippingAmount = 2500; // 25.00 SAR standard domestic shipping
    const discountAmount = 0;
    const finalTotalAmount = subtotalAmount + shippingAmount - discountAmount;
    const currency = "SAR";

    // 3. Atomically persist order, decrement inventory, and record financial snapshot
    const orderNumber = `SQ-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const idempotencyKey = `idemp-${orderNumber}-${Date.now()}`;
    const transactionReference = `TX-${orderNumber}`;

    const { order, checkoutResult } = await prisma.$transaction(async (tx: PrismaTransaction) => {
      // Concurrency-safe inventory decrement
      for (const item of validatedItems) {
        if (item.variantId) {
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: {
              stockQuantity: {
                decrement: item.quantity,
              },
            },
          });
        }
      }

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          customerId,
          status: OrderStatus.PENDING,
          currency,
          subtotalAmount,
          shippingAmount,
          discountAmount,
          commissionAmount: commissionTotalAmount,
          totalAmount: finalTotalAmount,
          shippingAddress,
          paymentStatus: PaymentStatus.PENDING,
          paymentProvider: paymentProvider,
          paymentReference: transactionReference,
          items: {
            create: validatedItems.map((vi) => ({
              sellerId: vi.sellerId,
              productId: vi.productId,
              variantId: vi.variantId,
              productTitle: vi.productTitle,
              variantTitle: vi.variantTitle,
              unitPriceAmount: vi.unitPriceAmount,
              quantity: vi.quantity,
              totalAmount: vi.totalAmount,
              commissionRate: vi.commissionRate,
              commissionAmount: vi.commissionAmount,
              sellerPayableAmount: vi.sellerPayableAmount,
            })),
          },
        },
      });

      // Create Payment entry
      const providerType =
        paymentProvider === "stripe"
          ? PaymentProviderType.STRIPE
          : PaymentProviderType.BANK_TRANSFER;

      await tx.payment.create({
        data: {
          orderId: newOrder.id,
          provider: providerType,
          transactionReference,
          amount: finalTotalAmount,
          currency,
          status: PaymentStatus.PENDING,
          idempotencyKey,
        },
      });

      // Audit log
      await tx.auditLog.create({
        data: {
          userId: customerId,
          action: "ORDER_CREATED",
          entityType: "Order",
          entityId: newOrder.id,
          metadata: {
            orderNumber: newOrder.orderNumber,
            totalAmount: newOrder.totalAmount,
            currency: newOrder.currency,
          },
        },
      });

      // Initiate provider session
      const adapter = paymentRegistry.get(paymentProvider as PaymentProviderName);
      if (!adapter) {
        throw new Error(`Provider adapter ${paymentProvider} not found.`);
      }

      const sessionResult = await adapter.createCheckoutSession({
        orderId: newOrder.id,
        orderNumber: newOrder.orderNumber,
        amount: newOrder.totalAmount,
        currency: "SAR",
        customerEmail: session.user?.email || "customer@souqora.com",
        customerName: session.user?.name || undefined,
        successUrl: `/orders?orderNumber=${newOrder.orderNumber}&status=success`,
        cancelUrl: `/cart?cancelled=${newOrder.orderNumber}`,
      });

      return { order: newOrder, checkoutResult: sessionResult };
    });

    return NextResponse.json(
      {
        message: "Order placed successfully",
        orderNumber: order.orderNumber,
        total: finalTotalAmount,
        currency,
        checkoutUrl: checkoutResult.checkoutUrl,
        requiresManualVerification:
          checkoutResult.requiresManualVerification ?? false,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Checkout POST error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Checkout failed" },
      { status: 500 }
    );
  }
}
