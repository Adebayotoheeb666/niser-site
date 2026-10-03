'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Script from 'next/script';

type ConsentState = 'granted' | 'denied' | null;
type MatomoQueue = Array<unknown>;

export const CONSENT_STORAGE_KEY = 'niser-cookie-consent';
export const CONSENT_EVENT = 'niser-consent-change';

declare global {
  interface Window {
    _paq?: MatomoQueue;
  }
}

type MatomoTrackerProps = {
  url: string;
  siteId: string;
};

export function readConsent(): ConsentState {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

function buildMatomoInitScript(url: string, siteId: string) {
  const trackerUrl = `${url.replace(/\/$/, '')}/matomo.php`;
  const scriptUrl = `${url.replace(/\/$/, '')}/matomo.js`;
  const consent = readConsent();

  // NDPR consent gating:
  //  - denied → cookieless tracking only (no identifier cookies are ever set)
  //  - undecided → requireConsent holds all tracking until the visitor chooses
  //  - granted → standard measurement
  let consentCommands = '';
  if (consent === 'denied') {
    consentCommands = "_paq.push(['disableCookies']);\n    ";
  } else if (consent === null) {
    consentCommands = "_paq.push(['requireConsent']);\n    ";
  }

  return `
    var _paq = window._paq = window._paq || [];
    ${consentCommands}_paq.push(['trackPageView']);
    _paq.push(['enableLinkTracking']);
    _paq.push(['setTrackerUrl', '${trackerUrl}']);
    _paq.push(['setSiteId', '${siteId}']);
    (function() {
      var u = '${url.replace(/\/$/, '')}/';
      var d = document, g = d.createElement('script'), s = d.getElementsByTagName('script')[0];
      g.async = true;
      g.src = '${scriptUrl}';
      s.parentNode.insertBefore(g, s);
    })();
  `;
}

export default function MatomoTracker({ url, siteId }: MatomoTrackerProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const _paq = window._paq as MatomoQueue | undefined;
    if (!_paq) {
      return;
    }

    _paq.push(['setCustomUrl', window.location.pathname + window.location.search]);
    _paq.push(['setDocumentTitle', document.title]);
    _paq.push(['trackPageView']);
  }, [pathname]);

  // React to consent changes made via the banner without a page reload
  useEffect(() => {
    const onConsentChange = () => {
      const _paq = window._paq;
      if (!_paq) return;
      const consent = readConsent();
      if (consent === 'granted') {
        _paq.push(['rememberConsentGiven']);
      } else if (consent === 'denied') {
        _paq.push(['disableCookies']);
        _paq.push(['requireConsent']);
        _paq.push(['trackPageView']);
      }
    };
    window.addEventListener(CONSENT_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentChange);
  }, []);

  if (!url || !siteId) {
    return null;
  }

  return (
    <Script id="matomo-init" strategy="afterInteractive">
      {buildMatomoInitScript(url, siteId)}
    </Script>
  );
}
