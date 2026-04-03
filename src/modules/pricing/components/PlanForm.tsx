"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPricingSchema, CreatePricingInput } from "../validators/createPricing.validator";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPlanAction, updatePlanAction } from "../actions/managePlan";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface PlanFormProps {
  initialData?: CreatePricingInput & { id?: number };
  definitions?: any[];
  isEditing?: boolean;
}

export function PlanForm({ initialData, definitions = [], isEditing = false }: PlanFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const form = useForm<CreatePricingInput>({
    resolver: zodResolver(createPricingSchema) as any,
    defaultValues: initialData || {
      name: "",
      slug: "",
      description: "",
      type: "SUBSCRIPTION",
      priceMonthly: 0,
      priceYearly: 0,
      priceOneTime: 0,
      isActive: true,
      paypalPlanId: "",
      paypalProductId: "",
      entitlements: definitions.map(d => ({ definitionId: d.id, amount: 0 })) as any
    },
  });

  const planType = form.watch("type");

  async function onSubmit(data: CreatePricingInput) {
    setIsSubmitting(true);
    try {
      let result;
      if (isEditing && initialData?.id) {
        result = await updatePlanAction(initialData.id, data);
      } else {
        result = await createPlanAction(data);
      }

      if (result && !result.success) {
        toast.error(result.error || "Something went wrong");
        setIsSubmitting(false);
        return;
      }

      toast.success(isEditing ? "Plan updated successfully" : "Plan created successfully");
      setIsSubmitting(false); // Ensure spinner stops
      router.push("/admin/pricing");
      router.refresh(); 
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Name</FormLabel>
              <FormControl>
                <Input placeholder="Gold Package" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="slug"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="gold-package" {...field} />
              </FormControl>
              <FormDescription>Used in URLs and API calls.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Plan Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SUBSCRIPTION">Subscription (Monthly/Yearly)</SelectItem>
                  <SelectItem value="ONE_TIME">One-Time Payment</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Details about this plan..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {planType === "SUBSCRIPTION" && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priceMonthly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monthly Price (AED)</FormLabel>
                  <FormControl>
                    <Input 
                        type="number" 
                        {...field} 
                        value={field.value ?? ""}
                        onChange={e => {
                          const val = parseFloat(e.target.value);
                          field.onChange(isNaN(val) ? 0 : val);
                        }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priceYearly"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Yearly Price (AED)</FormLabel>
                  <FormControl>
                    <Input 
                        type="number" 
                        {...field} 
                        value={field.value ?? ""}
                        onChange={e => {
                          const val = parseFloat(e.target.value);
                          field.onChange(isNaN(val) ? 0 : val);
                        }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {planType === "ONE_TIME" && (
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="priceOneTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>One-Time Fee (AED)</FormLabel>
                  <FormControl>
                    <Input 
                        type="number" 
                        {...field} 
                        value={field.value ?? ""}
                        onChange={e => {
                          const val = parseFloat(e.target.value);
                          field.onChange(isNaN(val) ? 0 : val);
                        }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        {definitions.length > 0 && (
          <div className="grid grid-cols-2 gap-4 border-t pt-8">
            <div className="col-span-2">
              <h3 className="text-lg font-medium">Entitlements</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Configure the limits for this plan.
              </p>
            </div>
            {definitions.map((def) => {
              const fieldIndex = form.watch("entitlements")?.findIndex(e => e.definitionId === def.id) ?? -1;
              if (fieldIndex === -1) return null;

              return (
                <FormField
                  key={def.id}
                  control={form.control}
                  name={`entitlements.${fieldIndex}.amount`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{def.description || def.code}</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={e => {
                            const val = parseInt(e.target.value);
                            field.onChange(isNaN(val) ? 0 : val);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              );
            })}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/20">
            <div className="col-span-2 text-sm font-semibold">PayPal Integration (Optional)</div>
            <FormField
                control={form.control}
                name="paypalProductId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>PayPal Product ID</FormLabel>
                        <FormControl>
                            <Input placeholder="PROD-..." {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="paypalPlanId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>PayPal Plan ID</FormLabel>
                        <FormControl>
                            <Input placeholder="P-..." {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active Status</FormLabel>
                <FormDescription>
                  Disabling this plan will hide it from the frontend.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex gap-4">
            <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Update Plan" : "Create Plan"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
            </Button>
        </div>
      </form>
    </Form>
  );
}
