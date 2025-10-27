import { getCategory, updateCategory, deleteCategory } from "@/modules/blog/actions/category.actions";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errorHandler";

export async function GET(request: NextRequest, {params}: { params: { id: string } }) {
    try {
        const category = await getCategory(params.id);
        if (!category) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }
        return NextResponse.json({ data: category });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PATCH(request: NextRequest, {params}: { params: { id: string } }) {
    try {
        const category = await updateCategory(request, params.id);
        return NextResponse.json({ data: category });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(request: NextRequest, {params}: { params: { id: string } }) {
    try {
        await deleteCategory(params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}