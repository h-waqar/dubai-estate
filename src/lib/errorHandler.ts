import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        details: error.issues,
      },
      { status: 400 }
    );
  }

  if (error instanceof PrismaClientKnownRequestError) {
    console.log("Prisma error code:", error.code);
    // Handle specific Prisma errors
    switch (error.code) {
      case "P2025": // Record not found
        return NextResponse.json({ error: "Resource not found" }, { status: 404 });
      case "P2002": // Unique constraint violation
        return NextResponse.json({ error: "Duplicate entry" }, { status: 409 });
      default:
        return NextResponse.json(
          { error: `Database error: ${error.message}` },
          { status: 500 }
        );
    }
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: "Internal server error",
        message: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { error: "An unexpected error occurred" },
    { status: 500 }
  );
}
