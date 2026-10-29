import { PrismaClient, UserRole, ListingType, PropertyType, PropertyListingMode, VehicleCondition, FuelType, TransmissionType, ProductStatus, VerificationStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting SOUQORA seed...");

  // Clear existing records in reverse dependency order
  await prisma.auditLog.deleteMany();
  await prisma.review.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.listingInquiry.deleteMany();
  await prisma.propertyListing.deleteMany();
  await prisma.vehicleListing.deleteMany();
  await prisma.sellerProfile.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const demoPasswordHash = await bcrypt.hash("SouqoraDemo2026!", 10);

  // ─── 1. USERS ──────────────────────────────────────
  const adminUser = await prisma.user.create({
    data: {
      email: "admin@souqora.demo",
      name: "مدير النظام (Demo Admin)",
      passwordHash: demoPasswordHash,
      role: UserRole.ADMIN,
      phone: "+966500000001",
    },
  });

  const sellerUser1 = await prisma.user.create({
    data: {
      email: "tech@souqora.demo",
      name: "أحمد التقني (Demo Seller)",
      passwordHash: demoPasswordHash,
      role: UserRole.VERIFIED_SELLER,
      phone: "+966500000002",
    },
  });

  const sellerUser2 = await prisma.user.create({
    data: {
      email: "fashion@souqora.demo",
      name: "سارة للأزياء (Demo Seller)",
      passwordHash: demoPasswordHash,
      role: UserRole.VERIFIED_SELLER,
      phone: "+966500000003",
    },
  });

  await prisma.user.create({
    data: {
      email: "buyer@souqora.demo",
      name: "محمد الزبون (Demo Buyer)",
      passwordHash: demoPasswordHash,
      role: UserRole.CUSTOMER,
      phone: "+966500000004",
    },
  });

  console.log("✓ Created 4 demo users (Admin, 2 Sellers, 1 Customer)");

  // ─── 2. SELLER PROFILES ────────────────────────────
  const techStore = await prisma.sellerProfile.create({
    data: {
      userId: sellerUser1.id,
      storeName: "متجر التقنية الحديثة",
      storeNameEn: "Modern Tech Store",
      storeSlug: "modern-tech",
      description: "متجر متخصص في الإلكترونيات والأجهزة الذكية وملحقاتها.",
      descriptionEn: "Specialized in smart devices, consumer electronics, and accessories.",
      verificationStatus: VerificationStatus.APPROVED,
      allowedCategories: ["electronics", "gaming"],
      country: "SA",
      city: "الرياض",
    },
  });

  const fashionStore = await prisma.sellerProfile.create({
    data: {
      userId: sellerUser2.id,
      storeName: "دار الأناقة الشرقية",
      storeNameEn: "Anaqah Fashion House",
      storeSlug: "anaqah-fashion",
      description: "أزياء راقية وتصاميم عربية أصيلة وعالمية للرجال والنساء.",
      descriptionEn: "Luxury Arabic and contemporary apparel for men and women.",
      verificationStatus: VerificationStatus.APPROVED,
      allowedCategories: ["fashion", "beauty-accessories"],
      country: "SA",
      city: "جدة",
    },
  });

  console.log("✓ Created 2 approved seller profiles");

  // ─── 3. CATEGORIES ─────────────────────────────────
  const categoriesData = [
    { slug: "real-estate", name: "العقارات", nameEn: "Real Estate", icon: "Building2", listingType: ListingType.INQUIRY, sortOrder: 1, description: "شقق، فلل، أراضي، مكاتب تجارية" },
    { slug: "vehicles", name: "السيارات والمركبات", nameEn: "Cars & Vehicles", icon: "Car", listingType: ListingType.INQUIRY, sortOrder: 2, description: "سيارات جديدة ومستعملة، دراجات نارية" },
    { slug: "electronics", name: "الإلكترونيات", nameEn: "Electronics", icon: "Smartphone", listingType: ListingType.CART, sortOrder: 3, description: "هواتف، حاسبات، أجهزة ذكية وملحقاتها" },
    { slug: "fashion", name: "الأزياء والملابس", nameEn: "Fashion & Clothing", icon: "Shirt", listingType: ListingType.CART, sortOrder: 4, description: "ملابس رجالية ونسائية وأطفال" },
    { slug: "home-living", name: "المنزل والمعيشة", nameEn: "Home & Living", icon: "Sofa", listingType: ListingType.CART, sortOrder: 5, description: "أثاث، أدوات منزلية، إضاءة وديكور" },
    { slug: "beauty-accessories", name: "التجميل والإكسسوارات", nameEn: "Beauty & Accessories", icon: "Sparkles", listingType: ListingType.CART, sortOrder: 6, description: "عطور، ساعات، حقائب، مستحضرات تجميل" },
    { slug: "gaming", name: "الألعاب والقيمنق", nameEn: "Gaming", icon: "Gamepad2", listingType: ListingType.CART, sortOrder: 7, description: "أجهزة ألعاب، ملحقات، وألعاب" },
    { slug: "healthcare", name: "الصحة والصيدلة", nameEn: "Healthcare & Pharmacy", icon: "HeartPulse", listingType: ListingType.RESTRICTED, sortOrder: 8, description: "مستحضرات صحية ومنتجات صيدلانية مرخصة" },
  ];

  const categoryMap = new Map<string, string>();
  for (const cat of categoriesData) {
    const created = await prisma.category.create({ data: cat });
    categoryMap.set(cat.slug, created.id);
  }
  console.log("✓ Created 8 official categories");

  // ─── 4. PHYSICAL PRODUCTS (Electronics & Fashion) ──
  const electronicsCatId = categoryMap.get("electronics")!;
  const fashionCatId = categoryMap.get("fashion")!;

  const phoneProduct = await prisma.product.create({
    data: {
      sellerId: techStore.id,
      categoryId: electronicsCatId,
      slug: "samsung-galaxy-s25-ultra-seed",
      title: "سامسونج جالاكسي S25 الترا 256 جيجابايت",
      titleEn: "Samsung Galaxy S25 Ultra 256GB",
      description: "هاتف رائد بشاشة ديناميك أموليد 2X وكاميرا احترافية بدقة 200 ميجابكسل ودعم القلم S Pen.",
      descriptionEn: "Flagship smartphone featuring Dynamic AMOLED 2X, 200MP pro camera and S Pen support.",
      priceAmount: 459900, // 4,599.00 SAR
      priceCurrency: "SAR",
      compareAtPriceAmount: 499900,
      status: ProductStatus.ACTIVE,
      featured: true,
      attributes: { brand: "Samsung", storage: "256GB", ram: "12GB", color: "Titanium Black" },
    },
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: phoneProduct.id, sku: "SAM-S25U-BLK", title: "أسود تيتانيوم", priceAmount: 459900, stockQuantity: 25, attributes: { color: "Titanium Black" } },
      { productId: phoneProduct.id, sku: "SAM-S25U-GRY", title: "رمادي تيتانيوم", priceAmount: 459900, stockQuantity: 15, attributes: { color: "Titanium Gray" } },
    ],
  });

  const thobeProduct = await prisma.product.create({
    data: {
      sellerId: fashionStore.id,
      categoryId: fashionCatId,
      slug: "classic-white-thobe-seed",
      title: "ثوب رجالي كلاسيكي أبيض قطن فاخر",
      titleEn: "Classic White Men's Premium Cotton Thobe",
      description: "ثوب رجالي مفصل من أجود أنواع القطن المقاوم للتجعد ومناسب لكافة المناسبات الرسمية.",
      descriptionEn: "Tailored men's thobe made from wrinkle-resistant premium cotton for all formal occasions.",
      priceAmount: 29900, // 299.00 SAR
      priceCurrency: "SAR",
      status: ProductStatus.ACTIVE,
      featured: true,
      attributes: { material: "100% Cotton", color: "White", style: "Saudi Classic" },
    },
  });

  await prisma.productVariant.createMany({
    data: [
      { productId: thobeProduct.id, sku: "THB-WHT-54", title: "مقاس 54", priceAmount: 29900, stockQuantity: 30, attributes: { size: "54" } },
      { productId: thobeProduct.id, sku: "THB-WHT-56", title: "مقاس 56", priceAmount: 29900, stockQuantity: 40, attributes: { size: "56" } },
      { productId: thobeProduct.id, sku: "THB-WHT-58", title: "مقاس 58", priceAmount: 29900, stockQuantity: 20, attributes: { size: "58" } },
    ],
  });

  console.log("✓ Created demo products and inventory variants");

  // ─── 5. REAL ESTATE LISTINGS (Inquiry Based) ───────
  await prisma.propertyListing.create({
    data: {
      sellerId: techStore.id,
      slug: "luxury-apartment-riyadh-narjis-seed",
      title: "شقة تمليك فاخرة بحي النرجس - شمال الرياض",
      titleEn: "Luxury Apartment for Sale in Al Narjis - North Riyadh",
      description: "شقة حديثة بتشطيب سوبر ديلوكس، سمارت هوم، وموقف خاص وقريبة من طريق الملك سلمان.",
      descriptionEn: "Modern luxury apartment featuring super deluxe finishes, smart home tech, and private parking.",
      propertyType: PropertyType.APARTMENT,
      listingMode: PropertyListingMode.SALE,
      priceAmount: BigInt(85000000), // 850,000.00 SAR
      priceCurrency: "SAR",
      location: "حي النرجس، تقاطع طريق عثمان بن عفان",
      city: "الرياض",
      country: "SA",
      area: 185.5,
      bedrooms: 3,
      bathrooms: 3,
      furnished: false,
      features: ["موقف خاص", "مصعد", "تكييف مركزي", "دخول ذكي"],
      status: ProductStatus.ACTIVE,
    },
  });

  // ─── 6. VEHICLE LISTINGS (Inquiry Based) ───────────
  await prisma.vehicleListing.create({
    data: {
      sellerId: techStore.id,
      slug: "toyota-camry-2025-seed",
      title: "تويوتا كامري 2025 قراندي فل كامل",
      titleEn: "Toyota Camry 2025 Grande Fully Loaded",
      description: "كامري موديل 2025 بحالة الوكالة، عداد 15 ألف كم فقط، صيانة دورية بالوكالة وبلا صدمات.",
      descriptionEn: "2025 Toyota Camry Grande in agency mint condition, 15k km, full dealership history.",
      make: "Toyota",
      model: "Camry",
      year: 2025,
      mileage: 15000,
      condition: VehicleCondition.USED,
      fuelType: FuelType.PETROL,
      transmission: TransmissionType.AUTOMATIC,
      bodyType: "Sedan",
      color: "White Pearl",
      priceAmount: BigInt(11500000), // 115,000.00 SAR
      priceCurrency: "SAR",
      location: "معارض الرياض - القادسية",
      specifications: { engine: "2.5L 4-Cylinder", power: "204 HP", sunroof: "Panoramic" },
      status: ProductStatus.ACTIVE,
    },
  });

  // ─── 7. AUDIT LOG INITIAL RECORD ───────────────────
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: "PLATFORM_INITIALIZED",
      entityType: "System",
      entityId: "SYSTEM_ROOT",
      metadata: { seedVersion: "1.0.0", environment: "development" },
    },
  });

  console.log("✅ SOUQORA seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
