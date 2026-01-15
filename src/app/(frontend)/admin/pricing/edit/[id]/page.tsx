import { PlanForm } from "@/modules/pricing/components/PlanForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlanAction } from "@/modules/pricing/actions/managePlan";
import { notFound } from "next/navigation";

interface EditPlanPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPlanPage({ params }: EditPlanPageProps) {
  const { id } = await params;
  const plan = await getPlanAction(parseInt(id));

  if (!plan) {
    notFound();
  }

  // Transform Prisma decimals to numbers for the form
  const formattedPlan = {
    id: plan.id,
    name: plan.name,
    slug: plan.slug,
    description: plan.description || undefined,
    type: plan.type as "SUBSCRIPTION" | "ONE_TIME",
    maxListings: plan.maxListings || undefined,
    priceMonthly: plan.priceMonthly ? Number(plan.priceMonthly) : 0,
    priceYearly: plan.priceYearly ? Number(plan.priceYearly) : 0,
    priceOneTime: plan.priceOneTime ? Number(plan.priceOneTime) : 0,
    isActive: plan.isActive,
    paypalPlanId: plan.paypalPlanId || undefined,
    paypalProductId: plan.paypalProductId || undefined,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Pricing Plan</h1>
        <p className="text-muted-foreground mt-2">
          Update existing plan details.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit {plan.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanForm initialData={formattedPlan} isEditing={true} />
        </CardContent>
      </Card>
    </div>
  );
}