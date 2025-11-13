// src\modules\property\services\listPropertyTypes.ts
"use server";
import { prisma } from "@/lib/prisma";
export async function getPropertyTypes() {
  return prisma.propertyType.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
}
