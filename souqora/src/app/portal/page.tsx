"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Shield, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight, Store, Settings, Sparkles } from "lucide-react";
import { usePortalAuth } from "@/lib/auth/portal-context";

export default function SecretPortalGatewayPage() {
  const { unlockWithPasscode } = usePortalAuth();
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRole, setSuccessRole] = useState<string | null>(null);
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = unlockWithPasscode(passcode);
    if (result.success && result.role) {
      setSuccessRole(result.role);
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.href = result.role === "admin" ? "/admin" : "/seller/dashboard";
        }
      }, 700);
    } else {
      setError(result.error || (isAr ? "رمز المرور غير صحيح" : "Incorrect passcode"));
    }
  };

  const handleDemoFill = (code: string) => {
    setPasscode(code);
    setError(null);
  };

  return (
    <div
      className="min-h-[85vh] flex items-center justify-center py-12 px-4"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-lg rounded-3xl border p-8 sm:p-10 shadow-2xl relative overflow-hidden"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
        }}
      >
        {/* Subtle decorative glow */}
        <div
          className="absolute -top-24 -end-24 w-48 h-48 rounded-full blur-3xl pointer-events-none opacity-20"
          style={{ backgroundColor: "var(--color-accent)" }}
        />

        <div className="flex flex-col items-center text-center mb-8 relative">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            <Shield size={32} />
          </div>

          <span
            className="text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2"
            style={{
              backgroundColor: "rgba(196, 147, 63, 0.12)",
              color: "var(--color-accent)",
            }}
          >
            {isAr ? "بوابة النفاذ الآمنة" : "Secure Access Gateway"}
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isAr ? "نظام الدخول للمصرح لهم" : "Authorized Personnel Gate"}
          </h1>

          <p className="text-xs sm:text-sm opacity-70 mt-2 max-w-sm leading-relaxed">
            {isAr
              ? "هذه الصفحة غير مخصصة للعملاء. تتيح للتجار والمدراء الوصول إلى لوحات التحكم عبر إدخال رمز المرور السري المعتمد."
              : "This gateway is strictly restricted. It permits authorized merchants and administrators to access backend dashboards via secret passcodes."}
          </p>
        </div>

        {/* Success Alert */}
        {successRole && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 text-sm font-semibold animate-in zoom-in-95">
            <CheckCircle2 size={20} className="shrink-0" />
            <span>
              {isAr
                ? successRole === "admin"
                  ? "تم اعتماد الدخول بنجاح! جاري التوجيه إلى مركز إدارة المنصة..."
                  : "تم اعتماد الدخول بنجاح! جاري التوجيه إلى لوحة تحكم التاجر..."
                : `Verified! Redirecting to ${successRole} dashboard...`}
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center gap-3 text-sm font-semibold animate-shake">
            <AlertCircle size={20} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
              {isAr ? "رمز المرور السري (Secret Passcode):" : "Secret Passcode:"}
            </label>
            <div
              className="flex items-center rounded-2xl border px-4 py-3.5 transition-all focus-within:ring-2 focus-within:ring-amber-500/40"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface-elevated)",
              }}
            >
              <Lock size={18} className="opacity-40 me-3 shrink-0" />
              <input
                type={showPasscode ? "text" : "password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder={isAr ? "أدخل الرمز السري هنا..." : "Enter secret passcode..."}
                autoFocus
                className="flex-1 bg-transparent text-sm sm:text-base outline-none font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="opacity-50 hover:opacity-100 p-1"
              >
                {showPasscode ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 px-6 rounded-2xl font-bold text-sm sm:text-base shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2.5 cursor-pointer"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            <Shield size={18} />
            <span>{isAr ? "التحقق وفتح لوحة التحكم" : "Verify & Open Dashboard"}</span>
          </button>
        </form>

        {/* Demo Fast Fill Section */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: "var(--color-border-light)" }}>
          <div className="flex items-center gap-1.5 text-xs font-bold opacity-70 mb-3">
            <Sparkles size={14} style={{ color: "var(--color-accent)" }} />
            <span>{isAr ? "الرموز المعتمدة للتجربة السريعة:" : "Authorized Demo Passcodes:"}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <button
              type="button"
              onClick={() => handleDemoFill("SELLER-2026")}
              className="p-3 rounded-xl border text-start flex items-center justify-between hover:border-amber-500/80 transition group"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface-elevated)",
              }}
            >
              <div className="flex items-center gap-2">
                <Store size={16} className="text-amber-500 shrink-0" />
                <div>
                  <div className="font-bold">{isAr ? "لوحة التاجر" : "Seller Portal"}</div>
                  <div className="font-mono text-[11px] opacity-70">SELLER-2026</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold opacity-60 group-hover:opacity-100">
                {isAr ? "استخدام" : "Use"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleDemoFill("ADMIN-2026")}
              className="p-3 rounded-xl border text-start flex items-center justify-between hover:border-amber-500/80 transition group"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface-elevated)",
              }}
            >
              <div className="flex items-center gap-2">
                <Settings size={16} className="text-amber-500 shrink-0" />
                <div>
                  <div className="font-bold">{isAr ? "لوحة الإدارة" : "Admin Portal"}</div>
                  <div className="font-mono text-[11px] opacity-70">ADMIN-2026</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold opacity-60 group-hover:opacity-100">
                {isAr ? "استخدام" : "Use"}
              </span>
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold opacity-60 hover:opacity-100 transition"
          >
            <ArrowIcon size={14} />
            <span>{isAr ? "الرجوع لتسوق العملاء" : "Return to Customer Shopping"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
