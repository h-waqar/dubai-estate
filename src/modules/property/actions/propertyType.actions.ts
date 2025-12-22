import {
    createPropertyType as createPropertyTypeService,
    deletePropertyType as deletePropertyTypeService,
    getAllPropertyTypes as getAllPropertyTypesService,
    getPropertyType as getPropertyTypeService,
    updatePropertyType as updatePropertyTypeService
} from "../services/propertyType.service";

export async function getAllPropertyTypes() {
    return await getAllPropertyTypesService();
}

export async function createPropertyType(request: Request) {
    const body = await request.json();
    return await createPropertyTypeService(body);
}

export async function getPropertyType(id: string) {
    return await getPropertyTypeService(parseInt(id));
}

export async function updatePropertyType(request: Request, id: string) {
    const body = await request.json();
    return await updatePropertyTypeService(parseInt(id), body);
}

export async function deletePropertyType(id: string) {
    return await deletePropertyTypeService(parseInt(id));
}
