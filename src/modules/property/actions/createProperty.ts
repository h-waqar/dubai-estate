'use server';

import { revalidatePath } from 'next/cache';
import { createPropertyValidator } from '../validators/createProperty.validator';
import * as propertyService from '../services/service';
import { authOptions } from '@/modules/user/routes/auth';
import { getServerSession } from 'next-auth';

export async function createPropertyAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || (session.user.role !== 'ADMIN' && session.user.role !== 'MANAGER')) {
    return { success: false, error: "Unauthorized" };
  }

  const data = Object.fromEntries(formData);
  const validation = createPropertyValidator.safeParse(data);

  if (!validation.success) {
    return { success: false, error: validation.error.flatten().fieldErrors };
  }

  try {
    const property = await propertyService.createProperty(validation.data, session.user.id);
    revalidatePath('/properties');
    return { success: true, property };
  } catch (error) {
    return { success: false, error: "Failed to create property." };
  }
}
