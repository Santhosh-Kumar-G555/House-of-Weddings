'use client';

import React, { useState } from 'react';
import { upsertCategory } from '@/server/actions/settings';
import toast from 'react-hot-toast';

export default function AddCategoryForm() {
  const [error, setError] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setError(null);
    try {
      const res = await upsertCategory(formData);
      
      if (res?.error) {
        setError(res.error);
        toast.error('Failed to add category.');
      } else {
        const form = document.getElementById('main-category-form') as HTMLFormElement;
        form?.reset();
        toast.success('Category added successfully!');
      }
    } catch (err) {
      toast.error('Failed to add category.');
    }
  }

  return (
    <form id="main-category-form" action={handleAction} className="flex flex-col gap-2 mb-8 bg-surface-variant/20 p-4 rounded-lg">
      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label htmlFor="cat-name" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">New Category Name</label>
          <input id="cat-name" type="text" name="name" required placeholder="e.g. Drone Videography" className="w-full px-3 py-2 bg-surface-lowest border border-outline-variant rounded-md focus:border-primary outline-none text-sm" />
        </div>
        <div className="flex flex-col items-center">
          <label htmlFor="cat-visible" className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Publicly Visible?</label>
          <input id="cat-visible" type="checkbox" name="isVisible" defaultChecked className="w-4 h-4 accent-primary mb-2" />
        </div>
        <button type="submit" className="bg-surface-variant text-on-surface px-4 py-2 rounded-md font-bold text-sm hover:bg-surface-variant/80 transition-colors h-[38px]">
          Add
        </button>
      </div>
      {/* ERROR MESSAGE DISPLAY */}
      {error && <div className="text-error text-xs font-bold bg-error-container/20 p-2 rounded border border-error/20">{error}</div>}
    </form>
  );
}
