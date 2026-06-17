import type { Config } from "tailwindcss";

/* ─────────────────────────────────────────────────────────────────
   Minchu — Tailwind CSS v4 Config
   Design system: "Minchu Minimalist" (verified via Stitch MCP)
   Primary tokens live in app/globals.css @theme block.
   This file handles fontFamily registration and any v4 overrides.
   ───────────────────────────────────────────────────────────────── */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* ── Semantic Color Palette (Stitch: Minchu Minimalist) ──── */
      colors: {
        /* Core brand */
        primary:               "#475b58",
        "on-primary":          "#ffffff",
        "primary-container":   "#c9e6e0",
        "on-primary-container":"#002019",
        "inverse-primary":     "#aecac4",

        /* Secondary */
        secondary:               "#4a635f",
        "on-secondary":          "#ffffff",
        "secondary-container":   "#cce8e3",
        "on-secondary-container":"#051f1c",

        /* Tertiary */
        tertiary:               "#456179",
        "on-tertiary":          "#ffffff",
        "tertiary-container":   "#cce5ff",
        "on-tertiary-container":"#001e30",

        /* Error */
        error:               "#ba1a1a",
        "on-error":          "#ffffff",
        "error-container":   "#ffdad6",
        "on-error-container":"#410002",

        /* Background / Surface */
        background:                   "#fcf9f8",
        "on-background":              "#1c1b1b",
        surface:                      "#fcf9f8",
        "on-surface":                 "#1c1b1b",
        "surface-variant":            "#dbe5e1",
        "on-surface-variant":         "#3f4946",
        "surface-container-lowest":   "#ffffff",
        "surface-container-low":      "#f6f3f2",
        "surface-container":          "#f0edec",
        "surface-container-high":     "#eae7e6",

        /* Inverse */
        "inverse-surface":    "#313030",
        "inverse-on-surface": "#f3f0ef",

        /* Outline */
        outline:         "#6f7977",
        "outline-variant":"#c2c8c5",

        /* Utility */
        scrim:  "#000000",
        shadow: "#000000",
      },

      /* ── Typography — Inter uniform across all roles ────────── */
      fontFamily: {
        sans:     ["Inter", "system-ui", "sans-serif"],
        headline: ["Inter", "system-ui", "sans-serif"],
        body:     ["Inter", "system-ui", "sans-serif"],
        label:    ["Inter", "system-ui", "sans-serif"],
        mono:     ["JetBrains Mono", "Courier New", "monospace"],
        /* Stitch token aliases */
        "headline-xl": ["Inter", "system-ui", "sans-serif"],
        "body-md":     ["Inter", "system-ui", "sans-serif"],
        "label-sm":    ["Inter", "system-ui", "sans-serif"],
      },

      /* ── Border Radius — tight minimalist (0.125rem base) ───── */
      borderRadius: {
        none:    "0px",
        sm:      "0.125rem",   /*  2px */
        DEFAULT: "0.125rem",   /*  2px */
        md:      "0.25rem",    /*  4px */
        lg:      "0.25rem",    /*  4px */
        xl:      "0.5rem",     /*  8px */
        "2xl":   "0.75rem",    /* 12px */
        full:    "9999px",
      },

      /* ── Spacing — Stitch verified tokens ───────────────────── */
      spacing: {
        "margin-mobile":  "20px",
        "margin-desktop": "64px",
        "container-max":  "1280px",
        "gutter":         "24px",
        "section-gap":    "96px",
      },

      /* ── Max Width — semantic container sizes ───────────────── */
      maxWidth: {
        container: "1280px",
        content:   "768px",
        narrow:    "560px",
      },
    },
  },
  plugins: [],
};

export default config;
