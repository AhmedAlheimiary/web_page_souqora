"use client";

import { Shirt } from "lucide-react";
import { useLocale } from "next-intl";
import { CategoryPageLayout } from "@/components/common/category-page-layout";
import { demoProducts } from "@/lib/data/demo-data";

export default function FashionPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const products = demoProducts.filter((p) => p.categorySlug === "fashion");

  return (
    <CategoryPageLayout
      icon={<Shirt size={40} />}
      gradient="var(--color-primary)"
      titleKey="categories.fashion"
      descKey="categories.fashionDesc"
      products={products}
      filters={[
        {
          key: "gender",
          label: isAr ? "القسم" : "Section",
          type: "select",
          options: [
            { value: "men", label: isAr ? "رجالي" : "Men" },
            { value: "women", label: isAr ? "نسائي" : "Women" },
            { value: "children", label: isAr ? "أطفال" : "Children" },
          ],
        },
        {
          key: "type",
          label: isAr ? "نوع المنتج" : "Product Type",
          type: "select",
          options: [
            { value: "clothing", label: isAr ? "ملابس" : "Clothing" },
            { value: "shoes", label: isAr ? "أحذية" : "Shoes" },
            { value: "bags", label: isAr ? "حقائب" : "Bags" },
            { value: "sportswear", label: isAr ? "ملابس رياضية" : "Sportswear" },
            { value: "accessories", label: isAr ? "إكسسوارات" : "Accessories" },
          ],
        },
        {
          key: "size",
          label: isAr ? "المقاس" : "Size",
          type: "checkbox",
          options: [
            { value: "XS", label: "XS" },
            { value: "S", label: "S" },
            { value: "M", label: "M" },
            { value: "L", label: "L" },
            { value: "XL", label: "XL" },
            { value: "XXL", label: "XXL" },
          ],
        },
        {
          key: "color",
          label: isAr ? "اللون" : "Color",
          type: "checkbox",
          options: [
            { value: "black", label: isAr ? "أسود" : "Black" },
            { value: "white", label: isAr ? "أبيض" : "White" },
            { value: "blue", label: isAr ? "أزرق" : "Blue" },
            { value: "red", label: isAr ? "أحمر" : "Red" },
            { value: "grey", label: isAr ? "رمادي" : "Grey" },
          ],
        },
      ]}
    />
  );
}
