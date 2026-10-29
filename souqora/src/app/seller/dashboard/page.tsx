"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  BarChart3,
  CreditCard,
  Plus,
  DollarSign,
  ArrowRight,
  ArrowLeft,
  MessageSquare,
  TrendingUp,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/utils";
import { PortalGuard } from "@/components/common/portal-guard";

interface OrderSummary {
  id: string;
  orderNumber: string;
  customerName: string;
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  paymentProvider: string;
  createdAt: string;
}

interface InquirySummary {
  id: string;
  senderName: string;
  senderPhone: string;
  inquiryType: string;
  referenceTitle: string;
  offeredAmount?: number;
  currency?: string;
  status: string;
  createdAt: string;
}

interface SellerMetrics {
  totalSalesAmount: number;
  pendingOrdersCount: number;
  activeProductsCount: number;
  activeListingsCount: number;
  customerInquiriesCount: number;
  currency: string;
  recentOrders: OrderSummary[];
  recentInquiries: InquirySummary[];
}

export default function SellerDashboardPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const numberLocale = isAr ? "ar-SA" : "en-US";
  const { data: session } = useSession();

  const [metrics, setMetrics] = useState<SellerMetrics | null>(null);

  useEffect(() => {
    fetch("/api/seller/metrics")
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
      })
      .catch(() => {});
  }, []);

  const sidebarLinks = [
    {
      href: "/seller/dashboard",
      icon: <LayoutDashboard size={16} />,
      label: isAr ? "لوحة التحكم" : "Dashboard",
      active: true,
    },
    {
      href: "/seller/products",
      icon: <Package size={16} />,
      label: isAr ? "المنتجات" : "Products",
    },
    {
      href: "/seller/listings",
      icon: <FileText size={16} />,
      label: isAr ? "عقارات وسيارات" : "Listings",
    },
    {
      href: "/seller/orders",
      icon: <ShoppingBag size={16} />,
      label: isAr ? "الطلبات" : "Orders",
    },
    {
      href: "/seller/analytics",
      icon: <BarChart3 size={16} />,
      label: isAr ? "التحليلات" : "Analytics",
    },
    {
      href: "/seller/payments",
      icon: <CreditCard size={16} />,
      label: isAr ? "المستحقات المالية" : "Payments",
    },
  ];

  const stats = [
    {
      icon: <DollarSign size={18} />,
      label: isAr ? "إجمالي المبيعات" : "Total Revenue",
      value: metrics
        ? formatPrice(metrics.totalSalesAmount, metrics.currency, numberLocale)
        : "—",
      color: "var(--color-success)",
      growth: "+18%",
    },
    {
      icon: <ShoppingBag size={18} />,
      label: isAr ? "طلبات بانتظار التجهيز" : "Pending Orders",
      value: metrics?.pendingOrdersCount?.toString() || "0",
      color: "var(--color-primary)",
      badge: isAr ? "تحتاج إجراء" : "Action Required",
    },
    {
      icon: <Package size={18} />,
      label: isAr ? "المنتجات المعروضة" : "Active Products",
      value: metrics?.activeProductsCount?.toString() || "0",
      color: "var(--color-accent)",
      growth: "+4 هذا الشهر",
    },
    {
      icon: <MessageSquare size={18} />,
      label: isAr ? "استفسارات العملاء" : "Customer Inquiries",
      value: metrics?.customerInquiriesCount?.toString() || "0",
      color: "var(--color-accent-alt)",
      badge: isAr ? "عقارات وسيارات" : "Leads",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return {
          label: isAr ? "قيد التجهيز" : "Processing",
          bg: "rgba(48, 104, 200, 0.1)",
          color: "var(--color-info)",
        };
      case "PENDING":
        return {
          label: isAr ? "بانتظار الدفع/المطابقة" : "Pending",
          bg: "rgba(229, 161, 0, 0.1)",
          color: "var(--color-warning)",
        };
      case "DELIVERED":
        return {
          label: isAr ? "تم التسليم" : "Delivered",
          bg: "rgba(45, 138, 86, 0.1)",
          color: "var(--color-success)",
        };
      default:
        return {
          label: status,
          bg: "var(--color-surface)",
          color: "var(--color-text)",
        };
    }
  };

  return (
    <PortalGuard requiredRole="seller">
      <div className="section-spacing">
        <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 shrink-0">
            <div
              className="p-4 rounded-lg border mb-3 text-center"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border-light)",
              }}
            >
              <div
                className="w-10 h-10 rounded-md mx-auto mb-2 flex items-center justify-center font-bold text-sm"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-accent-foreground)",
                }}
              >
                {session?.user?.name?.[0] || "S"}
              </div>
              <h2 className="font-bold text-xs" style={{ color: "var(--color-text)" }}>
                {session?.user?.name || (isAr ? "متجر معتمد" : "Verified Store")}
              </h2>
              <span
                className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium"
                style={{
                  backgroundColor: "rgba(45, 138, 86, 0.1)",
                  color: "var(--color-success)",
                }}
              >
                ✓ {isAr ? "تاجر موثق" : "Verified Merchant"}
              </span>
            </div>

            <nav
              className="rounded-lg border p-1.5 space-y-0.5"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border-light)",
              }}
            >
              {sidebarLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-md text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: link.active
                      ? "var(--color-primary)"
                      : "transparent",
                    color: link.active
                      ? "var(--color-primary-foreground)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Dashboard Content */}
          <div className="flex-1 space-y-6">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {isAr ? "لوحة تحكم التاجر" : "Merchant Dashboard"}
                </h1>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {isAr
                    ? "نظرة عامة على مبيعات متجرك، الطلبات الجارية واستفسارات العملاء"
                    : "Overview of your store sales, active orders, and customer leads"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/seller/products"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-accent-foreground)",
                  }}
                >
                  <Plus size={14} />
                  <span>{isAr ? "إضافة منتج جديد" : "Add Product"}</span>
                </Link>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3.5">
              {stats.map((stat, i) => (
                <div
                  key={i}
                  className="p-4 rounded-lg border transition-all"
                  style={{
                    borderColor: "var(--color-border-light)",
                    backgroundColor: "var(--color-surface-elevated)",
                  }}
                >
                  <div className="flex items-center justify-between mb-2.5">
                    <span
                      className="p-1.5 rounded-md"
                      style={{
                        backgroundColor: "var(--color-surface-alt)",
                        color: stat.color,
                      }}
                    >
                      {stat.icon}
                    </span>
                    {stat.growth && (
                      <span className="text-[10px] font-bold flex items-center gap-0.5" style={{ color: "var(--color-accent)" }}>
                        <TrendingUp size={11} />
                        {stat.growth}
                      </span>
                    )}
                    {stat.badge && (
                      <span
                        className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: "rgba(229, 161, 0, 0.12)",
                          color: "var(--color-warning)",
                        }}
                      >
                        {stat.badge}
                      </span>
                    )}
                  </div>
                  <div
                    className="text-[11px] mb-1"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {stat.label}
                  </div>
                  <div
                    className="text-lg font-bold"
                    style={{ color: "var(--color-text)" }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Orders Section */}
            <div
              className="rounded-lg border p-5"
              style={{
                borderColor: "var(--color-border-light)",
                backgroundColor: "var(--color-surface-elevated)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                    {isAr ? "أحدث طلبات المتجر" : "Recent Orders"}
                  </h2>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {isAr ? "الطلبات الواردة التي تتطلب شحناً أو مطابقة" : "Orders requiring fulfillment or verification"}
                  </p>
                </div>
                <Link
                  href="/seller/orders"
                  className="text-xs font-semibold flex items-center gap-1 hover:underline"
                  style={{ color: "var(--color-accent)" }}
                >
                  <span>{isAr ? "عرض كل الطلبات" : "View All"}</span>
                  <ArrowIcon size={13} />
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead>
                    <tr
                      className="border-b text-start"
                      style={{
                        borderColor: "var(--color-border-light)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      <th className="py-2 px-3 text-start">{isAr ? "رقم الطلب" : "Order"}</th>
                      <th className="py-2 px-3 text-start">{isAr ? "العميل" : "Customer"}</th>
                      <th className="py-2 px-3 text-start">{isAr ? "المبلغ" : "Total"}</th>
                      <th className="py-2 px-3 text-start">{isAr ? "طريقة الدفع" : "Payment"}</th>
                      <th className="py-2 px-3 text-start">{isAr ? "الحالة" : "Status"}</th>
                      <th className="py-2 px-3 text-end">{isAr ? "الإجراء" : "Action"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "var(--color-border-light)" }}>
                    {metrics?.recentOrders.map((ord) => {
                      const st = getStatusBadge(ord.status);
                      return (
                        <tr key={ord.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                          <td className="py-2.5 px-3 font-mono font-medium" style={{ color: "var(--color-text)" }}>
                            {ord.orderNumber}
                          </td>
                          <td className="py-2.5 px-3" style={{ color: "var(--color-text)" }}>
                            {ord.customerName}
                          </td>
                          <td className="py-2.5 px-3 font-semibold" style={{ color: "var(--color-text)" }}>
                            {formatPrice(ord.totalAmount, ord.currency, numberLocale)}
                          </td>
                          <td className="py-2.5 px-3" style={{ color: "var(--color-text-muted)" }}>
                            {ord.paymentProvider === "bank_transfer"
                              ? isAr ? "حوالة بنكية" : "Bank Transfer"
                              : isAr ? "بطاقة ائتمان" : "Card"}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-semibold"
                              style={{ backgroundColor: st.bg, color: st.color }}
                            >
                              {st.label}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-end">
                            <Link
                              href="/seller/orders"
                              className="px-2.5 py-1 rounded text-[11px] font-semibold border hover:opacity-80 inline-block"
                              style={{
                                borderColor: "var(--color-border)",
                                color: "var(--color-text)",
                              }}
                            >
                              {isAr ? "تحديث الحالة" : "Update"}
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Inquiries Section (Leads for Real Estate & Vehicles) */}
            <div
              className="rounded-lg border p-5"
              style={{
                borderColor: "var(--color-border-light)",
                backgroundColor: "var(--color-surface-elevated)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                    {isAr ? "استفسارات ومعاينات العملاء المباشرة (Leads)" : "Direct Inquiries & Viewing Leads"}
                  </h2>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {isAr ? "طلبات الشراء والمعاينة للعقارات والسيارات" : "Inquiries and inspection bookings for properties & vehicles"}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                {metrics?.recentInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="p-3 rounded-md border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    style={{
                      borderColor: "var(--color-border-light)",
                      backgroundColor: "var(--color-surface)",
                    }}
                  >
                    <div className="space-y-0.5">
                      <div className="font-semibold flex items-center gap-2" style={{ color: "var(--color-text)" }}>
                        <span>{inq.referenceTitle}</span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px]"
                          style={{
                            backgroundColor: "var(--color-surface-elevated)",
                            color: "var(--color-accent)",
                          }}
                        >
                          {inq.inquiryType === "PRICE_OFFER"
                            ? isAr ? "سومة / عرض سعر" : "Price Offer"
                            : isAr ? "طلب معاينة" : "Viewing Request"}
                        </span>
                      </div>
                      <div style={{ color: "var(--color-text-muted)" }}>
                        {isAr ? "مقدم الطلب: " : "From: "} {inq.senderName} ({inq.senderPhone})
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {inq.offeredAmount && (
                        <div className="text-start sm:text-end">
                          <div className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                            {isAr ? "المبلغ المعروض" : "Offered"}
                          </div>
                          <div className="font-bold" style={{ color: "var(--color-success)" }}>
                            {formatPrice(inq.offeredAmount, inq.currency || "SAR", numberLocale)}
                          </div>
                        </div>
                      )}
                      <a
                        href={`tel:${inq.senderPhone}`}
                        className="px-3 py-1.5 rounded-md font-semibold text-xs transition-colors"
                        style={{
                          backgroundColor: "var(--color-primary)",
                          color: "var(--color-primary-foreground)",
                        }}
                      >
                        {isAr ? "اتصال بالعميل" : "Call"}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </PortalGuard>
);
}
