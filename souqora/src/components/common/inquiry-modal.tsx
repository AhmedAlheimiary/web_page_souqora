"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import {
  X,
  MessageSquare,
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building,
  Car,
} from "lucide-react";
import { useSession } from "next-auth/react";

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  referenceType?: "PROPERTY" | "VEHICLE" | "HEALTHCARE_CONSULTATION" | "GENERAL";
  referenceId?: string;
  recipientStoreName?: string;
  // Backward compatibility alias props
  itemType?: "property" | "vehicle" | "product";
  itemId?: string;
  itemTitle?: string;
  sellerName?: string;
}

export function InquiryModal({
  isOpen,
  onClose,
  title: propTitle,
  referenceType: propReferenceType,
  referenceId: propReferenceId,
  recipientStoreName: propRecipientStoreName,
  itemType,
  itemId,
  itemTitle,
  sellerName,
}: InquiryModalProps) {
  const locale = useLocale();
  const isAr = locale === "ar";
  const { data: session } = useSession();

  const title = propTitle || itemTitle || "";
  const referenceType =
    propReferenceType ||
    (itemType === "property"
      ? "PROPERTY"
      : itemType === "vehicle"
      ? "VEHICLE"
      : "GENERAL");
  const referenceId = propReferenceId || itemId;
  const recipientStoreName = propRecipientStoreName || sellerName;

  const [name, setName] = useState(session?.user?.name || "");
  const [email, setEmail] = useState(session?.user?.email || "");
  const [phone, setPhone] = useState("+966500000001");
  const [inquiryType, setInquiryType] = useState<
    "QUESTION" | "SCHEDULE_VIEWING" | "PRICE_OFFER"
  >("QUESTION");
  const [offeredAmount, setOfferedAmount] = useState<string>("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: name,
          senderEmail: email,
          senderPhone: phone,
          inquiryType,
          referenceType,
          referenceId,
          offeredAmount: offeredAmount ? Math.round(parseFloat(offeredAmount) * 100) : undefined,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(
          data.error ||
            (isAr
              ? "فشل إرسال الاستفسار، يرجى المحاولة لاحقاً"
              : "Failed to send inquiry, please try again")
        );
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 2500);
    } catch {
      setErrorMessage(
        isAr
          ? "حدث خطأ غير متوقع أثناء إرسال الاستفسار"
          : "An unexpected error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-md rounded-lg border p-5 sm:p-6 relative overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "var(--color-surface-elevated)",
          borderColor: "var(--color-border)",
          color: "var(--color-text)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 end-4 p-1.5 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer"
          style={{ color: "var(--color-text-muted)" }}
          aria-label="Close"
        >
          <X size={16} />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div
              className="w-14 h-14 rounded-full mx-auto flex items-center justify-center"
              style={{
                backgroundColor: "rgba(45, 138, 86, 0.12)",
                color: "var(--color-success)",
              }}
            >
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-base font-bold">
              {isAr ? "تم إرسال استفسارك بنجاح!" : "Inquiry Sent Successfully!"}
            </h3>
            <p className="text-xs max-w-xs mx-auto" style={{ color: "var(--color-text-muted)" }}>
              {isAr
                ? "سيقوم البائع أو الوكيل المعتمد بالتواصل معك قريباً عبر الهاتف أو البريد الإلكتروني."
                : "The authorized seller or agent will contact you shortly via phone or email."}
            </p>
          </div>
        ) : (
          <div>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-md flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "rgba(196, 147, 63, 0.12)",
                  color: "var(--color-accent)",
                }}
              >
                {referenceType === "PROPERTY" ? (
                  <Building size={18} />
                ) : referenceType === "VEHICLE" ? (
                  <Car size={18} />
                ) : (
                  <MessageSquare size={18} />
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold">
                  {isAr ? "إرسال استفسار / طلب معاينة" : "Send Inquiry / Request"}
                </h3>
                <p className="text-[11px] truncate max-w-[240px]" style={{ color: "var(--color-text-muted)" }}>
                  {title} {recipientStoreName ? `— (${recipientStoreName})` : ""}
                </p>
              </div>
            </div>

            {errorMessage && (
              <div
                className="mb-3.5 p-2.5 rounded-md flex items-center gap-2 text-xs"
                style={{
                  backgroundColor: "var(--color-error-light)",
                  border: "1px solid var(--color-error)",
                  color: "var(--color-error)",
                }}
              >
                <AlertCircle size={14} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {/* Inquiry Type */}
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => setInquiryType("QUESTION")}
                  className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
                    inquiryType === "QUESTION" ? "ring-1 font-bold" : "opacity-80"
                  }`}
                  style={{
                    borderColor:
                      inquiryType === "QUESTION"
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  {isAr ? "استفسار عام" : "Question"}
                </button>

                <button
                  type="button"
                  onClick={() => setInquiryType("SCHEDULE_VIEWING")}
                  className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
                    inquiryType === "SCHEDULE_VIEWING" ? "ring-1 font-bold" : "opacity-80"
                  }`}
                  style={{
                    borderColor:
                      inquiryType === "SCHEDULE_VIEWING"
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  {isAr ? "طلب معاينة" : "Schedule Visit"}
                </button>

                <button
                  type="button"
                  onClick={() => setInquiryType("PRICE_OFFER")}
                  className={`p-2 rounded-md border text-center transition-all cursor-pointer ${
                    inquiryType === "PRICE_OFFER" ? "ring-1 font-bold" : "opacity-80"
                  }`}
                  style={{
                    borderColor:
                      inquiryType === "PRICE_OFFER"
                        ? "var(--color-accent)"
                        : "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                >
                  {isAr ? "تقديم سومة/عرض" : "Price Offer"}
                </button>
              </div>

              {/* Name & Phone */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                    {isAr ? "الاسم" : "Your Name"}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border text-xs outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                    {isAr ? "رقم الهاتف" : "Phone"}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border text-xs outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                    dir="ltr"
                    required
                  />
                </div>
              </div>

              {/* Email & Optional Offer */}
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                    {isAr ? "البريد الإلكتروني" : "Email"}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded-md border text-xs outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-text)",
                    }}
                    dir="ltr"
                    required
                  />
                </div>

                {inquiryType === "PRICE_OFFER" && (
                  <div>
                    <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                      {isAr ? "مبلغ العرض (SAR)" : "Offer (SAR)"}
                    </label>
                    <input
                      type="number"
                      value={offeredAmount}
                      onChange={(e) => setOfferedAmount(e.target.value)}
                      placeholder="e.g. 850000"
                      className="w-full px-2.5 py-1.5 rounded-md border text-xs outline-none font-semibold"
                      style={{
                        borderColor: "var(--color-border)",
                        backgroundColor: "var(--color-surface)",
                        color: "var(--color-accent)",
                      }}
                      dir="ltr"
                    />
                  </div>
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-[11px] font-medium mb-1" style={{ color: "var(--color-text-muted)" }}>
                  {isAr ? "نص الرسالة أو الاستفسار" : "Message"}
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder={
                    isAr
                      ? "أود الاستفسار عن تفاصيل المعاينة والمفاوضة..."
                      : "I would like to inquire about viewing and negotiation details..."
                  }
                  className="w-full px-2.5 py-1.5 rounded-md border text-xs outline-none resize-none leading-relaxed"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-text)",
                  }}
                  required
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-md text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>{isAr ? "جاري الإرسال..." : "Sending..."}</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>{isAr ? "إرسال الاستفسار الآن" : "Send Inquiry"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
