// src\modules\property\components\advertise\steps\StepOneCreate.tsx
"use client";

import { Input } from "@/components/ui/input";
import StepController from "./StepController";
import { useStepStore } from "../../../stores/useStepStore";
import { useAdvertiseFormStore } from "../../../stores/useAdvertiseForm";
import LocationSelector from "../LocationSelector";
import { FormLabel, FieldWrapper, InputIcon } from "../FormComponents";
import { House, PenLine, Tag } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // ✅ Use this, not @radix-ui/react-select
import { stepOneSchema } from "../../../validators/advertise-steps.validator";
import { toast } from "sonner";
interface StepOneCreateProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
  };
}
function StepOneCreate({ propertyTypes, serverData }: StepOneCreateProps) {
  const { next, prev } = useStepStore();
  const {
    title,
    propertyStatus,
    propertyTypeId,
    update,
  } = useAdvertiseFormStore();

  // Handler for all text/email/password inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    update({ [e.target.name]: e.target.value });
  };

  return (
    <div>
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
        {/* Property Status (sale/rent) */}
        <FieldWrapper>
          <FormLabel>Property Status</FormLabel>
          <div className="relative">
            <InputIcon icon={Tag} />
            <Select
              value={propertyStatus || ""}
              onValueChange={(value) => update({ propertyStatus: value })}
            >
              <SelectTrigger className="min-h-12 min-w-full pl-10 border-input bg-background hover:bg-accent/50 transition-colors">
                <SelectValue placeholder="Select listing status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sale">For Sale</SelectItem>
                <SelectItem value="rent">For Rent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FieldWrapper>

        {/* Property Type (dynamic from DB) */}
        <FieldWrapper>
          <FormLabel>Property Type</FormLabel>
          <div className="relative">
            <InputIcon icon={House} />
            <Select
              value={propertyTypeId?.toString() || ""}
              onValueChange={(value) =>
                update({ propertyTypeId: parseInt(value) })
              }
            >
              <SelectTrigger className="min-h-12 min-w-full pl-10 border-input bg-background hover:bg-accent/50 transition-colors">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                {propertyTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </FieldWrapper>

        {/* Property Title */}
        <FieldWrapper>
          <FormLabel required>Listing Title</FormLabel>
          <div className="relative">
            <InputIcon icon={PenLine} />
            <Input
              name="title"
              value={title || ""}
              onChange={handleChange}
              placeholder="e.g., luxury_developer_house"
              className="h-12 pl-10 border-input bg-background"
            />
          </div>
        </FieldWrapper>

        <LocationSelector />
      </div>
      <StepController 
        onNext={() => {
          const result = stepOneSchema.safeParse({
            title,
            propertyStatus,
            propertyTypeId,
            location: useAdvertiseFormStore.getState().location, // Access directly to ensure latest
          });

          if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            Object.values(errors).forEach((error) => {
              if (error) toast.error(error[0]);
            });
            return;
          }
          next();
        }} 
        onPrev={prev} 
        showPrev={false} 
      />
    </div>
  );
}

export default StepOneCreate;
