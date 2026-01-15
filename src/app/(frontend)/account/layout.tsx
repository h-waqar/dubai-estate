"use client";

import { useSession } from "next-auth/react";
import { Sidebar, MobileSidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar"; // Reuse Topbar or make a new one? Reuse seems fine.
import React, { useState, useEffect } from "react";
import { accountLinks } from "@/components/account/accountLinks";
import { redirect } from "next/navigation";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("accountSidebarCollapsed");
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  const handleToggleCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("accountSidebarCollapsed", JSON.stringify(newState));
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    if (typeof window !== "undefined") {
        window.location.href = "/login";
    }
    return null;
  }

  // Filter links based on role
  const userRoles = session.user?.roles || [];
  const filteredLinks = accountLinks.filter(link => {
    if (!link.roles) return true; // No roles defined = visible to all
    return link.roles.some(allowedRole => userRoles.includes(allowedRole));
  });

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isCollapsed={sidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
        links={filteredLinks}
        title="My Account"
      />

      <MobileSidebar 
        open={mobileMenuOpen} 
        onOpenChange={setMobileMenuOpen} 
        links={filteredLinks}
        title="My Account"
      />

      <div className="flex flex-1 flex-col min-w-0">
        <Topbar onMobileMenuClick={() => setMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="mx-auto max-w-7xl animate-in fade-in duration-500">{children}</div>
        </main>
      </div>
    </div>
  );
}
