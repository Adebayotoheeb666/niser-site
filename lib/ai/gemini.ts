const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL ?? 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-3.6-flash';
// Thinking models spend reasoning tokens from the maxOutputTokens budget BEFORE
// writing any visible text, so every request carries extra headroom above the
// caller's target (`thinkingBudget: 0` is rejected by current Gemini 3 models).
const GEMINI_THINKING_LEVEL = (process.env.GEMINI_THINKING_LEVEL ?? 'low').toLowerCase();
const GEMINI_THINKING_TOKEN_HEADROOM = Math.max(0, Number(process.env.GEMINI_THINKING_TOKEN_HEADROOM ?? 2048));

export interface GeminiCompletionParams {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export function isGeminiEnabled(): boolean {
  return Boolean(GEMINI_API_KEY);
}

export async function createGeminiCompletion({
  prompt,
  maxTokens = 800,
  temperature = 0.2,
  model = GEMINI_MODEL,
}: GeminiCompletionParams): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Set it in .env.local');
  }

  const url = `${GEMINI_API_URL.replace(/\/$/, '')}/models/${encodeURIComponent(model)}:generateContent`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature,
        maxOutputTokens: maxTokens + GEMINI_THINKING_TOKEN_HEADROOM,
        ...(GEMINI_THINKING_LEVEL === 'low' || GEMINI_THINKING_LEVEL === 'high'
          ? { thinkingConfig: { thinkingLevel: GEMINI_THINKING_LEVEL } }
          : {}),
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini API request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> }; finishReason?: string }>;
    promptFeedback?: { blockReason?: unknown };
    usageMetadata?: { thoughtsTokenCount?: number };
  };

  const completion = data.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!completion) {
    if (data.candidates?.[0]?.finishReason === 'MAX_TOKENS') {
      throw new Error(
        `Gemini exhausted its output budget on internal thinking (${data.usageMetadata?.thoughtsTokenCount ?? 'unknown'} tokens) before writing any visible response. ` +
          'Raise GEMINI_THINKING_TOKEN_HEADROOM or set GEMINI_THINKING_LEVEL appropriately.',
      );
    }
    throw new Error(`Gemini response missing completion: ${JSON.stringify(data)}`);
  }

  return completion;
}
