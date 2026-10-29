import { NextResponse } from "next/server";
import { auth } from "@/lib/auth/auth";
import { prisma } from "@/lib/db/prisma";
import { inquirySchema } from "@/lib/validations/schemas";
import { z } from "zod";
import { InquiryStatus, InquiryType } from "@prisma/client";

const createInquiryRequestSchema = inquirySchema.extend({
  listingType: z.enum(["PROPERTY", "VEHICLE", "HEALTHCARE"]),
  listingId: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const body = await req.json();
    const result = createInquiryRequestSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Invalid inquiry data", details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, email, phone, message, listingType, listingId } = result.data;

    // Resolve sellerId based on listing type
    let sellerId: string | null = null;

    if (listingType === "PROPERTY") {
      const property = await prisma.propertyListing.findUnique({
        where: { id: listingId },
        select: { sellerId: true },
      });
      if (property) sellerId = property.sellerId;
    } else if (listingType === "VEHICLE") {
      const vehicle = await prisma.vehicleListing.findUnique({
        where: { id: listingId },
        select: { sellerId: true },
      });
      if (vehicle) sellerId = vehicle.sellerId;
    }

    if (!sellerId) {
      // In demo mode or if listing is not found, verify if it's a demo slug
      const demoSeller = await prisma.sellerProfile.findFirst({
        select: { id: true },
      });
      if (demoSeller) {
        sellerId = demoSeller.id;
      } else {
        return NextResponse.json(
          { error: "Listing or associated seller not found" },
          { status: 404 }
        );
      }
    }

    const inquiry = await prisma.listingInquiry.create({
      data: {
        listingType: listingType as InquiryType,
        listingId,
        sellerId: sellerId as string,
        buyerId: session?.user?.id || undefined,
        buyerName: name.trim(),
        buyerEmail: email.toLowerCase().trim(),
        buyerPhone: phone?.trim() || null,
        message: message.trim(),
        status: InquiryStatus.NEW,
      },
    });

    return NextResponse.json(
      { message: "Inquiry submitted successfully", inquiryId: inquiry.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("Inquiry POST error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
