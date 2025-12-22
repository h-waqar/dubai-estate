import { getPropertyType, updatePropertyType, deletePropertyType } from "@/modules/property/actions/propertyType.actions";
import { NextRequest, NextResponse } from "next/server";
import { handleApiError } from "@/lib/errorHandler";

interface Params {
    params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        const propertyType = await getPropertyType(params.id);
        if (!propertyType) {
            return NextResponse.json({ error: "Property Type not found" }, { status: 404 });
        }
        return NextResponse.json({ data: propertyType });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PATCH(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        const propertyType = await updatePropertyType(request, params.id);
        return NextResponse.json({ data: propertyType });
    } catch (error) {
        return handleApiError(error);
    }
}

export async function DELETE(request: NextRequest, props: Params) {
    const params = await props.params;
    try {
        await deletePropertyType(params.id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return handleApiError(error);
    }
}
