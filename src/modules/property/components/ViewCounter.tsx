"use client";

import { useEffect, useRef } from "react";
import { incrementPropertyViews } from "../actions/incrementPropertyViews";

interface ViewCounterProps {
    propertyId: number;
}

/**
 * A silent component that increments the view count of a property when mounted.
 * Uses a ref to ensure it only runs once per mount in development (StrictMode).
 */
export function ViewCounter({ propertyId }: ViewCounterProps) {
    const hasIncremented = useRef(false);

    useEffect(() => {
        if (!hasIncremented.current) {
            console.log(`[ViewCounter] Triggering increment for Property ${propertyId}`);
            incrementPropertyViews(propertyId)
                .then((res) => {
                    if (res.success) {
                        if (res.skipped) {
                            console.log(`[ViewCounter] Skipped (Cookie present)`);
                        } else {
                            console.log(`[ViewCounter] Successfully incremented view`);
                        }
                    } else {
                        console.error(`[ViewCounter] Server Action Failed:`, res.error);
                    }
                })
                .catch((err) => console.error(`[ViewCounter] Error:`, err));
            
            hasIncremented.current = true;
        }
    }, [propertyId]);

    return null; // This component doesn't render anything
}
