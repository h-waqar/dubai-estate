import React from "react";
import { Button } from "@/components/ui/button";

const reactions = [
  { label: "Helpful", value: "helpful" },
  { label: "Loved it", value: "loved" },
  { label: "Confusing", value: "confusing" },
];

export const FeedbackButtons: React.FC = () => (
  <div className="flex gap-2 mt-8">
    {reactions.map((r) => (
      <Button key={r.value} variant="secondary">
        {r.label}
      </Button>
    ))}
  </div>
);
