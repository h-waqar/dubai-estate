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
  const subscriptions = await getSubscribers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
        <p className="text-muted-foreground mt-2">
          List of all active and past subscriptions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Subscriptions ({subscriptions.length})</CardTitle>
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
                  <TableHead>Created Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No subscriptions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">{sub.user.name || "N/A"}</TableCell>
                      <TableCell>{sub.user.email}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{sub.plan?.name}</Badge>
                      </TableCell>
                      <TableCell>{sub.plan?.type}</TableCell>
                      <TableCell>
                        {sub.plan?.type === "SUBSCRIPTION" ? (
                            <>AED {Number(sub.plan?.priceMonthly).toLocaleString()} /mo</>
                        ) : (
                            <>AED {Number(sub.plan?.priceOneTime || 0).toLocaleString()} (One-Time)</>
                        )}
                      </TableCell>
                      <TableCell>
                        {sub.status ? (
                          <Badge variant={sub.status === 'ACTIVE' ? 'default' : 'secondary'}>
                            {sub.status}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {sub.paypalSubscriptionId ? sub.paypalSubscriptionId.substring(0, 8) + '...' : '-'}
                      </TableCell>
                      <TableCell>{format(new Date(sub.createdAt), "MMM d, yyyy")}</TableCell>
                      <TableCell className="text-right">
                        <SubscriptionActions 
                          userId={sub.user.id} 
                          subscriptionId={sub.paypalSubscriptionId} 
                          status={sub.status} 
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
