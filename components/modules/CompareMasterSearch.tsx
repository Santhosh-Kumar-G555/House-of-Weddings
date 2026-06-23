'use client';

import React, { useState, useRef, useEffect } from 'react';
import { toggleCompare } from '@/server/actions/compare';

type Vendor = { id: string; name: string; category: string };

export default function CompareMasterSearch({ favorites, currentCount }: { favorites: Vendor[], currentCount: number }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = favorites.filter(f => 
    f.name.toLowerCase().includes(query.toLowerCase()) || 
    f.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = async (vendorId: string) => {
    if (currentCount >= 3) {
      alert("You can only compare up to 3 vendors.");
      return;
    }
    setLoadingId(vendorId);
    setQuery('');
    setIsOpen(false);
    
    const res = await toggleCompare(vendorId, '/profile/compare');
    if (res?.error) {
      alert(res.error);
    }
    setLoadingId(null);
  };

  const isMaxReached = currentCount >= 3;

  return (
    <div className="relative w-full max-w-[800px] mx-auto mb-10 z-50" ref={wrapperRef}>
      <div className="relative w-full flex items-center shadow-sm">
        <span className="material-symbols-outlined absolute left-5 text-outline-variant text-[28px]">search</span>
        <input 
          type="text"
          placeholder={isMaxReached ? "Maximum of 3 vendors reached." : "Search your favorites to add to comparison..."}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          disabled={isMaxReached || loadingId !== null}
          className="w-full bg-surface-container-lowest border-2 border-outline-variant text-on-surface py-4 pl-16 pr-6 rounded-full outline-none focus:border-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-body-md text-base"
        />
        {loadingId && (
           <span className="material-symbols-outlined animate-spin absolute right-5 text-primary text-[28px]">sync</span>
        )}
      </div>

      {isOpen && !isMaxReached && (
        <div className="absolute top-full left-0 w-full mt-2 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-modal overflow-hidden max-h-72 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-on-surface-variant font-body-sm">
              {query ? `No favorites found matching "${query}"` : "You haven't favorited any available vendors."}
            </div>
          ) : (
            <ul>
              {filtered.map(fav => (
                <li key={fav.id}>
                  <button
                    onClick={() => handleSelect(fav.id)}
                    className="w-full text-left px-6 py-4 hover:bg-surface-variant transition-colors flex items-center justify-between border-b border-outline-variant/50 last:border-0 cursor-pointer"
                  >
                    <div>
                      <p className="font-headline-sm font-semibold text-primary">{fav.name}</p>
                      <p className="font-label-sm text-on-surface-variant mt-1">{fav.category}</p>
                    </div>
                    <span className="material-symbols-outlined text-outline hover:text-primary transition-colors">add_circle</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
