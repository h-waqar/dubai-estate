import Header from "@/components/layout/Header";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Star, Zap, ArrowUp } from "lucide-react";
import UserTransactionList from "@/modules/pricing/components/UserTransactionList";

export default async function BillingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    include: { 
      pricingPlan: true,
      entitlementGrants: {
        include: { definition: true },
        where: { status: 'ACTIVE' }
      }
    }
  });

  const getGrantStats = (code: string) => {
    const grants = user?.entitlementGrants.filter(g => g.definition.code === code) || [];
    const total = grants.reduce((sum, g) => sum + g.amount, 0);
    const used = grants.reduce((sum, g) => sum + g.used, 0);
    return { total, used, available: total - used };
  };

  const creditStats = [
    { title: "Featured", value: getGrantStats('FEATURED_CREDIT').available, icon: Star, color: "text-purple-500", desc: "Pinned listings" },
    { title: "Spotlight", value: getGrantStats('SPOTLIGHT_CREDIT').available, icon: Zap, color: "text-amber-500", desc: "Golden borders" },
    { title: "Bump Up", value: getGrantStats('BUMP_UP_CREDIT').available, icon: ArrowUp, color: "text-blue-500", desc: "Move to top" }
  ];

  return (
    <>
      {/* <Header /> */}
      <main className="min-h-screen bg-muted/30 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Billing & Entitlements</h1>
              <p className="text-muted-foreground mt-1">Manage your active subscription and usage.</p>
            </div>
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="py-4 flex items-center gap-4">
                <CreditCard className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-xs font-medium uppercase text-muted-foreground">Active Plan</p>
                  <p className="font-bold">{user?.pricingPlan?.name || "Free Tier"}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Active Usage</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {creditStats.map((credit) => (
                <Card key={credit.title}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <credit.icon className={`${credit.color} w-5 h-5`} />
                      <CardTitle className="text-sm font-medium">{credit.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{credit.value}</div>
                    <p className="text-xs text-muted-foreground">{credit.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Billing History</h2>
            <UserTransactionList userId={Number(session.user.id)} />
          </section>

        </div>
      </main>
    </>
  );
}
