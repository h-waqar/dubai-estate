"use server";

import { ProjectService } from "@/modules/project/services/project.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FeaturedToggle } from "@/components/admin/FeaturedToggle";
import { toggleProjectFeature } from "@/modules/admin/actions/feature.actions";

export default async function AdminProjectsPage() {
    const projects = await ProjectService.listProjects({});

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">All Projects</h1>
                <div className="space-x-2">
                    <Link href="/admin/project-approvals">
                        <Button variant="outline">Pending Approvals</Button>
                    </Link>
                    <Link href="/advertise/projects">
                        <Button>Add New Project</Button>
                    </Link>
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Developer</TableHead>
                            <TableHead>Editorial</TableHead>
                            <TableHead>Moderation</TableHead>
                            <TableHead>System</TableHead>
                            <TableHead>Added By</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell className="font-medium">{project.name}</TableCell>
                                <TableCell className="text-xs">{project.projectType}</TableCell>
                                <TableCell className="text-xs">{project.developer?.name || project.proposedDeveloperName || "Unknown"}</TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-[10px] font-medium ${
                                        project.editorialStatus === "SUBMITTED" ? "bg-blue-100 text-blue-800" :
                                        project.editorialStatus === "ARCHIVED" ? "bg-gray-100 text-gray-800" : "bg-slate-100 text-slate-800"
                                    }`}>
                                        {project.editorialStatus}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-[10px] font-medium ${
                                        project.moderationStatus === "APPROVED" ? "bg-green-100 text-green-800" :
                                        project.moderationStatus === "REJECTED" ? "bg-red-100 text-red-800" :
                                        project.moderationStatus === "PENDING_REVIEW" ? "bg-yellow-100 text-yellow-800" : "bg-gray-100 text-gray-800"
                                    }`}>
                                        {project.moderationStatus}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <span className={`px-2 py-1 rounded text-[10px] font-medium ${
                                        project.systemStatus === "ACTIVE" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                    }`}>
                                        {project.systemStatus}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="text-xs">{(project as any).createdBy?.name || "Unknown"}</div>
                                    <div className="text-[10px] text-muted-foreground">{(project as any).createdBy?.email}</div>
                                </TableCell>
                                <TableCell>
                                    <FeaturedToggle
                                        id={project.id}
                                        initialIsFeatured={project.isFeatured}
                                        onToggle={toggleProjectFeature}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Link href={`/projects/${project.slug}`}>
                                        <Button variant="outline" size="sm">
                                            View
                                        </Button>
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
