"use client";

import { PricingPlan } from "@prisma/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Loader2, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { deletePlanAction, syncPlanAction, syncAllPlansAction } from "../actions/managePlan";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PricingAdminListProps {
    initialPlans: (PricingPlan & { 
      _count: { users: number },
      entitlements?: { amount: number, definition: { name: string, code: string } }[]
    })[];
}

export default function PricingAdminList({ initialPlans }: PricingAdminListProps) {
    const [plans, setPlans] = useState(initialPlans);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [syncingId, setSyncingId] = useState<number | null>(null);
    const [isSyncingAll, setIsSyncingAll] = useState(false);
    const [planToDelete, setPlanToDelete] = useState<PricingPlan | null>(null);

    const handleSync = async (id: number) => {
        setSyncingId(id);
        try {
            const result = await syncPlanAction(id);
            if (result.success) {
                setPlans(plans.map(p => p.id === id ? { ...p, isActive: result.isActive } : p));
                toast.success(result.message || "Plan synced successfully");
            } else {
                toast.error(result.error || "Failed to sync plan");
            }
        } catch (error) {
            toast.error("An error occurred while syncing");
        } finally {
            setSyncingId(null);
        }
    };

    const handleSyncAll = async () => {
        setIsSyncingAll(true);
        try {
            const result = await syncAllPlansAction();
            if (result.success) {
                toast.success(result.message || "All plans synced successfully");
                window.location.reload();
            } else {
                toast.error(result.error || "Failed to sync plans");
            }
        } catch (error) {
            toast.error("An error occurred during bulk sync");
        } finally {
            setIsSyncingAll(false);
        }
    };

    const handleDelete = async () => {
        if (!planToDelete) return;
        setDeletingId(planToDelete.id);
        try {
            const result = await deletePlanAction(planToDelete.id);
            if (result.success) {
                setPlans(plans.filter(p => p.id !== planToDelete.id));
                toast.success("Plan deleted successfully");
            } else {
                toast.error(result.error || "Failed to delete plan");
            }
        } catch (error) {
            toast.error("An error occurred while deleting");
        } finally {
            setDeletingId(null);
            setPlanToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Pricing Plans</h1>
                    <p className="text-muted-foreground mt-2">Manage subscription plans and listing quotas.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSyncAll} disabled={isSyncingAll}>
                        {isSyncingAll ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                        Sync All
                    </Button>
                    <Button asChild>
                        <Link href="/admin/pricing/new">
                            <Plus className="mr-2 h-4 w-4" /> Add Plan
                        </Link>
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader><CardTitle>All Plans</CardTitle></CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Entitlements</TableHead>
                                    <TableHead className="text-center">Users</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.length === 0 ? (
                                    <TableRow><TableCell colSpan={7} className="h-24 text-center">No plans found.</TableCell></TableRow>
                                ) : (
                                    plans.map((plan) => (
                                        <TableRow key={plan.id}>
                                            <TableCell className="font-medium">{plan.name}</TableCell>
                                            <TableCell><Badge variant="outline">{plan.type}</Badge></TableCell>
                                            <TableCell>
                                                {plan.type === "SUBSCRIPTION" 
                                                    ? `$${Number(plan.priceMonthly)}/mo` 
                                                    : `$${Number(plan.priceOneTime)} once`}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-1">
                                                    {plan.entitlements?.filter(e => e.amount > 0).map(e => (
                                                        <Badge key={e.definition.code} variant="secondary" className="text-[10px]">
                                                            {e.amount} {e.definition.name}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">{plan._count?.users || 0}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    {plan.isActive ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="ghost" size="icon" className="text-blue-500"
                                                        onClick={() => handleSync(plan.id)}
                                                        disabled={syncingId === plan.id}
                                                        title="Sync with PayPal"
                                                    >
                                                        {syncingId === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                                    </Button>
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/pricing/edit/${plan.id}`}><Edit className="h-4 w-4" /></Link>
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" size="icon" className="text-red-500"
                                                        onClick={() => setPlanToDelete(plan)}
                                                        disabled={deletingId === plan.id}
                                                    >
                                                        {deletingId === plan.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={!!planToDelete} onOpenChange={(open) => !open && setPlanToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete {planToDelete?.name}?</AlertDialogTitle>
                        <AlertDialogDescription>This will remove the plan from the DB and PayPal.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600">Delete</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
