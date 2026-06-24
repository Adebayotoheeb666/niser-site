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
      animation: {
        "fade-in": "fadeIn 600ms ease-out forwards",
        "fade-in-slow": "fadeIn 1000ms ease-out forwards",
        "slide-up": "slideUp 600ms ease-out forwards",
        "slide-up-stagger": "slideUp 600ms ease-out forwards",
        "slide-down": "slideDown 400ms ease-out forwards",
        "scale-in": "scaleIn 500ms ease-out forwards",
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "bounce-light": "bounceLight 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
        bounceLight: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
