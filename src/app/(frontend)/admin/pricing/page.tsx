import { listPlans } from "@/modules/pricing/actions/listPlans";
import PricingAdminList from "@/modules/pricing/components/PricingAdminList";
import AddonPackAdminList from "@/modules/pricing/components/AddonPackAdminList";
import { listAddonPacksAction } from "@/modules/pricing/actions/addonPacks";

export default async function PricingAdminPage() {
    const plans = await listPlans();
    const packsRes = await listAddonPacksAction();
    const packs = packsRes.success ? packsRes.packs : [];

    return (
        <div className="space-y-10">
            <PricingAdminList initialPlans={plans} />
            <AddonPackAdminList initialPacks={packs} />
        </div>
    );
}