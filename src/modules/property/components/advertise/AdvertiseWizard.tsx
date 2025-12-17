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

const steps = [
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
  const { step, goTo } = useStepStore(); // Changed setStep to goTo
  const { update } = useAdvertiseFormStore();
  const StepComponent = steps[step] as React.ComponentType<any>; // Cast to any to accept extra props
  const prevStep = useRef(step);

  // Initialize store with data if in Edit Mode
  React.useEffect(() => {
    if (isEditMode && initialData) {
      // Map server data to store state
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
        bedrooms: initialData.bedrooms,
        bathrooms: initialData.bathrooms,
        furnishing: initialData.furnishing,
        // Map features: serverData features are { id, name }, property has { propertyId, featureId }
        // We need feature NAMES for the store string[]
        features: initialData.features?.map((f: any) => f.feature.name) || [],
        // Map media
        // Cover Image (search for role="COVER" in mediaUsages)
        coverImage: initialData.mediaUsages?.find((m: any) => m.role === "COVER")?.media || null,
        // Gallery (role="GALLERY")
        gallery: initialData.mediaUsages?.filter((m: any) => m.role === "GALLERY").map((m: any) => m.media) || [],
      });
      // Ensure we start at step 0 if not already
      // setStep(0); 
    }
  }, [isEditMode, initialData, update]);

  // Determine slide direction
  const direction = step > prevStep.current ? 1 : -1;
  prevStep.current = step;

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
