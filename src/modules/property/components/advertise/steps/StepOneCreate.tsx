"use client";

import { Input } from "@/components/ui/input";
import StepController from "./StepController";
import { useStepStore } from "../../../stores/useStepStore";
import LocationSelector from "../LocationSelector";

function StepOneCreate() {
  const { next, prev } = useStepStore();
  2;
  return (
    <div>
      <LocationSelector />

      <StepController onNext={next} onPrev={prev} showPrev={false} />
    </div>
  );
}

export default StepOneCreate;
