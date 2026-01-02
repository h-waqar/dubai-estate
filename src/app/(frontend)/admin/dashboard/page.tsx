import Link from "next/link"; // For navigation
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    Users, 
    Building2, 
    FileText, 
    TrendingUp, 
    DollarSign,
    LayoutDashboard,
    PlusCircle,
    UserPlus,
    MessageSquare
} from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
    const data = await getDashboardStats();

    const stats = [
        {
            title: "Total Revenue",
            value: `AED ${data.revenue.total.toLocaleString()}`,
            icon: DollarSign,
            trend: "Monthly recurring revenue",
            color: "text-emerald-500",
            details: null
        },
        {
            title: "Total Users",
            value: data.users.total.toLocaleString(),
            icon: Users,
            trend: `+${data.users.newThisMonth} new this month`,
            color: "text-blue-500",
            details: null
        },
        {
            title: "Properties",
            value: data.properties.total.toLocaleString(),
            icon: Building2,
            trend: `+${data.properties.newThisMonth} new this month`,
            color: "text-green-500",
            details: [
                { label: "Approved", value: data.properties.approved, color: "text-green-600" },
                { label: "Pending", value: data.properties.pending, color: "text-yellow-600" },
                { label: "Declined", value: data.properties.declined, color: "text-red-600" },
            ]
        },
        {
            title: "Projects",
            value: data.projects.total.toLocaleString(),
            icon: Building2,
            trend: "Total Projects",
            color: "text-cyan-500",
            details: [
                { label: "Approved", value: data.projects.approved, color: "text-green-600" },
                { label: "Pending", value: data.projects.pending, color: "text-yellow-600" },
                { label: "Declined", value: data.projects.declined, color: "text-red-600" },
            ]
        },
        {
            title: "Developers",
            value: data.developers.total.toLocaleString(),
            icon: Users,
            trend: "Total Developers",
            color: "text-indigo-500",
            details: null
        },
        {
            title: "Blog Posts",
            value: data.posts.total.toLocaleString(),
            icon: FileText,
            trend: `+${data.posts.newThisMonth} new this month`,
            color: "text-purple-500",
            details: null
        },
        {
            title: "Total Leads",
            value: data.leads.total.toLocaleString(),
            icon: TrendingUp,
            trend: `+${data.leads.newThisMonth} new this month`,
            color: "text-orange-500",
            details: null
        }
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    Welcome back! Here&#39;s what&#39;s happening with your platform.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={stat.title} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1 mb-3">
                                    {stat.trend}
                                </p>
                                {stat.details && (
                                    <div className="pt-2 border-t grid grid-cols-3 gap-2 text-center">
                                        {stat.details.map((detail) => (
                                            <div key={detail.label} className="flex flex-col">
                                                <span className={`text-xs font-bold ${detail.color}`}>{detail.value}</span>
                                                <span className="text-[10px] text-muted-foreground">{detail.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.recentActivity.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No recent activity.</p>
                            ) : (
                                data.recentActivity.map((item) => (
                                    <div key={item.id} className="flex items-center gap-3 pb-3 border-b last:border-0 last:pb-0">
                                        <div className={`h-2 w-2 rounded-full ${item.type === 'LEAD' ? 'bg-orange-500' :
                                            item.type === 'PROPERTY' ? 'bg-green-500' :
                                                item.type === 'USER' ? 'bg-blue-500' : 'bg-purple-500'
                                            }`} />
                                        <div className="flex-1 space-y-1">
                                            <p className="text-sm font-medium">{item.message}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/admin/users" className="block">
                                <button className="w-full h-full p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left flex items-start gap-3">
                                    <Users className="h-5 w-5 text-blue-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Manage Users</p>
                                        <p className="text-xs text-muted-foreground mt-1">View all users</p>
                                    </div>
                                </button>
                            </Link>
                            <Link href="/advertise" className="block">
                                <button className="w-full h-full p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left flex items-start gap-3">
                                    <PlusCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">New Property</p>
                                        <p className="text-xs text-muted-foreground mt-1">Add to inventory</p>
                                    </div>
                                </button>
                            </Link>
                            <Link href="/admin/blog/new" className="block">
                                <button className="w-full h-full p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left flex items-start gap-3">
                                    <FileText className="h-5 w-5 text-purple-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">Write Post</p>
                                        <p className="text-xs text-muted-foreground mt-1">Create blog content</p>
                                    </div>
                                </button>
                            </Link>
                            <Link href="/lead" className="block">
                                <button className="w-full h-full p-4 border rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left flex items-start gap-3">
                                    <MessageSquare className="h-5 w-5 text-orange-500 mt-0.5" />
                                    <div>
                                        <p className="font-medium">View Leads</p>
                                        <p className="text-xs text-muted-foreground mt-1">Callback requests</p>
                                    </div>
                                </button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
