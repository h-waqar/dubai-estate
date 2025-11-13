// src\modules\property\services\createProperty.ts
"use server";
import { prisma } from "@/lib/prisma";
import { CreatePropertyInput } from "../types/property.types";
import { generateUniqueSlug } from "@/utils/slug";
import { PropertyStatus } from "@/generated/prisma";
import { serializeDecimals } from "@/lib/serializeDecimal";

export async function createProperty(
  input: CreatePropertyInput,
  createdById: number
) {
  const { coverImage, gallery, ...propertyData } = input;
  const slug = await generateUniqueSlug(propertyData.title);

  // Step 1: Create the property
  const property = await prisma.property.create({
    data: {
      ...propertyData,
      slug,
      createdById,
      status: PropertyStatus.DRAFT,
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
