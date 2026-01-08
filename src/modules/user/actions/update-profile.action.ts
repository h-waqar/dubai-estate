// src/modules/user/actions/update-profile.action.ts
"use server";

import { z } from "zod";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const UpdateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  phoneNumber: z.string().optional(),
});

export async function updateProfile(formData: FormData) {
  const session = await getServerSession();

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
    // Check if username is taken
    if (validatedFields.data.username) {
      const existingUser = await prisma.user.findFirst({
        where: {
          username: validatedFields.data.username,
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
    
    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        ...validatedFields.data,
      },
    });

    revalidatePath("/account");

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error) {
    return {
      success: false,
      error: "An unexpected error occurred.",
    };
  }
}
