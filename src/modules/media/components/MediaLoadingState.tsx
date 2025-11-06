// =============================================================================
// FILE: src/modules/media/components/MediaLoadingState.tsx
// =============================================================================
"use client";

import { Loader2 } from "lucide-react";

export default function MediaLoadingState() {
  return (
    <div className="flex items-center justify-center h-full">
      <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
    </div>
  );
}
