"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Phone,
  Mail,
  Calendar,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { getPropertyBySlug } from "@/lib/data/demo-data";
import { formatPrice } from "@/lib/utils";

export default function PropertyDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";
  const nl = isAr ? "ar-SA" : "en-US";
  const property = getPropertyBySlug(slug);
  const displayTitle = property ? (isAr ? property.title : property.titleEn || property.title) : "";
  const fallbackUrl = property ? `/api/placeholder?cat=real-estate&title=${encodeURIComponent(displayTitle)}&w=1200&h=675` : "";
  const [imgSrc, setImgSrc] = useState(property?.images?.[0]?.url || fallbackUrl);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  if (!property) {
    return (
      <div className="section-spacing">
        <div className="container-main text-center py-16">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            {t("errors.pageNotFound")}
          </h1>
          <Link
            href="/real-estate"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--color-accent)" }}
          >
            {t("categories.realEstate")}
          </Link>
        </div>
      </div>
    );
  }

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }, 600);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="py-3 border-b" style={{ borderColor: "var(--color-border-light)" }}>
        <div className="container-main flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <Link href="/" className="hover:underline">{t("nav.home")}</Link>
          <span>/</span>
          <Link href="/real-estate" className="hover:underline">{t("nav.realEstate")}</Link>
          <span>/</span>
          <span className="truncate max-w-xs" style={{ color: "var(--color-text)" }}>
            {isAr ? property.title : property.titleEn || property.title}
          </span>
        </div>
      </nav>

      <section className="section-spacing">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Media Gallery / Hero */}
              <div
                className="aspect-video rounded-lg overflow-hidden border relative bg-neutral-100 dark:bg-neutral-900"
                style={{ borderColor: "var(--color-border-light)" }}
              >
                <img
                  src={imgSrc}
                  alt={displayTitle}
                  className="w-full h-full object-cover"
                  onError={() => {
                    if (imgSrc !== fallbackUrl) {
                      setImgSrc(fallbackUrl);
                    }
                  }}
                />
                <div className="absolute top-4 start-4 flex items-center gap-2">
                  <span
                    className="px-3 py-1 rounded text-xs font-semibold uppercase tracking-wider text-white"
                    style={{
                      backgroundColor: property.listingMode === "SALE" ? "var(--color-primary)" : "var(--color-accent)",
                    }}
                  >
                    {property.listingMode === "SALE" ? t("realEstate.forSale") : t("realEstate.forRent")}
                  </span>
                  <span
                    className="px-2.5 py-1 rounded text-[10px] font-medium bg-black/60 backdrop-blur-sm text-white"
                  >
                    {property.propertyType}
                  </span>
                </div>
              </div>

              {/* Title & Location Header */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span
                    className="text-2xl md:text-3xl font-bold tracking-tight"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {formatPrice(property.price.amount, property.price.currency, nl)}
                    {property.pricePeriod && (
                      <span className="text-sm font-normal ms-1" style={{ color: "var(--color-text-muted)" }}>
                        {property.pricePeriod === "MONTHLY"
                          ? t("realEstate.pricePerMonth")
                          : t("realEstate.pricePerYear")}
                      </span>
                    )}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium border"
                    style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-muted)" }}
                  >
                    <ShieldCheck size={14} style={{ color: "var(--color-accent)" }} />
                    {isAr ? "معلن موثق" : "Verified Broker"}
                  </span>
                </div>

                <h1 className="text-xl md:text-2xl font-bold mb-3" style={{ color: "var(--color-text)" }}>
                  {isAr ? property.title : property.titleEn || property.title}
                </h1>

                <div className="flex items-center gap-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  <MapPin size={16} style={{ color: "var(--color-accent)" }} />
                  <span>{property.location}, {property.city}</span>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  property.bedrooms != null && {
                    icon: <BedDouble size={20} strokeWidth={1.5} />,
                    label: t("realEstate.bedrooms"),
                    value: property.bedrooms,
                  },
                  property.bathrooms != null && {
                    icon: <Bath size={20} strokeWidth={1.5} />,
                    label: t("realEstate.bathrooms"),
                    value: property.bathrooms,
                  },
                  {
                    icon: <Maximize size={20} strokeWidth={1.5} />,
                    label: t("realEstate.area"),
                    value: `${property.area} ${t("realEstate.sqm")}`,
                  },
                  {
                    icon: <Calendar size={20} strokeWidth={1.5} />,
                    label: isAr ? "التأثيث" : "Furnishing",
                    value: property.furnished ? t("realEstate.furnished") : t("realEstate.unfurnished"),
                  },
                ]
                  .filter(Boolean)
                  .map((spec, i) =>
                    spec ? (
                      <div
                        key={i}
                        className="p-4 rounded-lg text-center border"
                        style={{
                          borderColor: "var(--color-border-light)",
                          backgroundColor: "var(--color-surface-elevated)",
                        }}
                      >
                        <div className="mb-2 flex justify-center" style={{ color: "var(--color-accent)" }}>
                          {spec.icon}
                        </div>
                        <div className="text-[11px] mb-1" style={{ color: "var(--color-text-muted)" }}>
                          {spec.label}
                        </div>
                        <div className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>
                          {spec.value}
                        </div>
                      </div>
                    ) : null
                  )}
              </div>

              {/* Description */}
              <div
                className="p-6 rounded-lg border"
                style={{
                  borderColor: "var(--color-border-light)",
                  backgroundColor: "var(--color-surface-elevated)",
                }}
              >
                <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
                  {t("product.description")}
                </h2>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {isAr ? property.description : property.descriptionEn || property.description}
                </p>
              </div>

              {/* Features */}
              {property.features.length > 0 && (
                <div
                  className="p-6 rounded-lg border"
                  style={{
                    borderColor: "var(--color-border-light)",
                    backgroundColor: "var(--color-surface-elevated)",
                  }}
                >
                  <h2 className="text-base font-semibold mb-3" style={{ color: "var(--color-text)" }}>
                    {t("realEstate.propertyFeatures")}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((f, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-md text-xs border"
                        style={{
                          borderColor: "var(--color-border)",
                          backgroundColor: "var(--color-surface)",
                          color: "var(--color-text)",
                        }}
                      >
                        ✓ {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar — Inquiry Form */}
            <div>
              <div
                className="rounded-lg border p-6 sticky top-24"
                style={{
                  borderColor: "var(--color-border-light)",
                  backgroundColor: "var(--color-surface-elevated)",
                }}
              >
                <div className="flex items-center justify-between mb-4 pb-3 border-b" style={{ borderColor: "var(--color-border-light)" }}>
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                      {t("realEstate.inquiryForm")}
                    </h3>
                    <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                      {isAr ? "تواصل مباشر مع المعلن المعتمد" : "Direct inquiry with verified broker"}
                    </p>
                  </div>
                  <Building2 size={24} style={{ color: "var(--color-accent)" }} />
                </div>

                {formSubmitted ? (
                  <div
                    className="p-6 text-center rounded-lg border"
                    style={{
                      borderColor: "var(--color-border-light)",
                      backgroundColor: "var(--color-surface-alt)",
                    }}
                  >
                    <CheckCircle2
                      size={40}
                      className="mx-auto mb-3"
                      style={{ color: "var(--color-accent)" }}
                    />
                    <h4 className="font-semibold text-sm mb-1" style={{ color: "var(--color-text)" }}>
                      {isAr ? "تم إرسال استفسارك بنجاح" : "Inquiry Sent Successfully"}
                    </h4>
                    <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                      {isAr
                        ? "سيتواصل معك ممثل العقار عبر الهاتف أو البريد الإلكتروني في أقرب وقت."
                        : "The property representative will reach out to you shortly."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs font-medium underline"
                      style={{ color: "var(--color-accent)" }}
                    >
                      {isAr ? "إرسال استفسار آخر" : "Send another inquiry"}
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                        {isAr ? "الاسم بالكامل *" : "Full Name *"}
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={isAr ? "مثال: عبدالله الشمري" : "e.g. John Doe"}
                        className="w-full px-3 py-2 rounded-md border text-xs outline-none"
                        style={{
                          borderColor: "var(--color-border)",
                          backgroundColor: "var(--color-surface)",
                          color: "var(--color-text)",
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                        {isAr ? "البريد الإلكتروني *" : "Email Address *"}
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="user@example.com"
                        dir="ltr"
                        className="w-full px-3 py-2 rounded-md border text-xs outline-none"
                        style={{
                          borderColor: "var(--color-border)",
                          backgroundColor: "var(--color-surface)",
                          color: "var(--color-text)",
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                        {isAr ? "رقم الجوال" : "Phone Number"}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+966 50 000 0000"
                        dir="ltr"
                        className="w-full px-3 py-2 rounded-md border text-xs outline-none"
                        style={{
                          borderColor: "var(--color-border)",
                          backgroundColor: "var(--color-surface)",
                          color: "var(--color-text)",
                        }}
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                        {isAr ? "نص الاستفسار *" : "Message *"}
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={
                          isAr
                            ? "أرغب في الاستفسار عن توفر موعد لمعاينة العقار وسعر البيع النهائي..."
                            : "I'd like to schedule a viewing and inquire about the final price..."
                        }
                        className="w-full px-3 py-2 rounded-md border text-xs resize-none outline-none"
                        style={{
                          borderColor: "var(--color-border)",
                          backgroundColor: "var(--color-surface)",
                          color: "var(--color-text)",
                        }}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-90 disabled:opacity-50"
                      style={{
                        backgroundColor: "var(--color-primary)",
                        color: "var(--color-primary-foreground)",
                      }}
                    >
                      <Mail size={14} />
                      {isSubmitting
                        ? isAr
                          ? "جاري الإرسال..."
                          : "Sending..."
                        : t("common.sendInquiry")}
                    </button>

                    <a
                      href="tel:+966500000001"
                      className="w-full py-2.5 rounded-md text-xs font-medium flex items-center justify-center gap-2 border cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    >
                      <Phone size={14} />
                      {t("realEstate.contactAgent")}
                    </a>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
