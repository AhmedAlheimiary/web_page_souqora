"use client";
import { useLocale } from "next-intl";
import { RotateCcw } from "lucide-react";

export default function ReturnsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  return (
    <div>
      <section className="py-12 md:py-16" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="container-main text-center" style={{ color: "#fff" }}>
          <RotateCcw size={40} className="mx-auto mb-4" style={{ color: "var(--color-accent)" }} />
          <h1 className="text-2xl md:text-3xl font-bold">{isAr ? "الإرجاع والاستبدال" : "Returns & Exchanges"}</h1>
        </div>
      </section>
      <section className="section-spacing">
        <div className="container-main max-w-3xl mx-auto space-y-8">
          {(isAr ? [
            { title: "سياسة الإرجاع", content: "يحق للمشتري طلب إرجاع المنتج خلال 7 أيام من الاستلام، بشرط أن يكون المنتج في حالته الأصلية وغير مستخدم." },
            { title: "المنتجات غير القابلة للإرجاع", content: "المنتجات الشخصية، الملابس الداخلية، المنتجات الرقمية، والمنتجات المصنعة حسب الطلب لا يمكن إرجاعها." },
            { title: "إجراءات الإرجاع", content: "قدّم طلب إرجاع من صفحة طلباتك. سيراجع البائع الطلب ويرد عليك خلال 3 أيام عمل." },
            { title: "استرداد المبالغ", content: "بعد الموافقة على الإرجاع واستلام المنتج، يتم استرداد المبلغ خلال 5-14 يوم عمل حسب طريقة الدفع." },
          ] : [
            { title: "Return Policy", content: "Buyers may request a return within 7 days of receipt, provided the product is in its original condition and unused." },
            { title: "Non-Returnable Products", content: "Personal items, undergarments, digital products, and custom-made products cannot be returned." },
            { title: "Return Process", content: "Submit a return request from your orders page. The seller will review and respond within 3 business days." },
            { title: "Refunds", content: "After return approval and product receipt, refunds are processed within 5-14 business days depending on payment method." },
          ]).map((s, i) => (
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
