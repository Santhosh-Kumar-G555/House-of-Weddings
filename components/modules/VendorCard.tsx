'use client';

import Image from "next/image";
import Link from "next/link";
import type { VendorListing } from "@/lib/types";
import { CATEGORY_META } from "@/lib/mockData";



/* ─────────────────────────────────────────────────────────────────
   VENDOR CARD
   ───────────────────────────────────────────────────────────────── */
interface VendorCardProps {
  vendor: VendorListing;
  showFeaturedBadge?: boolean;
}

// Helper to weed out dirty database strings
const getValidImage = (url?: string | null) => {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim();
  if (clean === '' || clean === 'null' || clean === 'undefined' || clean.startsWith('wix:')) return null;
  return clean;
};

export default function VendorCard({ vendor, showFeaturedBadge = true }: VendorCardProps) {
  const categoryMeta = CATEGORY_META[vendor.category];



  // Cascade: Profile -> Cover -> First Portfolio -> Default Placeholder
  const displayImage = getValidImage(vendor.profilePic) 
    || getValidImage(vendor.coverImage) 
    || (vendor.portfolioImages && vendor.portfolioImages.length > 0 ? getValidImage((vendor.portfolioImages[0] as any).url || vendor.portfolioImages[0]) : null);

  return (
    <Link
      href={`/vendors/${vendor.slug}`}
      id={`vendor-card-${vendor.id}`}
      aria-label={`View ${vendor.name} — ${categoryMeta?.label ?? vendor.category} in ${vendor.location.city}`}
      className="bg-surface-container-lowest border border-outline-variant rounded overflow-hidden group cursor-pointer hover:border-on-surface transition-colors flex flex-col no-underline"
    >
      {/* ── Cover image ─────────────────────────────────────── */}
      <div className="relative w-full aspect-[4/3] bg-surface-variant overflow-hidden">
        {displayImage ? (
          <Image 
            src={displayImage} 
            alt={`${vendor.name} profile`} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.onerror = null; // Prevent infinite loops
              e.currentTarget.src = 'https://placehold.co/400x400/e2e8f0/64748b?text=Storefront';
            }} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant bg-surface-variant/50">
            <span className="material-symbols-outlined text-4xl mb-2">storefront</span>
            <span className="font-label-sm uppercase tracking-wider">No Image</span>
          </div>
        )}

        {/* Gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />

        {/* Category chip */}
        <div
          className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
          style={{
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            color: "var(--color-secondary-700)",
            fontFamily: "var(--font-label)",
            letterSpacing: "0.04em",
          }}
        >
          <span aria-hidden="true">{categoryMeta?.emoji}</span>
          {categoryMeta?.label ?? vendor.category}
        </div>

        {/* Featured ribbon */}
        {showFeaturedBadge && vendor.isFeatured && (
          <div
            className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{
              background: "linear-gradient(135deg, var(--color-primary-500), var(--color-secondary-500))",
              color: "#fff",
              fontFamily: "var(--font-label)",
              letterSpacing: "0.05em",
              boxShadow: "0 2px 8px rgba(200,149,108,0.40)",
            }}
          >
            ✦ Featured
          </div>
        )}

        {/* Verified badge */}
        {vendor.isVerified && (
          <div
            className="absolute bottom-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: "rgba(255,255,255,0.90)", color: "var(--color-secondary-700)", fontFamily: "var(--font-body)" }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Verified
          </div>
        )}
      </div>

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="font-headline-md text-on-surface line-clamp-1 mb-1">
          {vendor.name}
        </h3>

        <p className="font-body-md text-on-surface-variant flex items-center gap-1 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {vendor.location?.city || 'Location TBA'}{vendor.location?.state ? `, ${vendor.location.state}` : ''}
        </p>

        <p className="font-body-md text-on-surface-variant line-clamp-2 mb-4">
          {vendor.description || vendor.tagline || 'No description available.'}
        </p>

        <div className="mt-auto">
          {/* Replace the old Rating/Review block with this: */}
          <div className="flex items-center gap-3 text-sm text-on-surface-variant mt-2 pt-2 border-t border-outline-variant">
            {/* Experience Logic */}
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">history</span>
              <span className="font-medium">
                {vendor?.experience != null ? `${vendor.experience}+ Years` : '0+ Years'}
              </span>
            </div>
            
            {/* Price Logic */}
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">currency_rupee</span>
              <span className="font-medium">
                {vendor?.price && vendor.price > 0 
                  ? `₹${Number(vendor.price).toLocaleString()}` 
                  : 'On request'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
