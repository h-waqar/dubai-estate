"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { approveDeveloper, declineDeveloper } from "../actions/developer.actions";
import { toast } from "sonner";
import { Check, X } from "lucide-react";

interface DeveloperActionsProps {
    developerId: number;
}

export function DeveloperActions({ developerId }: DeveloperActionsProps) {
    const [isPending, startTransition] = useTransition();

    const handleApprove = () => {
        startTransition(async () => {
            const res = await approveDeveloper(developerId);
            if (res.success) {
                toast.success("Developer approved");
            } else {
                toast.error("Failed to approve");
            }
        });
    };

    const handleDecline = () => {
        if (!confirm("Are you sure you want to decline this developer?")) return;

        startTransition(async () => {
            const res = await declineDeveloper(developerId);
            if (res.success) {
                toast.success("Developer declined");
            } else {
                toast.error("Failed to decline");
            }
        });
    };

    return (
        <div className="flex items-center gap-2">
            <Button
                size="sm"
                onClick={handleApprove}
                disabled={isPending}
                className="bg-green-600 hover:bg-green-700 text-white gap-1"
            >
                <Check className="w-4 h-4" />
                Approve
            </Button>
            <Button
                size="sm"
                variant="destructive"
                onClick={handleDecline}
                disabled={isPending}
                className="gap-1"
            >
                <X className="w-4 h-4" />
                Decline
            </Button>
        </div>
    );
}
