'use client';

import React, { useState } from 'react';
import { upsertServiceType } from '@/server/actions/settings';
import toast from 'react-hot-toast';

export default function AddServiceForm({ categoryId }: { categoryId: string }) {
  const [error, setError] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setError(null); // Clear previous errors
    try {
      const res = await upsertServiceType(formData);
      
      if (res?.error) {
        setError(res.error); // Display the new error to the user
        toast.error('Failed to save sub-category.');
      } else {
        // Clear the input on success
        const form = document.getElementById(`form-${categoryId}`) as HTMLFormElement;
        form?.reset();
        toast.success('Sub-category saved!');
      }
    } catch (err) {
      toast.error('Failed to save sub-category.');
    }
  }

  return (
    <form id={`form-${categoryId}`} action={handleAction} className="w-full">
      <div className="flex items-center gap-3">
        <input type="hidden" name="categoryId" value={categoryId} />
        <input type="hidden" name="isVisible" value="on" />
        <span className="material-symbols-outlined text-[16px] text-outline">add</span>
        <input 
          type="text" 
          name="name" 
          required 
          placeholder="Add new sub-category..." 
          className="w-64 px-3 py-1 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none text-xs" 
          aria-label="New sub-category name"
        />
        {/* Replace the old Save button with this one */}
        <button 
          type="submit" 
          className="bg-primary text-on-primary px-4 py-1.5 rounded text-xs font-bold hover:bg-primary/90 transition-colors shrink-0"
        >
          Save
        </button>
      </div>
      
      {/* THE FIX: Block-level div with w-full prevents flex collapsing */}
      {error && (
        <div className="text-error text-xs mt-1 ml-8 font-bold w-full">
          {error}
        </div>
      )}
    </form>
  );
}
