import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class AddonPackService {
  static async listPacks(planId?: number | null) {
    const where = planId === undefined ? {} : { planId };
    return prisma.addonPack.findMany({
      where,
      orderBy: { order: "asc" },
    });
  }

  static async getPack(id: number) {
    return prisma.addonPack.findUnique({
      where: { id },
    });
  }

  static async createPack(data: { qty: number; label: string; discount: number; order?: number; planId?: number | null }) {
    return prisma.addonPack.create({
      data: {
        qty: data.qty,
        label: data.label,
        discount: new Prisma.Decimal(data.discount),
        order: data.order || 0,
        planId: data.planId,
      },
    });
  }

  static async updatePack(id: number, data: { qty?: number; label?: string; discount?: number; order?: number; isActive?: boolean; planId?: number | null }) {
    return prisma.addonPack.update({
      where: { id },
      data: {
        ...data,
        ...(data.discount !== undefined && { discount: new Prisma.Decimal(data.discount) }),
      },
    });
  }

  static async deletePack(id: number) {
    return prisma.addonPack.delete({
      where: { id },
    });
  }
}
