// src/app/(frontend)/admin/page.tsx:1

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {FaBoxOpen, FaChartLine, FaFileAlt, FaUsers} from "react-icons/fa";

export default function DashboardPage() {
    const stats = [
        {
            title: "Total Users",
            value: "1,024",
            icon: FaUsers,
            trend: "+12% from last month",
            color: "text-blue-500"
        },
        {
            title: "Products",
            value: "256",
            icon: FaBoxOpen,
            trend: "+8% from last month",
            color: "text-green-500"
        },
        {
            title: "Blog Posts",
            value: "42",
            icon: FaFileAlt,
            trend: "+3 new this week",
            color: "text-purple-500"
        },
        {
            title: "Revenue",
            value: "$24,500",
            icon: FaChartLine,
            trend: "+18% from last month",
            color: "text-orange-500"
        }
    ]

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome back! Here&#39;s what&#39;s happening with your platform.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon
                    return (
                        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`}/>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.trend}
                                </p>
                            </CardContent>
                        </Card>
                    )
                })}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                                    <div className="h-2 w-2 rounded-full bg-primary"/>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">Activity item {i}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {i} hour{i > 1 ? 's' : ''} ago
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                                <p className="font-medium">Add User</p>
                                <p className="text-xs text-muted-foreground mt-1">Create new account</p>
                            </button>
                            <button
                                className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                                <p className="font-medium">New Product</p>
                                <p className="text-xs text-muted-foreground mt-1">Add to inventory</p>
                            </button>
                            <button
                                className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                                <p className="font-medium">Write Post</p>
                                <p className="text-xs text-muted-foreground mt-1">Create blog content</p>
                            </button>
                            <button
                                className="p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left">
                                <p className="font-medium">View Reports</p>
                                <p className="text-xs text-muted-foreground mt-1">Analytics & insights</p>
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
