import { registerUser } from "@/modules/user/actions/register.action";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const result = await registerUser(formData);
        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json(
            { error: "Invalid form data or request format" }, 
            { status: 400 }
        );
    }
}