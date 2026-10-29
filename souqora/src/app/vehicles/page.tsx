"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Car, MapPin, Gauge, Phone, Calendar, Settings2 } from "lucide-react";
import { demoVehicles } from "@/lib/data/demo-data";
import { formatPrice, formatNumber } from "@/lib/utils";
import { InquiryModal } from "@/components/common/inquiry-modal";
import type { VehicleListing } from "@/types";

function VehicleCard({
  vehicle,
  locale,
  onContact,
}: {
  vehicle: VehicleListing & { isDemo: boolean };
  locale: string;
  onContact: () => void;
}) {
  const t = useTranslations();
  const nl = locale === "ar" ? "ar-SA" : "en-US";
  const displayTitle = locale === "ar" ? vehicle.title : vehicle.titleEn || vehicle.title;
  const fallbackUrl = `/api/placeholder?cat=vehicles&title=${encodeURIComponent(displayTitle)}`;
  const [imgSrc, setImgSrc] = useState(vehicle.images?.[0]?.url || fallbackUrl);

  return (
    <article
      className="rounded-lg overflow-hidden border transition-all hover:shadow-md"
      style={{
        backgroundColor: "var(--color-surface-elevated)",
        borderColor: "var(--color-border-light)",
      }}
    >
      <Link href={`/vehicle/${vehicle.slug}`} className="block relative aspect-video overflow-hidden group">
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
            backgroundColor: vehicle.condition === "NEW" ? "var(--color-success)" : "var(--color-primary)",
          }}
        >
          {vehicle.condition === "NEW" ? t("vehicles.newCondition") : t("vehicles.usedCondition")}
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
          <Link href={`/vehicle/${vehicle.slug}`}>
            <h3
              className="font-semibold line-clamp-2 leading-relaxed transition-colors hover:text-[#C4933F]"
              style={{
                color: "var(--color-text)",
                fontSize: "0.875rem",
                lineHeight: "1.45",
                marginBottom: "0.5rem",
              }}
            >
              {locale === "ar" ? vehicle.title : vehicle.titleEn || vehicle.title}
            </h3>
          </Link>

          {/* Location row */}
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
            <span className="truncate">{vehicle.location}</span>
          </div>

          {/* Details / Specs — Spacious Pills */}
          <div
            className="flex flex-wrap items-center gap-2 text-xs"
            style={{
              marginTop: "0.5rem",
              marginBottom: "0.875rem",
            }}
          >
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium"
              style={{
                backgroundColor: "var(--color-surface-alt)",
                border: "1px solid var(--color-border-light)",
                color: "var(--color-text)",
              }}
            >
              <Calendar size={12} style={{ color: "var(--color-accent)" }} />
              <span>{vehicle.year}</span>
            </span>

            {vehicle.mileage != null && vehicle.mileage > 0 && (
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium"
                style={{
                  backgroundColor: "var(--color-surface-alt)",
                  border: "1px solid var(--color-border-light)",
                  color: "var(--color-text)",
                }}
              >
                <Gauge size={12} style={{ color: "var(--color-accent)" }} />
                <span>{formatNumber(vehicle.mileage, nl)} {t("vehicles.km")}</span>
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
              <Settings2 size={12} style={{ color: "var(--color-accent)" }} />
              <span>{vehicle.transmission === "AUTOMATIC" ? t("vehicles.automatic") : t("vehicles.manual")}</span>
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
              {formatPrice(vehicle.price.amount, vehicle.price.currency, nl)}
            </span>
          </div>

          <button
            type="button"
            onClick={onContact}
            className="w-full py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            <Phone size={13} />
            {t("common.contactSeller")}
          </button>
        </div>
      </div>
    </article>
  );
}

export default function VehiclesPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [selectedVehicle, setSelectedVehicle] = useState<(VehicleListing & { isDemo: boolean }) | null>(null);

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
            <Car size={24} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("categories.vehicles")}</h1>
          <p className="text-sm text-white/60">{t("categories.vehiclesDesc")}</p>
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

                {/* Condition */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    {locale === "ar" ? "الحالة" : "Condition"}
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border text-sm"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                  >
                    <option value="">{locale === "ar" ? "الكل" : "All"}</option>
                    <option value="NEW">{t("vehicles.newCondition")}</option>
                    <option value="USED">{t("vehicles.usedCondition")}</option>
                  </select>
                </div>

                {/* Make */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    {t("vehicles.make")}
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border text-sm"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                  >
                    <option value="">{locale === "ar" ? "الكل" : "All"}</option>
                    <option>Toyota</option>
                    <option>Hyundai</option>
                    <option>Lexus</option>
                    <option>Mercedes-Benz</option>
                    <option>BMW</option>
                    <option>Nissan</option>
                    <option>Ford</option>
                    <option>Tesla</option>
                  </select>
                </div>

                {/* Year Range */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    {t("vehicles.year")}
                  </label>
                  <div className="flex gap-2">
                    <input type="number" placeholder="2020" className="w-1/2 px-3 py-2 rounded-md border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} />
                    <input type="number" placeholder="2026" className="w-1/2 px-3 py-2 rounded-md border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} />
                  </div>
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

                {/* Transmission */}
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text-muted)" }}>
                    {t("vehicles.transmission")}
                  </label>
                  <select
                    className="w-full px-3 py-2 rounded-md border text-sm"
                    style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                  >
                    <option value="">{locale === "ar" ? "الكل" : "All"}</option>
                    <option value="AUTOMATIC">{t("vehicles.automatic")}</option>
                    <option value="MANUAL">{t("vehicles.manual")}</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Grid */}
            <div className="flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {demoVehicles.map((v) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    locale={locale}
                    onContact={() => setSelectedVehicle(v)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Modal */}
      {selectedVehicle && (
        <InquiryModal
          isOpen={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          itemType="vehicle"
          itemId={selectedVehicle.id}
          itemTitle={locale === "ar" ? selectedVehicle.title : selectedVehicle.titleEn || selectedVehicle.title}
          sellerName={selectedVehicle.seller?.storeName}
        />
      )}
    </div>
  );
}
