'use server';

import prisma from '@/server/db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

// Helper to verify Super Admin status
async function requireAuth() {
  const session = await auth();
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    throw new Error('Unauthorized: Super Admin access required.');
  }
}

export async function promoteToAdmin(email: string) {
  await requireAuth();
  try {
    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' }
    });
    revalidatePath('/admin/manage-admins');
    return { success: true, message: 'User promoted to Admin.' };
  } catch (error) {
    return { error: 'Failed to promote user. Ensure the email is registered.' };
  }
}

export async function revokeAdmin(userId: string) {
  await requireAuth();
  try {
    // Prevent the Super Admin from accidentally demoting themselves!
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user?.role === 'SUPER_ADMIN') return { error: 'Cannot demote the Super Admin.' };

    await prisma.user.update({
      where: { id: userId },
      data: { role: 'USER' } // Demote back to standard user
    });
    revalidatePath('/admin/manage-admins');
    return { success: true, message: 'Admin privileges revoked.' };
  } catch (error) {
    return { error: 'Failed to revoke privileges.' };
  }
}
