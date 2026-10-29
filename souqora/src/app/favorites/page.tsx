"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Building2,
  Car,
  Package,
  Check,
} from "lucide-react";
import { useFavorites, type FavoriteItem } from "@/lib/favorites/favorites-context";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/utils";

export default function FavoritesPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const numberLocale = isAr ? "ar-SA" : "en-US";

  const { favorites, removeFavorite } = useFavorites();
  const { addItem } = useCart();
  const [filterType, setFilterType] = useState<"all" | "product" | "property" | "vehicle">("all");
  const [addedId, setAddedId] = useState<string | null>(null);

  const filteredItems = favorites.filter((item) => {
    if (filterType === "all") return true;
    return item.type === filterType;
  });

  const handleAddToCart = (item: FavoriteItem) => {
    addItem({
      id: item.id,
      productId: item.id,
      title: item.title,
      price: item.priceAmount,
      currency: item.priceCurrency,
      image: item.image,
    });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "property":
        return { label: isAr ? "عقار" : "Property", icon: <Building2 size={12} />, color: "var(--color-primary)" };
      case "vehicle":
        return { label: isAr ? "مركبة" : "Vehicle", icon: <Car size={12} />, color: "var(--color-accent)" };
      default:
        return { label: isAr ? "منتج" : "Product", icon: <Package size={12} />, color: "var(--color-accent)" };
    }
  };

  return (
    <div className="section-spacing">
      <div className="container-main max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2" style={{ color: "var(--color-text)" }}>
              <Heart size={22} className="text-rose-500 fill-rose-500" />
              <span>{isAr ? "قائمة المفضلة" : "My Saved Favorites"}</span>
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
              {isAr
                ? `لديك ${favorites.length} عناصر محفوظة في مفضلتك`
                : `You have ${favorites.length} items saved in your wishlist`}
            </p>
          </div>

          {/* Filter Tabs */}
          {favorites.length > 0 && (
            <div
              className="flex items-center p-1 rounded-md border text-xs font-semibold self-start sm:self-auto"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border)",
              }}
            >
              {(
                [
                  { key: "all", label: isAr ? "الكل" : "All" },
                  { key: "product", label: isAr ? "المنتجات" : "Products" },
                  { key: "property", label: isAr ? "العقارات" : "Properties" },
                  { key: "vehicle", label: isAr ? "المركبات" : "Vehicles" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterType(tab.key)}
                  className="px-3 py-1.5 rounded transition-colors cursor-pointer"
                  style={{
                    backgroundColor:
                      filterType === tab.key ? "var(--color-primary)" : "transparent",
                    color:
                      filterType === tab.key
                        ? "var(--color-primary-foreground)"
                        : "var(--color-text-muted)",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {favorites.length === 0 ? (
          <div
            className="text-center py-20 rounded-lg border"
            style={{
              backgroundColor: "var(--color-surface-elevated)",
              borderColor: "var(--color-border-light)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "rgba(244, 63, 94, 0.1)", color: "#f43f5e" }}
            >
              <Heart size={30} />
            </div>
            <h2 className="text-base font-bold mb-1" style={{ color: "var(--color-text)" }}>
              {isAr ? "قائمة مفضلتك فارغة حالياً" : "Your wishlist is empty"}
            </h2>
            <p className="text-xs mb-6 max-w-sm mx-auto" style={{ color: "var(--color-text-muted)" }}>
              {isAr
                ? "احفظ المنتجات والعقارات والسيارات التي تهمك للرجوع إليها ومقارنتها في أي وقت"
                : "Save products, properties, and vehicles to review or compare whenever you want"}
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-xs font-semibold"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-foreground)",
              }}
            >
              <span>{isAr ? "استكشف السوق الآن" : "Explore Marketplace"}</span>
              <ArrowIcon size={13} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const badge = getTypeBadge(item.type);
              const detailHref =
                item.type === "property"
                  ? `/property/${item.slug}`
                  : item.type === "vehicle"
                  ? `/vehicle/${item.slug}`
                  : `/product/${item.slug}`;

              return (
                <div
                  key={item.id}
                  className="rounded-lg border overflow-hidden flex flex-col justify-between transition-all hover:shadow-md group"
                  style={{
                    backgroundColor: "var(--color-surface-elevated)",
                    borderColor: "var(--color-border-light)",
                  }}
                >
                  <div>
                    {/* Top Type & Remove bar */}
                    <div className="p-3 pb-2 flex items-center justify-between">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold"
                        style={{
                          backgroundColor: `${badge.color}15`,
                          color: badge.color,
                        }}
                      >
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>

                      <button
                        onClick={() => removeFavorite(item.id)}
                        className="p-1 rounded text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                        title={isAr ? "إزالة من المفضلة" : "Remove from favorites"}
                        aria-label={isAr ? "إزالة من المفضلة" : "Remove from favorites"}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Image Preview */}
                    {item.image && (
                      <Link href={detailHref} className="block relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = `/api/placeholder?cat=${item.categorySlug || "electronics"}&title=${encodeURIComponent(isAr ? item.title : item.titleEn || item.title)}&w=600&h=400`;
                          }}
                        />
                      </Link>
                    )}

                    {/* Content */}
                    <div className="p-3.5">
                      <Link href={detailHref} className="block group-hover:underline">
                        <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 leading-snug mb-2" style={{ color: "var(--color-text)" }}>
                          {isAr ? item.title : item.titleEn || item.title}
                        </h3>
                      </Link>

                      <div className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                        {formatPrice(item.priceAmount, item.priceCurrency, numberLocale)}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-3 pt-2 border-t mt-2 flex items-center gap-2" style={{ borderColor: "var(--color-border-light)" }}>
                    {item.type === "product" ? (
                      <button
                        onClick={() => handleAddToCart(item)}
                        disabled={addedId === item.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-md text-xs font-semibold text-white transition-all cursor-pointer"
                        style={{
                          backgroundColor: addedId === item.id ? "var(--color-success)" : "var(--color-primary)",
                        }}
                      >
                        {addedId === item.id ? (
                          <>
                            <Check size={13} />
                            <span>{isAr ? "أضيف للسلة!" : "Added!"}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={13} />
                            <span>{isAr ? "أضف للسلة" : "Add to Cart"}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <Link
                        href={detailHref}
                        className="flex-1 text-center py-2 px-3 rounded-md text-xs font-semibold transition-colors border"
                        style={{
                          backgroundColor: "var(--color-surface)",
                          borderColor: "var(--color-border)",
                          color: "var(--color-text)",
                        }}
                      >
                        {isAr ? "عرض التفاصيل وطلب المعاينة" : "View & Send Inquiry"}
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
