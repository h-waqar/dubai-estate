// src\modules\media\actions\uploadMedia.ts
import { mediaUploadSchema } from "../validators/media.validator";
import { saveMedia } from "../services/service";
import { Media } from "../types/media.types";

export const uploadMedia = async ({
  file,
  title,
  alt,
  type,
}: {
  file: File;
  title?: string;
  alt?: string;
  type?: "IMAGE" | "VIDEO" | "DOCUMENT" | "OTHER";
}): Promise<Media> => {
  try {
    // Validate input
    const parsed = mediaUploadSchema.parse({ file, title, alt, type });

    // Save media via service
    const media = await saveMedia({
      file: parsed.file,
      title: parsed.title,
      alt: parsed.alt,
      type: parsed.type,
    });

    return {
      id: media.id,
      url: media.url,
      type: media.type,
      title: media.title ?? undefined,
      alt: media.alt ?? undefined,
      mimeType: media.mimeType ?? undefined,
      size: media.size ?? undefined,
      uploadedById: media.uploadedById ?? undefined,
      createdAt: media.createdAt.toISOString(),
      updatedAt: media.updatedAt.toISOString(),
    };
  } catch (error: any) {
    console.error("Upload failed:", error);
    throw new Error(error.message || "Upload failed");
  }
};
