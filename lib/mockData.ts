/**
 * lib/mockData.ts
 *
 * Seed data for development and UI prototyping.
 * Pricing fields removed — not displayed on this platform.
 */

import type { VendorListing } from "./types";

export const MOCK_VENDORS: VendorListing[] = [
  {
    id: "v001",
    name: "Lumière Photography",
    slug: "lumiere-photography",
    category: "photography",
    tagline: "Timeless moments, artfully captured.",
    description:
      "Lumière Photography specialises in candid, documentary-style wedding photography that tells the story of your day with honesty and beauty.",
    coverImage: "/vendors/photography.png",
    galleryImages: [],
    location: { city: "Mumbai", state: "Maharashtra", serviceAreas: ["Mumbai", "Pune", "Goa"] },
    rating: 4.9,
    reviewCount: 142,
    isVerified: true,
    isFeatured: true,
    tags: ["candid", "film", "editorial", "destination"],
    contact: { email: "hello@lumiere.photos", website: "https://lumiere.photos", instagram: "@lumiereshots" },
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2025-11-20T00:00:00Z",
    portfolio: {
      experience: '8+ Years',
      clients: '500+',
      communities: '12+',
      countries: '2 (India, Bali)',
      cities: '8 (Bangalore, Hyderabad, Chennai, Goa, Mysore, Chikmagalur, Shimoga, Mahabalipuram)',
      bookingBefore: '6-8 Months',
      priceRange: '₹30,000 - ₹50,000',
      gallery: ['https://images.unsplash.com/photo-1595956553066-624a949027e7?q=80&w=2000', 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=1000', 'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?q=80&w=1000'],
      additionalInfo: {
        brands: ['Hourglass', 'Dior', 'Nars', 'Huda Beauty', 'Chanel', 'Charlotte Tilbury'],
        favoriteProducts: ['Highlighter'],
        signatureStyle: 'Soft glam'
      }
    }
  },
  {
    id: "v002",
    name: "Bloom & Bough Florals",
    slug: "bloom-and-bough-florals",
    category: "florals",
    tagline: "Where gardens meet celebrations.",
    description:
      "Bespoke floral design studio creating lush, garden-inspired arrangements for weddings across South India.",
    coverImage: "/vendors/florals.png",
    galleryImages: [],
    location: { city: "Bengaluru", state: "Karnataka", serviceAreas: ["Bengaluru", "Mysuru", "Chennai"] },
    rating: 4.7,
    reviewCount: 89,
    isVerified: true,
    isFeatured: true,
    tags: ["garden", "romantic", "sustainable", "luxury-floral"],
    contact: { email: "orders@bloomandbough.in", instagram: "@bloomandbough" },
    createdAt: "2024-03-08T00:00:00Z",
    updatedAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "v003",
    name: "The Grand Mahal Venue",
    slug: "grand-mahal-venue",
    category: "venue",
    tagline: "A palace for your most precious day.",
    description:
      "A heritage banquet with Mughal-inspired architecture, lush lawns, and world-class catering — accommodating 50 to 1,500 guests.",
    coverImage: "/vendors/venue.png",
    galleryImages: [],
    location: { city: "Jaipur", state: "Rajasthan", serviceAreas: ["Jaipur"] },
    rating: 4.8,
    reviewCount: 213,
    isVerified: true,
    isFeatured: true,
    tags: ["heritage", "palace", "luxury", "large-capacity"],
    contact: { phone: "+91-141-555-0100", email: "events@grandmahal.in", website: "https://grandmahal.in" },
    createdAt: "2023-09-01T00:00:00Z",
    updatedAt: "2025-12-01T00:00:00Z",
  },
  {
    id: "v004",
    name: "Rasoi Catering Co.",
    slug: "rasoi-catering-co",
    category: "catering",
    tagline: "Soulful food for soulful moments.",
    description:
      "Award-winning catering house specialising in multi-cuisine spreads — from traditional Rajasthani daal baati to contemporary Continental buffets.",
    coverImage: "/vendors/catering.png",
    galleryImages: [],
    location: { city: "Delhi", state: "Delhi NCR", serviceAreas: ["Delhi", "Gurugram", "Noida"] },
    rating: 4.6,
    reviewCount: 178,
    isVerified: true,
    isFeatured: true,
    tags: ["multi-cuisine", "live-counters", "buffet", "vegetarian"],
    contact: { phone: "+91-11-555-0200", email: "book@rasoicatering.in" },
    createdAt: "2023-11-20T00:00:00Z",
    updatedAt: "2025-09-15T00:00:00Z",
  },
  {
    id: "v005",
    name: "Anjali Bridal Studio",
    slug: "anjali-bridal-studio",
    category: "hair-makeup",
    tagline: "Your best face for your best day.",
    description:
      "Celebrity-trained makeup artists specialising in bridal looks — from classic South Indian to contemporary HD finishes.",
    coverImage: "/vendors/makeup.png",
    profilePic: '/gallery/anjali-profile.jpg',
    galleryImages: [],
    location: { city: "Bengaluru", state: "Karnataka", serviceAreas: ["Bengaluru", "Mysuru", "Coorg"] },
    rating: 4.95,
    reviewCount: 312,
    isVerified: true,
    isFeatured: true,
    tags: ["bridal", "airbrush", "saree-draping", "HD-makeup"],
    contact: { email: "bookings@anjalibridals.in", instagram: "@anjalibridal" },
    createdAt: "2023-06-01T00:00:00Z",
    updatedAt: "2025-12-10T00:00:00Z",
    portfolio: {
      experience: '6 Years',
      clients: '350+',
      communities: '8+',
      countries: 'India',
      cities: 'Bengaluru, Hyderabad, Chennai, Goa, Mysore, Chikmagalur, Shimoga, Mahabalipuram',
      bookingBefore: '4-6 Months',
      priceRange: '₹25,000 - ₹45,000',
      gallery: [
        '/gallery/anjali-1.jpg', // Main Feature
        '/gallery/anjali-2.jpg', // Scroll 1
        '/gallery/anjali-3.jpg', // Scroll 2
        '/gallery/anjali-4.jpg', // Scroll 3
        '/gallery/anjali-5.jpg', // Scroll 4
        '/gallery/anjali-6.jpg'  // Scroll 5
      ],
      additionalInfo: {
        brands: ['Hourglass', 'Dior', 'Nars', 'Huda Beauty', 'Chanel', 'Charlotte Tilbury'],
        favoriteProducts: ['Highlighter'],
        signatureStyle: 'Soft glam'
      }
    }
  },
  {
    id: "v006",
    name: "Taara Decor Studio",
    slug: "taara-decor-studio",
    category: "decor",
    tagline: "Spaces that tell your love story.",
    description:
      "Full-service wedding décor and styling studio — floral installations, draping, lighting design, and tabletop styling.",
    coverImage: "/vendors/decor.png",
    galleryImages: [],
    location: { city: "Chennai", state: "Tamil Nadu", serviceAreas: ["Chennai", "Pondicherry", "Bengaluru"] },
    rating: 4.8,
    reviewCount: 97,
    isVerified: true,
    isFeatured: false,
    tags: ["floral-installation", "fairy-lights", "draping", "luxury-decor"],
    contact: { email: "hello@taaradecor.in", instagram: "@taaradecor" },
    createdAt: "2024-02-14T00:00:00Z",
    updatedAt: "2025-11-01T00:00:00Z",
  },
  {
    id: "v007",
    name: "BeatBox Events & DJ",
    slug: "beatbox-events-dj",
    category: "music-dj",
    tagline: "We set the dance floor on fire.",
    description:
      "Professional DJ and live entertainment agency — curating custom playlists, LED walls, and fog effects for Sangeet nights.",
    coverImage: "/vendors/dj.png",
    galleryImages: [],
    location: { city: "Hyderabad", state: "Telangana", serviceAreas: ["Hyderabad", "Secunderabad"] },
    rating: 4.7,
    reviewCount: 154,
    isVerified: true,
    isFeatured: false,
    tags: ["dj", "live-band", "LED-wall", "sangeet"],
    contact: { email: "events@beatboxhyd.in", instagram: "@beatboxevents" },
    createdAt: "2024-04-10T00:00:00Z",
    updatedAt: "2025-10-20T00:00:00Z",
  },
  {
    id: "v008",
    name: "Sugar & Lace Bakehouse",
    slug: "sugar-and-lace-bakehouse",
    category: "cake-desserts",
    tagline: "Crafting edible art, one tier at a time.",
    description:
      "Artisan wedding cake studio specialising in hand-painted fondant, gold-leaf tiers, and custom dessert tables.",
    coverImage: "/vendors/cake.png",
    galleryImages: [],
    location: { city: "Mumbai", state: "Maharashtra", serviceAreas: ["Mumbai", "Pune", "Goa"] },
    rating: 4.9,
    reviewCount: 203,
    isVerified: true,
    isFeatured: true,
    tags: ["fondant", "gold-leaf", "dessert-table", "custom-cake"],
    contact: { email: "orders@sugarandlace.in", instagram: "@sugarandlacecakes" },
    createdAt: "2023-12-01T00:00:00Z",
    updatedAt: "2025-12-05T00:00:00Z",
  },
];

/* ── Category metadata ───────────────────────────────────────── */
export const CATEGORY_META: Record<
  string,
  { label: string; emoji: string; description: string }
> = {
  photography:              { label: "Photography",        emoji: "📷", description: "Capture every beautiful moment" },
  videography:              { label: "Videography",        emoji: "🎬", description: "Cinematic wedding films" },
  florals:                  { label: "Florals",            emoji: "🌸", description: "Stunning floral arrangements" },
  catering:                 { label: "Catering",           emoji: "🍽️", description: "Memorable culinary experiences" },
  venue:                    { label: "Venues",             emoji: "🏛️", description: "The perfect setting for your day" },
  "music-dj":               { label: "Music & DJ",         emoji: "🎵", description: "Set the mood and dance floor" },
  "hair-makeup":            { label: "Hair & Makeup",      emoji: "💄", description: "Look and feel your absolute best" },
  decor:                    { label: "Décor & Styling",    emoji: "✨", description: "Transform your vision into reality" },
  "cake-desserts":          { label: "Cakes & Desserts",   emoji: "🎂", description: "Sweet endings and confections" },
  "invitation-stationery":  { label: "Invitations",        emoji: "💌", description: "Make the first impression count" },
  jewellery:                { label: "Jewellery",          emoji: "💎", description: "Adorn your special day" },
  transport:                { label: "Transport",          emoji: "🚗", description: "Arrive in style" },
  officiants:               { label: "Officiants",         emoji: "📜", description: "Meaningful ceremonies" },
  other:                    { label: "Other",              emoji: "🎊", description: "More wedding services" },
};
