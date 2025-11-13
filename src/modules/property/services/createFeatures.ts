// src/modules/property/services/features/createFeature.ts
"use server";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/utils/slug";
import { FeatureInput } from "../../types/property.types";

export async function createFeature(input: FeatureInput) {
  const slug = slugify(input.name);

  return prisma.feature.create({
    data: {
      name: input.name,
      slug,
      icon: input.icon,
      description: input.description,
    },
  });
}
