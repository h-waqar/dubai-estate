// src\modules\property\components\advertise\AdvertiseWizard.tsx
"use client";

import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStepStore } from "../../stores/useStepStore";
import { useAdvertiseFormStore } from "../../stores/useAdvertiseForm";
import StepHeader from "./StepHeader";

// Import your 7 steps
import StepOneCreate from "./steps/StepOneCreate";
import StepTwoDescription from "./steps/StepTwoDescription";
import StepThreeDetails from "./steps/StepThreeDetails";
import StepFourMedia from "./steps/StepFourMedia";
import StepFiveAccount from "./steps/StepFiveAccount";
import StepSixPayment from "./steps/StepSixPayment";
import StepSevenSuccess from "./steps/StepSevenSuccess";
import DevStepSwitcher from "./DevStepSwitcher";

interface AdvertiseWizardProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
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
  StepFiveAccount,
  StepSixPayment,
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

  // Filter steps for Edit Mode: remove Account (5), Payment (6), Success (7)
  // Indices: 0, 1, 2, 3. Step 4 becomes the last one.
  const steps = isEditMode ? allSteps.slice(0, 4) : allSteps;

  const StepComponent = steps[step] as React.ComponentType<any>;
  const prevStep = useRef(step);

  const [isLoaded, setIsLoaded] = React.useState(!isEditMode);

  // Initialize store with data if in Edit Mode
  React.useEffect(() => {
    // 1. Sync the store's "steps" array structure based on mode
    const createSteps = [
      { title: "Create", description: "Property title and type" },
      { title: "Description", description: "Address and map" },
      { title: "Details", description: "Features and pricing" },
      { title: "Media", description: "Images and gallery" },
      { title: "Account", description: "Confirm & submit" },
      { title: "Payment", description: "Confirm & submit" },
      { title: "Success", description: "Confirm & submit" },
    ];

    // In edit mode, we only use the first 4 steps
    const currentSteps = isEditMode ? createSteps.slice(0, 4) : createSteps;

    // Update store to reflect the current steps (so header renders correctly)
    useStepStore.setState({ steps: currentSteps });

    // 2. Validate/Clamp step index
    // If we switched from Create (step 6) to Edit (max step 3), we need to clamp.
    if (step >= currentSteps.length) {
      goTo(0);
      return; // Return early, let the effect re-run or component re-render
    }

    // 3. Hydrate data (Edit Mode only)
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
      // Not edit mode, just mark loaded
      setIsLoaded(true);
    }
  }, [isEditMode, initialData, update, step, goTo]);

  // Determine slide direction
  const direction = step > prevStep.current ? 1 : -1;
  prevStep.current = step;

  // Safety check: if StepComponent is missing (e.g. index out of bounds before effect runs), render loading
  if (!isLoaded || !StepComponent) {
    return <div className="min-h-[400px] flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      {/* Step navigation header */}
      <StepHeader />

      {/* Slide wrapper */}
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
      {/* Dev helper */}
      <DevStepSwitcher />
    </div>
  );
}
