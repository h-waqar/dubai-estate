import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { redirect } from "next/navigation";
import { listEntitlementDefinitionsAction } from "@/modules/entitlement/actions/entitlement.actions";
import EntitlementAdminList from "@/modules/entitlement/components/EntitlementAdminList";

export const metadata = {
  title: "Manage Entitlements | Admin",
  description: "Create and manage platform entitlement definitions.",
};

export default async function EntitlementsAdminPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?callbackUrl=/admin/entitlements");
  }

  const hasAccess = 
    session.user.roles.includes("ADMIN") || 
    session.user.roles.includes("SUPER_ADMIN");

  if (!hasAccess) {
    redirect("/unauthorized");
  }

  const result = await listEntitlementDefinitionsAction();
  
  if ("error" in result) {
    return (
      <div className="p-8 text-red-500 bg-red-50 border border-red-200 rounded-lg">
        <h1 className="text-xl font-bold">Error Loading Entitlements</h1>
        <p>{result.error as string}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Console</h1>
        <p className="text-muted-foreground">
          Platform-wide configuration and management.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border shadow-sm">
        <EntitlementAdminList initialDefinitions={result.data || []} />
      </div>
    </div>
  );
}
