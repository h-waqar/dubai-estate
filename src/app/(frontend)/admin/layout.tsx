// "use client"
//
// import React, {useState, useEffect} from "react"
// import {Sidebar, MobileSidebar} from "@/components/dashboard/Sidebar"
// import {Topbar} from "@/components/dashboard/Topbar"
//
// export default function AdminLayout({children}: { children: React.ReactNode }) {
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
//     const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
//
//     // Load sidebar state from localStorage on mount
//     useEffect(() => {
//         const saved = localStorage.getItem("sidebarCollapsed")
//         if (saved !== null) {
//             setSidebarCollapsed(JSON.parse(saved))
//         }
//     }, [])
//
//     // Save sidebar state to localStorage when it changes
//     const handleToggleCollapse = () => {
//         const newState = !sidebarCollapsed
//         setSidebarCollapsed(newState)
//         localStorage.setItem("sidebarCollapsed", JSON.stringify(newState))
//     }
//
//     return (
//         <div className="flex min-h-screen bg-background">
//             {/* Desktop sidebar */}
//             <Sidebar
//                 isCollapsed={sidebarCollapsed}
//                 onToggleCollapse={handleToggleCollapse}
//             />
//
//             {/* Mobile sidebar */}
//             <MobileSidebar
//                 open={mobileMenuOpen}
//                 onOpenChange={setMobileMenuOpen}
//             />
//
//             {/* Main content area */}
//             <div className="flex flex-1 flex-col min-w-0">
//                 <Topbar onMobileMenuClick={() => setMobileMenuOpen(true)}/>
//
//                 <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
//                     <div className="mx-auto max-w-7xl">
//                         {children}
//                     </div>
//                 </main>
//             </div>
//         </div>
//     )
// }


"use client"

import React, {useState, useEffect} from "react"
import {Sidebar, MobileSidebar} from "@/components/dashboard/Sidebar"
import {Topbar} from "@/components/dashboard/Topbar"
import {LoginModal} from "@/components/auth/LoginModal"

export default function AdminLayout({children}: { children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [checkingAuth, setCheckingAuth] = useState(true)

    useEffect(() => {
        // Example: check for token in localStorage
        const token = localStorage.getItem("authToken")
        if (token) {
            setIsLoggedIn(true)
        }
        setCheckingAuth(false)

        const saved = localStorage.getItem("sidebarCollapsed")
        if (saved !== null) {
            setSidebarCollapsed(JSON.parse(saved))
        }
    }, [])

    const handleToggleCollapse = () => {
        const newState = !sidebarCollapsed
        setSidebarCollapsed(newState)
        localStorage.setItem("sidebarCollapsed", JSON.stringify(newState))
    }

    const handleLogin = (email: string, password: string) => {
        // TODO: Replace with real auth check
        if (email === "admin@example.com" && password === "password") {
            localStorage.setItem("authToken", "dummy-token")
            setIsLoggedIn(true)
        } else {
            alert("Invalid credentials")
        }
    }

    if (checkingAuth) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>
    }

    if (!isLoggedIn) {
        return <LoginModal open={true} onLogin={handleLogin}/>
    }

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar
                isCollapsed={sidebarCollapsed}
                onToggleCollapse={handleToggleCollapse}
            />

            <MobileSidebar
                open={mobileMenuOpen}
                onOpenChange={setMobileMenuOpen}
            />

            <div className="flex flex-1 flex-col min-w-0">
                <Topbar onMobileMenuClick={() => setMobileMenuOpen(true)}/>
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
                    <div className="mx-auto max-w-7xl">{children}</div>
                </main>
            </div>
        </div>
    )
}
