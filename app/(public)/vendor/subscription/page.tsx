'use client';

import React from 'react';
import { toast, Toaster } from 'react-hot-toast';

export default function VendorSubscriptionPage() {
  const handleUpgrade = (planName: string) => {
    toast(`Payment gateway integration coming soon. You selected: ${planName}`, {
      icon: '🚧',
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    });
  };

  return (
    <>
      <Toaster />
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Billing & Plans</h1>
          <p className="text-on-surface-variant text-sm md:text-base">
            Manage your vendor subscription and upgrade your listing for premium placement.
          </p>
        </div>

        {/* Current Plan Banner */}
        <div className="bg-primary-container text-on-primary-container rounded-xl p-6 border border-primary/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest font-bold opacity-80 mb-1">Current Plan</p>
            <h2 className="text-2xl font-bold">Basic Listing</h2>
          </div>
          <div className="px-4 py-2 bg-surface-lowest/50 rounded-full text-sm font-bold border border-primary/10">
            Active
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          
          {/* Tier 1: Basic */}
          <div className="bg-surface-lowest border border-outline-variant rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all hover:border-primary/30 hover:shadow-md">
            <h3 className="text-xl font-bold text-on-surface mb-2">Basic Listing</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-on-surface">Free</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-8 min-h-[40px]">
              Essential visibility for new vendors starting out.
            </p>
            
            <ul className="space-y-4 mb-8 flex-1 text-sm text-on-surface-variant">
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span> Basic Directory Profile</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span> Max 5 Portfolio Images</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span> Standard Search Ranking</li>
              <li className="flex items-center gap-3 opacity-40"><span className="material-symbols-outlined text-[18px]">cancel</span> No Priority Support</li>
            </ul>
            
            <button 
              onClick={() => handleUpgrade('Basic Listing')}
              disabled
              className="w-full py-3 rounded-lg font-bold border border-outline-variant text-on-surface-variant bg-surface-variant cursor-not-allowed"
            >
              Current Plan
            </button>
          </div>

          {/* Tier 2: Premium (Highlighted) */}
          <div className="bg-surface-lowest border-2 border-primary rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-lg transform md:-translate-y-2">
            <div className="absolute top-0 inset-x-0 bg-primary text-on-primary text-xs font-bold uppercase tracking-widest text-center py-1">
              Most Popular
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2 mt-2">Premium Placement</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-on-surface">$49</span>
              <span className="text-on-surface-variant text-sm font-medium">/ month</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-8 min-h-[40px]">
              Enhanced visibility to drive more leads and bookings.
            </p>
            
            <ul className="space-y-4 mb-8 flex-1 text-sm text-on-surface-variant">
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[18px] text-primary">check_circle</span> Everything in Basic</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[18px] text-primary">check_circle</span> Unlimited Portfolio Images</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[18px] text-primary">check_circle</span> Boosted Search Ranking</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[18px] text-primary">check_circle</span> Video Upload Capability</li>
            </ul>
            
            <button 
              onClick={() => handleUpgrade('Premium Placement')}
              className="w-full py-3 rounded-lg font-bold bg-primary text-on-primary hover:bg-primary/90 transition-colors shadow-md"
            >
              Upgrade Now
            </button>
          </div>

          {/* Tier 3: Featured */}
          <div className="bg-surface-lowest border border-outline-variant rounded-2xl p-8 flex flex-col relative overflow-hidden transition-all hover:border-primary/30 hover:shadow-md">
            <h3 className="text-xl font-bold text-on-surface mb-2">Featured Vendor</h3>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-extrabold text-on-surface">$99</span>
              <span className="text-on-surface-variant text-sm font-medium">/ month</span>
            </div>
            <p className="text-sm text-on-surface-variant mb-8 min-h-[40px]">
              Maximum exposure with homepage featuring and dedicated marketing.
            </p>
            
            <ul className="space-y-4 mb-8 flex-1 text-sm text-on-surface-variant">
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span> Everything in Premium</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span> Homepage Featured Spot</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span> Social Media Shoutouts</li>
              <li className="flex items-center gap-3"><span className="material-symbols-outlined text-[18px] text-emerald-600">check_circle</span> Priority 24/7 Support</li>
            </ul>
            
            <button 
              onClick={() => handleUpgrade('Featured Vendor')}
              className="w-full py-3 rounded-lg font-bold border-2 border-primary text-primary hover:bg-primary hover:text-on-primary transition-colors"
            >
              Select Plan
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
