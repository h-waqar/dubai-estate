// src\modules\media\actions\listMedia.ts
import { listMedia as listMediaService } from "../services/service";
import { Media } from "../types/media.types";

export const listMedia = async (): Promise<Media[]> => {
  try {
    const media = await listMediaService();

    return media.map((m) => ({
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
  } catch (error: any) {
    console.error("Failed to list media:", error);
    throw new Error(error.message || "Failed to list media");
  }
};
