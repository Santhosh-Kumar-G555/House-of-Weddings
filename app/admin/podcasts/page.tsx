import React from 'react';
import { getPodcasts, deletePodcast } from '@/server/actions/podcasts';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPodcastsPage() {
  const { podcasts, error } = await getPodcasts();

  if (error) {
    return <div className="text-error p-8">Failed to load podcasts.</div>;
  }

  return (
    <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 space-y-8 pb-24">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Podcast Management</h1>
          <p className="text-on-surface-variant text-sm md:text-base">
            Upload videos or link external episodes.
          </p>
        </div>
        <Link href="/admin/podcasts/new" className="bg-primary text-on-primary px-4 py-2 rounded-md font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-[20px]">add</span> Add Podcast
        </Link>
      </div>

      {/* Podcast Data Table */}
      <div className="bg-surface-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-variant/30 text-xs uppercase tracking-wider text-on-surface-variant">
                <th className="px-6 py-4 font-bold">Title</th>
                <th className="px-6 py-4 font-bold">Host</th>
                <th className="px-6 py-4 font-bold">Duration</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold">Date Added</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {podcasts?.map((podcast) => (
                <tr key={podcast.id} className="hover:bg-surface-variant/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-on-surface">
                    {podcast.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{podcast.host}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{podcast.duration}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${podcast.status === 'published' ? 'bg-success/20 text-success' : 'bg-surface-variant text-on-surface-variant'}`}>
                      {podcast.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {new Date(podcast.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                    <Link href={`/admin/podcasts/${podcast.id}`} className="text-primary text-sm font-bold hover:underline">
                      Edit
                    </Link>
                    <form action={async () => {
                      'use server';
                      await deletePodcast(podcast.id);
                    }}>
                      <button type="submit" className="text-error text-sm font-bold hover:underline">
                        Delete
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
              {(!podcasts || podcasts.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">podcasts</span>
                    <p>No podcasts found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
