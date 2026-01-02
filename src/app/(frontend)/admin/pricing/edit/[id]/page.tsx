import { getPlan } from "@/modules/pricing/actions/getPlan";
import { PricingAdminForm } from "@/modules/pricing/components/PricingAdminForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface EditPricingPlanPageProps {
    params: { id: string };
}

export default async function EditPricingPlanPage({ params }: EditPricingPlanPageProps) {
    const plan = await getPlan(Number(params.id));

    if (!plan) {
        notFound();
    }

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Edit Pricing Plan</h1>
                <p className="text-muted-foreground mt-2">
                    Update the details for the {plan.name} plan.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Plan Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PricingAdminForm initialData={plan as any} />
                </CardContent>
            </Card>
        </div>
    );
}
