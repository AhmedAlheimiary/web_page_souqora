import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma, type PrismaTransaction } from "@/lib/db/prisma";
import { sellerApplicationSchema } from "@/lib/validations/schemas";
import { UserRole, VerificationStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const result = sellerApplicationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const userId = session.user.id;

    // Check if user already has a seller profile
    const existingProfile = await prisma.sellerProfile.findUnique({
      where: { userId },
    });

    if (existingProfile) {
      return NextResponse.json(
        { error: "User already has a seller application or profile" },
        { status: 409 }
      );
    }

    // Check if storeSlug is unique
    const existingSlug = await prisma.sellerProfile.findUnique({
      where: { storeSlug: result.data.storeSlug.toLowerCase().trim() },
    });

    if (existingSlug) {
      return NextResponse.json(
        { error: "Store URL slug is already taken" },
        { status: 409 }
      );
    }

    // Create seller profile and update user role in a transaction
    const seller = await prisma.$transaction(async (tx: PrismaTransaction) => {
      const profile = await tx.sellerProfile.create({
        data: {
          userId,
          storeName: result.data.storeName.trim(),
          storeNameEn: result.data.storeNameEn?.trim() || null,
          storeSlug: result.data.storeSlug.toLowerCase().trim(),
          description: result.data.description.trim(),
          descriptionEn: result.data.descriptionEn?.trim() || null,
          allowedCategories: result.data.allowedCategories,
          country: result.data.country,
          city: result.data.city.trim(),
          businessRegistrationNumber:
            result.data.businessRegistrationNumber?.trim() || null,
          taxNumber: result.data.taxNumber?.trim() || null,
          verificationStatus: VerificationStatus.PENDING,
        },
      });

      await tx.user.update({
        where: { id: userId },
        data: { role: UserRole.SELLER },
      });

      await tx.auditLog.create({
        data: {
          userId,
          action: "SELLER_APPLICATION_SUBMITTED",
          entityType: "SellerProfile",
          entityId: profile.id,
          metadata: {
            storeName: profile.storeName,
            storeSlug: profile.storeSlug,
            country: profile.country,
          },
        },
      });

      return profile;
    });

    return NextResponse.json(
      { message: "Seller application submitted successfully", seller },
      { status: 201 }
    );
  } catch (err) {
    console.error("Seller application error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
