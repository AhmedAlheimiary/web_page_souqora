"use client";
import Link from "next/link";
import { useLocale } from "next-intl";
import { User, MapPin, Shield, ShoppingBag, Heart } from "lucide-react";

export default function AccountPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const links = [
    { href: "/orders", icon: <ShoppingBag size={20} />, label: isAr ? "طلباتي" : "My Orders", desc: isAr ? "تتبع طلباتك ومشترياتك" : "Track your orders and purchases" },
    { href: "/favorites", icon: <Heart size={20} />, label: isAr ? "المفضلة" : "Favorites", desc: isAr ? "المنتجات المحفوظة" : "Saved products" },
    { href: "/account/addresses", icon: <MapPin size={20} />, label: isAr ? "العناوين" : "Addresses", desc: isAr ? "إدارة عناوين الشحن" : "Manage shipping addresses" },
    { href: "/account/security", icon: <Shield size={20} />, label: isAr ? "الأمان" : "Security", desc: isAr ? "كلمة المرور وإعدادات الأمان" : "Password and security settings" },
  ];

  return (
    <div className="section-spacing">
      <div className="container-main max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "var(--color-surface-alt)", color: "var(--color-text-muted)" }}>
            <User size={32} />
          </div>
          <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>{isAr ? "حسابي" : "My Account"}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
            {isAr ? "سجّل الدخول لإدارة حسابك" : "Login to manage your account"}
          </p>
          <Link href="/auth/login" className="inline-flex mt-4 px-6 py-2.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
            {isAr ? "تسجيل الدخول" : "Login"}
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="flex items-start gap-3 p-5 rounded-xl border transition-all hover:shadow-md" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface-elevated)" }}>
              <span style={{ color: "var(--color-accent)" }}>{link.icon}</span>
              <div>
                <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{link.label}</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{link.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
