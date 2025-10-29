import { registerUser } from "@/modules/user/actions/register.action";
import {NextRequest} from "next/server";

export async function POST(req: NextRequest) {
    return await registerUser(req);
}