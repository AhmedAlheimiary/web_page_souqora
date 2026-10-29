"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import {
  Package,
  Plus,
  LayoutDashboard,
  FileText,
  ShoppingBag,
  BarChart3,
  CreditCard,
  Search,
  CheckCircle2,
  Loader2,
  X,
  Sparkles,
} from "lucide-react";
import { demoProducts } from "@/lib/data/demo-data";
import { formatPrice } from "@/lib/utils";
import { PortalGuard } from "@/components/common/portal-guard";

interface ProductItem {
  id: string;
  title: string;
  category: string;
  priceAmount: number;
  currency: string;
  stockQuantity: number;
  imageUrl?: string;
  isDemo?: boolean;
}

export default function SellerProductsPage() {
  const locale = useLocale();
  const isAr = locale === "ar";
  const numberLocale = isAr ? "ar-SA" : "en-US";

  const [products, setProducts] = useState<ProductItem[]>(
    demoProducts.slice(0, 8).map((p) => ({
      id: p.id,
      title: isAr ? p.title : p.titleEn || p.title,
      category: p.categorySlug,
      priceAmount: p.price.amount,
      currency: p.price.currency,
      stockQuantity: 15,
      imageUrl: p.images?.[0]?.url,
      isDemo: true,
    }))
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Product Form State
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("electronics");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("10");
  const [newDescription, setNewDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
      active: true,
    },
    {
      href: "/seller/listings",
      icon: <FileText size={18} />,
      label: isAr ? "عقارات وسيارات" : "Listings",
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

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const priceNumeric = parseFloat(newPrice);
      const priceMinor = Math.round(priceNumeric * 100);

      // Add to local state instantly
      const createdItem: ProductItem = {
        id: `prod-${Date.now()}`,
        title: newTitle,
        category: newCategory,
        priceAmount: priceMinor,
        currency: "SAR",
        stockQuantity: parseInt(newStock, 10) || 1,
        isDemo: true,
      };

      setProducts([createdItem, ...products]);
      setSuccessMessage(
        isAr ? "تمت إضافة المنتج بنجاح إلى متجرك!" : "Product added successfully!"
      );

      setTimeout(() => {
        setSuccessMessage(null);
        setIsAddModalOpen(false);
        setNewTitle("");
        setNewPrice("");
        setNewDescription("");
      }, 1500);
    } catch {
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = products.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PortalGuard requiredRole="seller">
      <div className="section-spacing">
        <div className="container-main">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar */}
          <aside className="w-full lg:w-60 shrink-0">
            <nav
              className="rounded-lg border p-2 space-y-1"
              style={{
                backgroundColor: "var(--color-surface-elevated)",
                borderColor: "var(--color-border-light)",
              }}
            >
              {sidebarLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: l.active
                      ? "var(--color-primary)"
                      : "transparent",
                    color: l.active
                      ? "var(--color-primary-foreground)"
                      : "var(--color-text-muted)",
                  }}
                >
                  {l.icon} <span>{l.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-text)" }}
                >
                  {isAr ? "إدارة منتجات المتجر" : "Store Products"}
                </h1>
                <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {isAr
                    ? `إجمالي المنتجات المسجلة: ${products.length} منتج`
                    : `Total registered products: ${products.length}`}
                </p>
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-transform hover:scale-105"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-accent-foreground)",
                }}
              >
                <Plus size={16} />
                <span>{isAr ? "إضافة منتج جديد" : "Add Product"}</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <Search
                size={16}
                className="absolute top-1/2 -translate-y-1/2 start-3"
                style={{ color: "var(--color-text-muted)" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? "البحث بالاسم أو الفئة..." : "Search by product name..."}
                className="w-full ps-10 pe-4 py-2.5 rounded-xl border text-xs outline-none"
                style={{
                  borderColor: "var(--color-border)",
                  backgroundColor: "var(--color-surface-elevated)",
                  color: "var(--color-text)",
                }}
              />
            </div>

            {/* Products Table */}
            <div
              className="rounded-lg border overflow-hidden"
              style={{
                borderColor: "var(--color-border-light)",
                backgroundColor: "var(--color-surface-elevated)",
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr
                      className="border-b"
                      style={{
                        borderColor: "var(--color-border-light)",
                        color: "var(--color-text-muted)",
                      }}
                    >
                      <th className="py-3 px-4 text-start">{isAr ? "المنتج" : "Product"}</th>
                      <th className="py-3 px-4 text-start">{isAr ? "الفئة" : "Category"}</th>
                      <th className="py-3 px-4 text-start">{isAr ? "السعر (شامل الضريبة)" : "Price"}</th>
                      <th className="py-3 px-4 text-start">{isAr ? "المخزون المتوفر" : "Stock"}</th>
                      <th className="py-3 px-4 text-start">{isAr ? "الحالة" : "Status"}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "var(--color-border-light)" }}>
                    {filtered.map((p) => (
                      <tr key={p.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4 font-medium" style={{ color: "var(--color-text)" }}>
                          <div className="flex items-center gap-2.5">
                            {p.imageUrl ? (
                              <img
                                src={p.imageUrl}
                                alt={p.title}
                                className="w-8 h-8 rounded-md object-cover border shrink-0"
                                style={{ borderColor: "var(--color-border)" }}
                                onError={(e) => {
                                  e.currentTarget.src = `/api/placeholder?cat=${p.category}&title=${encodeURIComponent(p.title)}&w=80&h=80`;
                                }}
                              />
                            ) : (
                              <span className="w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold border shrink-0" style={{ borderColor: "var(--color-border)", backgroundColor: "rgba(196, 147, 63, 0.1)", color: "var(--color-accent)" }}>
                                {p.title.charAt(0)}
                              </span>
                            )}
                            <span className="line-clamp-1">{p.title}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 capitalize" style={{ color: "var(--color-text-muted)" }}>
                          {p.category}
                        </td>
                        <td className="py-3 px-4 font-bold" style={{ color: "var(--color-accent)" }}>
                          {formatPrice(p.priceAmount, p.currency, numberLocale)}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="font-semibold px-2 py-0.5 rounded text-[11px]"
                            style={{
                              backgroundColor:
                                p.stockQuantity > 5
                                  ? "rgba(16, 185, 129, 0.1)"
                                  : "rgba(239, 68, 68, 0.1)",
                              color:
                                p.stockQuantity > 5
                                  ? "var(--color-success)"
                                  : "var(--color-error)",
                            }}
                          >
                            {p.stockQuantity} {isAr ? "قطعة" : "units"}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                            style={{
                              backgroundColor: "rgba(16, 185, 129, 0.12)",
                              color: "var(--color-success)",
                            }}
                          >
                            ✓ {isAr ? "نشط للبيع" : "Active"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div
            className="w-full max-w-lg rounded-lg border p-6 relative overflow-hidden shadow-xl"
            style={{
              backgroundColor: "var(--color-surface-elevated)",
              borderColor: "var(--color-border-light)",
              color: "var(--color-text)",
            }}
          >
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 end-4 p-2 rounded-full hover:opacity-75"
              style={{ color: "var(--color-text-muted)" }}
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "var(--color-accent-foreground)",
                }}
              >
                <Package size={18} />
              </div>
              <h2 className="text-base font-bold">
                {isAr ? "إضافة منتج جديد للمتجر" : "Add New Product"}
              </h2>
            </div>

            {successMessage && (
              <div
                className="mb-4 p-3 rounded-xl flex items-center gap-2 text-xs"
                style={{
                  backgroundColor: "rgba(16, 185, 129, 0.1)",
                  border: "1px solid var(--color-success)",
                  color: "var(--color-success)",
                }}
              >
                <CheckCircle2 size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleCreateProduct} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium mb-1">
                  {isAr ? "اسم المنتج" : "Product Title"}
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder={isAr ? "مثال: هاتف ذكي سامسونج جالكسي S24" : "e.g. Samsung Galaxy S24"}
                  className="w-full px-3 py-2 rounded-lg border outline-none"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">
                    {isAr ? "الفئة" : "Category"}
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                    }}
                  >
                    <option value="electronics">إلكترونيات (Electronics)</option>
                    <option value="fashion">أزياء وموضة (Fashion)</option>
                    <option value="home-living">منزل ومعيشة (Home)</option>
                    <option value="gaming">ألعاب (Gaming)</option>
                    <option value="beauty-accessories">تجميل وإكسسوارات (Beauty)</option>
                    <option value="healthcare">صحة وعناية (Healthcare)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    {isAr ? "السعر بالريال السعودي (SAR)" : "Price (SAR)"}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="299.00"
                    className="w-full px-3 py-2 rounded-lg border outline-none font-semibold"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-accent)",
                    }}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1">
                    {isAr ? "الكمية بالمخزون" : "Stock Quantity"}
                  </label>
                  <input
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium mb-1">
                    {isAr ? "الضمان وحالة السلعة" : "Warranty"}
                  </label>
                  <input
                    type="text"
                    placeholder={isAr ? "ضمان سنتين وكيل معتمد" : "2 Years Agency Warranty"}
                    className="w-full px-3 py-2 rounded-lg border outline-none"
                    style={{
                      borderColor: "var(--color-border)",
                      backgroundColor: "var(--color-surface)",
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium mb-1">
                  {isAr ? "الوصف والمواصفات" : "Description"}
                </label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={3}
                  placeholder={isAr ? "أضف تفاصيل المنتج والميزات والملحقات..." : "Describe product features and specs..."}
                  className="w-full px-3 py-2 rounded-lg border outline-none resize-none"
                  style={{
                    borderColor: "var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                  }}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 rounded-xl font-semibold flex items-center justify-center gap-2 cursor-pointer transition-transform hover:scale-[1.01]"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-primary-foreground)",
                }}
              >
                {isLoading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>{isAr ? "حفظ وعرض في المتجر" : "Publish to Store"}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  </PortalGuard>
);
}
