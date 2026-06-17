import React from 'react';

export default function ShortlistsLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <div className="h-10 bg-surface-variant rounded w-48 mb-2 animate-pulse"></div>
        <div className="h-4 bg-surface-variant rounded w-64 animate-pulse"></div>
      </div>

      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-6 p-4 bg-surface-container-lowest border border-outline-variant rounded">
            {/* Avatar */}
            <div className="w-16 h-16 rounded-full bg-surface-variant animate-pulse flex-shrink-0"></div>
            {/* Info */}
            <div className="flex-1">
              <div className="h-5 bg-surface-variant rounded w-48 mb-2 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="h-4 bg-surface-variant rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-surface-variant rounded w-20 animate-pulse"></div>
              </div>
            </div>
            {/* Buttons */}
            <div className="flex gap-3">
              <div className="w-32 h-10 bg-surface-variant rounded animate-pulse"></div>
              <div className="w-16 h-10 bg-surface-variant rounded animate-pulse"></div>
              <div className="w-10 h-10 bg-surface-variant rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
