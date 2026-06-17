'use client';

import React, { useState } from 'react';
import { getSignature } from '@/server/actions/cloudinary';

type Props = {
  onUploadSuccess: (url: string) => void;
  onError?: (error: string) => void;
};

export default function ImageUploader({ onUploadSuccess, onError }: Props) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Get the secure signature from your Next.js server
      const signatureData = await getSignature();
      
      if (signatureData.error || !signatureData.signature) {
        throw new Error(signatureData.error || 'Failed to get upload signature');
      }

      // 2. Prepare the payload for Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', signatureData.apiKey!);
      formData.append('timestamp', signatureData.timestamp!.toString());
      formData.append('signature', signatureData.signature);
      // Optional: Store all minchu images in a specific folder
      // formData.append('folder', 'minchu_uploads');

      // 3. Upload directly to Cloudinary's REST API
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${signatureData.cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await response.json();

      // 4. Handle the response
      if (data.secure_url) {
        onUploadSuccess(data.secure_url);
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error(err);
      if (onError) onError(err.message);
    } finally {
      setUploading(false);
      // Reset the input so the user can upload the same file again if needed
      e.target.value = '';
    }
  };

  return (
    <div className="relative inline-block">
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
        aria-label="Upload Image"
      />
      <button
        type="button"
        disabled={uploading}
        className="bg-surface-variant text-on-surface font-label-md px-6 py-2 rounded flex items-center justify-center gap-2 hover:bg-outline-variant transition-colors disabled:opacity-50 border border-outline-variant"
      >
        <span className="material-symbols-outlined text-[20px]">
          {uploading ? 'hourglass_empty' : 'upload'}
        </span>
        {uploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
}
