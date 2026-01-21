import { prisma } from "@/lib/prisma";
import { propertyTypeSchema, propertyTypeUpdateSchema } from "../validators/propertyType.validator";
import { PropertyType } from "@prisma/client";
import slugify from "slugify";

export async function getAllPropertyTypes() {
    const propertyTypes = await prisma.propertyType.findMany({
        include: {
            _count: {
                select: { properties: true },
            },
        },
        orderBy: { name: "asc" },
    });
    return propertyTypes;
}

export async function createPropertyType(data: any) {
    const validatedData = propertyTypeSchema.parse(data);

    // Auto-generate slug
    const slug = slugify(validatedData.name, { lower: true, strict: true });

    const propertyType = await prisma.propertyType.create({
        data: {
            ...validatedData,
            slug,
        },
    });
    return propertyType;
}

export async function getPropertyType(id: number) {
    const propertyType = await prisma.propertyType.findUnique({
        where: { id },
        include: {
            _count: {
                select: { properties: true },
            },
        },
    });
    return propertyType;
}

export async function updatePropertyType(id: number, data: any) {
    const validatedData = propertyTypeUpdateSchema.parse(data);

    let updateData: any = { ...validatedData };

    if (validatedData.name) {
        updateData.slug = slugify(validatedData.name, { lower: true, strict: true });
    }

    const propertyType = await prisma.propertyType.update({
        where: { id },
        data: updateData,
    });
    return propertyType;
}

export async function deletePropertyType(id: number) {
    await prisma.propertyType.delete({
        where: { id },
    });
}
