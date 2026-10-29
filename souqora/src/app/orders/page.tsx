"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Truck,
  ArrowRight,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface CustomerOrder {
  id: string;
  orderNumber: string;
  totalAmount: number;
  currency: string;
  status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED";
  paymentStatus: "PAID" | "PENDING";
  paymentProvider: string;
  trackingNumber?: string | null;
  createdAt: string;
  shippingAddress: string;
  items: Array<{
    title: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export default function OrdersPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const numberLocale = isAr ? "ar-SA" : "en-US";

  const [orders] = useState<CustomerOrder[]>([
    {
      id: "ord-demo-001",
      orderNumber: "SQ-172924-A8F2",
      totalAmount: 472400, // 4,724.00 SAR (4699 + 25 shipping)
      currency: "SAR",
      status: "PROCESSING",
      paymentStatus: "PAID",
      paymentProvider: "bank_transfer",
      trackingNumber: "SPL-KSA-901823",
      createdAt: "2026-10-18T09:30:00.000Z",
      shippingAddress: "الرياض، حي النرجس، شارع عثمان بن عفان",
      items: [
        {
          title: isAr ? "آيفون 15 برو ماكس — 256 جيجابايت (تيتانيوم طبيعي)" : "iPhone 15 Pro Max 256GB",
          quantity: 1,
          unitPrice: 469900,
        },
      ],
    },
    {
      id: "ord-demo-002",
      orderNumber: "SQ-172923-C1Z9",
      totalAmount: 92400, // 924.00 SAR (899 + 25 shipping)
      currency: "SAR",
      status: "DELIVERED",
      paymentStatus: "PAID",
      paymentProvider: "stripe",
      trackingNumber: "SPL-KSA-881900",
      createdAt: "2026-10-15T14:15:00.000Z",
      shippingAddress: "جدة، حي الروضة، طريق الكورنيش",
      items: [
        {
          title: isAr ? "عطر العود الملكي الفاخر — 100 مل" : "Royal Oud Perfume 100ml",
          quantity: 1,
          unitPrice: 89900,
        },
      ],
    },
  ]);

  const steps = [
    { key: "PENDING", label: isAr ? "استلام الطلب" : "Placed" },
    { key: "PROCESSING", label: isAr ? "التجهيز والتدقيق" : "Processing" },
    { key: "SHIPPED", label: isAr ? "تم الشحن" : "Shipped" },
    { key: "DELIVERED", label: isAr ? "تم التسليم" : "Delivered" },
  ];

  const getStepIndex = (status: CustomerOrder["status"]) => {
    switch (status) {
      case "PENDING":
        return 0;
      case "PROCESSING":
        return 1;
      case "SHIPPED":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
    }
  };

  return (
    <div className="section-spacing">
      <div className="container-main max-w-4xl mx-auto space-y-6">
        <div>
          <h1
            className="text-2xl md:text-3xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            {isAr ? "طلباتي وسجل المشتريات" : "My Orders & Purchases"}
          </h1>
          <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {isAr
              ? "متابعة حالة شحناتك وتفاصيل المدفوعات وبوالص التوصيل"
              : "Track shipping status, delivery labels, and invoice records"}
          </p>
        </div>

        <div className="space-y-4">
          {orders.map((ord) => {
            const currentStep = getStepIndex(ord.status);

            return (
              <div
                key={ord.id}
                className="rounded-lg border p-5 space-y-4"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border-light)",
                }}
              >
                {/* Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b" style={{ borderColor: "var(--color-border-light)" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs" style={{ color: "var(--color-text)" }}>
                        {ord.orderNumber}
                      </span>
                      <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                        • {new Date(ord.createdAt).toLocaleDateString(numberLocale)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                      <MapPin size={12} style={{ color: "var(--color-accent)" }} />
                      <span>{ord.shippingAddress}</span>
                    </div>
                  </div>

                  <div className="text-start sm:text-end">
                    <span className="text-sm font-bold block" style={{ color: "var(--color-text)" }}>
                      {formatPrice(ord.totalAmount, ord.currency, numberLocale)}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-[10px] font-semibold"
                      style={{
                        backgroundColor:
                          ord.paymentStatus === "PAID"
                            ? "rgba(45, 138, 86, 0.12)"
                            : "rgba(229, 161, 0, 0.12)",
                        color:
                          ord.paymentStatus === "PAID"
                            ? "var(--color-success)"
                            : "var(--color-warning)",
                      }}
                    >
                      {ord.paymentStatus === "PAID"
                        ? isAr ? "مدفوع بالكامل" : "Paid"
                        : isAr ? "بانتظار مطابقة الحوالة" : "Pending Reconciliation"}
                    </span>
                  </div>
                </div>

                {/* Tracking Timeline */}
                <div>
                  <div className="text-xs font-semibold mb-2.5" style={{ color: "var(--color-text)" }}>
                    {isAr ? "مراحل الشحن والتوصيل" : "Delivery Progress"}
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center text-xs">
                    {steps.map((st, i) => {
                      const isComplete = i <= currentStep;
                      return (
                        <div key={st.key} className="space-y-1">
                          <div
                            className="h-1.5 rounded-full transition-colors"
                            style={{
                              backgroundColor: isComplete ? "var(--color-accent)" : "var(--color-border)",
                            }}
                          />
                          <span
                            className="text-[10px] block"
                            style={{
                              fontWeight: isComplete ? 600 : 400,
                              color: isComplete ? "var(--color-text)" : "var(--color-text-muted)",
                            }}
                          >
                            {st.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items & Shipping Note */}
                <div className="pt-2.5 border-t flex flex-wrap items-center justify-between gap-3 text-xs" style={{ borderColor: "var(--color-border-light)" }}>
                  <div className="space-y-0.5">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="font-medium text-xs" style={{ color: "var(--color-text)" }}>
                        {it.title} × {it.quantity}
                      </div>
                    ))}
                  </div>

                  {ord.trackingNumber && (
                    <div className="flex items-center gap-1.5 font-mono text-xs px-2.5 py-1 rounded-md border" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)" }}>
                      <Truck size={13} style={{ color: "var(--color-accent)" }} />
                      <span>{isAr ? "رقم البوليصة:" : "Tracking:"} {ord.trackingNumber}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md font-semibold text-xs transition-colors"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            <span>{isAr ? "تصفح ومتابعة التسوق" : "Continue Shopping"}</span>
            <ArrowIcon size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
