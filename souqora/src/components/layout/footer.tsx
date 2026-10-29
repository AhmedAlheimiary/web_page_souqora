"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Shield } from "lucide-react";
import { usePortalAuth } from "@/lib/auth/portal-context";

export function Footer() {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";
  const currentYear = new Date().getFullYear();
  const { openPortalModal } = usePortalAuth();

  return (
    <footer
      className="border-t pb-20 md:pb-0"
      style={{
        backgroundColor: "var(--color-primary)",
        color: "var(--color-primary-foreground)",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="container-main py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-accent-foreground)",
                }}
              >
                S
              </div>
              <span className="text-lg font-bold tracking-tight">
                {t("brand.name")}
              </span>
            </Link>
            <p className="text-sm opacity-70 mb-4 leading-relaxed">
              {t("brand.tagline")}
            </p>
            <div className="flex items-center gap-3 text-xs opacity-50">
              <span>SAR (ر.س)</span>
              <span>&bull;</span>
              <span>YER (ر.ي)</span>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h4 className="text-xs font-semibold mb-4 uppercase tracking-wider opacity-50">
              {t("nav.categories")}
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/electronics", label: t("nav.electronics") },
                { href: "/fashion", label: t("nav.fashion") },
                { href: "/real-estate", label: t("nav.realEstate") },
                { href: "/vehicles", label: t("nav.vehicles") },
                { href: "/healthcare", label: t("nav.healthcare") },
                { href: "/home-living", label: t("nav.homeLiving") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs font-semibold mb-4 uppercase tracking-wider opacity-50">
              {t("footer.customerService")}
            </h4>
            <ul className="space-y-2">
              {[
                { href: "/help", label: t("nav.help") },
                { href: "/shipping", label: t("footer.shipping") },
                { href: "/returns", label: t("footer.returns") },
                { href: "/orders", label: isAr ? "طلباتي" : "My Orders" },
                { href: "/contact", label: t("nav.contact") },
                { href: "/about", label: t("nav.about") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust, Stores & Legal */}
          <div>
            <h4 className="text-xs font-semibold mb-4 uppercase tracking-wider opacity-50">
              {t("nav.stores")}
            </h4>
            <ul className="space-y-2 mb-6">
              {[
                { href: "/stores", label: t("nav.stores") },
                { href: "/privacy", label: t("footer.privacy") },
                { href: "/terms", label: t("footer.terms") },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm opacity-60 hover:opacity-100 transition-opacity"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t py-4"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        <div className="container-main flex flex-col sm:flex-row items-center justify-between gap-3 text-xs opacity-50">
          <p>
            &copy; {currentYear} {t("brand.name")}. {t("footer.allRightsReserved")}.
          </p>

          <div className="flex items-center gap-4">
            <p>{t("common.demoData")}</p>
            {/* Discreet portal trigger for merchants and administration */}
            <button
              onClick={openPortalModal}
              className="flex items-center gap-1.5 opacity-30 hover:opacity-100 hover:text-amber-400 transition cursor-pointer text-[11px]"
              title="بوابة النفاذ المصرح بها للتجار والمدراء"
              aria-label="بوابة النفاذ المصرح بها"
            >
              <Shield size={12} />
              <span>النفاذ المصرح</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
