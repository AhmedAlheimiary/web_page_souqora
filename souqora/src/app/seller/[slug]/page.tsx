"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ShieldCheck,
  Star,
  MapPin,
  MessageSquare,
  Package,
  Building,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { demoStores, demoProducts } from "@/lib/data/demo-data";
import { ProductCard } from "@/components/common/product-card";

export default function SellerStorefrontPage() {
  const params = useParams();
  const slug = params.slug as string;
  const locale = useLocale();
  const t = useTranslations();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeTab, setActiveTab] = useState<"products" | "about">("products");

  const store = demoStores.find((s) => s.slug === slug);

  if (!store) {
    return (
      <div className="section-spacing">
        <div className="container-main text-center py-20">
          <h1 className="text-xl md:text-2xl font-bold mb-3" style={{ color: "var(--color-text)" }}>
            {t("errors.pageNotFound")}
          </h1>
          <p className="text-xs mb-6 text-neutral-400">
            {isAr ? "المتجر المطلوب غير موجود أو تم تغيير رابطه." : "Store not found."}
          </p>
          <Link
            href="/stores"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <span>{isAr ? "العودة إلى دليل المتاجر" : "Back to Stores"}</span>
            <ArrowIcon size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const storeProducts = demoProducts.filter((p) => p.sellerId === store.id);

  return (
    <div>
      {/* Cover Banner */}
      <div className="h-44 md:h-56 relative overflow-hidden bg-neutral-900">
        {store.coverImageUrl ? (
          <img
            src={store.coverImageUrl}
            alt={isAr ? store.name : store.nameEn || store.name}
            className="w-full h-full object-cover opacity-85"
            onError={(e) => {
              e.currentTarget.src = `/api/placeholder?cat=${store.category}&title=${encodeURIComponent(isAr ? store.name : store.nameEn || store.name)}&w=1200&h=400`;
            }}
          />
        ) : (
          <div
            className="w-full h-full"
            style={{
              backgroundColor: "var(--color-primary)",
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="container-main h-full flex items-end justify-end pb-4 relative z-10">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
                alert(isAr ? "تم نسخ رابط المتجر إلى الحافظة" : "Store link copied to clipboard");
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white/95 text-neutral-900 shadow-sm hover:bg-white transition-colors cursor-pointer"
          >
            <Share2 size={13} />
            <span>{isAr ? "مشاركة المتجر" : "Share Store"}</span>
          </button>
        </div>
      </div>

      {/* Store Header Details */}
      <div className="border-b" style={{ backgroundColor: "var(--color-surface-elevated)", borderColor: "var(--color-border)" }}>
        <div className="container-main pb-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-10 sm:-mt-12 mb-3">
            <div className="flex items-end gap-3.5">
              {/* Store Avatar Logo */}
              <div
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden flex items-center justify-center text-3xl font-bold shrink-0 shadow-md bg-white dark:bg-neutral-900 border-2"
                style={{
                  borderColor: "var(--color-surface-elevated)",
                }}
              >
                {store.logoUrl ? (
                  <img
                    src={store.logoUrl}
                    alt={isAr ? store.name : store.nameEn || store.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span style={{ color: "var(--color-accent)" }}>{(isAr ? store.name : store.nameEn || store.name).charAt(0)}</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-lg sm:text-xl font-bold" style={{ color: "var(--color-text)" }}>
                    {isAr ? store.name : store.nameEn || store.name}
                  </h1>
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold"
                    style={{
                      backgroundColor: "rgba(45, 138, 86, 0.1)",
                      color: "var(--color-success)",
                    }}
                  >
                    <ShieldCheck size={12} />
                    <span>{isAr ? "بائع موثق" : "Verified Seller"}</span>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1 text-xs text-neutral-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} style={{ color: "var(--color-accent)" }} />
                    <span>الرياض، المملكة العربية السعودية</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={12} className="text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-neutral-800 dark:text-neutral-200">4.9</span>
                    <span>(128 {isAr ? "تقييم" : "reviews"})</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    <span>{isAr ? "معدل الرد: خلال ساعة" : "Replies within 1 hour"}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-md text-xs font-semibold text-white transition-colors"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <MessageSquare size={13} />
                <span>{isAr ? "مراسلة المتجر" : "Message Store"}</span>
              </Link>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs max-w-3xl leading-relaxed mb-4" style={{ color: "var(--color-text-muted)" }}>
            {isAr ? store.description : store.descriptionEn || store.description}
          </p>

          {/* Tabs */}
          <div className="flex items-center gap-6 text-xs font-bold border-b -mb-4" style={{ borderColor: "var(--color-border-light)" }}>
            <button
              onClick={() => setActiveTab("products")}
              className="pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer"
              style={{
                borderColor: activeTab === "products" ? "var(--color-accent)" : "transparent",
                color: activeTab === "products" ? "var(--color-accent)" : "var(--color-text-muted)",
              }}
            >
              <Package size={14} />
              <span>{isAr ? "المنتجات والعروض" : "Products"} ({storeProducts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("about")}
              className="pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer"
              style={{
                borderColor: activeTab === "about" ? "var(--color-accent)" : "transparent",
                color: activeTab === "about" ? "var(--color-accent)" : "var(--color-text-muted)",
              }}
            >
              <Building size={14} />
              <span>{isAr ? "بيانات التوثيق والترخيص" : "Compliance & Licensing"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <section className="section-spacing">
        <div className="container-main">
          {activeTab === "products" ? (
            <div>
              {storeProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {storeProducts.map((p) => (
                    <ProductCard key={p.id} product={p} isDemo={p.isDemo} />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-16 rounded-lg border"
                  style={{
                    backgroundColor: "var(--color-surface-elevated)",
                    borderColor: "var(--color-border-light)",
                  }}
                >
                  <Package size={36} className="mx-auto mb-2 opacity-30 text-neutral-400" />
                  <p className="font-semibold text-xs" style={{ color: "var(--color-text)" }}>
                    {isAr ? "لا توجد منتجات معروضة حالياً في هذا المتجر" : "No products currently listed"}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="max-w-2xl space-y-4">
              <div
                className="rounded-lg border p-5"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border)",
                }}
              >
                <h3 className="font-bold text-xs mb-3 flex items-center gap-1.5" style={{ color: "var(--color-text)" }}>
                  <ShieldCheck size={16} style={{ color: "var(--color-accent)" }} />
                  <span>{isAr ? "بيانات التسجيل التجاري المعتمدة" : "Official Commercial Compliance"}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-md border" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface)" }}>
                    <span className="text-[11px] block mb-0.5" style={{ color: "var(--color-text-muted)" }}>{isAr ? "رقم السجل التجاري (CR):" : "CR Number:"}</span>
                    <span className="font-mono font-bold" style={{ color: "var(--color-text)" }}>1010892341</span>
                  </div>
                  <div className="p-2.5 rounded-md border" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface)" }}>
                    <span className="text-[11px] block mb-0.5" style={{ color: "var(--color-text-muted)" }}>{isAr ? "الرقم الضريبي الموحد (VAT):" : "Tax VAT Number:"}</span>
                    <span className="font-mono font-bold" style={{ color: "var(--color-text)" }}>300982341100003</span>
                  </div>
                  <div className="p-2.5 rounded-md border" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface)" }}>
                    <span className="text-[11px] block mb-0.5" style={{ color: "var(--color-text-muted)" }}>{isAr ? "حالة التوثيق في المركز السعودي للأعمال:" : "Business Center Status:"}</span>
                    <span className="font-bold flex items-center gap-1" style={{ color: "var(--color-success)" }}>
                      <CheckCircle2 size={13} />
                      <span>{isAr ? "سجل تجاري نشط وموثق" : "Active & Verified"}</span>
                    </span>
                  </div>
                  <div className="p-2.5 rounded-md border" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface)" }}>
                    <span className="text-[11px] block mb-0.5" style={{ color: "var(--color-text-muted)" }}>{isAr ? "عضو في سوقرا منذ:" : "Member Since:"}</span>
                    <span className="font-bold" style={{ color: "var(--color-text)" }}>يناير 2025</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
