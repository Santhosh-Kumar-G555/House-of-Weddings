'use client';

import React, { useState } from 'react';
import FallbackImage from '@/components/ui/FallbackImage';
import LightboxGallery from '@/components/modules/LightboxGallery';

type Props = {
  src: string;
  alt: string;
  fallbackSrc: string;
};

export default function ProfileImagePopup({ src, alt, fallbackSrc }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button type="button" className="block w-full h-full cursor-pointer relative group p-0 border-none outline-none" onClick={() => setIsOpen(true)} aria-label="Open full screen image">
        <FallbackImage 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          fallbackSrc={fallbackSrc}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
          <span className="material-symbols-outlined text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md">zoom_in</span>
        </div>
      </button>
      
      <LightboxGallery 
        images={[src && src !== '' ? src : fallbackSrc]} 
        currentIndex={0} 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
        onNavigate={() => {}} 
      />
    </>
  );
}
