'use client';

import React, { useState } from 'react';
import { toggleFavourite } from '@/server/actions/favourites';
import { useRouter } from 'next/navigation';

type Props = {
  vendorId: string;
  initialIsFavorited: boolean;
  isLoggedIn: boolean;
};

export default function FavouriteButton({ vendorId, initialIsFavorited, isLoggedIn }: Props) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleToggle = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setLoading(true);
    // Optimistic UI update
    setIsFavorited(!isFavorited); 
    
    const res = await toggleFavourite(vendorId, window.location.pathname);
    
    if (res?.error) {
      // Revert on failure
      setIsFavorited(initialIsFavorited);
    } else if (res?.success) {
      // Sync with server source of truth
      setIsFavorited(res.isFavorited!);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center justify-center w-12 h-12 rounded-full border transition-all ${isFavorited ? 'border-error bg-error-container text-error' : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-error hover:text-error'}`}
      title={isFavorited ? "Remove from Favourites" : "Add to Favourites"} type="button"
    >
      <span 
        className={`material-symbols-outlined transition-colors text-[24px] ${isFavorited ? 'text-error' : 'text-on-surface-variant'}`}
        style={isFavorited ? { fontVariationSettings: "'FILL' 1" } : { fontVariationSettings: "'FILL' 0" }}
      >
        favorite
      </span>
    </button>
  );
}
