"use client";

import { useLocale } from "next-intl";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b" style={{ borderColor: "var(--color-border-light)" }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between py-4 text-start text-sm font-medium" style={{ color: "var(--color-text)" }}>
        {q}
        <ChevronDown size={16} className={`shrink-0 ms-2 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: "var(--color-text-muted)" }} />
      </button>
      {open && <p className="pb-4 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{a}</p>}
    </div>
  );
}

export default function HelpPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  const faqs = isAr ? [
    { q: "كيف أنشئ حساباً؟", a: "انتقل إلى صفحة التسجيل وأدخل بياناتك الأساسية. ستتلقى رسالة تأكيد على بريدك الإلكتروني." },
    { q: "كيف أبدأ البيع؟", a: "بعد إنشاء حسابك، قدّم طلب بائع من صفحة 'ابدأ البيع'. سيتم مراجعة طلبك والرد عليك." },
    { q: "ما طرق الدفع المدعومة؟", a: "ندعم عدة طرق دفع حسب التوفر في بلدك. يتم تفعيل طرق الدفع بعد التحقق من مزود الخدمة." },
    { q: "كيف أتتبع طلبي؟", a: "يمكنك متابعة حالة طلبك من صفحة 'طلباتي' في حسابك." },
    { q: "ما سياسة الإرجاع؟", a: "تختلف سياسة الإرجاع حسب البائع والمنتج. راجع صفحة الإرجاع والاستبدال للتفاصيل." },
    { q: "هل المنصة آمنة؟", a: "نعم، نستخدم أحدث تقنيات الأمان لحماية بياناتك ومعاملاتك المالية." },
  ] : [
    { q: "How do I create an account?", a: "Go to the registration page and enter your details. You'll receive a confirmation email." },
    { q: "How do I start selling?", a: "After creating your account, submit a seller application from the 'Start Selling' page." },
    { q: "What payment methods are supported?", a: "We support various payment methods depending on availability in your country." },
    { q: "How do I track my order?", a: "You can track your order status from the 'My Orders' page in your account." },
    { q: "What is the return policy?", a: "Return policies vary by seller and product. Check the Returns & Exchanges page." },
    { q: "Is the platform secure?", a: "Yes, we use the latest security technologies to protect your data and transactions." },
  ];

  return (
    <div>
      <section className="py-12 md:py-16" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="container-main text-center" style={{ color: "#fff" }}>
          <HelpCircle size={40} className="mx-auto mb-4" style={{ color: "var(--color-accent)" }} />
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{isAr ? "مركز المساعدة" : "Help Center"}</h1>
        </div>
      </section>
      <section className="section-spacing">
        <div className="container-main max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-6" style={{ color: "var(--color-text)" }}>
            {isAr ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h2>
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface-elevated)" }}>
            <div className="px-4">
              {faqs.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
