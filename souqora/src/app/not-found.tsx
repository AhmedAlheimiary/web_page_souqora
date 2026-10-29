"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { Home } from "lucide-react";

export default function NotFound() {
  const t = useTranslations();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div
        className="text-8xl font-bold mb-4"
        style={{ color: "var(--color-border)" }}
      >
        404
      </div>
      <h1
        className="text-2xl md:text-3xl font-bold mb-3"
        style={{ color: "var(--color-text)" }}
      >
        {t("errors.pageNotFound")}
      </h1>
      <p
        className="text-base mb-8 max-w-md"
        style={{ color: "var(--color-text-muted)" }}
      >
        {t("errors.pageNotFoundDesc")}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-transform hover:scale-105"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-foreground)",
        }}
      >
        <Home size={18} />
        {t("errors.goHome")}
      </Link>
    </div>
  );
}
