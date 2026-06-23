'use client';

import React, { useState } from 'react';
import { toggleCompare } from '@/server/actions/compare';

type Vendor = { id: string; name: string; category: string };

export default function CompareDropdown({ favorites }: { favorites: Vendor[] }) {
  const [loading, setLoading] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const vendorId = e.target.value;
    if (!vendorId) return;

    setLoading(true);
    const res = await toggleCompare(vendorId, '/profile/compare');
    if (res?.error) {
      alert(res.error);
    }
    // Revalidation handles UI update, reset select dropdown if it's still mounted
    e.target.value = "";
    setLoading(false);
  };

  return (
    <div className="relative w-full h-full min-h-[400px] border-2 border-dashed border-outline-variant/60 rounded flex flex-col items-center justify-center p-8 text-center bg-surface-container-lowest transition-colors hover:bg-surface-variant/30">
      <span className="material-symbols-outlined text-4xl text-outline mb-4">person_add</span>
      <h3 className="font-headline-sm font-bold text-primary mb-2">Empty Slot</h3>
      <p className="font-body-sm text-on-surface-variant mb-8 max-w-[200px] mx-auto">
        Select a vendor from your favorites to compare side-by-side.
      </p>
      
      {favorites.length === 0 ? (
        <p className="text-sm text-secondary font-medium bg-secondary-container px-4 py-2 rounded">
          No available favorites.
        </p>
      ) : (
        <select 
          onChange={handleChange}
          disabled={loading}
          defaultValue=""
          className="w-full max-w-[240px] bg-surface-variant text-on-surface p-3 rounded border border-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer text-sm font-medium transition-colors hover:border-primary"
        >
          <option value="" disabled>Select a favorite vendor...</option>
          {favorites.map((fav) => (
            <option key={fav.id} value={fav.id}>{fav.name} ({fav.category})</option>
          ))}
        </select>
      )}
      
      {loading && (
        <div className="absolute inset-0 bg-surface-container-lowest/80 backdrop-blur-sm flex items-center justify-center rounded">
          <span className="material-symbols-outlined animate-spin text-primary text-3xl">sync</span>
        </div>
      )}
    </div>
  );
}
