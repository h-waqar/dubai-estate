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
      // Revert to EAGER Async approach
      // 1. Uploads ORIGINAL file to Cloudinary (fast, no waiting for processing)
      // 2. Starts generating optimized versions in background (eager_async)
      // 3. Allows us to construct the optimized URL immediately for the DB
      
      uploadOptions.eager = [
        {
          width: MEDIA_CONFIG.VIDEO.MAX_WIDTH,
          height: MEDIA_CONFIG.VIDEO.MAX_HEIGHT,
          crop: "limit",
          quality: MEDIA_CONFIG.VIDEO.QUALITY,
          bit_rate: MEDIA_CONFIG.VIDEO.BIT_RATE,
          format: MEDIA_CONFIG.VIDEO.FETCH_FORMAT, 
          audio_codec: MEDIA_CONFIG.VIDEO.AUDIO_CODEC,
        },
      ];
      uploadOptions.eager_async = true; 
      // Removed uploadOptions.async = true to ensure we get the immediate response with public_id
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
    // Now that we are synchronous (for the upload part), we get duration immediately
    if (uploadResult.duration && isVideo && uploadResult.duration > MEDIA_CONFIG.MAX_VIDEO_DURATION_SECONDS) {
       await cloudinary.uploader.destroy(uploadResult.public_id, { resource_type: "video" });
       throw new Error(`Video duration exceeds limit (${MEDIA_CONFIG.MAX_VIDEO_DURATION_SECONDS}s)`);
    }

    // 4️⃣ Save record in DB
    let finalUrl = uploadResult.secure_url;

    // Inject transformation parameters into the URL for immediate optimization upon request
    if (isVideo) {
        // Pattern: /upload/ -> /upload/transformations/
        const transformation = `c_limit,h_${MEDIA_CONFIG.VIDEO.MAX_HEIGHT},w_${MEDIA_CONFIG.VIDEO.MAX_WIDTH},q_${MEDIA_CONFIG.VIDEO.QUALITY},br_${MEDIA_CONFIG.VIDEO.BIT_RATE},f_${MEDIA_CONFIG.VIDEO.FETCH_FORMAT}`;
        
        if (finalUrl.includes("/upload/")) {
            finalUrl = finalUrl.replace("/upload/", `/upload/${transformation}/`);
            // Force extension to match fetch format (webm) so browsers treat it correctly
            finalUrl = finalUrl.replace(/\.[^/.]+$/, `.${MEDIA_CONFIG.VIDEO.FETCH_FORMAT}`);
        }
    }
    
    // For images
    if (isImage && !finalUrl.includes(".webp")) {
       finalUrl = finalUrl.replace(/\.[^/.]+$/, ".webp");
    }

    console.log("Saving Media (Sync):", {
        originalUrl: uploadResult.secure_url,
        finalUrl,
        publicId: uploadResult.public_id,
        bytes: uploadResult.bytes
    });

    const media = await prisma.media.create({
      data: {
        url: finalUrl,
        publicId: uploadResult.public_id,
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
