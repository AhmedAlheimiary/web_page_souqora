"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Sun,
  Moon,
  Globe,
  Building2,
  Car,
  Smartphone,
  Shirt,
  Sofa,
  Sparkles,
  Gamepad2,
  HeartPulse,
  ChevronDown,
  Store,
  Bell,
  CheckCheck,
  ArrowRight,
  ArrowLeft,
  Package,
} from "lucide-react";
import { useTheme } from "@/components/providers/theme-provider";
import { useCart } from "@/lib/cart/cart-context";
import { useFavorites } from "@/lib/favorites/favorites-context";
import { useSession } from "next-auth/react";
import { usePortalAuth } from "@/lib/auth/portal-context";
import { cn } from "@/lib/utils";
import { demoCategories } from "@/lib/data/demo-data";
import type { CategorySlug } from "@/types";

interface CategoryNavItem {
  slug: CategorySlug;
  icon: React.ReactNode;
  labelKey: string;
}

const categoryItems: CategoryNavItem[] = [
  { slug: "real-estate", icon: <Building2 size={18} strokeWidth={1.75} />, labelKey: "realEstate" },
  { slug: "vehicles", icon: <Car size={18} strokeWidth={1.75} />, labelKey: "vehicles" },
  { slug: "electronics", icon: <Smartphone size={18} strokeWidth={1.75} />, labelKey: "electronics" },
  { slug: "fashion", icon: <Shirt size={18} strokeWidth={1.75} />, labelKey: "fashion" },
  { slug: "home-living", icon: <Sofa size={18} strokeWidth={1.75} />, labelKey: "homeLiving" },
  { slug: "beauty-accessories", icon: <Sparkles size={18} strokeWidth={1.75} />, labelKey: "beautyAccessories" },
  { slug: "gaming", icon: <Gamepad2 size={18} strokeWidth={1.75} />, labelKey: "gaming" },
  { slug: "healthcare", icon: <HeartPulse size={18} strokeWidth={1.75} />, labelKey: "healthcare" },
];

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { totalCount } = useCart();
  const { totalFavorites } = useFavorites();
  const { data: session } = useSession();
  const megaMenuRef = useRef<HTMLDivElement>(null);

  const [notifications, setNotifications] = useState([
    {
      id: "notif-1",
      titleAr: "تم شحن طلبك SQ-172924 عبر سبل (SPL-KSA-901823)",
      titleEn: "Order SQ-172924 shipped via SPL (SPL-KSA-901823)",
      timeAr: "منذ ساعتين",
      timeEn: "2h ago",
      isRead: false,
      link: "/orders",
    },
    {
      id: "notif-2",
      titleAr: "تمت مطابقة وإيداع الحوالة البنكية لطلبك بنجاح",
      titleEn: "Bank transfer reconciled and confirmed",
      timeAr: "منذ 5 ساعات",
      timeEn: "5h ago",
      isRead: false,
      link: "/orders",
    },
    {
      id: "notif-3",
      titleAr: "استفسار وطلب معاينة جديد على فيلا حي النرجس",
      titleEn: "New viewing inquiry received on Narjis Villa",
      timeAr: "منذ يوم واحد",
      timeEn: "1d ago",
      isRead: true,
      link: "/orders",
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const isRtl = locale === "ar";
  const otherLocale = locale === "ar" ? "en" : "ar";
  const otherLocaleName = locale === "ar" ? "English" : "العربية";
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  const { openPortalModal } = usePortalAuth();
  const logoClickCountRef = useRef(0);
  const logoTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = (e: React.MouseEvent) => {
    logoClickCountRef.current += 1;
    if (logoTimerRef.current) clearTimeout(logoTimerRef.current);
    logoTimerRef.current = setTimeout(() => {
      logoClickCountRef.current = 0;
    }, 1500);

    if (logoClickCountRef.current >= 4) {
      e.preventDefault();
      logoClickCountRef.current = 0;
      openPortalModal();
    }
  };

  const toggleLocale = () => {
    document.cookie = `NEXT_LOCALE=${otherLocale};path=/;max-age=31536000;SameSite=Lax`;
    window.location.reload();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (typeof window !== "undefined") {
        window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
      }
      setSearchOpen(false);
    }
  };

  // Close mega menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
    };
    if (categoriesOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [categoriesOpen]);

  return (
    <header className="sticky top-0 z-50">
      {/* ── Slim Announcement Bar ── */}
      <div
        className="text-center py-2 px-4 text-xs font-medium tracking-wide"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-foreground)",
        }}
      >
        {t("home.announcement")}
      </div>

      {/* ── Main Header ── */}
      <div
        className="border-b backdrop-blur-md"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Dark mode override */}
        <style>{`[data-theme="dark"] .header-glass { background-color: rgba(20, 20, 32, 0.95) !important; }`}</style>
        <div className="container-main header-glass" style={{ backgroundColor: "transparent" }}>
          <div className="flex items-center justify-between gap-3 h-16 lg:h-[4.5rem]">
            {/* ── Logo ── */}
            <Link
              href="/"
              onClick={handleLogoClick}
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center font-bold text-base tracking-tight"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-accent-foreground)",
                }}
              >
                S
              </div>
              <span
                className="text-lg font-extrabold tracking-tight hidden sm:block"
                style={{ color: "var(--color-text)" }}
              >
                {t("brand.name")}
              </span>
            </Link>

            {/* ── Search Bar — Desktop ── */}
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-xl mx-4">
              <div
                className="flex w-full rounded-lg overflow-hidden border transition-colors"
                style={{ borderColor: "var(--color-border)" }}
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("common.searchPlaceholder")}
                  className="flex-1 px-4 py-2.5 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                    fontFamily: "inherit",
                  }}
                  dir={isRtl ? "rtl" : "ltr"}
                />
                <button
                  type="submit"
                  className="px-4 flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primary-foreground)",
                  }}
                  aria-label={t("common.search")}
                >
                  <Search size={16} />
                </button>
              </div>
            </form>

            {/* ── Actions ── */}
            <div className="flex items-center gap-1">
              {/* Mobile Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="md:hidden p-2.5 rounded-md transition-colors hover:bg-black/5"
                style={{ color: "var(--color-text)" }}
                aria-label={t("common.search")}
              >
                <Search size={20} />
              </button>

              {/* Language */}
              <button
                onClick={toggleLocale}
                className="p-2.5 rounded-md transition-colors hover:bg-black/5 hidden sm:flex items-center gap-1.5 text-xs font-medium"
                style={{ color: "var(--color-text-muted)" }}
                title={otherLocaleName}
              >
                <Globe size={16} />
                <span className="hidden lg:inline">{otherLocaleName}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-md transition-colors hover:bg-black/5"
                style={{ color: "var(--color-text-muted)" }}
                aria-label={theme === "light" ? t("common.darkMode") : t("common.lightMode")}
              >
                {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
              </button>

              {/* Favorites */}
              <Link
                href="/favorites"
                className="p-2.5 rounded-md transition-colors hover:bg-black/5 hidden sm:block relative"
                style={{ color: "var(--color-text-muted)" }}
                aria-label={t("common.favorites")}
              >
                <Heart size={18} />
                {totalFavorites > 0 && (
                  <span className="absolute top-1 -end-0.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white bg-rose-500 px-1">
                    {totalFavorites}
                  </span>
                )}
              </Link>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2.5 rounded-md transition-colors hover:bg-black/5 relative"
                  style={{ color: "var(--color-text-muted)" }}
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 -end-0.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white px-1"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div
                    className="absolute end-0 mt-2 w-80 sm:w-96 rounded-xl border shadow-xl p-3 z-50"
                    style={{
                      backgroundColor: "var(--color-surface-elevated)",
                      borderColor: "var(--color-border)",
                      boxShadow: "var(--shadow-xl)",
                    }}
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b" style={{ borderColor: "var(--color-border-light)" }}>
                      <div className="flex items-center gap-1.5 font-semibold text-xs" style={{ color: "var(--color-text)" }}>
                        <Bell size={13} style={{ color: "var(--color-accent)" }} />
                        <span>{isRtl ? "الإشعارات" : "Notifications"}</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold" style={{ backgroundColor: "rgba(196, 147, 63, 0.1)", color: "var(--color-accent)" }}>
                            {unreadCount} {isRtl ? "جديدة" : "new"}
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-[11px] font-medium flex items-center gap-1 transition-colors"
                          style={{ color: "var(--color-accent)" }}
                        >
                          <CheckCheck size={12} />
                          <span>{isRtl ? "تحديد الكل كمقروء" : "Mark all read"}</span>
                        </button>
                      )}
                    </div>

                    <div className="space-y-0.5 max-h-72 overflow-y-auto">
                      {notifications.map((notif) => (
                        <Link
                          key={notif.id}
                          href={notif.link}
                          onClick={() => {
                            markAsRead(notif.id);
                            setNotificationsOpen(false);
                          }}
                          className="block p-2.5 rounded-lg text-xs transition-colors"
                          style={{
                            backgroundColor: notif.isRead ? "transparent" : "rgba(196, 147, 63, 0.05)",
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className="font-medium leading-relaxed" style={{ color: "var(--color-text)" }}>
                              {isRtl ? notif.titleAr : notif.titleEn}
                            </span>
                            {!notif.isRead && (
                              <span className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5" style={{ backgroundColor: "var(--color-accent)" }} />
                            )}
                          </div>
                          <div className="text-[10px] mt-1" style={{ color: "var(--color-text-muted)" }}>
                            {isRtl ? notif.timeAr : notif.timeEn}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link
                href="/cart"
                className="p-2.5 rounded-md transition-colors hover:bg-black/5 relative"
                style={{ color: "var(--color-text-muted)" }}
                aria-label={t("common.cart")}
              >
                <ShoppingCart size={18} />
                {totalCount > 0 && (
                  <span
                    className="absolute top-0.5 -end-0.5 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-bold px-1"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "var(--color-accent-foreground)",
                    }}
                  >
                    {totalCount}
                  </span>
                )}
              </Link>

              {/* Account / Session */}
              {session?.user ? (
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium transition-colors border"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  <User size={14} style={{ color: "var(--color-accent)" }} />
                  <span className="max-w-[80px] truncate">{session.user.name?.split(" ")[0] || t("common.account")}</span>
                </Link>
              ) : (
                <Link
                  href="/auth/login"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-md text-xs font-semibold transition-colors"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primary-foreground)",
                  }}
                >
                  <User size={14} />
                  <span>{t("common.login")}</span>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 rounded-md transition-colors hover:bg-black/5"
                style={{ color: "var(--color-text)" }}
                aria-label={t("common.menu")}
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Mobile Search — Expandable */}
          {searchOpen && (
            <div className="md:hidden pb-3">
              <form
                onSubmit={handleSearchSubmit}
                className="flex rounded-lg overflow-hidden border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("common.searchPlaceholder")}
                  className="flex-1 px-4 py-2.5 text-sm outline-none"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                    fontFamily: "inherit",
                  }}
                  dir={isRtl ? "rtl" : "ltr"}
                  autoFocus
                />
                <button
                  type="submit"
                  className="px-4"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primary-foreground)",
                  }}
                  aria-label={t("common.search")}
                >
                  <Search size={16} />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* ── Category Navigation — Desktop ── */}
      <nav
        className="hidden md:block border-b"
        style={{
          borderColor: "var(--color-border-light)",
          backgroundColor: "var(--color-surface-elevated)",
        }}
      >
        <div className="container-main">
          <div className="flex items-center gap-2 py-2 overflow-x-auto scrollbar-hide" style={{ gap: "0.5rem" }}>
            {/* All Categories Button with Mega Menu */}
            <div className="relative shrink-0" ref={megaMenuRef}>
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all shadow-sm cursor-pointer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.625rem",
                  backgroundColor: categoriesOpen ? "var(--color-accent)" : "var(--color-primary)",
                  color: "#ffffff",
                }}
              >
                <Menu size={16} />
                <span>{t("nav.allCategories")}</span>
                <ChevronDown
                  size={14}
                  className={cn(categoriesOpen && "rotate-180", "transition-transform duration-200")}
                />
              </button>

              {/* ── Mega Menu Dropdown ── */}
              {categoriesOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setCategoriesOpen(false)}
                  />

                  <div
                    className="absolute start-0 mt-2 w-[680px] max-w-[90vw] p-5 rounded-xl border z-50"
                    style={{
                      backgroundColor: "var(--color-surface-elevated)",
                      borderColor: "var(--color-border)",
                      boxShadow: "var(--shadow-xl)",
                    }}
                  >
                    {/* Header */}
                    <div
                      className="flex items-center justify-between pb-3 mb-4 border-b"
                      style={{ borderColor: "var(--color-border-light)" }}
                    >
                      <span className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                        {isRtl ? "جميع الفئات" : "All Categories"}
                      </span>
                      <Link
                        href="/categories"
                        onClick={() => setCategoriesOpen(false)}
                        className="text-xs font-medium flex items-center gap-1 transition-colors"
                        style={{ color: "var(--color-accent)" }}
                      >
                        {isRtl ? "عرض الكل" : "View all"}
                        <ArrowIcon size={12} />
                      </Link>
                    </div>

                    {/* 4x2 Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {demoCategories.map((cat) => (
                        <Link
                          key={cat.slug}
                          href={`/${cat.slug}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="group p-3.5 rounded-lg border transition-all duration-200 hover:border-current"
                          style={{
                            backgroundColor: "var(--color-surface)",
                            borderColor: "var(--color-border-light)",
                          }}
                        >
                          <div
                            className="w-9 h-9 rounded-md flex items-center justify-center mb-2 transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: "rgba(196, 147, 63, 0.08)",
                              color: "var(--color-accent)",
                            }}
                          >
                            {cat.icon === "Building2" && <Building2 size={18} />}
                            {cat.icon === "Car" && <Car size={18} />}
                            {cat.icon === "Smartphone" && <Smartphone size={18} />}
                            {cat.icon === "Shirt" && <Shirt size={18} />}
                            {cat.icon === "Sofa" && <Sofa size={18} />}
                            {cat.icon === "Sparkles" && <Sparkles size={18} />}
                            {cat.icon === "Gamepad2" && <Gamepad2 size={18} />}
                            {cat.icon === "HeartPulse" && <HeartPulse size={18} />}
                          </div>
                          <h4
                            className="font-semibold text-xs mb-0.5 group-hover:text-current transition-colors"
                            style={{ color: "var(--color-text)" }}
                          >
                            {isRtl ? cat.name : cat.nameEn}
                          </h4>
                          <p
                            className="text-[10px] line-clamp-1 leading-relaxed"
                            style={{ color: "var(--color-text-muted)" }}
                          >
                            {isRtl ? cat.description : cat.descriptionEn}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Separator */}
            <div className="h-6 w-px shrink-0 mx-2" style={{ backgroundColor: "var(--color-border)" }} />

            {/* Category Text Links — Clean, spacious, with dedicated icon badge */}
            <div className="flex items-center gap-1.5 shrink-0" style={{ gap: "0.375rem" }}>
              {categoryItems.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  className="group flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800/60"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.625rem",
                    padding: "0.5rem 0.875rem",
                    color: "var(--color-text)",
                    textDecoration: "none",
                  }}
                >
                  <span
                    className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#C4933F] group-hover:text-white"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2rem",
                      height: "2rem",
                      backgroundColor: "rgba(196, 147, 63, 0.1)",
                      color: "var(--color-accent)",
                    }}
                  >
                    {cat.icon}
                  </span>
                  <span
                    className="text-[14px] font-semibold tracking-normal transition-colors group-hover:text-[#C4933F]"
                    style={{
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {t(`nav.${cat.labelKey}`)}
                  </span>
                </Link>
              ))}
            </div>

            {/* Separator */}
            <div className="h-6 w-px shrink-0 mx-2" style={{ backgroundColor: "var(--color-border)" }} />

            {/* Stores */}
            <Link
              href="/stores"
              className="group flex items-center gap-2.5 px-3.5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800/60 shrink-0"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.625rem",
                padding: "0.5rem 0.875rem",
                color: "var(--color-text)",
                textDecoration: "none",
              }}
            >
              <span
                className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#C4933F] group-hover:text-white"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2rem",
                  height: "2rem",
                  backgroundColor: "rgba(196, 147, 63, 0.1)",
                  color: "var(--color-accent)",
                }}
              >
                <Store size={18} strokeWidth={1.75} />
              </span>
              <span
                className="text-[14px] font-semibold tracking-normal transition-colors group-hover:text-[#C4933F]"
                style={{ fontSize: "0.9375rem", fontWeight: 600, whiteSpace: "nowrap" }}
              >
                {t("nav.stores")}
              </span>
            </Link>

            {/* Start Selling */}
            <Link
              href="/sell"
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all border shrink-0 hover:opacity-90"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "rgba(196, 147, 63, 0.12)",
                borderColor: "var(--color-accent)",
                color: "var(--color-accent)",
                padding: "0.5rem 1rem",
                textDecoration: "none",
              }}
            >
              <Sparkles size={16} />
              <span>{t("nav.sell")}</span>
              <ArrowIcon size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-40 md:hidden"
            style={{ backgroundColor: "var(--color-surface-overlay)" }}
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          <nav
            className="fixed inset-y-0 z-50 w-80 max-w-[85vw] md:hidden overflow-y-auto"
            style={{
              backgroundColor: "var(--color-surface-elevated)",
              [isRtl ? "right" : "left"]: 0,
            }}
            dir={isRtl ? "rtl" : "ltr"}
          >
            <div className="p-5">
              {/* Close */}
              <div className="flex items-center justify-between mb-6">
                <span className="text-base font-bold" style={{ color: "var(--color-text)" }}>
                  {t("brand.name")}
                </span>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-md"
                  style={{ color: "var(--color-text-muted)" }}
                  aria-label={t("common.close")}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Auth Links */}
              <div className="flex gap-2 mb-6">
                <Link
                  href="/auth/login"
                  onClick={closeMobileMenu}
                  className="flex-1 text-center py-2.5 rounded-md text-sm font-medium"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "var(--color-primary-foreground)",
                  }}
                >
                  {t("common.login")}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={closeMobileMenu}
                  className="flex-1 text-center py-2.5 rounded-md text-sm font-medium border"
                  style={{
                    borderColor: "var(--color-border)",
                    color: "var(--color-text)",
                  }}
                >
                  {t("common.register")}
                </Link>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3 px-1">
                  <h3
                    className="text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--color-text-muted)" }}
                  >
                    {t("nav.categories")}
                  </h3>
                  <Link
                    href="/categories"
                    onClick={closeMobileMenu}
                    className="text-[11px] font-medium"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {t("common.viewAll")}
                  </Link>
                </div>
                <div className="space-y-1">
                  {categoryItems.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${cat.slug}`}
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold transition-colors hover:bg-black/5"
                      style={{ color: "var(--color-text)" }}
                    >
                      <span
                        className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: "rgba(196, 147, 63, 0.1)",
                          color: "var(--color-accent)",
                        }}
                      >
                        {cat.icon}
                      </span>
                      <span>{t(`nav.${cat.labelKey}`)}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-0.5 mb-6 border-t pt-4" style={{ borderColor: "var(--color-border-light)" }}>
                <Link
                  href="/favorites"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  <Heart size={16} style={{ color: "var(--color-text-muted)" }} />
                  {t("common.favorites")}
                </Link>
                <Link
                  href="/stores"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  <Store size={16} style={{ color: "var(--color-text-muted)" }} />
                  {t("nav.stores")}
                </Link>
                <Link
                  href="/orders"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium"
                  style={{ color: "var(--color-accent)" }}
                >
                  <Package size={16} />
                  {t("common.orders")}
                </Link>
              </div>

              {/* Settings */}
              <div
                className="pt-4 border-t space-y-0.5"
                style={{ borderColor: "var(--color-border)" }}
              >
                <button
                  onClick={toggleLocale}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm w-full text-start"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  <Globe size={16} />
                  {otherLocaleName}
                </button>
                <button
                  onClick={toggleTheme}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm w-full"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === "light" ? t("common.darkMode") : t("common.lightMode")}
                </button>
              </div>
            </div>
          </nav>
        </>
      )}
    </header>
  );
}
