"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, Loader2, Store, ShoppingBag } from "lucide-react";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "SELLER">("CUSTOMER");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage(
        isRtl ? "كلمتا المرور غير متطابقتين" : "Passwords do not match"
      );
      return;
    }

    if (password.length < 8) {
      setErrorMessage(
        isRtl
          ? "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل"
          : "Password must be at least 8 characters long"
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone: phone || undefined,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.error ||
            (isRtl
              ? "فشل إنشاء الحساب، يرجى مراجعة البيانات"
              : "Failed to create account, please check your details")
        );
        setIsLoading(false);
        return;
      }

      // Automatically sign in upon registration
      const signInRes = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (signInRes?.error) {
        router.push("/auth/login");
      } else {
        if (role === "SELLER") {
          router.push("/sell");
        } else {
          router.push("/account");
        }
        router.refresh();
      }
    } catch {
      setErrorMessage(
        isRtl
          ? "حدث خطأ غير متوقع أثناء التسجيل"
          : "An unexpected error occurred during registration"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="section-spacing">
      <div className="container-main max-w-md mx-auto">
        <div
          className="rounded-lg border p-6 md:p-8"
          style={{
            backgroundColor: "var(--color-surface-elevated)",
            borderColor: "var(--color-border-light)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div className="text-center mb-6">
            <div
              className="w-14 h-14 rounded-xl mx-auto mb-4 flex items-center justify-center text-xl font-bold"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-accent-foreground)",
              }}
            >
              S
            </div>
            <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
              {t("auth.registerTitle")}
            </h1>
          </div>

          {/* Account Role Selector */}
          <div className="mb-6 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setRole("CUSTOMER")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                role === "CUSTOMER" ? "ring-2" : "opacity-75 hover:opacity-100"
              }`}
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor:
                  role === "CUSTOMER"
                    ? "var(--color-accent)"
                    : "var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              <ShoppingBag size={16} />
              <span>{isRtl ? "حساب مشتري" : "Buyer Account"}</span>
            </button>

            <button
              type="button"
              onClick={() => setRole("SELLER")}
              className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold cursor-pointer transition-all ${
                role === "SELLER" ? "ring-2" : "opacity-75 hover:opacity-100"
              }`}
              style={{
                backgroundColor: "var(--color-surface)",
                borderColor:
                  role === "SELLER"
                    ? "var(--color-accent)"
                    : "var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              <Store size={16} />
              <span>{isRtl ? "حساب تاجر" : "Seller Account"}</span>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div
              className="mb-5 p-3 rounded-lg flex items-center gap-2 text-sm"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid var(--color-error)",
                color: "var(--color-error)",
              }}
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                {t("auth.fullName")}
              </label>
              <div className="relative">
                <User size={16} className="absolute top-1/2 -translate-y-1/2 start-3" style={{ color: "var(--color-text-muted)" }} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={isRtl ? "الاسم الكامل" : "Full Name"}
                  className="w-full ps-10 pe-4 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                  dir={isRtl ? "rtl" : "ltr"}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute top-1/2 -translate-y-1/2 start-3" style={{ color: "var(--color-text-muted)" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full ps-10 pe-4 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                  dir="ltr"
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                {t("auth.phone")}
              </label>
              <div className="relative">
                <Phone size={16} className="absolute top-1/2 -translate-y-1/2 start-3" style={{ color: "var(--color-text-muted)" }} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+966 50 000 0000"
                  className="w-full ps-10 pe-4 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                  dir="ltr"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute top-1/2 -translate-y-1/2 start-3" style={{ color: "var(--color-text-muted)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ps-10 pe-10 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                  dir="ltr"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 -translate-y-1/2 end-3"
                  style={{ color: "var(--color-text-muted)" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--color-text)" }}>
                {t("auth.confirmPassword")}
              </label>
              <div className="relative">
                <Lock size={16} className="absolute top-1/2 -translate-y-1/2 start-3" style={{ color: "var(--color-text-muted)" }} />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ps-10 pe-4 py-2.5 rounded-lg border text-sm outline-none"
                  style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }}
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg text-sm font-semibold transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "var(--color-primary-foreground)",
              }}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>{isRtl ? "جاري إنشاء الحساب..." : "Creating Account..."}</span>
                </>
              ) : (
                <span>{t("auth.registerButton")}</span>
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--color-text-muted)" }}>
            {t("auth.hasAccount")}{" "}
            <Link href="/auth/login" className="font-medium" style={{ color: "var(--color-accent)" }}>
              {t("common.login")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
