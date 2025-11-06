// =============================================================================
// FILE: src/modules/media/components/MediaErrorState.tsx
// =============================================================================
"use client";

import { AlertCircle } from "lucide-react";

interface MediaErrorStateProps {
  error: string;
}

export default function MediaErrorState({ error }: MediaErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-red-500">
      <AlertCircle className="w-12 h-12 mb-3" />
      <p className="text-lg font-medium">{error}</p>
    </div>
  );
}
