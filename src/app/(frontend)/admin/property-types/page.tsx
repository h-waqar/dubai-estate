"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { PropertyType } from "@prisma/client";

export default function PropertyTypesPage() {
    const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingPropType, setEditingPropType] = useState<PropertyType | null>(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        fetchPropertyTypes();
    }, []);

    const fetchPropertyTypes = async () => {
        try {
            const response = await api.get("/property-types");
            setPropertyTypes(response.data.data);
        } catch {
            toast.error("Failed to fetch property types");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        const data = { name, description };
        try {
            if (editingPropType) {
                await api.patch(`/property-types/${editingPropType.id}`, data);
                toast.success("Property Type updated successfully");
            } else {
                await api.post("/property-types", data);
                toast.success("Property Type created successfully");
            }
            fetchPropertyTypes();
            setDialogOpen(false);
        } catch {
            toast.error("Failed to save property type");
        }
    };

    const handleEdit = (pt: PropertyType) => {
        setEditingPropType(pt);
        setName(pt.name);
        setDescription(pt.description || "");
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (confirm("Are you sure you want to delete this property type?")) {
            try {
                await api.delete(`/property-types/${id}`);
                toast.success("Property Type deleted successfully");
                fetchPropertyTypes();
            } catch {
                toast.error("Failed to delete property type");
            }
        }
    };

    const openNewDialog = () => {
        setEditingPropType(null);
        setName("");
        setDescription("");
        setDialogOpen(true);
    };

    return (
        <div className="container mx-auto py-8 px-4">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Property Types</h1>
                <Button onClick={openNewDialog}>Add Property Type</Button>
            </div>

            <Card>
                {loading ? (
                    <div className="p-8 text-center">Loading...</div>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Properties</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {propertyTypes.map((pt) => (
                                <TableRow key={pt.id}>
                                    <TableCell>{pt.name}</TableCell>
                                    <TableCell>{pt.slug}</TableCell>
                                    <TableCell>{pt.description}</TableCell>
                                    <TableCell>{(pt as any)._count?.properties || 0}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" onClick={() => handleEdit(pt)}>
                                            Edit
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-500" onClick={() => handleDelete(pt.id)}>
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingPropType ? "Edit Property Type" : "New Property Type"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>
                        <div>
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
