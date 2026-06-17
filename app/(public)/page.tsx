import Link from "next/link";
import Hero from "@/components/modules/Hero";
import CategoryCard, { type CategoryItem } from "@/components/modules/CategoryCard";
import PodcastSlider from "@/components/modules/PodcastSlider";

/**
 * app/page.tsx — Homepage (App Router)
 *
 * Sections:
 *   1. Hero              — minimalist search banner
 *   2. Podcast Slider    — editorial content strip
 *   3. Vendors           — bordered grayscale category grid
 *   4. How It Works      — Functional Elegance 3-step process
 */

/* ─────────────────────────────────────────────────────────────────
   CATEGORY DATA
   ───────────────────────────────────────────────────────────────── */
const CATEGORIES: CategoryItem[] = [
  {
    label: "Beauty Makeup & Mehendi",
    href: "/vendors?category=beauty makeup and mehendi",
    image: "/categories/beauty_v2.png",
    imageAlt: "Bridal mehendi and makeup",
    count: 2400,
  },
  {
    label: "Venues & Locations",
    href: "/vendors?category=venues and locations",
    image: "/categories/venues.png",
    imageAlt: "Grand palace wedding venue",
    count: 1800,
  },
  {
    label: "Photography & Videography",
    href: "/vendors?category=photography and videography",
    image: "/categories/photography.png",
    imageAlt: "Wedding photography camera",
    count: 3200,
  },
  {
    label: "Wedding Planners & Coordination",
    href: "/vendors?category=wedding planners and coordination",
    image: "/categories/planners.png",
    imageAlt: "Wedding planning moodboard",
    count: 950,
  },
  {
    label: "Bridal & Groom Wear",
    href: "/vendors?category=bridal and groom wear",
    image: "/categories/wear.png",
    imageAlt: "Luxurious bridal lehenga",
    count: 1600,
  },
  {
    label: "Jewellery & Accessories",
    href: "/vendors?category=jewellery and accessories",
    image: "/categories/jewellery.png",
    imageAlt: "Indian bridal jewellery set",
    count: 1100,
  },
  {
    label: "Decor & Floral",
    href: "/vendors?category=decor and floral",
    image: "/categories/decor.png",
    imageAlt: "Ultra-luxurious Indian wedding mandap decoration",
    count: 1500,
  },
  {
    label: "Catering & Food",
    href: "/vendors?category=catering and food",
    image: "/categories/catering.png",
    imageAlt: "Premium overhead flatlay of a luxurious traditional Indian wedding feast",
    count: 2100,
  },
];

/* ─────────────────────────────────────────────────────────────────
   HOME PAGE
   ───────────────────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <main className="flex-grow w-full flex flex-col">

      {/* ══ 1. HERO ══════════════════════════════════════════════ */}
      <Hero />

      {/* ══ 1.5 PODCAST SLIDER ════════════════════════════════════ */}
      <PodcastSlider />

      {/* ══ 3. VENDORS — Category grid ═══════════════════════════ */}
      <section
        aria-labelledby="vendors-section-heading"
        style={{ background: "var(--color-surface-container-low)" }}
      >
        <div className="w-full max-w-[1280px] mx-auto px-4 md:px-[64px] pt-16 pb-16 md:pb-24">

          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p
                className="text-xs font-semibold uppercase tracking-[0.14em] mb-2"
                style={{ color: "var(--color-outline)", fontFamily: "var(--font-label)" }}
              >
                Browse by category
              </p>
              <h2
                id="vendors-section-heading"
                style={{
                  fontFamily:    "var(--font-headline)",
                  fontSize:      "clamp(1.5rem, 2.5vw, var(--text-headline-lg))",
                  fontWeight:    600,
                  color:         "var(--color-on-surface)",
                  letterSpacing: "-0.01em",
                  lineHeight:    1.2,
                }}
              >
                Vendors
              </h2>
            </div>
            <Link
              id="vendors-view-all-btn"
              href="/vendors"
              className="hidden md:flex items-center gap-1.5 text-sm font-medium
                transition-colors duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              style={{
                color:       "var(--color-primary)",
                fontFamily:  "var(--font-body)",
                textDecoration: "none",
              }}
            >
              View all
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>

          {/* 8-category diagonal-split grid */}
          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 list-none m-0 p-0"
            aria-label="Browse vendor categories"
          >
            {CATEGORIES.map((cat) => (
              <li key={cat.label}>
                <CategoryCard item={cat} />
              </li>
            ))}
          </ul>

          {/* View All CTA — mobile only (desktop link is in header) */}
          <div className="flex justify-center mt-10 md:hidden">
            <Link
              id="vendors-view-all-mobile-btn"
              href="/vendors"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded border text-sm font-medium
                transition-colors duration-150
                focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
              style={{
                borderColor:    "var(--color-primary)",
                color:          "var(--color-primary)",
                fontFamily:     "var(--font-body)",
                background:     "transparent",
                textDecoration: "none",
              }}
            >
              View All Vendors
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
