'use client';

import React from 'react';
import { updateSystemSettings } from '@/server/actions/settings';
import toast from 'react-hot-toast';

export default function GeneralSettingsForm({ settings }: { settings: any }) {
  const handleSubmit = async (formData: FormData) => {
    try {
      await updateSystemSettings(formData);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings.');
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Maintenance Mode Toggle */}
      <div className="flex items-center justify-between p-4 bg-error-container/20 border border-error/20 rounded-lg">
        <div>
          <label htmlFor="sys-maintenance" className="font-bold text-error">Maintenance Mode</label>
          <p className="text-xs text-on-surface-variant">Takes the public site offline.</p>
        </div>
        <input 
          id="sys-maintenance"
          type="checkbox" 
          name="maintenanceMode" 
          defaultChecked={settings.maintenanceMode}
          className="w-5 h-5 accent-error cursor-pointer"
        />
      </div>

      {/* SEO Meta */}
      <div>
        <label htmlFor="sys-title" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Global SEO Title</label>
        <input 
          id="sys-title"
          type="text" name="seoTitle" defaultValue={settings.seoTitle || ''}
          className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none text-on-surface"
        />
      </div>
      <div>
        <label htmlFor="sys-desc" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Global SEO Description</label>
        <textarea 
          id="sys-desc"
          name="seoDescription" defaultValue={settings.seoDescription || ''} rows={3}
          className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none text-on-surface resize-none"
        />
      </div>

      <button type="submit" className="w-full bg-primary text-on-primary px-6 py-3 rounded-md font-bold hover:bg-primary/90 transition-colors">
        Save Platform Settings
      </button>
    </form>
  );
}
