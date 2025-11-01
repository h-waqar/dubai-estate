// src/app/(frontend)/auth/login/page.tsx
"use client"

import React, {useState} from "react"
import {signIn} from "next-auth/react"
import {Card, CardHeader, CardContent, CardFooter} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Button} from "@/components/ui/button"
import {toast} from "sonner" // <-- use toast function
import {Toaster} from "@/components/ui/sonner"
import {useSearchParams} from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)


        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
            // callbackUrl: "/admin/dashboard"
        })

        setLoading(false)

        if (res?.error) toast.error(res.error)
        else {
            toast.success("Login successful!")
            window.location.href = callbackUrl // go back to the original page
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Toaster/> {/* <-- render once */}
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader>
                    <h1 className="text-2xl font-bold text-center">Welcome Back</h1>
                    <p className="text-center text-sm text-muted-foreground">
                        Sign in to your account
                    </p>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleLogin}>
                        <div>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Don’t have an account?{" "}
                        <a href="/auth/register" className="text-primary underline">
                            Register
                        </a>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
