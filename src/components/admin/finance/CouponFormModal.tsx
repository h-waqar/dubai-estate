"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCouponSchema } from "@/validators/coupon";
import { createCouponAction, updateCouponAction } from "@/actions/coupon";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"; 
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { z } from "zod";

interface CouponFormModalProps {
    coupon?: any;
    plans: any[];
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function CouponFormModal({ coupon, plans, open, onOpenChange }: CouponFormModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    
    // Controlled by props or internal state
    const show = open !== undefined ? open : isOpen;
    const setShow = onOpenChange || setIsOpen;

    const form = useForm<z.infer<typeof createCouponSchema>>({
        resolver: zodResolver(createCouponSchema),
        defaultValues: {
            code: "",
            type: "PERCENTAGE",
            value: 0,
            maxUsage: null,
            perUserLimit: 1,
            validFrom: null,
            validTo: null,
            isActive: true,
            appliesToAllPlans: true,
            planIds: [],
        }
    });

    useEffect(() => {
        if (coupon) {
            form.reset({
                ...coupon,
                value: Number(coupon.value),
                validFrom: coupon.validFrom ? new Date(coupon.validFrom) : null,
                validTo: coupon.validTo ? new Date(coupon.validTo) : null,
                planIds: coupon.planIds || [],
            });
        } else {
             if (!open) {
                 // Reset when closed if not editing
                 form.reset({
                    code: "",
                    type: "PERCENTAGE",
                    value: 0,
                    maxUsage: null,
                    perUserLimit: 1,
                    validFrom: null,
                    validTo: null,
                    isActive: true,
                    appliesToAllPlans: true,
                    planIds: [],
                });
             }
        }
    }, [coupon, form, open, show]);

    const onSubmit = async (values: z.infer<typeof createCouponSchema>) => {
        const formData = new FormData();
        Object.entries(values).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
                if (key === 'planIds' && Array.isArray(value)) {
                    value.forEach(id => formData.append('planIds', String(id)));
                } else if (value instanceof Date) {
                    formData.append(key, value.toISOString());
                } else {
                    formData.append(key, String(value));
                }
            }
        });

        let res;
        if (coupon) {
            res = await updateCouponAction(coupon.id, formData);
        } else {
            res = await createCouponAction(formData);
        }

        if (res.success) {
            toast.success(coupon ? "Coupon updated" : "Coupon created");
            setShow(false);
            if (!coupon) form.reset();
        } else {
             if (typeof res.error === 'object') {
                 Object.entries(res.error).forEach(([key, val]) => {
                     // @ts-ignore
                     form.setError(key, { message: String(val) });
                 });
             } else {
                 toast.error(res.error || "Operation failed");
             }
        }
    };

    return (
        <Dialog open={show} onOpenChange={setShow}>
            {!coupon && (
                <DialogTrigger asChild>
                    <Button><Plus className="mr-2 h-4 w-4" /> Create Coupon</Button>
                </DialogTrigger>
            )}
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{coupon ? "Edit Coupon" : "Create Coupon"}</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                                                <SelectItem value="FIXED">Fixed Amount</SelectItem>
                                                <SelectItem value="TRIAL">Trial</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Value</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                {...field} 
                                                onChange={e => field.onChange(Number(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="maxUsage"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Global Max Usage (Optional)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                {...field} 
                                                value={field.value || ''}
                                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            
                            <FormField
                                control={form.control}
                                name="perUserLimit"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Per User Limit (Optional)</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="number" 
                                                {...field} 
                                                value={field.value || ''}
                                                onChange={e => field.onChange(e.target.value ? Number(e.target.value) : null)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="validFrom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valid From</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="date" 
                                                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                                onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="validTo"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Valid Until</FormLabel>
                                        <FormControl>
                                            <Input 
                                                type="date" 
                                                value={field.value ? field.value.toISOString().split('T')[0] : ''}
                                                onChange={e => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                                            />
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
                                        <FormLabel className="text-base">Active</FormLabel>
                                        <FormDescription>
                                            Enable or disable this coupon
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

                        <FormField
                            control={form.control}
                            name="appliesToAllPlans"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base">Applies to All Plans</FormLabel>
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

                        {!form.watch("appliesToAllPlans") && (
                            <div className="border p-4 rounded-lg space-y-2">
                                <FormLabel>Select Plans</FormLabel>
                                <div className="grid grid-cols-2 gap-2">
                                    {plans.map(plan => (
                                        <FormField
                                            key={plan.id}
                                            control={form.control}
                                            name="planIds"
                                            render={({ field }) => {
                                                return (
                                                    <FormItem
                                                        key={plan.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(plan.id)}
                                                                onCheckedChange={(checked) => {
                                                                    const current = field.value || [];
                                                                    if (checked) {
                                                                        field.onChange([...current, plan.id]);
                                                                    } else {
                                                                        field.onChange(current.filter((val) => val !== plan.id));
                                                                    }
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">
                                                            {plan.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {coupon ? "Update" : "Create"}
                        </Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
