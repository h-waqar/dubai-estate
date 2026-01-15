
import React from "react";
import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/modules/user/routes/auth";
import { prisma } from "@/lib/prisma";
import AdvertiseWizard from "@/modules/property/components/advertise/AdvertiseWizard";
import { serializeDecimals } from "@/lib/serializeDecimal";

interface EditPropertyPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditPropertyPage(props: EditPropertyPageProps) {
    const params = await props.params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const propertyId = parseInt(params.id);

    if (isNaN(propertyId)) {
        notFound();
    }

    // Fetch Property Data with relations
    const property = await prisma.property.findUnique({
        where: { id: propertyId },
        include: {
            propertyType: true,
            features: {
                include: {
                    feature: true
                }
            },
            // Note: Images/MediaUsage fetching might need to be adjusted if not included directly
        }
    });

    if (!property) {
        notFound();
    }

    // Check ownership
    const isAdmin = session.user.roles.includes("ADMIN") || session.user.roles.includes("MANAGER");
    if (property.createdById !== (session.user.id as number) && !isAdmin) {
        return (
            <div className="p-10 text-center">
                <h1 className="text-2xl font-bold text-red-500">Unauthorized</h1>
                <p className="text-muted-foreground mt-2">You do not have permission to edit this property.</p>
            </div>
        );
    }

    // Fetch Media manually if needed, or if relation is set up correctly in schema.
    // Schema has mediaUsages.
    const mediaUsages = await prisma.mediaUsage.findMany({
        where: {
            entityType: "PROPERTY",
            entityId: propertyId
        },
        include: {
            media: true
        }
    });

    // Combine data
    const propertyData = {
        ...property,
        mediaUsages
    };

    const serializedData = serializeDecimals(propertyData);

    // Fetch static data for wizard
    const propertyTypes = await prisma.propertyType.findMany({
        select: { id: true, name: true, slug: true },
    });

    const features = await prisma.feature.findMany({
        select: { id: true, name: true, slug: true },
    });

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-black/50 py-10">
            <div className="container mx-auto px-4">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold tracking-tight">Edit Property</h1>
                    <p className="text-muted-foreground mt-2">Update your listing details. Changes will require re-approval.</p>
                </div>

                <AdvertiseWizard
                    propertyTypes={propertyTypes}
                    serverData={{ features }}
                    isEditMode={true}
                    initialData={serializedData}
                    propertyId={propertyId}
                />
            </div>
        </div>
    );
}
