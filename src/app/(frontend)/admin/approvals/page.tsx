"use client";

import { useEffect, useState } from "react";
import { listProperties } from "@/modules/property/services/listProperties";
import { approvePropertyAction } from "@/modules/property/actions/approveProperty";
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
import { toast } from "sonner";
import { Property, User, PropertyType } from "@/generated/prisma";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils"; // or whatever utils we have

// Extend Property type to include relations we fetch
type PropertyWithRelations = Property & {
    propertyType: PropertyType;
    createdBy: User;
    images: any[];
};

export default function ApprovalsPage() {
    const [properties, setProperties] = useState<PropertyWithRelations[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPendingProperties = async () => {
        try {
            setLoading(true);
            // We use "ALL" or custom logic? listProperties now supports approvalStatus
            const data = await listProperties({ approvalStatus: "PENDING_REVIEW" });
            setProperties(data as any);
        } catch (error) {
            toast.error("Failed to fetch pending properties");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingProperties();
    }, []);

    const handleApprove = async (id: number) => {
        try {
            const result = await approvePropertyAction(id, "APPROVED");
            if (result.success) {
                toast.success("Property approved successfully");
                fetchPendingProperties();
            } else {
                toast.error("Failed to approve: " + result.error);
            }
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    const handleDecline = async (id: number) => {
        const reason = prompt("Enter reason for decline:");
        if (reason === null) return; // cancelled

        try {
            const result = await approvePropertyAction(id, "DECLINED", reason);
            if (result.success) {
                toast.success("Property declined");
                fetchPendingProperties();
            } else {
                toast.error("Failed to decline: " + result.error);
            }
        } catch (err) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <h1 className="text-3xl font-bold mb-6">Pending Approvals</h1>

            <Card>
                {loading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : properties.length === 0 ? (
                    <div className="p-8 text-center text-muted-foreground">
                        No properties pending review.
                    </div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Property</TableHead>
                                <TableHead>Agent</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Submitted</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {properties.map((property) => (
                                <TableRow key={property.id}>
                                    <TableCell>
                                        <div className="font-medium">{property.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {property.propertyType?.name} • {property.location}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {property.createdBy?.image && (
                                                <Image
                                                    src={property.createdBy.image}
                                                    alt={property.createdBy.name || "User"}
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full"
                                                />
                                            )}
                                            <span>{property.createdBy?.name || property.createdBy?.email}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat("en-AE", {
                                            style: "currency",
                                            currency: property.currency || "AED",
                                        }).format(Number(property.price))}
                                    </TableCell>
                                    <TableCell>
                                        {new Date(property.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                            onClick={() => handleApprove(property.id)}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDecline(property.id)}
                                        >
                                            Decline
                                        </Button>
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
