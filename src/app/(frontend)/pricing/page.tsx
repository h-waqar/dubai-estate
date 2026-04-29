import Header from "@/components/layout/Header";
import { listPlans } from "@/modules/pricing/actions/listPlans";
import { listAddonPacksAction } from "@/modules/pricing/actions/addonPacks";
import { PricingList } from "@/modules/pricing/components/PricingList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddonStore } from "@/modules/pricing/components/AddonStore";
import { prisma } from "@/lib/prisma";
import { serializeDecimals } from "@/lib/serializeDecimal";
import PayPalProvider from "@/modules/pricing/components/PayPalProvider";

export const metadata = {
  title: "Pricing Plans - Dubai Estate",
  description: "Choose a subscription plan to start listing your properties.",
};

export default async function PricingPage(props: { searchParams: Promise<{ tab?: string }> }) {
  const searchParams = await props.searchParams;
  const plans = await listPlans();
  const session = await getServerSession(authOptions);
  
  const activeTab = searchParams.tab || "plans";

  // Filter for active subscription plans
  const subscriptionPlans = plans.filter(p => p.isActive && p.type === "SUBSCRIPTION");
  const addonPlans = plans.filter(p => p.isActive && (p.type === "ADDON" || p.type === "ONE_TIME"));

  const packsRes = await listAddonPacksAction();
  const addonPacks = packsRes.success ? packsRes.packs : [];

  // Fetch current user's active subscription for upgrade logic
  const user = session?.user?.id ? await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    include: {
      subscriptions: {
        where: { status: "ACTIVE" },
        include: { plan: true },
        orderBy: { createdAt: "desc" },
        take: 1
      }
    }
  }) : null;

  const activeSubscription = serializeDecimals(user?.subscriptions[0] || null);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-muted/30 py-20 px-4">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your business needs. Upgrade or cancel anytime.
            </p>
          </div>

          <PayPalProvider>
            <Tabs defaultValue={activeTab} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid w-full max-w-md grid-cols-2">
                  <TabsTrigger value="plans">Monthly Plans</TabsTrigger>
                  <TabsTrigger value="addons">Addons & Credits</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="plans" className="space-y-8">
                <PricingList 
                  plans={subscriptionPlans} 
                  currentPlanId={activeSubscription?.planId}
                  userId={session?.user?.id}
                />
              </TabsContent>

              <TabsContent value="addons">
                <AddonStore 
                  addonPlans={addonPlans} 
                  userId={session?.user?.id} 
                  packs={addonPacks}
                />
              </TabsContent>
            </Tabs>
          </PayPalProvider>

        </div>
      </main>
    </>
  );
}
