"use client";

import { useState, useEffect } from "react";
import { Check, ChevronsUpDown, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { getDevelopers } from "@/modules/admin/actions/developer.actions";
import { DeveloperStatus } from "@prisma/client";

interface Developer {
    id: number;
    name: string;
}

export interface DeveloperSelectorProps {
    value?: {
        developerId?: number;
        proposedDeveloperName?: string;
    };
    onChange: (value: { developerId?: number; proposedDeveloperName?: string }) => void;
}

export function DeveloperSelector({ value, onChange }: DeveloperSelectorProps) {
    const [open, setOpen] = useState(false);
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState("");

    const developerId = value?.developerId;
    const proposedDeveloperName = value?.proposedDeveloperName;

    useEffect(() => {
        const fetchDevelopers = async () => {
            setLoading(true);
            try {
                // Only fetch APPROVED developers
                const data = await getDevelopers(DeveloperStatus.APPROVED);
                setDevelopers(data);
            } catch (error) {
                console.error("Failed to fetch developers", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDevelopers();
    }, []);

    const handleSelect = (currentValue: string) => {
        const selectedDev = developers.find(
            (dev) => dev.name.toLowerCase() === currentValue.toLowerCase()
        );

        if (selectedDev) {
            onChange({
                developerId: selectedDev.id,
                proposedDeveloperName: undefined,
            });
        }
        setOpen(false);
    };

    const handleCreateProposal = () => {
        if (inputValue.trim().length < 3) return;
        onChange({
            developerId: undefined,
            proposedDeveloperName: inputValue.trim(),
        });
        setOpen(false);
    };

    const selectedName =
        developers.find((d) => d.id === developerId)?.name ||
        proposedDeveloperName ||
        "Select Developer";

    const isProposal = !!proposedDeveloperName && !developerId;

    return (
        <div className="space-y-3">
            <label className="block text-sm font-semibold text-foreground tracking-tight">
                Developer
            </label>
            <div className="flex flex-col gap-2">
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
                            className="w-full justify-between h-12 border-input bg-background hover:bg-accent/50"
                        >
                            {selectedName === "Select Developer" ? (
                                <span className="text-muted-foreground">Select Developer...</span>
                            ) : (
                                <span className="font-medium text-foreground">{selectedName}</span>
                            )}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                        <Command>
                            <CommandInput
                                placeholder="Search developer..."
                                onValueChange={setInputValue}
                            />
                            <CommandList>
                                <CommandEmpty>
                                    <div className="p-2 text-sm text-muted-foreground">
                                        {inputValue.length > 2 ? (
                                            <div
                                                className="cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 rounded-sm flex flex-col gap-1"
                                                onClick={handleCreateProposal}
                                            >
                                                <span className="font-medium text-primary">Use "{inputValue}"</span>
                                                <span className="text-xs">Propse as new developer (Pending Approval)</span>
                                            </div>
                                        ) : (
                                            <span>No results found.</span>
                                        )}
                                    </div>
                                </CommandEmpty>

                                <CommandGroup heading="Approved Developers">
                                    {developers.map((dev) => (
                                        <CommandItem
                                            key={dev.id}
                                            value={dev.name}
                                            onSelect={handleSelect}
                                            className="cursor-pointer"
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    developerId === dev.id ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {dev.name}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                
                                {inputValue.length > 2 && !developers.some(dev => dev.name.toLowerCase() === inputValue.toLowerCase()) && (
                                     <CommandGroup heading="New Proposal">
                                        <div
                                            className="cursor-pointer hover:bg-accent hover:text-accent-foreground p-2 text-sm rounded-sm flex flex-col gap-1 mx-1"
                                            onClick={handleCreateProposal}
                                        >
                                            <span className="font-medium text-primary">Propose "{inputValue}"</span>
                                            <span className="text-xs text-muted-foreground">Submit for admin review</span>
                                        </div>
                                    </CommandGroup>
                                )}
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>

                {isProposal && (
                    <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-600 dark:text-amber-400 text-sm">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <div className="flex flex-col gap-1">
                            <p className="font-semibold">Pending Approval</p>
                            <p className="text-xs opacity-90">
                                "{proposedDeveloperName}" will be reviewed by an admin. Your project will remain unlinked until approved.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
