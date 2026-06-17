import React from 'react';
import prisma from '@/server/db/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { upsertUser } from '@/server/actions/admin';

export default async function UserEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
    redirect('/');
  }

  // 1. Capture the logged-in user's role
  const currentUserRole = (session.user as any).role;

  const resolvedParams = await params;
  const isNew = resolvedParams.id === 'new';
  
  // If editing, fetch the existing user
  let user = null;
  if (!isNew) {
    user = await prisma.user.findUnique({ where: { id: resolvedParams.id } });
    if (!user) redirect('/admin/users'); // Failsafe if ID is invalid
  }

  return (
    <div className="w-full flex-1 shrink-0 md:min-w-[600px] max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users" className="text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-on-surface">{isNew ? 'Add New User' : 'Edit User Profile'}</h1>
          <p className="text-on-surface-variant text-sm">Fill out the details below to update the user record.</p>
        </div>
      </div>

      <div className="bg-surface-lowest border border-outline-variant rounded-xl p-8 shadow-sm">
        <form action={async (formData) => {
          'use server';
          const res = await upsertUser(formData, resolvedParams.id);
          if (res?.error) {
            throw new Error(res.error);
          }
          redirect('/admin/users'); // Send them back to the table after saving
        }} className="space-y-6">
          
          <div>
            <label htmlFor="user-fullname" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Full Name</label>
            <input 
              id="user-fullname"
              type="text" name="fullName" required defaultValue={user?.fullName || ''}
              className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none text-on-surface"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="user-email" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Email Address</label>
              <input 
                id="user-email"
                type="email" name="email" required defaultValue={user?.email || ''}
                className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none text-on-surface"
              />
            </div>
            <div>
              <label htmlFor="user-role" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Role</label>
              <select 
                id="user-role"
                name="role" required defaultValue={user?.role || 'USER'}
                className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none text-on-surface"
              >
                <option value="USER">User</option>
                <option value="VENDOR">Vendor</option>
                
                {/* SECURITY: Only show the Admin option if the person viewing the page is a SUPER_ADMIN */}
                {currentUserRole === 'SUPER_ADMIN' && (
                  <option value="ADMIN">Admin</option>
                )}
              </select>
            </div>
          </div>

          {isNew && (
            <div>
              <label htmlFor="user-password" className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2 block">Initial Password</label>
              <input 
                id="user-password"
                type="text" name="password" required={isNew}
                placeholder="Set a secure password..."
                className="w-full px-4 py-2 bg-transparent border border-outline-variant rounded-md focus:border-primary outline-none text-on-surface"
              />
              <p className="text-xs text-on-surface-variant mt-1">Provide this temporary password to the user so they can log in.</p>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-4">
            <Link href="/admin/users" className="px-6 py-2 font-bold text-on-surface-variant hover:bg-surface-variant rounded-md transition-colors">
              Cancel
            </Link>
            <button type="submit" className="bg-primary text-on-primary px-6 py-2 rounded-md font-bold hover:bg-primary/90 transition-colors">
              {isNew ? 'Create User' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
