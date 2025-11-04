// src/modules/media/services/service.ts
"use server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

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
  // 1️⃣ Save file to /public/uploads
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(uploadsDir, fileName);

  // @ts-ignore
  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

  // 2️⃣ Save record in DB
  const media = await prisma.media.create({
    data: {
      url: `/uploads/${fileName}`,
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

export const listMedia = async () => {
  return prisma.media.findMany({ orderBy: { createdAt: "desc" } });
};

export const deleteMedia = async (id: number) => {
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) throw new Error("Media not found");

  // Delete file from disk
  const filePath = path.join(process.cwd(), "public", media.url);
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

  // Delete DB record
  return prisma.media.delete({ where: { id } });
};
