import { getAllUsers } from "@/modules/user/actions/admin.actions";

export async function GET() {
    return await getAllUsers();
}