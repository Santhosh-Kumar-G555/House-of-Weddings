
'use client';

import React, { useState } from 'react';
import { updateProfile, updateProfileImage } from '@/server/actions/user';
import ImageUploader from './ImageUploader';
import { useRouter } from 'next/navigation';
import Image from "next/image";

type UserProps = {
  email: string;
  fullName: string | null;
  phone: string | null;
  image: string | null;
};

// react-doctor-disable-next-line prefer-useReducer, react-doctor/prefer-useReducer
export default function PersonalInfoForm({ user }: { user: UserProps }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  // Optimistic UI state for the avatar
  const [currentName, setCurrentName] = useState(user.fullName || '');
  const [avatar, setAvatar] = useState(user.image || null);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();

  const handleImageSuccess = async (url: string) => {
    setIsUpdating(true);
    setAvatar(url); // Optimistic UI update

    const res = await updateProfileImage(url);
    if (res.error) {
      alert(res.error);
      setAvatar(user.image || null); // Revert on failure
    } else {
      router.refresh(); // Sync server state
    }
    setIsUpdating(false);
  };

  const handleUpdate = async (formData: FormData) => {
    setLoading(true);
    setMessage({ text: '', type: '' });

    const res = await updateProfile(formData);

    if (res.error) {
      setMessage({ text: res.error, type: 'error' });
    } else {
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
      // Clear success message after 3 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
    setLoading(false);
  };

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded p-8 flex flex-col relative h-full" style={{ width: '100%', minWidth: '100%' }}>
      <h2 className="font-headline-md text-xl font-bold text-primary mb-6 border-b border-outline-variant pb-4 flex justify-between items-center">
        Personal Info
        {message.text && (
          <span className={`text-[12px] px-3 py-1 rounded font-bold ${message.type === 'success' ? 'bg-primary-container text-on-primary-container' : 'bg-error-container text-on-error-container'}`}>
            {message.text}
          </span>
        )}
      </h2>

      <div className="flex items-center gap-6 mb-8">
        {/* Avatar Display */}
        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-surface-variant flex-shrink-0 border border-outline-variant">
          {avatar ? (
            <Image src={avatar} alt="Profile" className="w-full h-full object-cover" fill sizes="128px" />
          ) : (
            <span className="material-symbols-outlined text-3xl text-on-surface-variant absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              person
            </span>
          )}
          {isUpdating && (
            <div className="absolute inset-0 bg-surface/50 flex items-center justify-center">
              <span className="material-symbols-outlined animate-spin text-primary">progress_activity</span>
            </div>
          )}
        </div>

        {/* Uploader */}
        <div>
          <ImageUploader 
            onUploadSuccess={handleImageSuccess} 
            onError={(err) => alert(err)} 
          />
          <p className="font-body-sm text-on-surface-variant mt-2 text-[12px]">
            Max size: 5MB (JPG/PNG)
          </p>
        </div>
      </div>

      <form action={handleUpdate} className="space-y-4 flex-1 flex flex-col">
        <div className="space-y-4 flex-1">
          <div>
            <label htmlFor="pi-email" className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Email</label>
            <input id="pi-email" type="email" disabled defaultValue={user.email} className="w-full border border-outline-variant rounded p-3 bg-surface-container text-on-surface-variant cursor-not-allowed outline-none" />
          </div>
          <div>
            <label htmlFor="pi-fullname" className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Full Name</label>
            <input
              id="pi-fullname"
              type="text"
              name="fullName"
              value={currentName}
              onChange={(e) => setCurrentName(e.target.value)}
              placeholder="Jane Doe"
              className="w-full border border-outline-variant rounded p-3 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
          <div>
            <label htmlFor="pi-phone" className="block text-[12px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Phone Number</label>
            <input
              id="pi-phone"
              type="tel"
              name="phone"
              defaultValue={user.phone || ''}
              placeholder="+91 98765 43210"
              className="w-full border border-outline-variant rounded p-3 bg-surface-container-lowest text-on-surface focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="w-full bg-primary text-on-primary font-label-md py-3 rounded hover:opacity-90 transition-opacity mt-8 cursor-pointer disabled:opacity-50" type="button"
        >
          {loading ? 'Saving Changes...' : 'Update Profile'}
        </button>
      </form>
    </div>
  );
}
