"use client";

import React from "react";
import { useProjectStepStore } from "../../stores/useProjectStepStore";

export default function ProjectStepHeader() {
    const { steps, step, goTo } = useProjectStepStore();

    return (
        <div className="mb-8">
            {/* Breadcrumb / Progress indicators */}
            <div className="flex items-center justify-between mb-6">
                {steps.map((s, idx) => {
                    const isActive = idx === step;
                    const isCompleted = idx < step;
                    const isClickable = idx <= step;

                    return (
                        <React.Fragment key={idx}>
                            {/* Step Circle */}
                            <button
                                onClick={() => isClickable && goTo(idx)}
                                disabled={!isClickable}
                                className={`flex flex-col items-center relative ${isClickable ? "cursor-pointer" : "cursor-not-allowed"
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${isActive
                                            ? "bg-blue-600 text-white shadow-lg scale-110"
                                            : isCompleted
                                                ? "bg-green-600 text-white"
                                                : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                                        }`}
                                >
                                    {isCompleted ? "✓" : idx + 1}
                                </div>
                                <div className="text-xs mt-2 text-center">
                                    <div className={`font-medium ${isActive ? "text-blue-600" : "text-gray-600 dark:text-gray-400"}`}>
                                        {s.title}
                                    </div>
                                </div>
                            </button>

                            {/* Connector Line */}
                            {idx < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-2 ${isCompleted ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"
                                        }`}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>

            {/* Current Step Info */}
            <div className="text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                    {steps[step]?.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                    {steps[step]?.description}
                </p>
            </div>
        </div>
    );
}
