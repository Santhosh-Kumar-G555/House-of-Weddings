'use client';

import React, { useState } from 'react';
import { toggleShortlist } from '@/server/actions/shortlists';
import { useRouter } from 'next/navigation';

type Props = {
  vendorId: string;
  initialIsShortlisted: boolean;
  isLoggedIn: boolean;
};

export default function ShortlistButton({ vendorId, initialIsShortlisted, isLoggedIn }: Props) {
  const [isShortlisted, setIsShortlisted] = useState(initialIsShortlisted);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleToggle = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setLoading(true);
    setIsShortlisted(!isShortlisted); 

    const res = await toggleShortlist(vendorId, window.location.pathname);

    if (res?.error) {
      setIsShortlisted(initialIsShortlisted);
    } else if (res?.success) {
      setIsShortlisted(res.isShortlisted!);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center justify-center w-12 h-12 rounded-full border transition-all ${isShortlisted ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary'}`}
      title={isShortlisted ? "Remove from Shortlist" : "Add to Shortlist"} type="button"
    >
      <span 
        className={`material-symbols-outlined transition-colors text-[24px] ${isShortlisted ? 'text-primary' : 'text-on-surface-variant'}`}
        style={isShortlisted ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}
      >
        bookmark
      </span>
    </button>
  );
}
