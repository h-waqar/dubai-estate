"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPricingSchema, CreatePricingInput } from "../validators/createPricing.validator";
import { createPlan } from "../actions/createPlan";
import { updatePlan as updatePlanAction } from "../actions/updatePlan";
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
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PricingPlan } from "../types/pricing.types";

interface PricingAdminFormProps {
  initialData?: PricingPlan;
}

export function PricingAdminForm({ initialData }: PricingAdminFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<CreatePricingInput>({
    resolver: zodResolver(createPricingSchema) as any,
    defaultValues: initialData ? {
      name: initialData.name,
      slug: initialData.slug,
      description: initialData.description || "",
      maxListings: initialData.maxListings,
      priceMonthly: Number(initialData.priceMonthly),
      priceYearly: Number(initialData.priceYearly),
      isActive: initialData.isActive,
    } : {
      name: "",
      slug: "",
      description: "",
      maxListings: 3,
      priceMonthly: 0,
      priceYearly: 0,
      isActive: true,
    },
  });

  async function onSubmit(values: CreatePricingInput) {
    setLoading(true);
    try {
      if (initialData) {
        await updatePlanAction(initialData.id, values);
      } else {
        await createPlan(values);
      }
      router.push("/admin/pricing");
      router.refresh();
    } catch (error) {
      console.error("Error saving plan:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plan Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Premium" {...field} onChange={(e) => {
                      field.onChange(e);
                      if (!initialData) {
                          form.setValue("slug", e.target.value.toLowerCase().replace(/ /g, "-"));
                      }
                  }} />
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
                  <Input placeholder="e.g. premium" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="What's included in this plan?" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="priceMonthly"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Price (AED)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxListings"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Max Listings</FormLabel>
                <FormControl>
                  <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
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
                  Whether this plan is currently available for purchase.
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

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : initialData ? "Update Plan" : "Create Plan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
