"use client";

import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { toast } from "sonner";

interface FeaturedToggleProps {
    id: number;
    initialIsFeatured: boolean;
    onToggle: (id: number, isFeatured: boolean) => Promise<{ success: boolean; error?: string }>;
}

export function FeaturedToggle({ id, initialIsFeatured, onToggle }: FeaturedToggleProps) {
    const [isFeatured, setIsFeatured] = useState(initialIsFeatured);
    const [loading, setLoading] = useState(false);

    const handleToggle = async (checked: boolean) => {
        setIsFeatured(checked); // Optimistic update
        setLoading(true);

        try {
            const result = await onToggle(id, checked);
            if (!result.success) {
                setIsFeatured(!checked); // Revert
                toast.error(result.error || "Failed to update");
            } else {
                toast.success("Updated successfully");
            }
        } catch (error) {
            setIsFeatured(!checked); // Revert
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Switch
            checked={isFeatured}
            onCheckedChange={handleToggle}
            disabled={loading}
        />
    );
}
