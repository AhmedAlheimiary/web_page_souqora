"use client";
import { useLocale } from "next-intl";
import { Shield } from "lucide-react";

export default function PrivacyPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const sections = isAr ? [
    { title: "جمع البيانات", content: "نجمع البيانات الضرورية لتقديم خدماتنا، مثل الاسم والبريد الإلكتروني ورقم الهاتف وعنوان الشحن. لا نجمع بيانات غير ضرورية." },
    { title: "استخدام البيانات", content: "نستخدم بياناتك لمعالجة الطلبات، التواصل معك، تحسين خدماتنا، وإرسال إشعارات الطلبات. لا نبيع بياناتك لأطراف ثالثة." },
    { title: "حماية البيانات", content: "نستخدم تشفير SSL وإجراءات أمنية متقدمة لحماية بياناتك. نحافظ على سرية معلوماتك المالية والشخصية." },
    { title: "ملفات تعريف الارتباط", content: "نستخدم ملفات تعريف الارتباط لتحسين تجربة التصفح وتذكر تفضيلاتك. يمكنك تعطيلها من إعدادات المتصفح." },
    { title: "حقوقك", content: "يحق لك طلب الوصول إلى بياناتك، تعديلها، أو حذفها. تواصل معنا عبر صفحة الاتصال لممارسة حقوقك." },
  ] : [
    { title: "Data Collection", content: "We collect data necessary to provide our services, such as name, email, phone number, and shipping address. We do not collect unnecessary data." },
    { title: "Data Use", content: "We use your data to process orders, communicate with you, improve our services, and send order notifications. We do not sell your data to third parties." },
    { title: "Data Protection", content: "We use SSL encryption and advanced security measures to protect your data. We maintain the confidentiality of your financial and personal information." },
    { title: "Cookies", content: "We use cookies to improve browsing experience and remember your preferences. You can disable them from your browser settings." },
    { title: "Your Rights", content: "You have the right to access, modify, or delete your data. Contact us through the contact page to exercise your rights." },
  ];

  return (
    <div>
      <section className="py-12 md:py-16" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="container-main text-center" style={{ color: "#fff" }}>
          <Shield size={40} className="mx-auto mb-4" style={{ color: "var(--color-accent)" }} />
          <h1 className="text-2xl md:text-3xl font-bold">{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</h1>
        </div>
      </section>
      <section className="section-spacing">
        <div className="container-main max-w-3xl mx-auto space-y-6">
          {sections.map((s, i) => (
            <div key={i} className="p-6 rounded-lg border" style={{ borderColor: "var(--color-border-light)", backgroundColor: "var(--color-surface-elevated)" }}>
              <h2 className="text-base font-semibold mb-2" style={{ color: "var(--color-text)" }}>{s.title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{s.content}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
