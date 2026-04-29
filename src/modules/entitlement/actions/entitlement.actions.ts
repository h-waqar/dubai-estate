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
    return { success: false, error: "Unauthorized", status: 401 } as const;
  }
  
  const hasAccess = session.user.roles.includes("ADMIN") || session.user.roles.includes("SUPER_ADMIN");
  if (!hasAccess) {
    return { success: false, error: "Forbidden", status: 403 } as const;
  }
  
  return { success: true, session } as const;
}

/**
 * List all entitlement definitions
 */
export async function listEntitlementDefinitionsAction() {
  const auth = await checkAdminSession();
  if (!auth.success) return auth;

  try {
    const definitions = await prisma.entitlementDefinition.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: definitions } as const;
  } catch (error: any) {
    console.error("List Entitlement Definitions Error:", error);
    return { success: false, error: "Failed to list entitlement definitions" } as const;
  }
}

/**
 * Create a new entitlement definition
 */
export async function createEntitlementDefinitionAction(data: any) {
  const auth = await checkAdminSession();
  if (!auth.success) return auth;

  const validation = entitlementDefinitionSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors } as const;
  }

  try {
    const definition = await prisma.entitlementDefinition.create({
      data: validation.data,
    });
    revalidatePath("/admin/entitlements");
    return { success: true, data: definition } as const;
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "An entitlement with this code already exists." } as const;
    }
    console.error("Create Entitlement Definition Error:", error);
    return { success: false, error: "Failed to create entitlement definition" } as const;
  }
}

/**
 * Update an existing entitlement definition
 */
export async function updateEntitlementDefinitionAction(id: string, data: any) {
  const auth = await checkAdminSession();
  if (!auth.success) return auth;

  const validation = entitlementDefinitionSchema.safeParse(data);
  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors } as const;
  }

  try {
    const definition = await prisma.entitlementDefinition.update({
      where: { id },
      data: validation.data,
    });
    revalidatePath("/admin/entitlements");
    return { success: true, data: definition } as const;
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: false, error: "An entitlement with this code already exists." } as const;
    }
    console.error("Update Entitlement Definition Error:", error);
    return { success: false, error: "Failed to update entitlement definition" } as const;
  }
}

/**
 * Delete an entitlement definition
 */
export async function deleteEntitlementDefinitionAction(id: string) {
  const auth = await checkAdminSession();
  if (!auth.success) return auth;

  try {
    await prisma.entitlementDefinition.delete({
      where: { id },
    });
    revalidatePath("/admin/entitlements");
    return { success: true } as const;
  } catch (error: any) {
    console.error("Delete Entitlement Definition Error:", error);
    return { success: false, error: "Failed to delete entitlement definition" } as const;
  }
}
