import { ProjectService } from "@/modules/project/services/project.service";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Edit2, Eye, LayoutTemplate, MapPin } from "lucide-react";
import { serializeDecimals } from "@/lib/serializeDecimal";

export default async function MyProjectsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) return null;

    const rawProjects = await ProjectService.listProjects({
        createdById: session.user.id as number,
    });
    const projects = serializeDecimals(rawProjects);

    const getStatusInfo = (project: any) => {
        const { editorialStatus, moderationStatus, systemStatus, status } = project;
        
        if (editorialStatus === "ARCHIVED") {
            return { label: "Archived", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400" };
        }
        if (systemStatus === "INACTIVE_BILLING") {
            return { label: "Hidden: Billing", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" };
        }
        if (systemStatus === "INACTIVE_QUOTA") {
            return { label: "Hidden: Quota", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" };
        }
        if (moderationStatus === "PENDING_REVIEW") {
            return { label: "Pending Review", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" };
        }
        if (moderationStatus === "REJECTED") {
            return { label: "Rejected", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" };
        }
        if (moderationStatus === "APPROVED" && editorialStatus === "SUBMITTED" && systemStatus === "ACTIVE") {
            return { label: "Published", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
        }
        if (editorialStatus === "DRAFT") {
            return { label: "Draft", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" };
        }
        
        // Fallback to legacy status
        switch (status) {
            case "APPROVED": return { label: "Approved", color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" };
            case "PENDING_REVIEW": return { label: "Pending Review", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" };
            case "DECLINED": return { label: "Declined", color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400" };
            default: return { label: status?.replace("_", " ") || "Unknown", color: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400" };
        }
    };

    const formatPrice = (price: any) => {
        if (!price) return "N/A";
        return new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', maximumFractionDigits: 0 }).format(price);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Projects</h1>
            
            <div className="bg-white dark:bg-gray-900 rounded-xl border shadow-sm overflow-hidden">
                {projects.length === 0 ? (
                    <div className="p-6 text-center py-12">
                        <p className="text-muted-foreground">No projects found.</p>
                        <Link href="/advertise/projects" className="text-primary hover:underline mt-2 inline-block">
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
                                {projects.map((project: any) => {
                                    const statusInfo = getStatusInfo(project);
                                    return (
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
                                                                By {project.developer?.name || "Unknown"}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 font-medium">
                                                {formatPrice(project.priceFrom)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant="secondary" className={`font-normal ${statusInfo.color}`}>
                                                    {statusInfo.label}
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
                                                <Link href={`/advertise/projects/edit/${project.id}`}>
                                                    <Button variant="outline" size="sm" className="h-8 gap-2">
                                                        <Edit2 className="w-3.5 h-3.5" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
