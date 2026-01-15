"use server";
import Header from "@/components/layout/Header";
import AdvertiseWizard from "@/modules/property/components/advertise/AdvertiseWizard";
import { getPropertyTypes } from "@/modules/property/services/listPropertyTypes";
import { FeatureService } from "@/modules/property/services/feature";
import { checkQuota } from "@/modules/property/actions/checkQuota";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function AdvertisePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
      redirect("/api/auth/signin?callbackUrl=/advertise");
  }

  const quota = await checkQuota();

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
                            <Link href="/account">Manage My Listings</Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
      );
  }

  const propertyTypes = await getPropertyTypes();
  const features = await FeatureService.list();
  
  const data = {
    features,
  };

  return (
    <>
      <Header />
      <AdvertiseWizard propertyTypes={propertyTypes} serverData={data} />
    </>
  );
}

export default AdvertisePage;