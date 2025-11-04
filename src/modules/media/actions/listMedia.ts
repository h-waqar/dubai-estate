// src/modules/media/actions/listMedia.ts
"use server";
import { prisma } from "@/lib/prisma";

export async function listMediaAction() {
  return prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });
}
