import React from 'react';
import BackButton from '@/components/ui/BackButton';

export default function ComingSoonPage() {
  return (
    <div className="fixed inset-0 z-[9999] bg-surface w-screen h-screen flex items-center justify-center p-4">
      {/* Absolute positioned Back Button */}
      <div className="absolute top-6 left-4 lg:left-8">
        <BackButton />
      </div>

      <div className="block w-full min-w-[320px] sm:min-w-[450px] max-w-lg mx-auto text-center space-y-6">
        <span className="block material-symbols-outlined text-6xl text-primary">construction</span>
        <h1 className="text-4xl font-bold text-on-surface whitespace-nowrap">Coming Soon</h1>
        <p className="block text-on-surface-variant text-base leading-relaxed break-normal">
          We are working hard to bring you something amazing. Check back soon for updates to the House of Weddings platform!
        </p>
      </div>
    </div>
  );
}
