import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────────────────────────────────────────
   PODCAST BANNER — Static Server Component
   Single-slide banner; no state, no client JS.
   Themed to match the minimalist design system.
   ───────────────────────────────────────────────────────────────── */
export default function PodcastSlider() {
  return (
    <div
      className="w-full bg-surface-container-high border-y border-outline-variant py-12"
    >
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-[1280px] mx-auto px-4 md:px-[64px]">

        {/* Left — wordmark */}
        <div
          className="font-headline-md text-primary tracking-widest uppercase hidden md:block"
        >
          What&apos;s Minching
        </div>

        {/* Center — text */}
        <Link href="/podcasts" className="flex-1 text-center cursor-pointer block group">
          <div className="animate-stretch-custom">
            <h2
              className="uppercase bg-gradient-to-r from-pink-500 to-cyan-400 bg-clip-text text-transparent"
              style={{
                fontFamily: "var(--font-headline)",
                fontWeight: 700,
                fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
                letterSpacing: "-0.01em",
                lineHeight: 1.2,
              }}
            >
              WHAT&apos;S MINCHING IN BENGALURU ?!!!
            </h2>
            <p
              className="mt-2 uppercase tracking-widest text-on-surface-variant"
              style={{
                fontFamily: "var(--font-label)",
                fontSize: "var(--text-label-md)",
              }}
            >
              EXCLUSIVE VENDOR PODCASTS COMING SOON!!!
            </p>
          </div>
        </Link>

        {/* Right — host image */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded overflow-hidden relative">
            <Image
              src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=400&h=400"
              fill
              sizes="96px"
              className="object-cover grayscale"
              alt="Podcast host Sujay"
              unoptimized
            />
          </div>
          <span
            className="text-xs uppercase tracking-widest"
            style={{ color: "var(--color-on-surface-variant)", fontFamily: "var(--font-label)" }}
          >
            BY SUJAY
          </span>
        </div>

      </div>
    </div>
  );
}
