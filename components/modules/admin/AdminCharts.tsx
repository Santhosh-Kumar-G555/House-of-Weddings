'use client';

import dynamic from 'next/dynamic';

export const EngagementLineChart = dynamic(
  () => import('./AdminChartsImpl').then((mod) => mod.EngagementLineChart),
  { ssr: false }
);

export const MiniBarChart = dynamic(
  () => import('./AdminChartsImpl').then((mod) => mod.MiniBarChart),
  { ssr: false }
);
