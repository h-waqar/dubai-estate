"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useProjectStepStore } from "../../stores/useProjectStepStore";
import ProjectStepHeader from "./ProjectStepHeader";

// Import steps (we'll create these next)
import StepOneBasic from "./steps/StepOneBasic";
import StepTwoDescription from "./steps/StepTwoDescription";
import StepTwoPointFiveAboutFeatures from "./steps/StepTwoPointFiveAboutFeatures";
import StepThreePricing from "./steps/StepThreePricing";
import StepFourMedia from "./steps/StepFourMedia";
import StepFiveFloorplans from "./steps/StepFiveFloorplans";
import StepSixAmenities from "./steps/StepSixAmenities";
import StepSevenAccount from "./steps/StepSevenAccount";
import StepEightReview from "./steps/StepEightReview";
import StepNineSuccess from "./steps/StepNineSuccess";

interface ProjectAdvertiseWizardProps {
    developers: { id: number; name: string; slug: string }[];
    amenities: { id: number; name: string; icon?: string }[];
    projectPlan?: any;
}

const allSteps = [
    StepOneBasic,
    StepTwoDescription,
    StepTwoPointFiveAboutFeatures,
    StepThreePricing,
    StepFourMedia,
    StepFiveFloorplans,
    StepSixAmenities,
    StepSevenAccount,
    StepEightReview,
    StepNineSuccess,
];

export default function ProjectAdvertiseWizard({
    developers,
    amenities,
    projectPlan
}: ProjectAdvertiseWizardProps) {
    const { step, goTo } = useProjectStepStore();
    const StepComponent = allSteps[step] as React.ComponentType<any>;

    const prevStep = React.useRef(step);
    const direction = step > prevStep.current ? 1 : -1;
    prevStep.current = step;

    if (!StepComponent) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            {/* Step Header */}
            <ProjectStepHeader />

            {/* Step Content with Animation */}
            <div className="overflow-hidden">
                <AnimatePresence initial={false} mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 100 * direction }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -100 * direction }}
                        transition={{ duration: 0.3 }}
                    >
                        <StepComponent developers={developers} amenities={amenities} projectPlan={projectPlan} />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Dev Navigation - Bottom Right */}
            {process.env.NODE_ENV === 'development' && (
                <div className="fixed bottom-4 right-4 bg-black/80 text-white p-3 rounded-lg shadow-xl z-50">
                    <p className="text-xs mb-2 font-mono">Dev Nav (Step {step + 1}/{allSteps.length})</p>
                    <div className="flex gap-1 flex-wrap max-w-[200px]">
                        {allSteps.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goTo(index)}
                                className={`
                                    w-8 h-8 text-xs rounded font-mono transition-colors
                                    ${step === index
                                        ? 'bg-blue-500 text-white'
                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    }
                                `}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
