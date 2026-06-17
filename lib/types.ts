/**
 * lib/types.ts
 *
 * Core domain type definitions for House of Weddings.
 * Note: pricing fields removed — not displayed on this platform.
 */

/* ── Vendor Category ───────────────────────────────────────────── */
export type VendorCategory =
  | "photography"
  | "videography"
  | "florals"
  | "catering"
  | "venue"
  | "music-dj"
  | "hair-makeup"
  | "decor"
  | "cake-desserts"
  | "invitation-stationery"
  | "jewellery"
  | "transport"
  | "officiants"
  | "other";

export interface VendorPortfolio {
  experience?: string;
  clients?: string;
  communities?: string;
  countries?: string;
  cities?: string;
  bookingBefore?: string;
  priceRange?: string;
  gallery?: string[];
  additionalInfo?: {
    brands?: string[];
    favoriteProducts?: string[];
    signatureStyle?: string;
  };
}

/* ── Vendor Listing ────────────────────────────────────────────── */
export interface VendorListing {
  id: string;
  name: string;
  slug: string;
  category: VendorCategory;
  tagline: string;
  description: string;
  coverImage: string;
  profilePic?: string;
  galleryImages: string[];
  portfolioImages?: { url: string }[];
  location: {
    city: string;
    state: string;
    serviceAreas: string[];
  };
  rating: number;        // 0–5
  reviewCount: number;
  isVerified: boolean;
  isFeatured: boolean;
  experience?: number;
  price?: number;
  city?: string;
  state?: string;
  tags: string[];
  contact: {
    phone?: string;
    email?: string;
    website?: string;
    instagram?: string;
  };
  createdAt: string;     // ISO date string
  updatedAt: string;
  portfolio?: VendorPortfolio;
}

/* ── Filter State ──────────────────────────────────────────────── */
export interface FilterState {
  categories: VendorCategory[];
  locations: string[];
  minRating: number;
  searchQuery: string;
  sortBy: "relevance" | "rating" | "newest";
}

/* ── Review ────────────────────────────────────────────────────── */
export interface Review {
  id: string;
  vendorId: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  verified: boolean;
}
