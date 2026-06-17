'use client';

import React, { useState } from 'react';
import { updateVendorProfile } from '@/server/actions/vendor';
import { useRouter } from 'next/navigation';

export default function EditableDetailsCard({ vendor }: { vendor: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    signatureStyle: vendor.signatureStyle || '',
    brandsUsed: vendor.brandsUsed || '',
    price: vendor.price?.toString() || '',
    idealBooking: vendor.idealBooking || ''
  });

  const handleSave = async () => {
    setIsLoading(true);
    const payload = {
      signatureStyle: formData.signatureStyle,
      brandsUsed: formData.brandsUsed,
      price: parseInt(formData.price) || 0,
      idealBooking: formData.idealBooking,
    };
    const res = await updateVendorProfile(payload, vendor.id);
    
    setIsLoading(false);

    if (res?.error) {
      alert(`Save Failed: ${res.error}`);
      return;
    }

    setIsEditing(false);
    router.refresh();
  };

  if (isEditing) {
    return (
      <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 relative animate-in fade-in">
        <h3 className="font-headline-sm font-bold mb-4 text-on-surface">Edit Details</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="details-style" className="block text-on-surface font-label-sm uppercase tracking-wider mb-1">Signature Style</label>
            <input id="details-style" className="w-full border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" placeholder="e.g. Traditional, Modern, Cinematic" value={formData.signatureStyle} onChange={(e) => setFormData({...formData, signatureStyle: e.target.value})} />
          </div>
          <div>
            <label htmlFor="details-brands" className="block text-on-surface font-label-sm uppercase tracking-wider mb-1">Brands Usually Used</label>
            <input id="details-brands" className="w-full border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" placeholder="e.g. MAC, Huda Beauty" value={formData.brandsUsed} onChange={(e) => setFormData({...formData, brandsUsed: e.target.value})} />
          </div>
          <div>
            <label htmlFor="details-price" className="block text-on-surface font-label-sm uppercase tracking-wider mb-1">Starting Price (₹)</label>
            <input id="details-price" className="w-full border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" type="number" placeholder="Starting Price" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
          </div>
          <div>
            <label htmlFor="details-booking" className="block text-on-surface font-label-sm uppercase tracking-wider mb-1">Ideal Booking Before</label>
            <input id="details-booking" className="w-full border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" placeholder="e.g., 4-6 Months" value={formData.idealBooking} onChange={(e) => setFormData({...formData, idealBooking: e.target.value})} />
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
    <div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-6 relative group">
      <button onClick={() => setIsEditing(true)} className="absolute top-4 right-4 p-2 bg-surface-variant text-on-surface-variant rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center hover:text-primary" type="button">
        <span className="material-symbols-outlined text-[18px]">edit</span>
      </button>

      <h3 className="font-label-md font-bold text-on-surface mb-6">Details</h3>
      <div className="flex flex-col gap-6">
        <div>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Signature Style</p>
          <p className="font-body-md text-on-surface">{vendor.signatureStyle || 'Not specified'}</p>
        </div>
        <div>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Brands Usually Used</p>
          <p className="font-body-md text-on-surface">{vendor.brandsUsed || 'Not specified'}</p>
        </div>
        <div>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Starting Price</p>
          <p className="font-body-md text-on-surface">₹{vendor.price ? vendor.price.toLocaleString() : '0'}</p>
        </div>
        <div>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Ideal Booking Before</p>
          <p className="font-body-md text-on-surface">{vendor.idealBooking || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
}
