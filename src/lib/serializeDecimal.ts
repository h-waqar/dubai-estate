import { Prisma } from "@prisma/client";

export function serializeDecimals<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;

  if (Array.isArray(obj)) {
    return obj.map((item) => serializeDecimals(item)) as unknown as T;
  }

  if (typeof obj === "object") {
    // Check for Decimal-like object (duck typing)
    // Prisma Decimals / decimal.js have s (sign), e (exponent), d (digits)
    const isDecimal =
      "s" in obj &&
      "e" in obj &&
      "d" in obj;

    if (isDecimal) {
      try {
        // Safe conversion
        return Number(obj.toString()) as unknown as T;
      } catch (err) {
        // Fallback
        const val = obj as any;
        return Number(val.s * parseFloat(val.d.join('')) * Math.pow(10, val.e)) as unknown as T;
      }
    }

    // Handle Date objects
    if (obj instanceof Date) {
      return obj.toISOString() as unknown as T;
    }

    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = serializeDecimals(value);
    }
    return result as T;
  }

  return obj;
}
