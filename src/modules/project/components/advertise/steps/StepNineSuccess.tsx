"use client";

import React from "react";
import { useProjectAdvertiseStore } from "../../../stores/useProjectAdvertiseStore";
import { useProjectStepStore } from "../../../stores/useProjectStepStore";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export default function StepNineSuccess() {
    const store = useProjectAdvertiseStore();
    const stepStore = useProjectStepStore();
    const router = useRouter();

    const handleViewProjects = () => {
        // Reset stores
        store.reset();
        stepStore.reset();
        router.push("/projects");
    };

    const handleAddAnother = () => {
        // Reset stores
        store.reset();
        stepStore.reset();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm text-center">
                <div className="flex justify-center mb-6">
                    <CheckCircle className="w-20 h-20 text-green-500" />
                </div>

                <h2 className="text-3xl font-bold mb-4">Project Submitted Successfully!</h2>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    Your project has been submitted for review. Our team will review it shortly
                    and notify you once it's approved and published.
                </p>

                <div className="space-y-3">
                    <Button onClick={handleViewProjects} className="w-full">
                        View All Projects
                    </Button>
                    <Button onClick={handleAddAnother} variant="outline" className="w-full">
                        Submit Another Project
                    </Button>
                </div>
            </div>
        </div>
    );
}
