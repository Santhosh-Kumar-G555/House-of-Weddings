'use client';

import React, { useState } from 'react';
import LightboxGallery from './LightboxGallery';
import Image from "next/image";

export default function PublicPortfolioGrid({ images, vendorName }: { images: string[], vendorName: string }) {
  const [lightboxData, setLightboxData] = useState({ isOpen: false, index: 0 });

  const openLightbox = (index: number) => {
    if (images[index]) {
      setLightboxData({ isOpen: true, index });
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Large Feature Frame 1 */}
        <button 
          type="button"
          className="block w-full h-full lg:col-span-2 lg:row-span-2 aspect-square relative group overflow-hidden bg-surface-variant rounded border border-outline-variant cursor-pointer text-left p-0 border-none outline-none"
          onClick={() => openLightbox(0)} aria-label="View gallery image 1"
        >
          {images[0] ? (
            <Image src={images[0]} alt={`${vendorName} feature`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" fill sizes="(max-width: 1024px) 100vw, 66vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30"><span className="material-symbols-outlined text-6xl">photo_camera</span></div>
          )}
        </button>

        {/* Square Frame 2 */}
        <button 
          type="button"
          className="block w-full h-full aspect-square relative group overflow-hidden bg-surface-variant rounded border border-outline-variant cursor-pointer text-left p-0 border-none outline-none"
          onClick={() => openLightbox(1)} aria-label="View gallery image 2"
        >
          {images[1] ? (
            <Image src={images[1]} alt={`${vendorName} gallery 2`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" fill sizes="(max-width: 1024px) 50vw, 33vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30"><span className="material-symbols-outlined text-4xl">image</span></div>
          )}
        </button>

        {/* Square Frame 3 */}
        <button 
          type="button"
          className="block w-full h-full aspect-square relative group overflow-hidden bg-surface-variant rounded border border-outline-variant cursor-pointer text-left p-0 border-none outline-none"
          onClick={() => openLightbox(2)} aria-label="View gallery image 3"
        >
          {images[2] ? (
            <Image src={images[2]} alt={`${vendorName} gallery 3`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" fill sizes="(max-width: 1024px) 50vw, 33vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30"><span className="material-symbols-outlined text-4xl">image</span></div>
          )}
        </button>

        {/* Square Frame 4 */}
        <button 
          type="button"
          className="block w-full h-full aspect-square relative group overflow-hidden bg-surface-variant rounded border border-outline-variant cursor-pointer text-left p-0 border-none outline-none"
          onClick={() => openLightbox(3)} aria-label="View gallery image 4"
        >
          {images[3] ? (
            <Image src={images[3]} alt={`${vendorName} gallery 4`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" fill sizes="(max-width: 1024px) 50vw, 33vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30"><span className="material-symbols-outlined text-4xl">image</span></div>
          )}
        </button>

        {/* Wide Panorama Frame 5 */}
        <button 
          type="button"
          className="block w-full h-full lg:col-span-2 aspect-[2/1] relative group overflow-hidden bg-surface-variant rounded border border-outline-variant cursor-pointer text-left p-0 border-none outline-none"
          onClick={() => openLightbox(4)} aria-label="View gallery image 5"
        >
          {images[4] ? (
            <Image src={images[4]} alt={`${vendorName} gallery 5`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" fill sizes="(max-width: 1024px) 100vw, 66vw" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-on-surface-variant/30"><span className="material-symbols-outlined text-4xl">panorama</span></div>
          )}
        </button>
      </div>

      <LightboxGallery 
        images={images.filter(img => img)} // Only pass valid URLs to lightbox
        currentIndex={images.filter(img => img).indexOf(images[lightboxData.index]) || 0} 
        isOpen={lightboxData.isOpen} 
        onClose={() => setLightboxData({ ...lightboxData, isOpen: false })} 
        onNavigate={(newIndex) => {
          // Find the original index of this image in the main array
          const validImages = images.filter(img => img);
          const originalIndex = images.indexOf(validImages[newIndex]);
          setLightboxData({ isOpen: true, index: originalIndex });
        }} 
      />
    </>
  );
}
