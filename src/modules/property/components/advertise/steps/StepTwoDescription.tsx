import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useStepStore } from "../../../stores/useStepStore";
import { useAdvertiseFormStore } from "../../../stores/useAdvertiseForm";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import StepController from "./StepController";
import { ClipboardPenLine } from "lucide-react";
import { stepTwoSchema } from "../../../validators/advertise-steps.validator";
import { z } from "zod";

interface StepTwoDescriptionProps {
  propertyTypes: { id: number; name: string; slug: string }[];
  serverData: {
    features?: { id: number; name: string; slug: string }[];
  };
}

type StepTwoData = z.infer<typeof stepTwoSchema>;

export default function StepDescription({ serverData }: StepTwoDescriptionProps) {
  const { next, prev } = useStepStore();
  const { description, keywords, features, update } = useAdvertiseFormStore();
  const [tempKeyword, setTempKeyword] = useState("");

  const featureList = serverData.features || [];

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StepTwoData>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: {
      description: description || "",
      features: features || [],
    },
  });

  // Sync form -> store
  useEffect(() => {
    const subscription = watch((value) => {
      update({
        description: value.description,
        features: value.features as string[],
      });
    });
    return () => subscription.unsubscribe();
  }, [watch, update]);

  const handleAddKeyword = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tempKeyword.trim()) {
      e.preventDefault();
      const newKeyword = tempKeyword.trim();
      if (!keywords.includes(newKeyword)) {
        update({ keywords: [...keywords, newKeyword] });
      }
      setTempKeyword("");
    }
  };

  const handleRemoveKeyword = (kw: string) => {
    update({ keywords: keywords.filter((k) => k !== kw) });
  };

  const onSubmit = () => {
    next();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="max-w-4xl mx-auto bg-card rounded-xl shadow-sm p-6 space-y-6 border border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <ClipboardPenLine className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Property Description
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Step 2 of 7 · Provide essential property information
            </p>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Property Description
          </label>
          <Textarea
            {...register("description")}
            rows={6}
            placeholder="Describe your property in detail..."
            className="resize-none"
          />
          {errors.description && (
            <p className="text-sm text-destructive mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Keywords (Managed by Store directly as it's not in schema validation) */}
        <div>
          <label className="block text-sm font-medium mb-2">Keywords</label>
          <div className="flex flex-wrap gap-2 border rounded-md p-2 min-h-12">
            {keywords.map((kw) => (
              <Badge
                key={kw}
                variant="secondary"
                className="flex items-center gap-2"
              >
                {kw}
                <button
                  type="button"
                  onClick={() => handleRemoveKeyword(kw)}
                  className="text-red-400 hover:text-red-600 scale-200 cursor-pointer -mt-1"
                >
                  ×
                </button>
              </Badge>
            ))}
            <Input
              value={tempKeyword}
              onChange={(e) => setTempKeyword(e.target.value)}
              onKeyDown={handleAddKeyword}
              placeholder="Type and press Enter"
              className="border-0 shadow-none focus-visible:ring-0 w-auto flex-1 min-w-[150px]"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <h3 className="font-medium mb-2">Select Features</h3>
          <div className="flex flex-wrap gap-3 select-none">
            <Controller
              name="features"
              control={control}
              render={({ field }) => (
                <>
                  {featureList.map((feature) => (
                    <label
                      key={feature.id}
                      className={cn(
                        "flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer transition",
                        field.value?.includes(feature.name)
                          ? "bg-primary/10 border-primary text-primary"
                          : "hover:bg-muted border-border"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={field.value?.includes(feature.name)}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          const currentFeatures = field.value || [];
                          if (checked) {
                            field.onChange([...currentFeatures, feature.name]);
                          } else {
                            field.onChange(
                              currentFeatures.filter((f) => f !== feature.name)
                            );
                          }
                        }}
                        className="accent-primary"
                      />
                      <span className="text-sm">{feature.name}</span>
                    </label>
                  ))}
                </>
              )}
            />
          </div>
          {errors.features && (
            <p className="text-sm text-destructive mt-1">
              {errors.features.message}
            </p>
          )}
        </div>
      </div>
      <StepController 
        onNext={handleSubmit(onSubmit)}
        onPrev={prev} 
        showPrev={true} 
      />
    </form>
  );
}
