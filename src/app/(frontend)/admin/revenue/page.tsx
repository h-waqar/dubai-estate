import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    DollarSign, 
    TrendingUp, 
    Users, 
    ArrowUpRight, 
    Wallet,
} from "lucide-react";
import { getGlobalLedger, getLedgerStats } from "@/modules/admin/actions/ledger";
import RevenueClient from "./RevenueClient";

export default async function RevenuePage() {
    const [statsResult, ledgerResult, plansWithUserCount] = await Promise.all([
        getLedgerStats(),
        getGlobalLedger({ page: 1, limit: 10 }),
        prisma.pricingPlan.findMany({
            select: {
                id: true,
                name: true,
                priceMonthly: true,
                _count: {
                    select: { users: true }
                }
            }
        })
    ]);

    const totalRealizedRevenue = statsResult.success ? statsResult.totalRevenue : 0;

    const totalMonthlyRevenue = plansWithUserCount.reduce((acc, plan) => {
        return acc + (Number(plan.priceMonthly) * plan._count.users);
    }, 0);

    const totalUsersWithPlans = plansWithUserCount.reduce((acc, plan) => acc + plan._count.users, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Revenue Analysis</h1>
                <p className="text-muted-foreground mt-2">
                    Detailed breakdown of your platform&#39;s financial performance.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Total Realized Revenue</CardTitle>
                        <Wallet className="h-4 w-4 text-emerald-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">AED {(totalRealizedRevenue || 0).toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Total processed via Ledger
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Monthly Recurring (MRR)</CardTitle>
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">AED {totalMonthlyRevenue.toLocaleString()}</div>
                        <div className="flex items-center text-xs text-emerald-500 mt-1">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <span>Projected from active plans</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">Subscribed Users</CardTitle>
                        <Users className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsersWithPlans}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Agents on a paid plan
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                        <CardTitle className="text-sm font-medium">ARPU</CardTitle>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            AED {totalUsersWithPlans > 0 ? (totalMonthlyRevenue / totalUsersWithPlans).toFixed(2) : "0"}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Avg. Revenue Per User (Projected)
                        </p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Revenue by Plan (Projected)</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {plansWithUserCount.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">No plans found.</p>
                        ) : (
                            plansWithUserCount.map((plan) => {
                                const planRevenue = Number(plan.priceMonthly) * plan._count.users;
                                const percentage = totalMonthlyRevenue > 0 ? (planRevenue / totalMonthlyRevenue) * 100 : 0;
                                
                                return (
                                    <div key={plan.id} className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">{plan.name}</span>
                                                <span className="text-muted-foreground">({plan._count.users} users)</span>
                                            </div>
                                            <span className="font-bold">AED {planRevenue.toLocaleString()}</span>
                                        </div>
                                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-primary transition-all" 
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </CardContent>
            </Card>

            <RevenueClient initialLedger={ledgerResult} />
        </div>
    );
}
