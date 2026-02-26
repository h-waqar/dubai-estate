"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, RefreshCw, XCircle, FileText, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { syncSubscriptionStatus, cancelUserSubscription } from "@/modules/admin/actions/subscription";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TransactionList from "./TransactionList";

interface SubscriptionActionsProps {
  userId: number;
  subscriptionId: string | null;
  status: string | null;
}

export default function SubscriptionActions({ userId, subscriptionId, status }: SubscriptionActionsProps) {
  const [loading, setLoading] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  if (!subscriptionId) return <span className="text-muted-foreground text-xs">-</span>;

  const handleSync = async () => {
    setLoading(true);
    const result = await syncSubscriptionStatus(userId, subscriptionId);
    setLoading(false);
    if (result.success) {
      toast.success(`Status synced: ${result.status}`);
    } else {
      toast.error(result.error);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this subscription? This cannot be undone.")) return;
    
    setLoading(true);
    const result = await cancelUserSubscription(userId, subscriptionId);
    setLoading(false);
    if (result.success) {
      toast.success("Subscription cancelled");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleSync}>
            <RefreshCw className="mr-2 h-4 w-4" /> Sync Status
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowTransactions(true)}>
            <FileText className="mr-2 h-4 w-4" /> View Transactions
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleCancel} 
            className="text-red-600 focus:text-red-600 focus:bg-red-50"
            disabled={status === "CANCELLED"}
          >
            <XCircle className="mr-2 h-4 w-4" /> Cancel Subscription
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showTransactions} onOpenChange={setShowTransactions}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Transaction History</DialogTitle>
            <DialogDescription>
              Recent payments for subscription {subscriptionId}
            </DialogDescription>
          </DialogHeader>
          <TransactionList userId={userId} />
        </DialogContent>
      </Dialog>
    </>
  );
}
