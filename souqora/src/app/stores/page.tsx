"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Store,
  ShieldCheck,
  Search,
  Star,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { demoStores } from "@/lib/data/demo-data";

export default function StoresPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isRtl(isAr);
  function isRtl(ar: boolean) {
    return ar ? ArrowLeft : ArrowRight;
  }

  const [searchQuery, setSearchQuery] = useState("");

  const filteredStores = demoStores.filter((store) => {
    const name = isAr ? store.name : store.nameEn || store.name;
    const desc = isAr ? store.description : store.descriptionEn || store.description;
    const matchesSearch =
      !searchQuery ||
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (desc || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div>
      {/* Editorial Header */}
      <section
        className="py-12 md:py-16 text-white relative overflow-hidden"
        style={{
          backgroundColor: "var(--color-primary)",
        }}
      >
        <div className="container-main text-center max-w-2xl mx-auto relative z-10">
          <div
            className="w-12 h-12 rounded-md mx-auto mb-3 flex items-center justify-center shadow-sm"
            style={{ backgroundColor: "rgba(196, 147, 63, 0.15)", color: "var(--color-accent)" }}
          >
            <Store size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {isAr ? "دليل المتاجر والوكالات المعتمدة" : "Verified Merchants & Stores Directory"}
          </h1>
          <p className="text-sm max-w-lg mx-auto mb-6 text-white/60">
            {isAr
              ? "تسوق مباشرة من المتاجر الرسمية والوكالات العقارية ومعارض السيارات الموثقة بسجل تجاري معتمد"
              : "Shop directly from verified retailers, official dealerships, and certified real estate agencies"}
          </p>

          {/* Search Bar */}
          <div
            className="flex items-center max-w-md mx-auto rounded-md overflow-hidden border"
            style={{
              backgroundColor: "var(--color-surface-elevated)",
              borderColor: "rgba(255, 255, 255, 0.2)",
            }}
          >
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? "ابحث باسم المتجر أو الوكالة..." : "Search by store name or agency..."}
              className="flex-1 px-3.5 py-2.5 text-xs outline-none"
              style={{
                backgroundColor: "transparent",
                color: "var(--color-text)",
              }}
              dir={isAr ? "rtl" : "ltr"}
            />
            <div className="px-3" style={{ color: "var(--color-text-muted)" }}>
              <Search size={16} />
            </div>
          </div>
        </div>
      </section>

      {/* Stores Grid */}
      <section className="section-spacing">
        <div className="container-main">
          {/* Trust Guarantee Banner */}
          <div
            className="p-3.5 rounded-lg border mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            style={{
              backgroundColor: "rgba(196, 147, 63, 0.06)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} style={{ color: "var(--color-accent)" }} className="shrink-0" />
              <span className="font-medium" style={{ color: "var(--color-text)" }}>
                {isAr
                  ? "جميع المتاجر في هذا الدليل خاضعة للتحقق من السجل التجاري وشهادة التوثيق الضريبي."
                  : "All merchants listed have undergone commercial registration and VAT compliance verification."}
              </span>
            </div>
            <Link
              href="/sell"
              className="font-semibold text-xs hover:underline shrink-0"
              style={{ color: "var(--color-accent)" }}
            >
              {isAr ? "سجّل متجرك معنا ←" : "Register your store →"}
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredStores.map((store) => (
              <Link
                key={store.id}
                href={`/seller/${store.slug}`}
                className="group rounded-lg border overflow-hidden flex flex-col justify-between transition-all hover:shadow-md"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border-light)",
                }}
              >
                <div>
                  {/* Banner */}
                  <div className="h-28 relative overflow-hidden bg-neutral-900">
                    {store.coverImageUrl ? (
                      <img
                        src={store.coverImageUrl}
                        alt={isAr ? store.name : store.nameEn || store.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.src = `/api/placeholder?cat=${store.category}&title=${encodeURIComponent(isAr ? store.name : store.nameEn || store.name)}&w=800&h=300`;
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
                    <div className="absolute top-2.5 end-2.5 flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/95 text-neutral-900 shadow-sm">
                      <ShieldCheck size={12} style={{ color: "var(--color-accent)" }} />
                      <span>{isAr ? "موثق رسمي" : "Verified"}</span>
                    </div>
                  </div>

                  {/* Store Info */}
                  <div className="p-4 -mt-8 relative z-10">
                    {/* Logo Avatar */}
                    <div
                      className="w-14 h-14 rounded-md overflow-hidden flex items-center justify-center text-lg font-bold mb-2.5 shadow-sm bg-white dark:bg-neutral-900 border-2"
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

                    <h3 className="font-semibold text-sm mb-1 group-hover:underline" style={{ color: "var(--color-text)" }}>
                      {isAr ? store.name : store.nameEn || store.name}
                    </h3>

                    <p className="text-xs line-clamp-2 mb-3 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                      {isAr ? store.description : store.descriptionEn || store.description}
                    </p>

                    {/* Stats & Rating */}
                    <div className="flex items-center justify-between text-xs pt-2.5 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                      <div className="flex items-center gap-1 text-amber-500 font-semibold text-[11px]">
                        <Star size={12} className="fill-amber-500" />
                        <span>4.9</span>
                        <span className="font-normal text-neutral-400">
                          (98 {isAr ? "تقييم" : "reviews"})
                        </span>
                      </div>

                      <span className="font-medium text-xs" style={{ color: "var(--color-accent)" }}>
                        {store.productCount} {isAr ? "منتج" : "items"}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="px-4 py-2.5 border-t text-xs font-semibold flex items-center justify-between transition-colors"
                  style={{
                    borderColor: "var(--color-border-light)",
                    color: "var(--color-text)",
                  }}
                >
                  <span>{isAr ? "زيارة المتجر" : "Visit Storefront"}</span>
                  <ArrowIcon size={13} style={{ color: "var(--color-accent)" }} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
