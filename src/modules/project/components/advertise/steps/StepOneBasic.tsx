"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useProjectAdvertiseStore } from "../../../stores/useProjectAdvertiseStore";
import { useProjectStepStore } from "../../../stores/useProjectStepStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const stepOneSchema = z.object({
    projectType: z.enum(["FUTURE", "CURRENT", "PAST"]),
    name: z.string().min(1, "Project name is required"),
    developerId: z.coerce.number().positive("Please select a developer"),
    community: z.string().optional(),
    location: z.string().min(1, "Location is required"),
    address: z.string().optional(),
    locationDescription: z.string().optional(),
    latitude: z.coerce.number().optional(),
    longitude: z.coerce.number().optional(),
});

export default function StepOneBasic({ developers }: { developers: any[] }) {
    const store = useProjectAdvertiseStore();
    const { next } = useProjectStepStore();

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(stepOneSchema),
        defaultValues: {
            projectType: store.projectType,
            name: store.name,
            developerId: store.developerId,
            community: store.community,
            location: store.location,
            address: store.address,
            locationDescription: store.locationDescription,
        },
    });

    const projectType = watch("projectType");
    const developerId = watch("developerId");

    const onSubmit = (data: any) => {
        store.update(data);
        next();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
                {/* Project Type */}
                <div>
                    <Label htmlFor="projectType">Project Type *</Label>
                    <Select
                        value={projectType}
                        onValueChange={(value) => setValue("projectType", value as any)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select project type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="FUTURE">Future Project</SelectItem>
                            <SelectItem value="CURRENT">Current Project</SelectItem>
                            <SelectItem value="PAST">Past Project</SelectItem>
                        </SelectContent>
                    </Select>
                    {errors.projectType && (
                        <p className="text-sm text-red-500 mt-1">{errors.projectType.message}</p>
                    )}
                </div>

                {/* Project Name */}
                <div>
                    <Label htmlFor="name">Project Name *</Label>
                    <Input
                        id="name"
                        {...register("name")}
                        placeholder="e.g., Minati Homes 1"
                    />
                    {errors.name && (
                        <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
                    )}
                </div>

                {/* Developer */}
                <div>
                    <Label htmlFor="developerId">Developer *</Label>
                    <Select
                        value={developerId?.toString()}
                        onValueChange={(value) => setValue("developerId", Number(value))}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select developer" />
                        </SelectTrigger>
                        <SelectContent>
                            {developers.map((dev) => (
                                <SelectItem key={dev.id} value={dev.id.toString()}>
                                    {dev.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.developerId && (
                        <p className="text-sm text-red-500 mt-1">{errors.developerId.message}</p>
                    )}
                </div>

                {/* Community */}
                <div>
                    <Label htmlFor="community">Community</Label>
                    <Input
                        id="community"
                        {...register("community")}
                        placeholder="e.g., Al Furjan"
                    />
                </div>

                {/* Location */}
                <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                        id="location"
                        {...register("location")}
                        placeholder="e.g., Al Furjan, Dubai"
                    />
                    {errors.location && (
                        <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
                    )}
                </div>

                {/* Address */}
                <div>
                    <Label htmlFor="address">Full Address</Label>
                    <Input
                        id="address"
                        {...register("address")}
                        placeholder="Optional detailed address"
                    />
                </div>

                {/* Coordinates */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                            id="latitude"
                            type="number"
                            step="any"
                            {...register("latitude")}
                            placeholder="e.g. 25.1234"
                        />
                    </div>
                    <div>
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                            id="longitude"
                            type="number"
                            step="any"
                            {...register("longitude")}
                            placeholder="e.g. 55.1234"
                        />
                    </div>
                </div>

                {/* Location Description */}
                <div>
                    <Label htmlFor="locationDescription">Location Description</Label>
                    <Input
                        id="locationDescription"
                        {...register("locationDescription")}
                        placeholder="Rich description of the area/community"
                    />
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-end">
                <Button type="submit" size="lg">
                    Next: Description
                </Button>
            </div>
        </form>
    );
}
