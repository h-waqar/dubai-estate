"use server";

import Header from "@/components/layout/Header";
import ProjectAdvertiseWizard from "@/modules/project/components/advertise/ProjectAdvertiseWizard";
import { DeveloperService } from "@/modules/project/services/developer.service";
import { ProjectAmenityService } from "@/modules/project/services/amenity.service";
import { listPlans } from "@/modules/pricing/actions/listPlans";

export default async function AdvertiseProjectPage() {
    const developersRaw = await DeveloperService.listDevelopers();
    const amenitiesRaw = await ProjectAmenityService.listAmenities();
    const plans = await listPlans();
    
    // Find the project listing plan (assuming ONE_TIME type)
    // The plans are already serialized to numbers/strings by listPlans action
    const projectPlan = plans.find(p => p.type === "ONE_TIME" && p.isActive) || { priceOneTime: 100 }; // Fallback

    // Transform amenities to convert null to undefined for icon field
    const amenities = amenitiesRaw.map(({ id, name, icon }) => ({
        id,
        name,
        icon: icon ?? undefined,
    }));

    // Serialize developers to plain objects
    const developers = developersRaw.map(({ id, name, slug }) => ({
        id,
        name,
        slug,
    }));

    return (
        <>
            <Header />
            <ProjectAdvertiseWizard developers={developers} amenities={amenities} projectPlan={projectPlan} />
        </>
    );
}
