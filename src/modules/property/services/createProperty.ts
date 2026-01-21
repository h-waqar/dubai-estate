// src\modules\property\services\createProperty.ts
"use server";
import { prisma } from "@/lib/prisma";
import { CreatePropertyInput } from "../types/property.types";
import { generateUniqueSlug } from "@/utils/slug";
import { PropertyStatus, ListingType } from "@prisma/client";
import { serializeDecimals } from "@/lib/serializeDecimal";

export async function createProperty(
  input: CreatePropertyInput & { status?: string; published?: boolean },
  createdById: number
) {
  const { coverImage, gallery, features, status, published, ...propertyData } = input;
  const slug = await generateUniqueSlug(propertyData.title);

  // Generate RefNo: 3 random capital letters + 4 random numbers
  const randomLetters = Array(3)
    .fill(0)
    .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
    .join("");
  const randomNumbers = Math.floor(1000 + Math.random() * 9000);
  const refNo = `${randomLetters}${randomNumbers}`;

  // Handle Developer Logic
  let finalDeveloperId = propertyData.developerId;
  let finalProposedName = propertyData.proposedDeveloperName;

  if (finalProposedName && !finalDeveloperId) {
    // Check if developer exists to dedupe
    const existingDev = await prisma.developer.findUnique({
      where: { name: finalProposedName },
    });

    if (existingDev) {
      if (existingDev.status === "APPROVED") {
        finalDeveloperId = existingDev.id;
        finalProposedName = undefined; // Linked directly
      } else {
        // Pending or Declined - keep as proposed name so it links later (or stays proposed)
        // We don't need to re-create it.
      }
    } else {
      // Create new PENDING developer
      await prisma.developer.create({
        data: {
          name: finalProposedName,
          slug: await generateUniqueSlug(finalProposedName), // Reusing slug util
          status: "PENDING",
          createdById,
        },
      });
    }
  }

  // Step 1: Create the property
  const property = await prisma.property.create({
    data: {
      ...propertyData,
      slug,
      refNo,
      createdById,
      developerId: finalDeveloperId,
      proposedDeveloperName: finalProposedName,
      status: (status as PropertyStatus) || PropertyStatus.PENDING_REVIEW,
      published: published ?? false,
      availability: propertyData.listingType === "OFF_PLAN" ? "OFFPLAN" : "AVAILABLE",
      listingType: propertyData.listingType as ListingType,
      approvedById: status === "APPROVED" ? createdById : null, // Auto-approve if status is APPROVED? Maybe separate logic. 
      // Actually checking schema... approvedById is optional. 
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

  // Step 3: Link features
  if (features?.length) {
    await prisma.propertyFeature.createMany({
      data: features.map((fid) => ({
        propertyId: property.id,
        featureId: fid,
      })),
    });
  }

  return serializeDecimals(property);
}
