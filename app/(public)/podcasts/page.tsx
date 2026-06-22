import React, { Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PodcastFilter from '@/components/modules/PodcastFilter';
import prisma from '@/server/db/prisma';
import { getPodcastFilterOptions } from '@/server/actions/podcasts';

export const metadata = {
  title: 'Podcasts',
};

export const dynamic = 'force-dynamic';

function getInitials(name: string) {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export default async function PodcastsRoute({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const q = resolvedParams.q || '';
  const category = resolvedParams.category || '';
  const host = resolvedParams.host || '';
  const duration = resolvedParams.duration || '';
  const sort = resolvedParams.sort || 'Newest';

  const whereClause: any = { status: 'published' };

  if (q) {
    whereClause.title = { contains: q, mode: 'insensitive' };
  }
  
  if (host) {
    whereClause.host = { contains: host, mode: 'insensitive' };
  }
  
  if (duration) {
    whereClause.duration = { contains: duration, mode: 'insensitive' };
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
      {/* Podcast Filters & Grid */}
      <section className="py-24 px-4 md:px-8 lg:px-12 w-full max-w-container mx-auto">
        <Suspense fallback={<div className="mb-12 text-on-surface-variant font-label-lg">Loading filters...</div>}>
          <PodcastFilter options={filterOptions} />
        </Suspense>

        {/* Podcast Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {podcasts.length > 0 ? (
            podcasts.map((podcast) => (
              <article key={podcast.id} className="bg-surface-container-lowest border border-outline-variant p-6 rounded transition-all duration-300 hover:shadow-lg hover-card group flex flex-col h-full">
                <div className="relative overflow-hidden mb-6 aspect-video">
                  <img
                    className="w-full h-full object-cover rounded group-hover:scale-105 transition-transform duration-500"
                    alt={podcast.title}
                    src={podcast.thumbnailUrl || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80"}
                  />
                  <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded text-label-sm font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[16px]">schedule</span> {podcast.duration}
                  </div>
                </div>
                <div className="mb-4 flex-grow">
                  <span className="text-label-sm text-primary font-bold tracking-wider mb-2 block">EPISODE</span>
                  <h3 className="text-headline-md font-headline-md mb-2 leading-tight">{podcast.title}</h3>
                  <p className="text-body-md text-on-surface-variant line-clamp-2 mb-4">{podcast.description}</p>
                  <div className="flex items-center gap-3 mt-auto">
                    <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-label-sm font-bold text-on-secondary-container">
                      {getInitials(podcast.host)}
                    </div>
                    <span className="text-label-md font-medium text-on-surface">Hosted by {podcast.host || 'Unknown'}</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-outline-variant flex justify-between items-center mt-auto">
                  <span className="text-label-sm text-secondary">
                    {new Date(podcast.createdAt).toLocaleDateString()}
                  </span>
                  <Link href={podcast.mediaUrl} target="_blank" rel="noopener noreferrer" className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 py-24 text-center border-2 border-dashed border-outline-variant rounded-xl bg-surface-container-lowest px-4">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4">podcasts</span>
              <h3 className="text-headline-sm font-bold text-on-surface mb-2">Check back soon for our first episode!</h3>
              <p className="text-on-surface-variant max-w-[480px] mx-auto">We are currently in the studio recording our premiere season of wedding insights and advice.</p>
            </div>
          )}
        </div>

        {/* Pagination (Static Placeholder) */}
        {podcasts.length > 0 && (
          <nav className="mt-20 flex justify-center items-center gap-2">
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high transition-colors disabled:opacity-50" disabled>
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant rounded bg-primary text-white text-label-md font-semibold">1</button>
            <button className="px-4 h-10 flex items-center justify-center border border-outline-variant rounded hover:border-on-surface text-label-md font-semibold transition-colors gap-1 disabled:opacity-50" disabled>
              Next <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </nav>
        )}
      </section>
    </>
  );
}