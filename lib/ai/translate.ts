import { promises as fs } from 'fs';
import path from 'path';
import { getFirebaseFirestore } from '@/lib/firebase-admin';
import { createGeminiCompletion, isGeminiEnabled } from '@/lib/ai/gemini';

const NLLB_SERVICE_URL = process.env.NLLB_SERVICE_URL;
const TRANSLATION_CACHE_TTL_SEC = Number(process.env.TRANSLATION_CACHE_TTL_SEC ?? 60 * 60 * 24 * 30); // 30 days default
const GLOSSARY_PATH = process.env.TRANSLATION_GLOSSARY_PATH ?? '';
// Backend selection: `nllb` (self-hosted), `gemini`, or `auto` (default: NLLB if configured, else Gemini).
const TRANSLATION_PROVIDER = process.env.TRANSLATION_PROVIDER?.toLowerCase() || 'auto';

function resolveTranslationBackend(): 'nllb' | 'gemini' {
  if (TRANSLATION_PROVIDER === 'nllb') {
    if (!NLLB_SERVICE_URL) {
      throw new Error('TRANSLATION_PROVIDER=nllb but NLLB_SERVICE_URL is not configured');
    }
    return 'nllb';
  }

  if (TRANSLATION_PROVIDER === 'gemini') {
    if (!isGeminiEnabled()) {
      throw new Error('TRANSLATION_PROVIDER=gemini but GEMINI_API_KEY is not configured');
    }
    return 'gemini';
  }

  if (TRANSLATION_PROVIDER !== 'auto') {
    throw new Error(`Unsupported TRANSLATION_PROVIDER value: ${TRANSLATION_PROVIDER}`);
  }

  if (NLLB_SERVICE_URL) return 'nllb';
  if (isGeminiEnabled()) return 'gemini';

  throw new Error('No translation backend configured. Set NLLB_SERVICE_URL or GEMINI_API_KEY in .env.local');
}

export interface TranslationResult {
  translatedText: string;
  sourceLanguage?: string;
  targetLanguage: string;
  qualityScore?: number;
  needsReview?: boolean;
  memoryHit?: boolean;
}

async function loadGlossary(): Promise<Record<string, Record<string, string>>> {
  if (!GLOSSARY_PATH) return {};
  try {
    const abs = path.isAbsolute(GLOSSARY_PATH) ? GLOSSARY_PATH : path.join(process.cwd(), GLOSSARY_PATH);
    const raw = await fs.readFile(abs, 'utf8');
    return JSON.parse(raw) as Record<string, Record<string, string>>;
  } catch {
    return {};
  }
}

export function applyGlossaryPlaceholders(text: string, glossary: Record<string, Record<string, string>>) {
  const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
  const placeholders: { [key: string]: string } = {};
  let out = text;
  let idx = 0;
  for (const term of terms) {
    const re = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\b`, 'gi');
    if (!re.test(out)) continue;
    const placeholder = `__GLOSS_${idx}__`;
    placeholders[placeholder] = term;
    out = out.replace(re, placeholder);
    idx++;
  }
  return { text: out, placeholders };
}

export function restoreGlossaryPlaceholders(translated: string, placeholders: { [key: string]: string }, glossary: Record<string, Record<string, string>>, target: string) {
  let out = translated;
  for (const [ph, term] of Object.entries(placeholders)) {
    const targetTerm = glossary[term]?.[target] ?? term;
    out = out.split(ph).join(targetTerm);
  }
  return out;
}

function makeCacheKey(text: string, target: string) {
  return `${target}::${text}`;
}

function computeQualityScore(source: string, translated: string) {
  const srcLen = source.trim().length || 1;
  const tgtLen = translated.trim().length || 1;
  const ratio = Math.min(tgtLen / srcLen, srcLen / tgtLen);
  // naive checks: length similarity and presence of non-ascii (for some languages)
  let score = ratio;
  if (translated.includes('@@') || translated.includes('???')) score -= 0.3;
  return Math.max(0, Math.min(1, score));
}

export async function translateText(
  text: string,
  targetLanguage: string,
): Promise<TranslationResult> {
  const backend = resolveTranslationBackend();

  // Initialize Firestore only when configured (service account or emulator).
  // This lets the translation service run even when Firestore is unavailable.
  let db: ReturnType<typeof getFirebaseFirestore> | null = null;
  try {
    if (process.env.FIRESTORE_EMULATOR_HOST || process.env.FIREBASE_SERVICE_ACCOUNT) {
      db = getFirebaseFirestore();
    }
  } catch (err) {
    console.warn('[translate] firestore init failed', err);
    db = null;
  }
  const glossary = await loadGlossary();

  // Check cache / memory first
  const cacheKey = makeCacheKey(text, targetLanguage);
  try {
    if (db) {
      const ds = await db.collection('translation_cache').where('cacheKey', '==', cacheKey).limit(1).get();
      if (!ds.empty) {
        const doc = ds.docs[0].data();
        const createdAt = new Date(doc.createdAt).getTime();
        if ((Date.now() - createdAt) / 1000 < TRANSLATION_CACHE_TTL_SEC) {
          return { translatedText: doc.translatedText, sourceLanguage: doc.sourceLanguage ?? undefined, targetLanguage, qualityScore: doc.qualityScore ?? 1, memoryHit: true } as TranslationResult;
        }
      }
    }
  } catch (err) {
    console.warn('[translate] cache lookup failed', err);
  }

  // Apply glossary placeholders
  const { text: preppedText, placeholders } = applyGlossaryPlaceholders(text, glossary);

  let rawTranslated = '';
  let sourceLanguage = '';

  try {
    if (backend === 'nllb') {
      const response = await fetch(`${NLLB_SERVICE_URL}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: preppedText, targetLang: targetLanguage }),
      });

      if (!response.ok) {
        const body = await response.text().catch(() => '');
        throw new Error(`Translation request failed: ${response.status} ${body}`);
      }

      type TranslationResponse = { translatedText?: string; translation?: string; sourceLanguage?: string; source_language?: string };
      const data = (await response.json().catch(() => ({}))) as TranslationResponse;
      rawTranslated = String(data.translatedText ?? data.translation ?? '');
      sourceLanguage = String(data.sourceLanguage ?? data.source_language ?? '');
    } else {
      const prompt = [
        `Translate the following text into the language with ISO 639 code "${targetLanguage}".`,
        'Return only the translated text — no commentary, quotes, or explanations.',
        'Keep any placeholders such as __GLOSS_0__ exactly unchanged.',
        '',
        preppedText,
      ].join('\n');

      rawTranslated = await createGeminiCompletion({
        prompt,
        temperature: 0.2,
        maxTokens: Math.min(8192, Math.max(512, Math.ceil(text.length * 2))),
      });
    }
  } catch (error) {
    // record for review (if db available)
    try {
      if (db) await db.collection('translation_review').add({ text, targetLanguage, error: error instanceof Error ? error.message : String(error), createdAt: new Date().toISOString() });
    } catch {}
    throw error;
  }

  const translatedText = restoreGlossaryPlaceholders(rawTranslated, placeholders, glossary, targetLanguage);

  const qualityScore = computeQualityScore(text, translatedText);
  const needsReview = qualityScore < Number(process.env.TRANSLATION_QUALITY_THRESHOLD ?? '0.5');

  // persist to cache and memory (if db available)
  try {
    if (db) {
      await db.collection('translation_cache').add({ cacheKey, translatedText, sourceLanguage: sourceLanguage || null, targetLanguage, qualityScore, createdAt: new Date().toISOString() });
      if (needsReview) {
        await db.collection('translation_review').add({ text, translatedText, targetLanguage, qualityScore, createdAt: new Date().toISOString() });
      }
    }
  } catch (err) {
    console.warn('[translate] failed to write cache/review', err);
  }

  return { translatedText, sourceLanguage, targetLanguage, qualityScore, needsReview };
}

export async function translateSegments(segments: string[], targetLanguage: string) {
  const results: TranslationResult[] = [];
  for (const seg of segments) {
    try {
      const r = await translateText(seg, targetLanguage);
      results.push(r);
    } catch {
      results.push({ translatedText: '', targetLanguage, needsReview: true });
    }
  }
  return results;
}
