import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { AgentDashboard } from "@/components/account/dashboard/AgentDashboard";
import { UserDashboard } from "@/components/account/dashboard/UserDashboard";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) return null;

  const roles = session.user.roles;

  if (roles.includes("AGENT") || roles.includes("ADMIN")) {
    return <AgentDashboard session={session} />;
  }

  return <UserDashboard session={session} />;
}
