import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { createProductSchema, searchSchema } from "@/lib/validations/schemas";
import { ProductStatus, VerificationStatus } from "@prisma/client";
import { slugify } from "@/lib/utils";

// GET /api/products — Search & List products
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = searchSchema.safeParse({
      query: searchParams.get("query") || undefined,
      category: searchParams.get("category") || undefined,
      priceMin: searchParams.get("priceMin")
        ? parseInt(searchParams.get("priceMin")!, 10)
        : undefined,
      priceMax: searchParams.get("priceMax")
        ? parseInt(searchParams.get("priceMax")!, 10)
        : undefined,
      currency: (searchParams.get("currency") as "SAR" | "YER" | "USD") || undefined,
      sortBy: searchParams.get("sortBy") as
        | "relevance"
        | "price_asc"
        | "price_desc"
        | "newest"
        | undefined,
      page: searchParams.get("page")
        ? parseInt(searchParams.get("page")!, 10)
        : 1,
      limit: searchParams.get("limit")
        ? parseInt(searchParams.get("limit")!, 10)
        : 20,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid search parameters", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { query, category, priceMin, priceMax, sortBy, page = 1, limit = 20 } =
      parsed.data;

    // Prisma query filters
    const where: {
      status: ProductStatus;
      category?: { slug: string };
      priceAmount?: { gte?: number; lte?: number };
      OR?: Array<{ title?: { contains: string; mode: "insensitive" } }>;
    } = {
      status: ProductStatus.ACTIVE,
    };

    if (category) {
      where.category = { slug: category };
    }

    if (priceMin !== undefined || priceMax !== undefined) {
      where.priceAmount = {};
      if (priceMin !== undefined) where.priceAmount.gte = priceMin;
      if (priceMax !== undefined) where.priceAmount.lte = priceMax;
    }

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
      ];
    }

    // Sorting
    const orderBy: Array<Record<string, "asc" | "desc">> = [];
    if (sortBy === "price_asc") orderBy.push({ priceAmount: "asc" });
    else if (sortBy === "price_desc") orderBy.push({ priceAmount: "desc" });
    else if (sortBy === "newest") orderBy.push({ createdAt: "desc" });
    else orderBy.push({ featured: "desc" }, { createdAt: "desc" });

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          seller: {
            select: {
              storeName: true,
              storeNameEn: true,
              storeSlug: true,
              verificationStatus: true,
            },
          },
          category: {
            select: { slug: true, name: true, nameEn: true },
          },
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      items: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("Products GET error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/products — Create product (Server-enforced Seller authorization)
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Verify seller profile exists and is approved
    const seller = await prisma.sellerProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!seller) {
      return NextResponse.json(
        { error: "Seller profile not found. Please register as a seller." },
        { status: 403 }
      );
    }

    if (seller.verificationStatus === VerificationStatus.SUSPENDED) {
      return NextResponse.json(
        { error: "Seller account is suspended." },
        { status: 403 }
      );
    }

    const body = await req.json();
    const result = createProductSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid product data", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const {
      title,
      titleEn,
      description,
      descriptionEn,
      categoryId,
      priceAmount,
      priceCurrency,
      compareAtPriceAmount,
      images,
      attributes,
    } = result.data;

    // Verify category exists and allows CART listings
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category || !category.isActive) {
      return NextResponse.json(
        { error: "Category not found or inactive." },
        { status: 400 }
      );
    }

    if (category.listingType !== "CART") {
      return NextResponse.json(
        {
          error:
            "This category requires an inquiry listing instead of a standard product listing.",
        },
        { status: 400 }
      );
    }

    // Generate unique slug
    let baseSlug = slugify(title);
    if (!baseSlug) baseSlug = `product-${Date.now()}`;
    const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 7)}`;

    // Create product with strictly server-enforced sellerId
    const product = await prisma.product.create({
      data: {
        sellerId: seller.id, // Strictly from session, NEVER from client body
        categoryId: category.id,
        slug,
        title: title.trim(),
        titleEn: titleEn?.trim() || null,
        description: description.trim(),
        descriptionEn: descriptionEn?.trim() || null,
        priceAmount,
        priceCurrency,
        compareAtPriceAmount: compareAtPriceAmount || null,
        status: ProductStatus.ACTIVE,
        attributes: attributes ? JSON.parse(JSON.stringify(attributes)) : undefined,
        images: {
          create: images.map((url, index) => ({
            url,
            sortOrder: index,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    // Record audit log
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: "PRODUCT_CREATED",
        entityType: "Product",
        entityId: product.id,
        metadata: {
          title: product.title,
          priceAmount: product.priceAmount,
          currency: product.priceCurrency,
        },
      },
    });

    return NextResponse.json(
      { message: "Product created successfully", product },
      { status: 201 }
    );
  } catch (err) {
    console.error("Product POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
