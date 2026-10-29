"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Search as SearchIcon } from "lucide-react";
import { ProductCard } from "@/components/common/product-card";
import { demoProducts, demoCategories } from "@/lib/data/demo-data";

function SearchContent() {
  const t = useTranslations();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";

  const isRtl = locale === "ar";
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("relevance");

  const filteredProducts = demoProducts.filter((p) => {
    const matchesQuery =
      !query ||
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      (p.titleEn && p.titleEn.toLowerCase().includes(query.toLowerCase()));
    const matchesCategory = !selectedCategory || p.categorySlug === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price_asc") return a.price.amount - b.price.amount;
    if (sortBy === "price_desc") return b.price.amount - a.price.amount;
    if (sortBy === "newest")
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return 0;
  });

  return (
    <div>
      {/* Search Header */}
      <section
        className="py-8 md:py-12 border-b"
        style={{
          backgroundColor: "var(--color-primary)",
        }}
      >
        <div className="container-main max-w-3xl">
          <h1 className="text-xl md:text-2xl font-bold mb-3 text-white">
            {t("search.title")}
          </h1>
          <div
            className="flex rounded-md overflow-hidden border shadow-sm"
            style={{
              borderColor: "rgba(255, 255, 255, 0.2)",
              backgroundColor: "var(--color-surface-elevated)",
            }}
          >
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("common.searchPlaceholder")}
              className="flex-1 px-4 py-2.5 text-xs outline-none"
              style={{
                backgroundColor: "transparent",
                color: "var(--color-text)",
                fontFamily: "inherit",
              }}
              dir={isRtl ? "rtl" : "ltr"}
            />
            <button
              className="px-4 flex items-center justify-center transition-colors"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-accent-foreground)",
              }}
              aria-label={t("common.search")}
            >
              <SearchIcon size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-spacing">
        <div className="container-main">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Filters Sidebar */}
            <aside className="w-full lg:w-60 shrink-0">
              <div
                className="rounded-lg border p-4 space-y-4"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border)",
                }}
              >
                <h3
                  className="font-semibold text-xs"
                  style={{ color: "var(--color-text)" }}
                >
                  {t("search.filters")}
                </h3>

                {/* Category Filter */}
                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t("nav.categories")}
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border text-xs"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                      fontFamily: "inherit",
                    }}
                  >
                    <option value="">{t("nav.allCategories")}</option>
                    {demoCategories
                      .filter((c) => c.listingType === "CART")
                      .map((cat) => (
                        <option key={cat.slug} value={cat.slug}>
                          {locale === "ar" ? cat.name : cat.nameEn}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t("search.priceRange")}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder={t("common.from")}
                      className="w-1/2 px-3 py-2 rounded-md border text-xs"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-text)",
                        fontFamily: "inherit",
                      }}
                    />
                    <input
                      type="number"
                      placeholder={t("common.to")}
                      className="w-1/2 px-3 py-2 rounded-md border text-xs"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-text)",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label
                    className="block text-xs font-medium mb-1.5"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t("search.sortBy")}
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border text-xs"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                      fontFamily: "inherit",
                    }}
                  >
                    <option value="relevance">{t("search.relevance")}</option>
                    <option value="price_asc">{t("search.priceLowToHigh")}</option>
                    <option value="price_desc">{t("search.priceHighToLow")}</option>
                    <option value="newest">{t("search.newest")}</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Results Grid */}
            <div className="flex-1">
              {query && (
                <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                  {t("search.resultsFor")}: &ldquo;{query}&rdquo; ({sortedProducts.length})
                </p>
              )}

              {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isDemo={product.isDemo}
                    />
                  ))}
                </div>
              ) : (
                <div
                  className="text-center py-16 rounded-lg"
                  style={{ backgroundColor: "var(--color-surface-alt)" }}
                >
                  <SearchIcon
                    size={40}
                    className="mx-auto mb-3 opacity-20"
                    style={{ color: "var(--color-text)" }}
                  />
                  <h3
                    className="text-base font-semibold mb-1.5"
                    style={{ color: "var(--color-text)" }}
                  >
                    {t("search.noResults")}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {t("search.noResultsDesc")}
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

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="section-spacing text-center">
          <div className="container-main py-16">
            <div
              className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 mb-4"
              style={{ borderColor: "var(--color-accent)" }}
            />
            <p className="text-xs opacity-60">جاري تحميل نتائج البحث...</p>
          </div>
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
