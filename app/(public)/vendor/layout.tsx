import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import prisma from '@/server/db/prisma';
import SignOutButton from '@/components/modules/SignOutButton';

export default async function VendorLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  // Verify the user is actually a registered vendor
  const vendor = await prisma.vendor.findFirst({
    where: { userId: session.user.id } // Adjust this if your schema uses a different relation
  });

  if (!vendor) {
    // If they aren't a vendor, send them back to the regular user profile
    redirect('/profile'); 
  }

  return (
    <div className="w-full min-h-screen bg-surface flex flex-col md:flex-row">
      {/* Vendor Sidebar */}
      <aside className="hidden md:flex w-full md:w-64 border-r border-outline-variant bg-surface-container-lowest flex-shrink-0 flex-col fixed top-[72px] h-[calc(100vh-72px)] z-40">
        
        {/* Header */}
        <div className="p-6 border-b border-outline-variant flex-shrink-0">
          <p className="font-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Vendor Portal</p>
          <h2 className="font-headline-sm font-bold text-primary truncate">{vendor.name}</h2>
        </div>
        
        {/* Scrollable Links Area */}
        <nav className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
          <Link href="/vendor/dashboard" className="px-4 py-3 rounded font-label-md hover:bg-surface-variant transition-colors text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined">dashboard</span> Dashboard
          </Link>
          <Link href="/vendor/appointments" className="px-4 py-3 rounded font-label-md hover:bg-surface-variant transition-colors text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined">calendar_month</span> Appointments
          </Link>
          <Link href="/vendor/portfolio" className="px-4 py-3 rounded font-label-md hover:bg-surface-variant transition-colors text-on-surface flex items-center gap-3">
            <span className="material-symbols-outlined">collections_bookmark</span> Portfolio
          </Link>
        </nav>

        {/* Anchored Footer */}
        <div className="p-4 flex-shrink-0 bg-surface-container-lowest mt-auto">
          <SignOutButton />
        </div>
      </aside>

      {/* Vendor Page Content - Forced w-full and min-w-[0px] to kill the squish bug */}
      <main className="flex-1 w-full min-w-[0px] bg-surface-container-lowest p-6 md:p-12 overflow-y-auto md:ml-64">
        <div className="w-full max-w-5xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
