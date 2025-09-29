"use client"

import {useState} from "react"
import Link from "next/link"
import {FaHome, FaUsers, FaUser, FaBoxOpen, FaEnvelope, FaCog} from "react-icons/fa"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const links = [
    {href: "/admin/dashboard", label: "Dashboard", icon: <FaHome/>},
    {href: "/admin/users", label: "Users", icon: <FaUsers/>},
    {href: "/admin/admins", label: "Admins", icon: <FaUser/>},
    {href: "/admin/products", label: "Products", icon: <FaBoxOpen/>},
    {href: "/admin/blog", label: "Blog Posts", icon: <FaEnvelope/>},
    {href: "/admin/settings", label: "Settings", icon: <FaCog/>},
]

function SidebarLinks() {
    return (
        <nav className="flex-1 space-y-2">
            {links.map((link) => (
                <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-2 p-2 hover:bg-primary/10 rounded"
                >
                    {link.icon} {link.label}
                </Link>
            ))}
        </nav>
    )
}

export function Sidebar() {
    const [open, setOpen] = useState(false)

    return (
        <>
            {/* Mobile menu button in Topbar */}
            <button
                className="md:hidden p-2"
                onClick={() => setOpen(true)}
            >
                ☰
            </button>

            {/* Desktop sidebar */}
            <aside className="hidden md:flex flex-col w-64 h-screen border-r bg-sidebar p-4">
                <div className="mb-8 text-xl font-bold">Admin Dashboard</div>
                <SidebarLinks/>
            </aside>

            {/* Mobile sidebar */}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger className="hidden"/> {/* Invisible trigger since we control with button */}
                {/*<DialogContent className="fixed left-0 top-0 h-full w-64 bg-sidebar p-4">*/}
                <DialogContent
                    className="fixed top-0 left-0 h-full w-64 bg-sidebar p-4 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out">
                    <DialogHeader>
                        <DialogTitle>Menu</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col h-full mt-4">
                        <SidebarLinks/>
                        <button
                            className="mt-auto p-2 border rounded bg-primary text-white"
                            onClick={() => setOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
