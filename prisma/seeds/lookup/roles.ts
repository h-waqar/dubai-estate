import { PrismaClient } from "@prisma/client";

/**
 * NOTE: Roles are currently defined as an Enum in the Prisma schema.
 * This function is a placeholder for future database-backed roles if needed.
 */
export async function seedRoles(prisma: PrismaClient) {
  console.log("ℹ️ Roles are handled via Prisma Enum. No database seeding required.");
}
