"use server";
import { revalidatePath } from "next/cache";
import { callbackRequestSchema } from "../validators/callbackRequestSchema";
import saveCallbackRequest from "../services/saveCallbackRequest";
import { verifyTurnstile } from "@/lib/verifyTurnstile";

async function createCallbackRequest(formData: unknown) {
  const validateData = callbackRequestSchema.parse(formData);

  if (process.env.NODE_ENV === 'production' || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) {
    const isCaptchaValid = await verifyTurnstile(validateData.captchaToken);
    if (!isCaptchaValid) {
      return {
        success: false,
        error: "CAPTCHA validation failed. Please try again.",
      };
    }
  }

  try {
    // Remove captchaToken before saving to DB as it's not a model field
    // We can cast to any or just destructure if we update the service signature
    // For now assuming service takes 'any' or we need to omit it.
    // Let's modify the service call to omit captchaToken if strictly typed, 
    // but the schema implies it's part of the input.
    // Ideally we should omit it.
    const { captchaToken, ...dataToSave } = validateData;

    const newRequest = await saveCallbackRequest(dataToSave as any); // Cast or update service type
    revalidatePath("/lead");
    return {
      success: true,
      data: newRequest,
    };
  } catch (err) {
    console.error("Error creating callback request:", err);
    return {
      success: false,
      error: "Failed to submit request.",
    };
  }
}

export default createCallbackRequest;
