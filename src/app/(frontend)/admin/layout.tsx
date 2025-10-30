// src/app/(frontend)/admin/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { Sidebar, MobileSidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import React, { useState, useEffect } from "react";
// import { Toaster } from "@/components/ui/sonner";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    if (saved !== null) {
      setSidebarCollapsed(JSON.parse(saved));
    }
  }, []);

  const handleToggleCollapse = () => {
    const newState = !sidebarCollapsed;
    setSidebarCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!session) {
    // Not logged in → redirect to log in
    if (typeof window !== "undefined") {
      // Append callbackUrl so after login user returns here
      const returnUrl = encodeURIComponent(window.location.pathname);
      window.location.href = `/auth/login?callbackUrl=${returnUrl}`;
    }
    return null;
  }

  return (
    <>
      <div className="flex min-h-screen bg-background">
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />

        <MobileSidebar open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} />

        <div className="flex flex-1 flex-col min-w-0">
          <Topbar onMobileMenuClick={() => setMobileMenuOpen(true)} />
          <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
            <div className="mx-auto max-w-7xl">{children}</div>
          </main>
        </div>
      </div>
      {/* <Toaster /> */}
    </>
  );
}
