// src\modules\property\services\listProperties.ts
"use server";
import { prisma } from "@/lib/prisma";

export async function listProperties() {
  return prisma.property.findMany({
    orderBy: { createdAt: "desc" },
  });
}
