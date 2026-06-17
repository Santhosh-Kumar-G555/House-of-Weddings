
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import VendorCard from './VendorCard';
import PaginationControls from '../ui/PaginationControls';
import VendorFilter from './VendorFilter';
import { taxonomyMap } from '@/lib/taxonomy';

const EMPTY_CATEGORIES: any[] = [];

// react-doctor-disable-next-line prefer-useReducer, react-doctor/prefer-useReducer, react-doctor/rerender-memo-with-default-value
export default function VendorGrid({ vendors, dynamicCategories = EMPTY_CATEGORIES }: { vendors: any[], dynamicCategories?: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // 4x2 Grid layout configuration



  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Filter States (Initialized from URL)
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [subCategoryFilter, setSubCategoryFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState(searchParams.get('city') || '');

  // Sync state FROM URL changes (e.g., Navbar search, browser back button)
  // react-doctor-disable-next-line no-cascading-set-state, react-doctor/no-cascading-set-state
  React.useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('category') || '';
    const city = searchParams.get('city') || '';
    
    setSearchQuery(prev => prev !== q ? q : prev);
    setCategoryFilter(prev => prev !== cat ? cat : prev);
    setLocationFilter(prev => prev !== city ? city : prev);
  }, [searchParams]);

  // Keep URL strictly in sync with filter state
  React.useEffect(() => {
    // Prevent infinite loops caused by URLSearchParams (+ vs %20 encoding mismatches)
    const currentQ = searchParams.get('q') || '';
    const currentCat = searchParams.get('category') || '';
    const currentCity = searchParams.get('city') || '';

    // Only update if the logical state differs from the actual URL params
    if (searchQuery !== currentQ || categoryFilter !== currentCat || locationFilter !== currentCity) {
      const delayDebounceFn = setTimeout(() => {
        const params = new URLSearchParams();
        if (searchQuery) params.set('q', searchQuery);
        if (categoryFilter) params.set('category', categoryFilter);
        if (locationFilter) params.set('city', locationFilter);
        
        const newQuery = params.toString();
        window.history.replaceState(null, '', `${pathname}${newQuery ? `?${newQuery}` : ''}`);
      }, 300);

      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchQuery, categoryFilter, locationFilter, pathname, router, searchParams]);



  // Determine available sub-categories based on selected category from dynamic data
  const availableSubCategories = categoryFilter
    ? dynamicCategories.find(c => c.name.toLowerCase() === categoryFilter.toLowerCase())?.services.map((s: any) => s.name) || []
    : [];

  // 1. Brutally Simple Data Extraction
  const safeVendors = Array.isArray(vendors) ? vendors : [];
  
  // Use dynamic categories from database
  const categories = dynamicCategories.map(c => c.name);
  
  const locations = Array.from(new Set(
    safeVendors.reduce<string[]>((acc, v) => {
      const loc = String(v?.city || '').trim();
      if (loc !== '') acc.push(loc);
      return acc;
    }, [])
  ));

  // 2. Unbreakable Filter Engine
  const filteredVendors = safeVendors.filter(vendor => {
    const qSearch = (searchQuery || '').toLowerCase().trim();
    const qCat = (categoryFilter || '').toLowerCase().trim();
    const qSubCat = (subCategoryFilter || '').toLowerCase().trim();
    const qLoc = (locationFilter || '').toLowerCase().trim();

    const vName = String(vendor?.name || '').toLowerCase();
    const vCat = String(vendor?.category || '').toLowerCase().trim();
    const vDesc = String(vendor?.description || '').toLowerCase(); // Sub-category is stored here
    const vCity = String(vendor?.city || '').toLowerCase();
    const vState = String(vendor?.state || '').toLowerCase();

    const passSearch = qSearch === '' || vName.includes(qSearch);
    const passCat = qCat === '' || vCat === qCat;
    const passSubCat = qSubCat === '' || vDesc.includes(qSubCat);
    const passLoc = qLoc === '' || vCity.includes(qLoc) || vState.includes(qLoc);

    return passSearch && passCat && passSubCat && passLoc;
  });



  // Paginate the FILTERED results
  const totalPages = Math.ceil(filteredVendors.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedVendors = filteredVendors.slice(startIndex, startIndex + itemsPerPage);

  const handleClear = () => {
    setSearchQuery('');
    setCategoryFilter('');
    setSubCategoryFilter('');
    setLocationFilter('');
    setCurrentPage(1);
  };

  const endIndex = Math.min(startIndex + itemsPerPage, filteredVendors.length);

  return (
    <div className="w-full">
      {/* 1. Filter Bar */}
      <VendorFilter 
        searchQuery={searchQuery} setSearchQuery={(val) => { setSearchQuery(val); setCurrentPage(1); }}
        categoryFilter={categoryFilter} setCategoryFilter={(val) => { setCategoryFilter(val); setSubCategoryFilter(''); setCurrentPage(1); }}
        subCategoryFilter={subCategoryFilter} setSubCategoryFilter={(val) => { setSubCategoryFilter(val); setCurrentPage(1); }}
        locationFilter={locationFilter} setLocationFilter={(val) => { setLocationFilter(val); setCurrentPage(1); }}
        categories={categories} subCategories={availableSubCategories} locations={locations}
        onClear={handleClear}
      />

      {/* 2. Dynamic Results Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-outline-variant">
        <h2 className="font-headline-sm font-bold text-on-surface">All Vendors</h2>
        <span className="text-sm text-on-surface-variant">
          Showing {filteredVendors.length === 0 ? 0 : startIndex + 1}-{endIndex} of {filteredVendors.length} results
        </span>
      </div>

      {/* 3. Grid */}
      {filteredVendors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedVendors.map((vendor) => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-on-surface-variant border border-dashed border-outline-variant rounded-lg">
          <span className="material-symbols-outlined text-4xl mb-2">search_off</span>
          <p>No vendors found matching your filters.</p>
        </div>
      )}
      
      <PaginationControls 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }} 
      />
    </div>
  );
}
