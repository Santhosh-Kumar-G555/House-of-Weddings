'use client';

import React, { useState } from 'react';
import { updateVendorProfile } from '@/server/actions/vendor';
import { useRouter } from 'next/navigation';
import ImageUploader from './ImageUploader';
import { taxonomyMap } from '@/lib/taxonomy';
import Image from "next/image";

const EMPTY_CATEGORIES: any[] = [];

export default function EditableProfileCard({ vendor, dynamicCategories = EMPTY_CATEGORIES }: { vendor: any, dynamicCategories?: any[] }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: vendor.name || '',
    category: vendor.category || 'Venues',
    city: vendor.city || '',
    state: vendor.state || '',
    serviceCounty: vendor.serviceCounty || '',
    description: vendor.description || ''
  });

  const handleAvatarUpload = async (url: string) => {
    await updateVendorProfile({ profileImage: url }, vendor.id);
    router.refresh();
  };

  const handleCategoryChange = (cat: string) => {
    setFormData({ ...formData, category: cat, description: '' });
  };

  const handleSave = async () => {
    setIsLoading(true);
    const payload = {
      name: formData.name,
      category: formData.category,
      city: formData.city,
      state: formData.state,
      serviceCounty: formData.serviceCounty,
      description: formData.description
    };
    const res = await updateVendorProfile(payload, vendor.id);
    
    setIsLoading(false);

    if (res?.error) {
      alert(`Save Failed: ${res.error}`);
      return;
    }

    setIsEditing(false);
    
    // If we just created a new vendor, redirect to its dedicated ID page
    if (res?.newId && !vendor.id) {
      router.push(`/admin/vendors/${res.newId}`);
    } else {
      router.refresh();
    }
  };

  if (isEditing) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 relative animate-in fade-in">
        <h3 className="font-headline-sm font-bold mb-4 text-on-surface">Edit Profile</h3>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 mb-4">
            <label htmlFor="epc-name" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Business Name</label>
            <input id="epc-name" className="border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" placeholder="Business Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label htmlFor="epc-category" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Category</label>
            <select 
              id="epc-category"
              value={formData.category} 
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none"
            >
              <option value="">Select Category...</option>
              {dynamicCategories.map((cat: any) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5 mb-4">
            <label htmlFor="epc-type" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Service Type (Sub-Category)</label>
            <select 
              id="epc-type"
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              disabled={!formData.category}
              className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none disabled:opacity-50"
            >
              <option value="">Select Type...</option>
              {dynamicCategories.find((c: any) => c.name === formData.category)?.services.map((sub: any) => (
                <option key={sub.id} value={sub.name}>{sub.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="epc-city" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">City</label>
              <input id="epc-city" className="border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" placeholder="City" value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="epc-state" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">State</label>
              <input id="epc-state" className="border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" placeholder="State" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} />
            </div>
          </div>
          
          <div className="flex flex-col gap-1.5 mb-4 mt-4">
            <label htmlFor="epc-county" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Service County</label>
            <input id="epc-county" className="border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" placeholder="Service County" value={formData.serviceCounty} onChange={(e) => setFormData({...formData, serviceCounty: e.target.value})} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-on-surface-variant hover:bg-surface-variant rounded cursor-pointer" type="button">Cancel</button>
          <button onClick={handleSave} disabled={isLoading} className="px-4 py-2 bg-primary text-on-primary rounded cursor-pointer" type="submit">{isLoading ? 'Saving...' : 'Save'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 relative group flex flex-col items-center text-center">
      <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 p-2 bg-surface-variant text-on-surface-variant rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center hover:text-primary" type="button">
        <span className="material-symbols-outlined text-[18px]">edit</span>
      </button>

      {/* Avatar Section */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-surface-variant group/avatar">
        {vendor.profilePic ? (
          <Image src={vendor.profilePic} alt="Profile" className="w-full h-full object-cover" fill sizes="128px" />
        ) : (
           <div className="w-full h-full bg-surface-variant flex items-center justify-center">
             <span className="material-symbols-outlined text-4xl text-on-surface-variant">person</span>
           </div>
        )}
        {/* Hover to upload new avatar */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
           <div className="scale-75 origin-center"><ImageUploader onUploadSuccess={handleAvatarUpload} /></div>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-on-surface mb-2">{vendor.name || 'Your Business Name'}</h1>
      <p className="text-primary font-bold mb-4">{vendor.category || 'Category'} • {vendor.city || 'City'}{vendor.state ? `, ${vendor.state}` : ''}</p>
      <p className="text-on-surface-variant">{vendor.description || 'No description provided yet.'}</p>
    </div>
  );
}
