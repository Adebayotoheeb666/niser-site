const EMBEDDING_SERVICE_URL = process.env.EMBEDDING_SERVICE_URL;
const EMBEDDING_SERVICE_MODEL = process.env.EMBEDDING_SERVICE_MODEL;
const OLLAMA_URL = process.env.OLLAMA_URL;
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL ?? process.env.OLLAMA_MODEL ?? 'nomic-embed-text';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = process.env.GEMINI_API_URL ?? 'https://generativelanguage.googleapis.com/v1beta';
const GEMINI_EMBEDDING_MODEL = process.env.GEMINI_EMBEDDING_MODEL ?? 'gemini-embedding-001';
const GEMINI_EMBEDDING_OUTPUT_DIMENSIONALITY = process.env.GEMINI_EMBEDDING_OUTPUT_DIMENSIONALITY;

async function getEmbeddingFromService(text: string): Promise<number[]> {
  if (!EMBEDDING_SERVICE_URL) {
    throw new Error('EMBEDDING_SERVICE_URL is not configured. Set it in .env.local');
  }

  const response = await fetch(`${EMBEDDING_SERVICE_URL}/embeddings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: text,
      ...(EMBEDDING_SERVICE_MODEL ? { model: EMBEDDING_SERVICE_MODEL } : {}),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Embedding service request failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  if (Array.isArray(data?.data) && Array.isArray(data.data[0]?.embedding)) {
    return data.data[0].embedding as number[];
  }

  if (Array.isArray(data?.embedding)) {
    return data.embedding as number[];
  }

  throw new Error(`Unexpected embedding response: ${JSON.stringify(data)}`);
}

async function getEmbeddingFromOllama(text: string): Promise<number[]> {
  if (!OLLAMA_URL) {
    throw new Error('OLLAMA_URL is not configured. Set it in .env.local');
  }

  const response = await fetch(`${OLLAMA_URL.replace(/\/$/, '')}/api/embed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: OLLAMA_EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Ollama embedding request failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  if (Array.isArray(data?.embedding)) {
    return data.embedding as number[];
  }

  if (Array.isArray(data?.embeddings) && Array.isArray(data.embeddings[0])) {
    return data.embeddings[0] as number[];
  }

  throw new Error(`Unexpected Ollama embedding response: ${JSON.stringify(data)}`);
}

async function getEmbeddingFromGemini(text: string): Promise<number[]> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Set it in .env.local');
  }

  const response = await fetch(
    `${GEMINI_API_URL.replace(/\/$/, '')}/models/${encodeURIComponent(GEMINI_EMBEDDING_MODEL)}:embedContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        model: `models/${GEMINI_EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        ...(GEMINI_EMBEDDING_OUTPUT_DIMENSIONALITY
          ? { outputDimensionality: Number(GEMINI_EMBEDDING_OUTPUT_DIMENSIONALITY) }
          : {}),
      }),
    },
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Gemini embedding request failed: ${response.status} ${body}`);
  }

  const data = await response.json();
  if (Array.isArray(data?.embedding?.values)) {
    return data.embedding.values as number[];
  }

  throw new Error(`Unexpected Gemini embedding response: ${JSON.stringify(data)}`);
}

export async function getEmbedding(text: string): Promise<number[]> {
  if (EMBEDDING_SERVICE_URL) {
    return getEmbeddingFromService(text);
  }

  if (OLLAMA_URL) {
    try {
      return await getEmbeddingFromOllama(text);
    } catch (error) {
      console.warn('[embeddings] Ollama embeddings unavailable, falling back to a lightweight keyword embedding:', (error as Error).message);
    }
  }

  if (GEMINI_API_KEY) {
    try {
      return await getEmbeddingFromGemini(text);
    } catch (error) {
      console.warn('[embeddings] Gemini embeddings unavailable, falling back to a lightweight keyword embedding:', (error as Error).message);
    }
  }

  const normalized = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(Boolean);
  const vector = Array.from({ length: 32 }, () => 0);

  normalized.forEach((token) => {
    let hash = 0;
    for (let i = 0; i < token.length; i += 1) {
      hash = (hash * 31 + token.charCodeAt(i)) >>> 0;
    }
    const index = hash % vector.length;
    vector[index] += 1;
  });

  return vector;
}
