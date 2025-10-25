import { getAllCategories, createCategory } from "@/modules/blog/actions/category.actions";
import {NextRequest} from "next/server";

export async function GET() {
    return await getAllCategories();
}

export async function POST(request: NextRequest) {
    return await createCategory(request);
}