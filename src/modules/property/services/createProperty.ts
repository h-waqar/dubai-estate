// src\modules\property\services\createProperty.ts
"use server";
import { prisma } from "@/lib/prisma";
import { CreatePropertyInput } from "../types/property.types";
import { generateUniqueSlug } from "@/utils/slug";
import { PropertyStatus, ListingType } from "@/generated/prisma";
import { serializeDecimals } from "@/lib/serializeDecimal";

export async function createProperty(
  input: CreatePropertyInput,
  createdById: number
) {
  const { coverImage, gallery, ...propertyData } = input;
  const slug = await generateUniqueSlug(propertyData.title);

  // Generate RefNo: 3 random capital letters + 4 random numbers
  const randomLetters = Array(3)
    .fill(0)
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join("");
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  const refNo = `${randomLetters}${randomNumbers}`;

  // Step 1: Create the property
  const property = await prisma.property.create({
    data: {
      ...propertyData,
      slug,
      refNo,
      createdById,
      status: PropertyStatus.PENDING_REVIEW,
      availability: propertyData.listingType === "OFF_PLAN" ? "OFFPLAN" : "AVAILABLE",
      listingType: propertyData.listingType as ListingType,
      approvedById: null,
      declinedReason: null,
    },
  });

  // Step 2: Link media (depending on your schema usage)
  if (coverImage) {
    await prisma.mediaUsage.create({
      data: {
        mediaId: coverImage,
        entityId: property.id,
        entityType: "PROPERTY",
        role: "COVER",
      },
    });
  }

  if (gallery?.length) {
    await prisma.mediaUsage.createMany({
      data: gallery.map((id) => ({
        mediaId: id,
        entityId: property.id,
        entityType: "PROPERTY",
        role: "GALLERY",
      })),
    });
  }

  return serializeDecimals(property);
}
