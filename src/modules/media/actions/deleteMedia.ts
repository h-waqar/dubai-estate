// src\modules\media\actions\deleteMedia.ts
import { deleteMedia as deleteMediaService } from "../services/service";

export const deleteMedia = async (id: number): Promise<boolean> => {
  try {
    await deleteMediaService(id);
    return true;
  } catch (error: any) {
    console.error("Delete media failed:", error);
    throw new Error(error.message || "Delete media failed");
  }
};
