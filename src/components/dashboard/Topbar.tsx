// src/components/dashboard/Topbar.tsx:1

"use client"

import {Avatar} from "@/components/ui/avatar"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"

export function Topbar() {
    return (
        <header className="flex h-14 w-full items-center justify-end border-b bg-background px-4">
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="h-8 w-8"/>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}
