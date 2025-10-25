import { handleApiError } from "@/lib/errorHandler";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  categorySchema,
  categoryUpdateSchema,
} from "@/modules/blog/validators/category.validator";
// import { ZodError } from "zod";

export async function getAllCategories() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ data: categories });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function createCategory(request: Request) {
  try {
    const body = await request.json();
    const validated = categorySchema.parse(body);

    const category = await prisma.category.create({
      data: validated,
    });

    return NextResponse.json({ data: category }, { status: 201 });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function getCategory(id: string) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: category });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function updateCategory(request: Request, id: string) {
  try {
    const body = await request.json();
    const validated = categoryUpdateSchema.parse(body);

    const category = await prisma.category.update({
      where: { id: parseInt(id) },
      data: validated,
    });

    return NextResponse.json({ data: category });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return handleApiError(error);
  }
}
