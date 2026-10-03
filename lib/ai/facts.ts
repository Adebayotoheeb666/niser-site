/**
 * Lightweight, deterministic extraction of durable facts and research
 * interests from a user's chat message. Used to build the long-term
 * visitor memory profile without an extra LLM round-trip per message.
 */

export interface ExtractedFact {
  key: string;
  value: string;
}

export interface ExtractionResult {
  facts: ExtractedFact[];
  interests: string[];
}

const FACT_PATTERNS: Array<{ key: string; pattern: RegExp }> = [
  { key: 'name', pattern: /(?:my name is|i am called|call me|my full name is)\s+([A-Z][a-z]{1,}(?:\s+[A-Z][a-z]{1,})?)(?=\s|\.|,|\?|!|$)/i },
  { key: 'role', pattern: /i(?:'m| am)\s+(?:a|an)\s+(researcher|economist|analyst|student|lecturer|professor|academic|consultant|policy analyst|policy maker|government official|civil servant|journalist|farmer|entrepreneur|business owner)/i },
  { key: 'study', pattern: /i(?:'m| am)?\s+(?:currently\s+)?studying\s+(.+?)(?:[.!?]|$)/i },
  { key: 'work', pattern: /i\s+(?:work|have been working|am working)\s+(?:on|in|at)\s+(.+?)(?:[.!?]|$)/i },
  { key: 'interest', pattern: /i(?:'m| am)?\s+(?:particularly\s+)?interested\s+in\s+(.+?)(?:[.!?]|$)/i },
  { key: 'location', pattern: /i(?:'m| am)?\s+(?:currently\s+)?(?:based|located|living|live)\s+in\s+(.+?)(?:[.!?]|$)/i },
  {
    key: 'organization',
    pattern: /(?:at|with)\s+(the\s+)?(niser|university of [a-z ]+|world bank|imf|afdb|undp|unicef|federal ministry [a-z ]+|ministry of [a-z ]+)/i,
  },
];

const INTEREST_KEYWORDS: Array<{ keyword: string; label: string }> = [
  { keyword: 'agriculture', label: 'agriculture' },
  { keyword: 'food security', label: 'food security' },
  { keyword: 'poverty', label: 'poverty' },
  { keyword: 'inequality', label: 'inequality' },
  { keyword: 'economy', label: 'economy' },
  { keyword: 'economics', label: 'economics' },
  { keyword: 'macroeconomic', label: 'macroeconomics' },
  { keyword: 'monetary', label: 'monetary policy' },
  { keyword: 'fiscal', label: 'fiscal policy' },
  { keyword: 'tax', label: 'taxation' },
  { keyword: 'governance', label: 'governance' },
  { keyword: 'institution', label: 'institutions' },
  { keyword: 'education', label: 'education' },
  { keyword: 'health', label: 'health' },
  { keyword: 'energy', label: 'energy' },
  { keyword: 'trade', label: 'trade' },
  { keyword: 'industry', label: 'industry' },
  { keyword: 'manufacturing', label: 'manufacturing' },
  { keyword: 'labour', label: 'labour' },
  { keyword: 'labor', label: 'labour' },
  { keyword: 'employment', label: 'employment' },
  { keyword: 'unemployment', label: 'unemployment' },
  { keyword: 'infrastructure', label: 'infrastructure' },
  { keyword: 'climate', label: 'climate' },
  { keyword: 'environment', label: 'environment' },
  { keyword: 'gender', label: 'gender' },
  { keyword: 'social protection', label: 'social protection' },
  { keyword: 'revenue', label: 'revenue' },
  { keyword: 'finance', label: 'finance' },
  { keyword: 'banking', label: 'banking' },
  { keyword: 'rural', label: 'rural development' },
  { keyword: 'urban', label: 'urban development' },
  { keyword: 'migration', label: 'migration' },
  { keyword: 'digital', label: 'digital economy' },
  { keyword: 'technology', label: 'technology' },
  { keyword: 'data', label: 'data' },
  { keyword: 'statistics', label: 'statistics' },
];

function cleanPhrase(value: string): string {
  return value
    .replace(/[^a-z0-9' &.\-()]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 140);
}

export function extractFacts(message: string): ExtractedFact[] {
  const facts: ExtractedFact[] = [];
  for (const { key, pattern } of FACT_PATTERNS) {
    const match = message.match(pattern);
    if (!match?.[1]) continue;
    const value = cleanPhrase(match[1]);
    if (value.length >= 3) {
      facts.push({ key, value });
    }
  }
  return facts;
}

export function extractInterests(message: string): string[] {
  const lowered = message.toLowerCase();
  const found: string[] = [];
  for (const { keyword, label } of INTEREST_KEYWORDS) {
    if (lowered.includes(keyword) && !found.includes(label)) {
      found.push(label);
    }
  }
  return found.slice(0, 5);
}

export function extractMemory(message: string): ExtractionResult {
  return {
    facts: extractFacts(message),
    interests: extractInterests(message),
  };
}
