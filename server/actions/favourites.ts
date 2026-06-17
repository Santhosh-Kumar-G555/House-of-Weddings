'use server';

import prisma from '../db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function removeFavourite(favouriteId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  try {
    await prisma.favourite.delete({
      where: {
        id: favouriteId,
        userId: session.user.id // Ensure ownership
      }
    });

    revalidatePath('/profile/favourites');
    return { success: true };
  } catch (e) {
    return { error: 'Failed to remove favourite.' };
  }
}

export async function toggleFavourite(vendorId: string, pathname: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  try {
    const existing = await prisma.favourite.findUnique({
      where: {
        userId_vendorId: {
          userId: session.user.id,
          vendorId: vendorId
        }
      }
    });

    if (existing) {
      await prisma.favourite.delete({ where: { id: existing.id } });
    } else {
      await prisma.favourite.create({
        data: { userId: session.user.id, vendorId }
      });
    }

    revalidatePath(pathname);
    revalidatePath('/profile/favourites');
    return { success: true, isFavorited: !existing };
  } catch (e) {
    return { error: 'Failed to toggle favourite.' };
  }
}
