import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Home, Eye } from "lucide-react";
import { getUserEntitlementsAction, getActivePromotionsAction } from "@/modules/promotions/actions/promotions.actions";
import { QuotasPreview } from "./QuotasPreview";

export async function UserDashboard({ session }: { session: any }) {
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      properties: { select: { id: true, views: true } },
      pricingPlan: true,
    }
  });

  if (!user) return null;

  const entitlementsRes = await getUserEntitlementsAction();
  const promotionsRes = await getActivePromotionsAction();

  const entitlements = entitlementsRes.success ? entitlementsRes.entitlements : {};
  const promotions = (promotionsRes.success ? promotionsRes.promotions : []) || [];

  const activeListings = user.properties.length;
  const totalViews = user.properties.reduce((sum, p) => sum + (p.views || 0), 0);
  const planName = user.pricingPlan?.name || "No Plan";
  
  const propertyQuota = (entitlements as any)["PROPERTY_SLOT"] || { total: 0, used: 0 };

  const stats = [
    {
      title: "Current Plan",
      value: planName,
      icon: CreditCard,
      description: `${propertyQuota.used} / ${propertyQuota.total} listings used`
    },
    {
      title: "Active Listings",
      value: activeListings.toString(),
      icon: Home,
      description: "Properties currently live"
    },
    {
      title: "Total Views",
      value: totalViews.toString(),
      icon: Eye,
      description: "Across all properties"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8">
        <QuotasPreview entitlements={entitlements as any} promotions={promotions} />
      </div>
    </div>
  );
}
