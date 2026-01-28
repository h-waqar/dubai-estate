import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AccountForm from "../AccountForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/account/profile");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { profile: true },
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Profile Settings</h1>
      <Card>
          <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your personal details here.</CardDescription>
          </CardHeader>
          <CardContent>
              <AccountForm user={user} />
          </CardContent>
      </Card>
    </div>
  );
}
