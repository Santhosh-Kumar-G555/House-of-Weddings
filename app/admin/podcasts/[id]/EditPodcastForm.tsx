'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updatePodcast } from '@/server/actions/podcasts';
import { toast } from 'react-hot-toast';

type Podcast = {
  id: string;
  title: string;
  description: string;
  category: string;
  mediaSource: string;
  mediaUrl: string;
  thumbnailUrl: string | null;
  host: string;
  duration: string;
  status: string;
};

export default function EditPodcastForm({ podcast }: { podcast: Podcast }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaSource, setMediaSource] = useState<'upload' | 'external_link'>(
    podcast.mediaSource === 'upload' ? 'upload' : 'external_link'
  );
  const [uploadProgress, setUploadProgress] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      let mediaUrl = podcast.mediaUrl;
      const externalUrl = formData.get('externalUrl') as string;
      const file = formData.get('videoFile') as File | null;

      if (mediaSource === 'upload') {
        if (file && file.size > 0) {
          const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
          if (file.size > MAX_FILE_SIZE) {
            toast.error('Local upload limit is 10MB to prevent network drops. Please use a smaller video or an External Link.');
            setIsSubmitting(false);
            return;
          }

          setUploadProgress(true);
          const localFormData = new FormData();
          localFormData.append('file', file);

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
            toast.error(uploadResult.error || 'Failed to upload new video');
            setIsSubmitting(false);
            return;
          }
          mediaUrl = uploadResult.secure_url;
        }
      } else {
        if (externalUrl) {
          mediaUrl = externalUrl;
        }
      }

      if (!mediaUrl) {
        toast.error('Media URL is required.');
        setIsSubmitting(false);
        return;
      }

      const result = await updatePodcast(podcast.id, {
        title: formData.get('title') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        mediaSource,
        mediaUrl,
        thumbnailUrl: formData.get('thumbnailUrl') as string,
        host: formData.get('host') as string,
        duration: formData.get('duration') as string,
        status: formData.get('status') as string,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Podcast updated successfully!');
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
        <h1 className="text-3xl font-bold text-on-surface mb-2">Edit Podcast</h1>
        <p className="text-on-surface-variant text-sm md:text-base">
          Update the details for "{podcast.title}".
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface-lowest border border-outline-variant rounded-xl p-6 space-y-6 shadow-sm">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface">Title</label>
            <input required type="text" name="title" defaultValue={podcast.title} className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="Episode Title" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface">Category</label>
            <input required type="text" name="category" defaultValue={podcast.category} className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="e.g. Budgeting, Planning" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface">Host</label>
            <input required type="text" name="host" defaultValue={podcast.host} className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="e.g. Julianne West" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-on-surface">Duration</label>
            <input required type="text" name="duration" defaultValue={podcast.duration} className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="e.g. 45 mins" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface">Description</label>
          <textarea required name="description" defaultValue={podcast.description} rows={4} className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="Episode summary..." />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-on-surface">Thumbnail Image URL</label>
          <input type="url" name="thumbnailUrl" defaultValue={podcast.thumbnailUrl || ''} className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="https://..." />
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
              <label className="text-sm font-bold text-on-surface">Replace Video File (Optional)</label>
              <div className="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center bg-surface-container-lowest">
                <input type="file" name="videoFile" accept="video/*" className="mx-auto block" />
                <p className="text-xs text-on-surface-variant mt-2">Leave empty to keep the existing video.</p>
              </div>
              {uploadProgress && <p className="text-sm text-primary font-bold mt-2 animate-pulse">Uploading new video... Please wait.</p>}
              {!uploadProgress && podcast.mediaSource === 'upload' && (
                <p className="text-xs text-secondary mt-2 truncate">Current Video: {podcast.mediaUrl}</p>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-sm font-bold text-on-surface">External Video URL</label>
              <input type="url" name="externalUrl" defaultValue={podcast.mediaSource === 'external_link' ? podcast.mediaUrl : ''} className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent" placeholder="https://youtube.com/..." />
            </div>
          )}
        </div>

        <div className="space-y-2 pt-4 border-t border-outline-variant">
          <label className="text-sm font-bold text-on-surface">Status</label>
          <select name="status" defaultValue={podcast.status} className="w-full px-4 py-2 border border-outline-variant rounded-md bg-transparent">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="pt-6 flex justify-end gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-2 border border-outline-variant rounded-md font-bold text-on-surface hover:bg-surface-variant transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-primary text-on-primary rounded-md font-bold hover:bg-primary/90 transition-colors disabled:opacity-50">
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </form>
    </div>
  );
}
