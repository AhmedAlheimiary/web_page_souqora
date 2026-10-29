"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  BarChart3,
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  CreditCard,
  TrendingUp,
  Users,
  Percent,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PortalGuard } from "@/components/common/portal-guard";

export default function SellerAnalyticsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const numberLocale = isAr ? "ar-SA" : "en-US";
  const [timeRange, setTimeRange] = useState<"7d" | "30d" | "90d">("30d");

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
      active: true,
    },
    {
      href: "/seller/payments",
      icon: <CreditCard size={18} />,
      label: isAr ? "المدفوعات" : "Payments",
    },
  ];

  // Demo KPI metrics (stored strictly in integer minor units)
  const kpis = [
    {
      title: isAr ? "إجمالي الإيرادات" : "Gross Revenue",
      value: formatPrice(18640000, "SAR", numberLocale), // 186,400.00 SAR
      growth: "+18.4%",
      isPositive: true,
      icon: <TrendingUp size={20} />,
      color: "var(--color-success)",
    },
    {
      title: isAr ? "زيارات المتجر والمشاهدات" : "Store Impressions",
      value: "42,850",
      growth: "+12.1%",
      isPositive: true,
      icon: <Users size={20} />,
      color: "var(--color-primary)",
    },
    {
      title: isAr ? "معدل التحويل إلى طلبات" : "Checkout Conversion",
      value: "3.42%",
      growth: "+0.5%",
      isPositive: true,
      icon: <Percent size={20} />,
      color: "var(--color-accent)",
    },
    {
      title: isAr ? "متوسط قيمة الطلب (AOV)" : "Average Order Value",
      value: formatPrice(64200, "SAR", numberLocale), // 642.00 SAR
      growth: "+4.2%",
      isPositive: true,
      icon: <Sparkles size={20} />,
      color: "var(--color-accent-alt)",
    },
  ];

  // Weekly sales trend data (Minor units)
  const weeklyTrends = [
    { dayAr: "السبت", dayEn: "Sat", amount: 1850000, pct: 45 },
    { dayAr: "الأحد", dayEn: "Sun", amount: 2420000, pct: 60 },
    { dayAr: "الإثنين", dayEn: "Mon", amount: 3100000, pct: 78 },
    { dayAr: "الثلاثاء", dayEn: "Tue", amount: 2850000, pct: 70 },
    { dayAr: "الأربعاء", dayEn: "Wed", amount: 3950000, pct: 95 },
    { dayAr: "الخميس", dayEn: "Thu", amount: 4100000, pct: 100 },
    { dayAr: "الجمعة", dayEn: "Fri", amount: 2150000, pct: 52 },
  ];

  // Category sales breakdown
  const categoryBreakdown = [
    {
      nameAr: "الإلكترونيات والأجهزة",
      nameEn: "Electronics & Tech",
      pct: 45,
      amount: 8388000,
      color: "#2563eb",
    },
    {
      nameAr: "الأزياء والملابس",
      nameEn: "Fashion & Apparel",
      pct: 25,
      amount: 4660000,
      color: "var(--color-accent)",
    },
    {
      nameAr: "صفقات واستفسارات العقارات",
      nameEn: "Real Estate Leads",
      pct: 18,
      amount: 3355200,
      color: "#d97706",
    },
    {
      nameAr: "ألعاب الفيديو والملحقات",
      nameEn: "Gaming & Gear",
      pct: 12,
      amount: 2236800,
      color: "#8b5cf6",
    },
  ];

  // Top performing items
  const topProducts = [
    {
      id: "prod-top-1",
      titleAr: "آبل آيفون 15 برو ماكس — 256 جيجابايت",
      titleEn: "Apple iPhone 15 Pro Max 256GB",
      unitsSold: 28,
      grossMinor: 13157200, // 131,572.00 SAR
      stockLeft: 14,
    },
    {
      id: "prod-top-2",
      titleAr: "عطر العود الملكي الطبيعي — 100 مل",
      titleEn: "Royal Natural Oud Perfume 100ml",
      unitsSold: 42,
      grossMinor: 3775800, // 37,758.00 SAR
      stockLeft: 8,
    },
    {
      id: "prod-top-3",
      titleAr: "جهاز سوني بلايستيشن 5 سليم",
      titleEn: "Sony PlayStation 5 Slim Console",
      unitsSold: 12,
      grossMinor: 2518800, // 25,188.00 SAR
      stockLeft: 3,
    },
  ];

  return (
    <PortalGuard requiredRole="seller">
      <div className="section-spacing">
        <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 shrink-0">
            <nav
              className="rounded-xl border p-3 space-y-1"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border-light)",
              }}
            >
              {sidebarLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: l.active ? "var(--color-primary)" : "transparent",
                    color: l.active
                      ? "var(--color-primary-foreground)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {l.icon} {l.label}
                </Link>
              ))}
            </nav>

            <div
              className="mt-6 p-4 rounded-xl border text-xs"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border-light)",
                color: "var(--color-text-muted)",
              }}
            >
              <div className="flex items-center gap-1.5 font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                <ShieldCheck size={14} style={{ color: "var(--color-success)" }} />
                <span>{isAr ? "بيانات دقيقة وموثوقة" : "Accurate Analytics"}</span>
              </div>
              <p>
                {isAr
                  ? "جميع المبيعات محسوبة بالوحدات المالية الدقيقة مع مطابقة الحوالات البنكية والمحفظة الرقمية."
                  : "All metrics are computed using integer minor currency units matched with verified settlements."}
              </p>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
                  {isAr ? "تحليلات الأداء والمبيعات" : "Performance & Sales Analytics"}
                </h1>
                <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {isAr
                    ? "مؤشرات نمو المتجر ومعدلات التحويل وحجم التداول"
                    : "Store growth indicators, conversion rates, and revenue volume"}
                </p>
              </div>

              {/* Time Range Selector */}
              <div
                className="flex items-center p-1 rounded-lg border text-xs font-medium self-start sm:self-auto"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border)",
                }}
              >
                {(
                  [
                    { key: "7d", label: isAr ? "آخر 7 أيام" : "Last 7 Days" },
                    { key: "30d", label: isAr ? "آخر 30 يوماً" : "Last 30 Days" },
                    { key: "90d", label: isAr ? "آخر ربع سنوي" : "Last 90 Days" },
                  ] as const
                ).map((range) => (
                  <button
                    key={range.key}
                    onClick={() => setTimeRange(range.key)}
                    className="px-3 py-1.5 rounded-md transition-colors"
                    style={{
                      backgroundColor:
                        timeRange === range.key ? "var(--color-primary)" : "transparent",
                      color:
                        timeRange === range.key
                          ? "var(--color-primary-foreground)"
                          : "var(--color-text-muted)",
                    }}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sandbox Notice */}
            <div
              className="p-3.5 rounded-xl border flex items-center justify-between text-xs"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.08)",
                borderColor: "rgba(59, 130, 246, 0.25)",
                color: "var(--color-text)",
              }}
            >
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-500 shrink-0" />
                <span>
                  {isAr
                    ? "التحليلات تعرض نشاط المتجر التجريبي لمتجر سوقرا المعتمد (سعودي ر.س)."
                    : "Analytics display simulated sandbox merchant activity for verified demo seller (SAR)."}
                </span>
              </div>
              <span
                className="px-2 py-0.5 rounded font-mono text-[10px] font-semibold"
                style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", color: "#2563eb" }}
              >
                SANDBOX
              </span>
            </div>

            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {kpis.map((kpi, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl border"
                  style={{
                    backgroundColor: "var(--color-surface-elevated)",
                    borderColor: "var(--color-border-light)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                      {kpi.title}
                    </span>
                    <span className="p-2 rounded-lg" style={{ backgroundColor: "var(--color-surface)", color: kpi.color }}>
                      {kpi.icon}
                    </span>
                  </div>
                  <div className="text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                    {kpi.value}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold" style={{ color: "var(--color-accent)" }}>
                    <ArrowUpRight size={14} />
                    <span>{kpi.growth}</span>
                    <span className="font-normal opacity-70" style={{ color: "var(--color-text-muted)" }}>
                      {isAr ? "مقارنة بالفترة السابقة" : "vs previous period"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Weekly Trends Chart */}
              <div
                className="lg:col-span-2 p-6 rounded-xl border"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border-light)",
                }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-bold text-base" style={{ color: "var(--color-text)" }}>
                      {isAr ? "حجم المبيعات اليومي (آخر 7 أيام)" : "Daily Sales Volume (Last 7 Days)"}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {isAr ? "المبالغ بالريال السعودي محسوبة بدقة" : "Amounts in SAR calculated precisely"}
                    </p>
                  </div>
                  <span className="text-sm font-bold" style={{ color: "var(--color-success)" }}>
                    {formatPrice(20420000, "SAR", numberLocale)}
                  </span>
                </div>

                {/* CSS Bar Chart */}
                <div className="flex items-end justify-between gap-3 h-48 pt-6 pb-2 border-b" style={{ borderColor: "var(--color-border-light)" }}>
                  {weeklyTrends.map((bar, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[11px] font-mono opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>
                        {formatPrice(bar.amount, "SAR", numberLocale)}
                      </div>
                      <div
                        className="w-full max-w-[40px] rounded-t-md transition-all duration-300 group-hover:brightness-110"
                        style={{
                          height: `${bar.pct}%`,
                          backgroundColor: i === 5 ? "var(--color-accent)" : "var(--color-primary)",
                        }}
                      />
                      <span className="text-xs font-medium" style={{ color: "var(--color-text-muted)" }}>
                        {isAr ? bar.dayAr : bar.dayEn}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Breakdown */}
              <div
                className="p-6 rounded-xl border flex flex-col justify-between"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border-light)",
                }}
              >
                <div>
                  <h3 className="font-bold text-base mb-1" style={{ color: "var(--color-text)" }}>
                    {isAr ? "توزيع الإيرادات حسب الفئة" : "Revenue by Category"}
                  </h3>
                  <p className="text-xs mb-5" style={{ color: "var(--color-text-muted)" }}>
                    {isAr ? "نسبة إسهام كل قطاع في المبيعات" : "Contribution of each sector to sales"}
                  </p>

                  <div className="space-y-4">
                    {categoryBreakdown.map((cat, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium" style={{ color: "var(--color-text)" }}>
                            {isAr ? cat.nameAr : cat.nameEn}
                          </span>
                          <span className="font-bold" style={{ color: cat.color }}>
                            {cat.pct}% ({formatPrice(cat.amount, "SAR", numberLocale)})
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-surface)" }}>
                          <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="mt-6 pt-4 border-t text-xs flex items-center justify-between"
                  style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-muted)" }}
                >
                  <span>{isAr ? "أعلى فئة نمواً:" : "Fastest growing:"}</span>
                  <span className="font-bold" style={{ color: "var(--color-text)" }}>
                    {isAr ? "الإلكترونيات (+32%)" : "Electronics (+32%)"}
                  </span>
                </div>
              </div>
            </div>

            {/* Top Converting Products Table */}
            <div
              className="rounded-xl border overflow-hidden"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border-light)",
              }}
            >
              <div className="p-4 border-b flex items-center justify-between" style={{ borderColor: "var(--color-border-light)" }}>
                <div>
                  <h3 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                    {isAr ? "المنتجات الأكثر مبيعاً وتحقيقاً للإيراد" : "Top Revenue Generating Products"}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                    {isAr ? "إجمالي القطع المباعة والمتبقي في المستودع" : "Total units sold and remaining warehouse stock"}
                  </p>
                </div>
                <Link
                  href="/seller/products"
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-primary)" }}
                >
                  {isAr ? "إدارة المخزون" : "Manage Inventory"}
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-start text-xs">
                  <thead style={{ backgroundColor: "var(--color-surface)", color: "var(--color-text-muted)" }}>
                    <tr>
                      <th className="py-3 px-4 text-start font-medium">{isAr ? "المنتج" : "Product"}</th>
                      <th className="py-3 px-4 text-center font-medium">{isAr ? "الوحدات المباعة" : "Units Sold"}</th>
                      <th className="py-3 px-4 text-center font-medium">{isAr ? "المخزون المتبقي" : "Stock"}</th>
                      <th className="py-3 px-4 text-end font-medium">{isAr ? "إجمالي المبيعات" : "Gross Revenue"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "var(--color-border-light)" }}>
                    {topProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                        <td className="py-3.5 px-4 font-semibold" style={{ color: "var(--color-text)" }}>
                          {isAr ? p.titleAr : p.titleEn}
                        </td>
                        <td className="py-3.5 px-4 text-center font-medium" style={{ color: "var(--color-text)" }}>
                          {p.unitsSold}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className="px-2 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{
                              backgroundColor: p.stockLeft <= 5 ? "rgba(239, 68, 68, 0.1)" : "rgba(196, 147, 63, 0.1)",
                              color: p.stockLeft <= 5 ? "#ef4444" : "var(--color-accent)",
                            }}
                          >
                            {p.stockLeft} {isAr ? "قطعة" : "units"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-end font-bold font-mono" style={{ color: "var(--color-text)" }}>
                          {formatPrice(p.grossMinor, "SAR", numberLocale)}
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
