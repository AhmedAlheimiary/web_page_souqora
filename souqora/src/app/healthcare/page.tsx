"use client";

import { HeartPulse, ShieldAlert } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { CategoryPageLayout } from "@/components/common/category-page-layout";
import { demoProducts } from "@/lib/data/demo-data";

export default function HealthcarePage() {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";
  const products = demoProducts.filter((p) => p.categorySlug === "healthcare");

  const disclaimer = (
    <div
      className="border-b"
      style={{ backgroundColor: "var(--color-warning-light)", borderColor: "var(--color-warning)" }}
    >
      <div className="container-main py-4">
        <div className="flex items-start gap-3">
          <ShieldAlert size={24} className="shrink-0 mt-0.5" style={{ color: "var(--color-warning)" }} />
          <div>
            <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>
              {isAr ? "فئة منتجات منظمة" : "Regulated Product Category"}
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
              {t("healthcare.disclaimer")}
              {" "}
              {isAr
                ? "لا يُسمح ببيع الأدوية التي تتطلب وصفة طبية أو المواد المحظورة. يجب أن يكون البائع مرخصاً وموثقاً."
                : "Prescription-only medicines and prohibited substances are not permitted. Sellers must be licensed and verified."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <CategoryPageLayout
      icon={<HeartPulse size={40} />}
      gradient="var(--color-primary)"
      titleKey="categories.healthcare"
      descKey="categories.healthcareDesc"
      products={products}
      disclaimer={disclaimer}
      filters={[
        {
          key: "type",
          label: isAr ? "نوع المنتج" : "Product Type",
          type: "select",
          options: [
            { value: "vitamins", label: isAr ? "فيتامينات ومكملات" : "Vitamins & Supplements" },
            { value: "personal-care", label: isAr ? "عناية شخصية" : "Personal Care" },
            { value: "first-aid", label: isAr ? "إسعافات أولية" : "First Aid" },
            { value: "medical-devices", label: isAr ? "أجهزة طبية" : "Medical Devices" },
            { value: "baby-care", label: isAr ? "عناية بالطفل" : "Baby Care" },
          ],
        },
        {
          key: "manufacturer",
          label: t("healthcare.manufacturer"),
          type: "select",
          options: [],
        },
        {
          key: "authorized",
          label: isAr ? "البائع" : "Seller",
          type: "select",
          options: [
            { value: "authorized", label: t("healthcare.authorizedSeller") },
          ],
        },
      ]}
    />
  );
}
