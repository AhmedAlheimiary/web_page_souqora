"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Sparkles } from "lucide-react";
import { signIn } from "next-auth/react";

function LoginForm() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setErrorMessage(
          isRtl
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة"
            : "Invalid email or password"
        );
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorMessage(
        isRtl
          ? "حدث خطأ غير متوقع أثناء تسجيل الدخول"
          : "An unexpected error occurred during login"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("Demo@123456");
    setErrorMessage(null);
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
          {/* Logo */}
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
              {t("auth.loginTitle")}
            </h1>
          </div>

          {/* Error Message Alert */}
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

          {/* Quick Demo Switcher */}
          <div
            className="mb-6 p-3 rounded-xl border text-xs"
            style={{
              backgroundColor: "var(--color-surface)",
              borderColor: "var(--color-border-light)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--color-accent)" }}>
                <Sparkles size={14} />
                <span>{isRtl ? "دخول سريع تجريبي" : "Quick Demo Login"}</span>
              </div>
              <Link
                href="/portal"
                className="text-[11px] opacity-60 hover:opacity-100 hover:text-amber-500 transition underline underline-offset-2"
              >
                {isRtl ? "بوابة النفاذ المصرح بها" : "Authorized Portal"}
              </Link>
            </div>
            <button
              type="button"
              onClick={() => fillDemoAccount("buyer@souqora.demo")}
              className="w-full py-2 px-3 rounded-lg text-center font-semibold transition-colors hover:opacity-90 border flex items-center justify-center gap-2"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border)",
                color: "var(--color-text)",
              }}
            >
              <span>👤 {isRtl ? "تجربة حساب عميل (buyer@souqora.demo)" : "Demo Customer (buyer@souqora.demo)"}</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--color-text)" }}
              >
                {t("auth.email")}
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 start-3"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full ps-10 pe-4 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                    fontFamily: "inherit",
                  }}
                  dir="ltr"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--color-text)" }}
              >
                {t("auth.password")}
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute top-1/2 -translate-y-1/2 start-3"
                  style={{ color: "var(--color-text-muted)" }}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full ps-10 pe-10 py-2.5 rounded-lg border text-sm outline-none transition-colors"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                    fontFamily: "inherit",
                  }}
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

            {/* Forgot Password */}
            <div className="text-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs font-medium"
                style={{ color: "var(--color-accent)" }}
              >
                {t("auth.forgotPassword")}
              </Link>
            </div>

            {/* Submit */}
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
                  <span>{isRtl ? "جاري الدخول..." : "Signing in..."}</span>
                </>
              ) : (
                <span>{t("auth.loginButton")}</span>
              )}
            </button>
          </form>

          {/* Register Link */}
          <p
            className="text-center text-sm mt-6"
            style={{ color: "var(--color-text-muted)" }}
          >
            {t("auth.noAccount")}{" "}
            <Link
              href="/auth/register"
              className="font-medium"
              style={{ color: "var(--color-accent)" }}
            >
              {t("common.register")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin" size={32} style={{ color: "var(--color-accent)" }} />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
