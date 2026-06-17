import React, { Suspense } from 'react';
import prisma from '@/server/db/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Pagination from '@/components/modules/admin/Pagination';
import { updateAppointmentStatus } from '@/server/actions/admin';

export const dynamic = 'force-dynamic'; // Prevent aggressive caching

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
    redirect('/');
  }

  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';
  const statusFilter = resolvedParams.status || '';
  
  const ITEMS_PER_PAGE = 10;
  const currentPage = Number(resolvedParams.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  // Build a dynamic where clause based on filters
  const whereClause: any = {};
  if (statusFilter) {
    whereClause.status = statusFilter;
  }
  if (query) {
    whereClause.OR = [
      { user: { fullName: { contains: query, mode: 'insensitive' } } },
      { vendor: { name: { contains: query, mode: 'insensitive' } } },
    ];
  }

  // Fetch paginated data and include relations
  const [totalAppointments, appointments] = await Promise.all([
    prisma.appointment.count({ where: whereClause }),
    prisma.appointment.findMany({
      where: whereClause,
      include: {
        user: { select: { fullName: true, email: true } },
        vendor: { select: { name: true } }
      },
      orderBy: [{ createdAt: 'desc' }, { id: 'asc' }],
      skip,
      take: ITEMS_PER_PAGE,
    })
  ]);

  const totalPages = Math.ceil(totalAppointments / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">Appointments</h1>
          <p className="text-on-surface-variant text-sm md:text-base">
            Monitor and manage booking requests between users and vendors.
          </p>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-surface-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
        
        {/* Search Bar */}
        <form action="/admin/appointments" method="GET" className="flex-1 flex items-center gap-2 bg-surface-variant/30 rounded-md px-3 py-1">
          <span className="material-symbols-outlined text-on-surface-variant text-sm">search</span>
          <input 
            type="text" 
            name="q"
            defaultValue={query}
            placeholder="Search by user or vendor name..." 
            className="w-full px-2 py-2 bg-transparent border-none focus:ring-0 outline-none text-on-surface text-sm"
            aria-label="Search Appointments"
          />
          {statusFilter && <input type="hidden" name="status" value={statusFilter} />}
          <input type="hidden" name="page" value="1" />
          <button type="submit" className="hidden">Search</button>
        </form>

        {/* Status Filter Buttons */}
        <div className="flex items-center gap-2 text-sm">
          <Link 
            href={`/admin/appointments?q=${query}`} 
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${!statusFilter ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface hover:bg-surface-variant/80'}`}
          >
            All
          </Link>
          <Link 
            href={`/admin/appointments?q=${query}&status=PENDING`} 
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${statusFilter === 'PENDING' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface hover:bg-surface-variant/80'}`}
          >
            Pending
          </Link>
          <Link 
            href={`/admin/appointments?q=${query}&status=CONFIRMED`} 
            className={`px-3 py-1.5 rounded-md font-bold transition-colors ${statusFilter === 'CONFIRMED' ? 'bg-primary text-on-primary' : 'bg-surface-variant text-on-surface hover:bg-surface-variant/80'}`}
          >
            Confirmed
          </Link>
        </div>

        {(query || statusFilter) && (
          <Link href="/admin/appointments" className="text-xs font-bold text-error hover:underline px-2">
            Clear Filters
          </Link>
        )}
      </div>

      {/* Appointments Table */}
      <div className="bg-surface-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-variant/30 text-xs uppercase tracking-wider text-on-surface-variant">
                <th className="px-6 py-4 font-bold">Client</th>
                <th className="px-6 py-4 font-bold">Vendor</th>
                <th className="px-6 py-4 font-bold">Date Submitted</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 font-bold text-right">Admin Override</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {appointments.map((appt) => (
                <tr key={appt.id} className="hover:bg-surface-variant/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-on-surface">{appt.user?.fullName || 'Unknown User'}</p>
                    <p className="text-xs text-on-surface-variant">{appt.user?.email}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-primary">
                    {appt.vendor?.name || 'Unknown Vendor'}
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {new Date(appt.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      appt.status === 'PENDING' ? 'bg-error/10 text-error' : 
                      appt.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 
                      'bg-surface-variant text-on-surface-variant'
                    }`}>
                      {appt.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <form className="flex items-center justify-end gap-2">
                      {appt.status !== 'CONFIRMED' && (
                        <button 
                          formAction={async () => { 'use server'; await updateAppointmentStatus(appt.id, 'CONFIRMED'); }}
                          className="text-xs font-bold text-emerald-600 hover:underline" type="submit"
                        >
                          Confirm
                        </button>
                      )}
                      {appt.status !== 'CANCELLED' && (
                        <button 
                          formAction={async () => { 'use server'; await updateAppointmentStatus(appt.id, 'CANCELLED'); }}
                          className="text-xs font-bold text-error hover:underline" type="submit"
                        >
                          Cancel
                        </button>
                      )}
                    </form>
                  </td>
                </tr>
              ))}
              {appointments.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">calendar_add_on</span>
                    <p>No appointments found.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Safe Pagination Injection */}
        <Suspense fallback={<div className="p-4 text-center text-sm text-on-surface-variant">Loading pagination...</div>}>
          <Pagination totalPages={totalPages} />
        </Suspense>
      </div>

    </div>
  );
}
