import React from 'react';
import { auth, signOut } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/server/db/prisma';
import EventPlanner from '@/components/modules/EventPlanner';

import PersonalInfoForm from '@/components/modules/PersonalInfoForm';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  // Fetch live events and user details in parallel
  const [userEvents, dbUser] = await Promise.all([
    prisma.userEvent.findMany({
      where: { userId: session.user.id! },
      orderBy: { date: 'asc' }
    }),
    prisma.user.findUnique({
      where: { id: session.user.id }
    })
  ]);

  return (
    <>
      <h1 className="font-headline-xl text-4xl font-bold text-primary mb-8 tracking-tight">User Details</h1>

      {/* Top Grid: Personal Details & Plan Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Card 1: Personal Details */}
        <div className="lg:col-span-2 max-w-2xl">
          <PersonalInfoForm user={{ 
            email: dbUser?.email || '', 
            fullName: dbUser?.fullName || null, 
            phone: dbUser?.phone || null,
            image: dbUser?.image || null
          }} />
        </div>
      </div>

      {/* Bottom Full-Width Card: Event Management */}
      <EventPlanner events={userEvents} />
    </>
  );
}
