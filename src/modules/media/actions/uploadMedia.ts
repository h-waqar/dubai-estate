// src/modules/media/actions/uploadMedia.ts
"use server";

import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function uploadMediaAction(formData: FormData, userId: number) {
  const file = formData.get("file") as File;
  const title = formData.get("title") as string | null;
  const alt = formData.get("alt") as string | null;
  const type = (formData.get("type") as string) || "IMAGE";

  if (!file) throw new Error("No file uploaded");

  // Local save
  const uploadsDir = path.join(process.cwd(), "public/uploads");
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}_${file.name}`;
  const filePath = path.join(uploadsDir, fileName);

  const arrayBuffer = await file.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(arrayBuffer));

  // Create Media record
  const media = await prisma.media.create({
    data: {
      url: `/uploads/${fileName}`,
      title: title ?? file.name,
      alt,
      type,
      uploadedById: userId,
      size: file.size,
    },
  });

  return media;
}
