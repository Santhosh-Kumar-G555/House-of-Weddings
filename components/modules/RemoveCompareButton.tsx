'use client';

import React, { useState } from 'react';
import { removeCompareItem } from '@/server/actions/compare';

export default function RemoveCompareButton({ compareId }: { compareId: string }) {
  const [loading, setLoading] = useState(false);

  const handleRemove = async () => {
    setLoading(true);
    await removeCompareItem(compareId);
    setLoading(false);
  };

  return (
    <button 
      onClick={handleRemove}
      disabled={loading}
      title="Remove from Compare"
      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-surface-variant/50 text-on-surface-variant hover:bg-error hover:text-error-container transition-colors disabled:opacity-50 z-10 cursor-pointer" type="button"
    >
      <span className="material-symbols-outlined text-[18px]">
        {loading ? 'hourglass_empty' : 'close'}
      </span>
    </button>
  );
}
