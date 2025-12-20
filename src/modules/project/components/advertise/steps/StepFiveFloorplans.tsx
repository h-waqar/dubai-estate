"use client";

import React from "react";
import { useProjectAdvertiseStore } from "../../../stores/useProjectAdvertiseStore";
import { useProjectStepStore } from "../../../stores/useProjectStepStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, X } from "lucide-react";

export default function StepFiveFloorplans() {
    const store = useProjectAdvertiseStore();
    const { next, prev } = useProjectStepStore();

    const [floorplan, setFloorplan] = React.useState({
        unitType: "ONE_BEDROOM",
        unitName: "",
        bedrooms: "",
        bathrooms: "",
        size: "",
    });

    const addFloorplan = () => {
        if (floorplan.unitType && floorplan.unitName) {
            store.addFloorplan({
                unitType: floorplan.unitType,
                unitName: floorplan.unitName,
                bedrooms: floorplan.bedrooms ? Number(floorplan.bedrooms) : undefined,
                bathrooms: floorplan.bathrooms ? Number(floorplan.bathrooms) : undefined,
                size: floorplan.size ? Number(floorplan.size) : undefined,
                sizeUnit: "sqft",
            });
            setFloorplan({
                unitType: "ONE_BEDROOM",
                unitName: "",
                bedrooms: "",
                bathrooms: "",
                size: "",
            });
        }
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label>Unit Type</Label>
                        <Select
                            value={floorplan.unitType}
                            onValueChange={(value) =>
                                setFloorplan({ ...floorplan, unitType: value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="STUDIO">Studio</SelectItem>
                                <SelectItem value="ONE_BEDROOM">1 Bedroom</SelectItem>
                                <SelectItem value="ONE_BEDROOM_STUDY">1 Bedroom + Study</SelectItem>
                                <SelectItem value="TWO_BEDROOM">2 Bedroom</SelectItem>
                                <SelectItem value="TWO_BEDROOM_STUDY">2 Bedroom + Study</SelectItem>
                                <SelectItem value="THREE_BEDROOM">3 Bedroom</SelectItem>
                                <SelectItem value="THREE_BEDROOM_MAID">3 Bedroom + Maid</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label>Unit Name</Label>
                        <Input
                            placeholder="1 Bedroom Apartment"
                            value={floorplan.unitName}
                            onChange={(e) =>
                                setFloorplan({ ...floorplan, unitName: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <Label>Bedrooms</Label>
                        <Input
                            type="number"
                            placeholder="1"
                            value={floorplan.bedrooms}
                            onChange={(e) =>
                                setFloorplan({ ...floorplan, bedrooms: e.target.value })
                            }
                        />
                    </div>
                    <div>
                        <Label>Bathrooms</Label>
                        <Input
                            type="number"
                            placeholder="1"
                            value={floorplan.bathrooms}
                            onChange={(e) =>
                                setFloorplan({ ...floorplan, bathrooms: e.target.value })
                            }
                        />
                    </div>
                    <div className="col-span-2">
                        <Label>Size (sqft)</Label>
                        <Input
                            type="number"
                            placeholder="777"
                            value={floorplan.size}
                            onChange={(e) =>
                                setFloorplan({ ...floorplan, size: e.target.value })
                            }
                        />
                    </div>
                </div>

                <Button type="button" onClick={addFloorplan} className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Floorplan
                </Button>

                {/* Floorplans List */}
                <div className="space-y-2 mt-4">
                    {store.floorplans.map((fp) => (
                        <div
                            key={fp.id}
                            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded"
                        >
                            <div>
                                <p className="font-medium">{fp.unitName}</p>
                                <p className="text-sm text-gray-500">
                                    {fp.bedrooms}BR • {fp.bathrooms}BA • {fp.size} sqft
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => store.removeFloorplan(fp.id!)}
                                className="text-red-500 hover:text-red-700"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between">
                <Button onClick={prev} variant="outline">
                    Back
                </Button>
                <Button onClick={() => next()}>Next: Amenities</Button>
            </div>
        </div>
    );
}
