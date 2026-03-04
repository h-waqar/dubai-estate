"use server";

import { ProjectService } from "@/modules/project/services/project.service";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle, XCircle } from "lucide-react";
import { revalidatePath } from "next/cache";

async function approveProjectAction(formData: FormData) {
    "use server";
    const projectId = Number(formData.get("projectId"));
    const adminId = 1; // TODO: Get from session
    await ProjectService.approveProject(projectId, adminId);
    revalidatePath("/admin/project-approvals");
}

async function declineProjectAction(formData: FormData) {
    "use server";
    const projectId = Number(formData.get("projectId"));
    const adminId = 1; // TODO: Get from session
    await ProjectService.declineProject(projectId, adminId);
    revalidatePath("/admin/project-approvals");
}

export default async function ProjectApprovalsPage() {
    const pendingProjects = await ProjectService.getPendingProjects();

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Project Approvals</h1>
                <Link href="/admin/projects">
                    <Button variant="outline">View All Projects</Button>
                </Link>
            </div>

            {pendingProjects.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <p className="text-gray-500">No projects pending approval</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {pendingProjects.map((project) => (
                        <div
                            key={project.id}
                            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow space-y-4"
                        >
                            <div>
                                <h2 className="text-xl font-semibold">{project.name}</h2>
                                <p className="text-sm text-gray-500">
                                Type: {project.projectType} | Developer: {project.developer?.name || "Unknown"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Submitted by: {project.createdBy.name} ({project.createdBy.email})
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Location:</strong> {project.location}
                                </div>
                                <div>
                                    <strong>Price From:</strong> AED {project.priceFrom?.toString() || "N/A"}
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <form action={approveProjectAction}>
                                    <input type="hidden" name="projectId" value={project.id} />
                                    <Button type="submit" variant="default" className="bg-green-600 hover:bg-green-700">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Approve
                                    </Button>
                                </form>
                                <form action={declineProjectAction}>
                                    <input type="hidden" name="projectId" value={project.id} />
                                    <Button type="submit" variant="destructive">
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Decline
                                    </Button>
                                </form>
                                <Link href={`/projects/${project.slug}`}>
                                    <Button variant="outline">Preview</Button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
