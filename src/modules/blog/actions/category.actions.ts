import { 
  createCategory as createCategoryService,
  deleteCategory as deleteCategoryService,
  getAllCategories as getAllCategoriesService,
  getCategory as getCategoryService,
  updateCategory as updateCategoryService
} from "@/modules/blog/services/category.service";

export async function getAllCategories() {
    return await getAllCategoriesService();
}

export async function createCategory(request: Request) {
    const body = await request.json();
    return await createCategoryService(body);
}

export async function getCategory(id: string) {
    return await getCategoryService(parseInt(id));
}

export async function updateCategory(request: Request, id: string) {
    const body = await request.json();
    return await updateCategoryService(parseInt(id), body);
}

export async function deleteCategory(id: string) {
    return await deleteCategoryService(parseInt(id));
}
