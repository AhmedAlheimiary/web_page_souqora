"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Mail,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  Eye,
  EyeOff,
  Laptop,
} from "lucide-react";
import { useSession } from "next-auth/react";

export default function SecurityPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const { data: session } = useSession();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [is2FaEnabled, setIs2FaEnabled] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (newPassword.length < 8) {
      setErrorMessage(
        isAr
          ? "يجب أن لا تقل كلمة المرور الجديدة عن 8 أحرف"
          : "New password must be at least 8 characters long"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage(
        isAr
          ? "كلمتا المرور غير متطابقتين"
          : "Passwords do not match"
      );
      return;
    }

    setSuccessMessage(
      isAr
        ? "تم تحديث كلمة المرور بنجاح وحفظ إعدادات الأمان"
        : "Password updated successfully and security settings saved"
    );
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="section-spacing">
      <div className="container-main max-w-2xl mx-auto">
        {/* Back Link */}
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs font-semibold mb-6 transition-colors hover:opacity-80"
          style={{ color: "var(--color-primary)" }}
        >
          <ArrowIcon size={14} />
          <span>{isAr ? "العودة إلى الحساب" : "Back to Account"}</span>
        </Link>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
            {isAr ? "مركز الأمان والحماية" : "Security & Privacy Center"}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {isAr
              ? "إدارة بيانات الاعتماد والمصادقة الثنائية والجلسات النشطة"
              : "Manage credentials, two-factor authentication, and active sessions"}
          </p>
        </div>

        {/* Notices */}
        {successMessage && (
          <div
            className="p-3.5 rounded-lg border mb-6 flex items-center gap-2.5 text-xs"
            style={{
              backgroundColor: "rgba(196, 147, 63, 0.08)",
              borderColor: "var(--color-border-light)",
              color: "var(--color-text)",
            }}
          >
            <CheckCircle2 size={16} className="shrink-0" style={{ color: "var(--color-accent)" }} />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div
            className="p-3.5 rounded-xl border mb-6 flex items-center gap-2.5 text-xs text-rose-700 bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800"
          >
            <AlertTriangle size={16} className="shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="space-y-6">
          {/* Change Password Card */}
          <div
            className="rounded-xl border p-6"
            style={{
              borderColor: "var(--color-border-light)",
              backgroundColor: "var(--color-surface-elevated)",
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: "rgba(37, 99, 235, 0.1)", color: "#2563eb" }}
              >
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                  {isAr ? "تغيير كلمة المرور" : "Change Password"}
                </h2>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {isAr
                    ? "احرص على استخدام كلمة مرور قوية تحتوي على أرقام ورموز"
                    : "Use a strong password with a mix of letters, numbers, and symbols"}
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                  {isAr ? "كلمة المرور الحالية" : "Current Password"}
                </label>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border outline-none font-mono"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                    {isAr ? "كلمة المرور الجديدة" : "New Password"}
                  </label>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={isAr ? "8 أحرف على الأقل" : "Min 8 characters"}
                    className="w-full px-3 py-2.5 rounded-lg border outline-none font-mono"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                    {isAr ? "تأكيد كلمة المرور" : "Confirm Password"}
                  </label>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg border outline-none font-mono"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  <span>{showPassword ? (isAr ? "إخفاء الرموز" : "Hide") : (isAr ? "إظهار الرموز" : "Show")}</span>
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg font-semibold text-xs text-white transition-transform active:scale-95 shadow-sm"
                  style={{ backgroundColor: "var(--color-primary)" }}
                >
                  {isAr ? "تحديث كلمة المرور" : "Update Password"}
                </button>
              </div>
            </form>
          </div>

          {/* 2FA & Registered Email */}
          <div
            className="rounded-xl border p-6 space-y-4"
            style={{
              borderColor: "var(--color-border-light)",
              backgroundColor: "var(--color-surface-elevated)",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(196, 147, 63, 0.1)", color: "var(--color-accent)" }}
                >
                  <Smartphone size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                    {isAr ? "المصادقة الثنائية (2FA)" : "Two-Factor Authentication (2FA)"}
                  </h3>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    {isAr
                      ? "تأمين عمليات تسجيل الدخول برمز تحقق فوري عبر الجوال"
                      : "Secure sign-ins with an instant SMS/Authenticator OTP"}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIs2FaEnabled(!is2FaEnabled)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  is2FaEnabled ? "bg-[#1A1A2E] dark:bg-[#C4933F]" : "bg-neutral-300 dark:bg-neutral-700"
                }`}
                role="switch"
                aria-checked={is2FaEnabled}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    is2FaEnabled ? (isAr ? "-translate-x-5" : "translate-x-5") : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            <div className="pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--color-border-light)" }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "#f59e0b" }}
                >
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                    {isAr ? "البريد الإلكتروني المعتمد" : "Verified Account Email"}
                  </h3>
                  <p className="text-xs font-mono" style={{ color: "var(--color-text-muted)" }}>
                    {session?.user?.email || "customer@souqora.demo"}
                  </p>
                </div>
              </div>
              <span
                className="px-2.5 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1"
                style={{ backgroundColor: "rgba(196, 147, 63, 0.1)", color: "var(--color-accent)" }}
              >
                <CheckCircle2 size={12} />
                {isAr ? "موثق" : "Verified"}
              </span>
            </div>
          </div>

          {/* Active Sessions */}
          <div
            className="rounded-xl border p-6"
            style={{
              borderColor: "var(--color-border-light)",
              backgroundColor: "var(--color-surface-elevated)",
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Laptop size={18} style={{ color: "var(--color-primary)" }} />
              <h3 className="text-sm font-bold" style={{ color: "var(--color-text)" }}>
                {isAr ? "الجلسات النشطة حالياً" : "Active Device Sessions"}
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 rounded-lg border" style={{ borderColor: "var(--color-border-light)" }}>
                <div>
                  <p className="font-semibold" style={{ color: "var(--color-text)" }}>
                    {isAr ? "متصفح Chrome — نظام Windows (الجهاز الحالي)" : "Chrome on Windows (Current Session)"}
                  </p>
                  <p className="text-neutral-500 mt-0.5">الرياض، المملكة العربية السعودية • IP: 151.254.89.12</p>
                </div>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-semibold"
                  style={{
                    color: "var(--color-accent)",
                    backgroundColor: "rgba(196, 147, 63, 0.1)",
                  }}
                >
                  {isAr ? "نشط الآن" : "Active Now"}
                </span>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div
            className="rounded-xl border p-6"
            style={{
              borderColor: "rgba(239, 68, 68, 0.3)",
              backgroundColor: "rgba(239, 68, 68, 0.04)",
            }}
          >
            <h3 className="text-sm font-bold text-rose-600 mb-1">
              {isAr ? "منطقة الحذف النهائي للحساب" : "Account Termination"}
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--color-text-muted)" }}>
              {isAr
                ? "عند حذف الحساب، سيتم إيقاف صلاحيات الوصول وحذف سجلات العناوين، مع الاحتفاظ فقط بالسجلات المحاسبية والضريبية الملزمة نظاماً."
                : "Terminating your account will permanently delete your personal profile and saved addresses, preserving only statutory tax records."}
            </p>
            <button
              onClick={() => {
                if (window.confirm(isAr ? "هل أنت متأكد من رغبتك في حذف الحساب؟" : "Are you sure you want to delete your account?")) {
                  alert(isAr ? "تم استلام طلب الحذف وسيتم معالجته وفق لائحة حماية البيانات" : "Deletion request submitted");
                }
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 transition-colors shadow-sm"
            >
              {isAr ? "طلب حذف الحساب" : "Delete Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
