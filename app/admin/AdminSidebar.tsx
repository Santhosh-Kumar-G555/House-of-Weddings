'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';

export default function AdminSidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
    { name: 'User Management', path: '/admin/users', icon: 'group' },
    { name: 'Vendor Directory', path: '/admin/vendors', icon: 'storefront' },
    { name: 'Appointments', path: '/admin/appointments', icon: 'calendar_today' },
    { name: 'System Settings', path: '/admin/settings', icon: 'settings' },
  ];

  if (role === 'SUPER_ADMIN') {
    navItems.splice(1, 0, { name: 'Manage Admins', path: '/admin/manage-admins', icon: 'admin_panel_settings' });
  }

  return (
    <aside className="w-64 h-[calc(100vh-72px)] fixed top-[72px] bg-surface-lowest border-r border-outline-variant flex flex-col hidden md:flex z-40">
      <div className="h-16 flex items-center px-6 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">diamond</span>
          <span className="font-headline-sm font-bold text-on-surface tracking-wide">House of Weddings</span>
        </div>
      </div>
      
      <div className="px-6 py-4">
        <p className="text-xs font-bold text-on-surface-variant tracking-widest uppercase mb-4">Admin Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link 
              key={item.name} 
              href={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive 
                  ? 'bg-primary/10 text-primary' 
                  : 'text-on-surface-variant hover:bg-surface-variant hover:text-on-surface'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                {item.icon}
              </span>
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Logout Action */}
      <div className="mt-auto sticky bottom-0 w-full p-4 bg-surface-lowest z-10">
        <button 
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors" type="button"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
