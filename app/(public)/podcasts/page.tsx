import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import PodcastFilter from '@/components/modules/PodcastFilter';
import PodcastGrid from './components/PodcastGrid';
import prisma from '@/server/db/prisma';
import { getPodcastFilterOptions } from '@/server/actions/podcasts';

export const metadata = {
  title: 'Podcasts',
};

export const dynamic = 'force-dynamic';

// getInitials is now managed internally by PodcastGrid or passed as data.

export default async function PodcastsRoute({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const category = resolvedParams.category || '';
  const guest = resolvedParams.guest || '';
  const sort = resolvedParams.sort || 'Newest';

  const whereClause: any = { status: 'published' };

  if (q) {
    whereClause.title = { contains: q, mode: 'insensitive' };
  }
  
  if (guest) {
    whereClause.guestName = { contains: guest, mode: 'insensitive' };
  }
  
  if (category) {
    whereClause.OR = [
      { title: { contains: category, mode: 'insensitive' } },
      { description: { contains: category, mode: 'insensitive' } },
    ];
  }

  let orderBy: any = { createdAt: 'desc' };
  if (sort === 'Oldest') orderBy = { createdAt: 'asc' };

  const podcasts = await prisma.podcast.findMany({
    where: whereClause,
    orderBy,
  });

  const filterOptions = await getPodcastFilterOptions();

  return (
    <>
      <Toaster />
      {/* Podcast Filters & Grid */}
      <section className="py-24 px-4 md:px-8 lg:px-12 w-full max-w-container mx-auto">
        <Suspense fallback={<div className="mb-12 text-on-surface-variant font-label-lg">Loading filters...</div>}>
          <PodcastFilter options={filterOptions} />
        </Suspense>

        {/* Podcast Grid with Video Modal */}
        <PodcastGrid podcasts={podcasts as any} />
      </section>
    </>
  );
}