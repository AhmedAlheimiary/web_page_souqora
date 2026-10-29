"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Scale,
  ShoppingCart,
  Check,
  Star,
  ShieldCheck,
  Truck,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/utils";

interface CompareProduct {
  id: string;
  titleAr: string;
  titleEn: string;
  category: "electronics" | "gaming" | "vehicles";
  priceMinor: number;
  currency: string;
  rating: number;
  reviewsCount: number;
  warranty: string;
  delivery: string;
  specs: Record<string, string>;
  image?: string;
}

const comparePresets: Record<string, CompareProduct[]> = {
  smartphones: [
    {
      id: "comp-1",
      titleAr: "آبل آيفون 15 برو ماكس — 256 جيجابايت",
      titleEn: "Apple iPhone 15 Pro Max 256GB",
      category: "electronics",
      priceMinor: 469900,
      currency: "SAR",
      rating: 4.9,
      reviewsCount: 142,
      warranty: "سنتان حاسبات العرب (ضمان الوكيل)",
      delivery: "توصيل سريع خلال 24-48 ساعة",
      image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80",
      specs: {
        "المعالج": "A17 Pro (3 نانومتر)",
        "الشاشة": "6.7 بوصة Super Retina XDR OLED (120Hz)",
        "الكاميرا الرئيسية": "48 ميجابكسل + تقريب بصري 5x",
        "البطارية": "4422 مللي أمبير تدوم حتى 29 ساعة",
        "مادة الهيكل": "تيتانيوم طبيعي فئة صناعة الطيران",
        "مقاومة الماء": "IP68 حتى عمق 6 أمتار",
      },
    },
    {
      id: "comp-2",
      titleAr: "سامسونج جالاكسي S24 ألترا — 256 جيجابايت",
      titleEn: "Samsung Galaxy S24 Ultra 256GB",
      category: "electronics",
      priceMinor: 439900,
      currency: "SAR",
      rating: 4.8,
      reviewsCount: 98,
      warranty: "سنتان ضمان سامسونج السعودية",
      delivery: "توصيل سريع خلال 24-48 ساعة",
      image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80",
      specs: {
        "المعالج": "Snapdragon 8 Gen 3 for Galaxy",
        "الشاشة": "6.8 بوصة Dynamic AMOLED 2X مسطحة",
        "الكاميرا الرئيسية": "200 ميجابكسل + قلم S-Pen مدمج",
        "البطارية": "5000 مللي أمبير مع شحن سريع 45W",
        "مادة الهيكل": "إطار تيتانيوم مقاوم للخدش",
        "مقاومة الماء": "IP68 مع زجاج Gorilla Armor",
      },
    },
  ],
  gaming: [
    {
      id: "comp-3",
      titleAr: "جهاز سوني بلايستيشن 5 سليم — النسخة الرقمية",
      titleEn: "Sony PlayStation 5 Slim Digital",
      category: "gaming",
      priceMinor: 174900,
      currency: "SAR",
      rating: 4.9,
      reviewsCount: 230,
      warranty: "سنتان ضمان الوكيل المعتمد سوني",
      delivery: "شحن مجاني فوري",
      image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80",
      specs: {
        "المعالج": "AMD Zen 2 مخصص 8 أنوية",
        "سعة التخزين": "1 تيرابايت SSD فائق السرعة",
        "دقة العرض": "4K حتى 120 إطار في الثانية و 8K",
        "وحدة التحكم": "DualSense مع ردود فعل لمسية",
        "الصوت": "Tempest 3D AudioTech ثلاثي الأبعاد",
        "الأبعاد والوزن": "تصميم نحيف أخف وزناً بنسبة 24%",
      },
    },
    {
      id: "comp-4",
      titleAr: "مايكروسوفت إكس بوكس سيريس إكس — 1 تيرابايت",
      titleEn: "Microsoft Xbox Series X 1TB",
      category: "gaming",
      priceMinor: 189900,
      currency: "SAR",
      rating: 4.7,
      reviewsCount: 87,
      warranty: "سنتان ضمان مايكروسوفت الرسمي",
      delivery: "شحن مجاني فوري",
      image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?auto=format&fit=crop&w=800&q=80",
      specs: {
        "المعالج": "Custom AMD Zen 2 (12 ترافلوبس)",
        "سعة التخزين": "1 تيرابايت Custom NVMe SSD",
        "دقة العرض": "True 4K Gaming حتى 120 FPS",
        "وحدة التحكم": "Xbox Wireless Controller",
        "الصوت": "Dolby Atmos & DTS:X مخصص",
        "الأبعاد والوزن": "برج تبريد صامت متطور",
      },
    },
  ],
};

export default function ComparePage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const numberLocale = isAr ? "ar-SA" : "en-US";
  const { addItem } = useCart();

  const [activeCategory, setActiveCategory] = useState<"smartphones" | "gaming">("smartphones");
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  const products = comparePresets[activeCategory] || [];

  const handleAddToCart = (product: CompareProduct) => {
    addItem({
      id: product.id,
      productId: product.id,
      title: isAr ? product.titleAr : product.titleEn,
      price: product.priceMinor,
      currency: product.currency,
      image: product.image,
    });
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  // Get all unique spec keys
  const specKeys = Array.from(
    new Set(products.flatMap((p) => Object.keys(p.specs)))
  );

  return (
    <div className="section-spacing">
      <div className="container-main max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2.5" style={{ color: "var(--color-text)" }}>
              <Scale size={26} style={{ color: "var(--color-accent)" }} />
              <span>{isAr ? "المقارنة المباشرة بين المواصفات" : "Product Comparison Matrix"}</span>
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
              {isAr
                ? "مقارنة تفصيلية دقيقة جنباً إلى جنب للمواصفات الفنية والأسعار والضمان"
                : "Side-by-side technical specs, verified warranty, and pricing comparison"}
            </p>
          </div>

          {/* Preset Selector */}
          <div
            className="flex items-center p-1 rounded-xl border text-xs font-semibold self-start sm:self-auto"
            style={{
              backgroundColor: "var(--color-surface-elevated)",
              borderColor: "var(--color-border)",
            }}
          >
            <button
              onClick={() => setActiveCategory("smartphones")}
              className="px-4 py-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor:
                  activeCategory === "smartphones" ? "var(--color-primary)" : "transparent",
                color:
                  activeCategory === "smartphones"
                    ? "var(--color-primary-foreground)"
                    : "var(--color-text-muted)",
              }}
            >
              {isAr ? "الهواتف الذكية الرائدة" : "Flagship Phones"}
            </button>
            <button
              onClick={() => setActiveCategory("gaming")}
              className="px-4 py-1.5 rounded-lg transition-colors"
              style={{
                backgroundColor:
                  activeCategory === "gaming" ? "var(--color-primary)" : "transparent",
                color:
                  activeCategory === "gaming"
                    ? "var(--color-primary-foreground)"
                    : "var(--color-text-muted)",
              }}
            >
              {isAr ? "أجهزة الألعاب (Consoles)" : "Gaming Consoles"}
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div
          className="rounded-lg border overflow-hidden shadow-sm"
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            borderColor: "var(--color-border-light)",
          }}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-start text-xs border-collapse">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--color-border-light)" }}>
                  <th
                    className="p-4 text-start font-bold w-1/4"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text-muted)",
                    }}
                  >
                    {isAr ? "المعيار / الخاصية" : "Criteria / Feature"}
                  </th>
                  {products.map((product) => (
                    <th
                      key={product.id}
                      className="p-5 text-start font-bold w-3/8 align-top border-s"
                      style={{ borderColor: "var(--color-border-light)" }}
                    >
                      {product.image && (
                        <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-3 border bg-neutral-100 dark:bg-neutral-800" style={{ borderColor: "var(--color-border-light)" }}>
                          <img
                            src={product.image}
                            alt={product.titleAr}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = `/api/placeholder?cat=electronics&title=${encodeURIComponent(isAr ? product.titleAr : product.titleEn)}&w=600&h=450`;
                            }}
                          />
                        </div>
                      )}
                      <h3 className="font-bold text-sm mb-2" style={{ color: "var(--color-text)" }}>
                        {isAr ? product.titleAr : product.titleEn}
                      </h3>

                      <div className="flex items-center gap-1.5 text-xs text-amber-500 mb-3">
                        <Star size={14} className="fill-amber-500" />
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">
                          {product.rating}
                        </span>
                        <span className="text-neutral-400 font-normal">
                          ({product.reviewsCount} {isAr ? "تقييم موثق" : "reviews"})
                        </span>
                      </div>

                      <div className="text-xl font-bold font-mono mb-4" style={{ color: "var(--color-primary)" }}>
                        {formatPrice(product.priceMinor, product.currency, numberLocale)}
                      </div>

                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={addedIds[product.id]}
                        className="w-full flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl font-semibold text-xs text-white transition-all active:scale-95 shadow-sm"
                        style={{
                          backgroundColor: addedIds[product.id]
                            ? "var(--color-success)"
                            : "var(--color-primary)",
                        }}
                      >
                        {addedIds[product.id] ? (
                          <>
                            <Check size={14} />
                            <span>{isAr ? "تمت الإضافة للسلة!" : "Added to Cart!"}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={14} />
                            <span>{isAr ? "شراء الآن" : "Add to Cart"}</span>
                          </>
                        )}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y" style={{ borderColor: "var(--color-border-light)" }}>
                {/* Warranty Row */}
                <tr className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                  <td
                    className="p-4 font-semibold flex items-center gap-2"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                  >
                    <ShieldCheck size={15} className="shrink-0" style={{ color: "var(--color-accent)" }} />
                    <span>{isAr ? "الضمان المعتمد" : "Warranty"}</span>
                  </td>
                  {products.map((p) => (
                    <td
                      key={p.id}
                      className="p-4 border-s text-neutral-700 dark:text-neutral-300 font-medium"
                      style={{ borderColor: "var(--color-border-light)" }}
                    >
                      {p.warranty}
                    </td>
                  ))}
                </tr>

                {/* Delivery Row */}
                <tr className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                  <td
                    className="p-4 font-semibold flex items-center gap-2"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                  >
                    <Truck size={15} className="text-blue-600 shrink-0" />
                    <span>{isAr ? "مدة الشحن والتوصيل" : "Delivery Time"}</span>
                  </td>
                  {products.map((p) => (
                    <td
                      key={p.id}
                      className="p-4 border-s text-neutral-700 dark:text-neutral-300 font-medium"
                      style={{ borderColor: "var(--color-border-light)" }}
                    >
                      {p.delivery}
                    </td>
                  ))}
                </tr>

                {/* Dynamic Specs Rows */}
                {specKeys.map((specKey) => (
                  <tr key={specKey} className="hover:bg-black/[0.01] dark:hover:bg-white/[0.01]">
                    <td
                      className="p-4 font-semibold"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-text)",
                      }}
                    >
                      {specKey}
                    </td>
                    {products.map((p) => (
                      <td
                        key={p.id}
                        className="p-4 border-s text-neutral-700 dark:text-neutral-300"
                        style={{ borderColor: "var(--color-border-light)" }}
                      >
                        {p.specs[specKey] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recommendation Notice */}
        <div
          className="mt-6 p-4 rounded-xl border flex items-center justify-between text-xs"
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            borderColor: "var(--color-border-light)",
            color: "var(--color-text-muted)",
          }}
        >
          <span>
            {isAr
              ? "ترغب في مقارنة منتج أو عقار محدد غير موجود بالقائمة؟"
              : "Looking to compare a custom product or property?"}
          </span>
          <Link
            href="/search"
            className="font-bold flex items-center gap-1 transition-colors hover:underline"
            style={{ color: "var(--color-primary)" }}
          >
            <span>{isAr ? "تصفح والبحث في السوق" : "Search All Products"}</span>
            <ArrowIcon size={12} />
          </Link>
        </div>
      </div>
    </div>
  );
}
