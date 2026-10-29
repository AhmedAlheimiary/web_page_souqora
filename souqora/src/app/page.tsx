import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Car,
  Smartphone,
  Shirt,
  Sofa,
  Sparkles,
  Gamepad2,
  HeartPulse,
  Shield,
  Truck,
  RotateCcw,
  Headphones,
  Flame,
  Star,
} from "lucide-react";
import { ProductCard } from "@/components/common/product-card";
import { demoProducts, demoStores, demoCategories } from "@/lib/data/demo-data";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: `${t("brand.name")} — ${t("brand.tagline")}`,
    description: t("home.heroSubtitle"),
  };
}

// ─── Icon map for categories ────────────────
const categoryIcons: Record<string, React.ReactNode> = {
  "real-estate": <Building2 size={22} />,
  vehicles: <Car size={22} />,
  electronics: <Smartphone size={22} />,
  fashion: <Shirt size={22} />,
  "home-living": <Sofa size={22} />,
  "beauty-accessories": <Sparkles size={22} />,
  gaming: <Gamepad2 size={22} />,
  healthcare: <HeartPulse size={22} />,
};

export default function HomePage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const featuredProducts = demoProducts.slice(0, 10);

  return (
    <div>
      {/* ═══════════════════════════════════════════
          HERO — Editorial, typography-forward
          ═══════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        {/* Subtle warm gradient accent */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse at 30% 50%, rgba(196,147,63,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(196,147,63,0.2) 0%, transparent 50%)",
          }}
        />

        <div className="container-main relative z-10">
          <div className="py-16 sm:py-20 md:py-28 lg:py-32 max-w-3xl">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium mb-6 border"
              style={{
                borderColor: "rgba(255,255,255,0.15)",
                color: "var(--color-accent)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              />
              {isRtl ? "منصة التجارة الرائدة ٢٠٢٦" : "The Leading Marketplace 2026"}
            </div>

            <h1
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6"
              style={{ color: "var(--color-primary-foreground)" }}
            >
              {t("home.heroTitle")}
            </h1>

            <p
              className="text-base sm:text-lg md:text-xl leading-relaxed mb-10 max-w-xl font-normal"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              {t("home.heroSubtitle")}
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-md text-sm font-semibold transition-all duration-200 hover:opacity-90"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-accent-foreground)",
                }}
              >
                <span>{t("home.heroCta")}</span>
                <ArrowIcon size={16} />
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-semibold border transition-colors"
                style={{
                  borderColor: "rgba(255,255,255,0.2)",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                {t("home.heroCtaSecondary")}
              </Link>
            </div>

            {/* Micro Stats */}
            <div className="grid grid-cols-3 gap-6 mt-14 pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
              {[
                { value: "10,000+", label: isRtl ? "منتج معتمد" : "Verified Products" },
                { value: "500+", label: isRtl ? "متجر موثق" : "Verified Stores" },
                { value: "100%", label: isRtl ? "حماية مالية" : "Buyer Guarantee" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-xl sm:text-2xl font-bold" style={{ color: "var(--color-accent)" }}>
                    {stat.value}
                  </div>
                  <div className="text-xs mt-1 font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CATEGORIES — Photo-backed grid
          ═══════════════════════════════════════════ */}
      <section className="section-spacing">
        <div className="container-main">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
                {t("home.featuredCategories")}
              </h2>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {t("home.featuredCategoriesDesc")}
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "var(--color-accent)" }}
            >
              {t("common.viewAll")}
              <ArrowIcon size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {demoCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-lg aspect-[4/3] flex flex-col justify-end"
              >
                {/* Background Image */}
                {cat.image && (
                  <img
                    src={cat.image}
                    alt={locale === "ar" ? cat.name : cat.nameEn}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent" />

                {/* Content */}
                <div className="relative z-10 p-4">
                  <div className="mb-2 w-8 h-8 rounded-md bg-white/15 backdrop-blur-sm flex items-center justify-center text-white">
                    {categoryIcons[cat.slug]}
                  </div>
                  <h3 className="text-sm font-bold text-white mb-0.5">
                    {locale === "ar" ? cat.name : cat.nameEn}
                  </h3>
                  <p className="text-[11px] text-white/65 line-clamp-1">
                    {locale === "ar" ? cat.description : cat.descriptionEn}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EDITORIAL PROMOS — 3-column cards
          ═══════════════════════════════════════════ */}
      <section
        className="py-6 md:py-8"
        style={{ backgroundColor: "var(--color-surface-alt)" }}
      >
        <div className="container-main">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Promo 1: Tech */}
            <div
              className="group rounded-lg p-6 flex flex-col justify-between min-h-[200px] relative overflow-hidden"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <div className="relative z-10">
                <span
                  className="inline-block text-[10px] font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--color-accent)" }}
                >
                  {isRtl ? "عروض حصرية" : "Exclusive Deals"}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug mb-1.5">
                  {isRtl ? "هواتف ذكية وحواسب فائقة" : "Smartphones & Ultra Laptops"}
                </h3>
                <p className="text-xs text-white/55 line-clamp-2">
                  {isRtl ? "خصومات تصل إلى 35% مع توصيل سريع" : "Up to 35% off with express delivery"}
                </p>
              </div>
              <div className="relative z-10 mt-4">
                <Link
                  href="/electronics"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-md transition-colors"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-accent-foreground)",
                  }}
                >
                  {isRtl ? "تسوق التقنية" : "Shop Electronics"}
                  <ArrowIcon size={13} />
                </Link>
              </div>
              {/* Subtle accent glow */}
              <div className="absolute -end-12 -bottom-12 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: "var(--color-accent)" }} />
            </div>

            {/* Promo 2: Fashion */}
            <div
              className="group rounded-lg p-6 flex flex-col justify-between min-h-[200px] relative overflow-hidden border"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="relative z-10">
                <span
                  className="inline-block text-[10px] font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--color-accent)" }}
                >
                  {isRtl ? "أناقة سعودية" : "Saudi Couture"}
                </span>
                <h3 className="text-lg font-bold leading-snug mb-1.5" style={{ color: "var(--color-text)" }}>
                  {isRtl ? "ثياب فاخرة وعبايات ملكية" : "Luxury Thobes & Abayas"}
                </h3>
                <p className="text-xs line-clamp-2" style={{ color: "var(--color-text-muted)" }}>
                  {isRtl ? "تصاميم من أحدث الأقمشة بتطريز يدوي" : "Hand-tailored apparel from the finest fabrics"}
                </p>
              </div>
              <div className="relative z-10 mt-4">
                <Link
                  href="/fashion"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-md border transition-colors"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  {isRtl ? "استكشف التشكيلة" : "Explore Collection"}
                  <ArrowIcon size={13} />
                </Link>
              </div>
            </div>

            {/* Promo 3: Real Estate & Cars */}
            <div
              className="group rounded-lg p-6 flex flex-col justify-between min-h-[200px] relative overflow-hidden"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <div className="relative z-10">
                <span
                  className="inline-block text-[10px] font-semibold uppercase tracking-widest mb-3"
                  style={{ color: "var(--color-accent)" }}
                >
                  {isRtl ? "عقارات وسيارات" : "Property & Vehicles"}
                </span>
                <h3 className="text-lg font-bold text-white leading-snug mb-1.5">
                  {isRtl ? "فلل بمسبح خاص وسيارات معتمدة" : "Pool Villas & Inspected Cars"}
                </h3>
                <p className="text-xs text-white/55 line-clamp-2">
                  {isRtl ? "تواصل مباشر مع ملاك العقارات والوكلاء" : "Direct inquiries with licensed brokers & showrooms"}
                </p>
              </div>
              <div className="relative z-10 mt-4">
                <Link
                  href="/real-estate"
                  className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-md transition-colors"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "var(--color-accent-foreground)",
                  }}
                >
                  {isRtl ? "تصفح العقارات" : "Browse Properties"}
                  <ArrowIcon size={13} />
                </Link>
              </div>
              <div className="absolute -end-12 -bottom-12 w-40 h-40 rounded-full opacity-10" style={{ backgroundColor: "var(--color-accent)" }} />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED PRODUCTS
          ═══════════════════════════════════════════ */}
      <section className="section-spacing">
        <div className="container-main">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame size={18} style={{ color: "var(--color-accent-alt)" }} />
                <h2 className="text-xl md:text-2xl font-bold" style={{ color: "var(--color-text)" }}>
                  {t("home.featuredProducts")}
                </h2>
              </div>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {t("home.featuredProductsDesc")}
              </p>
            </div>
            <Link
              href="/search"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: "var(--color-accent)" }}
            >
              {t("common.viewAll")}
              <ArrowIcon size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} isDemo={product.isDemo} />
            ))}
          </div>

          <div className="sm:hidden text-center mt-6">
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-sm font-medium"
              style={{ color: "var(--color-accent)" }}
            >
              {t("common.viewAll")}
              <ArrowIcon size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURED STORES
          ═══════════════════════════════════════════ */}
      <section
        className="section-spacing"
        style={{ backgroundColor: "var(--color-surface-alt)" }}
      >
        <div className="container-main">
          <div className="flex items-end justify-between mb-8 md:mb-10">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-1" style={{ color: "var(--color-text)" }}>
                {t("home.featuredStores")}
              </h2>
              <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                {t("home.featuredStoresDesc")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoStores.map((store) => (
              <Link
                key={store.id}
                href={`/seller/${store.slug}`}
                className="group rounded-lg border overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border)",
                }}
              >
                {/* Cover */}
                <div className="relative h-28 overflow-hidden" style={{ backgroundColor: "var(--color-surface-alt)" }}>
                  {store.coverImageUrl ? (
                    <img
                      src={store.coverImageUrl}
                      alt={locale === "ar" ? store.name : store.nameEn || store.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full" style={{ backgroundColor: "var(--color-primary)" }} />
                  )}
                  {store.verified && (
                    <span
                      className="absolute top-2.5 end-2.5 px-2 py-0.5 rounded text-[10px] font-medium text-white flex items-center gap-1"
                      style={{ backgroundColor: "var(--color-success)" }}
                    >
                      <Star size={10} className="fill-current" />
                      {isRtl ? "موثق" : "Verified"}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4 pt-0 relative flex-1 flex flex-col justify-between">
                  {/* Avatar */}
                  <div className="relative -mt-7 mb-3 flex items-center justify-between">
                    <div
                      className="w-14 h-14 rounded-md overflow-hidden border-2 shadow-sm"
                      style={{
                        borderColor: "var(--color-surface-elevated)",
                        backgroundColor: "var(--color-surface-alt)",
                      }}
                    >
                      {store.logoUrl ? (
                        <img
                          src={store.logoUrl}
                          alt={locale === "ar" ? store.name : store.nameEn || store.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-sm" style={{ color: "var(--color-accent)" }}>
                          {(locale === "ar" ? store.name : store.nameEn || store.name).charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ color: "var(--color-accent)", backgroundColor: "rgba(196,147,63,0.08)" }}>
                      ★ {store.rating || 4.9}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold truncate mb-1" style={{ color: "var(--color-text)" }}>
                      {locale === "ar" ? store.name : store.nameEn || store.name}
                    </h3>
                    <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                      {locale === "ar" ? store.description : store.descriptionEn || store.description}
                    </p>
                  </div>

                  <div
                    className="mt-3 pt-3 border-t flex items-center justify-between text-xs"
                    style={{ borderColor: "var(--color-border-light)" }}
                  >
                    <span style={{ color: "var(--color-text-muted)" }}>
                      {store.productCount} {locale === "ar" ? "منتج" : "products"}
                    </span>
                    <span className="font-medium" style={{ color: "var(--color-accent)" }}>
                      {isRtl ? "زيارة المتجر" : "Visit"} →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST / WHY SOUQORA
          ═══════════════════════════════════════════ */}
      <section className="section-spacing">
        <div className="container-main">
          <h2
            className="text-xl md:text-2xl font-bold text-center mb-10 md:mb-12"
            style={{ color: "var(--color-text)" }}
          >
            {t("home.trustTitle")}
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { icon: <Shield size={24} />, title: t("home.trustSecure"), desc: t("home.trustSecureDesc") },
              { icon: <Truck size={24} />, title: t("home.trustShipping"), desc: t("home.trustShippingDesc") },
              { icon: <RotateCcw size={24} />, title: t("home.trustReturns"), desc: t("home.trustReturnsDesc") },
              { icon: <Headphones size={24} />, title: t("home.trustSupport"), desc: t("home.trustSupportDesc") },
            ].map((item, i) => (
              <div
                key={i}
                className="text-center p-5 md:p-6 rounded-lg border"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border-light)",
                }}
              >
                <div
                  className="w-12 h-12 rounded-md mx-auto mb-3 flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(196,147,63,0.08)",
                    color: "var(--color-accent)",
                  }}
                >
                  {item.icon}
                </div>
                <h3
                  className="text-sm font-semibold mb-1.5"
                  style={{ color: "var(--color-text)" }}
                >
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
