/* ============================================
   SOUQORA — Shared TypeScript Types
   ============================================ */

// ─── Currency & Money ───────────────────────
export type CurrencyCode = "SAR" | "YER" | "USD";

export interface Money {
  /** Amount in minor currency units (e.g. halalas, fils) */
  amount: number;
  currency: CurrencyCode;
}

// ─── User & Auth ────────────────────────────
export type UserRole =
  | "CUSTOMER"
  | "SELLER"
  | "VERIFIED_SELLER"
  | "MODERATOR"
  | "ADMIN";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Seller ─────────────────────────────────
export type VerificationStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";

export interface SellerProfile {
  id: string;
  userId: string;
  storeName: string;
  storeNameEn?: string;
  storeSlug: string;
  description?: string;
  descriptionEn?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  verificationStatus: VerificationStatus;
  allowedCategories: string[];
  contactEmail?: string;
  contactPhone?: string;
  country: string;
  city?: string;
  createdAt: string;
}

// ─── Category ───────────────────────────────
export type CategorySlug =
  | "real-estate"
  | "healthcare"
  | "fashion"
  | "home-living"
  | "gaming"
  | "beauty-accessories"
  | "vehicles"
  | "electronics";

export type ListingType = "CART" | "INQUIRY" | "RESTRICTED";

export interface Category {
  id: string;
  slug: CategorySlug;
  name: string;
  nameEn: string;
  description?: string;
  descriptionEn?: string;
  icon: string;
  image?: string;
  listingType: ListingType;
  parentId?: string;
  sortOrder: number;
}

export interface SubCategory {
  id: string;
  slug: string;
  name: string;
  nameEn: string;
  parentSlug: CategorySlug;
  sortOrder: number;
}

// ─── Product (Cart-based categories) ────────
export type ProductStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "ACTIVE"
  | "REJECTED"
  | "SUSPENDED"
  | "ARCHIVED";

export interface Product {
  id: string;
  slug: string;
  sellerId: string;
  categoryId: string;
  categorySlug: CategorySlug;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  price: Money;
  compareAtPrice?: Money;
  images: ProductImage[];
  status: ProductStatus;
  featured: boolean;
  variants?: ProductVariant[];
  attributes: Record<string, string | number | boolean>;
  seller?: SellerProfile;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt?: string;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  price: Money;
  compareAtPrice?: Money;
  stockQuantity: number;
  attributes: Record<string, string>;
}

// ─── Real Estate (Inquiry-based) ────────────
export type PropertyType =
  | "APARTMENT"
  | "VILLA"
  | "HOUSE"
  | "LAND"
  | "COMMERCIAL"
  | "OFFICE";

export type PropertyListingMode = "SALE" | "RENT";

export interface PropertyListing {
  id: string;
  slug: string;
  sellerId: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  propertyType: PropertyType;
  listingMode: PropertyListingMode;
  price: Money;
  pricePeriod?: "MONTHLY" | "YEARLY";
  location: string;
  city: string;
  country: string;
  area: number; // sqm
  bedrooms?: number;
  bathrooms?: number;
  furnished: boolean;
  features: string[];
  images: ProductImage[];
  status: ProductStatus;
  seller?: SellerProfile;
  createdAt: string;
}

// ─── Vehicles (Inquiry-based) ───────────────
export type VehicleCondition = "NEW" | "USED";
export type FuelType = "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID";
export type TransmissionType = "AUTOMATIC" | "MANUAL";

export interface VehicleListing {
  id: string;
  slug: string;
  sellerId: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition: VehicleCondition;
  fuelType: FuelType;
  transmission: TransmissionType;
  bodyType: string;
  color?: string;
  price: Money;
  location: string;
  images: ProductImage[];
  specifications: Record<string, string>;
  status: ProductStatus;
  seller?: SellerProfile;
  createdAt: string;
}

// ─── Cart & Order ───────────────────────────
export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  product: Product;
  variant?: ProductVariant;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type PaymentStatus =
  | "PENDING"
  | "PROCESSING"
  | "PAID"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED";

export interface OrderSummary {
  subtotal: Money;
  shippingCost: Money;
  discount: Money;
  commission: Money;
  total: Money;
  sellerPayable: Money;
}

// ─── Inquiry ────────────────────────────────
export type InquiryType = "PROPERTY" | "VEHICLE" | "HEALTHCARE";

export interface ListingInquiry {
  id: string;
  listingType: InquiryType;
  listingId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  message: string;
  status: "NEW" | "READ" | "RESPONDED" | "CLOSED";
  createdAt: string;
}

// ─── Store ──────────────────────────────────
export interface Store {
  id: string;
  name: string;
  nameEn?: string;
  slug: string;
  description?: string;
  descriptionEn?: string;
  logoUrl?: string;
  coverImageUrl?: string;
  verified: boolean;
  category?: string;
  productCount: number;
  rating?: number;
  reviewCount?: number;
}

// ─── Search & Filter ────────────────────────
export interface SearchFilters {
  query?: string;
  category?: CategorySlug;
  subcategory?: string;
  priceMin?: number;
  priceMax?: number;
  currency?: CurrencyCode;
  sortBy?: "relevance" | "price_asc" | "price_desc" | "newest";
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Review ─────────────────────────────────
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ─── Demo Data Flag ─────────────────────────
export interface WithDemoFlag {
  isDemo: boolean;
}
