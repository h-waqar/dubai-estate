"use server";
// import { handleActionError } from "@/lib/handleActionError";
import { listMedia as listMediaService } from "../services/service";
import { Media } from "../types/media.types";
import { handleServerError } from "@/lib/handleServerError";

export const listMedia = async (): Promise<Media[]> => {
  try {
    const media: Media[] = await listMediaService();

    return media.map((m) => ({
      id: m.id,
      url: m.url,
      type: m.type,
      alt: m.alt ?? undefined,
      title: m.title ?? undefined,
      mimeType: m.mimeType ?? undefined,
      size: m.size ?? undefined,
      uploadedById: m.uploadedById ?? undefined,
      createdAt: m.createdAt, // ✅ already ISO string
      updatedAt: m.updatedAt, // ✅ already ISO string
    }));
  } catch (error: unknown) {
    console.error("Failed to list media:", error);
    throw handleServerError(error);
  }
};
