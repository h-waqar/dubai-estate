"use client";

import { useState } from "react";
import { AdminLedgerTable } from "@/modules/admin/components/AdminLedgerTable";
import { getGlobalLedger, LedgerFilterInput } from "@/modules/admin/actions/ledger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface RevenueClientProps {
  initialLedger: any;
}

export default function RevenueClient({ initialLedger }: RevenueClientProps) {
  const [data, setData] = useState(initialLedger.data || []);
  const [total, setTotal] = useState(initialLedger.total || 0);
  const [currentPage, setCurrentPage] = useState(initialLedger.page || 1);
  const [totalPages, setTotalPages] = useState(initialLedger.totalPages || 1);
  const [filters, setFilters] = useState<LedgerFilterInput>({});
  const [loading, setLoading] = useState(false);

  const fetchLedger = async (page: number, newFilters?: LedgerFilterInput) => {
    setLoading(true);
    const combinedFilters = { ...filters, ...newFilters, page };
    const result = await getGlobalLedger(combinedFilters);
    
    if (result.success) {
      setData(result.data);
      setTotal(result.total);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
      if (newFilters) setFilters(prev => ({ ...prev, ...newFilters }));
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Financial Audit Ledger</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={loading ? "opacity-50 pointer-events-none transition-opacity" : ""}>
          <AdminLedgerTable
            initialData={data}
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => fetchLedger(page)}
            onFilterChange={(newFilters) => fetchLedger(1, newFilters)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
