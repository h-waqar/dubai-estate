"use server";
import { revalidatePath } from "next/cache";
import { callbackRequestSchema } from "../validators/callbackRequestSchema";
import saveCallbackRequest from "../services/saveCallbackRequest";
async function createCallbackRequest(formData: unknown) {
  const validateData = callbackRequestSchema.parse(formData);
  try {
    const newRequest = await saveCallbackRequest(validateData);
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
