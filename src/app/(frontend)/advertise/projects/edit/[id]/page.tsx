
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions } from "@/modules/user/routes/auth";
import { ProjectService } from "@/modules/project/services/project.service";
import { prisma } from "@/lib/prisma";
import ProjectEditWrapper from "./ProjectEditWrapper";
import React from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export const dynamic = "force-dynamic";

export default async function ProjectEditPage(props: PageProps) {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const projectId = parseInt(params.id);
    if (isNaN(projectId)) {
        notFound();
    }

    const project = await ProjectService.getProjectById(projectId);

    if (!project) {
        notFound();
    }

    // Authorization check
    if (project.createdById !== session.user.id && (!session.user.roles.includes("ADMIN") && !session.user.roles.includes("SUPER_ADMIN"))) {
        return (
            <div className="container mx-auto py-20 text-center">
                <h1 className="text-2xl font-bold text-red-600">Unauthorized</h1>
                <p className="mt-4">You do not have permission to edit this project.</p>
            </div>
        );
    }

    // Fetch resources needed for the wizard
    const developers = await prisma.developer.findMany({
        select: { id: true, name: true, slug: true },
        orderBy: { name: "asc" },
    });

    const amenities = await prisma.projectAmenity.findMany({
        select: { id: true, name: true, icon: true },
        orderBy: { name: "asc" },
    });

    // Fetch media usages separately as they are not included in getProjectById default
    const mediaUsages = await prisma.mediaUsage.findMany({
        where: {
            entityType: "PROJECT",
            entityId: project.id,
        },
        include: {
            media: true,
        },
    });

    return (
        <div className="bg-gray-50 dark:bg-black min-h-screen">
            <ProjectEditWrapper
                project={project}
                mediaUsages={mediaUsages}
                developers={developers}
                amenities={amenities}
            />
        </div>
    );
}
