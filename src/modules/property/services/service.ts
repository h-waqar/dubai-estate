// src\modules\property\services\service.ts
import { prisma } from "@/lib/prisma";
import { CreatePropertyInput } from "../types/property.types";
import { slugify, generateUniqueSlug } from "@/utils/slug";
import { PropertyStatus } from "@/generated/prisma";
import { serializeDecimals } from "@/lib/serializeDecimal";

export async function createProperty(
  input: CreatePropertyInput,
  createdById: number
) {
  const slug = await generateUniqueSlug(input.title);

  const res = prisma.property.create({
    data: {
      ...input,
      slug,
      createdById,
      status: PropertyStatus.DRAFT, // Always default to DRAFT
    },
  });
  return res;
  // return serializeDecimals(res);
}

export async function listProperties() {
  return prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });
}
