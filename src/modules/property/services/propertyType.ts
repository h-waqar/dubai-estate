"use server";
import { prisma as db } from "@/lib/prisma";
import {
  PropertyTypeInput,
  PropertyTypeUpdateInput,
} from "@/modules/property/validators/propertyTypes.validator";

export class PropertyTypeService {
  static async getAll() {
    return db.propertyType.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getById(id: number) {
    return db.propertyType.findUnique({ where: { id } });
  }

  static async create(data: PropertyTypeInput) {
    return db.propertyType.create({ data });
  }

  static async update(data: PropertyTypeUpdateInput) {
    const { id, ...rest } = data;
    return db.propertyType.update({
      where: { id },
      data: rest,
    });
  }

  static async delete(id: number) {
    return db.propertyType.delete({ where: { id } });
  }
}
