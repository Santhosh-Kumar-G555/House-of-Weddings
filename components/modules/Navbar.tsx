"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

/* ─────────────────────────────────────────────────────────────────
   NAV DATA
   ───────────────────────────────────────────────────────────────── */
const NAV_CATEGORIES = [
  { label: "Venues", href: "/vendors?category=venue", emoji: "🏛️" },
  { label: "Photography", href: "/vendors?category=photography", emoji: "📷" },
  { label: "Videography", href: "/vendors?category=videography", emoji: "🎬" },
  { label: "Florals", href: "/vendors?category=florals", emoji: "🌸" },
  { label: "Catering", href: "/vendors?category=catering", emoji: "🍽️" },
  { label: "Music & DJ", href: "/vendors?category=music-dj", emoji: "🎵" },
  { label: "Hair & Makeup", href: "/vendors?category=hair-makeup", emoji: "💄" },
  { label: "Décor", href: "/vendors?category=decor", emoji: "✨" },
  { label: "Cakes", href: "/vendors?category=cake-desserts", emoji: "🎂" },
  { label: "Invitations", href: "/vendors?category=invitation-stationery", emoji: "💌" },
] as const;

/* ─────────────────────────────────────────────────────────────────
   ICON COMPONENTS  (inline SVG — no extra dep)
   ───────────────────────────────────────────────────────────────── */
function IconSearch({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconX({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function IconMenu({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}


function IconUser({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ICON BUTTON  — accessible icon wrapper
   ───────────────────────────────────────────────────────────────── */
function IconBtn({
  label,
  onClick,
  active = false,
  children,
  id,
}: {
  label: string;
  onClick?: () => void;
  active?: boolean;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <button
      id={id}
      type="button"
      aria-label={label}
      onClick={onClick}
      className="relative flex items-center justify-center w-9 h-9 rounded
        text-[var(--color-on-surface-variant)] transition-all duration-150
        hover:bg-[var(--color-surface-container)] hover:text-[var(--color-primary)]
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
        focus-visible:ring-offset-1"
      style={{ color: active ? "var(--color-primary)" : undefined }}
    >
      {children}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   NAVBAR
   ───────────────────────────────────────────────────────────────── */
// react-doctor-disable-next-line no-giant-component, react-doctor/no-giant-component
export default function Navbar({ authButton, isLoggedIn }: { authButton?: React.ReactNode, isLoggedIn?: boolean }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Determine the correct destination based on role
  const role = (session?.user as any)?.role;
  const profileDestination = 
    role === 'SUPER_ADMIN' || role === 'ADMIN' 
      ? '/admin/dashboard' 
      : role === 'VENDOR'
      ? '/vendor/dashboard'
      : '/profile';

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);



  const closeAll = useCallback(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, []);

  const handleSearchToggle = () => {
    setSearchOpen((prev) => {
      const next = !prev;
      if (next) {
        requestAnimationFrame(() => searchInputRef.current?.focus());
      }
      return next;
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      closeAll();
      router.push(`/vendors?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  /* ── render ─────────────────────────────────────────────────── */
  return (
    <>
      {/* ══════════════════════════════════════════════
          MAIN NAVBAR
          ══════════════════════════════════════════════ */}
      <header
        className="w-full bg-[var(--color-surface)] border-b border-[var(--color-outline-variant)] sticky top-0 z-50"
      >
        <nav
          aria-label="Main navigation"
          className="w-full px-4 md:px-16 h-20 flex items-center justify-between"
        >

          {/* ── LEFT: Hamburger + Logo + Desktop category dropdown ── */}
          <div className="flex items-center gap-1 md:gap-3">

            {/* Hamburger — mobile only */}
            <div className="flex md:hidden">
              <IconBtn
                id="navbar-hamburger"
                label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileOpen((v) => !v)}
                active={mobileOpen}
              >
                {mobileOpen ? <IconX size={20} /> : <IconMenu size={22} />}
              </IconBtn>
            </div>

            {/* Logo wordmark */}
            <Link
              href="/"
              id="navbar-logo"
              aria-label="Minchu home"
              className="flex items-center gap-4 no-underline group"
              onClick={closeAll}
              style={{ color: "inherit" }}
            >
              {/* Decorative floral mark */}
              <span className="material-symbols-outlined text-primary text-3xl transition-transform duration-200 group-hover:scale-110">diamond</span>
              <span className="font-headline-md font-bold text-on-surface tracking-tight hidden sm:block group-hover:text-primary transition-colors">
                House of Weddings
              </span>
            </Link>
          </div>

          {/* ── RIGHT: Search + Profile ───────────────────────────── */}
          <div className="flex items-center gap-1 md:gap-2">

            {/* Search — expands inline on desktop, icon-only on mobile */}
            <div className="flex items-center">
              {/* Expanded search bar (desktop) */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center overflow-hidden transition-all duration-300 rounded border"
                style={{
                  width: searchOpen ? "220px" : "0px",
                  opacity: searchOpen ? 1 : 0,
                  pointerEvents: searchOpen ? "auto" : "none",
                  borderColor: searchOpen ? "var(--color-primary)" : "transparent",
                  background: "var(--color-surface-container-low)",
                  marginRight: searchOpen ? "4px" : "0px",
                }}
              >
                <input
                  ref={searchInputRef}
                  id="navbar-search-input"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vendors…"
                  aria-label="Search vendors"
                  className="flex-1 bg-transparent px-4 py-1.5 text-sm outline-none"
                  style={{
                    fontFamily: "var(--font-sans)",
                    color: "var(--color-on-surface)",
                    minWidth: 0,
                  }}
                />
                <button
                  type="submit"
                  aria-label="Submit search"
                  className="pr-3 text-[var(--color-primary)] hover:text-[var(--color-on-primary-container)]
                    transition-colors duration-150 focus:outline-none"
                >
                  <IconSearch size={16} />
                </button>
              </form>

              {/* Search icon button */}
              <IconBtn
                id="navbar-search-btn"
                label={searchOpen ? "Close search" : "Open search"}
                onClick={handleSearchToggle}
                active={searchOpen}
              >
                {searchOpen
                  ? <IconX size={18} />
                  : <IconSearch size={20} />
                }
              </IconBtn>
            </div>

            {/* Divider — desktop only */}
            <span
              className="hidden md:block w-px h-5 mx-1"
              style={{ background: "var(--color-outline-variant)" }}
              aria-hidden="true"
            />

            {/* Profile / Log In — session-aware slot injected from layout */}
            <div className="flex items-center">
              {authButton}
            </div>


          </div>
        </nav>
      </header>

      {/* ══════════════════════════════════════════════
          MOBILE SEARCH BAR — full-width below header
          ══════════════════════════════════════════════ */}
      <div
        aria-hidden={!searchOpen}
        className="fixed top-20 left-0 right-0 z-40 flex md:hidden
          px-4 py-3 border-b transition-all duration-300"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-outline-variant)",
          transform: searchOpen ? "translateY(0)" : "translateY(-110%)",
          opacity: searchOpen ? 1 : 0,
          pointerEvents: searchOpen ? "auto" : "none",
        }}
      >
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-1 items-center gap-2 rounded px-4 py-2 border"
          style={{
            background: "var(--color-surface-container-low)",
            borderColor: "var(--color-primary)",
          }}
        >
          <IconSearch size={16} />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search photographers, venues…"
            aria-label="Search vendors mobile"
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-on-surface)" }}
          />
          {searchQuery && (
            <button
              type="button"
              aria-label="Clear search"
              onClick={() => setSearchQuery("")}
              className="text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]"
            >
              <IconX size={14} />
            </button>
          )}
        </form>
      </div>

      {/* ══════════════════════════════════════════════
          MOBILE MENU OVERLAY
          ══════════════════════════════════════════════ */}
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
        className="fixed inset-0 z-40 md:hidden transition-all duration-300"
        style={{
          background: "rgba(28,27,27,0.4)",
          opacity: mobileOpen ? 1 : 0,
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      />

      {/* Slide-in drawer */}
      {/* react-doctor-disable-next-line prefer-html-dialog, react-doctor/prefer-html-dialog */}
      <aside
        id="mobile-menu"
        aria-label="Mobile navigation menu"
        aria-modal={mobileOpen}
        role="dialog"
        className="fixed left-0 top-0 bottom-0 z-50 flex flex-col md:hidden
          w-[min(320px,85vw)] overflow-y-auto"
        style={{
          background: "var(--color-surface)",
          borderRight: "1px solid var(--color-outline-variant)",
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 320ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Drawer header */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b"
          style={{ borderColor: "var(--color-outline-variant)" }}
        >
          <Link
            href="/"
            onClick={closeAll}
            className="flex items-center gap-2 no-underline"
            style={{ color: "inherit" }}
          >
            <span className="material-symbols-outlined text-primary text-3xl">diamond</span>
            <span
              className="font-bold text-xl tracking-tight"
              style={{
                fontFamily: "var(--font-sans)",
                color: "var(--color-on-surface)",
              }}
            >
              House of Weddings
            </span>
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-center w-8 h-8 rounded
              hover:bg-[var(--color-surface-container)] transition-colors duration-150
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            style={{ color: "var(--color-on-surface-variant)" }}
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Category links */}
        <div className="flex-1 px-3 py-4">
          <p
            className="px-3 pb-2 text-xs font-semibold uppercase tracking-widest"
            style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-sans)" }}
          >
            Explore categories
          </p>
          <nav aria-label="Category navigation">
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                onClick={closeAll}
                className="flex items-center gap-3.5 px-3 py-3 rounded text-sm
                  transition-colors duration-150
                  hover:bg-[var(--color-surface-container-low)]
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                style={{
                  color: "var(--color-on-surface)",
                  fontFamily: "var(--font-sans)",
                  textDecoration: "none",
                  fontWeight: 500,
                }}
              >
                <span
                  className="flex items-center justify-center w-9 h-9 rounded text-base flex-shrink-0"
                  style={{ background: "var(--color-surface-container)" }}
                  aria-hidden="true"
                >
                  {cat.emoji}
                </span>
                {cat.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Drawer footer */}
        <div className="flex flex-col gap-4 mt-6 border-t border-[var(--color-outline-variant)] pt-6 px-5 pb-5">
          {isLoggedIn ? (
            <>
              <Link onClick={closeAll} href={profileDestination} className="flex items-center gap-3 text-[var(--color-primary)] font-label-md hover:opacity-80 transition-opacity">
                <span className="material-symbols-outlined">account_circle</span>
                My Profile
              </Link>
              <button onClick={() => { closeAll(); signOut({ callbackUrl: '/' }); }} className="flex items-center gap-3 text-error font-label-md mt-2 w-full text-left cursor-pointer" type="button">
                <span className="material-symbols-outlined">logout</span>
                Sign Out
              </button>
            </>
          ) : (
            <Link onClick={closeAll} href="/login" className="font-label-md text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors">
              Log In
            </Link>
          )}
        </div>
      </aside>

    </>
  );
}
