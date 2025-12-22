import React from "react";
import Link from "next/link";
import { Plus, Edit2, Eye, MapPin, Building2, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { listProperties } from "@/modules/property/services/listProperties";
import { ProjectService } from "@/modules/project/services/project.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { serializeDecimals } from "@/lib/serializeDecimal";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const dynamic = "force-dynamic";

export default async function AgentDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return (
            <div className="p-8 text-center">
                <p className="text-muted-foreground">Please log in to view your dashboard.</p>
                <Link href="/login" className="text-primary hover:underline mt-2 inline-block">
                    Login here
                </Link>
            </div>
        );
    }

    // Fetch properties for the current user
    const properties = await listProperties({
        userId: session.user.id as number,
        approvalStatus: "ALL",
    });

    // Fetch projects for the current user
    const rawProjects = await ProjectService.listProjects({
        createdById: session.user.id as number,
    });
    const projects = serializeDecimals(rawProjects);

    // Calculate stats
    const totalListings = properties.length + projects.length;
    // Mock data for views/leads as we don't have that yet
    const activeViews = (properties.length * 120 + 45) + (projects.length * 450);
    const totalLeads = Math.floor(activeViews * 0.05);

    const getStatusColor = (status: string) => {
        switch (status) {
            case "APPROVED": return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
            case "PENDING_REVIEW": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
            case "DECLINED": return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
            default: return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
        }
    };

    const formatPrice = (price: any) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(price);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground">
                        Welcome back, {session.user.name || "Agent"}.
                    </p>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Listing
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href="/advertise">
                            <DropdownMenuItem className="cursor-pointer">
                                <Building2 className="w-4 h-4 mr-2" />
                                New Property
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/advertise/project">
                            <DropdownMenuItem className="cursor-pointer">
                                <LayoutTemplate className="w-4 h-4 mr-2" />
                                New Project
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-3">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Listings</h3>
                    <p className="text-2xl font-bold mt-2">{totalListings}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Views (Est.)</h3>
                    <p className="text-2xl font-bold mt-2">{activeViews.toLocaleString()}</p>
                </div>
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border shadow-sm">
                    <h3 className="text-sm font-medium text-muted-foreground">Total Leads (Est.)</h3>
                    <p className="text-2xl font-bold mt-2">{totalLeads.toLocaleString()}</p>
                </div>
            </div>

            {/* Content Tabs */}
            <Tabs defaultValue="properties" className="w-full">
                <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
                    <TabsTrigger value="properties">Properties ({properties.length})</TabsTrigger>
                    <TabsTrigger value="projects">Projects ({projects.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="properties" className="mt-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b">
                            <h3 className="font-semibold text-lg">My Properties</h3>
                        </div>

                        {properties.length === 0 ? (
                            <div className="p-6 text-center py-12">
                                <p className="text-muted-foreground">No properties found.</p>
                                <Link href="/advertise" className="text-primary hover:underline mt-2 inline-block">
                                    Start your first listing &rarr;
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50">
                                        <tr>
                                            <th className="px-6 py-3">Property</th>
                                            <th className="px-6 py-3">Price</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {properties.map((property: any) => (
                                            <tr key={property.id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-24 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                            {(() => {
                                                                const coverImage = property.mediaUsages?.find((mu: any) => mu.role === "COVER")?.media || property.mediaUsages?.[0]?.media || property.images?.[0];
                                                                return coverImage?.url ? (
                                                                    <Image
                                                                        src={coverImage.url}
                                                                        alt={property.title}
                                                                        fill
                                                                        sizes="96px"
                                                                        className="object-fill"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                        <Eye className="w-6 h-6" />
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{property.title}</div>
                                                            <div className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                                                                <MapPin className="w-3 h-3" />
                                                                {property.location}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    {formatPrice(property.price)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="secondary" className={`font-normal ${getStatusColor(property.status)}`}>
                                                        {property.status.replace("_", " ")}
                                                    </Badge>
                                                    {property.status === "DECLINED" && property.declinedReason && (
                                                        <div className="text-xs text-red-500 mt-1 max-w-[200px] truncate" title={property.declinedReason}>
                                                            Reason: {property.declinedReason}
                                                        </div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {new Date(property.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/properties/${property.slug}`} target="_blank">
                                                            <Button variant="ghost" size="icon" title="View Public Listing">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/agent/properties/${property.id}/edit`}>
                                                            <Button variant="outline" size="sm" className="h-8 gap-2">
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="projects" className="mt-6">
                    <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm overflow-hidden">
                        <div className="p-6 border-b">
                            <h3 className="font-semibold text-lg">My Projects</h3>
                        </div>

                        {projects.length === 0 ? (
                            <div className="p-6 text-center py-12">
                                <p className="text-muted-foreground">No projects found.</p>
                                <Link href="/advertise/project" className="text-primary hover:underline mt-2 inline-block">
                                    Start your first project listing &rarr;
                                </Link>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-gray-500 uppercase bg-gray-50 dark:bg-gray-800/50">
                                        <tr>
                                            <th className="px-6 py-3">Project</th>
                                            <th className="px-6 py-3">Starting Price</th>
                                            <th className="px-6 py-3">Status</th>
                                            <th className="px-6 py-3">Date</th>
                                            <th className="px-6 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {projects.map((project: any) => (
                                            <tr key={project.id} className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative w-24 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                                                            {(() => {
                                                                const coverImage = project.mediaUsages?.find((mu: any) => mu.role === "COVER")?.media;
                                                                return coverImage?.url ? (
                                                                    <Image
                                                                        src={coverImage.url}
                                                                        alt={project.name}
                                                                        fill
                                                                        sizes="96px"
                                                                        className="object-cover"
                                                                    />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                        <LayoutTemplate className="w-6 h-6" />
                                                                    </div>
                                                                );
                                                            })()}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">{project.name}</div>
                                                            <div className="text-muted-foreground text-xs flex items-center gap-1 mt-0.5">
                                                                <MapPin className="w-3 h-3" />
                                                                {project.location}
                                                            </div>
                                                            {project.developer && (
                                                                <div className="text-xs text-primary mt-1">
                                                                    By {project.developer.name}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-medium">
                                                    {formatPrice(project.priceFrom)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <Badge variant="secondary" className={`font-normal ${getStatusColor(project.status)}`}>
                                                        {project.status.replace("_", " ")}
                                                    </Badge>
                                                </td>
                                                <td className="px-6 py-4 text-muted-foreground">
                                                    {new Date(project.createdAt).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={`/projects/${project.slug}`} target="_blank">
                                                            <Button variant="ghost" size="icon" title="View Public Listing">
                                                                <Eye className="w-4 h-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={`/advertise/project/edit/${project.id}`}>
                                                            <Button variant="outline" size="sm" className="h-8 gap-2">
                                                                <Edit2 className="w-3.5 h-3.5" />
                                                                Edit
                                                            </Button>
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
