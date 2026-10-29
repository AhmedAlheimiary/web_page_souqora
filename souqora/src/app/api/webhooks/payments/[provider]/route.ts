import { NextResponse } from "next/server";
import { prisma, type PrismaTransaction } from "@/lib/db/prisma";
import { paymentRegistry } from "@/lib/payments/registry";
import type { PaymentProviderName } from "@/lib/payments/types";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  try {
    const { provider: providerParam } = await params;
    const providerName = providerParam.toLowerCase() as PaymentProviderName;
    const adapter = paymentRegistry.get(providerName);

    if (!adapter) {
      return NextResponse.json(
        { error: "Unknown payment provider" },
        { status: 404 }
      );
    }

    const rawBody = await req.text();
    const headersObj: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headersObj[key] = value;
    });

    // 1. Verify webhook signature using provider adapter
    const verification = await adapter.verifyWebhook(headersObj, rawBody);

    if (!verification.isValid || !verification.transactionReference) {
      console.warn(
        `[Webhook] Rejected invalid signature from provider: ${providerName}`
      );
      return NextResponse.json(
        { error: "Invalid webhook signature" },
        { status: 400 }
      );
    }

    const { transactionReference, paymentStatus, amount, currency } =
      verification;

    // 2. Prevent duplicate processing via PaymentEvent idempotency check
    const existingPayment = await prisma.payment.findUnique({
      where: { transactionReference },
      include: { order: true },
    });

    if (!existingPayment) {
      return NextResponse.json(
        { error: "Payment transaction reference not found" },
        { status: 404 }
      );
    }

    // Check if event was already processed
    if (verification.rawPayload) {
      const eventId = (verification.rawPayload as { id?: string }).id;
      if (eventId) {
        const processed = await prisma.paymentEvent.findUnique({
          where: { providerEventId: eventId },
        });

        if (processed) {
          // Idempotent acknowledgement
          return NextResponse.json({ message: "Event already processed" });
        }
      }
    }

    // 3. Validate financial amounts and currency
    if (amount !== undefined && existingPayment.amount !== amount) {
      console.error(
        `[Webhook Security Alert] Amount mismatch! Expected: ${existingPayment.amount}, Received: ${amount}`
      );
      return NextResponse.json(
        { error: "Amount verification failed" },
        { status: 400 }
      );
    }

    if (currency && existingPayment.currency !== currency) {
      console.error(
        `[Webhook Security Alert] Currency mismatch! Expected: ${existingPayment.currency}, Received: ${currency}`
      );
      return NextResponse.json(
        { error: "Currency verification failed" },
        { status: 400 }
      );
    }

    // 4. Update order and payment status atomically inside a transaction
    await prisma.$transaction(async (tx: PrismaTransaction) => {
      const newPaymentStatus =
        paymentStatus === "PAID"
          ? PaymentStatus.PAID
          : paymentStatus === "FAILED"
            ? PaymentStatus.FAILED
            : PaymentStatus.PROCESSING;

      const newOrderStatus =
        newPaymentStatus === PaymentStatus.PAID
          ? OrderStatus.CONFIRMED
          : newPaymentStatus === PaymentStatus.FAILED
            ? OrderStatus.CANCELLED
            : OrderStatus.PENDING;

      await tx.payment.update({
        where: { id: existingPayment.id },
        data: { status: newPaymentStatus },
      });

      await tx.order.update({
        where: { id: existingPayment.orderId },
        data: {
          paymentStatus: newPaymentStatus,
          status: newOrderStatus,
        },
      });

      const eventId = (verification.rawPayload as { id?: string })?.id;
      await tx.paymentEvent.create({
        data: {
          paymentId: existingPayment.id,
          eventType: verification.eventType,
          providerEventId: eventId || null,
          status: newPaymentStatus,
          payload: verification.rawPayload
            ? JSON.parse(JSON.stringify(verification.rawPayload))
            : undefined,
        },
      });

      await tx.auditLog.create({
        data: {
          action: `PAYMENT_WEBHOOK_${newPaymentStatus}`,
          entityType: "Payment",
          entityId: existingPayment.id,
          metadata: {
            orderId: existingPayment.orderId,
            transactionReference,
            provider: providerName,
          },
        },
      });
    });

    return NextResponse.json({
      message: "Webhook processed and order updated successfully",
    });
  } catch (err) {
    console.error("Webhook processing error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
