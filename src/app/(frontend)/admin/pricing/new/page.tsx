import { PricingAdminForm } from "@/modules/pricing/components/PricingAdminForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewPricingPlanPage() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Pricing Plan</h1>
                <p className="text-muted-foreground mt-2">
                    Define a new subscription tier for your agents.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Plan Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <PricingAdminForm />
                </CardContent>
            </Card>
        </div>
    );
}
