"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import {
  ShoppingCart,
  ArrowLeft,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
} from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const numberLocale = isRtl ? "ar-SA" : "en-US";

  const { items, updateQuantity, removeItem, clearCart, subtotal, totalCount } =
    useCart();

  const shippingCost = items.length > 0 ? 2500 : 0; // 25.00 SAR in minor units
  const totalAmount = subtotal + shippingCost;
  const currency = items[0]?.currency || "SAR";

  if (items.length === 0) {
    return (
      <div className="section-spacing">
        <div className="container-main max-w-xl mx-auto">
          <div
            className="text-center py-16 px-6 rounded-lg border"
            style={{
              backgroundColor: "var(--color-surface-elevated)",
              borderColor: "var(--color-border-light)",
            }}
          >
            <div
              className="w-16 h-16 rounded-md mx-auto mb-4 flex items-center justify-center"
              style={{ backgroundColor: "rgba(196, 147, 63, 0.1)", color: "var(--color-accent)" }}
            >
              <ShoppingCart size={32} />
            </div>
            <h1
              className="text-xl md:text-2xl font-bold mb-2"
              style={{ color: "var(--color-text)" }}
            >
              {t("cart.empty")}
            </h1>
            <p
              className="text-sm mb-6 max-w-sm mx-auto"
              style={{ color: "var(--color-text-muted)" }}
            >
              {t("cart.emptyDesc")}
            </p>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md text-sm font-semibold transition-colors"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-foreground)",
              }}
            >
              {t("cart.continueShopping")}
              <ArrowIcon size={14} />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      <div className="container-main">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-2xl md:text-3xl font-bold"
              style={{ color: "var(--color-text)" }}
            >
              {t("cart.title")}
            </h1>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
              {isRtl
                ? `لديك ${totalCount} منتج في سلة التسوق`
                : `You have ${totalCount} items in your cart`}
            </p>
          </div>

          <button
            onClick={clearCart}
            className="text-xs font-medium text-rose-500 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={13} />
            <span>{isRtl ? "إفراغ السلة" : "Clear Cart"}</span>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Items List */}
          <div className="flex-1 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border-light)",
                }}
              >
                {/* Product Info */}
                <div className="flex items-center gap-3.5 flex-1">
                  <div
                    className="w-16 h-16 rounded-md overflow-hidden flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: "var(--color-surface-alt)",
                      borderColor: "var(--color-border-light)",
                    }}
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `/api/placeholder?cat=electronics&title=${encodeURIComponent(item.title)}&w=150&h=150`;
                        }}
                      />
                    ) : (
                      <span className="text-lg font-bold" style={{ color: "var(--color-accent)" }}>
                        {item.title.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2
                      className="font-semibold text-sm line-clamp-1"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.title}
                    </h2>
                    {item.sellerName && (
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: "var(--color-text-muted)" }}
                      >
                        {isRtl ? `البائع: ${item.sellerName}` : `Seller: ${item.sellerName}`}
                      </p>
                    )}
                    <p
                      className="text-sm font-semibold mt-1"
                      style={{ color: "var(--color-text)" }}
                    >
                      {formatPrice(item.price, item.currency, numberLocale)}
                    </p>
                  </div>
                </div>

                {/* Quantity Controls & Total */}
                <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                  <div
                    className="flex items-center border rounded-md overflow-hidden"
                    style={{ borderColor: "var(--color-border)" }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-text)",
                      }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={13} />
                    </button>
                    <span
                      className="px-3 py-1 text-xs font-semibold min-w-[2rem] text-center"
                      style={{ color: "var(--color-text)" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-text)",
                      }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={13} />
                    </button>
                  </div>

                  <div className="text-end min-w-[5rem]">
                    <span
                      className="text-sm font-bold block"
                      style={{ color: "var(--color-text)" }}
                    >
                      {formatPrice(
                        item.price * item.quantity,
                        item.currency,
                        numberLocale
                      )}
                    </span>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-md transition-colors cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Card */}
          <div className="w-full lg:w-80 shrink-0">
            <div
              className="p-5 rounded-lg border sticky top-28 space-y-4"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border)",
              }}
            >
              <h2
                className="font-bold text-sm"
                style={{ color: "var(--color-text)" }}
              >
                {isRtl ? "ملخص الطلب" : "Order Summary"}
              </h2>

              <div
                className="space-y-2.5 text-xs pb-3 border-b"
                style={{ borderColor: "var(--color-border-light)" }}
              >
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-text-muted)" }}>
                    {isRtl ? "المجموع الفرعي" : "Subtotal"}
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    {formatPrice(subtotal, currency, numberLocale)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-text-muted)" }}>
                    {isRtl ? "رسوم الشحن التقديرية" : "Estimated Shipping"}
                  </span>
                  <span
                    className="font-medium"
                    style={{ color: "var(--color-text)" }}
                  >
                    {formatPrice(shippingCost, currency, numberLocale)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <span
                  className="font-bold text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  {isRtl ? "الإجمالي الكلي" : "Total Amount"}
                </span>
                <span
                  className="font-bold text-lg"
                  style={{ color: "var(--color-accent)" }}
                >
                  {formatPrice(totalAmount, currency, numberLocale)}
                </span>
              </div>

              <Link
                href="/checkout"
                className="w-full py-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                }}
              >
                <span>{isRtl ? "المتابعة لإتمام الطلب" : "Proceed to Checkout"}</span>
                <ArrowIcon size={14} />
              </Link>

              {/* Trust Badges */}
              <div
                className="pt-3 border-t space-y-2 text-xs"
                style={{
                  borderColor: "var(--color-border-light)",
                  color: "var(--color-text-muted)",
                }}
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} style={{ color: "var(--color-accent)" }} />
                  <span>{isRtl ? "دفع آمن ومحمي 100%" : "100% Secure Checkout"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck size={14} style={{ color: "var(--color-accent)" }} />
                  <span>{isRtl ? "شحن سريع عبر سبل SPL" : "Fast delivery via SPL"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <RotateCcw size={14} style={{ color: "var(--color-accent)" }} />
                  <span>{isRtl ? "إرجاع ميسّر خلال 14 يوماً" : "Easy 14-day returns"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
