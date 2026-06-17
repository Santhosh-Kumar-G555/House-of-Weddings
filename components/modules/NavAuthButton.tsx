import Link from 'next/link';
import { auth } from '@/auth';

/**
 * NavAuthButton — async Server Component
 * Reads the session on the server and renders either a profile
 * icon (logged in) or a Log In link (logged out).
 * This is composed into the Navbar via the RootLayout to keep
 * Navbar as a "use client" component with its local state.
 */
export default async function NavAuthButton() {
  const session = await auth();

  if (session?.user) {
    const role = (session.user as any).role;
    let profileDestination = '/profile';
    
    if (role === 'SUPER_ADMIN' || role === 'ADMIN') {
      profileDestination = '/admin/dashboard';
    } else if (role === 'VENDOR') {
      profileDestination = '/vendor/dashboard';
    }

    return (
      <Link
        href={profileDestination}
        id="navbar-profile-link"
        aria-label="View your profile"
        className="hidden md:flex items-center justify-center w-9 h-9 rounded
          text-primary transition-all duration-150
          hover:bg-surface-container
          focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <span className="material-symbols-outlined text-[28px]">account_circle</span>
      </Link>
    );
  }

  return (
    <Link
      id="navbar-login-btn"
      href="/login"
      className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded text-sm font-semibold
        transition-colors duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
      style={{
        fontFamily: 'var(--font-sans)',
        background: 'var(--color-primary-container)',
        color: 'var(--color-on-primary-container)',
        textDecoration: 'none',
      }}
    >
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
      Log In
    </Link>
  );
}
