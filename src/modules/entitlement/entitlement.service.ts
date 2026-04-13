import { prisma } from "@/lib/prisma";
import { GrantStatus, Prisma } from "@prisma/client";

export type PrismaClientType = Prisma.TransactionClient | typeof prisma;

export class EntitlementService {
  /**
   * Grant an entitlement to a user.
   */
  static async grant(
    userId: number,
    code: string,
    amount: number,
    sourceId: string,
    sourceType: string = "SUBSCRIPTION",
    tx: PrismaClientType = prisma
  ) {
    const definition = await tx.entitlementDefinition.findUnique({
      where: { code },
    });

    if (!definition) {
      throw new Error(`Entitlement definition with code ${code} not found.`);
    }

    return await tx.entitlementGrant.create({
      data: {
        name: definition.name,
        userId,
        definitionId: definition.id,
        amount,
        sourceId,
        sourceType,
        status: GrantStatus.ACTIVE,
      },
    });
  }

  /**
   * Revoke all grants linked to a specific source (e.g., Subscription ID).
   */
  static async revoke(sourceId: string, tx: PrismaClientType = prisma) {
    return await tx.entitlementGrant.updateMany({
      where: { sourceId },
      data: { status: GrantStatus.REVOKED },
    });
  }

  /**
   * Aggregates all ACTIVE grants for the user and code and returns true if capacity > used.
   */
  static async checkCapacity(userId: number, code: string, tx: PrismaClientType = prisma): Promise<boolean> {
    const { totalCapacity, totalUsed } = await this.getQuotaStatus(userId, code, tx);
    return totalCapacity > totalUsed;
  }

  /**
   * Returns current usage vs total capacity for a user and code.
   */
  static async getQuotaStatus(userId: number, code: string, tx: PrismaClientType = prisma) {
    const grants = await tx.entitlementGrant.findMany({
      where: {
        userId,
        status: GrantStatus.ACTIVE,
        definition: { code },
      },
    });

    const totalCapacity = grants.reduce((sum, g) => sum + g.amount, 0);
    const totalUsed = grants.reduce((sum, g) => sum + g.used, 0);

    return { totalCapacity, totalUsed };
  }

  /**
   * Finds an active grant with available capacity and increments its 'used' count.
   */
  static async consume(userId: number, code: string, tx: PrismaClientType = prisma) {
    const grants = await tx.entitlementGrant.findMany({
      where: {
        userId,
        status: GrantStatus.ACTIVE,
        definition: { code },
      },
      orderBy: [
        { validTo: "asc" },
        { validFrom: "asc" }
      ],
    });

    // Sort to ensure null validTo (infinite) comes last
    const sortedGrants = [...grants].sort((a, b) => {
      if (a.validTo === null && b.validTo === null) return 0;
      if (a.validTo === null) return 1;
      if (b.validTo === null) return -1;
      return a.validTo.getTime() - b.validTo.getTime();
    });

    for (const grant of sortedGrants) {
      if (grant.amount > grant.used) {
        return await tx.entitlementGrant.update({
          where: { id: grant.id },
          data: { used: { increment: 1 } },
        });
      }
    }

    throw new Error(`Insufficient capacity for entitlement ${code}`);
  }

  /**
   * Decrements the 'used' count of a grant.
   */
  static async release(userId: number, code: string, tx: PrismaClientType = prisma) {
     const grants = await tx.entitlementGrant.findMany({
      where: {
        userId,
        status: GrantStatus.ACTIVE,
        definition: { code },
        used: { gt: 0 }
      },
      orderBy: { validFrom: "desc" }, // Release from newest grants first
    });

    if (grants.length === 0) {
        return; // Nothing to release
    }

    return await tx.entitlementGrant.update({
        where: { id: grants[0].id },
        data: { used: { decrement: 1 } }
    });
  }
}
