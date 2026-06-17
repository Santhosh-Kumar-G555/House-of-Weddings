import React from 'react';
import prisma from '@/server/db/prisma';
import BackButton from '@/components/ui/BackButton';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  // Check global settings
  const settings = await prisma.systemSettings.findFirst();

  if (settings?.maintenanceMode) {
    return (
      // 1. Fixed overlay, absolutely positioned above everything, with max z-index
      <div className="fixed inset-0 z-[9999] bg-surface w-screen h-screen flex items-center justify-center p-4">
        
        {/* 2. Dropped the inner flex-col. Using standard block layout with space-y and strict min-widths */}
        <div className="block w-full min-w-[320px] sm:min-w-[450px] max-w-lg mx-auto text-center space-y-6">
          
          <span className="block material-symbols-outlined text-6xl text-error">build_circle</span>
          
          {/* 3. whitespace-nowrap forces the header to stay on one line */}
          <h1 className="text-4xl font-bold text-on-surface whitespace-nowrap">
            Under Maintenance
          </h1>
          
          {/* 4. break-normal and standard block display overrides any inherited flex-shrink or break-all rules */}
          <p className="block text-on-surface-variant text-base leading-relaxed break-normal">
            House of Weddings is currently undergoing scheduled maintenance to improve your experience. We will be back online shortly.
          </p>

        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      <main className="flex-1 flex flex-col w-full">
        {/* Restored: No max-width constraints. Added -mb-6 to close the vertical gap visually */}
        <div className="w-full px-4 lg:px-8 pt-6 relative z-10 -mb-6">
          <BackButton />
        </div>
        
        {/* The Page Content */}
        {children}
      </main>
    </div>
  );
}
