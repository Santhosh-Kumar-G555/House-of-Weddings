import React from 'react';

export default function CompareLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8 border-b border-outline-variant pb-6">
        <div className="h-10 bg-surface-variant rounded w-40 mb-2 animate-pulse"></div>
        <div className="h-4 bg-surface-variant rounded w-48 animate-pulse"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-outline-variant bg-surface-bright flex flex-col items-center">
              <div className="w-20 h-20 bg-surface-variant rounded-full mb-4 animate-pulse"></div>
              <div className="h-5 bg-surface-variant rounded w-32 mb-2 animate-pulse"></div>
              <div className="h-4 bg-surface-variant rounded w-20 mb-4 animate-pulse"></div>
              <div className="h-8 bg-surface-variant rounded w-full animate-pulse"></div>
            </div>
            {/* Rows */}
            <div className="p-6 flex flex-col gap-6">
              {[1, 2, 3, 4].map((row) => (
                <div key={row}>
                  <div className="h-3 bg-surface-variant rounded w-16 mb-2 animate-pulse"></div>
                  <div className="h-4 bg-surface-variant rounded w-24 animate-pulse"></div>
                  {row !== 4 && <div className="h-px bg-outline-variant w-full mt-6"></div>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
