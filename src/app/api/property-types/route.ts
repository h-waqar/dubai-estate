import { getAllPropertyTypes, createPropertyType } from "@/modules/property/actions/propertyType.actions";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errorHandler";

export async function GET() {
    try {
        const propertyTypes = await getAllPropertyTypes();
        return NextResponse.json({ data: propertyTypes });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const propertyType = await createPropertyType(request);
        return NextResponse.json({ data: propertyType }, { status: 201 });
    } catch (error) {
        return handleApiError(error);
    }
}
