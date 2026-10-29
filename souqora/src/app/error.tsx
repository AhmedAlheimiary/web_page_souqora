"use client";

import { useTranslations } from "next-intl";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations();

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{
          backgroundColor: "var(--color-error-light)",
          color: "var(--color-error)",
        }}
      >
        <AlertTriangle size={28} />
      </div>
      <h1
        className="text-2xl md:text-3xl font-bold mb-3"
        style={{ color: "var(--color-text)" }}
      >
        {t("errors.serverError")}
      </h1>
      <p
        className="text-base mb-8 max-w-md"
        style={{ color: "var(--color-text-muted)" }}
      >
        {t("errors.serverErrorDesc")}
      </p>
      <button
        onClick={() => reset()}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-transform hover:scale-105"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-foreground)",
        }}
      >
        <RotateCcw size={18} />
        {t("common.retry")}
      </button>
    </div>
  );
}
