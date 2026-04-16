"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createAddonPackAction, updateAddonPackAction, deleteAddonPackAction } from "../actions/addonPacks";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddonPack {
    id: number;
    qty: number;
    label: string;
    discount: string | number;
    isActive: boolean;
    order: number;
    planId: number | null;
}

interface AddonPackAdminListProps {
    initialPacks: AddonPack[];
    addonPlans: { id: number, name: string }[];
}

export default function AddonPackAdminList({ initialPacks, addonPlans }: AddonPackAdminListProps) {
    const router = useRouter();
    const [packs, setPacks] = useState(initialPacks);
    const [selectedPlanId, setSelectedPlanId] = useState<string>("global");
    const [isAdding, setIsAdding] = useState(false);
    const [newPack, setNewPack] = useState({ qty: 1, label: "", discount: 0, order: 0 });
    const [loadingId, setLoadingId] = useState<number | null>(null);

    // Sync local state when server data refreshes via router.refresh()
    useEffect(() => {
        setPacks(initialPacks);
    }, [initialPacks]);

    const handleAdd = async () => {
        if (!newPack.label) return toast.error("Label is required");
        setIsAdding(true);
        try {
            const planId = selectedPlanId === "global" ? null : parseInt(selectedPlanId);
            const res = await createAddonPackAction({ ...newPack, planId });
            if (res.success) {
                toast.success("Pack added successfully");
                setNewPack({ qty: 1, label: "", discount: 0, order: 0 });
                router.refresh();
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("Failed to add pack");
        } finally {
            setIsAdding(false);
        }
    };

    const handleUpdate = async (id: number, data: any) => {
        setLoadingId(id);
        try {
            const res = await updateAddonPackAction(id, data);
            if (res.success) {
                toast.success("Pack updated");
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("Failed to update");
        } finally {
            setLoadingId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        setLoadingId(id);
        try {
            const res = await deleteAddonPackAction(id);
            if (res.success) {
                setPacks(packs.filter(p => p.id !== id));
                toast.success("Pack deleted");
            } else {
                toast.error(res.error);
            }
        } catch (error) {
            toast.error("Failed to delete");
        } finally {
            setLoadingId(null);
        }
    };

    const filteredPacks = packs.filter(p => {
        if (selectedPlanId === "global") return !p.planId;
        return p.planId === parseInt(selectedPlanId);
    });

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Addon Multi-Purchase Packs</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Configure bulk purchase discounts for specific addon types.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="w-[200px]">
                        <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Plan" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="global">Global Fallback</SelectItem>
                                {addonPlans.map(plan => (
                                    <SelectItem key={plan.id} value={plan.id.toString()}>{plan.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Badge variant="outline">Dynamic Configuration</Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="rounded-md border overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Qty</TableHead>
                                <TableHead>Label</TableHead>
                                <TableHead>Discount %</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPacks.map((pack) => (
                                <TableRow key={pack.id}>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            defaultValue={pack.qty} 
                                            className="h-8 w-20"
                                            onBlur={(e) => handleUpdate(pack.id, { qty: parseInt(e.target.value) })}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            defaultValue={pack.label} 
                                            className="h-8"
                                            onBlur={(e) => handleUpdate(pack.id, { label: e.target.value })}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Input 
                                                type="number" 
                                                defaultValue={(Number(pack.discount) * 100).toFixed(0)} 
                                                className="h-8 w-20"
                                                onBlur={(e) => handleUpdate(pack.id, { discount: parseFloat(e.target.value) / 100 })}
                                            />
                                            <span className="text-xs text-muted-foreground">%</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            type="number" 
                                            defaultValue={pack.order} 
                                            className="h-8 w-16"
                                            onBlur={(e) => handleUpdate(pack.id, { order: parseInt(e.target.value) })}
                                        />
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="ghost" size="icon" className="text-red-500 h-8 w-8"
                                            onClick={() => handleDelete(pack.id)}
                                            disabled={loadingId === pack.id}
                                        >
                                            {loadingId === pack.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            <TableRow className="bg-muted/50">
                                <TableCell>
                                    <Input 
                                        type="number" 
                                        value={newPack.qty} 
                                        onChange={(e) => setNewPack({ ...newPack, qty: parseInt(e.target.value) })}
                                        className="h-8 w-20 bg-background"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Input 
                                        placeholder="e.g. Starter Pack" 
                                        value={newPack.label}
                                        onChange={(e) => setNewPack({ ...newPack, label: e.target.value })}
                                        className="h-8 bg-background"
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type="number" 
                                            value={newPack.discount * 100}
                                            onChange={(e) => setNewPack({ ...newPack, discount: parseFloat(e.target.value) / 100 })}
                                            className="h-8 w-20 bg-background"
                                        />
                                        <span className="text-xs text-muted-foreground">%</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Input 
                                        type="number" 
                                        value={newPack.order}
                                        onChange={(e) => setNewPack({ ...newPack, order: parseInt(e.target.value) })}
                                        className="h-8 w-16 bg-background"
                                    />
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button 
                                        size="sm" 
                                        type="button"
                                        onClick={handleAdd}
                                        disabled={isAdding}
                                    >
                                        {isAdding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                        Add Pack
                                    </Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <p className="text-[10px] text-muted-foreground">
                    * Showing packs for: <strong>{selectedPlanId === "global" ? "Global Fallback" : addonPlans.find(p => p.id === parseInt(selectedPlanId))?.name}</strong>.
                    Changes are saved automatically when you click away.
                </p>
            </CardContent>
        </Card>
    );
}
