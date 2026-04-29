"use client";

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
    discount: any; // Using any for Prisma.Decimal
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

    const filteredPacks = selectedPlanId === "global" 
        ? packs.filter(p => !p.planId)
        : packs.filter(p => p.planId === Number(selectedPlanId));

    const handleCreate = async () => {
        if (!newPack.label) return;
        setIsAdding(true);
        try {
            const planId = selectedPlanId === "global" ? null : Number(selectedPlanId);
            const res = await createAddonPackAction({ ...newPack, planId });
            if (res.success) {
                toast.success("Pack created");
                setNewPack({ qty: 1, label: "", discount: 0, order: 0 });
                router.refresh();
            } else {
                toast.error(res.error || "Failed to create pack");
            }
        } finally {
            setIsAdding(false);
        }
    };

    const handleDelete = async (id: number) => {
        setLoadingId(id);
        try {
            const res = await deleteAddonPackAction(id);
            if (res.success) {
                toast.success("Pack deleted");
                router.refresh();
            } else {
                toast.error("Failed to delete pack");
            }
        } finally {
            setLoadingId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Select value={selectedPlanId} onValueChange={setSelectedPlanId}>
                    <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Select plan filter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="global">Global Packs</SelectItem>
                        {addonPlans.map(plan => (
                            <SelectItem key={plan.id} value={plan.id.toString()}>{plan.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="border rounded-md">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-muted/50 border-b">
                            <th className="p-2 text-left">Label</th>
                            <th className="p-2 text-left">Qty</th>
                            <th className="p-2 text-left">Discount</th>
                            <th className="p-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPacks.map(pack => (
                            <tr key={pack.id} className="border-b">
                                <td className="p-2">{pack.label}</td>
                                <td className="p-2">{pack.qty} credits</td>
                                <td className="p-2">{Math.round(Number(pack.discount) * 100)}%</td>
                                <td className="p-2 text-right">
                                    <Button 
                                        variant="ghost" size="icon" className="text-red-500"
                                        onClick={() => handleDelete(pack.id)}
                                        disabled={loadingId === pack.id}
                                    >
                                        {loadingId === pack.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-muted/20">
                            <td className="p-2"><Input placeholder="Label" value={newPack.label} onChange={e => setNewPack({ ...newPack, label: e.target.value })} /></td>
                            <td className="p-2"><Input type="number" value={newPack.qty} onChange={e => setNewPack({ ...newPack, qty: Number(e.target.value) })} /></td>
                            <td className="p-2"><Input type="number" step="0.01" value={newPack.discount} onChange={e => setNewPack({ ...newPack, discount: Number(e.target.value) })} /></td>
                            <td className="p-2 text-right">
                                <Button onClick={handleCreate} disabled={isAdding}>
                                    {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                                </Button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Minimal Button component since it wasn't imported from UI
function Button({ children, variant, size, className, ...props }: any) {
    const base = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none disabled:opacity-50";
    const variants: any = {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        ghost: "hover:bg-accent hover:text-accent-foreground",
    };
    const sizes: any = {
        default: "h-10 px-4 py-2",
        icon: "h-9 w-9",
    };
    return (
        <button 
            className={`${base} ${variants[variant || 'default']} ${sizes[size || 'default']} ${className}`} 
            {...props}
        >
            {children}
        </button>
    );
}
