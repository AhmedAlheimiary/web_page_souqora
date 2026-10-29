"use client";

import { Sparkles } from "lucide-react";
import { useLocale } from "next-intl";
import { CategoryPageLayout } from "@/components/common/category-page-layout";
import { demoProducts } from "@/lib/data/demo-data";

export default function BeautyAccessoriesPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const products = demoProducts.filter((p) => p.categorySlug === "beauty-accessories");

  return (
    <CategoryPageLayout
      icon={<Sparkles size={40} />}
      gradient="var(--color-primary)"
      titleKey="categories.beautyAccessories"
      descKey="categories.beautyAccessoriesDesc"
      products={products}
      filters={[
        {
          key: "type",
          label: isAr ? "نوع المنتج" : "Product Type",
          type: "select",
          options: [
            { value: "perfume", label: isAr ? "عطور" : "Perfumes" },
            { value: "skincare", label: isAr ? "عناية بالبشرة" : "Skincare" },
            { value: "cosmetics", label: isAr ? "مستحضرات تجميل" : "Cosmetics" },
            { value: "watches", label: isAr ? "ساعات" : "Watches" },
            { value: "jewelry", label: isAr ? "مجوهرات" : "Jewelry" },
            { value: "bags", label: isAr ? "حقائب" : "Bags" },
            { value: "accessories", label: isAr ? "إكسسوارات" : "Accessories" },
          ],
        },
        {
          key: "brand",
          label: isAr ? "العلامة التجارية" : "Brand",
          type: "select",
          options: [
            { value: "local", label: isAr ? "ماركات محلية" : "Local Brands" },
            { value: "international", label: isAr ? "ماركات عالمية" : "International" },
          ],
        },
        {
          key: "gender",
          label: isAr ? "القسم" : "For",
          type: "select",
          options: [
            { value: "men", label: isAr ? "رجالي" : "Men" },
            { value: "women", label: isAr ? "نسائي" : "Women" },
            { value: "unisex", label: isAr ? "للجنسين" : "Unisex" },
          ],
        },
      ]}
    />
  );
}
