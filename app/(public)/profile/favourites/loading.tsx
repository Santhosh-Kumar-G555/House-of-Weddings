import React from 'react';

export default function FavouritesLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <div className="h-10 bg-surface-variant rounded w-40 mb-2 animate-pulse"></div>
        <div className="h-4 bg-surface-variant rounded w-56 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden">
            <div className="w-full h-40 bg-surface-variant animate-pulse"></div>
            <div className="p-4">
              <div className="h-5 bg-surface-variant rounded w-3/4 mb-2 animate-pulse"></div>
              <div className="h-4 bg-surface-variant rounded w-1/2 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
