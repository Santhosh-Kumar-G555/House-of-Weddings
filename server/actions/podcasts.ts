'use server';

import prisma from '@/server/db/prisma';
import { revalidatePath } from 'next/cache';

export async function getPodcasts() {
  try {
    const podcasts = await prisma.podcast.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return { podcasts };
  } catch (error) {
    console.error('Error fetching podcasts:', error);
    return { error: 'Failed to fetch podcasts' };
  }
}

export async function getVendorsForPodcast() {
  try {
    const vendors = await prisma.vendor.findMany({
      select: { id: true, name: true, category: true },
      orderBy: { name: 'asc' }
    });
    return { vendors };
  } catch (error) {
    console.error('Error fetching vendors for podcast:', error);
    return { error: 'Failed to fetch vendors' };
  }
}

export async function getPodcastFilterOptions() {
  try {
    const podcastsRaw = await prisma.podcast.findMany({
      select: { category: true, guestName: true },
      where: { status: 'published' }
    });

    return {
      categories: Array.from(new Set(podcastsRaw.map(p => p.category).filter(Boolean))),
      guests: Array.from(new Set(podcastsRaw.map(p => p.guestName).filter(Boolean))),
    };
  } catch (error) {
    console.error('Error fetching filter options:', error);
    return { categories: [], guests: [] };
  }
}

export async function getPodcast(id: string) {
  try {
    const podcast = await prisma.podcast.findUnique({
      where: { id },
    });
    return { podcast };
  } catch (error) {
    console.error('Error fetching podcast:', error);
    return { error: 'Failed to fetch podcast' };
  }
}

export async function createPodcast(data: {
  title: string;
  description: string;
  category: string;
  mediaSource: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  guestId?: string;
  guestName?: string;
  duration: string;
  status: string;
}) {
  try {
    const newPodcast = await prisma.podcast.create({
      data: {
        ...data,
        host: "Sujay Naidu", // Hardcoded
      },
    });
    revalidatePath('/admin/podcasts');
    revalidatePath('/podcasts');
    return { podcast: newPodcast };
  } catch (error) {
    console.error('Error creating podcast:', error);
    return { error: 'Failed to create podcast' };
  }
}

export async function updatePodcast(id: string, data: any) {
  try {
    const updated = await prisma.podcast.update({
      where: { id },
      data: {
        ...data,
        host: "Sujay Naidu", // Hardcoded
      },
    });
    revalidatePath('/admin/podcasts');
    revalidatePath('/podcasts');
    return { podcast: updated };
  } catch (error) {
    console.error('Error updating podcast:', error);
    return { error: 'Failed to update podcast' };
  }
}

export async function deletePodcast(id: string) {
  try {
    await prisma.podcast.delete({
      where: { id },
    });
    revalidatePath('/admin/podcasts');
    revalidatePath('/podcasts');
    return { success: true };
  } catch (error) {
    console.error('Error deleting podcast:', error);
    return { error: 'Failed to delete podcast' };
  }
}
