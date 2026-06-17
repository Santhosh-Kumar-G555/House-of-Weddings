'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export default function Pagination({ totalPages }: { totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  if (totalPages <= 1) return null;

  // Helper to generate the exact URL for any given page
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getVisiblePages = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-1 p-4 border-t border-outline-variant bg-surface-lowest">
      {/* Previous Link */}
      {currentPage > 1 ? (
        <Link 
          href={createPageURL(currentPage - 1)}
          className="px-3 py-1 rounded border border-outline-variant text-on-surface hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-sm pt-1">chevron_left</span>
        </Link>
      ) : (
        <button disabled className="px-3 py-1 rounded border border-outline-variant text-on-surface disabled:opacity-50 disabled:cursor-not-allowed" type="button">
          <span className="material-symbols-outlined text-sm pt-1">chevron_left</span>
        </button>
      )}

      {/* Page Numbers */}
      {getVisiblePages().map((page) => {
        const isActive = page === currentPage;
        return isActive ? (
          // Active page (just a styled span, not a link)
          <span
            key={page}
            className="w-8 h-8 flex items-center justify-center rounded text-sm font-medium bg-primary text-on-primary"
          >
            {page}
          </span>
        ) : (
          // Inactive pages (clickable links)
          <Link
            key={page}
            href={createPageURL(page)}
            className="w-8 h-8 flex items-center justify-center rounded text-sm font-medium text-on-surface hover:bg-surface-variant transition-colors"
          >
            {page}
          </Link>
        );
      })}

      {/* Next Link */}
      {currentPage < totalPages ? (
        <Link 
          href={createPageURL(currentPage + 1)}
          className="px-3 py-1 rounded border border-outline-variant text-on-surface hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-sm pt-1">chevron_right</span>
        </Link>
      ) : (
        <button disabled className="px-3 py-1 rounded border border-outline-variant text-on-surface disabled:opacity-50 disabled:cursor-not-allowed" type="button">
          <span className="material-symbols-outlined text-sm pt-1">chevron_right</span>
        </button>
      )}
    </div>
  );
}
