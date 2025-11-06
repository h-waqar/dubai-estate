import axios from "axios";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function handleActionError(error: unknown): Error {
  // Axios error handling (client or server)
  if (axios.isAxiosError(error)) {
    const res = error.response?.data;

    // Try to extract nested structures
    if (typeof res?.error === "string") {
      return new Error(res.error);
    }

    if (typeof res?.message === "string") {
      return new Error(res.message);
    }

    if (res?.error?.message && typeof res.error.message === "string") {
      return new Error(res.error.message);
    }

    if (res?.error?.fieldErrors) {
      const fieldErrors = res.error.fieldErrors;
      const firstField = Object.keys(fieldErrors)[0];
      if (firstField && Array.isArray(fieldErrors[firstField])) {
        return new Error(`${firstField}: ${fieldErrors[firstField][0]}`);
      }
    }

    return new Error(error.message || "Network request failed");
  }

  // Validation
  if (error instanceof ZodError) {
    return new Error("Validation failed");
  }

  // Prisma
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

  // Generic errors
  if (error instanceof Error) {
    return error;
  }

  return new Error("Unexpected error occurred");
}
