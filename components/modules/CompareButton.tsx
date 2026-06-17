'use client';

import React, { useState } from 'react';
import { toggleCompare } from '@/server/actions/compare';
import { useRouter } from 'next/navigation';

type Props = {
  vendorId: string;
  initialIsCompared: boolean;
  isLoggedIn: boolean;
};

export default function CompareButton({ vendorId, initialIsCompared, isLoggedIn }: Props) {
  const [isCompared, setIsCompared] = useState(initialIsCompared);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleToggle = async () => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    setLoading(true);
    // Optimistic update
    setIsCompared(!isCompared); 

    const res = await toggleCompare(vendorId, window.location.pathname);

    if (res.error) {
      // Revert on error and show the limit message
      setIsCompared(initialIsCompared);
      alert(res.error);
    } else if (res.success) {
      setIsCompared(res.isCompared);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleToggle}
      disabled={loading}
      className={`flex items-center justify-center w-12 h-12 rounded-full border transition-all ${isCompared ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:border-primary hover:text-primary cursor-pointer'}`}
      title={isCompared ? "Remove from Compare" : "Add to Compare"} type="button"
    >
      <span className="material-symbols-outlined text-[24px]">
        {isCompared ? 'difference' : 'compare_arrows'}
      </span>
    </button>
  );
}
