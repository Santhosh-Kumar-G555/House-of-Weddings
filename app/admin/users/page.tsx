import React, { Suspense } from 'react';
import prisma from '@/server/db/prisma';
import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { deleteUserAccount } from '@/server/actions/admin';
import Link from 'next/link';
import { DeleteUserButton } from '@/components/modules/admin/DeleteUserButton';
import Pagination from '@/components/modules/admin/Pagination';

export const dynamic = 'force-dynamic';

// In Next.js 13+, searchParams are passed as a prop to page components
export default async function UserManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const session = await auth();
  if (!session?.user || ((session.user as any).role !== 'ADMIN' && (session.user as any).role !== 'SUPER_ADMIN')) {
    redirect('/');
  }

  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q || '';
  const ITEMS_PER_PAGE = 10;
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const whereClause = {
    role: 'USER' as const,
    OR: [
      { fullName: { contains: query, mode: 'insensitive' as const } },
      { email: { contains: query, mode: 'insensitive' as const } },
    ],
  };

  const [totalUsers, users] = await Promise.all([
    prisma.user.count({ where: whereClause }),
    prisma.user.findMany({
      where: whereClause,
      orderBy: [
        { createdAt: 'desc' },
        { id: 'asc' }
      ],
      skip,
      take: ITEMS_PER_PAGE,
    })
  ]);

  const totalPages = Math.ceil(totalUsers / ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-on-surface mb-2">User Management</h1>
          <p className="text-on-surface-variant text-sm md:text-base">
            Search, review, and manage standard platform users.
          </p>
        </div>
        {/* ADD THIS BUTTON */}
        <Link href="/admin/users/new" className="bg-primary text-on-primary px-4 py-2 rounded-md font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
          <span className="material-symbols-outlined text-[20px]">add</span> Add User
        </Link>
      </div>

      {/* Search Bar - Uses a standard form with GET method to update URL searchParams */}
      <div className="bg-surface-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex items-center gap-4">
        <form action="/admin/users" method="GET" className="flex-1 flex items-center gap-2">
          <span className="material-symbols-outlined text-on-surface-variant ml-2">search</span>
          <input 
            type="text" 
            name="q"
            defaultValue={query}
            placeholder="Search users by name or email..." 
            className="w-full px-2 py-2 bg-transparent border-none focus:ring-0 outline-none text-on-surface"
            aria-label="Search Users"
          />
          {/* Ensure a new search resets to page 1 */}
          <input type="hidden" name="page" value="1" />
          <button type="submit" className="hidden">Search</button> {/* Hidden submit to trigger on Enter key */}
        </form>
        {query && (
          <Link href="/admin/users" className="text-xs font-bold text-error hover:underline px-4">
            Clear
          </Link>
        )}
      </div>

      {/* User Data Table */}
      <div className="bg-surface-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-surface-variant/30 text-xs uppercase tracking-wider text-on-surface-variant">
                <th className="px-6 py-4 font-bold">User</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold">Joined Date</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-surface-variant/30 transition-colors">
                  <td className="px-6 py-4 font-medium text-on-surface flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold text-xs">
                      {user.fullName?.charAt(0) || 'U'}
                    </div>
                    {user.fullName || 'Unnamed User'}
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right flex items-center justify-end gap-4">
                    {/* ADD THIS EDIT LINK */}
                    <Link href={`/admin/users/${user.id}`} className="text-primary text-sm font-bold hover:underline">
                      Edit
                    </Link>

                    <DeleteUserButton 
                      userName={user.fullName || 'this user'} 
                      action={async () => {
                        'use server';
                        await deleteUserAccount(user.id);
                      }} 
                    />
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined text-4xl mb-2 opacity-50">person_off</span>
                    <p>No users found matching "{query}"</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Suspense fallback={<div className="p-4 text-center text-sm text-on-surface-variant">Loading pagination...</div>}>
          <Pagination totalPages={totalPages} />
        </Suspense>
      </div>

    </div>
  );
}
