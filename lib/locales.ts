/**
 * Content locale registry for the AI Translation Layer
 * (Implementation Plan v1.1 §9 Capability 7).
 *
 * URL patterns: /{locale}/insights/[slug] where locale ∈ yo|ha|ig
 * Translation codes match the NLLB/Gemini backends in lib/ai/translate.ts.
 */

export interface ContentLocale {
  /** URL + storage code */
  code: string;
  /** Human-readable endonym */
  label: string;
}

export const ENGLISH_LOCALE = 'en';

/** Locales available for machine translation (Nigeria's three major languages) */
export const TRANSLATABLE_LOCALES: ContentLocale[] = [
  { code: 'yo', label: 'Yorùbá' },
  { code: 'ha', label: 'Hausa' },
  { code: 'ig', label: 'Igbo' },
];

export const ALL_LOCALES: ContentLocale[] = [
  { code: ENGLISH_LOCALE, label: 'English' },
  ...TRANSLATABLE_LOCALES,
];

export function isTranslatableLocale(value?: string | null): boolean {
  return TRANSLATABLE_LOCALES.some((locale) => locale.code === value);
}
