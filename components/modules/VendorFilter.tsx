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
          {filteredOptions.length > 0 ? filteredOptions.map(opt => (
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

type FilterProps = {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
  locationFilter: string;
  setLocationFilter: (val: string) => void;
  subCategoryFilter: string;
  setSubCategoryFilter: (val: string) => void;
  categories: string[];
  subCategories: string[];
  locations: string[];
  onClear: () => void;
};

export default function VendorFilter({
  searchQuery, setSearchQuery, 
  categoryFilter, setCategoryFilter, 
  locationFilter, setLocationFilter, 
  subCategoryFilter, setSubCategoryFilter,
  categories, subCategories, locations, onClear
}: FilterProps) {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. ISOLATED STATE: This strictly protects the input UI from server re-renders
  const [localSearchTerm, setLocalSearchTerm] = useState('');
  const prevSearchQuery = useRef('');

  // Sync when prop changes (e.g. initial load or parent clear)
  if (searchQuery !== prevSearchQuery.current) {
    prevSearchQuery.current = searchQuery;
    setLocalSearchTerm(searchQuery);
  }

  // 2. DEBOUNCED ROUTING: This silently updates the URL in the background
  const executeSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    // scroll: false prevents annoying page jumps during active typing
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }, 300);

  // 3. SYNCHRONOUS HANDLER: Updates UI instantly, triggers delayed search
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value); // Instantly updates the input box
    executeSearch(value);      // Fires the debounced URL update
  };

  return (
    <div className="flex flex-row overflow-x-auto items-end gap-4 mb-8 bg-surface-container-lowest p-4 rounded-lg border border-outline-variant hide-scrollbar snap-x">
      
      <div className="flex flex-col gap-2 flex-1 min-w-[250px] snap-start">
        <label htmlFor="vendor-search" className="font-label-sm font-bold text-on-surface-variant">Search for vendor</label>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[20px]">search</span>
          <input 
            id="vendor-search"
            type="text" 
            placeholder="Search by name..." 
            value={localSearchTerm} // Strictly controlled by isolated state
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 min-w-[200px] snap-start">
        <Combobox 
          label="Category"
          placeholder="Type or select..."
          value={categoryFilter}
          onChange={setCategoryFilter}
          options={categories}
        />
      </div>

      <div className="flex-1 min-w-[200px] snap-start">
        <Combobox 
          label="Service Type"
          placeholder={subCategories?.length > 0 ? "Type or select..." : "Select category first..."}
          value={subCategoryFilter}
          onChange={setSubCategoryFilter}
          options={subCategories}
          disabled={!subCategories || subCategories.length === 0}
        />
      </div>

      <div className="flex-1 min-w-[200px] snap-start">
        <Combobox 
          label="Location"
          placeholder="Type or select..."
          value={locationFilter}
          onChange={setLocationFilter}
          options={locations}
        />
      </div>

      <div className="flex-shrink-0 snap-end">
        <button 
          onClick={onClear}
          className="px-6 py-2 text-sm font-bold border border-outline-variant rounded-md hover:bg-surface-variant transition-colors whitespace-nowrap" type="button"
        >
          Clear all
        </button>
      </div>
      
    </div>
  );
}
