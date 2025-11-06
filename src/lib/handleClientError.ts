// src/lib/handleClientError.ts
import axios from "axios";

/**
 * Normalizes errors for client-side usage (React hooks, UI components)
 * - Handles Axios errors
 * - Falls back to generic Error
 */
export function handleClientError(error: unknown): Error {
  // Axios error handling
  if (axios.isAxiosError(error)) {
    const res = error.response?.data;

    // Try to extract structured messages
    if (typeof res?.error === "string") return new Error(res.error);
    if (typeof res?.message === "string") return new Error(res.message);
    if (res?.error?.message && typeof res.error.message === "string")
      return new Error(res.error.message);
    if (res?.error?.fieldErrors) {
      const fieldErrors = res.error.fieldErrors;
      const firstField = Object.keys(fieldErrors)[0];
      if (firstField && Array.isArray(fieldErrors[firstField])) {
        return new Error(`${firstField}: ${fieldErrors[firstField][0]}`);
      }
    }

    return new Error(error.message || "Network request failed");
  }

  // Already an Error
  if (error instanceof Error) return error;

  // Fallback
  return new Error("Unexpected client-side error");
}
