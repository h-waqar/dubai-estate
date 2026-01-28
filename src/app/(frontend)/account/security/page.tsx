import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { redirect } from "next/navigation";
import ChangePasswordForm from "../ChangePasswordForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SecurityPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/account/security");
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Security Settings</h1>
      <Card>
          <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your password and security preferences.</CardDescription>
          </CardHeader>
          <CardContent>
              <ChangePasswordForm />
          </CardContent>
      </Card>
    </div>
  );
}
