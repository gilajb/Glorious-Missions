/**
 * Design tokens extracted from the design exports (DESIGN.md / code.html per page).
 *
 * This file is the single source of truth for color, type, spacing, and radius
 * values -- tailwind.config.js imports it directly into `theme.extend`, so no
 * component should hardcode a hex value or a raw spacing number.
 *
 * When a new page's zip brings its own DESIGN.md, merge its token block in
 * here (new keys, or updated values for existing ones) rather than adding a
 * second source of tokens.
 */

export const colors = {
  error: "#ba1a1a",
  "inverse-surface": "#33302d",
  "on-error": "#ffffff",
  "secondary-fixed": "#dbe1ff",
  background: "#fff8f5",
  tertiary: "#005f20",
  "on-secondary": "#ffffff",
  "inverse-on-surface": "#f7efeb",
  "surface-container-lowest": "#ffffff",
  "secondary-fixed-dim": "#b5c4ff",
  "on-background": "#1e1b19",
  "tertiary-container": "#187a31",
  "on-tertiary-fixed-variant": "#00531b",
  secondary: "#3858b6",
  "primary-fixed-dim": "#ffb4ac",
  surface: "#fff8f5",
  "surface-container-highest": "#e9e1dd",
  "on-primary": "#ffffff",
  "on-tertiary-container": "#a9ffab",
  "on-error-container": "#93000a",
  "tertiary-fixed": "#99f89e",
  "surface-bright": "#fff8f5",
  "on-primary-fixed": "#410003",
  "on-tertiary": "#ffffff",
  "surface-tint": "#b91d20",
  primary: "#a50915",
  "surface-container-low": "#faf2ee",
  "secondary-container": "#7e9cfe",
  "on-surface-variant": "#5b403d",
  "inverse-primary": "#ffb4ac",
  "surface-container-high": "#eee7e3",
  "on-secondary-fixed-variant": "#1a3f9c",
  "surface-variant": "#e9e1dd",
  "surface-container": "#f4ece8",
  "on-secondary-container": "#002f8a",
  "on-primary-fixed-variant": "#93000f",
  outline: "#8f706c",
  "primary-fixed": "#ffdad6",
  "primary-container": "#c92a2a",
  "on-secondary-fixed": "#00164d",
  "on-tertiary-fixed": "#002106",
  "error-container": "#ffdad6",
  "on-primary-container": "#ffe5e2",
  "surface-dim": "#e0d8d5",
  "on-surface": "#1e1b19",
  "tertiary-fixed-dim": "#7edb85",
  "outline-variant": "#e4beba",
};

export const borderRadius = {
  DEFAULT: "0.25rem",
  lg: "0.5rem",
  xl: "0.75rem",
  full: "9999px",
};

export const spacing = {
  "margin-mobile": "1.25rem",
  "margin-tablet": "2.5rem",
  "gutter-tablet": "1.5rem",
  "space-sm": "0.75rem",
  "space-3xl": "4.5rem",
  "margin-desktop": "4rem",
  "space-4xl": "6rem",
  "space-2xl": "3rem",
  "space-md": "1rem",
  "space-xs": "0.5rem",
  "gutter-mobile": "1rem",
  "gutter-desktop": "2rem",
  "space-xl": "2rem",
  "space-lg": "1.5rem",
  "space-xxs": "0.25rem",
};

const serif = ["Noto Serif", "ui-serif", "Georgia", "serif"];
const sans = ["Work Sans", "ui-sans-serif", "system-ui", "sans-serif"];

export const fontFamily = {
  "label-md": sans,
  "body-lg": sans,
  "display-mobile": serif,
  "headline-lg": serif,
  display: serif,
  "headline-sm": serif,
  "body-md": sans,
  "label-sm": sans,
  "headline-lg-mobile": serif,
  "headline-md": serif,
  "body-sm": sans,
  "label-lg": sans,
};

export const fontSize = {
  "label-md": ["13px", { lineHeight: "18px", letterSpacing: "0.04em", fontWeight: "600" }],
  "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
  "display-mobile": ["38px", { lineHeight: "44px", letterSpacing: "-0.01em", fontWeight: "700" }],
  "headline-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.015em", fontWeight: "600" }],
  display: ["56px", { lineHeight: "64px", letterSpacing: "-0.02em", fontWeight: "700" }],
  "headline-sm": ["22px", { lineHeight: "30px", fontWeight: "600" }],
  "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
  "label-sm": ["11px", { lineHeight: "16px", letterSpacing: "0.06em", fontWeight: "700" }],
  "headline-lg-mobile": ["30px", { lineHeight: "36px", letterSpacing: "-0.01em", fontWeight: "600" }],
  "headline-md": ["28px", { lineHeight: "36px", fontWeight: "600" }],
  "body-sm": ["14px", { lineHeight: "20px", fontWeight: "400" }],
  "label-lg": ["15px", { lineHeight: "20px", letterSpacing: "0.02em", fontWeight: "600" }],
};
