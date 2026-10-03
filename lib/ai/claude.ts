const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY;
const CLAUDE_API_URL = process.env.CLAUDE_API_URL ?? 'https://api.anthropic.com/v1/messages';

export interface ClaudeCompletionParams {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export async function createClaudeCompletion({
  prompt,
  maxTokens = 800,
  temperature = 0.2,
  model = process.env.CLAUDE_MODEL ?? 'claude-sonnet-4-20250514',
}: ClaudeCompletionParams): Promise<string> {
  if (!CLAUDE_API_KEY) {
    throw new Error('CLAUDE_API_KEY is not configured. Set it in .env.local');
  }

  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'x-api-key': CLAUDE_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API request failed: ${response.status} ${errorText}`);
  }

  const data = (await response.json()) as {
    content?: Array<{ type?: string; text?: string }>;
    error?: string;
  };

  const completion = data.content?.filter((block) => block.type === 'text').map((block) => block.text ?? '').join('').trim();
  if (!completion) {
    throw new Error(`Claude response missing completion: ${JSON.stringify(data)}`);
  }

  return completion;
}

export function isClaudeEnabled(): boolean {
  return Boolean(CLAUDE_API_KEY);
}
