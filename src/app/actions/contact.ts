"use server";

import { z } from "zod";
import { verifyTurnstile } from "@/lib/verifyTurnstile";

// Basic schema for contact form
const contactFormSchema = z.object({
    firstName: z.string().min(2, "First name is too short"),
    lastName: z.string().min(2, "Last name is too short"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    message: z.string().min(10, "Message is too short"),
    captchaToken: z.string().min(1, "Please complete the CAPTCHA"),
});

export async function submitContactForm(formData: FormData) {
    const rawData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        message: formData.get("message"),
        captchaToken: formData.get("captchaToken"),
    };

    // 1. Validate Input
    const validation = contactFormSchema.safeParse(rawData);
    if (!validation.success) {
        return {
            success: false,
            error: validation.error.flatten().fieldErrors,
        };
    }

    // 2. Verify Captcha
    if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
        const isCaptchaValid = await verifyTurnstile(validation.data.captchaToken);
        if (!isCaptchaValid) {
            return {
                success: false,
                error: "CAPTCHA validation failed. Please try again.",
            };
        }
    }

    // 3. Process the form (e.g. send email or save to DB)
    // For now, we simulate success as there's no backend model specified for general contacts yet.
    // potentially await saveContactMessage(validation.data);

    return {
        success: true,
        message: "Message sent successfully!",
    };
}
