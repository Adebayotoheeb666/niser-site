import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";

export const metadata: Metadata = {
  metadataBase: new URL("https://niser.gov.ng"),
  title: {
    default: "NISER — National Institute of Social and Economic Research",
    template: "%s | NISER",
  },
  description:
    "Nigeria's premier policy research institute. Providing evidence-based research and analysis to inform national development policy since 1960.",
  keywords: [
    "NISER",
    "Nigeria",
    "research",
    "policy",
    "economics",
    "social research",
    "Ibadan",
  ],
  authors: [{ name: "NISER", url: "https://niser.gov.ng" }],
  openGraph: {
    type: "website",
    locale: "en_NG",
    url: "https://niser.gov.ng",
    siteName: "NISER Digital Platform",
    title: "NISER — National Institute of Social and Economic Research",
    description:
      "Evidence-based research and analysis informing Nigeria's national development policy.",
    images: [{ url: "/og-default.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NISER Nigeria",
    description:
      "Evidence-based research and analysis informing Nigeria's national development policy.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-NG">
      <head>
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <meta name="theme-color" content="#006B3F" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        {/* Skip navigation for screen readers */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
