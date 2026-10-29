"use client";
import { useLocale } from "next-intl";
import { Truck } from "lucide-react";

export default function ShippingPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  return (
    <div>
      <section className="py-12 md:py-16" style={{ backgroundColor: "var(--color-primary)" }}>
        <div className="container-main text-center" style={{ color: "#fff" }}>
          <Truck size={40} className="mx-auto mb-4" style={{ color: "var(--color-accent)" }} />
          <h1 className="text-2xl md:text-3xl font-bold">{isAr ? "معلومات الشحن" : "Shipping Information"}</h1>
        </div>
      </section>
      <section className="section-spacing">
        <div className="container-main max-w-3xl mx-auto space-y-8">
          {(isAr ? [
            { title: "مناطق الشحن", content: "نوفر خدمة الشحن داخل المملكة العربية السعودية واليمن. تختلف أوقات التوصيل حسب الموقع والبائع." },
            { title: "أوقات التوصيل", content: "داخل المدن الرئيسية: 2-5 أيام عمل. المناطق الأخرى: 5-10 أيام عمل. قد تختلف المدة حسب البائع." },
            { title: "تكاليف الشحن", content: "تحدد تكاليف الشحن من قبل كل بائع على حدة. يتم عرض تكلفة الشحن قبل إتمام الطلب." },
            { title: "تتبع الشحنات", content: "يمكنك تتبع شحنتك من صفحة طلباتك بعد أن يقوم البائع بشحن الطلب." },
          ] : [
            { title: "Shipping Zones", content: "We provide shipping within Saudi Arabia and Yemen. Delivery times vary by location and seller." },
            { title: "Delivery Times", content: "Major cities: 2-5 business days. Other areas: 5-10 business days. Times may vary by seller." },
            { title: "Shipping Costs", content: "Shipping costs are determined by each seller individually. Costs are shown before checkout." },
            { title: "Order Tracking", content: "You can track your shipment from your orders page after the seller ships the order." },
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
