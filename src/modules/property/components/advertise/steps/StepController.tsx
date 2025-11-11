"use client";

import { Button } from "@/components/ui/button";
import { useAdvertiseStore } from "../../../stores/useAdvertiseStore";

export default function StepController({
  onNext,
  onPrev,
  disableNext,
  showPrev = true,
}: {
  onNext?: () => void;
  onPrev?: () => void;
  disableNext?: boolean;
  showPrev?: boolean;
}) {
  const { next, prev, step, steps } = useAdvertiseStore();
  const isLast = step === steps.length - 1;

  return (
    <div className="flex justify-between mt-6">
      {showPrev ? (
        <Button variant="outline" onClick={onPrev || prev}>
          Back
        </Button>
      ) : (
        <div />
      )}
      <Button onClick={onNext || next} disabled={disableNext} variant="default">
        {isLast ? "Finish" : "Next"}
      </Button>
    </div>
  );
}
