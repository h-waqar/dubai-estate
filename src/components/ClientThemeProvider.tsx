// src/components/ClientThemeProvider.tsx:1

"use client"

import {ThemeProvider as NextThemesProvider} from "next-themes"
import {ReactNode, useEffect, useState} from "react"

export function ClientThemeProvider({children}: { children: ReactNode }) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null // Only render on the client

    return (
        <NextThemesProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </NextThemesProvider>
    )
}
