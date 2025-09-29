// src/app/(frontend)/admin/layout.tsx:1

import {Sidebar} from "@/components/dashboard/Sidebar"
import {Topbar} from "@/components/dashboard/Topbar"
import React from "react";

export default function AdminLayout({children}: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen">
            <Sidebar/>
            <div className="flex flex-1 flex-col">
                <Topbar/>
                <div className="flex-1">{children}</div>
            </div>
        </div>
    )
}
