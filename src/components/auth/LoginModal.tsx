"use client"

import {useState} from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"

interface LoginModalProps {
    open: boolean
    onLogin: (email: string, password: string) => void
}

export function LoginModal({open, onLogin}: LoginModalProps) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    return (
        <Dialog open={open}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Login Required</DialogTitle>
                    <DialogDescription>
                        Please sign in to access the admin dashboard.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={() => onLogin(email, password)}>Login</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
