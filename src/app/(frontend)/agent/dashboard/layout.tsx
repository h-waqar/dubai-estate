"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, MobileSidebar, SidebarItem } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { LayoutDashboard, PlusCircle, Building2, UserCircle } from "lucide-react";

// Define Agent Links
const agentLinks: SidebarItem[] = [
    {
        label: "Overview",
        icon: LayoutDashboard,
        subItems: [
            { href: "/agent/dashboard", label: "Dashboard", icon: LayoutDashboard },
        ]
    },
    {
        label: "Properties",
        icon: Building2,
        subItems: [
            { href: "/advertise", label: "Create Listing", icon: PlusCircle },
            // Add "My Listings" here later when available
        ]
    },
    {
        label: "Account",
        icon: UserCircle,
        subItems: [
             // Add Profile/Settings links if needed, or just leave as placeholder structure
             // For now, let's keep it simple based on existing links
        ]
    }
];

// Simplified links for now to match exactly what was there + structure
const simpleAgentLinks: SidebarItem[] = [
    {
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/agent/dashboard"
    },
    {
        label: "Create Listing",
        icon: PlusCircle,
        href: "/advertise"
    }
];


export default function AgentDashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("agentSidebarCollapsed");
        if (saved !== null) {
            setSidebarCollapsed(JSON.parse(saved));
        }
    }, []);

    const handleToggleCollapse = () => {
        const newState = !sidebarCollapsed;
        setSidebarCollapsed(newState);
        localStorage.setItem("agentSidebarCollapsed", JSON.stringify(newState));
    };

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar
                title="Agent Portal"
                links={simpleAgentLinks}
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={handleToggleCollapse}
            />

            <MobileSidebar
                title="Agent Portal"
                links={simpleAgentLinks}
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
            />

            <div className="flex flex-1 flex-col min-w-0">
                <Topbar onMobileMenuClick={() => setMobileMenuOpen(true)} />
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}