"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  ShoppingBag,
  LayoutDashboard,
  Package,
  FileText,
  BarChart3,
  CreditCard,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  Loader2,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PortalGuard } from "@/components/common/portal-guard";

interface OrderItem {
  title: string;
  quantity: number;
  unitPrice: number;
}

interface SellerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  shippingCity: string;
  shippingAddress: string;
  totalAmount: number;
  currency: string;
  status: string;
  paymentStatus: string;
  paymentProvider: string;
  trackingNumber?: string | null;
  createdAt: string;
  items: OrderItem[];
}

export default function SellerOrdersPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const numberLocale = isAr ? "ar-SA" : "en-US";

  const [orders, setOrders] = useState<SellerOrder[]>([]);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/seller/orders")
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders || []);
      })
      .catch(() => {});
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const tracking = trackingInputs[orderId] || `SPL-${Date.now().toString().slice(-6)}`;
      const res = await fetch("/api/seller/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          status: newStatus,
          trackingNumber: tracking,
        }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) =>
            o.id === orderId
              ? { ...o, status: newStatus, trackingNumber: tracking }
              : o
          )
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

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
      active: true,
    },
    {
      href: "/seller/analytics",
      icon: <BarChart3 size={18} />,
      label: isAr ? "التحليلات" : "Analytics",
    },
    {
      href: "/seller/payments",
      icon: <CreditCard size={18} />,
      label: isAr ? "المدفوعات" : "Payments",
    },
  ];

  const filteredOrders =
    activeTab === "ALL"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PROCESSING":
        return {
          label: isAr ? "قيد التجهيز" : "Processing",
          bg: "rgba(59, 130, 246, 0.1)",
          color: "#3b82f6",
        };
      case "PENDING":
        return {
          label: isAr ? "بانتظار الدفع/المطابقة" : "Pending",
          bg: "rgba(245, 158, 11, 0.1)",
          color: "#f59e0b",
        };
      case "SHIPPED":
        return {
          label: isAr ? "تم الشحن" : "Shipped",
          bg: "rgba(168, 85, 247, 0.1)",
          color: "#a855f7",
        };
      case "DELIVERED":
        return {
          label: isAr ? "تم التسليم بنجاح" : "Delivered",
          bg: "rgba(196, 147, 63, 0.1)",
          color: "var(--color-accent)",
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
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors"
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
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: "var(--color-text)" }}
              >
                {isAr ? "طلبات المتجر ومتابعة الشحن" : "Store Orders & Fulfillment"}
              </h1>
              <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                {isAr
                  ? "إدارة الطلبات الواردة، تحديث بوالص الشحن وتغيير حالات التوصيل"
                  : "Manage incoming orders, update tracking numbers, and progress fulfillment"}
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 text-xs">
              {[
                { key: "ALL", label: isAr ? "جميع الطلبات" : "All" },
                { key: "PENDING", label: isAr ? "بانتظار التأكيد" : "Pending" },
                { key: "PROCESSING", label: isAr ? "قيد التجهيز" : "Processing" },
                { key: "SHIPPED", label: isAr ? "تم الشحن" : "Shipped" },
                { key: "DELIVERED", label: isAr ? "المكتملة" : "Delivered" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-2 rounded-xl font-medium border cursor-pointer transition-all ${
                    activeTab === tab.key ? "ring-2 font-bold" : "opacity-80"
                  }`}
                  style={{
                    borderColor:
                      activeTab === tab.key
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                    backgroundColor: "var(--color-surface-elevated)",
                    color: "var(--color-text)",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Orders Cards List */}
            <div className="space-y-4">
              {filteredOrders.map((ord) => {
                const st = getStatusBadge(ord.status);
                const isUpdating = updatingId === ord.id;

                return (
                  <div
                    key={ord.id}
                    className="p-5 rounded-lg border space-y-4 transition-all"
                    style={{
                      borderColor: "var(--color-border-light)",
                      backgroundColor: "var(--color-surface-elevated)",
                    }}
                  >
                    {/* Top Row: Order Number, Date, Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b" style={{ borderColor: "var(--color-border-light)" }}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm" style={{ color: "var(--color-text)" }}>
                          {ord.orderNumber}
                        </span>
                        <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                          • {new Date(ord.createdAt).toLocaleDateString(numberLocale)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold"
                          style={{ backgroundColor: st.bg, color: st.color }}
                        >
                          {st.label}
                        </span>
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-medium"
                          style={{
                            backgroundColor:
                              ord.paymentStatus === "PAID"
                                ? "rgba(16, 185, 129, 0.1)"
                                : "rgba(245, 158, 11, 0.1)",
                            color:
                              ord.paymentStatus === "PAID"
                                ? "var(--color-success)"
                                : "var(--color-warning)",
                          }}
                        >
                          {ord.paymentStatus === "PAID"
                            ? isAr ? "تم الدفع" : "Paid"
                            : isAr ? "دفع معلق" : "Unpaid"}
                        </span>
                      </div>
                    </div>

                    {/* Customer & Shipping Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="font-semibold" style={{ color: "var(--color-text)" }}>
                          {ord.customerName}
                        </div>
                        <div className="flex items-center gap-1.5" style={{ color: "var(--color-text-muted)" }}>
                          <Phone size={13} />
                          <span dir="ltr">{ord.customerPhone}</span>
                        </div>
                        <div className="flex items-center gap-1.5" style={{ color: "var(--color-text-muted)" }}>
                          <MapPin size={13} />
                          <span>{ord.shippingCity} — {ord.shippingAddress}</span>
                        </div>
                      </div>

                      {/* Items & Total */}
                      <div className="sm:text-end space-y-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} style={{ color: "var(--color-text)" }}>
                            {it.title} × {it.quantity}
                          </div>
                        ))}
                        <div className="font-bold text-sm mt-1" style={{ color: "var(--color-accent)" }}>
                          {formatPrice(ord.totalAmount, ord.currency, numberLocale)}
                        </div>
                      </div>
                    </div>

                    {/* Fulfillment Action Controls */}
                    <div className="pt-3 border-t flex flex-wrap items-center justify-between gap-3 text-xs" style={{ borderColor: "var(--color-border-light)" }}>
                      <div className="flex items-center gap-2">
                        {ord.trackingNumber ? (
                          <div className="flex items-center gap-1.5 font-mono text-[11px]" style={{ color: "var(--color-accent)" }}>
                            <Truck size={14} />
                            <span>{isAr ? "رقم التتبع:" : "Tracking:"} {ord.trackingNumber}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5" style={{ color: "var(--color-text-muted)" }}>
                            <Clock size={13} />
                            <span>{isAr ? "بانتظار إصدار بوليصة الشحن" : "Awaiting shipping label"}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {ord.status === "PENDING" && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, "PROCESSING")}
                            disabled={isUpdating}
                            className="px-3.5 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors"
                            style={{
                              backgroundColor: "var(--color-primary)",
                              color: "var(--color-primary-foreground)",
                            }}
                          >
                            {isUpdating ? <Loader2 size={13} className="animate-spin" /> : isAr ? "بدء التجهيز" : "Start Processing"}
                          </button>
                        )}

                        {ord.status === "PROCESSING" && (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              placeholder={isAr ? "رقم البوليصة (SPL-XXXX)" : "Tracking #"}
                              value={trackingInputs[ord.id] || ""}
                              onChange={(e) =>
                                setTrackingInputs({
                                  ...trackingInputs,
                                  [ord.id]: e.target.value,
                                })
                              }
                              className="px-2.5 py-1.5 rounded-lg border text-xs outline-none font-mono"
                              style={{
                                borderColor: "var(--color-border)",
                                backgroundColor: "var(--color-surface)",
                              }}
                            />
                            <button
                              onClick={() => handleUpdateStatus(ord.id, "SHIPPED")}
                              disabled={isUpdating}
                              className="px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors flex items-center gap-1"
                              style={{
                                backgroundColor: "var(--color-accent)",
                                color: "var(--color-accent-foreground)",
                              }}
                            >
                              {isUpdating ? <Loader2 size={13} className="animate-spin" /> : (
                                <>
                                  <Truck size={13} />
                                  <span>{isAr ? "تأكيد الشحن" : "Mark Shipped"}</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {ord.status === "SHIPPED" && (
                          <button
                            onClick={() => handleUpdateStatus(ord.id, "DELIVERED")}
                            disabled={isUpdating}
                            className="px-3 py-1.5 rounded-lg font-semibold cursor-pointer transition-colors flex items-center gap-1"
                            style={{
                              backgroundColor: "var(--color-success)",
                              color: "#fff",
                            }}
                          >
                            {isUpdating ? <Loader2 size={13} className="animate-spin" /> : (
                              <>
                                <CheckCircle2 size={13} />
                                <span>{isAr ? "تم التسليم للعميل" : "Mark Delivered"}</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredOrders.length === 0 && (
                <div
                  className="rounded-lg border p-12 text-center"
                  style={{
                    borderColor: "var(--color-border-light)",
                    backgroundColor: "var(--color-surface-elevated)",
                  }}
                >
                  <ShoppingBag size={40} className="mx-auto mb-3 opacity-40" />
                  <p className="text-sm font-medium" style={{ color: "var(--color-text)" }}>
                    {isAr ? "لا توجد طلبات تطابق هذا التصنيف" : "No orders match this filter"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  </PortalGuard>
);
}
