'use server';

import prisma from '../db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  const fullName = formData.get('fullName') as string;
  const phone = formData.get('phone') as string;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { 
        fullName: fullName || null,
        phone: phone || null 
      }
    });

    revalidatePath('/profile');
    return { success: true };
  } catch (e) {
    return { error: 'Failed to update profile.' };
  }
}

export async function updateProfileImage(imageUrl: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl } 
    });

    // Refresh the profile pages to show the new image instantly
    revalidatePath('/profile');
    revalidatePath('/'); 

    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to update profile photo in database.' };
  }
}
