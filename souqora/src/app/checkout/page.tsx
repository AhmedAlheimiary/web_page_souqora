"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  CreditCard,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MapPin,
  Shield,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const locale = useLocale();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const numberLocale = isRtl ? "ar-SA" : "en-US";
  const { data: session } = useSession();

  const { items, subtotal, clearCart, addItem } = useCart();

  // Checkout Form State
  const [name, setName] = useState(session?.user?.name || "");
  const [phone, setPhone] = useState("+966500000001");
  const [country, setCountry] = useState("SA");
  const [city, setCity] = useState("الرياض");
  const [addressLine, setAddressLine] = useState("حي النرجس، شارع عثمان بن عفان");
  const [postalCode, setPostalCode] = useState("13324");
  const [paymentProvider, setPaymentProvider] = useState<"stripe" | "bank_transfer">("bank_transfer");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState<{
    orderNumber: string;
    totalAmount: number;
    paymentReference: string;
    paymentProvider: string;
    currency: string;
  } | null>(null);

  const shippingCost = items.length > 0 ? 2500 : 0;
  const totalAmount = subtotal + shippingCost;
  const currency = items[0]?.currency || "SAR";

  const addDemoItem = () => {
    addItem({
      id: "demo-iphone-15",
      productId: "demo-iphone-15",
      title: isRtl ? "آيفون 15 برو ماكس — 256 جيجابايت" : "iPhone 15 Pro Max — 256GB",
      price: 469900, // 4,699.00 SAR
      currency: "SAR",
      sellerName: "متجر التكنولوجيا المتقدمة",
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage(isRtl ? "سلة التسوق فارغة" : "Your cart is empty");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/orders/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: session?.user?.id,
          customerEmail: session?.user?.email || "guest@souqora.demo",
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
          shippingAddress: {
            name,
            phone,
            addressLine,
            city,
            country,
            postalCode,
          },
          paymentProvider,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.error ||
            (isRtl
              ? "فشل تأكيد الطلب، يرجى المحاولة لاحقاً"
              : "Failed to place order, please try again")
        );
        setIsLoading(false);
        return;
      }

      // Success
      setOrderSuccess({
        orderNumber: data.orderNumber,
        totalAmount: data.totalAmount,
        paymentReference: data.paymentReference,
        paymentProvider: data.paymentProvider,
        currency: data.currency,
      });

      clearCart();
    } catch {
      setErrorMessage(
        isRtl
          ? "حدث خطأ غير متوقع أثناء الاتصال بالخادم"
          : "An unexpected network error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Success Confirmation View
  if (orderSuccess) {
    return (
      <div className="section-spacing">
        <div className="container-main max-w-xl mx-auto">
          <div
            className="rounded-lg border p-6 sm:p-8 text-center"
            style={{
              backgroundColor: "var(--color-surface-elevated)",
              borderColor: "var(--color-border-light)",
            }}
          >
            <div
              className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center"
              style={{
                backgroundColor: "rgba(45, 138, 86, 0.12)",
                color: "var(--color-success)",
              }}
            >
              <CheckCircle2 size={32} />
            </div>

            <h1
              className="text-xl sm:text-2xl font-bold mb-2"
              style={{ color: "var(--color-text)" }}
            >
              {isRtl ? "تم استلام طلبك بنجاح!" : "Order Placed Successfully!"}
            </h1>

            <p className="text-xs sm:text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
              {isRtl
                ? "شكراً لتسوقك من سوقرا. رقم طلبك محفوظ وسيصلك إشعار بحالته."
                : "Thank you for shopping on Souqora. Your order has been placed."}
            </p>

            <div
              className="p-4 rounded-md border text-start space-y-2.5 mb-6 text-xs"
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex justify-between">
                <span style={{ color: "var(--color-text-muted)" }}>
                  {isRtl ? "رقم الطلب" : "Order Number"}:
                </span>
                <span className="font-mono font-bold" style={{ color: "var(--color-text)" }}>
                  {orderSuccess.orderNumber}
                </span>
              </div>

              <div className="flex justify-between">
                <span style={{ color: "var(--color-text-muted)" }}>
                  {isRtl ? "الإجمالي المدفوع" : "Total Amount"}:
                </span>
                <span className="font-bold" style={{ color: "var(--color-accent)" }}>
                  {formatPrice(orderSuccess.totalAmount, orderSuccess.currency, numberLocale)}
                </span>
              </div>

              <div className="flex justify-between">
                <span style={{ color: "var(--color-text-muted)" }}>
                  {isRtl ? "طريقة الدفع" : "Payment Method"}:
                </span>
                <span className="font-medium" style={{ color: "var(--color-text)" }}>
                  {orderSuccess.paymentProvider === "bank_transfer"
                    ? isRtl ? "تحويل بنكي مباشر" : "Bank Transfer"
                    : isRtl ? "بطاقة بنكية (Stripe Sandbox)" : "Card (Stripe Sandbox)"}
                </span>
              </div>

              <div className="flex justify-between">
                <span style={{ color: "var(--color-text-muted)" }}>
                  {isRtl ? "المرجع المالي" : "Payment Ref"}:
                </span>
                <span className="font-mono text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                  {orderSuccess.paymentReference}
                </span>
              </div>
            </div>

            {orderSuccess.paymentProvider === "bank_transfer" && (
              <div
                className="p-3.5 rounded-md border text-start text-xs space-y-2 mb-6"
                style={{
                  backgroundColor: "rgba(229, 161, 0, 0.08)",
                  borderColor: "var(--color-warning)",
                  color: "var(--color-text)",
                }}
              >
                <div className="font-bold flex items-center gap-1.5" style={{ color: "var(--color-warning)" }}>
                  <Building size={14} />
                  <span>{isRtl ? "تعليمات الحوالة البنكية" : "Bank Transfer Instructions"}</span>
                </div>
                <p>
                  {isRtl
                    ? "يرجى تحويل المبلغ إلى الحساب التالي مع تدوين رقم الطلب في خانة الملاحظات:"
                    : "Please transfer the total amount to the following account with the order number in the reference notes:"}
                </p>
                <div className="font-mono bg-white/70 dark:bg-black/30 p-2.5 rounded text-[11px] space-y-0.5">
                  <div><strong>البنك:</strong> مصرف الراجحي (Al Rajhi Bank)</div>
                  <div><strong>الحساب:</strong> SA0380000000608010167519</div>
                  <div><strong>المستفيد:</strong> شركة سوقرا للتجارة الإلكترونية (SOUQORA LLC)</div>
                </div>
                <p className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                  {isRtl
                    ? "تنبيه أمني: لن يتم تجهيز الطلب إلا بعد مطابقة الدفعة البنكية واعتمادها من قبل مسؤولي المالية."
                    : "Security Notice: Orders remain pending until bank transfer is reconciled and approved by finance administrators."}
                </p>
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/orders"
                className="px-5 py-2.5 rounded-md text-xs font-semibold"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                }}
              >
                {isRtl ? "عرض طلباتي" : "View My Orders"}
              </Link>

              <Link
                href="/"
                className="px-5 py-2.5 rounded-md text-xs font-medium border"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                {isRtl ? "متابعة التسوق" : "Continue Shopping"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      <div className="container-main max-w-5xl mx-auto">
        <h1
          className="text-2xl md:text-3xl font-bold mb-8"
          style={{ color: "var(--color-text)" }}
        >
          {isRtl ? "إتمام الطلب والدفع الآمن" : "Checkout & Secure Payment"}
        </h1>

        {/* Empty Cart Warning / Helper */}
        {items.length === 0 && (
          <div
            className="mb-8 p-6 rounded-lg border text-center"
            style={{
              backgroundColor: "var(--color-surface-elevated)",
              borderColor: "var(--color-border-light)",
            }}
          >
            <ShoppingBag size={36} className="mx-auto mb-3 opacity-30" />
            <h2 className="text-base font-semibold mb-1.5" style={{ color: "var(--color-text)" }}>
              {isRtl ? "سلة التسوق لا تحتوي على منتجات حالياً" : "Your cart is currently empty"}
            </h2>
            <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
              {isRtl
                ? "يمكنك إضافة منتج تجريبي بنقرة واحدة لتجربة مسار إتمام الطلب والدفع المالي:"
                : "You can add a demo item with one click to test the checkout & payment workflow:"}
            </p>
            <button
              onClick={addDemoItem}
              className="px-4 py-2 rounded-md text-xs font-semibold cursor-pointer transition-colors"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-accent-foreground)",
              }}
            >
              + {isRtl ? "إضافة منتج تجريبي للسلة" : "Add Demo Product to Cart"}
            </button>
          </div>
        )}

        {errorMessage && (
          <div
            className="mb-6 p-3.5 rounded-md flex items-center gap-2.5 text-xs"
            style={{
              backgroundColor: "var(--color-error-light)",
              border: "1px solid var(--color-error)",
              color: "var(--color-error)",
            }}
          >
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleCheckout} className="flex flex-col lg:flex-row gap-8">
          {/* Main Form: Address & Payment */}
          <div className="flex-1 space-y-6">
            {/* Step 1: Shipping Address */}
            <div
              className="p-5 sm:p-6 rounded-lg border space-y-4"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border-light)",
              }}
            >
              <div className="flex items-center gap-2 font-bold text-sm" style={{ color: "var(--color-text)" }}>
                <MapPin size={16} style={{ color: "var(--color-accent)" }} />
                <span>{isRtl ? "1. عنوان الشحن والتوصيل" : "1. Shipping Address"}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                    {isRtl ? "اسم المستلم" : "Recipient Name"}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border text-xs outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                    {isRtl ? "رقم الهاتف" : "Phone Number"}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border text-xs outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                    {isRtl ? "الدولة" : "Country"}
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border text-xs outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                  >
                    <option value="SA">🇸🇦 السعودية (KSA)</option>
                    <option value="YE">🇾🇪 اليمن (Yemen)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                    {isRtl ? "المدينة" : "City"}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border text-xs outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                    {isRtl ? "الرمز البريدي" : "Postal Code"}
                  </label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-md border text-xs outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                    dir="ltr"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                  {isRtl ? "العنوان بالتفصيل (الحي، الشارع، رقم المبنى)" : "Street Address"}
                </label>
                <input
                  type="text"
                  value={addressLine}
                  onChange={(e) => setAddressLine(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border text-xs outline-none"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                  required
                />
              </div>
            </div>

            {/* Step 2: Payment Provider Selection */}
            <div
              className="p-5 sm:p-6 rounded-lg border space-y-4"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border-light)",
              }}
            >
              <div className="flex items-center gap-2 font-bold text-sm" style={{ color: "var(--color-text)" }}>
                <CreditCard size={16} style={{ color: "var(--color-accent)" }} />
                <span>{isRtl ? "2. طريقة الدفع" : "2. Payment Method"}</span>
              </div>

              <div className="space-y-3">
                {/* Bank Transfer */}
                <label
                  onClick={() => setPaymentProvider("bank_transfer")}
                  className={`p-3.5 rounded-md border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentProvider === "bank_transfer" ? "ring-1" : "opacity-80"
                  }`}
                  style={{
                    borderColor:
                      paymentProvider === "bank_transfer"
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentProvider"
                    checked={paymentProvider === "bank_transfer"}
                    onChange={() => setPaymentProvider("bank_transfer")}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-xs flex items-center gap-2" style={{ color: "var(--color-text)" }}>
                      <Building size={14} />
                      <span>{isRtl ? "تحويل بنكي مباشر (موصى به في KSA واليمن)" : "Direct Bank Transfer (KSA & Yemen)"}</span>
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {isRtl
                        ? "تحويل للمصرف المحلي. يتم تأكيد الطلب بعد التحقق من قيد الحوالة البنكية."
                        : "Direct transfer to local bank account. Order confirmed upon reconciliation."}
                    </p>
                  </div>
                </label>

                {/* Stripe Sandbox */}
                <label
                  onClick={() => setPaymentProvider("stripe")}
                  className={`p-3.5 rounded-md border flex items-start gap-3 cursor-pointer transition-all ${
                    paymentProvider === "stripe" ? "ring-1" : "opacity-80"
                  }`}
                  style={{
                    borderColor:
                      paymentProvider === "stripe"
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  <input
                    type="radio"
                    name="paymentProvider"
                    checked={paymentProvider === "stripe"}
                    onChange={() => setPaymentProvider("stripe")}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-xs flex items-center gap-2" style={{ color: "var(--color-text)" }}>
                      <CreditCard size={14} />
                      <span>{isRtl ? "بطاقة مدى / فيزا / ماستركارد (Stripe Sandbox)" : "Credit Card / Mada (Stripe Sandbox)"}</span>
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {isRtl
                        ? "بيئة اختبارية آمنة (Sandbox). يتم محاكاة المصادقة الفورية للبطاقات."
                        : "Secure simulated sandbox environment. Instant verification simulation."}
                    </p>
                  </div>
                </label>
              </div>

              {/* Compliance Note */}
              <div
                className="p-3 rounded-md text-xs flex items-center gap-2"
                style={{
                  backgroundColor: "rgba(196, 147, 63, 0.08)",
                  color: "var(--color-text-muted)",
                }}
              >
                <Shield size={14} className="shrink-0" style={{ color: "var(--color-accent)" }} />
                <span>
                  {isRtl
                    ? "الامتثال المالي: لا يتم خصم أو تحويل أي مبالغ دون تشفير SSL كامل وامتثال معايير PCI-DSS."
                    : "Financial Compliance: End-to-end SSL encryption with PCI-DSS compliance."}
                </span>
              </div>
            </div>
          </div>

          {/* Right Summary Sidebar */}
          <div className="w-full lg:w-80 shrink-0">
            <div
              className="p-5 rounded-lg border sticky top-28 space-y-4"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border)",
              }}
            >
              <h2 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                {isRtl ? "ملخص الدفع" : "Payment Summary"}
              </h2>

              {/* Mini Item List */}
              <div className="max-h-48 overflow-y-auto space-y-2 border-b pb-3" style={{ borderColor: "var(--color-border-light)" }}>
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="truncate max-w-[170px]" style={{ color: "var(--color-text)" }}>
                      {item.title} × {item.quantity}
                    </span>
                    <span className="font-semibold" style={{ color: "var(--color-text)" }}>
                      {formatPrice(item.price * item.quantity, item.currency, numberLocale)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs pb-3 border-b" style={{ borderColor: "var(--color-border-light)" }}>
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-text-muted)" }}>{isRtl ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span className="font-medium" style={{ color: "var(--color-text)" }}>
                    {formatPrice(subtotal, currency, numberLocale)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: "var(--color-text-muted)" }}>{isRtl ? "الشحن والتوصيل" : "Shipping"}</span>
                  <span className="font-medium" style={{ color: "var(--color-text)" }}>
                    {formatPrice(shippingCost, currency, numberLocale)}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <span className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                  {isRtl ? "المبلغ الإجمالي" : "Total Amount"}
                </span>
                <span className="font-bold text-lg" style={{ color: "var(--color-accent)" }}>
                  {formatPrice(totalAmount, currency, numberLocale)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading || items.length === 0}
                className="w-full py-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>{isRtl ? "جاري معالجة الطلب..." : "Processing Order..."}</span>
                  </>
                ) : (
                  <>
                    <span>{isRtl ? "تأكيد الطلب والدفع" : "Confirm Order & Pay"}</span>
                    <ArrowIcon size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
