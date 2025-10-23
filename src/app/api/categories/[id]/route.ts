// ============================================
// src/app/api/categories/[id]/route.ts
// ============================================
import { prisma } from "@/lib/prisma";
import { categoryUpdateSchema } from "@/validators/category";
import { NextResponse } from "next/server";

// GET /api/categories/:id
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: { id: parseInt(params.id) },
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
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message || "Failed to fetch category",
        error: error,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/categories/:id (admin only)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const validated = categoryUpdateSchema.parse(body);

    const category = await prisma.category.update({
      where: { id: parseInt(params.id) },
      data: validated,
    });

    return NextResponse.json({ data: category });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE /api/categories/:id (admin only)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // This will set categoryId to null on related posts (onDelete: SetNull)
    await prisma.category.delete({
      where: { id: parseInt(params.id) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
