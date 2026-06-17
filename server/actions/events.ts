'use server';

import prisma from '../db/prisma';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export async function addEvent(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  const name = formData.get('name') as string;
  const dateString = formData.get('date') as string;
  const time = formData.get('time') as string;
  const venue = formData.get('venue') as string;

  if (!name || !dateString || !venue) {
    return { error: 'Name, Date, and Venue are required.' };
  }

  try {
    await prisma.userEvent.create({
      data: {
        userId: session.user.id,
        name,
        date: new Date(dateString),
        time: time || null,
        venue
      }
    });

    revalidatePath('/profile');
    return { success: true };
  } catch {
    return { error: 'Failed to create event.' };
  }
}

export async function deleteEvent(eventId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: 'Unauthorized' };

  try {
    // Ensure the user actually owns this event before deleting
    await prisma.userEvent.delete({
      where: { 
        id: eventId,
        userId: session.user.id 
      }
    });

    revalidatePath('/profile');
    return { success: true };
  } catch {
    return { error: 'Failed to delete event.' };
  }
}
