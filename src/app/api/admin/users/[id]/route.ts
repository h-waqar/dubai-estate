import { deleteUser } from "@/modules/user/actions/admin.actions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return await deleteUser(Number(id));
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.roles.includes("ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { roles } = body;

  if (!roles || !Array.isArray(roles)) {
    return NextResponse.json({ error: "Invalid roles" }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: { roles },
    });
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Failed to update user roles", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  }
}