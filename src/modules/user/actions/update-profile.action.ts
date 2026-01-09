// src/modules/user/actions/update-profile.action.ts
"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  phoneNumber: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  image: z.string().url().optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      success: false,
      error: "Not authenticated",
    };
  }
  
  const values = {
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    username: formData.get("username"),
    phoneNumber: formData.get("phoneNumber"),
    bio: formData.get("bio"),
    image: formData.get("image"),
  }

  const validatedFields = UpdateProfileSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      error: "Invalid fields",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const { bio, ...userData } = validatedFields.data;

    // Check if username is taken
    if (userData.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: userData.username,
          NOT: {
            email: session.user.email,
          },
        },
      });

      if (existingUser) {
        return {
          success: false,
          error: "Username is already taken.",
        };
      }
    }
    
    // 1. Update User Record
    const updatedUser = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        ...userData,
        profile: {
          upsert: {
            create: { bio: bio || "" },
            update: { bio: bio || "" },
          },
        },
      },
    });

    // 2. Handle Media Library Sync (if image is present)
    if (userData.image) {
        // a. Create/Find Media Record
        // We assume the image was just uploaded to Cloudinary, so we might not have a Media record yet.
        // We need to check if we can find it or create a new one. 
        // Since we only have the URL here, we'll try to find it or create a "External/Cloudinary" media entry.
        
        let media = await prisma.media.findFirst({
            where: { url: userData.image }
        });

        if (!media) {
            media = await prisma.media.create({
                data: {
                    url: userData.image,
                    type: "IMAGE",
                    uploadedById: updatedUser.id,
                }
            });
        }

        // b. Create/Update MediaUsage
        // Check if user already has an avatar usage
        const existingUsage = await prisma.mediaUsage.findFirst({
            where: {
                entityType: "USER",
                entityId: updatedUser.id,
                role: "AVATAR"
            }
        });

        if (existingUsage) {
            if (existingUsage.mediaId !== media.id) {
                await prisma.mediaUsage.update({
                    where: { id: existingUsage.id },
                    data: { mediaId: media.id }
                });
            }
        } else {
            await prisma.mediaUsage.create({
                data: {
                    mediaId: media.id,
                    entityType: "USER",
                    entityId: updatedUser.id,
                    role: "AVATAR"
                }
            });
        }
    }

    revalidatePath("/account");

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    console.error("Update profile error:", error);
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
}
