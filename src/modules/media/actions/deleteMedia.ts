"use server";
// src\modules\media\actions\deleteMedia.ts
import { handleServerError } from "@/lib/handleServerError";
import { deleteMedia as deleteMediaService } from "../services/service";

export const deleteMedia = async (id: number): Promise<boolean> => {
  try {
    await deleteMediaService(id);
    return true;
  } catch (error: unknown) {
    console.error("Delete media failed:", error);
    throw handleServerError(error);
  }
};
