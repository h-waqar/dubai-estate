"use client";

import { useEffect, useState } from "react";
import { listProperties } from "@/modules/property/services/listProperties";
import { togglePropertyFeature } from "@/modules/admin/actions/feature.actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import Image from "next/image";
import Link from "next/link";

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchProperties = async () => {
        try {
            setLoading(true);
            const data = await listProperties({ approvalStatus: "ALL" });
            setProperties(data);
        } catch (error) {
            toast.error("Failed to fetch properties");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleToggleFeatured = async (id: number, currentStatus: boolean) => {
        try {
            // Optimistic update
            setProperties((prev) =>
                prev.map((p) =>
                    p.id === id ? { ...p, isFeatured: !currentStatus } : p
                )
            );

            const result = await togglePropertyFeature(id, !currentStatus);
            if (result.success) {
                toast.success("Property updated successfully");
            } else {
                // Revert on failure
                setProperties((prev) =>
                    prev.map((p) =>
                        p.id === id ? { ...p, isFeatured: currentStatus } : p
                    )
                );
                toast.error("Failed to update property: " + result.error);
            }
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">All Properties</h1>
                <Link href="/advertise">
                    <Button>Add New Property</Button>
                </Link>
            </div>

            <Card>
                {loading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : properties.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No properties found.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Featured</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {properties.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>
                                        <div className="font-medium">{property.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {property.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>{property.propertyType?.name}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat("en-AE", {
                                            style: "currency",
                                            currency: property.currency || "AED",
                                        }).format(Number(property.price))}
                                    </TableCell>
                                    <TableCell>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${property.status === "APPROVED"
                                                    ? "bg-green-100 text-green-800"
                                                    : property.status === "PENDING_REVIEW"
                                                        ? "bg-yellow-100 text-yellow-800"
                                                        : "bg-gray-100 text-gray-800"
                                                }`}
                                        >
                                            {property.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center space-x-2">
                                            <Switch
                                                checked={property.isFeatured}
                                                onCheckedChange={() =>
                                                    handleToggleFeatured(property.id, property.isFeatured)
                                                }
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Link href={`/properties/${property.slug}`}>
                                            <Button variant="ghost" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>
        </div>
    );
}
