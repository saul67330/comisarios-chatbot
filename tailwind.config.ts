import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      "colors": {
        "on-secondary-container": "#b7b5b4",
        "surface-container-highest": "#353534",
        "on-primary-fixed": "#241a00",
        "surface-container-lowest": "#0e0e0e",
        "error": "#ffb4ab",
        "primary-fixed": "#ffe088",
        "error-container": "#93000a",
        "on-primary-fixed-variant": "#574500",
        "tertiary": "#ffbfaf",
        "primary-fixed-dim": "#e9c349",
        "primary-container": "#d4af37",
        "surface-container-high": "#2a2a2a",
        "primary": "#f2ca50",
        "outline-variant": "#4d4635",
        "tertiary-fixed": "#ffdbd1",
        "secondary-container": "#474746",
        "inverse-surface": "#e5e2e1",
        "on-tertiary-fixed": "#3b0800",
        "tertiary-container": "#ff977b",
        "on-surface-variant": "#d0c5af",
        "on-error": "#690005",
        "secondary-fixed-dim": "#c8c6c5",
        "on-secondary": "#313030",
        "surface": "#131313",
        "on-tertiary": "#601300",
        "on-tertiary-container": "#851e00",
        "on-secondary-fixed": "#1c1b1b",
        "tertiary-fixed-dim": "#ffb5a1",
        "surface-tint": "#e9c349",
        "secondary-fixed": "#e5e2e1",
        "on-error-container": "#ffdad6",
        "on-background": "#e5e2e1",
        "inverse-primary": "#735c00",
        "on-surface": "#e5e2e1",
        "on-primary-container": "#554300",
        "outline": "#99907c",
        "surface-dim": "#131313",
        "surface-variant": "#353534",
        "surface-container-low": "#1c1b1b",
        "secondary": "#c8c6c5",
        "on-tertiary-fixed-variant": "#881f00",
        "on-secondary-fixed-variant": "#474746",
        "surface-bright": "#393939",
        "inverse-on-surface": "#313030",
        "background": "#131313",
        "surface-container": "#201f1f",
        "on-primary": "#3c2f00"
      },
      "borderRadius": {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      "fontFamily": {
        "headline": ["Newsreader", "serif"],
        "body": ["Manrope", "sans-serif"],
        "label": ["Manrope", "sans-serif"]
      }
    },
  },
  plugins: [],
};
export default config;
