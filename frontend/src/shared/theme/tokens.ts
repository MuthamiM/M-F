// src/shared/theme/tokens.ts
//
// SINGLE SOURCE OF TRUTH for the brand theme. Nothing else in this codebase
// should contain a hardcoded hex value, font name, or spacing number —
// everything imports from here.
//
// tailwind.config.ts reads this at build time.
// tokens.css (generated — see scripts/build-tokens.js) reads this to produce
// CSS variables for anything that isn't a Tailwind class (e.g. inline SVG,
// third-party components that need a raw hex).
//
// To change the brand palette: edit THIS file only, then run `npm run build:tokens`.

export const colors = {
  graphite: "#1B222C", // primary — text, core UI, badges
  slate: "#3E4C59",    // secondary — panels, dark sections
  fog: "#9AA5B1",      // muted text, borders, disabled states
  cloud: "#F4F6F8",    // backgrounds, cards, light sections
  silver: "#6B7684",   // connector/accent — still gray, no color
  mist: "#C4CDD5",     // illustration shading, light borders
  ash: "#E4E7EB",      // illustration mid-light panels
  white: "#FFFFFF",
} as const;

export const fonts = {
  display: ["Inter", "sans-serif"],
  body: ["Inter", "sans-serif"],
  mono: ["JetBrains Mono", "monospace"], // reserved for API docs / code blocks only
} as const;

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "16px",
} as const;

export const spacing = {
  1: "4px",
  2: "8px",
  3: "16px",
  4: "24px",
  5: "40px",
  6: "64px",
  7: "96px",
} as const;

export type ColorToken = keyof typeof colors;
