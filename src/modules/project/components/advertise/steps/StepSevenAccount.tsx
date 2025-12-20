"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { useProjectStepStore } from "../../../stores/useProjectStepStore";
import { Button } from "@/components/ui/button";
import { CheckCircle2, UserCheck } from "lucide-react";

export default function StepSevenAccount() {
    const { data: session } = useSession();
    const { next, prev } = useProjectStepStore();

    // If user is already logged in, show confirmation
    if (session?.user) {
        return (
            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-full">
                            <UserCheck className="w-12 h-12 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">You're all set!</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Logged in as: <span className="font-medium text-foreground">{session.user.email}</span>
                    </p>
                    <div className="flex items-center justify-center gap-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Account verified</span>
                    </div>
                </div>

                <div className="flex justify-between">
                    <Button onClick={prev} variant="outline">
                        Back
                    </Button>
                    <Button onClick={next} size="lg">
                        Continue to Review
                    </Button>
                </div>
            </div>
        );
    }

    // Not logged in - show authentication options
    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                <h3 className="text-xl font-semibold mb-4">Authentication Required</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    Please log in or create an account to submit your project.
                </p>
                <div className="space-y-3">
                    <Button asChild className="w-full">
                        <a href="/login">Sign In</a>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <a href="/register">Create Account</a>
                    </Button>
                </div>
            </div>

            <div className="flex justify-between">
                <Button onClick={prev} variant="outline">
                    Back
                </Button>
            </div>
        </div>
    );
}
