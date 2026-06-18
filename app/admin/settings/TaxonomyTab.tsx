'use client';

import React from 'react';
import { upsertCategory, deleteCategory, deleteServiceType } from '@/server/actions/settings';
import { seedInitialCategories } from '@/server/actions/seed';
import AddCategoryForm from './AddCategoryForm';
import AddServiceForm from './AddServiceForm';
import ConfirmSubmitButton from '@/components/modules/admin/ConfirmSubmitButton';
import toast from 'react-hot-toast';

export default function TaxonomyTab({ categories }: { categories: any[] }) {
  const handleAutoPopulate = async () => {
    try {
      await seedInitialCategories();
      toast.success('Categories auto-populated successfully!');
    } catch (error) {
      toast.error('Failed to auto-populate categories.');
    }
  };

  return (
    <div className="w-full">
      <div className="bg-surface-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6 border-b border-outline-variant pb-2">
          <h2 className="text-xl font-bold text-on-surface">Category Directory</h2>
          
          <form action={handleAutoPopulate}>
            <button type="submit" className="bg-primary/10 text-primary px-3 py-1 rounded-md text-xs font-bold hover:bg-primary/20 transition-colors">
              Auto-Populate Existing Categories
            </button>
          </form>
        </div>
        
        <AddCategoryForm />

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
                  <tr className="bg-surface-variant/10">
                    <td className="px-4 py-3 font-bold text-on-surface">{cat.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded text-[10px] font-bold ${cat.isVisible ? 'bg-emerald-100 text-emerald-700' : 'bg-surface-variant text-on-surface-variant'}`}>
                        {cat.isVisible ? 'VISIBLE' : 'HIDDEN'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right flex items-center justify-end gap-2">
                      <form action={async (data) => { 
                        try {
                          await upsertCategory(data, cat.id);
                          toast.success('Category visibility updated!');
                        } catch (error) {
                          toast.error('Failed to update visibility.');
                        }
                      }}>
                        <input type="hidden" name="name" value={cat.name} />
                        <input type="hidden" name="isVisible" value={cat.isVisible ? '' : 'on'} />
                        <button className="bg-surface-variant/50 text-on-surface px-3 py-1.5 rounded text-xs font-bold hover:bg-surface-variant transition-colors" type="submit">
                          {cat.isVisible ? 'Hide' : 'Show'}
                        </button>
                      </form>
                      <ConfirmSubmitButton 
                        formAction={async () => {
                          try {
                            await deleteCategory(cat.id);
                            toast.success('Category deleted.');
                          } catch (error) {
                            toast.error('Failed to delete category.');
                          }
                        }} 
                        className="bg-error/10 text-error px-3 py-1.5 rounded text-xs font-bold hover:bg-error hover:text-white transition-colors"
                        message="Are you sure you want to delete this category? This will also remove all associated sub-categories."
                      >
                        Delete
                      </ConfirmSubmitButton>
                    </td>
                  </tr>

                  {cat.services.map((service: any) => (
                    <tr key={service.id} className="hover:bg-surface-variant/5">
                      <td className="px-4 py-2 pl-10 text-on-surface-variant flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px] text-outline">subdirectory_arrow_right</span>
                        {service.name}
                      </td>
                      <td className="px-4 py-2 text-center"></td>
                      <td className="px-4 py-2 text-right">
                        <ConfirmSubmitButton 
                          formAction={async () => {
                            try {
                              await deleteServiceType(service.id);
                              toast.success('Category deleted.'); // User instructed "Category deleted." for "Delete Category / Remove Sub-Category"
                            } catch (error) {
                              toast.error('Failed to delete category.');
                            }
                          }} 
                          className="bg-error/10 text-error px-2 py-1 rounded text-[10px] uppercase tracking-wider font-bold hover:bg-error hover:text-white transition-colors"
                          message="Are you sure you want to remove this sub-category?"
                        >
                          Remove
                        </ConfirmSubmitButton>
                      </td>
                    </tr>
                  ))}

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
  );
}
