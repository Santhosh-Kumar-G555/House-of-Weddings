import React from 'react';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import ProfileNavigation from '@/components/modules/ProfileNavigation';

export default async function ProfileLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Lockout: Vendors do not belong here
  if ((session.user as any).role === 'VENDOR') {
    redirect('/vendor/dashboard');
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface-container-low w-full">
      <ProfileNavigation />
      <section className="flex-1 px-6 md:px-12 py-10 overflow-y-auto md:ml-[280px]">
        {children}
      </section>
    </div>
  );
}
