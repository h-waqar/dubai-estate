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
                    <Link href="/advertise/project">
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
                            <TableHead>Status</TableHead>
                            <TableHead>Published</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {projects.map((project) => (
                            <TableRow key={project.id}>
                                <TableCell className="font-medium">{project.name}</TableCell>
                                <TableCell>{project.projectType}</TableCell>
                                <TableCell>{project.developer.name}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded text-xs ${project.status === "APPROVED"
                                            ? "bg-green-100 text-green-800"
                                            : project.status === "PENDING_REVIEW"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : "bg-gray-100 text-gray-800"
                                            }`}
                                    >
                                        {project.status}
                                    </span>
                                </TableCell>
                                <TableCell>{project.published ? "Yes" : "No"}</TableCell>
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
