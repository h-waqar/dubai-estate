"use client";

import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStepStore } from "../../stores/useStepStore";
import { useAdvertiseFormStore } from "../../stores/useAdvertiseForm";
import StepHeader from "./StepHeader";

// Import your steps
import StepOneCreate from "./steps/StepOneCreate";
import StepTwoDescription from "./steps/StepTwoDescription";
import StepThreeDetails from "./steps/StepThreeDetails";
import StepFourMedia from "./steps/StepFourMedia";
import StepFiveReview from "./steps/StepFiveReview"; 
import StepSevenSuccess from "./steps/StepSevenSuccess";
import DevStepSwitcher from "./DevStepSwitcher";

interface AdvertiseWizardProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
    plans?: any[];
  };
  isEditMode?: boolean;
  initialData?: any;
  propertyId?: number;
}

const allSteps = [
  StepOneCreate,
  StepTwoDescription,
  StepThreeDetails,
  StepFourMedia,
  StepFiveReview, 
  StepSevenSuccess,
];

export default function AdvertiseWizard({
  propertyTypes,
  serverData,
  isEditMode = false,
  initialData,
  propertyId,
}: AdvertiseWizardProps) {
  const { step, goTo } = useStepStore();
  const { update } = useAdvertiseFormStore();

  const steps = isEditMode ? allSteps.slice(0, 4) : allSteps;

  const StepComponent = steps[step] as React.ComponentType<any>;
  const prevStep = useRef(step);

  const [isLoaded, setIsLoaded] = React.useState(!isEditMode);

  React.useEffect(() => {
    // 1. Sync the store's "steps" array structure based on mode
    const createSteps = [
      { title: "Create", description: "Property title and type" },
      { title: "Description", description: "Address and map" },
      { title: "Details", description: "Features and pricing" },
      { title: "Media", description: "Images and gallery" },
      { title: "Review", description: "Confirm & submit" },
      { title: "Success", description: "All done!" },
    ];

    const currentSteps = isEditMode ? createSteps.slice(0, 4) : createSteps;
    useStepStore.setState({ steps: currentSteps });

    if (step >= currentSteps.length) {
      goTo(0);
      return; 
    }

    if (isEditMode && initialData) {
      update({
        listingType: initialData.listingType,
        propertyTypeId: initialData.propertyTypeId,
        title: initialData.title,
        location: initialData.location,
        address: initialData.address || "",
        latitude: initialData.latitude,
        longitude: initialData.longitude,
        description: initialData.description || "",
        price: Number(initialData.price),
        currency: initialData.currency || "AED",
        bedrooms: initialData.bedrooms,
        bathrooms: initialData.bathrooms,
        propertySize: initialData.builtUpArea ? Number(initialData.builtUpArea) : undefined,
        furnishing: initialData.furnishing,
        developerId: initialData.developerId,
        proposedDeveloperName: initialData.proposedDeveloperName,
        features: initialData.features?.map((f: any) => f.feature?.name).filter(Boolean) || [],
        keywords: [],
        coverImage: initialData.mediaUsages?.find((m: any) => m.role === "COVER")?.media || null,
        gallery: initialData.mediaUsages?.filter((m: any) => m.role === "GALLERY").map((m: any) => m.media) || [],
      });
      setIsLoaded(true);
    } else {
      setIsLoaded(true);
    }
  }, [isEditMode, initialData, update, step, goTo]);

  const direction = step > prevStep.current ? 1 : -1;
  prevStep.current = step;

  if (!isLoaded || !StepComponent) {
    return <div className="min-h-[400px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <StepHeader />
      <div className="overflow-hidden">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 100 * direction }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 * direction }}
            transition={{ duration: 0.3 }}
          >
            <StepComponent
              propertyTypes={propertyTypes}
              serverData={serverData}
              isEditMode={isEditMode}
              propertyId={propertyId}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <DevStepSwitcher />
    </div>
  );
}