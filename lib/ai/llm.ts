import { createClaudeCompletion, isClaudeEnabled } from './claude';
import { createGeminiCompletion, isGeminiEnabled } from './gemini';
import { createOllamaCompletion, createOllamaStream, isOllamaEnabled } from './ollama';

const AI_PROVIDER = process.env.AI_PROVIDER?.toLowerCase();

export type AiProvider = 'ollama' | 'gemini' | 'claude';

export interface AiCompletionParams {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

export function getAiProvider(): AiProvider {
  if (AI_PROVIDER) {
    if (AI_PROVIDER === 'ollama') {
      if (!isOllamaEnabled()) throw new Error('AI_PROVIDER=ollama but OLLAMA_URL is not configured');
      return 'ollama';
    }

    if (AI_PROVIDER === 'gemini') {
      if (!isGeminiEnabled()) throw new Error('AI_PROVIDER=gemini but GEMINI_API_KEY is not configured');
      return 'gemini';
    }

    if (AI_PROVIDER === 'claude') {
      if (!isClaudeEnabled()) throw new Error('AI_PROVIDER=claude but CLAUDE_API_KEY is not configured');
      return 'claude';
    }

    if (AI_PROVIDER !== 'auto') {
      throw new Error(`Unsupported AI_PROVIDER value: ${AI_PROVIDER}`);
    }
  }

  if (isOllamaEnabled()) return 'ollama';
  if (isGeminiEnabled()) return 'gemini';
  if (isClaudeEnabled()) return 'claude';

  throw new Error('No AI provider configured. Set OLLAMA_URL, GEMINI_API_KEY, or CLAUDE_API_KEY in .env.local');
}

export async function createAiCompletion(params: AiCompletionParams): Promise<string> {
  const provider = getAiProvider();

  if (provider === 'ollama') {
    return createOllamaCompletion(params);
  }

  if (provider === 'gemini') {
    return createGeminiCompletion(params);
  }

  return createClaudeCompletion(params);
}

export async function* streamAiCompletion(params: AiCompletionParams): AsyncGenerator<string> {
  const provider = getAiProvider();
  if (provider !== 'ollama') {
    yield await createAiCompletion(params);
    return;
  }

  const response = await createOllamaStream(params);
  if (!response.body) throw new Error('Ollama stream response has no body');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  const consumeLine = (line: string): string | null => {
    if (!line.trim()) return null;
    try {
      const event = JSON.parse(line) as { response?: unknown };
      return typeof event.response === 'string' ? event.response : null;
    } catch {
      console.warn('[llm] Ignoring malformed Ollama stream event');
      return null;
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let newlineIndex: number;
    while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
      const token = consumeLine(buffer.slice(0, newlineIndex));
      buffer = buffer.slice(newlineIndex + 1);
      if (token) yield token;
    }
  }
  const token = consumeLine(buffer + decoder.decode());
  if (token) yield token;
}
