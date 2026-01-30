import { couponService } from "@/modules/coupon/coupon.service";
import { prisma } from "@/lib/prisma";
import { CouponTable } from "@/components/admin/finance/CouponTable";
import { CouponFormModal } from "@/components/admin/finance/CouponFormModal";

export const dynamic = 'force-dynamic';

export default async function CouponsPage() {
  const coupons = await couponService.listCoupons();
  const plans = await prisma.pricingPlan.findMany();

  // Serializing decimals/dates for client components
  const serializedCoupons = coupons.map(c => ({
    ...c,
    value: Number(c.value),
    validFrom: c.validFrom ? c.validFrom.toISOString() : null,
    validTo: c.validTo ? c.validTo.toISOString() : null,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  }));

  const serializedPlans = plans.map(p => ({
    ...p,
    priceMonthly: p.priceMonthly ? Number(p.priceMonthly) : null,
    priceYearly: p.priceYearly ? Number(p.priceYearly) : null,
    priceOneTime: p.priceOneTime ? Number(p.priceOneTime) : null,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Coupons Management</h1>
        <CouponFormModal plans={serializedPlans} />
      </div>
      
      {serializedCoupons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 border rounded-md bg-slate-50 text-slate-500">
            <p className="text-lg font-medium">No coupons found</p>
            <p className="text-sm">Create a new coupon to get started.</p>
        </div>
      ) : (
        <CouponTable coupons={serializedCoupons} plans={serializedPlans} />
      )}
    </div>
  );
}
