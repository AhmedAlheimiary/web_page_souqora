"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  Heart,
  Share2,
  ShoppingCart,
  Truck,
  Shield,
  RotateCcw,
  Star,
  CheckCircle2,
  Check,
  MessageSquare,
  ThumbsUp,
} from "lucide-react";
import { getProductBySlug, demoProducts } from "@/lib/data/demo-data";
import { formatPrice, getDiscountPercentage } from "@/lib/utils";
import { ProductCard } from "@/components/common/product-card";
import { useCart } from "@/lib/cart/cart-context";
import { useFavorites } from "@/lib/favorites/favorites-context";

interface CustomerReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  isVerified: boolean;
  helpfulCount: number;
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";
  const nl = isAr ? "ar-SA" : "en-US";
  const product = getProductBySlug(slug);

  const { addItem } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();

  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const displayTitle = product ? (isAr ? product.title : product.titleEn || product.title) : "";
  const fallbackUrl = product ? `/api/placeholder?cat=${product.categorySlug || "electronics"}&title=${encodeURIComponent(displayTitle)}&w=800&h=800` : "";
  const [activeImage, setActiveImage] = useState<string>(product?.images?.[0]?.url || fallbackUrl);
  const [imgError, setImgError] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState<CustomerReview[]>([
    {
      id: "rev-1",
      author: "عبدالعزيز الشمري",
      rating: 5,
      date: "منذ 4 أيام",
      comment: "المنتج أصلي 100% والتغليف ممتاز، وصلني في الرياض خلال 24 ساعة بالضبط. شكراً للمتجر على المصداقية.",
      isVerified: true,
      helpfulCount: 14,
    },
    {
      id: "rev-2",
      author: "نورة القحطاني",
      rating: 5,
      date: "منذ أسبوع",
      comment: "جودة ممتازة وسعر منافس مقارنة بالسوق المحلي، والضمان معتمد. أنصح بالتعامل مع المتجر.",
      isVerified: true,
      helpfulCount: 8,
    },
    {
      id: "rev-3",
      author: "فهد الدوسري",
      rating: 4,
      date: "منذ أسبوعين",
      comment: "المنتج ممتاز جداً ويستحق، تجربة التوصيل كانت سريعة ومتابعة الشحنة بالرسائل واضحة.",
      isVerified: true,
      helpfulCount: 5,
    },
  ]);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewAuthor, setReviewAuthor] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  if (!product) {
    return (
      <div className="section-spacing">
        <div className="container-main text-center py-16">
          <h1 className="text-2xl font-bold mb-4" style={{ color: "var(--color-text)" }}>
            {t("errors.pageNotFound")}
          </h1>
          <Link href="/" className="text-sm font-medium" style={{ color: "var(--color-accent)" }}>
            {t("errors.goHome")}
          </Link>
        </div>
      </div>
    );
  }

  const isFavorited = isFavorite(product.id);
  const discount = product.compareAtPrice
    ? getDiscountPercentage(product.compareAtPrice.amount, product.price.amount)
    : 0;
  const relatedProducts = demoProducts.filter(
    (p) => p.categorySlug === product.categorySlug && p.id !== product.id
  );

  const handleAddToCart = () => {
    addItem(
      {
        id: selectedVariantId || product.id,
        productId: product.id,
        variantId: selectedVariantId || undefined,
        title: isAr ? product.title : product.titleEn || product.title,
        price: product.price.amount,
        currency: product.price.currency,
      },
      quantity
    );
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleToggleFav = () => {
    toggleFavorite({
      id: product.id,
      type: "product",
      title: product.title,
      titleEn: product.titleEn,
      priceAmount: product.price.amount,
      priceCurrency: product.price.currency,
      slug: product.slug,
      categorySlug: product.categorySlug,
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    const newRev: CustomerReview = {
      id: `rev-${Date.now()}`,
      author: reviewAuthor.trim() || (isAr ? "مستخدم سوقرا" : "Souqora Customer"),
      rating: reviewRating,
      date: isAr ? "الآن" : "Just now",
      comment: reviewComment.trim(),
      isVerified: true,
      helpfulCount: 0,
    };

    setReviews([newRev, ...reviews]);
    setShowReviewForm(false);
    setReviewComment("");
    setReviewAuthor("");
    setReviewSuccess(true);
    setTimeout(() => setReviewSuccess(false), 3000);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="py-3 border-b" style={{ borderColor: "var(--color-border-light)" }}>
        <div className="container-main flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <Link href="/" className="hover:underline">{t("nav.home")}</Link>
          <span>/</span>
          <Link href={`/${product.categorySlug}`} className="hover:underline">
            {t(`nav.${product.categorySlug === "beauty-accessories" ? "beautyAccessories" : product.categorySlug === "home-living" ? "homeLiving" : product.categorySlug}`)}
          </Link>
          <span>/</span>
          <span style={{ color: "var(--color-text)" }}>{isAr ? product.title : product.titleEn || product.title}</span>
        </div>
      </nav>

      <section className="section-spacing">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div
                className="relative aspect-square rounded-lg overflow-hidden border group bg-neutral-100 dark:bg-neutral-900"
                style={{ borderColor: "var(--color-border-light)" }}
              >
                <img
                  src={activeImage}
                  alt={displayTitle}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={() => {
                    if (activeImage !== fallbackUrl) {
                      setActiveImage(fallbackUrl);
                    }
                  }}
                />

                {discount > 0 && (
                  <span
                    className="absolute top-3 start-3 px-2.5 py-1 rounded-md text-xs font-bold shadow-md tracking-wider"
                    style={{ backgroundColor: "var(--color-error)", color: "#fff" }}
                  >
                    -{discount}%
                  </span>
                )}

                {product.isDemo && (
                  <span
                    className="absolute bottom-3 start-3 px-2 py-0.5 rounded text-[10px] font-medium shadow-sm backdrop-blur-sm"
                    style={{ backgroundColor: "var(--color-warning)", color: "#fff" }}
                  >
                    {t("common.demoData")}
                  </span>
                )}
              </div>

              {/* Thumbnails row */}
              {product.images && product.images.length > 0 && (
                <div className="flex items-center gap-2.5">
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      onClick={() => setActiveImage(img.url)}
                      className="w-14 h-14 rounded-md overflow-hidden border-2 transition-all cursor-pointer hover:opacity-90"
                      style={{
                        borderColor: activeImage === img.url ? "var(--color-accent)" : "var(--color-border)",
                      }}
                    >
                      <img
                        src={img.url}
                        alt={img.alt || product.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = fallbackUrl;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              <h1 className="text-xl md:text-2xl font-bold mb-3" style={{ color: "var(--color-text)" }}>
                {isAr ? product.title : product.titleEn || product.title}
              </h1>

              {/* Rating Summary */}
              <div className="flex items-center gap-3 mb-4 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={15} className="fill-amber-500" />
                  <span className="text-neutral-800 dark:text-neutral-200">4.9</span>
                </div>
                <span className="text-neutral-400">•</span>
                <span className="text-neutral-500">{reviews.length} {isAr ? "تقييمات موثقة من مشترين" : "verified reviews"}</span>
                <span className="text-neutral-400">•</span>
                <span className="font-medium" style={{ color: "var(--color-success)" }}>{isAr ? "متوفر في المستودع" : "In Stock"}</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5 p-3.5 rounded-lg border" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface-elevated)" }}>
                <span className="text-2xl sm:text-3xl font-bold" style={{ color: "var(--color-text)" }}>
                  {formatPrice(product.price.amount, product.price.currency, nl)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-sm line-through" style={{ color: "var(--color-text-muted)" }}>
                    {formatPrice(product.compareAtPrice.amount, product.compareAtPrice.currency, nl)}
                  </span>
                )}
                <span className="text-[11px] ms-auto" style={{ color: "var(--color-text-muted)" }}>
                  {isAr ? "شامل ضريبة القيمة المضافة (15%)" : "Includes 15% VAT"}
                </span>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed mb-6" style={{ color: "var(--color-text-muted)" }}>
                {isAr ? product.description : product.descriptionEn || product.description}
              </p>

              {/* Variants */}
              {product.variants && product.variants.length > 0 && (
                <div className="mb-5">
                  <label className="block text-xs font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                    {isAr ? "اختر المقاس / السعة:" : "Select Variant:"}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariantId(v.id)}
                        className="px-3.5 py-1.5 rounded-md border text-xs font-semibold transition-all cursor-pointer"
                        style={{
                          borderColor: selectedVariantId === v.id ? "var(--color-accent)" : "var(--color-border)",
                          backgroundColor: selectedVariantId === v.id ? "var(--color-primary)" : "transparent",
                          color: selectedVariantId === v.id ? "var(--color-primary-foreground)" : "var(--color-text)",
                        }}
                      >
                        {v.title}
                        {v.stockQuantity <= 0 && <span className="text-[10px] ms-1 opacity-70">({t("common.soldOut")})</span>}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <label className="block text-xs font-semibold mb-2" style={{ color: "var(--color-text)" }}>
                  {t("product.quantity")}
                </label>
                <div className="flex items-center gap-0 w-fit rounded-md border overflow-hidden" style={{ borderColor: "var(--color-border)" }}>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-bold text-sm"
                    style={{ color: "var(--color-text)" }}
                  >
                    -
                  </button>
                  <span className="px-3 py-1.5 text-xs font-bold" style={{ color: "var(--color-text)", backgroundColor: "var(--color-surface)" }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3 py-1.5 hover:bg-black/5 dark:hover:bg-white/5 transition-colors font-bold text-sm"
                    style={{ color: "var(--color-text)" }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add to Cart & Favorite Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 mb-6">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 px-6 rounded-md text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-white"
                  style={{
                    backgroundColor: addedNotice ? "var(--color-success)" : "var(--color-primary)",
                  }}
                >
                  {addedNotice ? (
                    <>
                      <Check size={16} />
                      <span>{isAr ? "تمت الإضافة للسلة بنجاح!" : "Added to Cart!"}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} />
                      <span>{t("common.addToCart")} ({formatPrice(product.price.amount * quantity, product.price.currency, nl)})</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleToggleFav}
                  className="p-3 rounded-md border transition-colors flex items-center justify-center cursor-pointer"
                  style={{
                    borderColor: isFavorited ? "#f43f5e" : "var(--color-border)",
                    color: isFavorited ? "#f43f5e" : "var(--color-text-muted)",
                  }}
                  title={isFavorited ? (isAr ? "إزالة من المفضلة" : "Remove from favorites") : (isAr ? "إضافة للمفضلة" : "Add to favorites")}
                  aria-label={t("common.addToFavorites")}
                >
                  <Heart size={18} className={isFavorited ? "fill-rose-500 text-rose-500" : ""} />
                </button>

                <button
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(window.location.href);
                      alert(isAr ? "تم نسخ رابط المنتج" : "Product link copied");
                    }
                  }}
                  className="p-3 rounded-md border transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
                  aria-label={t("product.share")}
                >
                  <Share2 size={18} />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3 py-4 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                {[
                  { icon: <Truck size={16} />, text: isAr ? "شحن سريع وموثوق عبر سبل SPL مع رقم تتبع" : "Fast shipping via SPL with tracking" },
                  { icon: <Shield size={16} />, text: isAr ? "ضمان حماية المشتري ودفع آمن 100%" : "Buyer protection & 100% secure payment" },
                  { icon: <RotateCcw size={16} />, text: isAr ? "إرجاع سهل خلال 7 أيام وفق الضوابط" : "Easy 7-day returns policy" },
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <span style={{ color: "var(--color-accent)" }}>{badge.icon}</span>
                    <span>{badge.text}</span>
                  </div>
                ))}
              </div>

              {/* Specifications */}
              {Object.keys(product.attributes).length > 0 && (
                <div className="mt-6 p-5 rounded-lg border" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface-elevated)" }}>
                  <h3 className="text-xs font-bold mb-3" style={{ color: "var(--color-text)" }}>
                    {t("product.specifications")}
                  </h3>
                  <dl className="space-y-2">
                    {Object.entries(product.attributes).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs py-1 border-b last:border-0" style={{ borderColor: "var(--color-border-light)" }}>
                        <dt style={{ color: "var(--color-text-muted)" }}>{key}</dt>
                        <dd className="font-semibold" style={{ color: "var(--color-text)" }}>{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="mt-16 pt-10 border-t" style={{ borderColor: "var(--color-border-light)" }}>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--color-text)" }}>
                  <Star size={22} className="text-amber-500 fill-amber-500" />
                  <span>{isAr ? "تقييمات وتجارب المشترين" : "Customer Reviews"}</span>
                </h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {isAr
                    ? "جميع المراجعات من مشترين موثقين قاموا باستلام الطلب"
                    : "Verified reviews from customers who purchased and received this product"}
                </p>
              </div>

              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-colors self-start sm:self-auto hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: "var(--color-border)", color: "var(--color-primary)" }}
              >
                <MessageSquare size={14} />
                <span>{isAr ? "أضف تقييمك للمنتج" : "Write a Review"}</span>
              </button>
            </div>

            {reviewSuccess && (
              <div
                className="p-3.5 rounded-lg border mb-6 text-xs flex items-center gap-2"
                style={{
                  backgroundColor: "rgba(196, 147, 63, 0.08)",
                  borderColor: "var(--color-border-light)",
                  color: "var(--color-text)",
                }}
              >
                <CheckCircle2 size={16} style={{ color: "var(--color-accent)" }} />
                <span>{isAr ? "شكراً لك! تم نشر تقييمك بنجاح." : "Thank you! Your review has been published."}</span>
              </div>
            )}

            {/* Write Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-6 rounded-lg border mb-8 max-w-2xl space-y-4 text-xs" style={{ backgroundColor: "var(--color-surface-elevated)", borderColor: "var(--color-border)" }}>
                <h3 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                  {isAr ? "تقييمك للمنتج وتجربة الشراء" : "Your Product Review"}
                </h3>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                    {isAr ? "التقييم العام (بالنجوم)" : "Rating (Stars)"}
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="p-1 text-amber-500 hover:scale-110 transition-transform"
                      >
                        <Star size={22} className={star <= reviewRating ? "fill-amber-500" : "text-neutral-300"} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                    {isAr ? "اسمك أو لقبك" : "Your Name"}
                  </label>
                  <input
                    type="text"
                    value={reviewAuthor}
                    onChange={(e) => setReviewAuthor(e.target.value)}
                    placeholder={isAr ? "مثال: عبدالله الشمري" : "e.g. John Doe"}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                    {isAr ? "تفاصيل رأيك وتجربتك" : "Your Feedback"}
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={isAr ? "اكتب رأيك بصدق حول الجودة، سرعة التوصيل، والمطابقة للوصف..." : "Write your honest feedback..."}
                    className="w-full p-3 rounded-lg border outline-none leading-relaxed"
                    style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)", color: "var(--color-text)" }}
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-4 py-2 rounded-lg border font-semibold text-xs"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg font-semibold text-xs text-white shadow-sm"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {isAr ? "نشر التقييم" : "Submit Review"}
                  </button>
                </div>
              </form>
            )}

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-5 rounded-lg border flex flex-col justify-between"
                  style={{
                    backgroundColor: "var(--color-surface-elevated)",
                    borderColor: "var(--color-border-light)",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs" style={{ color: "var(--color-text)" }}>
                        {rev.author}
                      </span>
                      <span className="text-[10px] text-neutral-400">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 text-amber-500 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < rev.rating ? "fill-amber-500" : "text-neutral-300"}
                        />
                      ))}
                      {rev.isVerified && (
                        <span
                          className="inline-flex items-center gap-1 ms-2 px-1.5 py-0.5 rounded text-[10px] font-semibold"
                          style={{
                            color: "var(--color-accent)",
                            backgroundColor: "rgba(196, 147, 63, 0.1)",
                          }}
                        >
                          <CheckCircle2 size={10} />
                          <span>{isAr ? "مشترٍ موثق" : "Verified"}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {rev.comment}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t flex items-center justify-between text-[11px] text-neutral-400" style={{ borderColor: "var(--color-border-light)" }}>
                    <span>{isAr ? "هل كان هذا التقييم مفيداً؟" : "Was this helpful?"}</span>
                    <button className="flex items-center gap-1 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                      <ThumbsUp size={12} />
                      <span>{rev.helpfulCount}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
                {t("product.relatedProducts")}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} isDemo={p.isDemo} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
