'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  slug: string;
  children: React.ReactNode;
  className?: string;
};

export default function ClickableCard({ slug, children, className }: Props) {
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if the user clicked an interactive child element (button, link, form)
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('form')) {
      return;
    }
    router.push(`/vendors/${slug}`);
  };

  return (
    // react-doctor-disable-next-line prefer-tag-over-role, react-doctor/prefer-tag-over-role
    <div 
      onClick={handleCardClick}
      className={`cursor-pointer ${className || ''}`} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { const handler = handleCardClick; if (typeof handler === 'function') (handler as any)(e); } }} tabIndex={0} role="link"
    >
      {children}
    </div>
  );
}
