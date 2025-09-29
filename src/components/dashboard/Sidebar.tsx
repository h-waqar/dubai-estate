"use client"

import Link from "next/link"
import {FaBoxOpen, FaCog, FaEnvelope, FaHome, FaUser, FaUsers} from "react-icons/fa"
import {ThemeToggle} from "@/components/ui/theme-toggle"

export function Sidebar() {
    return (
        <aside className="flex h-screen w-64 flex-col border-r bg-sidebar p-4 text-sidebar-foreground">
            <div className="mb-8 text-xl font-bold">Admin Dashboard</div>
            <nav className="flex-1 space-y-2">
                <Link href="/admin/dashboard" className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded">
                    <FaHome/> Dashboard
                </Link>
                <Link href="/admin/users" className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded">
                    <FaUsers/> Users
                </Link>
                <Link href="/admin/admins" className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded">
                    <FaUser/> Admins
                </Link>
                <Link href="/admin/products" className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded">
                    <FaBoxOpen/> Products
                </Link>
                <Link href="/admin/blog" className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded">
                    <FaEnvelope/> Blog Posts
                </Link>
                <Link href="/admin/settings" className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded">
                    <FaCog/> Settings
                </Link>
            </nav>
            <div className="mt-auto">
                <ThemeToggle/>
            </div>
        </aside>
    )
}
