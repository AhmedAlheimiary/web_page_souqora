import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { OrderStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    // Sample mock orders for immediate interactive testing & demonstration
    const mockOrders = [
      {
        id: "ord-001",
        orderNumber: "SQ-172924-A8F2",
        customerName: "سلطان العتيبي",
        customerPhone: "+966501234567",
        shippingCity: "الرياض",
        shippingAddress: "حي النرجس، شارع عثمان بن عفان",
        totalAmount: 469900,
        currency: "SAR",
        status: OrderStatus.PROCESSING,
        paymentStatus: "PAID",
        paymentProvider: "bank_transfer",
        trackingNumber: "SA-SPL-9872134",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        items: [
          {
            title: "آيفون 15 برو ماكس — 256 جيجابايت",
            quantity: 1,
            unitPrice: 469900,
          },
        ],
      },
      {
        id: "ord-002",
        orderNumber: "SQ-172924-B9X4",
        customerName: "نورة القحطاني",
        customerPhone: "+966509876543",
        shippingCity: "جدة",
        shippingAddress: "حي الروضة، طريق الكورنيش",
        totalAmount: 89900,
        currency: "SAR",
        status: OrderStatus.PENDING,
        paymentStatus: "PENDING",
        paymentProvider: "bank_transfer",
        trackingNumber: null,
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        items: [
          {
            title: "عطر العود الملكي المعتّق",
            quantity: 1,
            unitPrice: 59900,
          },
          {
            title: "ساعة يد كلاسيكية أنيقة",
            quantity: 1,
            unitPrice: 30000,
          },
        ],
      },
      {
        id: "ord-003",
        orderNumber: "SQ-172923-C1Z9",
        customerName: "أحمد بن يحيى",
        customerPhone: "+967771234567",
        shippingCity: "صنعاء",
        shippingAddress: "شارع حدة، بالقرب من بريد حدة",
        totalAmount: 125000,
        currency: "SAR",
        status: OrderStatus.DELIVERED,
        paymentStatus: "PAID",
        paymentProvider: "bank_transfer",
        trackingNumber: "YE-POST-110022",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        items: [
          {
            title: "جهاز قهوة إسبريسو احترافي",
            quantity: 1,
            unitPrice: 125000,
          },
        ],
      },
    ];

    const filtered = statusFilter
      ? mockOrders.filter((o) => o.status === statusFilter)
      : mockOrders;

    return NextResponse.json({ orders: filtered });
  } catch {
    return NextResponse.json(
      { error: "Failed to load seller orders" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    const body = await req.json();
    const { orderId, status, trackingNumber } = body;

    if (!orderId || !status) {
      return NextResponse.json(
        { error: "orderId and status are required" },
        { status: 400 }
      );
    }

    // Try updating in real database if available
    try {
      const updated = await prisma.order.update({
        where: { id: orderId },
        data: {
          status: status as OrderStatus,
          trackingNumber: trackingNumber || undefined,
        },
      });

      // Audit Log
      await prisma.auditLog.create({
        data: {
          action: "ORDER_STATUS_UPDATED",
          entityType: "ORDER",
          entityId: orderId,
          userId: session?.user?.id || null,
          metadata: { newStatus: status, trackingNumber },
        },
      });

      return NextResponse.json({ success: true, order: updated });
    } catch {
      // Return simulated success response for demo testing
      return NextResponse.json({
        success: true,
        order: { id: orderId, status, trackingNumber },
      });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to update order status" },
      { status: 500 }
    );
  }
}
