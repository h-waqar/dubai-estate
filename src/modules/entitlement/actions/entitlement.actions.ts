"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { prisma } from "@/lib/prisma";
import { entitlementDefinitionSchema } from "@/validators/entitlement";
import { revalidatePath } from "next/cache";

/**
 * Check if the user is an ADMIN or SUPER_ADMIN
 */
async function checkAdminSession() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return { error: "Unauthorized", status: 401 };
  }
  
  const hasAccess = session.user.roles.includes("ADMIN") || session.user.roles.includes("SUPER_ADMIN");
  if (!hasAccess) {
    return { error: "Forbidden", status: 403 };
  }
  
  return { session };
}

/**
 * List all entitlement definitions
 */
export async function listEntitlementDefinitionsAction() {
  const auth = await checkAdminSession();
  if ("error" in auth) return auth;

  try {
    const definitions = await prisma.entitlementDefinition.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: definitions };
  } catch (error: any) {
    console.error("List Entitlement Definitions Error:", error);
    return { error: "Failed to list entitlement definitions" };
  }
}

/**
 * Create a new entitlement definition
 */
export async function createEntitlementDefinitionAction(data: any) {
  const auth = await checkAdminSession();
  if ("error" in auth) return auth;

  const validation = entitlementDefinitionSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  try {
    const definition = await prisma.entitlementDefinition.create({
      data: validation.data,
    });
    revalidatePath("/admin/entitlements");
    return { success: true, data: definition };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "An entitlement with this code already exists." };
    }
    console.error("Create Entitlement Definition Error:", error);
    return { error: "Failed to create entitlement definition" };
  }
}

/**
 * Update an existing entitlement definition
 */
export async function updateEntitlementDefinitionAction(id: string, data: any) {
  const auth = await checkAdminSession();
  if ("error" in auth) return auth;

  const validation = entitlementDefinitionSchema.safeParse(data);
  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors };
  }

  try {
    const definition = await prisma.entitlementDefinition.update({
      where: { id },
      data: validation.data,
    });
    revalidatePath("/admin/entitlements");
    return { success: true, data: definition };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: "An entitlement with this code already exists." };
    }
    console.error("Update Entitlement Definition Error:", error);
    return { error: "Failed to update entitlement definition" };
  }
}

/**
 * Delete an entitlement definition
 */
export async function deleteEntitlementDefinitionAction(id: string) {
  const auth = await checkAdminSession();
  if ("error" in auth) return auth;

  try {
    await prisma.entitlementDefinition.delete({
      where: { id },
    });
    revalidatePath("/admin/entitlements");
    return { success: true };
  } catch (error: any) {
    console.error("Delete Entitlement Definition Error:", error);
    return { error: "Failed to delete entitlement definition" };
  }
}
