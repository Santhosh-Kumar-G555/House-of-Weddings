import React from 'react';
import prisma from '@/server/db/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { updateSystemSettings, upsertCategory, deleteCategory, upsertServiceType, deleteServiceType } from '@/server/actions/settings';
import { seedInitialCategories } from '@/server/actions/seed';
import { auth } from '@/auth';
import AddCategoryForm from './AddCategoryForm';
import AddServiceForm from './AddServiceForm';
import ConfirmSubmitButton from '@/components/modules/admin/ConfirmSubmitButton';
import GeneralSettingsForm from './GeneralSettingsForm';
import TaxonomyTab from './TaxonomyTab';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  // Resolve search params, auth session, and database queries in parallel
  const [resolvedParams, session, settingsResult, categories] = await Promise.all([
    searchParams,
    auth(),
    prisma.systemSettings.findFirst(),
    prisma.category.findMany({ 
      orderBy: { name: 'asc' },
      include: { services: { orderBy: { name: 'asc' } } } // Fetch the children!
    })
  ]);

  const activeTab = resolvedParams.tab || 'general';

  let settings = settingsResult;
  if (!settings) {
    settings = { id: 'new', maintenanceMode: false, commissionRate: 10, seoTitle: '', seoDescription: '', updatedAt: new Date() };
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-on-surface mb-2">System Settings</h1>
        <p className="text-on-surface-variant text-sm md:text-base">Global platform controls and category management. Super Admin exclusive.</p>
      </div>

      {/* TAB NAVIGATION */}
      <div className="flex items-center gap-8 border-b border-outline-variant mb-8">
        <Link 
          href="?tab=general" 
          className={`pb-3 text-sm font-bold tracking-wider uppercase transition-colors relative ${
            activeTab === 'general' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Platform Configuration
          {activeTab === 'general' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></span>}
        </Link>
        
        <Link 
          href="?tab=taxonomy" 
          className={`pb-3 text-sm font-bold tracking-wider uppercase transition-colors relative ${
            activeTab === 'taxonomy' ? 'text-primary' : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          Taxonomy & Categories
          {activeTab === 'taxonomy' && <span className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></span>}
        </Link>
      </div>

      {/* TAB CONTENT AREAS */}
      <div className="w-full">
        
        {/* GENERAL TAB CONTENT */}
        {activeTab === 'general' && (
          <div className="w-full shrink-0 md:min-w-[600px] max-w-3xl">
            <div className="w-full bg-surface-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-on-surface mb-6 border-b border-outline-variant pb-2">Platform Configuration</h2>
            
            <GeneralSettingsForm settings={settings} />
          </div>
          </div>
        )}

        {activeTab === 'taxonomy' && (
          <TaxonomyTab categories={categories} />
        )}

      </div>
    </div>
  );
}
