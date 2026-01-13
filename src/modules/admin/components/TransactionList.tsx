"use client";

import { useEffect, useState } from "react";
import { listUserTransactions, refundUserTransaction } from "@/modules/admin/actions/subscription";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface TransactionListProps {
  subscriptionId: string;
}

export default function TransactionList({ subscriptionId }: TransactionListProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    const result = await listUserTransactions(subscriptionId);
    if (result.success) {
      setTransactions(result.transactions || []);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [subscriptionId]);

  const handleRefund = async (captureId: string) => {
    if (!confirm("Are you sure you want to refund this transaction?")) return;

    setRefunding(captureId);
    const result = await refundUserTransaction(captureId);
    setRefunding(null);

    if (result.success) {
      toast.success("Refund processed successfully");
      fetchTransactions(); // Refresh list
    } else {
      toast.error(result.error);
    }
  };

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                No transactions found (Last 90 days)
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{format(new Date(tx.time), "MMM d, yyyy")}</TableCell>
                <TableCell>{tx.status === "COMPLETED" ? "Payment" : tx.status}</TableCell>
                <TableCell>{tx.status}</TableCell>
                <TableCell>{tx.amount_with_breakdown.gross_amount.currency_code} {tx.amount_with_breakdown.gross_amount.value}</TableCell>
                <TableCell>
                  {tx.status === "COMPLETED" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRefund(tx.id)}
                      disabled={refunding === tx.id}
                    >
                      {refunding === tx.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3 mr-1" />}
                      Refund
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
