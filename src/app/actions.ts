// src/app/actions.ts
"use server";

import { z } from "zod";

/**
 * The SERVER-side schema is updated.
 *
 * We add 'coverImageId' and use 'z.coerce.number()'
 * to ensure the string from FormData is converted back
 * to a number before validation. We also keep it 'optional()'.
 */
const serverProfileValidator = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  age: z.coerce.number().min(18),

  // --- NEW FIELD ---
  coverImageId: z.coerce.number().optional(),
});

/**
 * This is our mock server action.
 * It accepts FormData, which is the standard for server actions.
 */
export async function createProfileAction(formData: FormData) {
  // 1. Convert FormData to a plain object
  const rawData = Object.fromEntries(formData.entries());

  // 2. Validate the RAW string data
  // This will now correctly parse 'coverImageId' if it exists
  const parseResult = serverProfileValidator.safeParse(rawData);

  // 3. Handle validation errors
  if (!parseResult.success) {
    return {
      success: false,
      error: "Validation failed. Check your data.",
    };
  }

  // 4. (SIMULATION) 'parseResult.data' is clean and typed.
  // It will now contain 'coverImageId' if one was provided.
  console.log("Saving to database:", parseResult.data);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 5. Return a success response
  return { success: true, data: parseResult.data };
}
