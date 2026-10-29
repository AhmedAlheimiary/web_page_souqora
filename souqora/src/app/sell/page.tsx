"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Store,
  TrendingUp,
  Shield,
  Headphones,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Building,
  CreditCard,
  AlertCircle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function SellPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;
  const router = useRouter();
  const { data: session, status } = useSession();

  // Onboarding Form State
  const [storeName, setStoreName] = useState("");
  const [storeSlug, setStoreSlug] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("SA");
  const [crNumber, setCrNumber] = useState("");
  const [vatNumber, setVatNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [iban, setIban] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const benefits = [
    {
      icon: <Store size={22} />,
      title: locale === "ar" ? "متجرك الخاص" : "Your Own Store",
      desc:
        locale === "ar"
          ? "أنشئ متجرك الإلكتروني بسهولة وابدأ عرض منتجاتك"
          : "Create your online store easily and start listing products",
    },
    {
      icon: <TrendingUp size={22} />,
      title: locale === "ar" ? "تحليلات مبيعات" : "Sales Analytics",
      desc:
        locale === "ar"
          ? "تابع أداء متجرك بتقارير وتحليلات مفصلة"
          : "Track your store performance with detailed reports",
    },
    {
      icon: <Shield size={22} />,
      title: locale === "ar" ? "حماية وأمان" : "Security",
      desc:
        locale === "ar"
          ? "معاملات مالية آمنة ومحمية بالكامل"
          : "Fully secure and protected financial transactions",
    },
    {
      icon: <Headphones size={22} />,
      title: locale === "ar" ? "دعم مستمر" : "Ongoing Support",
      desc:
        locale === "ar"
          ? "فريق دعم متخصص لمساعدتك في كل خطوة"
          : "Dedicated support team to help at every step",
    },
  ];

  const steps = [
    {
      n: "1",
      title: locale === "ar" ? "أنشئ حسابك" : "Create Account",
      desc:
        locale === "ar"
          ? "سجّل حساباً جديداً وقدّم طلب البيع"
          : "Register and submit your seller application",
    },
    {
      n: "2",
      title: locale === "ar" ? "أعد متجرك" : "Set Up Store",
      desc:
        locale === "ar"
          ? "أضف معلومات متجرك وحسابك البنكي"
          : "Add your store info and bank details",
    },
    {
      n: "3",
      title: locale === "ar" ? "أضف منتجاتك" : "Add Products",
      desc:
        locale === "ar"
          ? "ابدأ بإضافة منتجاتك أو عقاراتك أو مركباتك"
          : "Start listing products, properties or vehicles",
    },
    {
      n: "4",
      title: locale === "ar" ? "ابدأ البيع" : "Start Selling",
      desc:
        locale === "ar"
          ? "استقبل الطلبات وأدر أرباحك وعمولاتك"
          : "Receive orders and manage earnings & commissions",
    },
  ];

  const handleNameChange = (val: string) => {
    setStoreName(val);
    if (!storeSlug) {
      setStoreSlug(
        val
          .toLowerCase()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .substring(0, 30)
      );
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/seller/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          storeSlug: storeSlug || `store-${Date.now().toString(36)}`,
          description,
          country,
          commercialRegistration: crNumber || undefined,
          taxIdentificationNumber: vatNumber || undefined,
          bankDetails: iban
            ? {
                bankName: bankName || (country === "SA" ? "Al Rajhi Bank" : "Kuraimi Bank"),
                iban,
                accountHolder: accountHolder || storeName,
              }
            : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.error ||
            (locale === "ar"
              ? "فشل تقديم طلب المتجر، يرجى التحقق من المدخلات"
              : "Failed to submit store application, please verify inputs")
        );
        setIsLoading(false);
        return;
      }

      setSuccessMessage(
        locale === "ar"
          ? "تم إنشاء طلب متجرك بنجاح! يتم الآن توجيهك إلى لوحة التحكم..."
          : "Store application submitted successfully! Redirecting to dashboard..."
      );

      setTimeout(() => {
        router.push("/seller/dashboard");
      }, 1500);
    } catch {
      setErrorMessage(
        locale === "ar"
          ? "حدث خطأ غير متوقع أثناء إرسال الطلب"
          : "An unexpected error occurred while submitting application"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* Hero */}
      <section
        className="py-14 md:py-20 text-white relative overflow-hidden"
        style={{
          backgroundColor: "var(--color-primary)",
        }}
      >
        <div className="container-main text-center relative z-10 max-w-2xl mx-auto">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider mb-4 border"
            style={{
              borderColor: "rgba(255,255,255,0.15)",
              color: "var(--color-accent)",
            }}
          >
            <Sparkles size={13} />
            <span>{locale === "ar" ? "بوابة التجار والشركاء" : "Merchant & Partner Portal"}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            {t("seller.startSelling")}
          </h1>
          <p className="text-sm md:text-base text-white/70 max-w-xl mx-auto mb-8 leading-relaxed">
            {t("seller.startSellingDesc")}
          </p>

          {!session ? (
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-xs sm:text-sm font-semibold transition-colors"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-accent-foreground)",
                }}
              >
                {locale === "ar" ? "سجّل كبائع جديد" : "Register as Seller"}
                <ArrowIcon size={16} />
              </Link>
              <Link
                href="/auth/login?callbackUrl=/sell"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-md text-xs sm:text-sm font-semibold border transition-colors hover:bg-white/10"
                style={{ borderColor: "rgba(255, 255, 255, 0.25)", color: "#fff" }}
              >
                {locale === "ar" ? "تسجيل الدخول" : "Sign In"}
              </Link>
            </div>
          ) : session.user?.role === "SELLER" || session.user?.role === "VERIFIED_SELLER" ? (
            <Link
              href="/seller/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-xs sm:text-sm font-semibold transition-colors"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-accent-foreground)",
              }}
            >
              {locale === "ar" ? "الانتقال إلى لوحة التحكم" : "Go to Seller Dashboard"}
              <ArrowIcon size={16} />
            </Link>
          ) : (
            <a
              href="#apply-form"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-md text-xs sm:text-sm font-semibold transition-colors"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-accent-foreground)",
              }}
            >
              {locale === "ar" ? "أكمل إعداد متجرك الآن" : "Complete Store Setup"}
              <ArrowIcon size={16} />
            </a>
          )}
        </div>
      </section>

      {/* Interactive Application Form */}
      <section id="apply-form" className="section-spacing">
        <div className="container-main max-w-xl mx-auto">
          <div
            className="rounded-lg border p-6 md:p-8"
            style={{
              backgroundColor: "var(--color-surface-elevated)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-10 h-10 rounded-md flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "rgba(196, 147, 63, 0.12)",
                  color: "var(--color-accent)",
                }}
              >
                <Store size={20} />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold" style={{ color: "var(--color-text)" }}>
                  {locale === "ar" ? "طلب انضمام بائع / فتح متجر" : "Seller Application"}
                </h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {locale === "ar"
                    ? "املأ بيانات متجرك لبدء البيع في السعودية واليمن"
                    : "Fill in your store details to start selling in KSA & Yemen"}
                </p>
              </div>
            </div>

            {/* Notification Alerts */}
            {errorMessage && (
              <div
                className="mb-5 p-3.5 rounded-md flex items-center gap-2.5 text-xs"
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

            {successMessage && (
              <div
                className="mb-5 p-3.5 rounded-md flex items-center gap-2.5 text-xs"
                style={{
                  backgroundColor: "var(--color-success-light)",
                  border: "1px solid var(--color-success)",
                  color: "var(--color-success)",
                }}
              >
                <CheckCircle2 size={16} className="shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {status === "unauthenticated" && (
              <div
                className="mb-5 p-3.5 rounded-md border text-xs flex items-center justify-between"
                style={{
                  backgroundColor: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                }}
              >
                <span style={{ color: "var(--color-text)" }}>
                  {locale === "ar"
                    ? "يلزم تسجيل الدخول أولاً لربط المتجر بحسابك"
                    : "Please sign in first to link your store"}
                </span>
                <Link
                  href="/auth/login?callbackUrl=/sell"
                  className="px-3 py-1.5 rounded-md text-xs font-semibold"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primary-foreground)",
                  }}
                >
                  {t("common.login")}
                </Link>
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-4">
              {/* Country Selection */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                  {locale === "ar" ? "الدولة المستهدفة" : "Target Country"}
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setCountry("SA")}
                    className={`py-2 px-3 rounded-md border text-xs font-medium cursor-pointer transition-all ${
                      country === "SA" ? "ring-1" : "opacity-80"
                    }`}
                    style={{
                      borderColor:
                        country === "SA"
                          ? "var(--color-accent)"
                          : "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                  >
                    🇸🇦 {locale === "ar" ? "السعودية (SAR)" : "Saudi Arabia (SAR)"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setCountry("YE")}
                    className={`py-2 px-3 rounded-md border text-xs font-medium cursor-pointer transition-all ${
                      country === "YE" ? "ring-1" : "opacity-80"
                    }`}
                    style={{
                      borderColor:
                        country === "YE"
                          ? "var(--color-accent)"
                          : "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                  >
                    🇾🇪 {locale === "ar" ? "اليمن (YER)" : "Yemen (YER)"}
                  </button>
                </div>
              </div>

              {/* Store Name & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                    {locale === "ar" ? "اسم المتجر" : "Store Name"}
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    placeholder={locale === "ar" ? "متجر الإلكترونيات الحديثة" : "Modern Store"}
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
                    {locale === "ar" ? "رابط المتجر (Slug)" : "Store URL Slug"}
                  </label>
                  <input
                    type="text"
                    value={storeSlug}
                    onChange={(e) => setStoreSlug(e.target.value)}
                    placeholder="modern-store"
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

              {/* Description */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                  {locale === "ar" ? "نبذة عن المتجر والمنتجات" : "Store Description"}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder={
                    locale === "ar"
                      ? "اكتب وصفاً مختصراً لمتجرك والمنتجات التي توفرها..."
                      : "Describe your store, products, and services..."
                  }
                  className="w-full px-3 py-2 rounded-md border text-xs outline-none resize-none"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                  required
                />
              </div>

              {/* Commercial & VAT Numbers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                <div>
                  <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: "var(--color-text)" }}>
                    <Building size={13} style={{ color: "var(--color-accent)" }} />
                    <span>{locale === "ar" ? "رقم السجل التجاري (CR)" : "Commercial Reg. (CR)"}</span>
                  </label>
                  <input
                    type="text"
                    value={crNumber}
                    onChange={(e) => setCrNumber(e.target.value)}
                    placeholder={country === "SA" ? "1010XXXXXX" : "CR-XXXXX"}
                    className="w-full px-3 py-2 rounded-md border text-xs outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: "var(--color-text)" }}>
                    <CreditCard size={13} style={{ color: "var(--color-accent)" }} />
                    <span>{locale === "ar" ? "الرقم الضريبي (VAT)" : "Tax ID / VAT"}</span>
                  </label>
                  <input
                    type="text"
                    value={vatNumber}
                    onChange={(e) => setVatNumber(e.target.value)}
                    placeholder={country === "SA" ? "3000XXXXXXXX003" : "VAT-XXXXX"}
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

              {/* Bank Payout Details */}
              <div className="p-3.5 rounded-md border space-y-2.5" style={{ backgroundColor: "var(--color-surface)", borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-1.5 font-semibold text-xs" style={{ color: "var(--color-accent)" }}>
                  <CreditCard size={13} />
                  <span>{locale === "ar" ? "بيانات التحويل البنكي للمستحقات (Payout IBAN)" : "Bank Payout Information"}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  <div>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      placeholder={country === "SA" ? "مصرف الراجحي / الأهلي" : "بنك الكريمي"}
                      className="w-full px-3 py-2 rounded-md border text-xs outline-none"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-surface-elevated)",
                        color: "var(--color-text)",
                      }}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={accountHolder}
                      onChange={(e) => setAccountHolder(e.target.value)}
                      placeholder={locale === "ar" ? "اسم صاحب الحساب" : "Account Holder Name"}
                      className="w-full px-3 py-2 rounded-md border text-xs outline-none"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-surface-elevated)",
                        color: "var(--color-text)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder={country === "SA" ? "SA0380000000608010167519" : "YE00000000000000000000"}
                    className="w-full px-3 py-2 rounded-md border text-xs outline-none font-mono"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface-elevated)",
                      color: "var(--color-text)",
                    }}
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || status === "unauthenticated"}
                className="w-full py-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 transition-colors"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    <span>{locale === "ar" ? "جاري تقديم الطلب..." : "Submitting Application..."}</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={15} style={{ color: "var(--color-accent)" }} />
                    <span>{locale === "ar" ? "تقديم طلب فتح المتجر" : "Submit Store Application"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-spacing">
        <div className="container-main">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="text-center p-5 rounded-lg border"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border-light)",
                }}
              >
                <div
                  className="w-10 h-10 rounded-md mx-auto mb-3 flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(196, 147, 63, 0.12)",
                    color: "var(--color-accent)",
                  }}
                >
                  {b.icon}
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                  {b.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section-spacing" style={{ backgroundColor: "var(--color-surface-alt)" }}>
        <div className="container-main">
          <h2
            className="text-xl md:text-2xl font-bold text-center mb-10"
            style={{ color: "var(--color-text)" }}
          >
            {locale === "ar" ? "كيف تبدأ البيع؟" : "How to Start Selling?"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s) => (
              <div key={s.n} className="text-center p-4">
                <div
                  className="w-10 h-10 rounded-md mx-auto mb-3 flex items-center justify-center text-sm font-bold"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primary-foreground)",
                  }}
                >
                  {s.n}
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                  {s.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported Categories */}
      <section className="section-spacing">
        <div className="container-main text-center">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
            {locale === "ar" ? "الفئات المدعومة" : "Supported Categories"}
          </h2>
          <div className="flex flex-wrap justify-center gap-2.5">
            {[
              locale === "ar" ? "إلكترونيات" : "Electronics",
              locale === "ar" ? "أزياء" : "Fashion",
              locale === "ar" ? "منزل ومعيشة" : "Home & Living",
              locale === "ar" ? "ألعاب" : "Gaming",
              locale === "ar" ? "تجميل وإكسسوارات" : "Beauty & Accessories",
              locale === "ar" ? "عقارات" : "Real Estate",
              locale === "ar" ? "سيارات" : "Vehicles",
              locale === "ar" ? "صحة وصيدلة" : "Healthcare",
            ].map((cat) => (
              <span
                key={cat}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs border"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text)",
                  backgroundColor: "var(--color-surface-elevated)",
                }}
              >
                <CheckCircle2 size={13} style={{ color: "var(--color-accent)" }} />
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
