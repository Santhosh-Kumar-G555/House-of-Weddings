import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────
   FOOTER — Single-line minimalist, semantic token system
   Server Component (no JS handlers)
   ───────────────────────────────────────────────────────────────── */
export default function Footer() {
  return (
    <footer className="w-full py-8 border-t border-outline-variant bg-surface-container-lowest">
      <div className="flex flex-col xl:flex-row justify-between items-center px-4 md:px-[64px] max-w-[1280px] mx-auto gap-6 xl:gap-0">

        {/* Brand */}
        <div
          style={{
            fontFamily:    "var(--font-headline)",
            fontSize:      "var(--text-headline-md)",
            fontWeight:    600,
            color:         "var(--color-on-surface)",
            letterSpacing: "-0.01em",
          }}
        >
          House of Weddings
        </div>

        {/* Nav links */}
        <div
          className="flex flex-wrap justify-center gap-6 md:gap-8"
          style={{
            fontFamily: "var(--font-body)",
            fontSize:   "var(--text-body-md)",
            color:      "var(--color-on-surface-variant)",
          }}
        >
          {[
            { label: "Privacy Policy",   href: "#" },
            { label: "Terms of Service", href: "#" },
            { label: "Contact Us",       href: "#" },
            { label: "About",            href: "#" },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="footer-link transition-colors duration-150"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Copyright */}
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize:   "var(--text-body-md)",
            color:      "var(--color-on-surface-variant)",
          }}
        >
          © 2026 House of Weddings. All rights reserved.
        </div>

      </div>
    </footer>
  );
}
