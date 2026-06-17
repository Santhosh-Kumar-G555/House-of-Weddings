'use client';

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import EditableDetailsCard from './EditableDetailsCard';
import EditableProfileCard from './EditableProfileCard';
import EditableExperienceCard from './EditableExperienceCard';
import EditablePortfolioGrid from './EditablePortfolioGrid';
import { getSignature } from '@/server/actions/cloudinary';
import { updateVendorProfile, updateVendorCoverImage } from '@/server/actions/vendor';
import Image from "next/image";

const EMPTY_CATEGORIES: any[] = [];

export default function EditableVendorProfile({ vendorData, dynamicCategories = EMPTY_CATEGORIES }: { vendorData: any, dynamicCategories?: any[] }) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    try {
      const signatureData = await getSignature();
      if (signatureData.error || !signatureData.signature) {
        throw new Error(signatureData.error || 'Failed to get upload signature');
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signatureData.apiKey!);
      formData.append('timestamp', signatureData.timestamp!.toString());
      formData.append('signature', signatureData.signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        { method: 'POST', body: formData }
      );
      const data = await response.json();

      if (data.secure_url) {
        const res = await updateVendorCoverImage(vendorData.id, data.secure_url);
        if (res?.error) {
          alert(`Save Failed: ${res.error}`);
        } else {
          router.refresh();
        }
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Failed to upload cover image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploadingCover(false);
      e.target.value = '';
    }
  };
  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-500">
      {/* Cover Image Upload Section */}
      <div className="w-full mb-8">
        <h2 className="font-headline-sm font-bold text-on-surface mb-4">Cover Image</h2>
        <div className="relative w-full h-48 md:h-64 bg-surface-variant rounded-xl border-2 border-dashed border-outline-variant overflow-hidden group flex items-center justify-center">
          {/* Hidden File Input */}
          <input 
            type="file" 
            ref={coverInputRef} 
            onChange={handleCoverUpload} 
            accept="image/*" 
            className="hidden" 
            aria-label="Upload Cover Image"
          />

          {isUploadingCover ? (
            <div className="flex flex-col items-center z-10">
              <span className="material-symbols-outlined animate-spin text-4xl text-primary mb-2">progress_activity</span>
              <p className="text-sm font-bold text-on-surface-variant">Uploading...</p>
            </div>
          ) : vendorData.coverImage ? (
            <>
              <Image src={vendorData.coverImage} alt="Cover" className="w-full h-full object-cover" fill sizes="100vw" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  type="button"
                  onClick={() => coverInputRef.current?.click()}
                  className="bg-surface-lowest text-on-surface px-4 py-2 rounded-md font-bold shadow-sm cursor-pointer"
                >
                  Change Cover Image
                </button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">landscape</span>
              <p className="text-sm text-on-surface-variant mb-4">Recommended size: 1200 x 400px</p>
              <button 
                type="button"
                onClick={() => coverInputRef.current?.click()}
                className="bg-primary text-on-primary px-4 py-2 rounded-md font-bold shadow-sm cursor-pointer"
              >
                Upload Cover
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Layout matching the screenshot: 1 col on left, 2 cols on right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Info Cards */}
        <div className="flex flex-col gap-6">
          <EditableProfileCard vendor={vendorData} dynamicCategories={dynamicCategories} />
          <EditableExperienceCard vendor={vendorData} />
          <EditableDetailsCard vendor={vendorData} />
        </div>

        {/* Right Column: Portfolio */}
        <div className="lg:col-span-2">
          <EditablePortfolioGrid images={vendorData.portfolioImages || []} vendorId={vendorData.id} />
        </div>

      </div>
    </div>
  );
}
