"use server";
import Header from "@/components/layout/Header";
import AdvertiseWizard from "@/modules/property/components/advertise/AdvertiseWizard";
import { getPropertyTypes } from "@/modules/property/services/listPropertyTypes";
import { FeatureService } from "@/modules/property/services/feature";
import { listPlans } from "@/modules/pricing/actions/listPlans";

async function AdvertisePage() {
  const propertyTypes = await getPropertyTypes();
  const features = await FeatureService.list();
  const plans = await listPlans();
  
  const data = {
    // propertyTypes,
    features,
    plans,
  };

  return (
    <>
      <Header />
      <AdvertiseWizard propertyTypes={propertyTypes} serverData={data} />
    </>
  );
}

export default AdvertisePage;
