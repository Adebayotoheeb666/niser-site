import { getPublications, getInsights, getEvents, getNews } from '@/lib/cms/client';
import { getEmbedding } from '@/lib/ai/embeddings';
import { deleteStaleEmbeddings, upsertEmbeddings, qdrantPointId, type QdrantPointPayload, isQdrantEnabled } from '@/lib/ai/qdrant';
import { isElasticsearchEnabled, bulkIndexDocuments, type ElasticsearchDocument } from '@/lib/search/elasticsearch';

interface IndexableDocument {
  id: string;
  title: string;
  excerpt: string;
  url: string;
  sourceType: 'publication' | 'insight' | 'event' | 'news';
  publishedYear?: number;
  content?: string;
}

function normalizeText(value?: string | null): string {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function chunkText(text: string, maxChars = 700, overlap = 120): string[] {
  const normalized = normalizeText(text);
  if (!normalized) {
    return [];
  }

  if (normalized.length <= maxChars) {
    return [normalized];
  }

  const sentences = normalized.split(/(?<=[.!?])\s+/).filter(Boolean);
  const chunks: string[] = [];
  let current = '';

  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;

    if (candidate.length <= maxChars) {
      current = candidate;
      continue;
    }

    if (current) {
      chunks.push(current);
    }

    // Carry the tail of the previous chunk so context is not lost across cuts.
    const carry = current ? current.slice(-overlap).replace(/^\s+/, '') : '';
    current = carry ? `${carry} ${sentence}` : sentence;

    // Extremely long sentences: hard-slice to stay bounded.
    while (current.length > maxChars) {
      chunks.push(current.slice(0, maxChars));
      current = current.slice(maxChars);
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks.length > 0 ? chunks : [normalized.slice(0, maxChars)];
}

export function buildDocumentChunks(document: IndexableDocument): Array<{ text: string; payload: QdrantPointPayload }> {
  const sections = [document.title, document.content ?? document.excerpt].filter(Boolean);
  const combined = sections.join('\n\n');
  const chunks = chunkText(combined);

  return chunks.map((chunk, index) => ({
    text: `${document.title}\n\n${chunk}`,
    payload: {
      sourceId: document.id,
      title: document.title,
      excerpt: index === 0 ? document.excerpt : `${document.excerpt} (continued)`,
      content: chunk,
      url: document.url,
      sourceType: document.sourceType,
      publishedYear: document.publishedYear,
    },
  }));
}

function describeIndexingError(error: unknown): string {
  if (error instanceof Error) {
    const cause = (error as Error & { cause?: { code?: string; message?: string } }).cause;
    const causeDetail = cause?.code ?? cause?.message;
    return causeDetail ? `${error.message} (${causeDetail})` : error.message;
  }
  return String(error);
}

export async function syncCmsContentToVectorStore(): Promise<{
  message: string;
  count: number;
  chunkCount: number;
  sources: string[];
  warnings: string[];
}> {
  const [publications, insights, events, news] = await Promise.all([
    getPublications({ limit: 200 }),
    getInsights({ limit: 100 }),
    getEvents({ limit: 100 }),
    getNews({ limit: 100 }),
  ]);

  const documents: IndexableDocument[] = [];

  for (const publication of publications) {
    documents.push({
      id: `publication-${publication.id}`,
      title: publication.title,
      excerpt: publication.abstract ?? '',
      url: publication.slug ? `/publications/${publication.slug}` : '/publications',
      sourceType: 'publication',
      publishedYear: publication.publishedYear,
      content: `${publication.abstract ?? ''}\n\n${publication.authors?.map((author) => author.fullName).join(', ') ?? ''}`,
    });
  }

  for (const insight of insights) {
    documents.push({
      id: `insight-${insight.id}`,
      title: insight.title,
      excerpt: insight.socialSummary ?? insight.bodyPlaintext ?? insight.body ?? '',
      url: insight.slug ? `/insights/${insight.slug}` : '/insights',
      sourceType: 'insight',
      publishedYear: insight.publishedDate ? new Date(insight.publishedDate).getFullYear() : undefined,
      content: `${insight.bodyPlaintext ?? insight.body ?? ''}`,
    });
  }

  for (const event of events) {
    documents.push({
      id: `event-${event.id}`,
      title: event.title,
      excerpt: event.summary ?? '',
      url: '/events',
      sourceType: 'event',
      publishedYear: event.startDate ? new Date(event.startDate).getFullYear() : undefined,
      content: `${event.summary ?? ''}\n\n${event.location ?? ''}`,
    });
  }

  for (const item of news) {
    documents.push({
      id: `news-${item.id}`,
      title: item.title,
      excerpt: item.summary ?? item.body ?? '',
      url: item.externalUrl ?? (item.slug ? `/news/${item.slug}` : '/news'),
      sourceType: 'news',
      publishedYear: item.publishedDate ? new Date(item.publishedDate).getFullYear() : undefined,
      content: `${item.body ?? ''}`,
    });
  }

  const points: Array<{ id: string; vector: number[]; payload: QdrantPointPayload }> = [];
  const esDocuments: ElasticsearchDocument[] = [];
  const warnings: string[] = [];
  let chunkCount = 0;

  for (const document of documents) {
    const chunks = buildDocumentChunks(document);
    for (let chunkIndex = 0; chunkIndex < chunks.length; chunkIndex += 1) {
      const chunk = chunks[chunkIndex];
      if (isQdrantEnabled()) {
        const vector = await getEmbedding(chunk.text);
        points.push({
          id: qdrantPointId(`${document.id}:${chunkIndex}`),
          vector,
          payload: {
            ...chunk.payload,
            excerpt: chunk.payload.excerpt,
          },
        });
      }

      esDocuments.push({
        id: `${document.id}:${chunkIndex}`,
        title: document.title,
        excerpt: chunk.payload.excerpt,
        url: document.url,
        sourceType: document.sourceType,
        division: document.sourceType === 'publication' ? document.sourceType : undefined,
        publishedYear: document.publishedYear,
        text: chunk.text,
      });

      chunkCount += 1;
    }
  }

  let qdrantSucceeded = false;
  if (isQdrantEnabled() && points.length > 0) {
    try {
      await upsertEmbeddings(points);
      await deleteStaleEmbeddings(documents.map((document) => document.id));
      qdrantSucceeded = true;
    } catch (error) {
      warnings.push(`Qdrant indexing failed: ${describeIndexingError(error)}`);
    }
  }

  let elasticsearchSucceeded = false;
  if (isElasticsearchEnabled() && esDocuments.length > 0) {
    try {
      await bulkIndexDocuments(esDocuments);
      elasticsearchSucceeded = true;
    } catch (error) {
      warnings.push(`Elasticsearch indexing failed: ${describeIndexingError(error)}`);
    }
  }

  if (!qdrantSucceeded && !elasticsearchSucceeded && warnings.length > 0) {
    throw new Error(warnings.join('; '));
  }

  return {
    message: 'Embedding and search indexing completed',
    count: points.length + esDocuments.length,
    chunkCount,
    sources: Array.from(new Set(documents.map((document) => document.sourceType))),
    warnings,
  };
}
