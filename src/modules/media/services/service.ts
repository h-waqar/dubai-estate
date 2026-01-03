import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { Media } from "../types/media.types";
import { handleServerError } from "@/lib/handleServerError";
import { Readable } from "stream";

// --- Configuration Settings ---
export const MEDIA_CONFIG = {
  MAX_FILE_SIZE: 75 * 1024 * 1024, // 75MB
  MAX_VIDEO_DURATION_SECONDS: 90,
  IMAGE: {
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    QUALITY: "auto:good", // auto:good for better compression than default auto
    FORMAT: "webp",
  },
  VIDEO: {
    MAX_WIDTH: 1920,
    MAX_HEIGHT: 1080,
    QUALITY: "auto:eco", // Most aggressive compression
    BIT_RATE: "1m", // 1Mbps bitrate (very low for 1080p, good for size)
    FETCH_FORMAT: "webm", // Force WebM as requested
    AUDIO_CODEC: "aac",
  },
};

const getFolder = (mimeType: string) => {
  if (mimeType.startsWith("image/")) return "dubai-estate/images";
  if (mimeType.startsWith("video/")) return "dubai-estate/videos";
  if (mimeType === "application/pdf") return "dubai-estate/documents";
  return "dubai-estate/others";
};

export const saveMedia = async ({
  file,
  title,
  alt,
  type,
  uploadedById,
}: {
  file: File;
  title?: string;
  alt?: string;
  type?: "IMAGE" | "VIDEO" | "DOCUMENT" | "OTHER";
  uploadedById?: number;
}) => {
  try {
    // 1️⃣ Validate file server-side
    if (file.size > MEDIA_CONFIG.MAX_FILE_SIZE) {
      throw new Error(
        `File is too large (max ${MEDIA_CONFIG.MAX_FILE_SIZE / 1024 / 1024}MB)`
      );
    }

    // 2️⃣ Upload to Cloudinary
    const buffer = Buffer.from(await file.arrayBuffer());
    const stream = Readable.from(buffer);
    const mimeType = file.type;
    const folder = getFolder(mimeType);

    // Determine resource type
    const resourceType = mimeType.startsWith("video/")
      ? "video"
      : mimeType.startsWith("image/")
      ? "image"
      : "auto";

    const isImage = mimeType.startsWith("image/");
    const isVideo = mimeType.startsWith("video/");

    // Generate a custom public_id upfront so we have it regardless of async response
    const customPublicId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

    const uploadOptions: any = {
      folder,
      public_id: customPublicId, // Force our ID
      resource_type: resourceType,
    };

    if (isImage) {
      // Use incoming transformations for images to reduce stored file size
      uploadOptions.transformation = [
        { width: MEDIA_CONFIG.IMAGE.MAX_WIDTH, height: MEDIA_CONFIG.IMAGE.MAX_HEIGHT, crop: "limit" },
        { quality: MEDIA_CONFIG.IMAGE.QUALITY },
        { fetch_format: MEDIA_CONFIG.IMAGE.FORMAT }
      ];
    }

    if (isVideo) {
      // Use INCOMING transformation with async: true
      // This ensures we ONLY store the transformed version (not original)
      // async: true prevents the "too large" error
      
      // Force format at top level to ensure storage as WebM
      uploadOptions.format = "webm";
      
      uploadOptions.transformation = [
        {
          width: MEDIA_CONFIG.VIDEO.MAX_WIDTH,
          height: MEDIA_CONFIG.VIDEO.MAX_HEIGHT,
          crop: "limit",
          quality: MEDIA_CONFIG.VIDEO.QUALITY,
          bit_rate: "1000k", // Use k suffix for clarity (1Mbps)
          // Removed fetch_format and audio_codec to let Cloudinary defaults for WebM take over
        },
      ];
      uploadOptions.async = true; 
    }

    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      stream.pipe(uploadStream);
    });

    console.log("Cloudinary Upload Result:", JSON.stringify(uploadResult, null, 2));

    // 3️⃣ Post-Upload Validation (Duration)
    // For async, duration might be missing. We rely on frontend check.
    if (uploadResult.duration && isVideo && uploadResult.duration > MEDIA_CONFIG.MAX_VIDEO_DURATION_SECONDS) {
       await cloudinary.uploader.destroy(uploadResult.public_id || `${folder}/${customPublicId}`, { resource_type: "video" });
       throw new Error(`Video duration exceeds limit (${MEDIA_CONFIG.MAX_VIDEO_DURATION_SECONDS}s)`);
    }

    // 4️⃣ Save record in DB
    let finalUrl = uploadResult.secure_url;
    const effectivePublicId = uploadResult.public_id || `${folder}/${customPublicId}`;

    // Handle missing secure_url for async pending uploads
    if (!finalUrl) {
       const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
       if (cloudName) {
          // Manually construct URL. 
          // Note: When using async + format:webm, the pending result might not show the new extension yet.
          // We force .webm
          finalUrl = `https://res.cloudinary.com/${cloudName}/${isVideo ? 'video' : 'image'}/upload/${effectivePublicId}.webm`;
       }
    }

    if (!finalUrl) {
       throw new Error(`Failed to retrieve or construct media URL. Result: ${JSON.stringify(uploadResult)}`);
    }

    // Double check extension for videos
    if (isVideo && !finalUrl.endsWith(".webm")) {
        finalUrl = finalUrl.replace(/\.[^/.]+$/, ".webm");
    }
    
    // For images
    if (isImage && !finalUrl.includes(".webp")) {
       finalUrl = finalUrl.replace(/\.[^/.]+$/, ".webp");
    }

    console.log("Saving Media (Async/Manual):", {
        status: uploadResult.status,
        originalUrl: uploadResult.secure_url,
        finalUrl,
        publicId: effectivePublicId,
    });

    const media = await prisma.media.create({
      data: {
        url: finalUrl,
        publicId: effectivePublicId,
        title,
        alt,
        type:
          type ||
          (isImage
            ? "IMAGE"
            : isVideo
              ? "VIDEO"
              : "DOCUMENT"),
        mimeType: isImage ? "image/webp" : mimeType,
        size: uploadResult.bytes,
        uploadedById,
      },
    });


    return media;
  } catch (err: unknown) {
    console.error("Raw upload error:", err);
    const error = handleServerError(err);
    console.error("Failed to upload media:", error);
    throw new Error(error.message || "Failed to upload media");
  }
};

export const listMedia = async (
  scope: "GLOBAL" | "USER" = "USER",
  userId?: number,
  userRole?: string
): Promise<Media[]> => {
  try {
    let whereClause: any = {};

    if (scope === "GLOBAL") {
      if (userRole !== "ADMIN" && userRole !== "SUPER_ADMIN") {
        if (userId) {
          whereClause = { uploadedById: userId };
        } else {
          return [];
        }
      }
    } else {
      if (userId) {
        whereClause = { uploadedById: userId };
      } else {
        return [];
      }
    }

    const media = await prisma.media.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return media.map((m) => ({
      id: m.id,
      url: m.url,
      publicId: m.publicId ?? undefined,
      type: m.type,
      alt: m.alt ?? undefined,
      title: m.title ?? undefined,
      mimeType: m.mimeType ?? undefined,
      size: m.size ?? undefined,
      uploadedById: m.uploadedById ?? undefined,
      createdAt:
        m.createdAt instanceof Date
          ? m.createdAt.toISOString()
          : new Date(m.createdAt).toISOString(),
      updatedAt:
        m.updatedAt instanceof Date
          ? m.updatedAt.toISOString()
          : new Date(m.updatedAt).toISOString(),
    }));
  } catch (err: unknown) {
    const error = handleServerError(err);
    console.error("Failed to list media:", error);
    throw new Error(error.message || "Failed to list media");
  }
};

export const deleteMedia = async (id: number) => {
  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) throw new Error("Media not found");

    if (media.publicId) {
      const options: any = {};
      if (media.type === "VIDEO") options.resource_type = "video";
      await cloudinary.uploader.destroy(media.publicId, options);
    } else {
      if (media.url.startsWith("/uploads/")) {
        const path = require("path");
        const fs = require("fs");
        const filePath = path.join(process.cwd(), "public", media.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    return await prisma.media.delete({ where: { id } });
  } catch (err: unknown) {
    const error = handleServerError(err);
    console.error("Failed to delete media:", error);
    throw new Error(error.message || "Failed to delete media");
  }
};
