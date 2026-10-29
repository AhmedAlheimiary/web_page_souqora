"use client";

import { Sofa } from "lucide-react";
import { useLocale } from "next-intl";
import { CategoryPageLayout } from "@/components/common/category-page-layout";
import { demoProducts } from "@/lib/data/demo-data";

export default function HomeLivingPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const products = demoProducts.filter((p) => p.categorySlug === "home-living");

  return (
    <CategoryPageLayout
      icon={<Sofa size={40} />}
      gradient="var(--color-primary)"
      titleKey="categories.homeLiving"
      descKey="categories.homeLivingDesc"
      products={products}
      filters={[
        {
          key: "type",
          label: isAr ? "نوع المنتج" : "Product Type",
          type: "select",
          options: [
            { value: "furniture", label: isAr ? "أثاث" : "Furniture" },
            { value: "kitchen", label: isAr ? "أدوات مطبخ" : "Kitchen" },
            { value: "appliances", label: isAr ? "أجهزة منزلية" : "Appliances" },
            { value: "lighting", label: isAr ? "إضاءة" : "Lighting" },
            { value: "decor", label: isAr ? "ديكور" : "Decor" },
            { value: "storage", label: isAr ? "تخزين" : "Storage" },
            { value: "bedding", label: isAr ? "مفارش" : "Bedding" },
          ],
        },
        {
          key: "room",
          label: isAr ? "الغرفة" : "Room",
          type: "select",
          options: [
            { value: "living", label: isAr ? "غرفة المعيشة" : "Living Room" },
            { value: "bedroom", label: isAr ? "غرفة النوم" : "Bedroom" },
            { value: "kitchen", label: isAr ? "المطبخ" : "Kitchen" },
            { value: "bathroom", label: isAr ? "الحمام" : "Bathroom" },
            { value: "office", label: isAr ? "المكتب" : "Office" },
          ],
        },
        {
          key: "material",
          label: isAr ? "المادة" : "Material",
          type: "checkbox",
          options: [
            { value: "wood", label: isAr ? "خشب" : "Wood" },
            { value: "metal", label: isAr ? "معدن" : "Metal" },
            { value: "fabric", label: isAr ? "قماش" : "Fabric" },
            { value: "leather", label: isAr ? "جلد" : "Leather" },
            { value: "glass", label: isAr ? "زجاج" : "Glass" },
          ],
        },
      ]}
    />
  );
}
