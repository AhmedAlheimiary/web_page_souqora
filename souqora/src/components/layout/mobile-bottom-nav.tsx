"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale } from "next-intl";
import { Home, Grid, Search, ShoppingBag, Heart, User } from "lucide-react";
import { useCart } from "@/lib/cart/cart-context";
import { useFavorites } from "@/lib/favorites/favorites-context";
import { useSession } from "next-auth/react";

export function MobileBottomNav() {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();
  const locale = useLocale();
  const isAr = locale === "ar";
  const { totalCount: cartCount } = useCart();
  const { totalFavorites } = useFavorites();
  const { data: session } = useSession();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Hide on certain checkout or full-screen routes if desired
  const isExcluded = pathname?.includes("/checkout") || pathname?.startsWith("/portal");
  if (isExcluded) return null;

  const navItems = [
    {
      href: "/",
      label: isAr ? "الرئيسية" : "Home",
      icon: <Home size={20} />,
      isActive: pathname === "/" || pathname === "/ar" || pathname === "/en",
    },
    {
      href: "/categories",
      label: isAr ? "الأقسام" : "Categories",
      icon: <Grid size={20} />,
      isActive: pathname?.startsWith("/categories"),
    },
    {
      href: "/search",
      label: isAr ? "البحث" : "Search",
      icon: <Search size={20} />,
      isActive: pathname?.startsWith("/search"),
    },
    {
      href: "/favorites",
      label: isAr ? "المفضلة" : "Favorites",
      icon: <Heart size={20} />,
      badge: totalFavorites > 0 ? totalFavorites : null,
      isActive: pathname?.startsWith("/favorites"),
    },
    {
      href: "/cart",
      label: isAr ? "السلة" : "Cart",
      icon: <ShoppingBag size={20} />,
      badge: cartCount > 0 ? cartCount : null,
      isActive: pathname?.startsWith("/cart"),
    },
    {
      href: session?.user ? "/account" : "/auth/login",
      label: session?.user ? (isAr ? "حسابي" : "Account") : (isAr ? "دخول" : "Login"),
      icon: <User size={20} />,
      isActive: pathname?.startsWith("/account") || pathname?.startsWith("/auth"),
    },
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 start-0 end-0 z-40 border-t backdrop-blur-xl transition-all pb-safe"
      style={{
        backgroundColor: "rgba(255, 255, 255, 0.92)",
        borderColor: "var(--color-border)",
        boxShadow: "0 -4px 16px rgba(0, 0, 0, 0.05)",
      }}
      dir={isAr ? "rtl" : "ltr"}
    >
      <style>{`[data-theme="dark"] .app-bottom-nav { background-color: rgba(18, 20, 29, 0.94) !important; }`}</style>
      <div className="app-bottom-nav flex items-center justify-around h-16 px-1">
        {navItems.map((item) => {
          const active = item.isActive;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-center transition-colors active:scale-95"
              style={{
                color: active ? "var(--color-accent)" : "var(--color-text-muted)",
              }}
            >
              <div className="relative flex items-center justify-center">
                {item.icon}
                {item.badge && (
                  <span
                    className="absolute -top-1.5 -end-2 min-w-[17px] h-[17px] rounded-full flex items-center justify-center text-[10px] font-bold px-1 text-white shadow-sm animate-in zoom-in-75"
                    style={{ backgroundColor: "var(--color-accent)" }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 tracking-tight truncate max-w-[64px] ${
                  active ? "font-bold" : "font-normal"
                }`}
              >
                {item.label}
              </span>
              {active && (
                <span
                  className="absolute bottom-1 w-4 h-0.5 rounded-full"
                  style={{ backgroundColor: "var(--color-accent)" }}
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
