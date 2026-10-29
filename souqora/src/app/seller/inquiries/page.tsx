"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  MessageSquare,
  LayoutDashboard,
  Package,
  FileText,
  ShoppingBag,
  BarChart3,
  CreditCard,
  Building2,
  Car,
  Phone,
  Calendar,
  CheckCircle2,
  Clock,
  Send,
  X,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { PortalGuard } from "@/components/common/portal-guard";

interface InquiryLead {
  id: string;
  senderName: string;
  senderPhone: string;
  senderEmail: string;
  listingType: "PROPERTY" | "VEHICLE";
  listingTitle: string;
  listingSlug: string;
  listedPriceMinor: number;
  offeredPriceMinor?: number;
  message: string;
  preferredDate?: string;
  status: "NEW" | "RESPONDED" | "CLOSED";
  createdAt: string;
}

export default function SellerInquiriesPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const numberLocale = isAr ? "ar-SA" : "en-US";

  const [inquiries, setInquiries] = useState<InquiryLead[]>([
    {
      id: "inq-001",
      senderName: "عبدالله السبيعي",
      senderPhone: "+966 50 889 1234",
      senderEmail: "a.subaie@example.sa",
      listingType: "PROPERTY",
      listingTitle: "فيلا مودرن فاخرة مع مسبح خاص — حي النرجس",
      listingSlug: "luxury-villa-narjis",
      listedPriceMinor: 345000000, // 3,450,000 SAR
      offeredPriceMinor: 330000000, // 3,300,000 SAR (Offer)
      message: "السلام عليكم، هل السعر قابل للتفاوض في حال الدفع كاش دفعة واحدة؟ ويسرني تحديد موعد للمعاينة نهاية هذا الأسبوع.",
      preferredDate: "الجمعة القادمة بعد العصر",
      status: "NEW",
      createdAt: "2026-10-18T09:15:00.000Z",
    },
    {
      id: "inq-002",
      senderName: "م. خالد الحربي",
      senderPhone: "+966 55 432 9876",
      senderEmail: "k.harbi@example.sa",
      listingType: "VEHICLE",
      listingTitle: "تويوتا لاندكروزر VXR 2024 — فل كامل أبيض لؤلؤي",
      listingSlug: "land-cruiser-vxr-2024",
      listedPriceMinor: 36800000, // 368,000 SAR
      offeredPriceMinor: 36000000, // 360,000 SAR
      message: "هل السيارة متوفرة بالفحص الدوري ساري المفعول؟ وهل يمكن فحصها في مركز معتمد بالرياض؟",
      status: "RESPONDED",
      createdAt: "2026-10-17T16:30:00.000Z",
    },
    {
      id: "inq-003",
      senderName: "سارة المنصور",
      senderPhone: "+966 54 112 3344",
      senderEmail: "sara.m@example.sa",
      listingType: "PROPERTY",
      listingTitle: "شقة دوبلكس مودرن مع إطلالة بانورامية — حي الملقا",
      listingSlug: "penthouse-malqa",
      listedPriceMinor: 125000000, // 1,250,000 SAR
      message: "أرغب بالاستفسار عن رسوم اتحاد الملاك السنوية ومساحة الموقف المخصص للشقة.",
      status: "NEW",
      createdAt: "2026-10-17T11:00:00.000Z",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"ALL" | "NEW" | "RESPONDED" | "CLOSED">("ALL");
  const [selectedInquiry, setSelectedInquiry] = useState<InquiryLead | null>(null);
  const [replyMessage, setReplyMessage] = useState("");
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const sidebarLinks = [
    {
      href: "/seller/dashboard",
      icon: <LayoutDashboard size={18} />,
      label: isAr ? "لوحة التحكم" : "Dashboard",
    },
    {
      href: "/seller/products",
      icon: <Package size={18} />,
      label: isAr ? "المنتجات" : "Products",
    },
    {
      href: "/seller/listings",
      icon: <FileText size={18} />,
      label: isAr ? "عقارات وسيارات" : "Listings",
    },
    {
      href: "/seller/inquiries",
      icon: <MessageSquare size={18} />,
      label: isAr ? "استفسارات وعروض" : "Inquiries",
      active: true,
    },
    {
      href: "/seller/orders",
      icon: <ShoppingBag size={18} />,
      label: isAr ? "الطلبات" : "Orders",
    },
    {
      href: "/seller/analytics",
      icon: <BarChart3 size={18} />,
      label: isAr ? "التحليلات" : "Analytics",
    },
    {
      href: "/seller/payments",
      icon: <CreditCard size={18} />,
      label: isAr ? "المدفوعات" : "Payments",
    },
  ];

  const filteredInquiries = inquiries.filter((inq) => {
    if (activeTab === "ALL") return true;
    return inq.status === activeTab;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInquiry) return;

    setInquiries((prev) =>
      prev.map((i) =>
        i.id === selectedInquiry.id ? { ...i, status: "RESPONDED" } : i
      )
    );

    setSuccessToast(
      isAr
        ? `تم إرسال الرد وتأكيد موعد المعاينة إلى ${selectedInquiry.senderName}`
        : `Reply sent successfully to ${selectedInquiry.senderName}`
    );
    setSelectedInquiry(null);
    setReplyMessage("");

    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleCloseInquiry = (id: string) => {
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: "CLOSED" } : i))
    );
  };

  return (
    <PortalGuard requiredRole="seller">
      <div className="section-spacing">
        <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-56 shrink-0">
            <nav
              className="rounded-xl border p-3 space-y-1"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border-light)",
              }}
            >
              {sidebarLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: l.active ? "var(--color-primary)" : "transparent",
                    color: l.active
                      ? "var(--color-primary-foreground)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {l.icon} {l.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Area */}
          <div className="flex-1 space-y-6">
            {/* Header & Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2" style={{ color: "var(--color-text)" }}>
                  <MessageSquare size={22} className="text-blue-500" />
                  <span>{isAr ? "صندوق استفسارات وعروض الأسعار" : "Inquiries & Offers Inbox"}</span>
                </h1>
                <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                  {isAr
                    ? "إدارة طلبات المعاينة والتفاوض على العقارات والسيارات المعروضة"
                    : "Manage viewing appointments and price offers for properties & vehicles"}
                </p>
              </div>

              {/* Status Tabs */}
              <div
                className="flex items-center p-1 rounded-xl border text-xs font-semibold self-start sm:self-auto"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border)",
                }}
              >
                {(
                  [
                    { key: "ALL", label: isAr ? "الكل" : "All" },
                    { key: "NEW", label: isAr ? "جديدة" : "New" },
                    { key: "RESPONDED", label: isAr ? "تم الرد" : "Responded" },
                    { key: "CLOSED", label: isAr ? "مغلقة" : "Closed" },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className="px-3 py-1.5 rounded-lg transition-colors"
                    style={{
                      backgroundColor:
                        activeTab === tab.key ? "var(--color-primary)" : "transparent",
                      color:
                        activeTab === tab.key
                          ? "var(--color-primary-foreground)"
                          : "var(--color-text-muted)",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Success Toast */}
            {successToast && (
              <div
                className="p-3 rounded-lg border text-xs flex items-center gap-2"
                style={{
                  backgroundColor: "rgba(196, 147, 63, 0.08)",
                  borderColor: "var(--color-border-light)",
                  color: "var(--color-text)",
                }}
              >
                <CheckCircle2 size={16} style={{ color: "var(--color-accent)" }} />
                <span>{successToast}</span>
              </div>
            )}

            {/* Inquiries List */}
            {filteredInquiries.length === 0 ? (
              <div
                className="rounded-lg border p-12 text-center"
                style={{
                  backgroundColor: "var(--color-surface-elevated)",
                  borderColor: "var(--color-border-light)",
                }}
              >
                <Clock size={40} className="mx-auto mb-3 opacity-30 text-neutral-400" />
                <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                  {isAr ? "لا توجد استفسارات في هذا التبويب" : "No inquiries found"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredInquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="rounded-lg border p-5 transition-all hover:shadow-sm"
                    style={{
                      backgroundColor: "var(--color-surface-elevated)",
                      borderColor:
                        inq.status === "NEW"
                          ? "var(--color-primary)"
                          : "var(--color-border-light)",
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b" style={{ borderColor: "var(--color-border-light)" }}>
                      <div className="flex items-center gap-2">
                        <span
                          className="p-1.5 rounded-md"
                          style={{
                            backgroundColor:
                              inq.listingType === "PROPERTY"
                                ? "rgba(217, 119, 6, 0.1)"
                                : "rgba(37, 99, 235, 0.1)",
                            color: inq.listingType === "PROPERTY" ? "#d97706" : "#2563eb",
                          }}
                        >
                          {inq.listingType === "PROPERTY" ? <Building2 size={16} /> : <Car size={16} />}
                        </span>
                        <div>
                          <h3 className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                            {inq.listingTitle}
                          </h3>
                          <span className="text-[11px] text-neutral-400 font-mono">
                            {formatPrice(inq.listedPriceMinor, "SAR", numberLocale)} (السعر المعروض)
                          </span>
                        </div>
                      </div>

                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-semibold self-start sm:self-auto"
                        style={{
                          backgroundColor:
                            inq.status === "NEW"
                              ? "rgba(37, 99, 235, 0.1)"
                              : inq.status === "RESPONDED"
                              ? "rgba(196, 147, 63, 0.1)"
                              : "rgba(107, 114, 128, 0.1)",
                          color:
                            inq.status === "NEW"
                              ? "#2563eb"
                              : inq.status === "RESPONDED"
                              ? "var(--color-accent)"
                              : "#6b7280",
                        }}
                      >
                        {inq.status === "NEW"
                          ? (isAr ? "استفسار جديد" : "New Lead")
                          : inq.status === "RESPONDED"
                          ? (isAr ? "تم الرد" : "Responded")
                          : (isAr ? "مغلقة" : "Closed")}
                      </span>
                    </div>

                    {/* Sender Details & Offer */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-3 p-3 rounded-lg bg-black/[0.02] dark:bg-white/[0.02]">
                      <div>
                        <span className="text-neutral-400 block mb-0.5">{isAr ? "العميل المهتم:" : "Sender:"}</span>
                        <span className="font-bold" style={{ color: "var(--color-text)" }}>{inq.senderName}</span>
                      </div>
                      <div>
                        <span className="text-neutral-400 block mb-0.5">{isAr ? "الاتصال المباشر:" : "Phone:"}</span>
                        <a href={`tel:${inq.senderPhone}`} className="font-semibold text-blue-600 hover:underline" dir="ltr">
                          {inq.senderPhone}
                        </a>
                      </div>
                      <div>
                        <span className="text-neutral-400 block mb-0.5">{isAr ? "العرض المالي المقترح:" : "Counter-Offer:"}</span>
                        {inq.offeredPriceMinor ? (
                          <span className="font-bold font-mono" style={{ color: "var(--color-accent)" }}>
                            {formatPrice(inq.offeredPriceMinor, "SAR", numberLocale)}
                          </span>
                        ) : (
                          <span className="text-neutral-400">{isAr ? "لم يقدم سومة" : "No offer specified"}</span>
                        )}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="text-xs p-3 rounded-xl border mb-4 leading-relaxed" style={{ borderColor: "var(--color-border-light)", color: "var(--color-text)" }}>
                      <p className="font-medium text-neutral-400 mb-1">{isAr ? "نص رسالة العميل:" : "Message:"}</p>
                      <p>{inq.message}</p>
                      {inq.preferredDate && (
                        <div className="flex items-center gap-1.5 mt-2 text-amber-600 font-semibold text-[11px]">
                          <Calendar size={13} />
                          <span>{isAr ? "الموعد المقترح للمعاينة:" : "Preferred Viewing:"} {inq.preferredDate}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${inq.senderPhone.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-white transition-opacity hover:opacity-90 shadow-sm"
                          style={{ backgroundColor: "#25D366" }}
                        >
                          <Phone size={13} />
                          <span>WhatsApp</span>
                        </a>
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                          style={{ backgroundColor: "var(--color-primary)" }}
                        >
                          <Send size={13} />
                          <span>{isAr ? "رد وعرض سعر" : "Reply / Schedule"}</span>
                        </button>
                      </div>

                      {inq.status !== "CLOSED" && (
                        <button
                          onClick={() => handleCloseInquiry(inq.id)}
                          className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                        >
                          {isAr ? "إغلاق الاستفسار" : "Close"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quick Response Modal */}
            {selectedInquiry && (
              <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
                <div
                  className="w-full max-w-lg rounded-lg border p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
                  style={{
                    backgroundColor: "var(--color-surface-elevated)",
                    borderColor: "var(--color-border)",
                  }}
                >
                  <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: "var(--color-border-light)" }}>
                    <div>
                      <h3 className="font-bold text-base" style={{ color: "var(--color-text)" }}>
                        {isAr ? "الرد على استفسار العميل" : "Reply to Customer Lead"}
                      </h3>
                      <p className="text-xs text-neutral-400">{selectedInquiry.senderName} • {selectedInquiry.listingTitle}</p>
                    </div>
                    <button
                      onClick={() => setSelectedInquiry(null)}
                      className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSendReply} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                        {isAr ? "نص الرد الرسمي وملاحظات المعاينة" : "Response Message & Appointment Details"}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        placeholder={isAr ? "أهلاً بك أستاذ عبدالله، تم قبول عرض السعر ويشرفنا استقبالكم للمعاينة في الموعد المحدد..." : "Type your response..."}
                        className="w-full p-3 rounded-lg border outline-none leading-relaxed"
                        style={{
                          backgroundColor: "var(--color-surface)",
                          borderColor: "var(--color-border)",
                          color: "var(--color-text)",
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                      <button
                        type="button"
                        onClick={() => setSelectedInquiry(null)}
                        className="px-4 py-2 rounded-lg border font-semibold text-xs"
                        style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                      >
                        {isAr ? "إلغاء" : "Cancel"}
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-lg font-semibold text-xs text-white shadow-sm transition-transform active:scale-95"
                        style={{ backgroundColor: "var(--color-primary)" }}
                      >
                        {isAr ? "إرسال الرد وتأكيد المعاينة" : "Send Response"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </PortalGuard>
);
}
