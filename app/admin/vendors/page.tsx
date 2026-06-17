import React, { Suspense } from 'react';
import prisma from '@/server/db/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { deleteVendorProfile } from '@/server/actions/admin';
import { DeleteVendorButton } from '@/components/modules/admin/DeleteVendorButton';
import Pagination from '@/components/modules/admin/Pagination';

export const dynamic = 'force-dynamic';

// In Next.js 13+, searchParams are passed as a prop to page components
export default async function VendorManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
    redirect('/');
  }

  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';

  // Pagination Math
  const ITEMS_PER_PAGE = 10;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const whereClause = {
    OR: [
      { name: { contains: query, mode: 'insensitive' as const } },
      { city: { contains: query, mode: 'insensitive' as const } },
      { category: { contains: query, mode: 'insensitive' as const } },
    ],
  };

  // Fetch both the paginated data AND the total count simultaneously
  const [totalVendors, vendors] = await Promise.all([
    prisma.vendor.count({ where: whereClause }),
    prisma.vendor.findMany({
      where: whereClause,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }
      ],
      skip,
      take: ITEMS_PER_PAGE,
    })
  ]);

  const totalPages = Math.ceil(totalVendors / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto space-y-8">

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Vendor Directory</h1>
          <p className="text-on-surface-variant text-sm md:text-base">
            Oversight for all registered vendors and service providers.
          </p>
        </div>
        {/* ADD THIS BUTTON */}
        <Link href="/admin/vendors/new" className="bg-primary text-on-primary px-4 py-2 rounded-md font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-[20px]">add</span> Add Vendor
        </Link>
      </div>

      {/* Search Bar */}
      <div className="bg-surface-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex items-center gap-4">
        <form action="/admin/vendors" method="GET" className="flex-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant ml-2">search</span>
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search by vendor name, category, or city..."
            className="w-full px-2 py-2 bg-transparent border-none focus:ring-0 outline-none text-on-surface"
            aria-label="Search Vendors"
          />
          {/* Ensure a new search resets to page 1 */}
          <input type="hidden" name="page" value="1" />
          <button type="submit" className="hidden">Search</button>
        </form>
        {query && (
          <Link href="/admin/vendors" className="text-xs font-bold text-error hover:underline px-4">
            Clear
          </Link>
        )}
      </div>

      {/* Vendor Data Table */}
      <div className="bg-surface-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-variant/30 text-xs uppercase tracking-wider text-on-surface-variant">
                <th className="px-6 py-4 font-bold">Business Name</th>
                <th className="px-6 py-4 font-bold">Category</th>
                <th className="px-6 py-4 font-bold">Location</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {vendors.map((vendor) => (
                <tr key={vendor.id} className="hover:bg-surface-variant/30 transition-colors">
                  <td className="px-6 py-4 font-medium flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center text-primary font-bold shrink-0">
                      <span className="material-symbols-outlined text-[16px]">storefront</span>
                    </div>
                    <Link href={`/vendors/${vendor.id}`} target="_blank" className="text-on-surface hover:text-primary transition-colors hover:underline line-clamp-1">
                      {vendor.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant capitalize">{vendor.category}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{vendor.city}</td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                    {/* ADD THIS EDIT LINK */}
                    <Link href={`/admin/vendors/${vendor.id}`} className="text-primary text-sm font-bold hover:underline">
                      Edit
                    </Link>
                    
                    <DeleteVendorButton 
                      vendorName={vendor.name} 
                      action={async () => {
                        'use server';
                        await deleteVendorProfile(vendor.id);
                      }}
                    />
                  </td>
                </tr>
              ))}
              {vendors.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">search_off</span>
                    <p>No vendors found matching "{query}"</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Suspense fallback={<div className="p-4 text-center text-sm text-on-surface-variant">Loading pagination...</div>}>
          <Pagination totalPages={totalPages} />
        </Suspense>
      </div>

    </div>
  );
}
