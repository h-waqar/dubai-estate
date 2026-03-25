"use client"

import { FaBars } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"
import { UserProfileDropdown } from "@/components/common/UserProfileDropdown"
import { Home } from "lucide-react"
import Link from "next/link"

interface TopbarProps {
    onMobileMenuClick?: () => void
}

export function Topbar({ onMobileMenuClick }: TopbarProps) {
    return (
        <header
            className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4 md:px-6">
            {/* Mobile menu button */}
            {onMobileMenuClick && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={onMobileMenuClick}
                    aria-label="Open menu"
                >
                    <FaBars className="h-5 w-5" />
                </Button>
            )}

            {/* Spacer for desktop */}
            <div className="hidden md:block" />

            {/* Right side actions */}
            <div className="flex items-center gap-2 ml-auto">
                <Link href="/">
                    <Button variant="ghost" size="icon" aria-label="Go to homepage" title="Back to homepage">
                        <Home className="h-5 w-5" />
                    </Button>
                </Link>
                <ThemeToggle />
                <UserProfileDropdown />
            </div>
        </header>
    )
}
