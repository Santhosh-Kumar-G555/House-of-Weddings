'use client';

import { useRouter, usePathname } from 'next/navigation';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  // Hide on the absolute root home page
  if (pathname === '/') {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-1 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group -ml-1"
      aria-label="Go back"
    >
      <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-1 transition-transform">
        arrow_back
      </span>
      Back
    </button>
  );
}
