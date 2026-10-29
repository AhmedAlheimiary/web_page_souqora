"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Heart, Check, Star, ShoppingCart } from "lucide-react";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { useCart } from "@/lib/cart/cart-context";
import { useFavorites } from "@/lib/favorites/favorites-context";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  isDemo?: boolean;
}

export function ProductCard({ product, isDemo }: ProductCardProps) {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";
  const numberLocale = isAr ? "ar-SA" : "en-US";
  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isAdded, setIsAdded] = useState(false);

  const isFav = isFavorite(product.id);
  const displayTitle = isAr ? product.title : product.titleEn || product.title;
  const imageUrl = product.images?.[0]?.url;
  const fallbackUrl = `/api/placeholder?cat=${product.categorySlug || "electronics"}&title=${encodeURIComponent(displayTitle)}`;
  const [imgSrc, setImgSrc] = useState(imageUrl || fallbackUrl);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: product.id,
      productId: product.id,
      title: displayTitle,
      price: product.price.amount,
      currency: product.price.currency,
      image: imgSrc,
      sellerName: product.seller?.storeName,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite({
      id: product.id,
      type: "product",
      title: product.title,
      titleEn: product.titleEn,
      priceAmount: product.price.amount,
      priceCurrency: product.price.currency,
      image: imgSrc,
      slug: product.slug,
      categorySlug: product.categorySlug,
    });
  };

  const discount = product.compareAtPrice
    ? getDiscountPercentage(product.compareAtPrice.amount, product.price.amount)
    : 0;

  return (
    <article
      className="group relative rounded-lg overflow-hidden border transition-all duration-300 hover:shadow-md flex flex-col"
      style={{
        backgroundColor: "var(--color-surface-elevated)",
        borderColor: "var(--color-border-light)",
      }}
    >
      {/* ── Image ── */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden" style={{ backgroundColor: "var(--color-surface-alt)" }}>
        <img
          src={imgSrc}
          alt={displayTitle}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
          onError={() => {
            if (imgSrc !== fallbackUrl) {
              setImgSrc(fallbackUrl);
            }
          }}
        />

        {/* Discount Badge */}
        {discount > 0 && (
          <span
            className="absolute top-2 start-2 px-2 py-0.5 rounded text-[10px] font-bold"
            style={{
              backgroundColor: "var(--color-error)",
              color: "#fff",
            }}
          >
            -{discount}%
          </span>
        )}

        {/* Demo Badge */}
        {isDemo && (
          <span
            className="absolute top-2 start-14 px-1.5 py-0.5 rounded text-[9px] font-medium opacity-80"
            style={{
              backgroundColor: "var(--color-warning)",
              color: "#fff",
            }}
          >
            {t("common.demoData")}
          </span>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 end-2 p-1.5 rounded-md transition-all duration-200 z-10"
          style={{
            backgroundColor: isFav ? "rgba(255, 255, 255, 0.95)" : "rgba(255, 255, 255, 0.8)",
            color: isFav ? "#e11d48" : "var(--color-text-muted)",
          }}
          aria-label={t("common.addToFavorites")}
        >
          <Heart size={14} className={isFav ? "fill-rose-600 text-rose-600" : ""} />
        </button>
      </Link>

      {/* ── Content ── */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between">
        <div>
          {/* Store / Rating Row */}
          <div className="flex items-center justify-between mb-1 text-[11px]">
            <span className="font-medium truncate" style={{ color: "var(--color-text-muted)" }}>
              {product.seller?.storeName || (isAr ? "متجر معتمد" : "Verified Store")}
            </span>
            <div className="flex items-center gap-0.5 font-medium" style={{ color: "var(--color-accent)" }}>
              <Star size={10} className="fill-current" />
              <span className="text-[10px]">4.9</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/product/${product.slug}`} className="block">
            <h3
              className="font-medium line-clamp-2 leading-relaxed transition-colors hover:text-[#C4933F]"
              style={{
                color: "var(--color-text)",
                fontSize: "0.8125rem",
                lineHeight: "1.45",
                marginBottom: "0.5rem",
                minHeight: "2.35rem",
              }}
            >
              {isAr ? product.title : product.titleEn || product.title}
            </h3>
          </Link>
        </div>

        <div>
          {/* Price */}
          <div
            className="flex items-baseline gap-2 pt-2"
            style={{
              borderTop: "1px solid var(--color-border-light)",
              marginBottom: "0.625rem",
            }}
          >
            <span
              className="font-bold"
              style={{ color: "var(--color-text)", fontSize: "0.875rem" }}
            >
              {formatPrice(product.price.amount, product.price.currency, numberLocale)}
            </span>
            {product.compareAtPrice && (
              <span
                className="text-[10px] line-through"
                style={{ color: "var(--color-text-muted)" }}
              >
                {formatPrice(
                  product.compareAtPrice.amount,
                  product.compareAtPrice.currency,
                  numberLocale
                )}
              </span>
            )}
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer"
            style={{
              backgroundColor: isAdded ? "var(--color-success)" : "var(--color-primary)",
              color: isAdded ? "#fff" : "var(--color-primary-foreground)",
            }}
          >
            {isAdded ? (
              <>
                <Check size={14} />
                <span>{isAr ? "تمت الإضافة" : "Added"}</span>
              </>
            ) : (
              <>
                <ShoppingCart size={13} />
                <span>{t("common.addToCart")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}

// ─── Skeleton ────────────────────────────────
export function ProductCardSkeleton() {
  return (
    <div
      className="rounded-lg overflow-hidden border animate-pulse"
      style={{
        backgroundColor: "var(--color-surface-elevated)",
        borderColor: "var(--color-border-light)",
      }}
    >
      <div className="aspect-square" style={{ backgroundColor: "var(--color-surface-alt)" }} />
      <div className="p-3.5 space-y-2.5">
        <div className="h-3 rounded w-3/4" style={{ backgroundColor: "var(--color-surface-alt)" }} />
        <div className="h-3 rounded w-1/2" style={{ backgroundColor: "var(--color-surface-alt)" }} />
        <div className="h-4 rounded w-1/3" style={{ backgroundColor: "var(--color-surface-alt)" }} />
        <div className="h-8 rounded-md" style={{ backgroundColor: "var(--color-surface-alt)" }} />
      </div>
    </div>
  );
}
