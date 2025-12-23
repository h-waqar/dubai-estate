"use server";
// import { handleActionError } from "@/lib/handleActionError";
import { Media } from "../types/media.types";
import { handleServerError } from "@/lib/handleServerError";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";

export const listMedia = async (scope: "USER" | "ADMIN_DASHBOARD" = "USER"): Promise<Media[]> => {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    const whereClause: any = {};

    // Simplified Logic requested by User:
    // 1. ADMIN_DASHBOARD Scope -> Show EVERYTHING (No filters).
    // 2. USER Scope (Default) -> Show ONLY media uploaded by this specific user. 
    //    (Strict Isolation: No public/system files, no role-based exceptions).

    if (scope === "ADMIN_DASHBOARD") {
      // Show all media. 
      // We assume the route protection (layout/page) handles the "Is Admin" check.
    } else {
      // Strict scope: "Only uploaded by myself"
      if (!user?.id) {
        return []; // No user = No media to show
      }
      whereClause.uploadedById = Number(user.id);
    }

    // Proceed with query using whereClause (either empty or strict user ID)

    const mediaList = await prisma.media.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return mediaList.map((m) => ({
      id: m.id,
      url: m.url,
      type: m.type,
      alt: m.alt ?? undefined,
      title: m.title ?? undefined,
      mimeType: m.mimeType ?? undefined,
      size: m.size ?? undefined,
      uploadedById: m.uploadedById ?? undefined,
      createdAt: m.createdAt.toISOString(),
      updatedAt: m.updatedAt.toISOString(),
    }));
  } catch (error: unknown) {
    console.error("Failed to list media:", error);
    throw handleServerError(error);
  }
};
