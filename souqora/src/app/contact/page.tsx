"use client";

import { useTranslations, useLocale } from "next-intl";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <div>
      <section className="py-12 md:py-16" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="container-main text-center" style={{ color: "#fff" }}>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{t("nav.contact")}</h1>
        </div>
      </section>
      <section className="section-spacing">
        <div className="container-main max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[
                { icon: <Mail size={20} />, label: isAr ? "البريد الإلكتروني" : "Email", value: "support@souqora.com" },
                { icon: <Phone size={20} />, label: isAr ? "الهاتف" : "Phone", value: "+966 XX XXX XXXX" },
                { icon: <MapPin size={20} />, label: isAr ? "الموقع" : "Location", value: isAr ? "المملكة العربية السعودية" : "Saudi Arabia" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg border" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface-elevated)" }}>
                  <div className="shrink-0 mt-0.5" style={{ color: "var(--color-accent)" }}>{item.icon}</div>
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: "var(--color-text)" }}>{item.label}</h3>
                    <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-3">
              <form onSubmit={(e) => e.preventDefault()} className="rounded-lg border p-6 space-y-4" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface-elevated)" }}>
                <h2 className="text-lg font-semibold mb-2" style={{ color: "var(--color-text)" }}>{isAr ? "أرسل لنا رسالة" : "Send us a message"}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>{isAr ? "الاسم" : "Name"}</label>
                    <input type="text" className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>{t("auth.email")}</label>
                    <input type="email" className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} dir="ltr" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>{isAr ? "الموضوع" : "Subject"}</label>
                  <input type="text" className="w-full px-3 py-2.5 rounded-lg border text-sm" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: "var(--color-text)" }}>{isAr ? "الرسالة" : "Message"}</label>
                  <textarea rows={5} className="w-full px-3 py-2.5 rounded-lg border text-sm resize-none" style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-surface)", color: "var(--color-text)", fontFamily: "inherit" }} required />
                </div>
                <button type="submit" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold" style={{ backgroundColor: "var(--color-primary)", color: "var(--color-primary-foreground)" }}>
                  <Send size={16} />
                  {t("common.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
