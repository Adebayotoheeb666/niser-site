'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CONSENT_EVENT, CONSENT_STORAGE_KEY, readConsent } from '@/components/analytics/MatomoTracker';

/**
 * NDPR cookie-consent banner.
 *
 * Visitors choose between full measurement (cookies) and cookieless
 * measurement; the choice is stored locally and broadcast to analytics
 * via a custom DOM event. No tracking occurs before an explicit choice.
 */
export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show when no decision has been recorded yet
    if (readConsent() === null) {
      setVisible(true);
    }
  }, []);

  const decide = (choice: 'granted' | 'denied') => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // storage unavailable — keep session-only behaviour
    }
    window.dispatchEvent(new Event(CONSENT_EVENT));
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="cookie-consent"
      role="region"
      aria-label="Privacy and cookies notice"
    >
      <div className="container cookie-consent__inner">
        <p className="cookie-consent__text">
          We use privacy-friendly analytics to understand how the site is used.
          Choose <strong>Accept</strong> to allow measurement with cookies, or{' '}
          <strong>Decline</strong> for cookieless measurement. See our{' '}
          <Link href="/privacy-policy">privacy policy</Link>.
        </p>
        <div className="cookie-consent__actions">
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => decide('denied')}
          >
            Decline
          </button>
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => decide('granted')}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
