'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

type Podcast = {
  id: string;
  title: string;
  description: string;
  mediaSource: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  host: string;
  guestId?: string | null;
  guestName?: string | null;
  duration: string;
  createdAt: Date;
};

function getInitials(name: string) {
  if (!name) return 'U';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
}

export default function PodcastGrid({ podcasts }: { podcasts: Podcast[] }) {
  const [activePodcast, setActivePodcast] = useState<Podcast | null>(null);

  const getEmbedUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname === '/watch') {
          const v = urlObj.searchParams.get('v');
          if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`;
        }
      } else if (urlObj.hostname === 'youtu.be') {
        const v = urlObj.pathname.slice(1);
        return `https://www.youtube.com/embed/${v}?autoplay=1`;
      }
    } catch (e) {
      // ignore
    }
    // basic fallback
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/') + '?autoplay=1';
    }
    return url;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {podcasts.length > 0 ? (
          podcasts.map((podcast) => (
            <article 
              key={podcast.id} 
              onClick={() => setActivePodcast(podcast)}
              className="bg-surface-container-lowest border border-outline-variant p-6 rounded transition-all duration-300 hover:shadow-lg hover-card group flex flex-col h-full cursor-pointer"
            >
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
                <div className="flex items-start gap-3 mt-auto pt-4 border-t border-outline-variant">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex-shrink-0 flex items-center justify-center text-label-md font-bold text-on-secondary-container">
                    SN
                  </div>
                  <div className="flex flex-col">
                    <span className="text-label-sm text-on-surface-variant font-medium">Hosted by Sujay Naidu</span>
                    {podcast.guestName && (
                      <span className="text-body-md text-on-surface mt-0.5">
                        <span className="text-primary font-semibold">Featuring:</span>{' '}
                        {podcast.guestId ? (
                          <Link href={`/vendors/${podcast.guestId}`} className="font-bold hover:text-primary hover:underline transition-colors" onClick={(e) => e.stopPropagation()}>
                            {podcast.guestName}
                          </Link>
                        ) : (
                          <span className="font-bold">{podcast.guestName}</span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-6 border-t border-outline-variant flex justify-between items-center mt-auto">
                <span className="text-label-sm text-secondary">
                  {new Date(podcast.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
                <div className="bg-primary-container text-on-primary-container w-10 h-10 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </div>
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

      {/* Fullscreen Video Player */}
      {activePodcast && (
        <div className="fixed inset-0 z-[99999] flex flex-col bg-black animate-in fade-in duration-300">
          {/* Header Overlay */}
          <div className="flex-shrink-0 p-4 md:p-8 flex justify-between items-start bg-gradient-to-b from-black/90 to-transparent z-10 absolute top-0 left-0 w-full pointer-events-none transition-opacity">
            <div className="pointer-events-auto max-w-[75%] pt-2 pl-2">
              <h2 className="text-headline-md md:text-display-sm font-bold text-white mb-2 drop-shadow-lg">{activePodcast.title}</h2>
              <p className="text-body-lg text-white/80 drop-shadow-md">Sujay Naidu {activePodcast.guestName ? `with ${activePodcast.guestName}` : ''} • {activePodcast.duration}</p>
              <p className="text-body-sm text-white/60 mt-2 line-clamp-2 max-w-3xl">{activePodcast.description}</p>
            </div>
            <button 
              onClick={() => setActivePodcast(null)}
              className="pointer-events-auto w-14 h-14 bg-white/10 hover:bg-white/20 hover:scale-105 backdrop-blur-md text-white rounded-full flex items-center justify-center transition-all shadow-xl border border-white/10"
              aria-label="Close fullscreen"
            >
              <span className="material-symbols-outlined text-[32px]">close</span>
            </button>
          </div>
          
          {/* Player Container */}
          <div className="flex-grow w-full h-full bg-black flex items-center justify-center pt-32 pb-12 px-4 md:px-16 lg:px-24">
            <div className="w-full h-full max-w-[1600px] aspect-video relative flex items-center justify-center">
              {activePodcast.mediaSource === 'upload' || activePodcast.mediaUrl.endsWith('.mp4') ? (
                <video 
                  src={activePodcast.mediaUrl} 
                  controls 
                  autoPlay 
                  className="w-full h-full max-h-[80vh] object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black"
                />
              ) : (
                <iframe
                  src={getEmbedUrl(activePodcast.mediaUrl)}
                  title={activePodcast.title}
                  className="w-full h-full max-h-[80vh] border-0 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
