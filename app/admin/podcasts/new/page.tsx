'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createPodcast, getVendorsForPodcast } from '@/server/actions/podcasts';
import { getSignature } from '@/server/actions/cloudinary';
import { toast } from 'react-hot-toast';

export default function NewPodcastPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaSource, setMediaSource] = useState<'upload' | 'external_link'>('upload');
  const [thumbnailSource, setThumbnailSource] = useState<'upload' | 'external_link'>('external_link');
  const [uploadProgress, setUploadProgress] = useState(false);
  const [thumbUploadProgress, setThumbUploadProgress] = useState(false);
  const [vendors, setVendors] = useState<{id: string, name: string}[]>([]);
  const [guestQuery, setGuestQuery] = useState('');
  const [guestId, setGuestId] = useState('');
  const [guestName, setGuestName] = useState('');
  const [isGuestOpen, setIsGuestOpen] = useState(false);
  const guestRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getVendorsForPodcast().then(res => {
      if (res.vendors) setVendors(res.vendors);
    });

    function handleClickOutside(event: MouseEvent) {
      if (guestRef.current && !guestRef.current.contains(event.target as Node)) {
        setIsGuestOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredGuests = vendors.filter(v => v.name.toLowerCase().includes(guestQuery.toLowerCase()));

  const handleGuestSelect = (id: string, name: string) => {
    setGuestId(id);
    setGuestName(name);
    setGuestQuery(name);
    setIsGuestOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      let mediaUrl = formData.get('externalUrl') as string;

      if (mediaSource === 'upload') {
        const file = formData.get('videoFile') as File;
        if (!file || file.size === 0) {
          toast.error('Please select a video file.');
          setIsSubmitting(false);
          return;
        }

        // Large files frequently cause `TypeError: Failed to fetch` (ERR_CONNECTION_RESET) 
        // when uploaded via standard browser fetch or Next.js local servers.
        // We limit to 10MB for this local demo to ensure successful plumbing.
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_FILE_SIZE) {
          toast.error('Local upload limit is 10MB to prevent network drops. Please use a smaller video or an External Link.');
          setIsSubmitting(false);
          return;
        }

        setUploadProgress(true);
        
        const localFormData = new FormData();
        localFormData.append('file', file);

        // 3. Upload to our Next.js API Route (Bypasses local AdBlockers)
        let response;
        try {
          response = await fetch('/api/upload', {
            method: 'POST',
            body: localFormData,
          });
        } catch (fetchError: any) {
          console.error("Local Proxy Fetch Error:", fetchError);
          toast.error("Network Error: Could not reach the local API route.");
          setIsSubmitting(false);
          return;
        }

        const uploadResult = await response.json();
        setUploadProgress(false);

        if (!response.ok || !uploadResult.secure_url) {
          toast.error(uploadResult.error || 'Failed to upload video via API route');
          setIsSubmitting(false);
          return;
        }
        mediaUrl = uploadResult.secure_url;
      }

      let thumbnailUrl = formData.get('externalThumbnailUrl') as string;
      
      if (thumbnailSource === 'upload') {
        const thumbFile = formData.get('thumbnailFile') as File;
        if (thumbFile && thumbFile.size > 0) {
          const MAX_THUMB_SIZE = 5 * 1024 * 1024; // 5MB
          if (thumbFile.size > MAX_THUMB_SIZE) {
            toast.error('Thumbnail size limit is 5MB.');
            setIsSubmitting(false);
            return;
          }

          setThumbUploadProgress(true);
          const localThumbData = new FormData();
          localThumbData.append('file', thumbFile);

          try {
            const thumbRes = await fetch('/api/upload', {
              method: 'POST',
              body: localThumbData,
            });
            const thumbResult = await thumbRes.json();
            
            if (!thumbRes.ok || !thumbResult.secure_url) {
              toast.error(thumbResult.error || 'Failed to upload thumbnail');
              setIsSubmitting(false);
              setThumbUploadProgress(false);
              return;
            }
            thumbnailUrl = thumbResult.secure_url;
          } catch (e) {
            console.error("Thumbnail upload error:", e);
            toast.error("Network error during thumbnail upload.");
            setIsSubmitting(false);
            setThumbUploadProgress(false);
            return;
          }
          setThumbUploadProgress(false);
        }
      }

      if (!mediaUrl) {
        toast.error('Media URL is required.');
        setIsSubmitting(false);
        return;
      }

      const result = await createPodcast({
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        mediaSource,
        mediaUrl,
        thumbnailUrl: thumbnailUrl || '',
        guestId: guestId || undefined,
        guestName: guestName || undefined,
        duration: formData.get('duration') as string,
        status: formData.get('status') as string,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Podcast created successfully!');
        router.push('/admin/podcasts');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(false);
    }
  };

  return (
    <div className="w-full max-w-[768px] mx-auto px-4 md:px-8 space-y-8 pb-24">
      <div>
        <h1 className="text-3xl font-bold text-on-surface mb-2">Add New Podcast</h1>
        <p className="text-on-surface-variant text-sm md:text-base">
          Fill out the details below to add a new podcast episode.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-lowest border border-outline-variant rounded-xl p-6 space-y-6 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface">Title</label>
            <input required type="text" name="title" className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="Episode Title" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface">Category</label>
            <input required type="text" name="category" className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="e.g. Budgeting, Planning" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 relative" ref={guestRef}>
            <label className="text-sm font-bold text-on-surface">Guest (Vendor)</label>
            <input 
              type="text" 
              value={guestQuery}
              onChange={(e) => {
                setGuestQuery(e.target.value);
                if (!e.target.value) { setGuestId(''); setGuestName(''); }
                setIsGuestOpen(true);
              }}
              onFocus={() => setIsGuestOpen(true)}
              className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" 
              placeholder="Search vendor..." 
            />
            {isGuestOpen && filteredGuests.length > 0 && (
              <ul className="absolute z-10 w-full bg-surface-container-lowest border border-outline-variant mt-1 rounded-md max-h-48 overflow-y-auto shadow-md">
                {filteredGuests.map(v => (
                  <li 
                    key={v.id} 
                    className="px-4 py-2 hover:bg-surface-variant cursor-pointer text-sm"
                    onClick={() => handleGuestSelect(v.id, v.name)}
                  >
                    {v.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface">Duration</label>
            <input required type="text" name="duration" className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="e.g. 45 mins" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface">Description</label>
          <textarea required name="description" rows={4} className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="Episode summary..." />
        </div>

        <div className="pt-4 border-t border-outline-variant">
          <label className="text-sm font-bold text-on-surface mb-4 block">Thumbnail Image Source</label>
          
          <div className="flex items-center gap-6 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="thumbnailSourceSelect" 
                value="upload" 
                checked={thumbnailSource === 'upload'} 
                onChange={() => setThumbnailSource('upload')} 
                className="w-4 h-4 text-primary"
              />
              <span>Upload Local Image</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="thumbnailSourceSelect" 
                value="external_link" 
                checked={thumbnailSource === 'external_link'} 
                onChange={() => setThumbnailSource('external_link')} 
                className="w-4 h-4 text-primary"
              />
              <span>Use External Link</span>
            </label>
          </div>

          {thumbnailSource === 'upload' ? (
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">Image File (JPG, PNG)</label>
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center bg-surface-container-lowest">
                <input type="file" name="thumbnailFile" accept="image/*" className="mx-auto block" />
              </div>
              {thumbUploadProgress && <p className="text-sm text-primary font-bold mt-2 animate-pulse">Uploading thumbnail... Please wait.</p>}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">Thumbnail Image URL</label>
              <input type="url" name="externalThumbnailUrl" className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="https://..." />
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-outline-variant">
          <label className="text-sm font-bold text-on-surface mb-4 block">Media Source</label>
          
          <div className="flex items-center gap-6 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="mediaSourceSelect" 
                value="upload" 
                checked={mediaSource === 'upload'} 
                onChange={() => setMediaSource('upload')} 
                className="w-4 h-4 text-primary"
              />
              <span>Upload Video File</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="radio" 
                name="mediaSourceSelect" 
                value="external_link" 
                checked={mediaSource === 'external_link'} 
                onChange={() => setMediaSource('external_link')} 
                className="w-4 h-4 text-primary"
              />
              <span>External Video Link</span>
            </label>
          </div>

          {mediaSource === 'upload' ? (
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">Video File (MP4)</label>
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center bg-surface-container-lowest">
                <input type="file" name="videoFile" accept="video/*" className="mx-auto block" />
                <p className="text-xs text-on-surface-variant mt-2">Max file size depends on Cloudinary plan (usually 100MB free)</p>
              </div>
              {uploadProgress && <p className="text-sm text-primary font-bold mt-2 animate-pulse">Uploading video to Cloudinary... Please wait.</p>}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">External Video URL</label>
              <input type="url" name="externalUrl" className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="https://youtube.com/..." />
            </div>
          )}
        </div>

        <div className="space-y-2 pt-4 border-t border-outline-variant">
          <label className="text-sm font-bold text-on-surface">Status</label>
          <select name="status" className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="pt-6 flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-outline-variant rounded-md font-bold text-on-surface hover:bg-surface-variant transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-on-primary rounded-md font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Podcast'}
          </button>
        </div>

      </form>
    </div>
  );
}
