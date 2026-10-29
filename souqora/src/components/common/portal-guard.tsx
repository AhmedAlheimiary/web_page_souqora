"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Shield, Lock, Eye, EyeOff, AlertCircle, ArrowRight, ArrowLeft, LogOut } from "lucide-react";
import { usePortalAuth, type PortalRole } from "@/lib/auth/portal-context";

interface PortalGuardProps {
  requiredRole: "seller" | "admin";
  children: React.ReactNode;
}

export function PortalGuard({ requiredRole, children }: { requiredRole: "seller" | "admin"; children: React.ReactNode }) {
  const { portalRole, unlockWithPasscode, lockPortal } = usePortalAuth();
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const isUnlocked =
    (requiredRole === "seller" && (portalRole === "seller" || portalRole === "admin")) ||
    (requiredRole === "admin" && portalRole === "admin");

  if (isUnlocked) {
    return (
      <div>
        {/* Subtle security banner indicating active authorized session */}
        <div
          className="border-b px-4 py-2 flex items-center justify-between text-xs transition-colors"
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            borderColor: "var(--color-border)",
            color: "var(--color-text)",
          }}
          dir={isAr ? "rtl" : "ltr"}
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold">
              {requiredRole === "admin"
                ? isAr
                  ? "🔐 بوابة الإدارة العليا والتحكم (مفتوحة)"
                  : "🔐 Administration Control Portal (Active)"
                : isAr
                ? "💼 بوابة التاجر المصرح بها (مفتوحة)"
                : "💼 Authorized Merchant Portal (Active)"}
            </span>
          </div>
          <button
            onClick={lockPortal}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold text-rose-500 hover:bg-rose-500/10 transition"
          >
            <LogOut size={13} />
            <span>{isAr ? "قفل البوابة والخروج" : "Lock Portal"}</span>
          </button>
        </div>
        {children}
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = unlockWithPasscode(passcode);
    if (!result.success) {
      setError(result.error || (isAr ? "رمز المرور غير صحيح" : "Incorrect passcode"));
    }
  };

  return (
    <div
      className="min-h-[80vh] flex items-center justify-center p-4"
      dir={isAr ? "rtl" : "ltr"}
    >
      <div
        className="w-full max-w-md p-8 rounded-2xl border shadow-xl text-center"
        style={{
          backgroundColor: "var(--color-surface)",
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
        }}
      >
        <div
          className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 shadow-sm"
          style={{
            backgroundColor: "rgba(196, 147, 63, 0.12)",
            color: "var(--color-accent)",
          }}
        >
          <Shield size={32} />
        </div>

        <h1 className="text-xl font-bold mb-2">
          {requiredRole === "admin"
            ? isAr
              ? "بوابة إدارة المنصة (محمية)"
              : "Platform Administration Gate (Protected)"
            : isAr
            ? "بوابة التجار المعتمدين (محمية)"
            : "Authorized Merchant Portal (Protected)"}
        </h1>

        <p className="text-xs opacity-70 mb-6 leading-relaxed">
          {isAr
            ? "هذه الصفحة محمية ومخصصة حصرياً للمصرح لهم. يرجى إدخال رمز المرور السري للمتابعة إلى لوحة التحكم."
            : "This page is strictly restricted. Please enter the authorized secret passcode to unlock this portal."}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 flex items-center gap-2 text-xs font-semibold">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div
            className="flex items-center rounded-xl border px-3.5 py-2.5"
            style={{
              borderColor: "var(--color-border)",
              backgroundColor: "var(--color-surface-elevated)",
            }}
          >
            <Lock size={16} className="opacity-40 me-2 shrink-0" />
            <input
              type={showPasscode ? "text" : "password"}
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder={
                requiredRole === "admin"
                  ? isAr
                    ? "رمز مدير المنصة (ADMIN-2026)"
                    : "Admin Passcode (ADMIN-2026)"
                  : isAr
                  ? "رمز التاجر (SELLER-2026)"
                  : "Seller Passcode (SELLER-2026)"
              }
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

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            <Shield size={16} />
            <span>{isAr ? "فتح لوحة التحكم" : "Unlock Dashboard"}</span>
          </button>
        </form>

        <div className="mt-6 pt-5 border-t flex items-center justify-center" style={{ borderColor: "var(--color-border-light)" }}>
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold opacity-70 hover:opacity-100 transition"
          >
            <ArrowIcon size={14} />
            <span>{isAr ? "العودة إلى متجر العملاء" : "Return to Customer Store"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
