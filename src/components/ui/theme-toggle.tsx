// src\components\ui\theme-toggle.tsx

"use client"

import {useTheme} from "next-themes"
import {FaMoon, FaSun} from "react-icons/fa" // FontAwesome icons from react-icons
import {Button} from "@/components/ui/button"

export function ThemeToggle() {
    const {theme, setTheme} = useTheme()
    return (
        <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
            <FaSun className="h-4 w-4 dark:hidden"/>
            <FaMoon className="h-4 w-4 hidden dark:block"/>
            <span className="sr-only">Toggle theme</span>
        </Button>
    )
}

