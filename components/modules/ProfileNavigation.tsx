'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import SignOutButton from './SignOutButton';

// Map routes to their respective tabs. Vendors links to the public directory.
const navItems = [
  { name: 'Dashboard', icon: 'dashboard', href: '/profile/dashboard' },
  { name: 'User Details', icon: 'person', href: '/profile' },
  { name: 'Podcasts', icon: 'podcasts', href: '/podcasts' },
  { name: 'Vendors', icon: 'storefront', href: '/vendors' },
  { name: 'Favourites', icon: 'favorite', href: '/profile/favourites' },
  { name: 'Shortlists', icon: 'bookmark', href: '/profile/shortlists' },
  { name: 'Compare', icon: 'compare_arrows', href: '/profile/compare' },
  { name: 'Appointments', icon: 'calendar_month', href: '/profile/appointments' },
];

export default function ProfileNavigation() {
  const pathname = usePathname();



  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="w-[280px] bg-surface-container-lowest border-r border-outline-variant hidden md:flex flex-col shrink-0 fixed top-[72px] h-[calc(100vh-72px)] z-40">
        <div className="py-8 px-6 border-b border-outline-variant flex-shrink-0">
          <p className="font-label-sm text-on-surface-variant uppercase tracking-widest px-4">My Account</p>
        </div>
        <nav className="p-4 flex flex-col gap-2 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.name} 
                  href={item.href} 
                  className={`flex items-center gap-3 px-4 py-3 rounded transition-colors ${isActive ? 'bg-primary text-on-primary font-bold' : 'text-on-surface hover:bg-surface-variant'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="font-label-md">{item.name}</span>
                </Link>
              );
            })}
          </nav>

        {/* Anchored Footer */}
        <div className="p-4 flex-shrink-0 bg-surface-container-lowest mt-auto">
          <SignOutButton />
        </div>
      </aside>

      {/* MOBILE HORIZONTAL NAV */}
      <div className="md:hidden flex overflow-x-auto gap-4 pb-4 mb-6 border-b border-outline-variant snap-x scrollbar-hide w-full px-6 pt-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.name} 
              href={item.href} 
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap snap-start transition-colors ${isActive ? 'bg-primary text-on-primary font-bold' : 'bg-surface-container-lowest text-on-surface border border-outline-variant'}`}
            >
              <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              <span className="font-label-sm">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
