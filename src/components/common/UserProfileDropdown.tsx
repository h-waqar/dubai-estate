"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { useAuth } from "@/modules/user/hooks/useAuth";
import { usePostStore } from "@/modules/blog/stores/usePostStore";
import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";

export function UserProfileDropdown() {

    const { session, userRoles } = useAuth();

    const { resetPost } = usePostStore();



    const user = session?.user;

    const isAdmin = userRoles?.includes("ADMIN") || userRoles?.includes("SUPER_ADMIN");

    if (!user) return null;

    const handleLogout = async () => {
        // 1. Clear application state
        resetPost();

        // 2. Clear local storage explicitly if needed (zustand persist handles its own, but good to be safe for other items)
        // localStorage.removeItem("post-storage"); // resetPost handles this for post store

        // 3. Sign out and redirect
        await signOut({ callbackUrl: "/" });
    };

    // Get initials for fallback
    const initials = user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
        : "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                        <AvatarImage src={user.image || "/avatar-placeholder.png"} alt={user.name || "User"} />
                        <AvatarFallback className="bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 font-medium">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href="/account" className="cursor-pointer flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>My Account</span>
                    </Link>
                </DropdownMenuItem>
                {isAdmin ? (
                    <DropdownMenuItem asChild>
                        <Link href="/admin/dashboard" className="cursor-pointer flex items-center">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Admin Panel</span>
                        </Link>
                    </DropdownMenuItem>
                ) : (
                    <DropdownMenuItem asChild>
                        <Link href="/account/dashboard" className="cursor-pointer flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            <span>Agent Dashboard</span>
                        </Link>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                    <Link href="/admin/settings" className="cursor-pointer flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/20"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
