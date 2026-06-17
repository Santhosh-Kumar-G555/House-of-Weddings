import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────────────────────────── */
export interface CategoryItem {
  /** Display label shown in the card footer */
  label: string;
  /** URL for the category browse page */
  href: string;
  /** Image filling the card */
  image: string;
  /** Image alt text */
  imageAlt: string;
  /** Vendor count shown as a soft sub-label */
  count?: number;
}

/* ─────────────────────────────────────────────────────────────────
   CATEGORY CARD  — bordered, grayscale minimalist design
   ───────────────────────────────────────────────────────────────── */
export default function CategoryCard({ item }: { item: CategoryItem }) {
  return (
    <Link
      href={item.href}
      id={`category-card-${item.href.replace(/[^a-z0-9]/gi, "-")}`}
      aria-label={`Browse ${item.label}`}
      className="group block bg-[var(--color-surface-container-lowest)] border border-[#E0E0E0]
        rounded overflow-hidden hover:border-[#1A1A1A] transition-colors
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
        focus-visible:ring-offset-2 no-underline"
      style={{ textDecoration: "none" }}
    >
      {/* ── Image container ─────────────────────────────────────── */}
      <div className="h-64 bg-[var(--color-surface-variant)] relative">
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="w-full h-full object-cover transition-all duration-500"
        />
      </div>

      {/* ── Card footer ─────────────────────────────────────────── */}
      <div className="p-6 flex justify-between items-center">

        {/* Category title + optional count */}
        <div className="min-w-0 pr-3">
          <p
            className="font-semibold leading-snug truncate tracking-tight"
            style={{
              fontFamily: "var(--font-body)",
              fontSize:   "var(--text-body-lg)",
              color:      "var(--color-on-surface)",
            }}
          >
            {item.label}
          </p>
          {item.count !== undefined && (
            <span
              className="mt-0.5 block text-xs"
              style={{
                color:      "var(--color-outline)",
                fontFamily: "var(--font-label)",
              }}
            >
              {item.count.toLocaleString()}+ vendors
            </span>
          )}
        </div>

        {/* arrow_outward icon — northeast diagonal arrow */}
        <span
          className="flex-shrink-0 material-symbols-outlined text-xl leading-none
            transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          aria-hidden="true"
          style={{ color: "var(--color-on-surface-variant)" }}
        >
          arrow_outward
        </span>

      </div>
    </Link>
  );
}
