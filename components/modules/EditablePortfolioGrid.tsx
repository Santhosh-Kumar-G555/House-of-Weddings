'use client';

import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { useRouter } from 'next/navigation';
import { updateVendorProfile } from '@/server/actions/vendor';
import LightboxGallery from './LightboxGallery';
import Image from "next/image";

const ImageSlot = ({ index, className, images, openLightbox, handleImageUpload }: { 
  index: number; 
  className: string; 
  images: string[];
  openLightbox: (index: number) => void;
  handleImageUpload: (url: string, index: number) => Promise<void>;
}) => {
  const imageUrl = images && images[index];
  return (
    <div className={`relative bg-surface-variant rounded-lg overflow-hidden group flex items-center justify-center ${className}`}>
      {imageUrl ? (
        <>
          <Image 
            src={imageUrl} 
            alt="Portfolio" 
            className="w-full h-full object-cover cursor-pointer" 
            onClick={() => openLightbox(index)} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { const handler = () => openLightbox(index); if (typeof handler === 'function') (handler as any)(e); } }} tabIndex={0}
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center pointer-events-none">
            <div className="scale-75 origin-center pointer-events-auto">
                <ImageUploader onUploadSuccess={(url) => handleImageUpload(url, index)} />
            </div>
            <p className="text-white text-xs mt-2 drop-shadow-md">Click image to enlarge</p>
          </div>
        </>
      ) : (
        <div className="text-center opacity-50 hover:opacity-100 transition-opacity">
          <ImageUploader onUploadSuccess={(url) => handleImageUpload(url, index)} />
        </div>
      )}
    </div>
  );
};

export default function EditablePortfolioGrid({ images, vendorId }: { images: string[], vendorId: string }) {
  const router = useRouter();
  const [lightboxData, setLightboxData] = useState({ isOpen: false, index: 0 });

  const openLightbox = (index: number) => {
    if (images && images[index]) {
      setLightboxData({ isOpen: true, index });
    }
  };

  const handleImageUpload = async (url: string, index: number) => {
    // Clone current images, or start with array of 5
    const newImages = [...(images || [])];
    // Ensure array is long enough
    while (newImages.length <= index) {
      newImages.push('');
    }
    newImages[index] = url;
    
    await updateVendorProfile({ portfolioImages: newImages }, vendorId);
    router.refresh();
  };


  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 h-full flex flex-col">
      <h3 className="font-headline-sm font-bold mb-6 text-on-surface">Portfolio</h3>
      
      <div className="grid grid-cols-3 gap-4 flex-1 min-h-[600px]">
        {/* Large Left Image */}
        <ImageSlot index={0} className="col-span-2 row-span-2 aspect-[4/3]" images={images} openLightbox={openLightbox} handleImageUpload={handleImageUpload} />
        {/* Top Right */}
        <ImageSlot index={1} className="col-span-1 row-span-1 aspect-square" images={images} openLightbox={openLightbox} handleImageUpload={handleImageUpload} />
        {/* Middle Right */}
        <ImageSlot index={2} className="col-span-1 row-span-1 aspect-[4/3]" images={images} openLightbox={openLightbox} handleImageUpload={handleImageUpload} />
        {/* Bottom Left */}
        <ImageSlot index={3} className="col-span-1 row-span-1 aspect-[4/3]" images={images} openLightbox={openLightbox} handleImageUpload={handleImageUpload} />
        {/* Bottom Right Span 2 */}
        <ImageSlot index={4} className="col-span-2 row-span-1" images={images} openLightbox={openLightbox} handleImageUpload={handleImageUpload} />
      </div>

      <LightboxGallery 
        images={images ? images.filter(img => img) : []} 
        currentIndex={images ? images.filter(img => img).indexOf(images[lightboxData.index]) || 0 : 0} 
        isOpen={lightboxData.isOpen} 
        onClose={() => setLightboxData({ ...lightboxData, isOpen: false })} 
        onNavigate={(newIndex) => {
          const validImages = images.filter(img => img);
          const originalIndex = images.indexOf(validImages[newIndex]);
          setLightboxData({ isOpen: true, index: originalIndex });
        }} 
      />
    </div>
  );
}
