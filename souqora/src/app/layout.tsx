import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { localeDirections, type Locale } from "@/lib/i18n/config";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { PortalAuthProvider } from "@/lib/auth/portal-context";
import { CartProvider } from "@/lib/cart/cart-context";
import { FavoritesProvider } from "@/lib/favorites/favorites-context";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { SecretPortalModal } from "@/components/common/secret-portal-modal";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: {
    default: "سوقرا — سوقك الشامل | SOUQORA",
    template: "%s | سوقرا",
  },
  description:
    "تطبيق ومنصة سوقرا — سوق إلكتروني شامل متعدد الفئات. عقارات، سيارات، إلكترونيات، أزياء والمزيد. SOUQORA — Your complete multi-category marketplace.",
  keywords: ["سوقرا", "تطبيق سوقرا", "سوق إلكتروني", "تسوق", "SOUQORA", "marketplace app"],
  manifest: "/manifest.json",
  icons: {
    icon: "/app-icon.svg",
    apple: "/app-icon.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "سوقرا",
  },
};

export const viewport: Viewport = {
  themeColor: "#1B2A4A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = (await getLocale()) as Locale;
  const messages = await getMessages();
  const dir = localeDirections[locale] ?? "rtl";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&family=Alexandria:wght@300;400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          fontFamily:
            locale === "ar"
              ? "var(--font-arabic)"
              : "var(--font-latin)",
        }}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <PortalAuthProvider>
              <ThemeProvider>
                <FavoritesProvider>
                  <CartProvider>
                    <div className="flex flex-col min-h-dvh">
                      <Header />
                      <main className="flex-1">{children}</main>
                      <Footer />
                      <MobileBottomNav />
                      <SecretPortalModal />
                    </div>
                  </CartProvider>
                </FavoritesProvider>
              </ThemeProvider>
            </PortalAuthProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
