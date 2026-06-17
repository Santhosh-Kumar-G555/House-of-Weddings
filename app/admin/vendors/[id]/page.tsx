import React from 'react';
import prisma from '@/server/db/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { upsertVendor } from '@/server/actions/admin';
import VendorProfileForm from '@/components/modules/vendors/VendorProfileForm';

export default async function VendorEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
    redirect('/');
  }

  const resolvedParams = await params;
  const isNew = resolvedParams.id === 'new';
  
  // If editing, fetch the existing vendor
  let vendor = null;
  if (!isNew) {
    vendor = await prisma.vendor.findUnique({ where: { id: resolvedParams.id } });
    if (!vendor) redirect('/admin/vendors'); // Failsafe if ID is invalid
  }

  // Fetch all categories so Admins can select them (including hidden ones)
  const dynamicCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { services: { orderBy: { name: 'asc' } } }
  });

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/vendors" className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">{isNew ? 'Add New Vendor' : `Editing: ${vendor?.name}`}</h1>
          <p className="text-on-surface-variant text-sm">Comprehensive portfolio management.</p>
        </div>
      </div>

      <VendorProfileForm 
        vendorData={vendor || {}} 
        isAdmin={true} 
        dynamicCategories={dynamicCategories}
      />
    </div>
  );
}
