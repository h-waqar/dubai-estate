"use client";

import MediaLibraryView from "@/modules/media/components/MediaLibraryView";
import { useMedia } from "@/modules/media/hooks/useMedia";
import { useEffect } from "react";

export default function AdminMediaPage() {
    const { fetchMedia } = useMedia();

    useEffect(() => {
        // Pass "GLOBAL" scope to see ALL media
        fetchMedia("GLOBAL");
    }, [fetchMedia]);

    return (
        <div className="h-[calc(100vh-8rem)]">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
                <p className="text-muted-foreground">
                    Manage all media files across the platform.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border h-full overflow-hidden">
                <MediaLibraryView
                    selectedItems={[]}
                    onMediaSelect={() => { }}
                    mode="manage"
                    allowDelete={true}
                    selectionMode="single"
                />
            </div>
        </div>
    );
}
