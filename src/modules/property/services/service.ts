import { prisma } from "@/lib/prisma";
import { CreatePropertyInput } from "../types/property.types";
import { slugify, generateUniqueSlug } from "@/utils/slug";
import { PropertyStatus } from "@/generated/prisma";

export async function createProperty(
  input: CreatePropertyInput,
  createdById: number
) {
  const slug = await generateUniqueSlug(input.title);

  return prisma.property.create({
    data: {
      ...input,
      slug,
      createdById,
      status: PropertyStatus.DRAFT, // Always default to DRAFT
    },
  });
}

export async function listProperties() {
  return prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });
}

