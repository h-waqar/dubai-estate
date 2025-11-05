// src/lib/serializeDecimal.ts
import { Prisma } from "@/generated/prisma/client";

export function serializeDecimals<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => serializeDecimals(item)) as unknown as T;
  }

  if (typeof obj === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value instanceof Prisma.Decimal) {
        result[key] = Number(value); // or value.toString() if you want exact precision
      } else if (typeof value === "object" && value !== null) {
        result[key] = serializeDecimals(value);
      } else {
        result[key] = value;
      }
    }
    return result as T;
  }

  return obj;
}
