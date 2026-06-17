'use client';

import React, { useState } from 'react';
import { updateVendorProfile } from '@/server/actions/vendor';
import { useRouter } from 'next/navigation';

export default function EditableExperienceCard({ vendor }: { vendor: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    experience: vendor.experience?.toString() || '',
    clientsCount: vendor.clientsCount?.toString() || '',
    communitiesCount: vendor.communitiesCount?.toString() || '',
    citiesCount: vendor.citiesCount?.toString() || '',
    countriesCount: vendor.countriesCount?.toString() || '',
    serviceCities: vendor.serviceCities || '',
    serviceCountries: vendor.serviceCountries || ''
  });

  const handleSave = async () => {
    setIsLoading(true);
    const payload = {
      experience: parseInt(formData.experience) || 0,
      clientsCount: parseInt(formData.clientsCount) || 0,
      communitiesCount: parseInt(formData.communitiesCount) || 0,
      citiesCount: parseInt(formData.citiesCount) || 0,
      countriesCount: parseInt(formData.countriesCount) || 0,
      serviceCities: formData.serviceCities,
      serviceCountries: formData.serviceCountries,
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
        <h3 className="font-headline-sm font-bold mb-4 text-on-surface">Edit Experience</h3>
        <div className="flex flex-col gap-4">
          <div>
            <label htmlFor="exp-years" className="block text-on-surface font-label-sm uppercase tracking-wider mb-1">Years of Experience</label>
            <input id="exp-years" className="w-full border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" type="number" placeholder="Years of Experience" value={formData.experience} onChange={(e) => setFormData({...formData, experience: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="exp-clients" className="block text-on-surface font-label-sm uppercase tracking-wider mb-1">Total Clients</label>
              <input id="exp-clients" className="w-full border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" type="number" placeholder="e.g. 350" value={formData.clientsCount} onChange={(e) => setFormData({...formData, clientsCount: e.target.value})} />
            </div>
            <div>
              <label htmlFor="exp-comm" className="block text-on-surface font-label-sm uppercase tracking-wider mb-1">Communities</label>
              <input id="exp-comm" className="w-full border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" type="number" placeholder="e.g. 5" value={formData.communitiesCount} onChange={(e) => setFormData({...formData, communitiesCount: e.target.value})} />
            </div>
            <div>
              <label htmlFor="exp-cities" className="block text-on-surface font-label-sm uppercase tracking-wider mb-1">Cities</label>
              <input id="exp-cities" className="w-full border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" type="number" placeholder="e.g. 10" value={formData.citiesCount} onChange={(e) => setFormData({...formData, citiesCount: e.target.value})} />
            </div>
            <div>
              <label htmlFor="exp-count" className="block text-on-surface font-label-sm uppercase tracking-wider mb-1">Countries</label>
              <input id="exp-count" className="w-full border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" type="number" placeholder="e.g. 2" value={formData.countriesCount} onChange={(e) => setFormData({...formData, countriesCount: e.target.value})} />
            </div>
          </div>
          <div>
            <label htmlFor="exp-svc-cities" className="block text-on-surface font-label-sm uppercase tracking-wider mb-1">Service Cities</label>
            <input id="exp-svc-cities" className="w-full border border-outline-variant p-2 rounded bg-transparent focus:border-primary outline-none" placeholder="Service Cities (e.g. Mumbai, Delhi, Remote)" value={formData.serviceCities} onChange={(e) => setFormData({...formData, serviceCities: e.target.value})} />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <label htmlFor="exp-svc-count" className="font-label-sm font-bold uppercase tracking-wider">Service Countries</label>
            <input 
              id="exp-svc-count"
              type="text" 
              placeholder="e.g., India, USA, Canada"
              value={formData.serviceCountries} 
              onChange={(e) => setFormData({...formData, serviceCountries: e.target.value})} 
              className="p-3 border border-outline-variant rounded bg-transparent w-full"
            />
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

      <h3 className="font-label-md font-bold text-on-surface mb-6">Experience</h3>
      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-y-6 gap-x-4 mb-6 py-4 border-y border-outline-variant/30">
          <div className="flex flex-col">
            <span className="font-headline-sm font-bold text-on-surface">{vendor.clientsCount || 0}+</span>
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Clients</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm font-bold text-on-surface">{vendor.communitiesCount || 0}+</span>
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Communities</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm font-bold text-on-surface">{vendor.citiesCount || 0}+</span>
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Cities</span>
          </div>
          <div className="flex flex-col">
            <span className="font-headline-sm font-bold text-on-surface">{vendor.countriesCount || 0}+</span>
            <span className="font-label-sm text-on-surface-variant uppercase tracking-wider text-[10px]">Countries</span>
          </div>
        </div>
        <div>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Years of Experience</p>
          <p className="font-body-md text-on-surface">{vendor.experience ? `${vendor.experience} Years` : 'Not specified'}</p>
        </div>
        <div>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Service Cities</p>
          <p className="font-body-md text-on-surface">{vendor.serviceCities || 'Not specified'}</p>
        </div>
        <div>
          <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Service Countries</p>
          <p className="font-body-md text-on-surface">{vendor.serviceCountries || 'Not specified'}</p>
        </div>
      </div>
    </div>
  );
}
