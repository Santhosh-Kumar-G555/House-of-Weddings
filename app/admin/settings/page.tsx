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

        {/* TAXONOMY TAB CONTENT */}
        {activeTab === 'taxonomy' && (
          <div className="w-full">
          <div className="bg-surface-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 border-b border-outline-variant pb-2">
              <h2 className="text-xl font-bold text-on-surface">Category Directory</h2>
              
              {/* TEMPORARY SEED BUTTON */}
              <form action={async () => { 'use server'; await seedInitialCategories(); }}>
                <button type="submit" className="bg-primary/10 text-primary px-3 py-1 rounded-md text-xs font-bold hover:bg-primary/20 transition-colors">
                  Auto-Populate Existing Categories
                </button>
              </form>
            </div>
            
            {/* Add New Category Form */}
            <AddCategoryForm />

            {/* Category Table */}
            <div className="border border-outline-variant rounded-md overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-surface-variant/30 text-xs uppercase tracking-wider text-on-surface-variant">
                  <tr>
                    <th className="px-4 py-3 font-bold">Category Name</th>
                    <th className="px-4 py-3 font-bold text-center">Public View</th>
                    <th className="px-4 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-sm border-b border-outline-variant">
                  {categories.map((cat: any) => (
                    <React.Fragment key={cat.id}>
                      {/* PARENT CATEGORY ROW */}
                      <tr className="bg-surface-variant/10">
                        <td className="px-4 py-3 font-bold text-on-surface">{cat.name}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-[10px] font-bold ${cat.isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-variant text-on-surface-variant'}`}>
                            {cat.isVisible ? 'VISIBLE' : 'HIDDEN'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                          <form>
                            <input type="hidden" name="name" value={cat.name} />
                            <input type="hidden" name="isVisible" value={cat.isVisible ? '' : 'on'} />
                            <button 
                              formAction={async (data) => { 'use server'; await upsertCategory(data, cat.id); }} 
                              className="bg-surface-variant/50 text-on-surface px-3 py-1.5 rounded text-xs font-bold hover:bg-surface-variant transition-colors" type="submit"
                            >
                              {cat.isVisible ? 'Hide' : 'Show'}
                            </button>
                          </form>
                            <ConfirmSubmitButton 
                              formAction={async () => { 'use server'; await deleteCategory(cat.id); }} 
                              className="bg-error/10 text-error px-3 py-1.5 rounded text-xs font-bold hover:bg-error hover:text-white transition-colors"
                              message="Are you sure you want to delete this category? This will also remove all associated sub-categories."
                            >
                              Delete
                            </ConfirmSubmitButton>
                        </td>
                      </tr>

                      {/* NESTED SUB-CATEGORIES (SERVICE TYPES) */}
                      {cat.services.map((service: any) => (
                        <tr key={service.id} className="hover:bg-surface-variant/5">
                          <td className="px-4 py-2 pl-10 text-on-surface-variant flex items-center gap-2">
                            <span className="material-symbols-outlined text-[16px] text-outline">subdirectory_arrow_right</span>
                            {service.name}
                          </td>
                          <td className="px-4 py-2 text-center">
                            {/* You can add individual visibility toggles here later if needed */}
                          </td>
                          <td className="px-4 py-2 text-right">
                              <ConfirmSubmitButton 
                                formAction={async () => { 'use server'; await deleteServiceType(service.id); }} 
                                className="bg-error/10 text-error px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold hover:bg-error hover:text-white transition-colors"
                                message="Are you sure you want to remove this sub-category?"
                              >
                                Remove
                              </ConfirmSubmitButton>
                          </td>
                        </tr>
                      ))}

                      {/* ADD NEW SUB-CATEGORY MINI-FORM */}
                      <tr>
                        <td colSpan={3} className="px-4 py-2 pl-10 pb-4">
                          <AddServiceForm categoryId={cat.id} />
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
                  {categories.length === 0 && (
                    <tr><td colSpan={3} className="p-4 text-center text-on-surface-variant">No categories created yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
          </div>
        )}

      </div>
    </div>
  );
}
