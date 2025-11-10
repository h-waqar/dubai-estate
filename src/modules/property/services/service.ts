// src\modules\property\services\service.ts
import { prisma } from "@/lib/prisma";
import { CreatePropertyInput } from "../types/property.types";
// import { slugify, generateUniqueSlug } from "@/utils/slug";
import { generateUniqueSlug } from "@/utils/slug";
import { PropertyStatus } from "@/generated/prisma";
import { serializeDecimals } from "@/lib/serializeDecimal";

// export async function createProperty(
//   input: CreatePropertyInput,
//   createdById: number
// ) {
//   const slug = await generateUniqueSlug(input.title);

//   const res = prisma.property.create({
//     data: {
//       ...input,
//       slug,
//       createdById,
//       status: PropertyStatus.DRAFT, // Always default to DRAFT
//     },
//   });
//   // return res;
//   return serializeDecimals(res);
// }

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

export async function listProperties() {
  return prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });
}
