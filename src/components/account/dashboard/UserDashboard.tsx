import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, Home, Eye, Star, Zap, ArrowUp } from "lucide-react";

export async function UserDashboard({ session }: { session: any }) {
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      properties: { select: { id: true, views: true } },
      pricingPlan: true,
      entitlementGrants: {
        include: { definition: true },
        where: { status: 'ACTIVE' }
      }
    }
  });

  if (!user) return null;

  const activeListings = user.properties.length;
  const totalViews = user.properties.reduce((sum, p) => sum + (p.views || 0), 0);
  const planName = user.pricingPlan?.name || "No Plan";
  
  const getGrantStats = (code: string) => {
    const grants = user.entitlementGrants.filter(g => g.definition.code === code);
    const total = grants.reduce((sum, g) => sum + g.amount, 0);
    const used = grants.reduce((sum, g) => sum + g.used, 0);
    return { total, used, available: total - used };
  };

  const propertySlots = getGrantStats('PROPERTY_SLOT');
  const featuredCredits = getGrantStats('FEATURED_CREDIT');
  const spotlightCredits = getGrantStats('SPOTLIGHT_CREDIT');
  const bumpUpCredits = getGrantStats('BUMP_UP_CREDIT');

  const stats = [
    {
      title: "Current Plan",
      value: planName,
      icon: CreditCard,
      description: `${propertySlots.used} / ${propertySlots.total} listings used`
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

  const creditStats = [
    { title: "Featured", value: featuredCredits.available, icon: Star, color: "text-purple-500" },
    { title: "Spotlight", value: spotlightCredits.available, icon: Zap, color: "text-amber-500" },
    { title: "Bump Up", value: bumpUpCredits.available, icon: ArrowUp, color: "text-blue-500" }
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

      <h2 className="text-xl font-semibold mt-8">Available Credits</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {creditStats.map((credit) => {
          const Icon = credit.icon;
          return (
            <Card key={credit.title} className="border-l-4 border-l-primary/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{credit.title} Credits</CardTitle>
                <Icon className={credit.color + " h-4 w-4"} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{credit.value}</div>
                <p className="text-xs text-muted-foreground">Ready to use</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
