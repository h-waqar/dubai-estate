// src/modules/media/services/service.ts
"use server";

import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";
import { Media } from "../types/media.types";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_MIME_TYPES = [
  "image/png",
  "image/jpeg",
  "image/jpg",
  "video/mp4",
  "application/pdf",
];
const MAX_FILE_SIZE = 50_000_000; // 50MB

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
  // 1️⃣ Validate file server-side
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Unsupported file type");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large (max 10MB)");
  }

  // 2️⃣ Save file to /public/uploads (sanitize file name)
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const safeFileName = `${Date.now()}-${uuidv4()}-${path.basename(file.name)}`;
  const filePath = path.join(uploadsDir, safeFileName);

  // @ts-ignore
  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

  // 3️⃣ Save record in DB
  const media = await prisma.media.create({
    data: {
      url: `/uploads/${safeFileName}`,
      title,
      alt,
      type:
        type ||
        (file.type.startsWith("image")
          ? "IMAGE"
          : file.type.startsWith("video")
          ? "VIDEO"
          : "DOCUMENT"),
      mimeType: file.type,
      size: file.size,
      uploadedById,
    },
  });

  return media;
};

export const listMedia = async (): Promise<Media[]> => {
  try {
    const media = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
    });

    return media.map((m) => ({
      id: m.id,
      url: m.url,
      type: m.type,
      alt: m.alt ?? undefined,
      title: m.title ?? undefined,
      mimeType: m.mimeType ?? undefined,
      size: m.size ?? undefined,
      uploadedById: m.uploadedById ?? undefined,
      // Safe conversion
      createdAt:
        m.createdAt instanceof Date
          ? m.createdAt.toISOString()
          : new Date(m.createdAt).toISOString(),
      updatedAt:
        m.updatedAt instanceof Date
          ? m.updatedAt.toISOString()
          : new Date(m.updatedAt).toISOString(),
    }));
  } catch (error: any) {
    console.error("Failed to list media:", error);
    throw new Error(error.message || "Failed to list media");
  }
};

export const deleteMedia = async (id: number) => {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error("Media not found");

  // Sanitize path to prevent path traversal
  const filePath = path.join(
    process.cwd(),
    "public/uploads",
    path.basename(media.url)
  );
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  return prisma.media.delete({ where: { id } });
};
