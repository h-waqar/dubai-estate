"use client";

import { useAdvertiseStore } from "../../../stores/useStepStore";

export default function StepNavigation() {
  const { steps, step, goTo } = useAdvertiseStore();

  return (
    <div className="flex justify-between items-center border-b border-border pb-3 mb-6">
      {steps.map((s, i) => (
        <button
          key={s.title}
          onClick={() => goTo(i)}
          className={`flex-1 text-center text-sm font-medium transition-colors
            ${i === step ? "text-primary" : "text-muted-foreground"}
            hover:text-primary`}
        >
          {i + 1}. {s.title}
        </button>
      ))}
    </div>
  );
}
