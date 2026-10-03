const OLLAMA_URL = process.env.OLLAMA_URL;
const OLLAMA_MODEL = process.env.OLLAMA_MODEL ?? 'llama-3.1-8b';
const OLLAMA_API_KEY = process.env.OLLAMA_API_KEY;

export interface OllamaCompletionParams {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

function buildHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    ...(OLLAMA_API_KEY ? { Authorization: `Bearer ${OLLAMA_API_KEY}` } : {}),
  };
}

export function isOllamaEnabled(): boolean {
  return Boolean(OLLAMA_URL);
}

export async function createOllamaCompletion({
  prompt,
  maxTokens = 800,
  temperature = 0.2,
  model = OLLAMA_MODEL,
}: OllamaCompletionParams): Promise<string> {
  if (!OLLAMA_URL) {
    throw new Error('OLLAMA_URL is not configured. Set it in .env.local');
  }

  const url = `${OLLAMA_URL.replace(/\/$/, '')}/api/generate`;
  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      model,
      prompt,
      options: { num_predict: maxTokens, temperature, top_p: 0.95 },
      stream: false,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama API request failed: ${response.status} ${text}`);
  }

  const data = await response.json();
  return parseOllamaResponse(data).trim();
}

export async function createOllamaStream({
  prompt,
  maxTokens = 800,
  temperature = 0.2,
  model = OLLAMA_MODEL,
}: OllamaCompletionParams): Promise<Response> {
  if (!OLLAMA_URL) {
    throw new Error('OLLAMA_URL is not configured. Set it in .env.local');
  }

  const url = `${OLLAMA_URL.replace(/\/$/, '')}/api/generate`;
  const response = await fetch(url, {
    method: 'POST',
    headers: buildHeaders(),
    body: JSON.stringify({
      model,
      prompt,
      options: { num_predict: maxTokens, temperature, top_p: 0.95 },
      stream: true,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Ollama stream request failed: ${response.status} ${text}`);
  }

  if (!response.body) {
    throw new Error('Ollama stream response has no body');
  }

  return response;
}

type OllamaResponse = {
  output?: string;
  response?: string;
  results?: Array<{
    output?: string | string[];
    text?: string;
  }>;
  choices?: Array<{
    text?: string;
  }>;
  message?: {
    content?: string;
  };
};

function parseOllamaResponse(data: unknown): string {
  if (typeof data !== 'object' || data === null) {
    throw new Error(`Unexpected Ollama response: ${JSON.stringify(data)}`);
  }

  const response = data as OllamaResponse;

  if (typeof response.output === 'string') {
    return response.output;
  }

  if (typeof response.response === 'string') {
    return response.response;
  }

  if (typeof response.message?.content === 'string') {
    return response.message.content;
  }

  if (Array.isArray(response.results) && response.results.length > 0) {
    const result = response.results[0];

    if (typeof result.output === 'string') {
      return result.output;
    }

    if (Array.isArray(result.output)) {
      return result.output.join('');
    }

    if (typeof result.text === 'string') {
      return result.text;
    }
  }

  if (Array.isArray(response.choices) && response.choices.length > 0 && typeof response.choices[0].text === 'string') {
    return response.choices[0].text;
  }

  throw new Error(`Unexpected Ollama response: ${JSON.stringify(data)}`);
}
