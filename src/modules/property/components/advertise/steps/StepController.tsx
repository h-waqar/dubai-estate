"use client";

import { Button } from "@/components/ui/button";
import { useStepStore } from "../../../stores/useStepStore";

export default function StepController({
  onNext,
  onPrev,
  disableNext,
  showPrev = true,
  nextLabel,
  isSubmitting,
}: {
  onNext?: () => void;
  onPrev?: () => void;
  disableNext?: boolean;
  showPrev?: boolean;
  nextLabel?: string;
  isSubmitting?: boolean;
}) {
  const { next, prev, step, steps } = useStepStore();
  const isLast = step === steps.length - 1;

  return (
    <div className="flex justify-end gap-4 mt-6">
      {showPrev ? (
        <Button type="button" variant="outline" onClick={onPrev || prev}>
          Back
        </Button>
      ) : (
        <div />
      )}
      <Button onClick={onNext || next} disabled={disableNext || isSubmitting} variant="default">
        {isSubmitting ? "Loading..." : (nextLabel || (isLast ? "Finish" : "Next"))}
      </Button>
    </div>
  );
}
