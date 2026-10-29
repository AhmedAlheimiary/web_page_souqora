"use client";
import { useState } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const t = useTranslations();
  const locale = useLocale();
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="section-spacing">
        <div className="container-main max-w-md mx-auto text-center">
          <div className="rounded-lg border p-8" style={{ backgroundColor: "var(--color-surface-elevated)", borderColor: "var(--color-border-light)", boxShadow: "var(--shadow-md)" }}>
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "var(--color-success-light)", color: "var(--color-success)" }}>
              <Mail size={28} />
            </div>
            <h2 className="text-lg font-bold mb-2" style={{ color: "var(--color-text)" }}>
              {locale === "ar" ? "تحقق من بريدك" : "Check Your Email"}
            </h2>
            <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
              {locale === "ar" ? "إذا كان البريد الإلكتروني مسجلاً لدينا، ستتلقى رابط إعادة تعيين كلمة المرور." : "If the email is registered, you'll receive a password reset link."}
            </p>
            <Link href="/auth/login" className="text-sm font-medium" style={{ color: "var(--color-accent)" }}>
              {locale === "ar" ? "العودة لتسجيل الدخول" : "Back to Login"}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section-spacing">
      <div className="container-main max-w-md mx-auto">
        <div className="rounded-lg border p-6 md:p-8" style={{ backgroundColor: "var(--color-surface-elevated)", borderColor: "var(--color-border-light)", boxShadow: "var(--shadow-md)" }}>
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-xl font-bold" style={{ backgroundColor: "var(--color-accent)", color: "var(--color-accent-foreground)" }}>S</div>
            <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>{t("auth.forgotPassword")}</h1>
            <p className="text-sm mt-2" style={{ color: "var(--color-text-muted)" }}>
              {locale === "ar" ? "أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور" : "Enter your email to reset your password"}
            </p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>{t("auth.email")}</label>
              <div className="relative">
                <Mail size={16} className="absolute top-1/2 -translate-y-1/2 start-3" style={{ color: "var(--color-text-muted)" }} />
                <input type="email" placeholder={t("auth.email")} className="w-full ps-10 pe-4 py-2.5 rounded-lg border text-sm outline-none" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} dir="ltr" required />
              </div>
            </div>
            <button type="submit" className="w-full py-3 rounded-lg text-sm font-semibold" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
              {locale === "ar" ? "إرسال رابط إعادة التعيين" : "Send Reset Link"}
            </button>
          </form>
          <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-muted)" }}>
            <Link href="/auth/login" className="font-medium" style={{ color: "var(--color-accent)" }}>
              {locale === "ar" ? "العودة لتسجيل الدخول" : "Back to Login"}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
