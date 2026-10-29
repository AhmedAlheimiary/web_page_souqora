import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import {
  Building2,
  Car,
  Smartphone,
  Shirt,
  Sofa,
  Sparkles,
  Gamepad2,
  HeartPulse,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { demoCategories } from "@/lib/data/demo-data";

const categoryIcons: Record<string, React.ReactNode> = {
  "real-estate": <Building2 size={24} />,
  vehicles: <Car size={24} />,
  electronics: <Smartphone size={24} />,
  fashion: <Shirt size={24} />,
  "home-living": <Sofa size={24} />,
  "beauty-accessories": <Sparkles size={24} />,
  gaming: <Gamepad2 size={24} />,
  healthcare: <HeartPulse size={24} />,
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t("categories.title"),
    description: t("home.featuredCategoriesDesc"),
  };
}

export default function CategoriesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <div>
      {/* Page Header — Clean Editorial Deep Charcoal */}
      <section
        className="py-14 md:py-20 text-white relative overflow-hidden"
        style={{
          backgroundColor: "var(--color-primary)",
        }}
      >
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 30% 50%, rgba(196,147,63,0.3) 0%, transparent 60%)",
          }}
        />
        <div className="container-main relative z-10 text-center max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-4 border"
            style={{
              borderColor: "rgba(255,255,255,0.15)",
              color: "var(--color-accent)",
            }}
          >
            <span>{isRtl ? "دليل الفئات المعتمد" : "Marketplace Directory"}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-4">
            {t("categories.title")}
          </h1>
          <p className="text-sm md:text-base text-white/70 leading-relaxed font-normal">
            {t("home.featuredCategoriesDesc")}
          </p>
        </div>
      </section>

      {/* Categories Grid — Refined editorial cards */}
      <section className="section-spacing">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {demoCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className="group relative rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl aspect-[4/3] flex flex-col justify-end p-5 border"
                style={{
                  borderColor: "var(--color-border-light)",
                  backgroundColor: "var(--color-surface-elevated)",
                }}
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

                {/* Ambient dark gradient vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent transition-opacity" />

                {/* Content */}
                <div className="relative z-10 text-white">
                  <div
                    className="mb-3 w-10 h-10 rounded-md flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.15)",
                      backdropFilter: "blur(4px)",
                      color: "var(--color-accent-light)",
                    }}
                  >
                    {categoryIcons[cat.slug]}
                  </div>

                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold">
                      {locale === "ar" ? cat.name : cat.nameEn}
                    </h3>
                    <ArrowIcon
                      size={16}
                      className="opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5"
                      style={{ color: "var(--color-accent)" }}
                    />
                  </div>

                  <p className="text-xs text-white/70 line-clamp-2 leading-relaxed mb-3">
                    {locale === "ar" ? cat.description : cat.descriptionEn}
                  </p>

                  <div>
                    {cat.listingType === "INQUIRY" ? (
                      <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-blue-500/80 text-white">
                        {isRtl ? "استفسار ومعاينة" : "Inquiry & Viewing"}
                      </span>
                    ) : cat.listingType === "RESTRICTED" ? (
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        {isRtl ? "فئة مرخصة ومعتمدة" : "Licensed & Regulated"}
                      </span>
                    ) : (
                      <span
                        className="text-[10px] font-medium px-2 py-0.5 rounded text-white"
                        style={{ backgroundColor: "var(--color-accent)" }}
                      >
                        {isRtl ? "شراء فوري مباشر" : "Direct Buy"}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
