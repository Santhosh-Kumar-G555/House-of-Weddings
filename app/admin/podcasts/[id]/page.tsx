import React from 'react';
import { getPodcast } from '@/server/actions/podcasts';
import { notFound } from 'next/navigation';
import EditPodcastForm from './EditPodcastForm';

export default async function EditPodcastPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const { podcast, error } = await getPodcast(resolvedParams.id);

  if (error || !podcast) {
    notFound();
  }

  return <EditPodcastForm podcast={podcast} />;
}
