import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto p-6 md:p-12 w-full animate-in fade-in duration-300">

      {/* Header Skeleton */}
      <div className="mb-10">
        <div className="h-10 bg-surface-variant rounded w-64 mb-4 animate-pulse"></div>
        <div className="h-4 bg-surface-variant rounded w-32 animate-pulse"></div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden flex flex-col">

            {/* Image Skeleton */}
            <div className="w-full h-48 bg-surface-variant animate-pulse"></div>

            {/* Content Skeleton */}
            <div className="p-4 flex flex-col flex-1 gap-3">
              <div className="flex justify-between items-start">
                 <div className="h-5 bg-surface-variant rounded w-3/4 animate-pulse"></div>
                 <div className="h-5 bg-surface-variant rounded w-8 animate-pulse rounded-full"></div>
              </div>
              <div className="h-3 bg-surface-variant rounded w-1/2 animate-pulse mt-1"></div>

              <div className="mt-auto pt-4 flex justify-between items-center">
                <div className="h-4 bg-surface-variant rounded w-16 animate-pulse"></div>
                <div className="h-6 bg-surface-variant rounded w-20 animate-pulse"></div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
