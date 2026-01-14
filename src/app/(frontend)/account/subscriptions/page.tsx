import { getUserSubscriptionDetails } from "@/modules/user/actions/subscription";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Calendar, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import RefundRequestDialog from "@/components/account/RefundRequestDialog";
import CancelSubscriptionButton from "@/components/account/CancelSubscriptionButton";

export default async function SubscriptionsPage() {
  const subscriptions = await getUserSubscriptionDetails();

  if (!subscriptions || subscriptions.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Subscriptions</h1>
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">No Active Subscription</h3>
              <p className="text-muted-foreground max-w-sm">
                You don't have an active subscription plan. Upgrade to unlock premium features and list more properties.
              </p>
            </div>
            <Button asChild>
              <Link href="/advertise">View Plans</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Subscriptions</h1>
        <Button variant="outline" asChild>
          <Link href="/account/subscriptions/history">View Payment History</Link>
        </Button>
      </div>

      <div className="space-y-6">
        {subscriptions.map((sub: any) => {
          const isActive = sub.status === "ACTIVE";
          return (
            <Card key={sub.id} className={isActive ? "border-green-200 bg-green-50/10" : "opacity-80"}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">{sub.plan?.name || "Standard Plan"}</CardTitle>
                    <CardDescription className="font-mono">ID: {sub.paypalSubscriptionId}</CardDescription>
                  </div>
                  <Badge className={isActive ? "bg-green-600" : "bg-gray-600"}>
                    {sub.status || "UNKNOWN"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Price</p>
                      <p className="font-semibold">AED {Number(sub.priceAtSubscription).toLocaleString()} /mo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Started On</p>
                      <p className="font-semibold">{format(new Date(sub.startDate), "MMM d, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Renewal</p>
                      <p className="font-semibold">{isActive ? "Automatic" : "Manual"}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                  {isActive && (
                    <>
                      <CancelSubscriptionButton subscriptionId={sub.id} />
                      <RefundRequestDialog subscriptionId={sub.id} />
                    </>
                  )}
                  {!isActive && (
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>This subscription is {sub.status?.toLowerCase()}.</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}