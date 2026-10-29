"use client";
import { useLocale } from "next-intl";
import { FileText } from "lucide-react";

export default function TermsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const sections = isAr ? [
    { title: "القبول", content: "باستخدام منصة سوقرا، فإنك توافق على هذه الشروط والأحكام. إذا لم توافق، يرجى عدم استخدام المنصة." },
    { title: "الحسابات", content: "أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور. يجب أن تكون المعلومات المقدمة صحيحة ودقيقة." },
    { title: "البائعون", content: "يجب على البائعين تقديم معلومات صحيحة عن منتجاتهم وخدماتهم. يحظر بيع المنتجات المحظورة أو المقلدة." },
    { title: "المشترون", content: "يتعهد المشتري بتقديم معلومات صحيحة وعدم إساءة استخدام المنصة أو التلاعب بالتقييمات." },
    { title: "المدفوعات", content: "تتم معالجة المدفوعات عبر مزودي خدمات دفع معتمدين. لا تخزن المنصة بيانات البطاقات الائتمانية." },
    { title: "المسؤولية", content: "المنصة وسيط بين البائع والمشتري. لا نتحمل مسؤولية جودة المنتجات المباعة من قبل البائعين المستقلين." },
    { title: "التعديلات", content: "نحتفظ بحق تعديل هذه الشروط في أي وقت. سيتم إشعارك بالتغييرات الجوهرية." },
  ] : [
    { title: "Acceptance", content: "By using SOUQORA, you agree to these terms and conditions. If you do not agree, please do not use the platform." },
    { title: "Accounts", content: "You are responsible for maintaining the confidentiality of your account and password. Information provided must be accurate." },
    { title: "Sellers", content: "Sellers must provide accurate information about their products and services. Selling prohibited or counterfeit products is not allowed." },
    { title: "Buyers", content: "Buyers agree to provide accurate information and not misuse the platform or manipulate reviews." },
    { title: "Payments", content: "Payments are processed through approved payment service providers. The platform does not store credit card data." },
    { title: "Liability", content: "The platform is an intermediary between buyer and seller. We are not responsible for the quality of products sold by independent sellers." },
    { title: "Modifications", content: "We reserve the right to modify these terms at any time. You will be notified of material changes." },
  ];

  return (
    <div>
      <section className="py-12 md:py-16" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="container-main text-center" style={{ color: "#fff" }}>
          <FileText size={40} className="mx-auto mb-4" style={{ color: "var(--color-accent)" }} />
          <h1 className="text-2xl md:text-3xl font-bold">{isAr ? "الشروط والأحكام" : "Terms & Conditions"}</h1>
        </div>
      </section>
      <section className="section-spacing">
        <div className="container-main max-w-3xl mx-auto space-y-6">
          {sections.map((s, i) => (
            <div key={i} className="p-6 rounded-lg border" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface-elevated)" }}>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--color-text)" }}>{i + 1}. {s.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{s.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
