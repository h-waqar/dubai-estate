"use client"

import {FaBars} from "react-icons/fa"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {ThemeToggle} from "@/components/ui/theme-toggle"
import {Button} from "@/components/ui/button"

interface TopbarProps {
    onMobileMenuClick?: () => void
}

export function Topbar({onMobileMenuClick}: TopbarProps) {
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
                    <FaBars className="h-5 w-5"/>
                </Button>
            )}

            {/* Spacer for desktop */}
            <div className="hidden md:block"/>

            {/* Right side actions */}
            <div className="flex items-center gap-2 ml-auto">
                <ThemeToggle/>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src="/avatar-placeholder.png" alt="User avatar"/>
                                <AvatarFallback className="bg-primary/10 text-primary">AD</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                        <DropdownMenuLabel>
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium">Admin User</p>
                                <p className="text-xs text-muted-foreground">admin@example.com</p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="cursor-pointer">
                            Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">
                            Settings
                        </DropdownMenuItem>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem className="cursor-pointer text-destructive">
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    )
}
