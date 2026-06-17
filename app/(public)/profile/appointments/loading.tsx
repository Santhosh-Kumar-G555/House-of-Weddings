import React from 'react';

export default function AppointmentsLoading() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <div className="h-10 bg-surface-variant rounded w-56 mb-2 animate-pulse"></div>
        <div className="h-4 bg-surface-variant rounded w-72 animate-pulse"></div>
      </div>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-outline-variant mb-6 pb-2">
        <div className="h-4 bg-surface-variant rounded w-24 animate-pulse"></div>
        <div className="h-4 bg-surface-variant rounded w-20 animate-pulse"></div>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="p-6 bg-surface-container-lowest border border-outline-variant rounded">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="h-5 bg-surface-variant rounded w-48 mb-2 animate-pulse"></div>
                <div className="h-4 bg-surface-variant rounded w-24 animate-pulse"></div>
              </div>
              <div className="h-6 bg-surface-variant rounded w-16 animate-pulse"></div>
            </div>
            
            {/* Date Box */}
            <div className="border border-outline-variant rounded p-4 mb-4">
              <div className="h-4 bg-surface-variant rounded w-40 mb-3 animate-pulse"></div>
              <div className="h-4 bg-surface-variant rounded w-20 animate-pulse"></div>
            </div>

            {/* Message */}
            <div className="h-3 bg-surface-variant rounded w-24 mb-2 animate-pulse"></div>
            <div className="h-4 bg-surface-variant rounded w-full mb-6 animate-pulse"></div>
            
            <div className="h-4 bg-surface-variant rounded w-32 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
