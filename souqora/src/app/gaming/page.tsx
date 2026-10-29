"use client";

import { Gamepad2 } from "lucide-react";
import { useLocale } from "next-intl";
import { CategoryPageLayout } from "@/components/common/category-page-layout";
import { demoProducts } from "@/lib/data/demo-data";

export default function GamingPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const products = demoProducts.filter((p) => p.categorySlug === "gaming");

  return (
    <CategoryPageLayout
      icon={<Gamepad2 size={40} />}
      gradient="var(--color-primary)"
      titleKey="categories.gaming"
      descKey="categories.gamingDesc"
      products={products}
      filters={[
        {
          key: "type",
          label: isAr ? "نوع المنتج" : "Product Type",
          type: "select",
          options: [
            { value: "console", label: isAr ? "أجهزة ألعاب" : "Consoles" },
            { value: "controller", label: isAr ? "أذرع تحكم" : "Controllers" },
            { value: "gaming-pc", label: isAr ? "حاسب ألعاب" : "Gaming PCs" },
            { value: "accessory", label: isAr ? "ملحقات" : "Accessories" },
            { value: "game", label: isAr ? "ألعاب" : "Games" },
          ],
        },
        {
          key: "platform",
          label: isAr ? "المنصة" : "Platform",
          type: "checkbox",
          options: [
            { value: "ps5", label: "PlayStation 5" },
            { value: "xbox", label: "Xbox Series X|S" },
            { value: "nintendo", label: "Nintendo Switch" },
            { value: "pc", label: "PC" },
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
