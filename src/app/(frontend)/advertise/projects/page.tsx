"use server";

import Header from "@/components/layout/Header";
import ProjectAdvertiseWizard from "@/modules/project/components/advertise/ProjectAdvertiseWizard";
import { DeveloperService } from "@/modules/project/services/developer.service";
import { DeveloperStatus } from "@prisma/client";
import { ProjectAmenityService } from "@/modules/project/services/amenity.service";
import { listPlans } from "@/modules/pricing/actions/listPlans";
import { checkProjectQuota } from "@/modules/project/actions/checkProjectQuota";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdvertiseProjectPage() {
    const session = await getServerSession(authOptions);
    
    if (!session) {
        redirect("/api/auth/signin?callbackUrl=/advertise/projects");
    }

    const quota = await checkProjectQuota();

    if (!quota.allowed) {
        return (
          <>
              <Header />
              <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
                  <div className="max-w-md w-full bg-card border rounded-xl p-8 shadow-sm text-center space-y-4">
                      <h1 className="text-2xl font-bold text-destructive">Access Restricted</h1>
                      <p className="text-muted-foreground text-lg">{quota.error}</p>
                      
                      {quota.max !== undefined && (
                          <div className="py-4">
                               <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                                  <div 
                                      className="bg-primary h-full transition-all" 
                                      style={{ width: `${Math.min((quota.current! / quota.max) * 100, 100)}%` }}
                                  />
                               </div>
                               <p className="text-sm text-muted-foreground mt-2">
                                  You have used {quota.current} of {quota.max} available listings.
                               </p>
                          </div>
                      )}

                      <div className="space-y-3 pt-4">
                          <Button asChild className="w-full size-lg">
                              <Link href="/pricing">View Plans</Link>
                          </Button>
                          <Button asChild variant="outline" className="w-full">
                              <Link href="/account/projects">Manage My Projects</Link>
                          </Button>
                      </div>
                  </div>
              </div>
          </>
        );
    }
    const developersRaw = await DeveloperService.listDevelopers(DeveloperStatus.APPROVED);
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
