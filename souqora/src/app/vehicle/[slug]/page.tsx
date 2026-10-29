"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  Gauge,
  Fuel,
  Settings2,
  Calendar,
  Phone,
  Mail,
  Car,
  ShieldCheck,
  CheckCircle2,
  FileCheck2,
} from "lucide-react";
import { getVehicleBySlug } from "@/lib/data/demo-data";
import { formatPrice, formatNumber } from "@/lib/utils";

export default function VehicleDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";
  const nl = isAr ? "ar-SA" : "en-US";
  const vehicle = getVehicleBySlug(slug);
  const displayTitle = vehicle ? (isAr ? vehicle.title : vehicle.titleEn || vehicle.title) : "";
  const fallbackUrl = vehicle ? `/api/placeholder?cat=vehicles&title=${encodeURIComponent(displayTitle)}&w=1200&h=675` : "";
  const [imgSrc, setImgSrc] = useState(vehicle?.images?.[0]?.url || fallbackUrl);

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  if (!vehicle) {
    return (
      <div className="section-spacing">
        <div className="container-main text-center py-16">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            {t("errors.pageNotFound")}
          </h1>
          <Link
            href="/vehicles"
            className="text-sm font-medium hover:underline"
            style={{ color: "var(--color-accent)" }}
          >
            {t("categories.vehicles")}
          </Link>
        </div>
      </div>
    );
  }

  const fuelLabels: Record<string, string> = {
    PETROL: isAr ? "بنزين" : "Petrol",
    DIESEL: isAr ? "ديزل" : "Diesel",
    ELECTRIC: isAr ? "كهربائي" : "Electric",
    HYBRID: isAr ? "هايبرد" : "Hybrid",
  };

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
          <Link href="/vehicles" className="hover:underline">{t("nav.vehicles")}</Link>
          <span>/</span>
          <span className="truncate max-w-xs" style={{ color: "var(--color-text)" }}>
            {isAr ? vehicle.title : vehicle.titleEn || vehicle.title}
          </span>
        </div>
      </nav>

      <section className="section-spacing">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Details */}
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
                      backgroundColor: vehicle.condition === "NEW" ? "var(--color-primary)" : "var(--color-accent)",
                    }}
                  >
                    {vehicle.condition === "NEW" ? t("vehicles.newCondition") : t("vehicles.usedCondition")}
                  </span>
                  <span className="px-2.5 py-1 rounded text-[10px] font-medium bg-black/60 backdrop-blur-sm text-white">
                    {vehicle.make} {vehicle.model}
                  </span>
                </div>
              </div>

              {/* Title & Price Header */}
              <div>
                <div className="flex items-center justify-between gap-4 mb-2">
                  <span
                    className="text-2xl md:text-3xl font-bold tracking-tight"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {formatPrice(vehicle.price.amount, vehicle.price.currency, nl)}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-medium border"
                    style={{ borderColor: "var(--color-border-light)", color: "var(--color-text-muted)" }}
                  >
                    <ShieldCheck size={14} style={{ color: "var(--color-accent)" }} />
                    {isAr ? "معرض معتمد" : "Verified Dealer"}
                  </span>
                </div>

                <h1 className="text-xl md:text-2xl font-bold mb-3" style={{ color: "var(--color-text)" }}>
                  {isAr ? vehicle.title : vehicle.titleEn || vehicle.title}
                </h1>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  {
                    icon: <Calendar size={20} strokeWidth={1.5} />,
                    label: t("vehicles.year"),
                    value: vehicle.year,
                  },
                  vehicle.mileage != null && {
                    icon: <Gauge size={20} strokeWidth={1.5} />,
                    label: t("vehicles.mileage"),
                    value: `${formatNumber(vehicle.mileage, nl)} ${t("vehicles.km")}`,
                  },
                  {
                    icon: <Fuel size={20} strokeWidth={1.5} />,
                    label: t("vehicles.fuelType"),
                    value: fuelLabels[vehicle.fuelType] || vehicle.fuelType,
                  },
                  {
                    icon: <Settings2 size={20} strokeWidth={1.5} />,
                    label: t("vehicles.transmission"),
                    value: vehicle.transmission === "AUTOMATIC" ? t("vehicles.automatic") : t("vehicles.manual"),
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
                  {isAr ? vehicle.description : vehicle.descriptionEn || vehicle.description}
                </p>
              </div>

              {/* Specifications Table */}
              {Object.keys(vehicle.specifications).length > 0 && (
                <div
                  className="p-6 rounded-lg border"
                  style={{
                    borderColor: "var(--color-border-light)",
                    backgroundColor: "var(--color-surface-elevated)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <FileCheck2 size={18} style={{ color: "var(--color-accent)" }} />
                    <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>
                      {t("vehicles.specifications")}
                    </h2>
                  </div>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {Object.entries(vehicle.specifications).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex justify-between p-2.5 rounded border"
                        style={{
                          borderColor: "var(--color-border-light)",
                          backgroundColor: "var(--color-surface)",
                        }}
                      >
                        <dt style={{ color: "var(--color-text-muted)" }}>{key}</dt>
                        <dd className="font-semibold" style={{ color: "var(--color-text)" }}>
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
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
                      {isAr ? "طلب فحص أو تجربة قيادة أو تسعير" : "Request inspection, test drive, or quote"}
                    </p>
                  </div>
                  <Car size={24} style={{ color: "var(--color-accent)" }} />
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
                      {isAr ? "تم إرسال طلبك إلى المعرض" : "Request Sent Successfully"}
                    </h4>
                    <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
                      {isAr
                        ? "سيتواصل معك ممثل المعرض لترتيب موعد المعاينة أو تجربة القيادة."
                        : "The dealer representative will contact you to arrange a viewing or test drive."}
                    </p>
                    <button
                      type="button"
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs font-medium underline"
                      style={{ color: "var(--color-accent)" }}
                    >
                      {isAr ? "إرسال طلب آخر" : "Send another request"}
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
                        placeholder={isAr ? "مثال: فهد القحطاني" : "e.g. John Doe"}
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
                        {isAr ? "نص الطلب أو الاستفسار *" : "Inquiry Details *"}
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={
                          isAr
                            ? "أود الاستفسار عن فحص المركبة وإمكانية تجربة القيادة وموافاتها للضمان..."
                            : "I would like to inquire about vehicle inspection and arranging a test drive..."
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
                      href="tel:+966500000002"
                      className="w-full py-2.5 rounded-md text-xs font-medium flex items-center justify-center gap-2 border cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                      style={{
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    >
                      <Phone size={14} />
                      {t("vehicles.contactDealer")}
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
