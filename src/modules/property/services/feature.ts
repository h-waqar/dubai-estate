import { prisma } from "@/lib/prisma";
import {
  CreateFeatureValidator,
  UpdateFeatureValidator,
} from "@/modules/property/validators/feature.validator";
import { slugify } from "@/utils/slug";

export class FeatureService {
  static async list() {
    return prisma.feature.findMany({ orderBy: { name: "asc" } });
  }

  static async get(id: number) {
    return prisma.feature.findUnique({ where: { id } });
  }

  static async create(data: unknown) {
    const parsed = CreateFeatureValidator.parse(data);

    const slug = slugify(parsed.name); // generate slug from name

    
    return prisma.feature.create({
      data: {
        ...parsed,
        slug, // ✅ required by Prisma
      },
    });
  }

  static async update(id: number, data: unknown) {
    const parsed = UpdateFeatureValidator.parse(data);

    // optionally regenerate slug if name changed
    const updateData: any = { ...parsed };
    if (parsed.name) {
      updateData.slug = slugify(parsed.name);
    }

    return prisma.feature.update({
      where: { id },
      data: updateData,
    });
  }

  static async delete(id: number) {
    await prisma.feature.delete({ where: { id } });
    return { success: true };
  }
}
