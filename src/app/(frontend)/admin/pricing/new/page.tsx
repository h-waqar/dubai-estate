import { PlanForm } from "@/modules/pricing/components/PlanForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPlanPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Pricing Plan</h1>
        <p className="text-muted-foreground mt-2">
          Add a new subscription or one-time payment plan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Plan Details</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanForm />
        </CardContent>
      </Card>
    </div>
  );
}