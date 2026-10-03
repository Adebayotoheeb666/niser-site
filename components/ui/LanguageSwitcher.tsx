"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ENGLISH_LOCALE, TRANSLATABLE_LOCALES } from "@/lib/locales";

/**
 * Language switcher for AI-translated content (Plan v1.1 §9 Capability 7).
 *
 * Appears on insight pages and their translated variants, offering
 * Ẹ̀dè Yorùbá | Hausa | Igbo | English. Hidden on non-translatable routes.
 */
export default function LanguageSwitcher() {
  const pathname = usePathname();

  // Match /{locale}/insights/{slug} first, then /insights/{slug}
  const localeMatch = pathname.match(/^\/(yo|ha|ig)\/insights\/([^/]+)$/);
  const englishMatch = pathname.match(/^\/insights\/([^/]+)$/);

  let slug: string | null = null;
  let activeLocale = ENGLISH_LOCALE;
  if (localeMatch) {
    slug = localeMatch[2];
    activeLocale = localeMatch[1];
  } else if (englishMatch) {
    slug = englishMatch[1];
  }

  if (!slug) return null;

  return (
    <nav className="lang-switcher" aria-label="Content language">
      <span className="lang-switcher__icon" aria-hidden="true">🌐</span>
      <ul className="lang-switcher__list" role="list">
        <li>
          <Link
            href={`/insights/${slug}`}
            className={`lang-switcher__link${activeLocale === ENGLISH_LOCALE ? " lang-switcher__link--active" : ""}`}
            aria-current={activeLocale === ENGLISH_LOCALE ? "true" : undefined}
          >
            English
          </Link>
        </li>
        {TRANSLATABLE_LOCALES.map((locale) => (
          <li key={locale.code}>
            <Link
              href={`/${locale.code}/insights/${slug}`}
              className={`lang-switcher__link${activeLocale === locale.code ? " lang-switcher__link--active" : ""}`}
              aria-current={activeLocale === locale.code ? "true" : undefined}
              lang={locale.code}
            >
              {locale.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
