import Header from "@/components/layout/Header";
import { listPlans } from "@/modules/pricing/actions/listPlans";
import PricingList from "@/modules/pricing/components/PricingList";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";

export const metadata = {
  title: "Pricing Plans - Dubai Estate",
  description: "Choose a subscription plan to start listing your properties.",
};

export default async function PricingPage() {
  const plans = await listPlans();
  const session = await getServerSession(authOptions);
  
  // Filter for active subscription plans
  const subscriptionPlans = plans.filter(p => p.isActive && p.type === "SUBSCRIPTION");

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
            {/* Using PricingList to handle PayPal Context globally for the list */}
            <PricingList plans={subscriptionPlans} userId={session?.user?.id} />
          </div>

        </div>
      </main>
    </>
  );
}
