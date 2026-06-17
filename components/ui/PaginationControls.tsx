'use client';

import React from 'react';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function PaginationControls({ currentPage, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-outline-variant">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 border border-outline-variant rounded-md hover:bg-surface-variant transition-colors disabled:opacity-30 disabled:hover:bg-transparent" type="button"
      >
        <span className="material-symbols-outlined text-[20px] block">chevron_left</span>
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-1.5 rounded-md font-label-md transition-colors border ${
            currentPage === page
              ? 'bg-primary text-on-primary border-primary'
              : 'border-outline-variant hover:bg-surface-variant text-on-surface'
          }`} type="button"
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 border border-outline-variant rounded-md hover:bg-surface-variant transition-colors disabled:opacity-30 disabled:hover:bg-transparent" type="button"
      >
        <span className="material-symbols-outlined text-[20px] block">chevron_right</span>
      </button>
    </div>
  );
}
