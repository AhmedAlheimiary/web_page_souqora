"use client";

import { useTranslations, useLocale } from "next-intl";
import { Info, Users, Globe, Shield } from "lucide-react";

export default function AboutPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <div>
      <section className="py-12 md:py-16" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="container-main text-center" style={{ color: "#fff" }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("nav.about")}</h1>
          <p className="text-sm opacity-80">{t("brand.tagline")}</p>
        </div>
      </section>
      <section className="section-spacing">
        <div className="container-main max-w-3xl mx-auto">
          <div className="prose prose-lg" style={{ color: "var(--color-text)" }}>
            <p className="text-base leading-relaxed mb-6" style={{ color: "var(--color-text-muted)" }}>
              {isAr
                ? "سوقرا هي منصة سوق إلكتروني شامل متعدد الفئات، تجمع بين البائعين والمشترين في بيئة آمنة وموثوقة. نقدم تجربة تسوق متكاملة تشمل العقارات، السيارات، الإلكترونيات، الأزياء، المنتجات المنزلية، الألعاب، التجميل والإكسسوارات، والمنتجات الصحية."
                : "SOUQORA is a comprehensive multi-category online marketplace that brings together sellers and buyers in a secure and trusted environment. We offer a complete shopping experience covering real estate, vehicles, electronics, fashion, home products, gaming, beauty & accessories, and healthcare products."}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
              {[
                { icon: <Users size={24} />, title: isAr ? "مجتمع متنامي" : "Growing Community", desc: isAr ? "بائعون ومشترون من السعودية واليمن" : "Sellers and buyers from Saudi Arabia and Yemen" },
                { icon: <Globe size={24} />, title: isAr ? "تعدد الفئات" : "Multi-Category", desc: isAr ? "8 فئات متخصصة بتجارب فريدة" : "8 specialized categories with unique experiences" },
                { icon: <Shield size={24} />, title: isAr ? "أمان وحماية" : "Security", desc: isAr ? "معاملات آمنة ومحمية" : "Secure and protected transactions" },
                { icon: <Info size={24} />, title: isAr ? "دعم محلي" : "Local Support", desc: isAr ? "فريق دعم يتحدث العربية" : "Arabic-speaking support team" },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-lg border" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface-elevated)" }}>
                  <div className="mb-3" style={{ color: "var(--color-accent)" }}>{item.icon}</div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: "var(--color-text)" }}>{item.title}</h3>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
