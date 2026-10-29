"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  MapPin,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Building,
  Phone,
  User,
  X,
} from "lucide-react";

interface SavedAddress {
  id: string;
  recipientName: string;
  phone: string;
  country: string;
  city: string;
  district: string;
  street: string;
  postalCode?: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [addresses, setAddresses] = useState<SavedAddress[]>([
    {
      id: "addr-001",
      recipientName: "سليمان الفهد",
      phone: "+966 50 123 4567",
      country: "SA",
      city: "الرياض",
      district: "حي النرجس",
      street: "شارع عثمان بن عفان، فيلا 24",
      postalCode: "13324",
      isDefault: true,
    },
    {
      id: "addr-002",
      recipientName: "مكتب الرياض للتقنية",
      phone: "+966 55 987 6543",
      country: "SA",
      city: "جدة",
      district: "حي الروضة",
      street: "طريق الكورنيش، برج الأعمال، الدور 6",
      postalCode: "21453",
      isDefault: false,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRecipient, setNewRecipient] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newCity, setNewCity] = useState("الرياض");
  const [newDistrict, setNewDistrict] = useState("");
  const [newStreet, setNewStreet] = useState("");

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRecipient || !newPhone || !newStreet) return;

    const newAddr: SavedAddress = {
      id: `addr-${Date.now()}`,
      recipientName: newRecipient,
      phone: newPhone,
      country: "SA",
      city: newCity,
      district: newDistrict,
      street: newStreet,
      isDefault: addresses.length === 0,
    };

    setAddresses((prev) => [...prev, newAddr]);
    setIsModalOpen(false);
    setNewRecipient("");
    setNewPhone("");
    setNewDistrict("");
    setNewStreet("");
  };

  return (
    <div className="section-spacing">
      <div className="container-main max-w-3xl mx-auto">
        {/* Back Link */}
        <Link
          href="/account"
          className="inline-flex items-center gap-1.5 text-xs font-semibold mb-6 transition-colors hover:opacity-80"
          style={{ color: "var(--color-primary)" }}
        >
          <ArrowIcon size={14} />
          <span>{isAr ? "العودة إلى الحساب" : "Back to Account"}</span>
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold" style={{ color: "var(--color-text)" }}>
              {isAr ? "العناوين المحفوظة" : "Saved Addresses"}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {isAr
                ? "إدارة عناوين الشحن والتوصيل للطلبات السريعة"
                : "Manage delivery destinations for fast checkout"}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-transform active:scale-95 shadow-sm"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "var(--color-primary-foreground)",
            }}
          >
            <Plus size={16} /> {isAr ? "عنوان جديد" : "Add Address"}
          </button>
        </div>

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div
            className="rounded-xl border p-12 text-center"
            style={{
              borderColor: "var(--color-border-light)",
              backgroundColor: "var(--color-surface-elevated)",
            }}
          >
            <MapPin
              size={44}
              className="mx-auto mb-3 opacity-30"
              style={{ color: "var(--color-text-muted)" }}
            />
            <p className="font-semibold text-sm" style={{ color: "var(--color-text)" }}>
              {isAr ? "لا توجد عناوين محفوظة" : "No saved addresses"}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>
              {isAr
                ? "أضف عنوان استلام لتسريع عمليات الشراء والشحن المستقبلي"
                : "Add a shipping destination for seamless future checkouts"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="rounded-xl border p-5 flex flex-col justify-between transition-all hover:shadow-sm"
                style={{
                  borderColor: addr.isDefault
                    ? "var(--color-primary)"
                    : "var(--color-border-light)",
                  backgroundColor: "var(--color-surface-elevated)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm" style={{ color: "var(--color-text)" }}>
                        {addr.recipientName}
                      </span>
                    </div>
                    {addr.isDefault && (
                      <span
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold"
                        style={{
                          backgroundColor: "rgba(196, 147, 63, 0.12)",
                          color: "var(--color-accent)",
                        }}
                      >
                        <CheckCircle2 size={12} />
                        {isAr ? "العنوان الافتراضي" : "Default"}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <p className="flex items-center gap-2">
                      <Phone size={13} className="shrink-0" />
                      <span dir="ltr">{addr.phone}</span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Building size={13} className="shrink-0 mt-0.5" />
                      <span>
                        {addr.city}، {addr.district}، {addr.street}
                      </span>
                    </p>
                  </div>
                </div>

                <div
                  className="flex items-center justify-between mt-5 pt-3 border-t text-xs"
                  style={{ borderColor: "var(--color-border-light)" }}
                >
                  {!addr.isDefault ? (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="font-semibold transition-colors hover:underline"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {isAr ? "تعيين كافتراضي" : "Set as Default"}
                    </button>
                  ) : (
                    <span />
                  )}

                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                    title={isAr ? "حذف العنوان" : "Delete Address"}
                    aria-label={isAr ? "حذف العنوان" : "Delete Address"}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Address Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div
              className="w-full max-w-md rounded-lg border p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border)",
              }}
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b" style={{ borderColor: "var(--color-border-light)" }}>
                <h3 className="font-bold text-base" style={{ color: "var(--color-text)" }}>
                  {isAr ? "إضافة عنوان توصيل جديد" : "Add New Delivery Address"}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleAddAddress} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                    {isAr ? "اسم المستلم" : "Recipient Full Name"}
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute start-3 top-3 opacity-40" />
                    <input
                      required
                      type="text"
                      value={newRecipient}
                      onChange={(e) => setNewRecipient(e.target.value)}
                      placeholder={isAr ? "مثال: سليمان الفهد" : "e.g. John Doe"}
                      className="w-full ps-9 pe-3 py-2.5 rounded-lg border outline-none"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                    {isAr ? "رقم الهاتف المحمول" : "Phone Number"}
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute start-3 top-3 opacity-40" />
                    <input
                      required
                      type="tel"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      placeholder="+966 5X XXX XXXX"
                      dir="ltr"
                      className="w-full ps-9 pe-3 py-2.5 rounded-lg border outline-none text-start"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                      {isAr ? "المدينة" : "City"}
                    </label>
                    <input
                      required
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-lg border outline-none"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                      {isAr ? "الحي" : "District"}
                    </label>
                    <input
                      type="text"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      placeholder={isAr ? "مثال: النرجس" : "District"}
                      className="w-full px-3 py-2.5 rounded-lg border outline-none"
                      style={{
                        backgroundColor: "var(--color-surface)",
                        borderColor: "var(--color-border)",
                        color: "var(--color-text)",
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1" style={{ color: "var(--color-text)" }}>
                    {isAr ? "الشارع والوصف" : "Street & Building details"}
                  </label>
                  <input
                    required
                    type="text"
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder={isAr ? "شارع عثمان بن عفان، فيلا أو شقة..." : "Street name, Villa/Apt..."}
                    className="w-full px-3 py-2.5 rounded-lg border outline-none"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      borderColor: "var(--color-border)",
                      color: "var(--color-text)",
                    }}
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-4 border-t" style={{ borderColor: "var(--color-border-light)" }}>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-lg border font-semibold text-xs transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ borderColor: "var(--color-border)", color: "var(--color-text)" }}
                  >
                    {isAr ? "إلغاء" : "Cancel"}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg font-semibold text-xs text-white transition-transform active:scale-95 shadow-sm"
                    style={{ backgroundColor: "var(--color-primary)" }}
                  >
                    {isAr ? "حفظ العنوان" : "Save Address"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
