"use server";

import cloudinary from "@/lib/cloudinary";

export async function uploadImageAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) {
      return { error: "No file provided" };
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Convert buffer to base64 string for Cloudinary
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    const result = await cloudinary.uploader.upload(base64Image, {
      folder: "dubai-estate/avatars",
      resource_type: "image",
    });

    return { success: true, url: result.secure_url };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Failed to upload image" };
  }
}
