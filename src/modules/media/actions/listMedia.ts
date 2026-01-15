"use server";
import { Media } from "../types/media.types";
import { handleServerError } from "@/lib/handleServerError";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import * as mediaService from "../services/service";

export const listMedia = async (scope: "GLOBAL" | "USER" = "USER"): Promise<Media[]> => {
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user;

    const userId = user?.id ? Number(user.id) : undefined;
    const userRoles = user?.roles;

    return await mediaService.listMedia(scope, userId, userRoles);
  } catch (error: unknown) {
    console.error("Failed to list media action error:", error);
    throw handleServerError(error);
  }
};
