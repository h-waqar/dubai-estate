import { deleteUser } from "@/modules/user/actions/admin.actions";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  return await deleteUser(Number(params.id));
}
