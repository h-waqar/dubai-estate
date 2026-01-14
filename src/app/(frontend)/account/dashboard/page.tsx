import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CreditCard, Home, Eye } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { 
      properties: {
        select: { id: true, views: true }
      },
      pricingPlan: true
    }
  });

  if (!user) return null;

  const activeListings = user.properties.length;
  const totalViews = user.properties.reduce((sum, p) => sum + (p.views || 0), 0);
  const planName = user.pricingPlan?.name || "No Plan";
  const limit = user.pricingPlan?.maxListings || 3;

  const stats = [
    {
      title: "Current Plan",
      value: planName,
      icon: CreditCard,
      description: `${activeListings} / ${limit} listings used`
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
    },
    {
      title: "Leads Received",
      value: "0", // Need to join leads table if accessible
      icon: Activity,
      description: "Inquiries last 30 days"
    }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity or other sections could go here */}
    </div>
  );
}