'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

export default function DynamicFooterWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Determine if we are on a dashboard page with a fixed sidebar
  let paddingClass = '';
  if (pathname.startsWith('/admin')) {
    paddingClass = 'md:pl-64'; // 256px
  } else if (pathname.startsWith('/vendor/') || pathname === '/vendor') {
    paddingClass = 'md:pl-64'; // 256px
  } else if (pathname.startsWith('/profile')) {
    paddingClass = 'md:pl-[280px]'; // 280px
  }

  return (
    <div className={`w-full transition-all duration-300 ${paddingClass}`}>
      {children}
    </div>
  );
}
