"use client"

import {ReactNode} from "react"

export function ContentArea({children}: { children: ReactNode }) {
    return (
        <main className="flex-1 p-6 bg-background text-foreground">
            {children}
        </main>
    )
}
