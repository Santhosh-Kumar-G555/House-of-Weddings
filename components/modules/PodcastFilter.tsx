'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { createPortal } from 'react-dom';

// Custom Combobox for reliable type-and-select functionality
function Combobox({ value, onChange, options, placeholder, label, disabled = false }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        // Only close if the click was not on our portaled menu
        const isPortalClick = (event.target as Element).closest('.combobox-portal-menu');
        if (!isPortalClick) {
          setIsOpen(false);
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [rect, setRect] = useState<DOMRect | null>(null);

  const handleOpen = () => {
    if (wrapperRef.current) setRect(wrapperRef.current.getBoundingClientRect());
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;
    const updatePosition = () => {
      if (wrapperRef.current) setRect(wrapperRef.current.getBoundingClientRect());
    };
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen]);

  // 100% Crash-Proof Options Filtering
  const safeOptions = Array.isArray(options) ? options : [];
  const safeSearchValue = typeof value === 'string' ? value.toLowerCase().trim() : '';
  
  const filteredOptions = safeOptions.filter(opt => 
    String(opt || '').toLowerCase().includes(safeSearchValue)
  );

  return (
    <div className="flex flex-col gap-2 w-full relative" ref={wrapperRef}>
      <label className="font-label-sm font-bold text-on-surface-variant">{label}</label>
      <div className="relative">
        <input 
          type="text"
          value={value || ''}
          onChange={(e) => {
            onChange(e.target.value);
            handleOpen();
          }}
          onFocus={handleOpen}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md outline-none transition-colors ${disabled ? 'opacity-50 cursor-not-allowed bg-surface-variant' : 'focus:border-primary'}`}
          aria-label={label}
        />
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
      </div>
      
      {isOpen && typeof window !== 'undefined' && createPortal(
        <ul 
          className="combobox-portal-menu fixed z-[99999] bg-surface-container-lowest border border-outline-variant rounded-md shadow-lg max-h-60 overflow-y-auto animate-in fade-in duration-150"
          style={{
            top: rect ? rect.bottom + 4 : 0,
            left: rect ? rect.left : 0,
            width: rect ? rect.width : 'auto',
          }}
        >
          {filteredOptions.length > 0 ? filteredOptions.map((opt: string) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-surface-variant cursor-pointer text-sm text-on-surface transition-colors bg-transparent border-none outline-none"
              >
                {opt}
              </button>
            </li>
          )) : (
            <li className="px-4 py-2 text-sm text-on-surface-variant italic">No matches</li>
          )}
        </ul>,
        document.body
      )}
    </div>
  );
}

// Custom debounce hook to avoid needing an external npm package
function useDebouncedCallback(callback: (...args: any[]) => void, delay: number) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: any[]) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay]
  );
}

export default function PodcastFilter({ options }: { options?: { categories: string[], hosts: string[], durations: string[] } }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [host, setHost] = useState(searchParams.get('host') || '');
  const [duration, setDuration] = useState(searchParams.get('duration') || '');
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Newest');

  // Dynamic options from DB, with fallback to empty array
  const categories = options?.categories || [];
  const hosts = options?.hosts || [];
  const durations = options?.durations || [];
  const sortOptions = ['Newest', 'Oldest'];

  // Sync to URL
  const updateUrl = useDebouncedCallback((q: string, cat: string, h: string, dur: string, sort: string) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (cat) params.set('category', cat);
    if (h) params.set('host', h);
    if (dur) params.set('duration', dur);
    if (sort && sort !== 'Newest') params.set('sort', sort);

    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  const handleClear = () => {
    setSearchQuery('');
    setCategory('');
    setHost('');
    setDuration('');
    setSortBy('Newest');
    router.push(pathname, { scroll: false });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    updateUrl(e.target.value, category, host, duration, sortBy);
  };

  return (
    <div className="flex flex-col gap-6 mb-12">
      {/* Header text that was requested to remain */}
      <div>
        <h2 className="text-headline-lg font-headline-lg mb-2">Browse All Episodes</h2>
        <p className="text-body-md text-on-surface-variant">Over 150 episodes of strategic wedding planning advice.</p>
      </div>

      <div className="flex flex-row overflow-x-auto items-end gap-4 bg-surface-container-lowest p-4 rounded-lg border border-outline-variant hide-scrollbar snap-x">
        
        <div className="flex flex-col gap-2 flex-1 min-w-[250px] snap-start">
          <label htmlFor="podcast-search" className="font-label-sm font-bold text-on-surface-variant">Search episodes</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
            <input 
              id="podcast-search"
              type="text" 
              placeholder="Search by title..." 
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 min-w-[200px] snap-start">
          <Combobox 
            label="Episode Category"
            placeholder="Type or select..."
            value={category}
            onChange={(val: string) => { setCategory(val); updateUrl(searchQuery, val, host, duration, sortBy); }}
            options={categories}
          />
        </div>

        <div className="flex-1 min-w-[150px] snap-start">
          <Combobox 
            label="Host/Guest"
            placeholder="Type or select..."
            value={host}
            onChange={(val: string) => { setHost(val); updateUrl(searchQuery, category, val, duration, sortBy); }}
            options={hosts}
          />
        </div>

        <div className="flex-1 min-w-[150px] snap-start">
          <Combobox 
            label="Duration"
            placeholder="Type or select..."
            value={duration}
            onChange={(val: string) => { setDuration(val); updateUrl(searchQuery, category, host, val, sortBy); }}
            options={durations}
          />
        </div>

        <div className="flex-1 min-w-[150px] snap-start">
          <Combobox 
            label="Sort by"
            placeholder="Select..."
            value={sortBy}
            onChange={(val: string) => { setSortBy(val); updateUrl(searchQuery, category, host, duration, val); }}
            options={sortOptions}
          />
        </div>

        <div className="flex-shrink-0 snap-end">
          <button 
            onClick={handleClear}
            className="px-6 py-2 text-sm font-bold border border-outline-variant rounded-md hover:bg-surface-variant transition-colors whitespace-nowrap" type="button"
          >
            Clear
          </button>
        </div>
        
      </div>
    </div>
  );
}
