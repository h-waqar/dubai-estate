"use client";

import { useEffect, useState } from "react";
import { listUserTransactions } from "@/modules/admin/actions/subscription";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface UserTransactionListProps {
  userId: number;
}

export default function UserTransactionList({ userId }: UserTransactionListProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    setLoading(true);
    const result = await listUserTransactions(userId);
    if (result.success) {
      setTransactions(result.transactions || []);
    } else {
      toast.error(result.error || "Failed to load transactions");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTransactions();
  }, [userId]);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="border rounded-md bg-background overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center h-24 text-muted-foreground italic">
                No recent billing transactions found.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>{format(new Date(tx.occurredAt), "MMM d, yyyy")}</TableCell>
                <TableCell className="capitalize">{tx.type.toLowerCase()}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    tx.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                    tx.status === 'FAILED' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {tx.status}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {tx.currency} {Number(tx.amount).toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
