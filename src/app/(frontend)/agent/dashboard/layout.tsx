import React from "react";
import Link from "next/link";
import { LayoutDashboard, PlusCircle, Building2 } from "lucide-react";

export default function AgentDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900/50">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 hidden md:block">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-primary">Agent Portal</h2>
                </div>
                <nav className="px-3 space-y-1">
                    <Link
                        href="/agent/dashboard"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg bg-primary/10 text-primary"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/advertise"
                        className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <PlusCircle className="w-5 h-5" />
                        Create Listing
                    </Link>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-4 md:p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
