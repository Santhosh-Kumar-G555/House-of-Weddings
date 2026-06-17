'use server';

import prisma from '../db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function toggleCompare(vendorId: string, pathname: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  try {
    // Check if it already exists
    const existing = await prisma.compare.findUnique({
      where: {
        userId_vendorId: {
          userId: session.user.id,
          vendorId: vendorId
        }
      }
    });

    if (existing) {
      // If it exists, remove it
      await prisma.compare.delete({ where: { id: existing.id } });
    } else {
      // If adding, first check the current count to enforce the limit
      const currentCount = await prisma.compare.count({
        where: { userId: session.user.id }
      });

      if (currentCount >= 3) {
        return { error: 'You can only compare up to 3 vendors at a time.' };
      }

      // Add to compare list
      await prisma.compare.create({
        data: { userId: session.user.id, vendorId }
      });
    }

    revalidatePath(pathname);
    revalidatePath('/profile/compare');
    return { success: true, isCompared: !existing };
  } catch (e) {
    return { error: 'Failed to update compare list.' };
  }
}

export async function removeCompareItem(compareId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  try {
    // Use deleteMany to securely ensure the user owns the record being deleted
    await prisma.compare.deleteMany({
      where: {
        id: compareId,
        userId: session.user.id
      }
    });

    revalidatePath('/profile/compare');
    return { success: true };
  } catch (e) {
    return { error: 'Failed to remove vendor from compare list.' };
  }
}
