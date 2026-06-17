'use server';

import prisma from '../db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function removeShortlist(shortlistId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  try {
    await prisma.shortlist.delete({
      where: {
        id: shortlistId,
        userId: session.user.id // Ensure ownership
      }
    });

    revalidatePath('/profile/shortlists');
    return { success: true };
  } catch (e) {
    return { error: 'Failed to remove from shortlist.' };
  }
}

export async function toggleShortlist(vendorId: string, pathname: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  try {
    const existing = await prisma.shortlist.findUnique({
      where: {
        userId_vendorId: {
          userId: session.user.id,
          vendorId: vendorId
        }
      }
    });

    if (existing) {
      await prisma.shortlist.delete({ where: { id: existing.id } });
    } else {
      await prisma.shortlist.create({
        data: { userId: session.user.id, vendorId }
      });
    }

    revalidatePath(pathname);
    revalidatePath('/profile/shortlists');
    return { success: true, isShortlisted: !existing };
  } catch (e) {
    return { error: 'Failed to toggle shortlist.' };
  }
}
