"use client";

import { Input } from "@/components/ui/input";
import StepController from "./StepController";
import { useStepStore } from "../../../stores/useStepStore";
import LocationSelector from "../LocationSelector";
import { FormLabel, FieldWrapper, InputIcon } from "../FormComponents";
import { PenLine } from "lucide-react";

function StepOneCreate() {
  const { data, updateData, next, prev } = useStepStore();

  // Handler for all text/email/password inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
        {/* Username */}
        <FieldWrapper>
          <FormLabel required>Listing Title</FormLabel>
          <div className="relative">
            <InputIcon icon={PenLine} />
            <Input
              name="username"
              value={data.title || ""}
              onChange={handleChange}
              placeholder="e.g., luxury_developer"
              className="h-12 pl-10 border-input bg-background"
            />
          </div>
        </FieldWrapper>

        <LocationSelector />
      </div>
      <StepController onNext={next} onPrev={prev} showPrev={false} />
    </div>
  );
}

export default StepOneCreate;
