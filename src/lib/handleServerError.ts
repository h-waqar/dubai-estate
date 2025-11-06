// src/lib/handleServerError.ts
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import axios from "axios";

/**
 * Normalizes errors for server-side usage (server actions, APIs)
 * - Handles Prisma, Zod, Axios errors
 * - Always returns a clean Error instance
 */
export function handleServerError(error: unknown): Error {
  // Prisma errors
  if (error instanceof PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2025":
        return new Error("Resource not found");
      case "P2002":
        return new Error("Duplicate entry");
      default:
        return new Error(`Database error: ${error.message}`);
    }
  }

  // Validation errors
  if (error instanceof ZodError) {
    return new Error("Validation failed");
  }

  // Axios (server-side fetch or API calls)
  if (axios.isAxiosError(error)) {
    const res = error.response?.data;
    if (typeof res?.error === "string") return new Error(res.error);
    if (typeof res?.message === "string") return new Error(res.message);
    if (res?.error?.message && typeof res.error.message === "string")
      return new Error(res.error.message);
    return new Error(error.message || "Network request failed");
  }

  // Already an Error
  if (error instanceof Error) return error;

  // Fallback
  return new Error("Unexpected server-side error");
}
