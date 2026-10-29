"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Building2, MapPin, BedDouble, Bath, Maximize, Phone } from "lucide-react";
import { demoProperties } from "@/lib/data/demo-data";
import { formatPrice } from "@/lib/utils";
import { InquiryModal } from "@/components/common/inquiry-modal";
import type { PropertyListing } from "@/types";

function PropertyCard({
  property,
  locale,
  onContact,
}: {
  property: PropertyListing & { isDemo: boolean };
  locale: string;
  onContact: () => void;
}) {
  const t = useTranslations();
  const numberLocale = locale === "ar" ? "ar-SA" : "en-US";
  const displayTitle = locale === "ar" ? property.title : property.titleEn || property.title;
  const fallbackUrl = `/api/placeholder?cat=real-estate&title=${encodeURIComponent(displayTitle)}`;
  const [imgSrc, setImgSrc] = useState(property.images?.[0]?.url || fallbackUrl);

  return (
    <article
      className="rounded-lg overflow-hidden border transition-all hover:shadow-md"
      style={{
        backgroundColor: "var(--color-surface-elevated)",
        borderColor: "var(--color-border-light)",
      }}
    >
      <Link href={`/property/${property.slug}`} className="block relative aspect-video overflow-hidden group">
        <img
          src={imgSrc}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={() => {
            if (imgSrc !== fallbackUrl) {
              setImgSrc(fallbackUrl);
            }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-50 group-hover:opacity-80 transition-opacity" />
        <span
          className="absolute top-2.5 start-2.5 px-2.5 py-0.5 rounded text-[11px] font-semibold text-white shadow-sm"
          style={{
            backgroundColor: property.listingMode === "SALE" ? "var(--color-primary)" : "var(--color-accent-alt)",
          }}
        >
          {property.listingMode === "SALE" ? t("realEstate.forSale") : t("realEstate.forRent")}
        </span>
        <span
          className="absolute top-2.5 end-2.5 px-2 py-0.5 rounded text-[9px] font-medium opacity-85"
          style={{ backgroundColor: "var(--color-warning)", color: "#fff" }}
        >
          {t("common.demoData")}
        </span>
      </Link>

      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          <Link href={`/property/${property.slug}`}>
            <h3
              className="font-semibold line-clamp-2 leading-relaxed transition-colors hover:text-[#C4933F]"
              style={{
                color: "var(--color-text)",
                fontSize: "0.875rem",
                lineHeight: "1.45",
                marginBottom: "0.5rem",
              }}
            >
              {locale === "ar" ? property.title : property.titleEn || property.title}
            </h3>
          </Link>

          <div
            className="flex items-center gap-1.5 text-xs"
            style={{
              color: "var(--color-text-muted)",
              fontSize: "0.75rem",
              lineHeight: "1.4",
              marginBottom: "0.75rem",
            }}
          >
            <MapPin size={13} className="shrink-0" style={{ color: "var(--color-accent)" }} />
            <span className="truncate">{property.location}، {property.city}</span>
          </div>

          {/* Details / Specs Row — Well-spaced Pills */}
          <div
            className="flex flex-wrap items-center gap-2 text-xs"
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.875rem",
            }}
          >
            {property.bedrooms != null && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium"
                style={{
                  backgroundColor: "var(--color-surface-alt)",
                  border: "1px solid var(--color-border-light)",
                  color: "var(--color-text)",
                }}
              >
                <BedDouble size={13} style={{ color: "var(--color-accent)" }} />
                <span>{property.bedrooms} {locale === "ar" ? "غرف" : "beds"}</span>
              </span>
            )}
            {property.bathrooms != null && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium"
                style={{
                  backgroundColor: "var(--color-surface-alt)",
                  border: "1px solid var(--color-border-light)",
                  color: "var(--color-text)",
                }}
              >
                <Bath size={13} style={{ color: "var(--color-accent)" }} />
                <span>{property.bathrooms} {locale === "ar" ? "حمامات" : "baths"}</span>
              </span>
            )}
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium"
              style={{
                backgroundColor: "var(--color-surface-alt)",
                border: "1px solid var(--color-border-light)",
                color: "var(--color-text)",
              }}
            >
              <Maximize size={13} style={{ color: "var(--color-accent)" }} />
              <span>{property.area} {t("realEstate.sqm")}</span>
            </span>
          </div>
        </div>

        <div>
          {/* Price — Clearly Separated */}
          <div
            className="flex items-baseline justify-between pt-2.5"
            style={{
              borderTop: "1px solid var(--color-border-light)",
              marginBottom: "0.75rem",
            }}
          >
            <span
              className="text-sm sm:text-base font-bold"
              style={{ color: "var(--color-text)", fontSize: "0.95rem" }}
            >
              {formatPrice(property.price.amount, property.price.currency, numberLocale)}
              {property.pricePeriod && (
                <span className="text-xs font-normal" style={{ color: "var(--color-text-muted)" }}>
                  {" "}{property.pricePeriod === "MONTHLY" ? t("realEstate.pricePerMonth") : t("realEstate.pricePerYear")}
                </span>
              )}
            </span>
          </div>

          <button
            type="button"
            onClick={onContact}
            className="w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            <Phone size={13} />
            {t("realEstate.contactAgent")}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function RealEstatePage() {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedProperty, setSelectedProperty] = useState<(PropertyListing & { isDemo: boolean }) | null>(null);

  return (
    <div>
      {/* Editorial Header */}
      <section
        className="py-12 md:py-16 text-white relative overflow-hidden"
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className="container-main relative z-10 text-center max-w-2xl mx-auto">
          <div
            className="w-12 h-12 rounded-md mx-auto mb-3 flex items-center justify-center"
            style={{ backgroundColor: "rgba(196, 147, 63, 0.15)", color: "var(--color-accent)" }}
          >
            <Building2 size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("categories.realEstate")}</h1>
          <p className="text-sm text-white/60">{t("categories.realEstateDesc")}</p>
        </div>
      </section>

      <section className="section-spacing">
        <div className="container-main">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Filters */}
            <aside className="w-full lg:w-64 shrink-0">
              <div
                className="rounded-lg border p-4 space-y-4"
                style={{ backgroundColor: "var(--color-surface-elevated)", borderColor: "var(--color-border)" }}
              >
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                  {t("search.filters")}
                </h3>

                {/* Listing Mode */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    {locale === "ar" ? "نوع الإعلان" : "Listing Type"}
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border text-sm"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                  >
                    <option value="">{locale === "ar" ? "الكل" : "All"}</option>
                    <option value="SALE">{t("realEstate.forSale")}</option>
                    <option value="RENT">{t("realEstate.forRent")}</option>
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    {locale === "ar" ? "نوع العقار" : "Property Type"}
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border text-sm"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                  >
                    <option value="">{locale === "ar" ? "الكل" : "All"}</option>
                    <option>{t("realEstate.apartment")}</option>
                    <option>{t("realEstate.villa")}</option>
                    <option>{t("realEstate.house")}</option>
                    <option>{t("realEstate.land")}</option>
                    <option>{t("realEstate.commercial")}</option>
                    <option>{t("realEstate.office")}</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    {t("realEstate.location")}
                  </label>
                  <input
                    type="text"
                    placeholder={locale === "ar" ? "المدينة أو الحي" : "City or district"}
                    className="w-full px-3 py-2 rounded-md border text-sm"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                  />
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    {t("search.priceRange")}
                  </label>
                  <div className="flex gap-2">
                    <input type="number" placeholder={t("common.from")} className="w-1/2 px-3 py-2 rounded-md border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} />
                    <input type="number" placeholder={t("common.to")} className="w-1/2 px-3 py-2 rounded-md border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} />
                  </div>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    {t("realEstate.bedrooms")}
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border text-sm"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                  >
                    <option value="">{locale === "ar" ? "الكل" : "All"}</option>
                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}+</option>)}
                  </select>
                </div>

                {/* Area */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    {t("realEstate.area")}
                  </label>
                  <div className="flex gap-2">
                    <input type="number" placeholder={t("common.from")} className="w-1/2 px-3 py-2 rounded-md border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} />
                    <input type="number" placeholder={t("common.to")} className="w-1/2 px-3 py-2 rounded-md border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} />
                  </div>
                </div>
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {demoProperties.map((prop) => (
                  <PropertyCard
                    key={prop.id}
                    property={prop}
                    locale={locale}
                    onContact={() => setSelectedProperty(prop)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      {selectedProperty && (
        <InquiryModal
          isOpen={!!selectedProperty}
          onClose={() => setSelectedProperty(null)}
          itemType="property"
          itemId={selectedProperty.id}
          itemTitle={locale === "ar" ? selectedProperty.title : selectedProperty.titleEn || selectedProperty.title}
          sellerName={selectedProperty.seller?.storeName}
        />
      )}
    </div>
  );
}
