import React from 'react';
import { auth } from '@/auth';
import prisma from '@/server/db/prisma';
import { redirect } from 'next/navigation';
import EditableVendorProfile from '@/components/modules/EditableVendorProfile';

export default async function VendorPortfolioPage() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== 'VENDOR') redirect('/login');

  const vendor = await prisma.vendor.findFirst({
    where: { userId: session.user.id },
    include: {
      portfolio: true // Fetch any existing images/portfolio data
    }
  });

  if (!vendor) redirect('/profile');

  // Fetch all categories (vendors can see all categories)
  const dynamicCategories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { services: { orderBy: { name: 'asc' } } }
  });

  return (
    <div className="w-full animate-in fade-in duration-500">
      <EditableVendorProfile vendorData={vendor} dynamicCategories={dynamicCategories} />
    </div>
  );
}
