import React from 'react';
import prisma from '@/server/db/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { revokeAdmin, promoteToAdmin } from '@/server/actions/super-admin';

export default async function ManageAdminsPage() {
  // 1. Absolute Security Check: Kick out anyone who isn't the Super Admin
  const session = await auth();
  if ((session?.user as any)?.role !== 'SUPER_ADMIN') {
    redirect('/admin/dashboard');
  }

  // 2. Fetch all personnel with Admin or Super Admin roles
  const adminStaff = await prisma.user.findMany({
    where: { role: { in: ['ADMIN', 'SUPER_ADMIN'] } },
    orderBy: { role: 'desc' }, // Puts Super Admin at the top
    select: { id: true, fullName: true, email: true, role: true, createdAt: true }
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface mb-2">Manage Administrators</h1>
        <p className="text-on-surface-variant text-sm md:text-base">
          Super Admin exclusive access. Elevate trusted users to administrative roles or revoke system access.
        </p>
      </div>

      {/* Add New Admin Form */}
      <div className="bg-surface-lowest border border-outline-variant rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-on-surface mb-4">Promote User to Admin</h2>
        <form action={async (formData) => {
          'use server';
          const email = formData.get('email') as string;
          await promoteToAdmin(email);
        }} className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="admin-email" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1 block">User Email</label>
            <input 
              id="admin-email"
              type="email" 
              name="email"
              required 
              placeholder="Enter existing user email..." 
              className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none text-on-surface"
            />
          </div>
          <button type="submit" className="bg-primary text-on-primary px-6 py-2 rounded-md font-bold hover:bg-primary/90 transition-colors h-[42px]">
            Grant Access
          </button>
        </form>
      </div>

      {/* Active Admin Roster */}
      <div className="bg-surface-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant bg-surface-variant/30 text-xs uppercase tracking-wider text-on-surface-variant">
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Email</th>
              <th className="px-6 py-4 font-bold">Access Level</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {adminStaff.map((staff) => (
              <tr key={staff.id} className="hover:bg-surface-variant/30 transition-colors">
                <td className="px-6 py-4 font-medium text-on-surface flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {staff.fullName?.charAt(0) || 'U'}
                  </div>
                  {staff.fullName || 'Unnamed User'}
                </td>
                <td className="px-6 py-4 text-sm text-on-surface-variant">{staff.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    staff.role === 'SUPER_ADMIN' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
                  }`}>
                    {staff.role.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {staff.role !== 'SUPER_ADMIN' && (
                    <form action={async () => {
                      'use server';
                      await revokeAdmin(staff.id);
                    }}>
                      <button type="submit" className="text-error text-sm font-bold hover:underline">
                        Revoke Access
                      </button>
                    </form>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
