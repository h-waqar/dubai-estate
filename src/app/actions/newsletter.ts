"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

const subscribeValidator = z.object({
    email: z.string().email("Please enter a valid email address"),
});

export async function subscribeToNewsletter(formData: FormData) {
    const rawData = {
        email: formData.get("email"),
    };

    // 1. Validate
    const validation = subscribeValidator.safeParse(rawData);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.flatten().fieldErrors.email?.[0] || "Invalid input",
        };
    }

    const { email } = validation.data;

    try {
        // 2. Save to DB
        await prisma.newsletterSubscriber.create({
            data: {
                email,
            },
        });

        return { success: true, message: "Successfully subscribed!" };
    } catch (error) {
        // Handle unique constraint violation (P2002)
        if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
            // It's technically successful if they are already subscribed
            return { success: true, message: "You are already subscribed!" };
        }

        console.error("Newsletter subscription error:", error);
        return { success: false, error: "Something went wrong. Please try again." };
    }
}
