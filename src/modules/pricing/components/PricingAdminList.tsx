"use client";

import { PricingPlan } from "@/generated/prisma";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { deletePlanAction } from "../actions/managePlan";
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
    initialPlans: (PricingPlan & { _count: { users: number } })[];
}

export default function PricingAdminList({ initialPlans }: PricingAdminListProps) {
    const [plans, setPlans] = useState(initialPlans);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [planToDelete, setPlanToDelete] = useState<PricingPlan | null>(null);

    const confirmDelete = (plan: PricingPlan) => {
        setPlanToDelete(plan);
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
                    <p className="text-muted-foreground mt-2">
                        Manage subscription plans and listing quotas for your agents.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/admin/pricing/new">
                        <Plus className="mr-2 h-4 w-4" /> Add Plan
                    </Link>
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Plans</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Monthly/One-Time</TableHead>
                                    <TableHead>Yearly</TableHead>
                                    <TableHead className="text-center">Max Listings</TableHead>
                                    <TableHead className="text-center">Users</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {plans.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                                            No pricing plans found. Create your first plan to get started.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    plans.map((plan) => (
                                        <TableRow key={plan.id}>
                                            <TableCell className="font-medium">{plan.name}</TableCell>
                                            <TableCell><Badge variant="outline">{plan.type}</Badge></TableCell>
                                            <TableCell>
                                                {plan.type === "SUBSCRIPTION" 
                                                    ? `AED ${Number(plan.priceMonthly).toLocaleString()}` 
                                                    : `AED ${Number(plan.priceOneTime).toLocaleString()}`}
                                            </TableCell>
                                            <TableCell>
                                                {plan.type === "SUBSCRIPTION" 
                                                    ? `AED ${Number(plan.priceYearly).toLocaleString()}` 
                                                    : "-"}
                                            </TableCell>
                                            <TableCell className="text-center">{plan.maxListings}</TableCell>
                                            <TableCell className="text-center">{plan._count?.users || 0}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-center">
                                                    {plan.isActive ? (
                                                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <XCircle className="h-5 w-5 text-red-500" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" asChild>
                                                        <Link href={`/admin/pricing/edit/${plan.id}`}>
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                                        onClick={() => confirmDelete(plan)}
                                                        disabled={deletingId === plan.id}
                                                    >
                                                        {deletingId === plan.id ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="h-4 w-4" />
                                                        )}
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
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the 
                            <span className="font-bold text-foreground"> {planToDelete?.name} </span> 
                            plan and remove it from our servers.
                            {planToDelete?.paypalPlanId && (
                                <p className="mt-2 text-yellow-600 dark:text-yellow-500">
                                    Note: This will also deactivate the associated plan in PayPal.
                                </p>
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            Delete Plan
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
