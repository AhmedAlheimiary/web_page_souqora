import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format price from minor currency units */
export function formatPrice(
  amount: number,
  currency: string,
  locale: string = "ar-SA"
): string {
  const majorAmount = amount / 100;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(majorAmount);
}

/** Format number with locale */
export function formatNumber(
  value: number,
  locale: string = "ar-SA"
): string {
  return new Intl.NumberFormat(locale).format(value);
}

/** Format date with locale */
export function formatDate(
  date: Date | string,
  locale: string = "ar-SA",
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(d);
}

/** Generate a URL-safe slug from text */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s]+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

/** Calculate discount percentage */
export function getDiscountPercentage(
  originalPrice: number,
  currentPrice: number
): number {
  if (originalPrice <= 0 || currentPrice >= originalPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/** Safe monetary calculation — add amounts in minor units */
export function addAmounts(...amounts: number[]): number {
  return amounts.reduce((sum, amount) => sum + Math.round(amount), 0);
}

/** Calculate commission from amount (both in minor units) */
export function calculateCommission(
  amount: number,
  percentageRate: number,
  fixedFee: number = 0
): number {
  return Math.round(amount * (percentageRate / 100)) + fixedFee;
}
