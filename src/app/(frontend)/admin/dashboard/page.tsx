// src/app/(frontend)/admin/page.tsx:1

import {Card} from "@/components/ui/card"

export default function AdminHome() {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="p-4">Users: 1024</Card>
            <Card className="p-4">Products: 256</Card>
            <Card className="p-4">Blog Posts: 42</Card>
        </div>
    )
}
