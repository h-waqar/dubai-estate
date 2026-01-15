import { listPlans } from "@/modules/pricing/actions/listPlans";
import PricingAdminList from "@/modules/pricing/components/PricingAdminList";

export default async function PricingAdminPage() {
    const plans = await listPlans();

    return (
        <PricingAdminList initialPlans={plans} />
    );
}