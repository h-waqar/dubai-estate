"use client"

import {Card, CardHeader, CardContent, CardFooter} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {useRouter} from "next/navigation"
import {AlertCircle} from "lucide-react"

export default function UnauthorizedPage() {
    const router = useRouter()

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
            <Card className="max-w-md w-full shadow-lg">
                <CardHeader className="flex flex-col items-center gap-2">
                    <AlertCircle className="w-12 h-12 text-red-500"/>
                    <h2 className="text-2xl font-bold text-center">Access Denied</h2>
                    <p className="text-center text-muted-foreground">
                        You don’t have permission to view this page.
                    </p>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-sm text-muted-foreground">
                        If you believe this is a mistake, contact your administrator.
                    </p>
                </CardContent>
                <CardFooter className="flex justify-center gap-4">
                    <Button variant="default" onClick={() => router.push("/")}>
                        Go Home
                    </Button>
                    <Button variant="secondary" onClick={() => router.push("/auth/login")}>
                        Login as Different User
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
