import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AccountForm from "./AccountForm";
import ChangePasswordForm from "./ChangePasswordForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AccountPage(props: { searchParams?: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const tab = searchParams?.tab || "profile";
  
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/account");
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
      
      <Tabs defaultValue={tab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
            <Card>
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <AccountForm user={user} />
                </CardContent>
            </Card>
        </TabsContent>
        
        <TabsContent value="security">
             <Card>
                <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your password and security preferences.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ChangePasswordForm />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
