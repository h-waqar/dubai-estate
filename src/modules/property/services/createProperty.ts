// src\modules\property\services\createProperty.ts
"use server";
import { prisma } from "@/lib/prisma";
import { CreatePropertyInput } from "../types/property.types";
import { generateUniqueSlug } from "@/utils/slug";
import { PropertyStatus, ListingType, EditorialStatus, ModerationStatus, SystemStatus } from "@prisma/client";
import { serializeDecimals } from "@/lib/serializeDecimal";
import { EntitlementService, PrismaClientType } from "@/modules/entitlement/entitlement.service";

export async function createProperty(
  input: CreatePropertyInput & { status?: string; published?: boolean },
  createdById: number,
  tx: PrismaClientType = prisma
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
    const existingDev = await tx.developer.findUnique({
      where: { name: finalProposedName },
    });

    if (existingDev) {
      if (existingDev.status === "APPROVED") {
        finalDeveloperId = existingDev.id;
        finalProposedName = undefined; // Linked directly
      }
    } else {
      // Create new PENDING developer
      await tx.developer.create({
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
  const property = await tx.property.create({
    data: {
      ...propertyData,
      slug,
      refNo,
      createdById,
      developerId: finalDeveloperId,
      proposedDeveloperName: finalProposedName,
      status: (status as PropertyStatus) || PropertyStatus.PENDING_REVIEW,
      editorialStatus: EditorialStatus.SUBMITTED,
      moderationStatus: status === "APPROVED" ? ModerationStatus.APPROVED : ModerationStatus.PENDING_REVIEW,
      systemStatus: SystemStatus.ACTIVE,
      published: published ?? (status === "APPROVED"),
      availability: propertyData.listingType === "OFF_PLAN" ? "OFFPLAN" : "AVAILABLE",
      listingType: propertyData.listingType as ListingType,
      approvedById: status === "APPROVED" ? createdById : null,
      declinedReason: null,
    },
  });

  // Step 2: Link media
  if (coverImage) {
    await tx.mediaUsage.create({
      data: {
        mediaId: coverImage,
        entityId: property.id,
        entityType: "PROPERTY",
        role: "COVER",
      },
    });
  }

  if (gallery?.length) {
    await tx.mediaUsage.createMany({
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
    await tx.propertyFeature.createMany({
      data: features.map((fid) => ({
        propertyId: property.id,
        featureId: fid,
      })),
    });
  }

  // Step 4: Consume Entitlement (if not admin)
  const user = await tx.user.findUnique({ where: { id: createdById } });
  const isAdmin = user?.roles.includes("ADMIN") || user?.roles.includes("SUPER_ADMIN");

  if (!isAdmin) {
      await EntitlementService.consume(createdById, "PROPERTY_SLOT", tx);
  }

  return serializeDecimals(property);
}
