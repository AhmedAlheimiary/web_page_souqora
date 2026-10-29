import { z } from "zod";

/** Email validation */
export const emailSchema = z.string().email("Invalid email address").min(5).max(255);

/** Password validation — minimum 8 chars, at least one letter and one number */
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128)
  .regex(/[a-zA-Z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

/** Phone number validation */
export const phoneSchema = z
  .string()
  .regex(/^\+?[0-9]{7,15}$/, "Invalid phone number")
  .optional();

/** Login form */
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

/** Registration form */
export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    phone: phoneSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

/** Product creation */
export const createProductSchema = z.object({
  title: z.string().min(3).max(200),
  titleEn: z.string().max(200).optional(),
  description: z.string().min(10).max(5000),
  descriptionEn: z.string().max(5000).optional(),
  categoryId: z.string().uuid(),
  priceAmount: z.number().int().positive("Price must be positive"),
  priceCurrency: z.enum(["SAR", "YER", "USD"]),
  compareAtPriceAmount: z.number().int().positive().optional(),
  images: z.array(z.string().url()).min(1, "At least one image is required"),
  attributes: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])).optional(),
});

/** Property listing creation */
export const createPropertySchema = z.object({
  title: z.string().min(3).max(200),
  titleEn: z.string().max(200).optional(),
  description: z.string().min(10).max(5000),
  descriptionEn: z.string().max(5000).optional(),
  propertyType: z.enum(["APARTMENT", "VILLA", "HOUSE", "LAND", "COMMERCIAL", "OFFICE"]),
  listingMode: z.enum(["SALE", "RENT"]),
  priceAmount: z.number().int().positive(),
  priceCurrency: z.enum(["SAR", "YER", "USD"]),
  pricePeriod: z.enum(["MONTHLY", "YEARLY"]).optional(),
  location: z.string().min(2).max(200),
  city: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  area: z.number().positive(),
  bedrooms: z.number().int().min(0).optional(),
  bathrooms: z.number().int().min(0).optional(),
  furnished: z.boolean(),
  features: z.array(z.string()).optional(),
  images: z.array(z.string().url()).min(1),
});

/** Vehicle listing creation */
export const createVehicleSchema = z.object({
  title: z.string().min(3).max(200),
  titleEn: z.string().max(200).optional(),
  description: z.string().min(10).max(5000),
  descriptionEn: z.string().max(5000).optional(),
  make: z.string().min(1).max(100),
  model: z.string().min(1).max(100),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().int().min(0).optional(),
  condition: z.enum(["NEW", "USED"]),
  fuelType: z.enum(["PETROL", "DIESEL", "ELECTRIC", "HYBRID"]),
  transmission: z.enum(["AUTOMATIC", "MANUAL"]),
  bodyType: z.string().min(1).max(50),
  color: z.string().max(50).optional(),
  priceAmount: z.number().int().positive(),
  priceCurrency: z.enum(["SAR", "YER", "USD"]),
  location: z.string().min(2).max(200),
  images: z.array(z.string().url()).min(1),
  specifications: z.record(z.string(), z.string()).optional(),
});

/** Inquiry form */
export const inquirySchema = z.object({
  name: z.string().min(2).max(100),
  email: emailSchema,
  phone: phoneSchema,
  message: z.string().min(10).max(2000),
});

/** Newsletter subscription */
export const newsletterSchema = z.object({
  email: emailSchema,
  consent: z.boolean().refine((v) => v === true, "Consent is required"),
});

/** Search query */
export const searchSchema = z.object({
  query: z.string().max(200).optional(),
  category: z.string().optional(),
  priceMin: z.number().int().min(0).optional(),
  priceMax: z.number().int().positive().optional(),
  currency: z.enum(["SAR", "YER", "USD"]).optional(),
  sortBy: z.enum(["relevance", "price_asc", "price_desc", "newest"]).optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

/** Seller application form */
export const sellerApplicationSchema = z.object({
  storeName: z.string().min(3, "Store name must be at least 3 characters").max(100),
  storeNameEn: z.string().max(100).optional(),
  storeSlug: z
    .string()
    .min(3)
    .max(50)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000),
  descriptionEn: z.string().max(2000).optional(),
  allowedCategories: z.array(z.string()).min(1, "Select at least one category"),
  country: z.enum(["SA", "YE"], {
    errorMap: () => ({ message: "Country must be SA (Saudi Arabia) or YE (Yemen)" }),
  }),
  city: z.string().min(2).max(100),
  businessRegistrationNumber: z.string().max(50).optional(),
  taxNumber: z.string().max(50).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
export type CreatePropertyInput = z.infer<typeof createPropertySchema>;
export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
export type SellerApplicationInput = z.infer<typeof sellerApplicationSchema>;
