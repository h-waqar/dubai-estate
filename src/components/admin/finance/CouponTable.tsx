"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";
import { deleteCouponAction } from "@/actions/coupon";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CouponFormModal } from "./CouponFormModal";

interface CouponTableProps {
  coupons: any[];
  plans: any[];
}

export function CouponTable({ coupons, plans }: CouponTableProps) {
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'EXPIRED'>('ALL');
  const [editingCoupon, setEditingCoupon] = useState<any>(null);

  const filteredCoupons = coupons.filter(coupon => {
    const now = new Date();
    const validTo = coupon.validTo ? new Date(coupon.validTo) : null;
    const isExpired = (validTo && validTo < now) || 
                      (coupon.maxUsage && coupon.usedCount >= coupon.maxUsage);
    
    if (filter === 'ACTIVE') return coupon.isActive && !isExpired;
    if (filter === 'EXPIRED') return isExpired;
    return true;
  });

  const handleDelete = async (id: string) => {
      if (!confirm("Are you sure you want to delete this coupon?")) return;
      const res = await deleteCouponAction(id);
      if (res.success) {
          toast.success("Coupon deleted");
      } else {
          toast.error(res.error || "Failed to delete");
      }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button variant={filter === 'ALL' ? 'default' : 'outline'} onClick={() => setFilter('ALL')}>All</Button>
        <Button variant={filter === 'ACTIVE' ? 'default' : 'outline'} onClick={() => setFilter('ACTIVE')}>Active</Button>
        <Button variant={filter === 'EXPIRED' ? 'default' : 'outline'} onClick={() => setFilter('EXPIRED')}>Expired</Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Usage</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCoupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell className="font-medium">{coupon.code}</TableCell>
                <TableCell>{coupon.type}</TableCell>
                <TableCell>
                  {coupon.type === 'PERCENTAGE' ? `${coupon.value}%` : `$${coupon.value}`}
                </TableCell>
                <TableCell>
                  {coupon.usedCount} / {coupon.maxUsage || '∞'}
                </TableCell>
                <TableCell>
                  {coupon.validTo ? new Date(coupon.validTo).toLocaleDateString() : 'Forever'}
                </TableCell>
                <TableCell>
                  <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingCoupon(coupon)}>
                        <Edit className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(coupon.id)} className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {editingCoupon && (
        <CouponFormModal 
            coupon={editingCoupon} 
            plans={plans}
            open={!!editingCoupon} 
            onOpenChange={(open) => !open && setEditingCoupon(null)} 
        />
      )}
    </div>
  );
}
