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
  userId: number;
}

export default function TransactionList({ userId }: TransactionListProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refunding, setRefunding] = useState<string | null>(null);

  const fetchTransactions = async () => {
    setLoading(true);
    const result = await listUserTransactions(userId);
    if (result.success) {
      setTransactions(result.transactions || []);
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

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
                <TableCell>{format(new Date(tx.occurredAt), "MMM d, yyyy")}</TableCell>
                <TableCell>{tx.type}</TableCell>
                <TableCell>{tx.status}</TableCell>
                <TableCell>{tx.currency} {Number(tx.amount).toFixed(2)}</TableCell>
                <TableCell>
                  {tx.status === "COMPLETED" && tx.type === "PAYMENT" && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleRefund(tx.providerTxId)}
                      disabled={refunding === tx.providerTxId}
                    >
                      {refunding === tx.providerTxId ? <Loader2 className="h-3 w-3 animate-spin" /> : <RotateCcw className="h-3 w-3 mr-1" />}
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
