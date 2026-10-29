"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  FileText,
  Plus,
  LayoutDashboard,
  Package,
  ShoppingBag,
  BarChart3,
  CreditCard,
  Building,
  Car,
  MapPin,
  MessageSquare,
} from "lucide-react";
import { demoProperties, demoVehicles } from "@/lib/data/demo-data";
import { formatPrice } from "@/lib/utils";
import { PortalGuard } from "@/components/common/portal-guard";

export default function SellerListingsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const numberLocale = isAr ? "ar-SA" : "en-US";

  const [activeType, setActiveType] = useState<"PROPERTIES" | "VEHICLES">("PROPERTIES");

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
      active: true,
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
      label: isAr ? "المدفوعات" : "Payments",
    },
  ];

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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {isAr ? "إعلانات العقارات والمركبات" : "Property & Vehicle Listings"}
                </h1>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {isAr
                    ? "إدارة الإعلانات الكبرى ذات المعاينة المباشرة ومتابعة استفسارات الشراء"
                    : "Manage high-value listings with direct viewing requests and leads"}
                </p>
              </div>

              <button
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-transform hover:scale-105"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-accent-foreground)",
                }}
              >
                <Plus size={16} />
                <span>{isAr ? "إضافة إعلان جديد" : "New Listing"}</span>
              </button>
            </div>

            {/* Type Selector Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setActiveType("PROPERTIES")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 cursor-pointer transition-all ${
                  activeType === "PROPERTIES" ? "ring-2 font-bold" : "opacity-80"
                }`}
                style={{
                  borderColor:
                    activeType === "PROPERTIES"
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                  backgroundColor: "var(--color-surface-elevated)",
                  color: "var(--color-text)",
                }}
              >
                <Building size={16} />
                <span>{isAr ? "العقارات المتاحة" : "Properties"}</span>
              </button>

              <button
                onClick={() => setActiveType("VEHICLES")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 cursor-pointer transition-all ${
                  activeType === "VEHICLES" ? "ring-2 font-bold" : "opacity-80"
                }`}
                style={{
                  borderColor:
                    activeType === "VEHICLES"
                      ? "var(--color-accent)"
                      : "var(--color-border)",
                  backgroundColor: "var(--color-surface-elevated)",
                  color: "var(--color-text)",
                }}
              >
                <Car size={16} />
                <span>{isAr ? "السيارات والمركبات" : "Vehicles"}</span>
              </button>
            </div>

            {/* Listings Grid */}
            {activeType === "PROPERTIES" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {demoProperties.map((prop) => (
                  <div
                    key={prop.id}
                    className="p-5 rounded-lg border space-y-3"
                    style={{
                      borderColor: "var(--color-border-light)",
                      backgroundColor: "var(--color-surface-elevated)",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                          {isAr ? prop.title : prop.titleEn || prop.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                          <MapPin size={12} />
                          <span>{prop.location}, {prop.city}</span>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-0.5 rounded text-[10px] font-semibold text-white"
                        style={{
                          backgroundColor:
                            prop.listingMode === "SALE"
                              ? "var(--color-primary)"
                              : "var(--color-accent)",
                        }}
                      >
                        {prop.listingMode === "SALE" ? (isAr ? "للبيع" : "For Sale") : (isAr ? "للإيجار" : "For Rent")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                      <span className="font-bold text-sm" style={{ color: "var(--color-accent)" }}>
                        {formatPrice(prop.price.amount, prop.price.currency, numberLocale)}
                      </span>
                      <div className="flex items-center gap-1 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                        <MessageSquare size={13} />
                        <span>3 {isAr ? "استفسارات نشطة" : "leads"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {demoVehicles.map((veh) => (
                  <div
                    key={veh.id}
                    className="p-5 rounded-lg border space-y-3"
                    style={{
                      borderColor: "var(--color-border-light)",
                      backgroundColor: "var(--color-surface-elevated)",
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                          {isAr ? veh.title : veh.titleEn || veh.title}
                        </h3>
                        <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
                          <MapPin size={12} />
                          <span>{veh.location}</span>
                        </div>
                      </div>
                      <span
                        className="px-2.5 py-0.5 rounded text-[10px] font-semibold text-white"
                        style={{
                          backgroundColor:
                            veh.condition === "NEW"
                              ? "var(--color-primary)"
                              : "var(--color-accent)",
                        }}
                      >
                        {veh.condition === "NEW" ? (isAr ? "جديد" : "New") : (isAr ? "مستعمل" : "Used")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                      <span className="font-bold text-sm" style={{ color: "var(--color-accent)" }}>
                        {formatPrice(veh.price.amount, veh.price.currency, numberLocale)}
                      </span>
                      <div className="flex items-center gap-1 text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                        <MessageSquare size={13} />
                        <span>4 {isAr ? "استفسارات نشطة" : "leads"}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </PortalGuard>
);
}
