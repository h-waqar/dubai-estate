"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AdminLedgerTableProps {
  initialData: any[];
  total: number;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onFilterChange: (filters: any) => void;
}

export function AdminLedgerTable({
  initialData,
  total,
  currentPage,
  totalPages,
  onPageChange,
  onFilterChange,
}: AdminLedgerTableProps) {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleTypeChange = (val: string) => {
    setTypeFilter(val);
    onFilterChange({ type: val === "all" ? undefined : val });
  };

  const handleStatusChange = (val: string) => {
    setStatusFilter(val);
    onFilterChange({ status: val === "all" ? undefined : val });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full sm:w-[200px]">
          <label className="text-xs font-medium mb-1 block">Transaction Type</label>
          <Select value={typeFilter} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="PAYMENT">Payment</SelectItem>
              <SelectItem value="REFUND">Refund</SelectItem>
              <SelectItem value="CREDIT">Credit</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-[200px]">
          <label className="text-xs font-medium mb-1 block">Status</label>
          <Select value={statusFilter} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="COMPLETED">Completed</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="FAILED">Failed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1" />
        <div className="text-sm text-muted-foreground pb-2">
            Total: {total} transactions
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Provider ID</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {initialData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No transactions found.
                </TableCell>
              </TableRow>
            ) : (
              initialData.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="whitespace-nowrap">
                    {format(new Date(tx.occurredAt), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{tx.user?.name || "Unknown"}</span>
                      <span className="text-xs text-muted-foreground">{tx.user?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{tx.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        tx.status === 'COMPLETED' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                        tx.status === 'FAILED' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                        'bg-gray-100 text-gray-700 hover:bg-gray-100'
                      }
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono">
                    {tx.currency} {Number(tx.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="font-mono text-[10px] text-muted-foreground max-w-[120px] truncate">
                    {tx.providerTxId}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
