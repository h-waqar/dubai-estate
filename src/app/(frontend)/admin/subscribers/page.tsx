import { getSubscribers } from "@/modules/pricing/actions/getSubscribers";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import SubscriptionActions from "@/modules/admin/components/SubscriptionActions";

export default async function SubscribersPage() {
  const subscribers = await getSubscribers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
        <p className="text-muted-foreground mt-2">
          List of users with active pricing plans.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Payers ({subscribers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sub ID</TableHead>
                  <TableHead>Joined Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No active subscribers found.
                    </TableCell>
                  </TableRow>
                ) : (
                  subscribers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name || "N/A"}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.pricingPlan?.name}</Badge>
                      </TableCell>
                      <TableCell>{user.pricingPlan?.type}</TableCell>
                      <TableCell>
                        {user.pricingPlan?.type === "SUBSCRIPTION" ? (
                            <>AED {Number(user.pricingPlan?.priceMonthly).toLocaleString()} /mo</>
                        ) : (
                            <>AED {Number(user.pricingPlan?.priceOneTime || 0).toLocaleString()} (One-Time)</>
                        )}
                      </TableCell>
                      <TableCell>
                        {user.subscriptionStatus ? (
                          <Badge variant={user.subscriptionStatus === 'ACTIVE' ? 'default' : 'secondary'}>
                            {user.subscriptionStatus}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {user.subscriptionId ? user.subscriptionId.substring(0, 8) + '...' : '-'}
                      </TableCell>
                      <TableCell>{format(new Date(user.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <SubscriptionActions 
                          userId={user.id} 
                          subscriptionId={user.subscriptionId} 
                          status={user.subscriptionStatus} 
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
