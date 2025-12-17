"use client";

import { useStepStore } from "../../stores/useStepStore";
import { Button } from "@/components/ui/button";

export default function DevStepSwitcher() {
    // Only show in development
    if (process.env.NODE_ENV !== "development") return null;

    const { goTo, step } = useStepStore();

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-4 rounded-lg shadow-xl border border-gray-700">
            <p className="text-xs font-bold mb-2 uppercase text-gray-400">Dev Navigation</p>
            <div className="flex flex-wrap gap-2 max-w-[300px]">
                {[0, 1, 2, 3, 4, 5, 6].map((index) => (
                    <Button
                        key={index}
                        variant={step === index ? "default" : "secondary"}
                        size="sm"
                        onClick={() => goTo(index)}
                        className="h-8 w-8 p-0"
                    >
                        {index + 1}
                    </Button>
                ))}
            </div>
            <div className="mt-2 text-xs text-gray-400">
                Current: Step {step + 1}
            </div>
        </div>
    );
}
