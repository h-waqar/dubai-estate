import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AgentDashboardPage() {
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back to your agent overview.
                    </p>
                </div>
                <Link href="/advertise">
                    <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Listing
                    </Button>
                </Link>
            </div>

            {/* Stats Overview (Mock Data) */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Listings</h3>
                    <p className="text-2xl font-bold mt-2">12</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Active Views</h3>
                    <p className="text-2xl font-bold mt-2">1,234</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Leads</h3>
                    <p className="text-2xl font-bold mt-2">48</p>
                </div>
            </div>

            {/* Recent Properties (Placeholder) */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm overflow-hidden">
                <div className="p-6 border-b">
                    <h3 className="font-semibold text-lg">Recent Listings</h3>
                </div>
                <div className="p-6 text-center py-12">
                    <p className="text-muted-foreground">No recent activity to show.</p>
                    <Link href="/advertise" className="text-primary hover:underline mt-2 inline-block">
                        Start your first listing &rarr;
                    </Link>
                </div>
            </div>
        </div>
    );
}
