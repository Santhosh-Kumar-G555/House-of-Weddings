import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import prisma from '@/server/db/prisma';
import Link from 'next/link';

// Helper function to colorize appointment statuses
const getStatusBadge = (status: string) => {
  const s = status.toUpperCase();
  if (s === 'PENDING') return 'bg-orange-100 text-orange-800 border-orange-200';
  if (s === 'CANCELLED' || s === 'REJECTED') return 'bg-error/10 text-error border-error/20';
  if (s === 'CONFIRMED' || s === 'APPROVED') return 'bg-green-100 text-green-800 border-green-200';
  return 'bg-surface-variant text-on-surface-variant border-outline-variant';
};

// Helper function for the card's left border accent
const getStatusAccent = (status: string) => {
  const s = status.toUpperCase();
  if (s === 'PENDING') return 'bg-orange-400';
  if (s === 'CANCELLED' || s === 'REJECTED') return 'bg-error';
  if (s === 'CONFIRMED' || s === 'APPROVED') return 'bg-green-500';
  return 'bg-outline-variant';
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect('/login?callbackUrl=/profile/dashboard');

  const userId = session.user.id;

  // Fetch all dashboard data in parallel
  const [userData, favCount, shortlistCount, aptCount, upcomingApts] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { fullName: true, email: true, phone: true }
    }),
    prisma.favourite.count({ where: { userId } }),
    prisma.shortlist.count({ where: { userId } }),
    prisma.appointment.count({ where: { userId } }),
    prisma.appointment.findMany({
      where: { userId },
      take: 3,
      orderBy: { createdAt: 'desc' }, // Or 'date' if you have a specific date field
      include: {
        vendor: { select: { slug: true } }
      }
    })
  ]);

  // Placeholder for events until the Event Planner is built
  const plannedEventsCount = 0;

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold text-on-surface">
          Welcome back, {userData?.fullName || 'User'}!
        </h1>
        <p className="text-on-surface-variant mt-1">
          Here is a quick overview of your wedding planning progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Magic UI: Overview Metrics Card */}
        <div className="lg:col-span-5 bg-surface-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-on-surface mb-6">Overview</h2>

          <div className="space-y-4">
            {/* Metric 1: Favourite Vendors */}
            <div className="relative flex items-center justify-between p-4 rounded-xl bg-surface hover:shadow-md transition-all border border-outline-variant/40 overflow-hidden group">
              {/* Left Edge Accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary" />

              <div className="flex items-center gap-4 pl-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">favorite</span>
                </div>
                <span className="font-bold text-on-surface text-lg">Favourite Vendors</span>
              </div>
              <span className="px-4 py-1.5 bg-primary/10 text-primary font-bold rounded-md text-sm">
                {favCount}
              </span>
            </div>

            {/* Metric 2: Appointments */}
            <div className="relative flex items-center justify-between p-4 rounded-xl bg-surface hover:shadow-md transition-all border border-outline-variant/40 overflow-hidden group">
              {/* Left Edge Accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-secondary" />

              <div className="flex items-center gap-4 pl-3">
                <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <span className="font-bold text-on-surface text-lg">Appointments</span>
              </div>
              <span className="px-4 py-1.5 bg-secondary/10 text-secondary font-bold rounded-md text-sm">
                {aptCount}
              </span>
            </div>

            {/* Metric 3: Planned Events */}
            <div className="relative flex items-center justify-between p-4 rounded-xl bg-surface hover:shadow-md transition-all border border-outline-variant/40 overflow-hidden group">
              {/* Left Edge Accent */}
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-tertiary" />

              <div className="flex items-center gap-4 pl-3">
                <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined">celebration</span>
                </div>
                <span className="font-bold text-on-surface text-lg">Planned Events</span>
              </div>
              <span className="px-4 py-1.5 bg-tertiary/10 text-tertiary font-bold rounded-md text-sm">
                {plannedEventsCount}
              </span>
            </div>
          </div>
        </div>

        {/* Magic UI: Appointments List Card */}
        <div className="lg:col-span-7 bg-surface-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-on-surface">Upcoming Appointments</h2>
            <Link href="/profile/appointments" className="text-sm font-bold text-primary hover:underline">
              View All
            </Link>
          </div>

          {upcomingApts.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-outline-variant rounded-xl">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">event_busy</span>
              <p className="text-on-surface-variant font-medium">No upcoming appointments</p>
              <Link href="/vendors" className="text-sm text-primary hover:underline mt-1">Book a vendor</Link>
            </div>
          ) : (
            <div className="space-y-3 flex-1">
              {upcomingApts.map((apt) => (
                <div
                  key={apt.id}
                  className="relative flex items-center justify-between p-4 rounded-xl bg-surface hover:shadow-md transition-all border border-outline-variant/40 overflow-hidden group"
                >
                  {/* Left Edge Accent Line */}
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${getStatusAccent(apt.status || 'PENDING')}`} />

                  <div className="pl-3">
                    {/* Cleaned Vendor Name */}
                    <p className="font-bold text-on-surface capitalize text-lg group-hover:text-primary transition-colors">
                      {apt.vendor.slug.replace(/-[a-zA-Z0-9]+$/, '').replace(/-/g, ' ')}
                    </p>

                    {/* Sleek Date Pill */}
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-surface-variant/50 text-on-surface-variant text-xs font-bold rounded-md">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {new Date(apt.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Standardized Badge */}
                  <span className={`px-3 py-1.5 text-[10px] sm:text-xs font-bold rounded-md uppercase tracking-wider ${getStatusBadge(apt.status || 'PENDING')}`}>
                    {apt.status || 'PENDING'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Account Details Section */}
      <div className="bg-surface-lowest border border-outline-variant rounded-2xl p-6 shadow-sm mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-on-surface">Account Details</h2>
          <Link href="/profile" className="text-sm font-bold text-primary hover:underline">
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Name Card */}
          <div className="relative p-4 rounded-xl bg-surface hover:shadow-md transition-all border border-outline-variant/40 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-outline-variant" />
            <p className="text-sm text-on-surface-variant mb-1 pl-2">Full Name</p>
            <p className="font-bold text-on-surface text-lg pl-2">{userData?.fullName || 'Not provided'}</p>
          </div>

          {/* Email Card */}
          <div className="relative p-4 rounded-xl bg-surface hover:shadow-md transition-all border border-outline-variant/40 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-outline-variant" />
            <p className="text-sm text-on-surface-variant mb-1 pl-2">Email Address</p>
            <p className="font-bold text-on-surface text-lg pl-2 truncate">{userData?.email || 'Not provided'}</p>
          </div>

          {/* Phone Card */}
          <div className="relative p-4 rounded-xl bg-surface hover:shadow-md transition-all border border-outline-variant/40 overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-outline-variant" />
            <p className="text-sm text-on-surface-variant mb-1 pl-2">Phone Number</p>
            <p className="font-bold text-on-surface text-lg pl-2">{userData?.phone || 'Not provided'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
