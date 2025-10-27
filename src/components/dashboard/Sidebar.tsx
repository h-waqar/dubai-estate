"use client"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {FaHome, FaUsers, FaUser, FaBoxOpen, FaEnvelope, FaCog, FaChevronLeft, FaChevronRight, FaTags} from "react-icons/fa"
import {cn} from "@/lib/utils"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"

const links = [
    {href: "/admin/dashboard", label: "Dashboard", icon: FaHome},
    {href: "/admin/users", label: "Users", icon: FaUsers},
    {href: "/admin/admins", label: "Admins", icon: FaUser},
    {href: "/admin/products", label: "Products", icon: FaBoxOpen},
    {href: "/admin/blog", label: "Blog Posts", icon: FaEnvelope},
    {href: "/admin/categories", label: "Categories", icon: FaTags},
    {href: "/admin/settings", label: "Settings", icon: FaCog},
]

interface SidebarLinksProps {
    isCollapsed: boolean
    onLinkClick?: () => void
}

function SidebarLinks({isCollapsed, onLinkClick}: SidebarLinksProps) {
    const pathname = usePathname()

    return (
        <nav className="flex-1 space-y-1">
            {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={onLinkClick}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                            "hover:bg-primary/10 group relative",
                            isActive && "bg-primary/15 text-primary font-medium",
                            !isActive && "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <Icon className={cn("h-5 w-5 flex-shrink-0", isActive && "text-primary")}/>
                        {!isCollapsed && (
                            <span className="truncate">{link.label}</span>
                        )}
                        {isCollapsed && (
                            <span
                                className="absolute left-full ml-2 px-2 py-1 bg-popover text-popover-foreground rounded-md text-sm whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity shadow-lg border z-50">
                                {link.label}
                            </span>
                        )}
                    </Link>
                )
            })}
        </nav>
    )
}

interface SidebarProps {
    isCollapsed: boolean
    onToggleCollapse: () => void
}

export function Sidebar({isCollapsed, onToggleCollapse}: SidebarProps) {
    return (
        <aside
            className={cn(
                "hidden md:flex flex-col h-screen border-r bg-card transition-all duration-300 ease-in-out sticky top-0",
                isCollapsed ? "w-16" : "w-64"
            )}
        >
            <div className="flex items-center justify-between p-4 border-b">
                {!isCollapsed && (
                    <div className="text-lg font-bold truncate">Admin Dashboard</div>
                )}
                <button
                    onClick={onToggleCollapse}
                    className={cn(
                        "p-1.5 rounded-lg hover:bg-primary/10 transition-colors",
                        isCollapsed && "mx-auto"
                    )}
                    aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <FaChevronRight className="h-4 w-4"/>
                    ) : (
                        <FaChevronLeft className="h-4 w-4"/>
                    )}
                </button>
            </div>

            <div className="flex flex-col flex-1 p-3 overflow-y-auto overflow-x-hidden">
                <SidebarLinks isCollapsed={isCollapsed}/>
            </div>
        </aside>
    )
}

interface MobileSidebarProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function MobileSidebar({open, onOpenChange}: MobileSidebarProps) {
    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="left" className="w-64 p-0">
                <SheetHeader className="p-4 border-b">
                    <SheetTitle className="text-left">Admin Dashboard</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col h-[calc(100%-4rem)] p-3 overflow-y-auto">
                    <SidebarLinks
                        isCollapsed={false}
                        onLinkClick={() => onOpenChange(false)}
                    />
                </div>
            </SheetContent>
        </Sheet>
    )
}