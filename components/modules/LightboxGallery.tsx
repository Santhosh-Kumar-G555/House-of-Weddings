'use client';
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from "next/image";

type Props = {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (newIndex: number) => void;
};

export default function LightboxGallery({ images, currentIndex, isOpen, onClose, onNavigate }: Props) {
  const [mounted, setMounted] = useState(false);

  // react-doctor-disable-next-line rendering-hydration-no-flicker, react-doctor/rendering-hydration-no-flicker
  useEffect(() => {
    // react-doctor-disable-next-line no-initialize-state, react-doctor/no-initialize-state
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!mounted || !isOpen || images.length === 0 || !images[currentIndex]) return null;

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex + 1) % images.length);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNavigate((currentIndex - 1 + images.length) % images.length);
  };

  return createPortal(
    // react-doctor-disable-next-line prefer-tag-over-role, react-doctor/prefer-tag-over-role
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 p-4" onClick={onClose} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { const handler = onClose; if (typeof handler === 'function') (handler as any)(e); } }} tabIndex={0} role="button" aria-label="Close Gallery">
      {/* Close Button */}
      <button onClick={onClose} className="absolute top-6 right-6 text-white hover:text-gray-300 z-50 cursor-pointer flex items-center gap-2 bg-black/50 px-4 py-2 rounded-full border border-white/20 shadow-lg backdrop-blur-sm transition-colors hover:bg-black/70" type="button">
        <span className="font-label-md font-bold uppercase tracking-wider text-sm">Go Back</span>
        <span className="material-symbols-outlined text-2xl">close</span>
      </button>

      {/* Prev Button */}
      {images.length > 1 && (
        <button onClick={handlePrev} className="absolute left-6 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full cursor-pointer" type="button">
          <span className="material-symbols-outlined text-4xl">chevron_left</span>
        </button>
      )}

      {/* Main Image */}
      <Image 
        src={images[currentIndex]} 
        alt={`Gallery image ${currentIndex + 1}`} 
        className="max-w-full max-h-[90vh] object-contain select-none animate-in fade-in zoom-in-95 duration-200" 
        onClick={(e) => e.stopPropagation()} 
        fill 
        sizes="100vw"
        priority
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { const handler = (e: any) => e.stopPropagation(); if (typeof handler === 'function') (handler as any)(e); } }} 
        tabIndex={0} 
      />

      {/* Next Button */}
      {images.length > 1 && (
        <button onClick={handleNext} className="absolute right-6 text-white hover:text-gray-300 z-50 p-2 bg-black/50 rounded-full cursor-pointer" type="button">
          <span className="material-symbols-outlined text-4xl">chevron_right</span>
        </button>
      )}

      {/* Counter */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white font-label-md bg-black/50 px-4 py-2 rounded-full pointer-events-none">
        {currentIndex + 1} / {images.length}
      </div>
    </div>,
    document.body
  );
}
