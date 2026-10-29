"use client";

import React, { useState } from "react";
import { useLocale } from "next-intl";
import { Shield, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";
import { usePortalAuth } from "@/lib/auth/portal-context";

export function SecretPortalModal() {
  const { isModalOpen, closePortalModal, unlockWithPasscode } = usePortalAuth();
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successRole, setSuccessRole] = useState<string | null>(null);
  const locale = useLocale();
  const isAr = locale === "ar";

  if (!isModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = unlockWithPasscode(passcode);
    if (result.success && result.role) {
      setSuccessRole(result.role);
      setTimeout(() => {
        closePortalModal();
        setPasscode("");
        setSuccessRole(null);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md rounded-2xl border p-6 sm:p-8 shadow-2xl transition-all"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
        }}
        dir={isAr ? "rtl" : "ltr"}
      >
        {/* Close Button */}
        <button
          onClick={closePortalModal}
          className="absolute top-4 end-4 p-2 rounded-full opacity-60 hover:opacity-100 hover:bg-black/5 transition"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3 shadow-inner"
            style={{
              backgroundColor: "rgba(196, 147, 63, 0.12)",
              color: "var(--color-accent)",
            }}
          >
            <Shield size={28} />
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            {isAr ? "بوابة النفاذ المصرح بها" : "Authorized Access Portal"}
          </h3>
          <p className="text-xs opacity-70 mt-1 max-w-xs">
            {isAr
              ? "مخصصة حصرياً للتجار المعتمدين وإدارة منصة سوقرا عبر رمز مرور معتمد"
              : "Exclusively for verified sellers and platform administration via authorized passcode"}
          </p>
        </div>

        {/* Success Alert */}
        {successRole && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-2.5 text-xs font-semibold animate-in zoom-in-95">
            <CheckCircle2 size={16} />
            <span>
              {isAr
                ? successRole === "admin"
                  ? "تم التحقق بنجاح! جاري تحويلك إلى لوحة الإدارة العامة..."
                  : "تم التحقق بنجاح! جاري تحويلك إلى لوحة تحكم التاجر..."
                : `Verified! Redirecting to ${successRole} portal...`}
            </span>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center gap-2.5 text-xs font-semibold animate-shake">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-2">
              {isAr ? "رمز المرور السري (Passcode):" : "Secret Passcode:"}
            </label>
            <div
              className="flex items-center rounded-xl border px-3.5 py-2.5 transition-all focus-within:ring-2 focus-within:ring-amber-500/40"
              style={{
                borderColor: "var(--color-border)",
                backgroundColor: "var(--color-surface-elevated)",
              }}
            >
              <Lock size={16} className="opacity-40 me-2.5 shrink-0" />
              <input
                type={showPasscode ? "text" : "password"}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder={isAr ? "أدخل رمز المرور هنا..." : "Enter secret passcode..."}
                autoFocus
                className="flex-1 bg-transparent text-sm outline-none font-mono tracking-wider"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="opacity-50 hover:opacity-100 p-1"
              >
                {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-bold text-sm transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            <Shield size={16} />
            <span>{isAr ? "التحقق والدخول إلى البوابة" : "Authorize & Enter Portal"}</span>
          </button>
        </form>

        {/* Quick Demo Assist Chips */}
        <div className="mt-6 pt-5 border-t" style={{ borderColor: "var(--color-border-light)" }}>
          <div className="flex items-center gap-1.5 text-[11px] font-semibold opacity-60 mb-2">
            <Sparkles size={12} />
            <span>{isAr ? "رموز الوصول المعتمدة (للتجربة السريعة):" : "Demo Access Passcodes:"}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleDemoFill("SELLER-2026")}
              className="px-2.5 py-1.5 rounded-lg border text-[11px] font-mono hover:border-amber-500 transition"
              style={{ borderColor: "var(--color-border)" }}
            >
              💼 {isAr ? "رمز التاجر: SELLER-2026" : "Seller: SELLER-2026"}
            </button>
            <button
              type="button"
              onClick={() => handleDemoFill("ADMIN-2026")}
              className="px-2.5 py-1.5 rounded-lg border text-[11px] font-mono hover:border-amber-500 transition"
              style={{ borderColor: "var(--color-border)" }}
            >
              👑 {isAr ? "رمز المدير: ADMIN-2026" : "Admin: ADMIN-2026"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
