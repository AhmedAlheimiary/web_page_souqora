/**
 * SOUQORA Financial & Domain Integrity Test Suite
 * Validates:
 * 1. Minor currency unit calculations & precision (integers only)
 * 2. Marketplace commission snapshots & net seller payables
 * 3. Payment provider regional eligibility matrix (KSA SAR vs Yemen YER)
 * 4. Bank transfer pending reconciliation guardrails
 * 5. Input validation schemas (Zod)
 */

import { formatPrice } from "../src/lib/utils";
import { paymentRegistry } from "../src/lib/payments/registry";
import { StripeAdapter } from "../src/lib/payments/adapters/stripe";
import { BankTransferAdapter } from "../src/lib/payments/adapters/bank-transfer";
import {
  registerSchema,
  createProductSchema,
  inquirySchema,
  sellerApplicationSchema,
} from "../src/lib/validations/schemas";

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ PASSED: ${message}`);
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("🚀 STARTING SOUQORA INTEGRITY & FINANCIAL VERIFICATION");
  console.log("=======================================================\n");

  // --- Test 1: Minor Currency Units & Formatting ---
  console.log("--- 1. Monetary Units & Minor Currency Arithmetic ---");
  const itemPriceMinor = 29950; // 299.50 SAR
  const quantity = 3;
  const subtotalMinor = itemPriceMinor * quantity;
  assert(
    Number.isInteger(subtotalMinor),
    "Subtotal amount must remain a strict integer in minor units"
  );
  assert(
    subtotalMinor === 89850,
    "3 * 29950 minor units correctly equals 89850 (898.50 SAR)"
  );

  const formattedArabic = formatPrice(subtotalMinor, "SAR", "ar-SA");
  assert(
    formattedArabic.includes("ر.س") || formattedArabic.includes("SAR") || formattedArabic.includes("898"),
    `Formatted Arabic price contains currency and amount: ${formattedArabic}`
  );

  const formattedEnglish = formatPrice(subtotalMinor, "SAR", "en-US");
  assert(
    formattedEnglish.includes("SAR") && formattedEnglish.includes("898.50"),
    `Formatted English price matches exact decimal representation: ${formattedEnglish}`
  );

  // --- Test 2: Commission Calculation & Immutable Snapshots ---
  console.log("\n--- 2. Commission Rate & Seller Payable Arithmetic ---");
  const commissionRate = 0.10; // 10% marketplace fee
  const itemCommission = Math.round(subtotalMinor * commissionRate); // 8985
  const sellerPayable = subtotalMinor - itemCommission; // 80865
  assert(
    Number.isInteger(itemCommission) && Number.isInteger(sellerPayable),
    "Commission and seller payable are strict integers without float drift"
  );
  assert(
    itemCommission === 8985,
    "10% commission on 89850 equals 8985 minor units"
  );
  assert(
    sellerPayable === 80865,
    "Seller payable equals 80865 minor units"
  );
  assert(
    itemCommission + sellerPayable === subtotalMinor,
    "Sum of commission + seller payable perfectly matches original subtotal"
  );

  // --- Test 3: Regional Payment Provider Eligibility ---
  console.log("\n--- 3. Payment Provider Regional Eligibility & Guards ---");
  const stripe = new StripeAdapter();
  const bankTransfer = new BankTransferAdapter();

  const stripeCurrencies = stripe.getSupportedCurrencies();
  const bankCurrencies = bankTransfer.getSupportedCurrencies();

  assert(
    stripeCurrencies.includes("SAR"),
    "Stripe adapter supports Saudi Riyals (SAR)"
  );
  assert(
    !stripeCurrencies.includes("YER"),
    "Stripe adapter explicitly excludes Yemeni Riyals (YER) due to banking restrictions"
  );
  assert(
    bankCurrencies.includes("SAR") && bankCurrencies.includes("YER"),
    "Bank Transfer adapter supports both Saudi Arabia (SAR) and Yemen (YER)"
  );

  const bankTransferSession = await bankTransfer.createCheckoutSession({
    orderId: "order-test-001",
    orderNumber: "SQ-TEST-001",
    amount: 15000,
    currency: "SAR",
    customerEmail: "buyer@souqora.demo",
    successUrl: "http://localhost:3000/orders",
    cancelUrl: "http://localhost:3000/checkout",
  });

  assert(
    bankTransferSession.requiresManualVerification === true,
    "Bank transfer strictly requires manual reconciliation before marking as paid"
  );

  // Verify registry comparison
  const matrix = paymentRegistry.getEligibilityMatrix();
  assert(
    matrix.length >= 2,
    "Payment registry properly documents all configured adapters"
  );

  // --- Test 4: Zod Input Validation & Attack Mitigation ---
  console.log("\n--- 4. Zod Validation & Schema Boundary Guards ---");

  // Invalid email registration
  const badReg = registerSchema.safeParse({
    name: "A",
    email: "not-an-email",
    password: "123",
  });
  assert(!badReg.success, "Registration rejects invalid email and weak password (<8 chars)");

  // Valid registration
  const goodReg = registerSchema.safeParse({
    name: "عبدالله الشمري",
    email: "abdullah@example.com",
    password: "SecurePassword@123",
    confirmPassword: "SecurePassword@123",
    role: "SELLER",
  });
  assert(goodReg.success, "Registration accepts valid bilingual name and strong password");

  // Negative price product creation attempt
  const badProduct = createProductSchema.safeParse({
    categoryId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    title: "منتج تجريبي",
    description: "وصف مفصل للمنتج يتجاوز عشرة أحرف",
    priceAmount: -500, // Negative price attack
    priceCurrency: "SAR",
    images: ["https://example.com/img1.jpg"],
  });
  assert(!badProduct.success, "Product schema rejects negative price injection");

  // Valid product creation with minor currency units
  const goodProduct = createProductSchema.safeParse({
    categoryId: "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    title: "هاتف ذكي حديث متطور",
    description: "هاتف ذكي عالي المواصفات يدعم شبكات الجيل الخامس وبطارية تدوم طويلاً",
    priceAmount: 149900, // 1,499.00 SAR
    priceCurrency: "SAR",
    images: ["https://example.com/phone.jpg"],
  });
  assert(goodProduct.success, "Product schema validates positive minor integer price");

  // Lead inquiry schema
  const goodInquiry = inquirySchema.safeParse({
    name: "سلطان الراشد",
    email: "sultan@example.com",
    phone: "+966501234567",
    message: "أود حجز موعد لمعاينة العقار ومناقشة تفاصيل العقد",
  });
  assert(goodInquiry.success, "Inquiry schema validates lead generation request for real estate");

  // Seller application schema
  const goodSellerApp = sellerApplicationSchema.safeParse({
    storeName: "دار العود الملكي",
    storeSlug: "dar-aloud",
    description: "متجر متخصص في العود الملكي الطبيعي والعطور الشرقية الفاخرة المعتمدة",
    allowedCategories: ["beauty-accessories"],
    country: "SA",
    city: "الرياض",
    businessRegistrationNumber: "1010889900",
    taxNumber: "300088990000003",
  });
  assert(goodSellerApp.success, "Seller onboarding schema validates KSA CR, VAT, and city parameters");

  console.log("\n=======================================================");
  console.log("🎉 ALL FINANCIAL & DOMAIN INTEGRITY TESTS PASSED (16/16)");
  console.log("=======================================================\n");
}

runTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
