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
        <PersonalInfoForm user={{ 
          email: dbUser?.email || '', 
          fullName: dbUser?.fullName || null, 
          phone: dbUser?.phone || null,
          image: dbUser?.image || null
        }} />

        {/* Card 2: Plan Details */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded p-8 flex flex-col">
           <h2 className="font-headline-md text-xl font-bold text-primary mb-6 border-b border-outline-variant pb-4">Current Subscription</h2>
           
           <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6">
              <div>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Active Plan</p>
                <p className="font-headline-xl text-4xl text-primary font-bold">Free Basic</p>
              </div>
              
              <div className="w-full grid grid-cols-2 gap-4 border-t border-b border-outline-variant py-4">
                <div>
                  <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Start Date</p>
                  <p className="font-label-md text-on-surface mt-1">Oct 12, 2025</p>
                </div>
                <div>
                  <p className="text-[12px] font-bold text-on-surface-variant uppercase tracking-wider">Expiry Date</p>
                  <p className="font-label-md text-on-surface mt-1">Lifetime</p>
                </div>
              </div>
           </div>

           <button className="w-full bg-surface-variant text-primary font-label-md py-3 rounded hover:bg-surface-container-highest transition-opacity mt-8 border border-outline-variant cursor-pointer" type="button">
            Upgrade Plan
          </button>
        </div>
      </div>

      {/* Bottom Full-Width Card: Event Management */}
      <EventPlanner events={userEvents} />
    </>
  );
}
