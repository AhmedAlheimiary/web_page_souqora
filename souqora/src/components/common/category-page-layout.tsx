"use client";

import { useTranslations, useLocale } from "next-intl";
import { ProductCard } from "@/components/common/product-card";
import type { Product } from "@/types";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "range" | "checkbox";
  options?: FilterOption[];
}

interface CategoryPageLayoutProps {
  icon: React.ReactNode;
  gradient: string;
  titleKey: string;
  descKey: string;
  filters: FilterConfig[];
  products: (Product & { isDemo: boolean })[];
  disclaimer?: React.ReactNode;
}

export function CategoryPageLayout({
  icon,
  gradient,
  titleKey,
  descKey,
  filters,
  products,
  disclaimer,
}: CategoryPageLayoutProps) {
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div>
      {/* Category Header — clean, no excessive gradient */}
      <section
        className="py-10 md:py-14"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="container-main">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: "rgba(196, 147, 63, 0.15)", color: "var(--color-accent)" }}
            >
              {icon}
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-white mb-0.5">{t(titleKey)}</h1>
              <p className="text-sm text-white/50">{t(descKey)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer if present */}
      {disclaimer}

      {/* Content */}
      <section className="section-spacing">
        <div className="container-main">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full lg:w-60 shrink-0">
              <div
                className="rounded-lg border p-4 space-y-4"
                style={{ backgroundColor: "var(--color-surface-elevated)", borderColor: "var(--color-border)" }}
              >
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  {t("search.filters")}
                </h3>

                {filters.map((filter) => (
                  <div key={filter.key}>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                      {filter.label}
                    </label>
                    {filter.type === "select" && filter.options && (
                      <select
                        className="w-full px-3 py-2 rounded-md border text-sm"
                        style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                      >
                        <option value="">{locale === "ar" ? "الكل" : "All"}</option>
                        {filter.options.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    )}
                    {filter.type === "range" && (
                      <div className="flex gap-2">
                        <input type="number" placeholder={t("common.from")} className="w-1/2 px-3 py-2 rounded-md border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} />
                        <input type="number" placeholder={t("common.to")} className="w-1/2 px-3 py-2 rounded-md border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} />
                      </div>
                    )}
                    {filter.type === "checkbox" && filter.options && (
                      <div className="space-y-1.5">
                        {filter.options.map((opt) => (
                          <label key={opt.value} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: "var(--color-text)" }}>
                            <input type="checkbox" className="rounded" />
                            {opt.label}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Price Range — always present */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    {t("search.priceRange")}
                  </label>
                  <div className="flex gap-2">
                    <input type="number" placeholder={t("common.from")} className="w-1/2 px-3 py-2 rounded-md border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} />
                    <input type="number" placeholder={t("common.to")} className="w-1/2 px-3 py-2 rounded-md border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>{t("search.sortBy")}</label>
                  <select className="w-full px-3 py-2 rounded-md border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}>
                    <option value="relevance">{t("search.relevance")}</option>
                    <option value="price_asc">{t("search.priceLowToHigh")}</option>
                    <option value="price_desc">{t("search.priceHighToLow")}</option>
                    <option value="newest">{t("search.newest")}</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {products.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} isDemo={p.isDemo} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 rounded-lg" style={{ backgroundColor: "var(--color-surface-alt)" }}>
                  <div className="mx-auto mb-4 opacity-20 flex justify-center">{icon}</div>
                  <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>
                    {t("common.noResults")}
                  </h3>
                  <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                    {locale === "ar" ? "لا توجد منتجات في هذه الفئة حالياً" : "No products in this category yet"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
