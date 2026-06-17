'use client';

import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="w-full px-4 py-3 rounded font-label-md text-error hover:bg-error/10 transition-colors flex items-center gap-3 text-left cursor-pointer" type="button"
    >
      <span className="material-symbols-outlined">logout</span> Sign Out
    </button>
  );
}
