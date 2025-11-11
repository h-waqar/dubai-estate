"use client";

import { Input } from "@/components/ui/input";
import StepController from "./StepController";
import { useAdvertiseStore } from "../../../stores/useAdvertiseStore";
import LocationSelector from "../LocationSelector";
import Header from "@/components/layout/Header";

function StepOneCreate() {
  const { data, updateData, next, prev } = useAdvertiseStore();
  2;
  return (
    <div className="space-y-6">
      <div>
        {/* <label className="block text-sm mb-1">Property Title</label>
        <Input
          value={data.title || ""}
          onChange={(e) => updateData({ title: e.target.value })}
          placeholder="Luxury Apartment in Downtown"
        /> */}
        <LocationSelector />
      </div>

      <StepController onNext={next} onPrev={prev} showPrev={false} />
    </div>
  );
}

export default StepOneCreate;
