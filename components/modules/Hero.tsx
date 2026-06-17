"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

/* ─────────────────────────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────────────────────────── */
const CATEGORIES = [
  { value: "",                                        label: "All Categories",               icon: "grid_view" },
  { value: "beauty makeup and mehendi",               label: "Beauty Makeup & Mehendi",      icon: "face_retouching_natural" },
  { value: "venues and locations",                    label: "Venues & Locations",           icon: "account_balance" },
  { value: "photography and videography",             label: "Photography & Videography",    icon: "photo_camera" },
  { value: "wedding planners and coordination",       label: "Planners & Coordination",      icon: "event_note" },
  { value: "bridal and groom wear",                   label: "Bridal & Groom Wear",          icon: "styler" },
  { value: "jewellery and accessories",               label: "Jewellery & Accessories",      icon: "diamond" },
  { value: "decor and floral",                        label: "Decor & Floral",               icon: "local_florist" },
  { value: "catering and food",                       label: "Catering & Food",              icon: "restaurant" },
  { value: "invitations and stationery",              label: "Invitations & Stationery",     icon: "mail" },
  { value: "entertainment and djs",                   label: "Entertainment & DJs",          icon: "music_note" },
  { value: "transportation and logistics",            label: "Transportation",               icon: "directions_car" },
];

const LOCATIONS = [
  { value: "",           label: "All Cities" },
  { value: "bengaluru",  label: "Bengaluru" },
  { value: "mumbai",     label: "Mumbai" },
  { value: "delhi",      label: "Delhi NCR" },
  { value: "chennai",    label: "Chennai" },
  { value: "hyderabad",  label: "Hyderabad" },
  { value: "kolkata",    label: "Kolkata" },
  { value: "jaipur",     label: "Jaipur" },
  { value: "pune",       label: "Pune" },
  { value: "ahmedabad",  label: "Ahmedabad" },
  { value: "goa",        label: "Goa" },
] as const;

const TRUST_BADGES = [
  { icon: "🏆", label: "12,000+ Vendors" },
  { icon: "⭐", label: "4.8 Avg Rating" },
  { icon: "✅", label: "100% Verified" },
  { icon: "💍", label: "50,000+ Weddings" },
];

const POPULAR = ["Wedding Venues", "Photographers", "Bridal Makeup", "Mehendi Artists", "Decorators"];

/* ─────────────────────────────────────────────────────────────────
   ICONS
   ───────────────────────────────────────────────────────────────── */
function IconSearch({ size = 18, className, ...props }: { size?: number; className?: string; [key: string]: any }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      className={className} {...props}
      aria-hidden="true">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function CustomDropdown({ value, onChange, options, placeholder }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((o: any) => o.value === value) || options[0];

  return (
    <div className="relative w-full md:w-auto" ref={wrapperRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between md:justify-start gap-2 cursor-pointer px-3 py-1.5 text-sm outline-none border-none whitespace-nowrap min-w-[160px] bg-transparent text-left w-full"
        style={{
          fontFamily: "var(--font-body)",
          color: value ? "var(--color-on-surface)" : "var(--color-outline)",
        }} aria-expanded={isOpen}
      >
        <span className="truncate">{selectedOption.label}</span>
        <span className="material-symbols-outlined text-[18px] text-[var(--color-outline)] pointer-events-none">expand_more</span>
      </button>

      {isOpen && (
        <ul className="absolute z-[99999] top-full left-0 md:left-1/2 md:-translate-x-1/2 w-full md:w-64 mt-3 bg-surface-container-lowest border border-outline-variant rounded-md shadow-lg max-h-80 overflow-y-auto animate-in fade-in zoom-in-95 duration-150 py-1">
          {options.map((opt: any) => (
            <li key={opt.value}>
              <button
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left flex items-center gap-3 px-4 py-2.5 hover:bg-surface-variant cursor-pointer text-sm transition-colors bg-transparent border-none outline-none ${value === opt.value ? 'bg-primary/10 text-primary font-semibold' : 'text-on-surface'}`}
              >
                {opt.icon && <span className={`material-symbols-outlined text-[20px] ${value === opt.value ? 'text-primary' : 'text-on-surface-variant'}`}>{opt.icon}</span>}
                <span className="truncate">{opt.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   HERO
   ───────────────────────────────────────────────────────────────── */
export default function Hero() {
  const router = useRouter();
  const [keyword,  setKeyword]  = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q",        keyword.trim());
    if (category)       params.set("category", category);
    if (location)       params.set("city",     location);
    const qs = params.toString();
    router.push(`/vendors${qs ? `?${qs}` : ""}`);
  };

  /* ── render ─────────────────────────────────────────────────── */
  return (
    <section
      aria-label="Hero — find your wedding vendors"
      className="w-full flex flex-col items-center text-center px-4 md:px-[64px] py-24 md:py-32"
    >

      {/* ── Eyebrow ─────────────────────────────────────────── */}
      <p
        className="animate-fade-in animation-delay-100 text-xs font-semibold uppercase tracking-[0.14em] mb-6"
        style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }}
      >
        India&apos;s Premium Wedding Vendor Directory
      </p>

      {/* ── Headline ─────────────────────────────────────────── */}
      <h1
        className="animate-fade-in-up animation-delay-200 max-w-[800px] w-full mb-6 mx-auto"
        style={{
          fontFamily:    "var(--font-headline)",
          fontWeight:    700,
          fontSize:      "clamp(2rem, 5vw, 40px)",
          lineHeight:    1.1,
          letterSpacing: "-0.02em",
          color:         "var(--color-on-surface)",
        }}
      >
        Curated vendors for the modern wedding.
      </h1>

      {/* ── Subtitle ─────────────────────────────────────────── */}
      <p
        className="animate-fade-in-up animation-delay-300 max-w-[600px] w-full mb-12 mx-auto"
        style={{
          fontFamily: "var(--font-body)",
          color:      "var(--color-on-surface-variant)",
          fontSize:   "16px",
          lineHeight: 1.6,
        }}
      >
        Discover a meticulously selected roster of professionals. No clutter,
        just high-end utility for your planning process.
      </p>

      {/* ── Search bar ───────────────────────────────────── */}
      <div className="animate-scale-in animation-delay-400 w-full mt-10">
        <form
          id="hero-search-form"
          onSubmit={handleSubmit}
          aria-label="Vendor search"
          className="w-full max-w-[800px] mx-auto flex flex-col md:flex-row items-center gap-2 p-2 bg-surface-container-lowest border border-outline-variant rounded-lg mt-8"
        >

          <label className="sr-only" htmlFor="hero-keyword">Search vendors</label>
          <IconSearch size={16} aria-hidden="true"
            className="flex-shrink-0 ml-2 text-[var(--color-outline)]" />
          <input
            id="hero-keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Photographers, venues, florists…"
            autoComplete="off"
            className="flex-1 w-full min-w-0 bg-transparent outline-none border-none px-3 py-2 text-sm placeholder:text-[var(--color-outline)] focus:ring-0"
            style={{
              fontFamily: "var(--font-body)",
              color:      "var(--color-on-surface)",
              fontSize:   "var(--text-body-md)",
            }}
          />

          {/* Divider */}
          <span
            className="hidden sm:block w-px self-stretch flex-shrink-0"
            style={{ background: "var(--color-outline-variant)", margin: "6px 0" }}
            aria-hidden="true"
          />

          {/* Category */}
          <label className="sr-only" htmlFor="hero-category">Category</label>
          <CustomDropdown 
            value={category}
            onChange={(val: string) => setCategory(val)}
            options={CATEGORIES}
          />

          {/* Divider */}
          <span
            className="hidden sm:block w-px self-stretch flex-shrink-0"
            style={{ background: "var(--color-outline-variant)", margin: "6px 0" }}
            aria-hidden="true"
          />

          {/* Location */}
          <label className="sr-only" htmlFor="hero-location">City</label>
          <select
            id="hero-location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full md:w-auto bg-transparent outline-none border-none appearance-none cursor-pointer px-3 py-1.5 text-sm focus:ring-0"
            style={{
              fontFamily: "var(--font-body)",
              color: location ? "var(--color-on-surface)" : "var(--color-outline)",
              fontSize: "var(--text-body-md)",
            }}
          >
            {LOCATIONS.map((l) => (
              <option key={l.value} value={l.value}>{l.label}</option>
            ))}
          </select>

          {/* Submit button */}
          <button
            id="hero-search-submit"
            type="submit"
            className="w-full md:w-auto flex-shrink-0 flex items-center justify-center gap-2 px-5 py-2 rounded text-sm font-semibold
              transition-opacity duration-150 hover:opacity-90
              focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
            style={{
              background:  "var(--color-primary-container)",
              color:       "var(--color-on-primary-container)",
              fontFamily:  "var(--font-label)",
              fontSize:    "var(--text-body-md)",
              letterSpacing: "0.01em",
            }}
          >
            <IconSearch size={15} />
            Search
          </button>
        </form>

        {/* ── Popular chips ────────────────────────────── */}
        <div className="w-full max-w-[800px] mx-auto flex flex-wrap justify-center items-center gap-3 mt-6">
          <span
            className="text-xs self-center"
            style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }}
          >
            Popular:
          </span>
          {POPULAR.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => setKeyword(q)}
              className="text-xs px-3 py-1 rounded border transition-colors duration-150
                hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]
                focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--color-primary)]"
              style={{
                color:       "var(--color-on-surface-variant)",
                borderColor: "var(--color-outline-variant)",
                background:  "transparent",
                fontFamily:  "var(--font-body)",
              }}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* ── Trust badges ────────────────────────────── */}
      <div className="w-full max-w-[800px] mx-auto flex flex-wrap justify-center gap-6 mt-8">
        {TRUST_BADGES.map((b) => (
          <div key={b.label} className="flex items-center gap-2">
            <span className="text-base" aria-hidden="true">{b.icon}</span>
            <span
              className="text-xs font-medium"
              style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-body)" }}
            >
              {b.label}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}
