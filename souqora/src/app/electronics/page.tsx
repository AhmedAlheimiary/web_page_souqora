"use client";

import { Smartphone } from "lucide-react";
import { useLocale } from "next-intl";
import { CategoryPageLayout } from "@/components/common/category-page-layout";
import { demoProducts } from "@/lib/data/demo-data";

export default function ElectronicsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const products = demoProducts.filter((p) => p.categorySlug === "electronics");

  return (
    <CategoryPageLayout
      icon={<Smartphone size={40} />}
      gradient="var(--color-primary)"
      titleKey="categories.electronics"
      descKey="categories.electronicsDesc"
      products={products}
      filters={[
        {
          key: "type",
          label: isAr ? "نوع الجهاز" : "Device Type",
          type: "select",
          options: [
            { value: "smartphone", label: isAr ? "هواتف ذكية" : "Smartphones" },
            { value: "laptop", label: isAr ? "حاسبات محمولة" : "Laptops" },
            { value: "tablet", label: isAr ? "أجهزة لوحية" : "Tablets" },
            { value: "camera", label: isAr ? "كاميرات" : "Cameras" },
            { value: "smart-device", label: isAr ? "أجهزة ذكية" : "Smart Devices" },
            { value: "accessories", label: isAr ? "ملحقات" : "Accessories" },
          ],
        },
        {
          key: "brand",
          label: isAr ? "العلامة التجارية" : "Brand",
          type: "select",
          options: [
            { value: "samsung", label: "Samsung" },
            { value: "apple", label: "Apple" },
            { value: "huawei", label: "Huawei" },
            { value: "sony", label: "Sony" },
            { value: "lg", label: "LG" },
          ],
        },
        {
          key: "condition",
          label: isAr ? "الحالة" : "Condition",
          type: "select",
          options: [
            { value: "new", label: isAr ? "جديد" : "New" },
            { value: "used", label: isAr ? "مستعمل" : "Used" },
          ],
        },
      ]}
    />
  );
}
