"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const subscribeValidator = z.object({
    email: z.string().email("Please enter a valid email address"),
});

import { verifyTurnstile } from "@/lib/verifyTurnstile";

export async function subscribeToNewsletter(formData: FormData) {
    const rawData = {
        email: formData.get("email"),
        captchaToken: formData.get("captchaToken")?.toString(),
    };

    // 0. Verify Captcha
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
        if (!rawData.captchaToken) {
            return {
                success: false,
                error: "Please complete the CAPTCHA",
            };
        }
        const isCaptchaValid = await verifyTurnstile(rawData.captchaToken);
        if (!isCaptchaValid) {
            return {
                success: false,
                error: "CAPTCHA validation failed",
            };
        }
    }

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
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            // It's technically successful if they are already subscribed
            return { success: true, message: "You are already subscribed!" };
        }

        console.error("Newsletter subscription error:", error);
        return { success: false, error: "Something went wrong. Please try again." };
    }
}
