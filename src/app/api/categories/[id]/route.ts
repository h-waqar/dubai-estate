import { getCategory, updateCategory, deleteCategory } from "@/modules/blog/actions/category.actions";
import {NextRequest} from "next/server";

export async function GET(request: NextRequest, {params}: { params: { id: string } }) {
    return await getCategory(params.id);
}

export async function PATCH(request: NextRequest, {params}: { params: { id: string } }) {
    return await updateCategory(request, params.id);
}

export async function DELETE(request: NextRequest, {params}: { params: { id: string } }) {
    return await deleteCategory(params.id);
}