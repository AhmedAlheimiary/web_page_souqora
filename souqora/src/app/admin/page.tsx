"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import {
  ShieldCheck,
  Building,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Loader2,
  FileCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PortalGuard } from "@/components/common/portal-guard";

interface PendingTransfer {
  paymentId: string;
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  amount: number;
  currency: string;
  paymentProvider: string;
  transactionReference: string;
  status: string;
  createdAt: string;
  bankName: string;
  transferNotes: string;
}

export default function AdminDashboardPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const numberLocale = isAr ? "ar-SA" : "en-US";

  const [transfers, setTransfers] = useState<PendingTransfer[]>([]);
  const [reconcilingId, setReconcilingId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Demo Platform KPIs
  const platformStats = [
    {
      title: isAr ? "حجم التداولات الكلي (GMV)" : "Total Platform GMV",
      value: formatPrice(48250000, "SAR", numberLocale), // 482,500.00 SAR
      growth: "+24.5%",
      icon: <DollarSign size={20} />,
      color: "var(--color-success)",
    },
    {
      title: isAr ? "صافي عمولات المنصة (10%)" : "Net Platform Commissions",
      value: formatPrice(4825000, "SAR", numberLocale), // 48,250.00 SAR
      growth: "+24.5%",
      icon: <TrendingUp size={20} />,
      color: "var(--color-accent)",
    },
    {
      title: isAr ? "المتاجر الموثقة النشطة" : "Active Verified Stores",
      value: "84",
      growth: "+6 هذا الأسبوع",
      icon: <Building size={20} />,
      color: "var(--color-primary)",
    },
    {
      title: isAr ? "حوالات بانتظار المطابقة" : "Pending Bank Reconciliations",
      value: transfers.length.toString(),
      growth: isAr ? "إجراء إداري مطلوب" : "Action Required",
      icon: <FileCheck size={20} />,
      color: "var(--color-warning)",
    },
  ];

  useEffect(() => {
    fetch("/api/admin/reconcile")
      .then((res) => res.json())
      .then((data) => {
        setTransfers(data.pendingTransfers || []);
      })
      .catch(() => {});
  }, []);

  const handleReconcile = async (transfer: PendingTransfer) => {
    setReconcilingId(transfer.paymentId);

    try {
      const res = await fetch("/api/admin/reconcile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentId: transfer.paymentId,
          orderId: transfer.orderId,
          notes: "Approved and reconciled by System Administrator via Admin Portal",
        }),
      });

      if (res.ok) {
        setTransfers((prev) => prev.filter((t) => t.paymentId !== transfer.paymentId));
        setSuccessNotice(
          isAr
            ? `تم اعتماد الحوالة ${transfer.transactionReference} للطلب ${transfer.orderNumber} وتحديث الحالة إلى مدفوع ✓`
            : `Bank transfer ${transfer.transactionReference} reconciled for order ${transfer.orderNumber} ✓`
        );

        setTimeout(() => setSuccessNotice(null), 4000);
      }
    } finally {
      setReconcilingId(null);
    }
  };

  return (
    <PortalGuard requiredRole="admin">
      <div className="section-spacing">
      <div className="container-main space-y-8">
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b" style={{ borderColor: "var(--color-border-light)" }}>
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-foreground)",
              }}
            >
              <ShieldCheck size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                {isAr ? "لوحة الإدارة والرقابة المالية" : "Administrative & Financial Portal"}
              </h1>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {isAr
                  ? "إدارة الحوالات البنكية، تدقيق طلبات التجار، ومطابقة المستحقات المالية (KSA & Yemen)"
                  : "Bank transfer reconciliation, merchant verification, and compliance monitoring"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5"
              style={{
                backgroundColor: "rgba(196, 147, 63, 0.12)",
                color: "var(--color-accent)",
              }}
            >
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: "var(--color-accent)" }} />
              <span>{isAr ? "النظام المالي متصل ومحمي" : "Financial Engine Active"}</span>
            </span>
          </div>
        </div>

        {/* Success Alert */}
        {successNotice && (
          <div
            className="p-4 rounded-lg border flex items-center gap-3 text-sm animate-in fade-in"
            style={{
              backgroundColor: "rgba(196, 147, 63, 0.08)",
              borderColor: "var(--color-border-light)",
              color: "var(--color-text)",
            }}
          >
            <CheckCircle2 size={18} className="shrink-0" style={{ color: "var(--color-accent)" }} />
            <span className="font-medium">{successNotice}</span>
          </div>
        )}

        {/* Platform KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {platformStats.map((stat, i) => (
            <div
              key={i}
              className="p-5 rounded-lg border"
              style={{
                borderColor: "var(--color-border-light)",
                backgroundColor: "var(--color-surface-elevated)",
              }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="p-2.5 rounded-md"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </span>
                <span className="text-[11px] font-bold" style={{ color: "var(--color-accent)" }}>
                  {stat.growth}
                </span>
              </div>
              <div className="text-xs mb-1" style={{ color: "var(--color-text-muted)" }}>
                {stat.title}
              </div>
              <div className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Bank Transfer Manual Reconciliation Queue */}
        <div
          className="rounded-lg border p-6 space-y-5"
          style={{
            borderColor: "var(--color-border-light)",
            backgroundColor: "var(--color-surface-elevated)",
          }}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Building size={20} style={{ color: "var(--color-accent)" }} />
                <h2 className="text-lg font-bold" style={{ color: "var(--color-text)" }}>
                  {isAr ? "قائمة الحوالات البنكية بانتظار المطابقة والاعتماد" : "Pending Bank Reconciliation Queue"}
                </h2>
              </div>
              <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                {isAr
                  ? "وفقاً لسياسة الأمان والامتثال المالي: لا يتم تأكيد الطلبات المحولة بنكياً إلا بمطابقة كشف حساب المصرف أولاً."
                  : "Per platform compliance: Bank orders remain pending until explicitly confirmed against the bank statement."}
              </p>
            </div>

            <span className="text-xs font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "var(--color-warning)" }}>
              {transfers.length} {isAr ? "حوالات معلقة" : "Pending Deposits"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-muted)" }}>
                  <th className="py-3 px-3 text-start">{isAr ? "رقم الطلب والتحويل" : "Order & Ref"}</th>
                  <th className="py-3 px-3 text-start">{isAr ? "بيانات المودع" : "Depositor"}</th>
                  <th className="py-3 px-3 text-start">{isAr ? "البنك المستلم" : "Bank"}</th>
                  <th className="py-3 px-3 text-start">{isAr ? "ملاحظات الإشعار" : "Notes"}</th>
                  <th className="py-3 px-3 text-start">{isAr ? "المبلغ المطابق" : "Amount"}</th>
                  <th className="py-3 px-3 text-end">{isAr ? "الإجراء المالي" : "Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: "var(--color-border-light)" }}>
                {transfers.map((tr) => {
                  const isBusy = reconcilingId === tr.paymentId;
                  return (
                    <tr key={tr.paymentId} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-3">
                        <div className="font-mono font-bold" style={{ color: "var(--color-text)" }}>
                          {tr.orderNumber}
                        </div>
                        <div className="font-mono text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                          {tr.transactionReference}
                        </div>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-medium" style={{ color: "var(--color-text)" }}>
                          {tr.customerName}
                        </div>
                        <div className="text-[11px]" style={{ color: "var(--color-text-muted)" }} dir="ltr">
                          {tr.customerPhone}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-medium" style={{ color: "var(--color-text)" }}>
                        {tr.bankName}
                      </td>
                      <td className="py-3.5 px-3 max-w-xs truncate" style={{ color: "var(--color-text-muted)" }}>
                        {tr.transferNotes}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-sm" style={{ color: "var(--color-accent)" }}>
                        {formatPrice(tr.amount, tr.currency, numberLocale)}
                      </td>
                      <td className="py-3.5 px-3 text-end">
                        <button
                          onClick={() => handleReconcile(tr)}
                          disabled={isBusy}
                          className="px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-transform hover:scale-105 inline-flex items-center gap-1.5 disabled:opacity-50"
                          style={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-primary-foreground)",
                          }}
                        >
                          {isBusy ? (
                            <Loader2 size={13} className="animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 size={14} />
                              <span>{isAr ? "تأكيد ومطابقة الحوالة" : "Reconcile Deposit"}</span>
                            </>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {transfers.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle2 size={36} className="mx-auto mb-2" style={{ color: "var(--color-accent)" }} />
              <p className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                {isAr
                  ? "رائع! تم تدقيق ومطابقة كافة الحوالات البنكية ولا توجد دفعات معلقة حالياً."
                  : "All bank transfers are reconciled! Zero pending deposits in queue."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  </PortalGuard>
);
}
