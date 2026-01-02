"use server";

import { verifyTurnstile } from "@/lib/verifyTurnstile";
import { contactFormSchema } from "@/validators/contact";

export async function submitContactForm(formData: unknown) {
    // 1. Validate Input
    const validation = contactFormSchema.safeParse(formData);

    if (!validation.success) {
        return {
            success: false,
            error: validation.error.flatten().fieldErrors,
        };
    }

    const { captchaToken, ...data } = validation.data;

    // 2. Verify Captcha logic
    const isCaptchaEnabled = process.env.NEXT_PUBLIC_CAPTCHA_ENABLE !== 'false';

    if (isCaptchaEnabled) {
        if (!captchaToken) {
            return {
                success: false,
                error: "Please complete the CAPTCHA",
            };
        }

        // Server-side environment might use different var or same, safe to check standard key
        // Also verifyTurnstile utility checks PUBLIC_CAPTCHA_ENABLE, let's align implementation.
        // The utility function verifyTurnstile already includes a check for PUBLIC_CAPTCHA_ENABLE.
        // However, we need to pass a valid string to it.

        const isCaptchaValid = await verifyTurnstile(captchaToken);
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
