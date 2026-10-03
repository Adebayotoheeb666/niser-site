import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import MatomoTracker from "@/components/analytics/MatomoTracker";
import FloatingChatbotButton from "@/components/layout/FloatingChatbotButton";
import CookieConsent from "@/components/consent/CookieConsent";

const MATOMO_URL = process.env.MATOMO_URL;
const MATOMO_SITE_ID = process.env.MATOMO_SITE_ID;

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
    <html lang="en">
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                name: 'National Institute of Social and Economic Research (NISER)',
                alternateName: 'NISER',
                url: 'https://niser.gov.ng',
                logo: 'https://niser.gov.ng/favicon.png',
                foundingDate: '1960',
                description: "Nigeria's premier policy research institute, providing evidence-based research and analysis to inform national development policy.",
                address: {
                  '@type': 'PostalAddress',
                  streetAddress: 'KM 17, Idiroko Road',
                  addressLocality: 'Ibadan',
                  addressRegion: 'Oyo State',
                  addressCountry: 'NG',
                },
                contactPoint: {
                  '@type': 'ContactPoint',
                  email: 'info@niser.gov.ng',
                  contactType: 'customer service',
                },
                sameAs: [
                  'https://twitter.com/NISERNigeria',
                  'https://www.linkedin.com/company/niser',
                ],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: 'NISER Digital Platform',
                url: 'https://niser.gov.ng',
                potentialAction: {
                  '@type': 'SearchAction',
                  target: 'https://niser.gov.ng/search?q={search_term_string}',
                  'query-input': 'required name=search_term_string',
                },
              },
            ]),
          }}
        />
      </head>
      <body>
        {/* Skip navigation for screen readers */}
        <a href="#main-content" className="skip-nav">
          Skip to main content
        </a>
        <CartProvider>{children}</CartProvider>
        <FloatingChatbotButton />
        <MatomoTracker url={MATOMO_URL ?? ""} siteId={MATOMO_SITE_ID ?? ""} />
        <CookieConsent />
      </body>
    </html>
  );
}
