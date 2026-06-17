'use server';

import prisma from '../db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

async function requireAuth() {
  const session = await auth();
  const userRole = (session?.user as any)?.role;
  // Allow if they are either an ADMIN or a SUPER_ADMIN
  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized');
  }
}

// --- SYSTEM SETTINGS ---
export async function updateSystemSettings(formData: FormData) {
  await requireAuth();
  const data = {
    maintenanceMode: formData.get('maintenanceMode') === 'on',
    commissionRate: parseFloat(formData.get('commissionRate') as string) || 10.0,
    seoTitle: formData.get('seoTitle') as string,
    seoDescription: formData.get('seoDescription') as string,
  };

  try {
    // Upsert ensures we only ever have ONE settings record
    const existing = await prisma.systemSettings.findFirst();
    if (existing) {
      await prisma.systemSettings.update({ where: { id: existing.id }, data });
    } else {
      await prisma.systemSettings.create({ data });
    }
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to update settings.' };
  }
}

// Helper function to generate slugs
function generateSlug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

// --- CATEGORY MANAGEMENT ---
export async function upsertCategory(formData: FormData, categoryId?: string) {
  await requireAuth();
  const name = formData.get('name') as string;
  const slug = generateSlug(name);
  const isVisible = formData.get('isVisible') === 'on';

  try {
    // DUPLICATE PREVENTION
    if (!categoryId || categoryId === 'new') {
      const existing = await prisma.category.findUnique({ where: { slug } });
      if (existing) return { error: `The category "${name}" already exists.` };
      await prisma.category.create({ data: { name, slug, isVisible } });
    } else {
      await prisma.category.update({ where: { id: categoryId }, data: { name, slug, isVisible } });
    }
    revalidatePath('/admin/settings');
    return { success: true, message: 'Category saved.' };
  } catch (error) {
    return { error: 'Failed to save category.' };
  }
}

export async function deleteCategory(categoryId: string) {
  await requireAuth();
  try {
    await prisma.category.delete({ where: { id: categoryId } });
    revalidatePath('/admin/settings');
  } catch (error) {
    return { error: 'Failed to delete category.' };
  }
}

// 2. CREATE NEW ACTION: Sub-Categories
export async function upsertServiceType(formData: FormData) {
  await requireAuth();
  const name = formData.get('name') as string;
  const categoryId = formData.get('categoryId') as string;
  const slug = generateSlug(name);
  const isVisible = formData.get('isVisible') === 'on';

  try {
    // DUPLICATE PREVENTION: Check if this exact sub-category exists IN THIS parent category
    const existing = await prisma.serviceType.findFirst({ 
      where: { categoryId, slug } 
    });
    if (existing) return { error: `The sub-category "${name}" already exists here.` };

    await prisma.serviceType.create({ data: { name, slug, categoryId, isVisible } });
    
    revalidatePath('/admin/settings');
    return { success: true, message: 'Sub-category added.' };
  } catch (error) {
    return { error: 'Failed to save sub-category.' };
  }
}

// 3. CREATE NEW ACTION: Delete Sub-Category
export async function deleteServiceType(serviceId: string) {
  await requireAuth();
  try {
    await prisma.serviceType.delete({ where: { id: serviceId } });
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete sub-category.' };
  }
}
