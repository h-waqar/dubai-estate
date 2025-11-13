// src\modules\property\components\advertise\AdvertiseWizard.tsx
"use client";

import React, { useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useStepStore } from "../../stores/useStepStore";
import StepHeader from "./StepHeader";

// Import your 7 steps
import StepOneCreate from "./steps/StepOneCreate";
import StepTwoDescription from "./steps/StepTwoDescription";
import StepThreeDetails from "./steps/StepThreeDetails";
import StepFourMedia from "./steps/StepFourMedia";
import StepFiveAccount from "./steps/StepFiveAccount";
import StepSixPayment from "./steps/StepSixPayment";
import StepSevenSuccess from "./steps/StepSevenSuccess";

interface AdvertiseWizardProps {
  propertyTypes: { id: number; name: string; slug: string }[];
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
}: AdvertiseWizardProps) {
  const { step } = useStepStore();
  const StepComponent = steps[step];
  const prevStep = useRef(step);

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
            <StepComponent propertyTypes={propertyTypes} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
