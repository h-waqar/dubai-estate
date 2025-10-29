import { getAllCategories, createCategory } from "@/modules/blog/actions/category.actions";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errorHandler";

export async function GET() {
    try {
        const categories = await getAllCategories();
        return NextResponse.json({ data: categories });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const category = await createCategory(request);
        return NextResponse.json({ data: category }, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}