import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "nigeria-green-deep": "#006B3F",
        "nigeria-green-vibrant": "#008a51",
        "nigeria-gold": "#FFB81C",
        "research-blue": "#1e40af",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f9fafb",
        "surface-container-high": "#f3f4f6",
        "surface": "#f9fafb",
        "surface-gray": "#e5e7eb",
        "on-surface-variant": "#6b7280",
        "on-primary": "#ffffff",
        "outline": "#9ca3af",
        "outline-variant": "#d1d5db",
      },
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        headline: ["'Playfair Display'", "Georgia", "serif"],
        body: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "sans-serif"],
        label: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "sans-serif"],
      },
      fontSize: {
        "display-lg": ["3rem", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-lg": ["2.25rem", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-md": ["1.75rem", { lineHeight: "1.2", fontWeight: "700" }],
        "body-lg": ["1.125rem", { lineHeight: "1.6", fontWeight: "400" }],
        "body-md": ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        "label-md": ["0.9375rem", { lineHeight: "1.4", fontWeight: "500" }],
        "label-sm": ["0.875rem", { lineHeight: "1.4", fontWeight: "500" }],
      },
      spacing: {
        "gutter": "1.5rem",
        "margin-desktop": "1.5rem",
      },
      maxWidth: {
        "max-width": "1280px",
      },
      padding: {
        "margin-desktop": "1.5rem",
      },
    },
  },
  plugins: [],
};
export default config;
