"use client";

import { useEffect } from "react";
import { incrementProjectViews } from "../actions/incrementProjectViews";

interface ProjectViewCounterProps {
    projectId: number;
}

export function ProjectViewCounter({ projectId }: ProjectViewCounterProps) {
    useEffect(() => {
        // Increment view count when component mounts
        incrementProjectViews(projectId);
    }, [projectId]);

    return null; // Silent component
}
