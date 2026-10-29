"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  CreditCard,
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  BarChart3,
  Building,
  CheckCircle2,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PortalGuard } from "@/components/common/portal-guard";

interface PayoutRecord {
  id: string;
  reference: string;
  amount: number;
  currency: string;
  bankName: string;
  accountIban: string;
  status: "COMPLETED" | "PENDING";
  createdAt: string;
}

export default function SellerPaymentsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const numberLocale = isAr ? "ar-SA" : "en-US";

  const [payouts] = useState<PayoutRecord[]>([
    {
      id: "po-001",
      reference: "PAYOUT-SA-881923",
      amount: 1420000, // 14,200.00 SAR
      currency: "SAR",
      bankName: "مصرف الراجحي",
      accountIban: "SA0380000000608010167519",
      status: "COMPLETED",
      createdAt: "2026-10-11T10:00:00.000Z",
    },
    {
      id: "po-002",
      reference: "PAYOUT-SA-992104",
      amount: 425000, // 4,250.00 SAR
      currency: "SAR",
      bankName: "مصرف الراجحي",
      accountIban: "SA0380000000608010167519",
      status: "COMPLETED",
      createdAt: "2026-10-04T10:00:00.000Z",
    },
    {
      id: "po-003",
      reference: "PAYOUT-SA-110944",
      amount: 644000, // 6,440.00 SAR
      currency: "SAR",
      bankName: "مصرف الراجحي",
      accountIban: "SA0380000000608010167519",
      status: "PENDING",
      createdAt: "2026-10-17T18:00:00.000Z",
    },
  ]);

  const [requestNotice, setRequestNotice] = useState<string | null>(null);

  const sidebarLinks = [
    {
      href: "/seller/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: isAr ? "لوحة التحكم" : "Dashboard",
    },
    {
      href: "/seller/products",
      icon: <Package size={18} />,
      label: isAr ? "المنتجات" : "Products",
    },
    {
      href: "/seller/listings",
      icon: <FileText size={18} />,
      label: isAr ? "عقارات وسيارات" : "Listings",
    },
    {
      href: "/seller/orders",
      icon: <ShoppingBag size={18} />,
      label: isAr ? "الطلبات" : "Orders",
    },
    {
      href: "/seller/analytics",
      icon: <BarChart3 size={18} />,
      label: isAr ? "التحليلات" : "Analytics",
    },
    {
      href: "/seller/payments",
      icon: <CreditCard size={18} />,
      label: isAr ? "المستحقات المالية" : "Payments",
      active: true,
    },
  ];

  const handleRequestPayout = () => {
    setRequestNotice(
      isAr
        ? "تم تسجيل طلب سحب الأرباح بنجاح! سيتم تحويل المبلغ إلى حساب الآيبان المسجل خلال 24 ساعة عمل."
        : "Payout requested successfully! Transfer will be initiated to your IBAN within 24 business hours."
    );
    setTimeout(() => setRequestNotice(null), 4000);
  };

  return (
    <PortalGuard requiredRole="seller">
      <div className="section-spacing">
        <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-60 shrink-0">
            <nav
              className="rounded-lg border p-2 space-y-1"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border-light)",
              }}
            >
              {sidebarLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-md text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: l.active
                      ? "var(--color-primary)"
                      : "transparent",
                    color: l.active
                      ? "var(--color-primary-foreground)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {l.icon} <span>{l.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {isAr ? "المستحقات المالية والتحويلات" : "Financial Payouts & Settlements"}
                </h1>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {isAr
                    ? "متابعة صافي أرباح المبيعات، عمولات المنصة، وسجلات التحويل البنكي"
                    : "Track net sales earnings, marketplace commissions, and bank payout logs"}
                </p>
              </div>

              <button
                onClick={handleRequestPayout}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-transform hover:scale-105"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                }}
              >
                <ArrowUpRight size={15} />
                <span>{isAr ? "طلب سحب الأرباح" : "Request Payout"}</span>
              </button>
            </div>

            {requestNotice && (
              <div
                className="p-4 rounded-lg border flex items-center gap-2 text-xs"
                style={{
                  backgroundColor: "rgba(196, 147, 63, 0.08)",
                  borderColor: "var(--color-border-light)",
                  color: "var(--color-text)",
                }}
              >
                <CheckCircle2 size={16} style={{ color: "var(--color-accent)" }} />
                <span>{requestNotice}</span>
              </div>
            )}

            {/* Financial Balance Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div
                className="p-5 rounded-lg border"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border-light)",
                }}
              >
                <div className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
                  {isAr ? "الرصيد المتاح للسحب" : "Available Balance"}
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--color-accent)" }}>
                  {formatPrice(644000, "SAR", numberLocale)}
                </div>
                <div className="text-[11px] mt-2" style={{ color: "var(--color-text-muted)" }}>
                  {isAr ? "مبيعات مكتملة التسليم وجاهزة للتحويل" : "Delivered sales ready for payout"}
                </div>
              </div>

              <div
                className="p-5 rounded-lg border"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border-light)",
                }}
              >
                <div className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
                  {isAr ? "إجمالي الحوالات المودعة" : "Total Settled Payouts"}
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                  {formatPrice(1845000, "SAR", numberLocale)}
                </div>
                <div className="text-[11px] mt-2" style={{ color: "var(--color-text-muted)" }}>
                  {isAr ? "تم إيداعها في حسابك البنكي" : "Deposited into your bank account"}
                </div>
              </div>

              <div
                className="p-5 rounded-lg border"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border-light)",
                }}
              >
                <div className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
                  {isAr ? "عمولة المنصة المقتطعة (10%)" : "Marketplace Fee (10%)"}
                </div>
                <div className="text-2xl font-bold" style={{ color: "var(--color-primary)" }}>
                  {formatPrice(248900, "SAR", numberLocale)}
                </div>
                <div className="text-[11px] mt-2" style={{ color: "var(--color-text-muted)" }}>
                  {isAr ? "نسبة ثابتة مقتطعة بنظام الحصص الذري" : "Fixed standard rate preserved in snapshots"}
                </div>
              </div>
            </div>

            {/* Registered Bank Account Info */}
            <div
              className="p-5 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
              style={{
                borderColor: "var(--color-border-light)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-white dark:bg-black/30 border" style={{ borderColor: "var(--color-border)" }}>
                  <Building size={20} style={{ color: "var(--color-accent)" }} />
                </div>
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                    مصرف الراجحي (Al Rajhi Bank) — الحساب التجاري المعتمد
                  </div>
                  <div className="font-mono text-[11px] mt-0.5 text-gray-500" dir="ltr">
                    IBAN: SA03 8000 0000 6080 1016 7519
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 font-semibold text-[11px]" style={{ color: "var(--color-accent)" }}>
                <ShieldCheck size={16} />
                <span>{isAr ? "حساب بنكي موثق ومطابق للسجل التجاري" : "Verified Agency IBAN"}</span>
              </div>
            </div>

            {/* Payouts Table */}
            <div
              className="rounded-lg border overflow-hidden"
              style={{
                borderColor: "var(--color-border-light)",
                backgroundColor: "var(--color-surface-elevated)",
              }}
            >
              <div className="p-4 border-b font-bold text-sm" style={{ borderColor: "var(--color-border-light)", color: "var(--color-text)" }}>
                {isAr ? "سجل التحويلات البنكية للمستحقات" : "Bank Payout History"}
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-muted)" }}>
                      <th className="py-3 px-4 text-start">{isAr ? "رقم المرجع" : "Ref"}</th>
                      <th className="py-3 px-4 text-start">{isAr ? "تاريخ التحويل" : "Date"}</th>
                      <th className="py-3 px-4 text-start">{isAr ? "البنك والمستلم" : "Bank Details"}</th>
                      <th className="py-3 px-4 text-start">{isAr ? "المبلغ المودع" : "Amount"}</th>
                      <th className="py-3 px-4 text-end">{isAr ? "الحالة" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "var(--color-border-light)" }}>
                    {payouts.map((po) => (
                      <tr key={po.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-mono font-medium" style={{ color: "var(--color-text)" }}>
                          {po.reference}
                        </td>
                        <td className="py-3 px-4" style={{ color: "var(--color-text-muted)" }}>
                          {new Date(po.createdAt).toLocaleDateString(numberLocale)}
                        </td>
                        <td className="py-3 px-4" style={{ color: "var(--color-text)" }}>
                          <div>{po.bankName}</div>
                          <div className="font-mono text-[10px] text-gray-500" dir="ltr">
                            {po.accountIban.slice(0, 8)}...{po.accountIban.slice(-4)}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-bold" style={{ color: "var(--color-text)" }}>
                          {formatPrice(po.amount, po.currency, numberLocale)}
                        </td>
                        <td className="py-3 px-4 text-end">
                          <span
                            className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{
                              backgroundColor:
                                po.status === "COMPLETED"
                                  ? "rgba(16, 185, 129, 0.12)"
                                  : "rgba(245, 158, 11, 0.12)",
                              color:
                                po.status === "COMPLETED"
                                  ? "var(--color-success)"
                                  : "var(--color-warning)",
                            }}
                          >
                            {po.status === "COMPLETED"
                              ? isAr ? "تم الإيداع بنجاح ✓" : "Completed"
                              : isAr ? "بانتظار المعالجة" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PortalGuard>
);
}
