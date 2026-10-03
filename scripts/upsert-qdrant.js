#!/usr/bin/env node
/*
  Script to populate Qdrant with embeddings for publications and insights.
  Usage: NODE_ENV=production node scripts/upsert-qdrant.js
  Requires: QDRANT_URL and EMBEDDING_SERVICE_URL or OLLAMA_URL (for embeddings)
*/
const path = require('path');

async function main() {
  const root = path.resolve(__dirname, '..');
  // Load next project's runtime helpers by requiring the libs directly
  const { getPublications, getInsights } = require(path.join(root, 'lib', 'cms', 'client'));
  const { getEmbedding } = require(path.join(root, 'lib', 'ai', 'embeddings'));
  const { upsertEmbeddings } = require(path.join(root, 'lib', 'ai', 'qdrant'));

  console.log('Fetching publications and insights from CMS...');
  const publications = await getPublications({ limit: 500 });
  const insights = await getInsights({ limit: 500 });

  const items = [];

  function sanitize(text) {
    if (!text) return '';
    return String(text).replace(/\s+/g, ' ').trim();
  }

  for (const pub of publications) {
    const content = sanitize(pub.abstract ?? pub.content ?? pub.title);
    if (!content) continue;
    // Split into chunks of ~800 chars with overlap
    const chunkSize = 800;
    for (let i = 0, idx = 0; i < content.length; i += chunkSize, idx += 1) {
      const chunk = content.slice(i, i + chunkSize);
      items.push({
        id: `publication-${pub.id}-${idx}`,
        text: `${pub.title}\n\n${chunk}`,
        title: pub.title,
        url: pub.slug ? `https://niser.gov.ng/publications/${pub.slug}` : '',
        sourceType: 'publication',
        publishedYear: pub.year ?? undefined,
      });
    }
  }

  for (const ins of insights) {
    const content = sanitize(ins.socialSummary ?? ins.bodyPlaintext ?? ins.body ?? ins.title);
    if (!content) continue;
    const chunkSize = 800;
    for (let i = 0, idx = 0; i < content.length; i += chunkSize, idx += 1) {
      const chunk = content.slice(i, i + chunkSize);
      items.push({
        id: `insight-${ins.id}-${idx}`,
        text: `${ins.title}\n\n${chunk}`,
        title: ins.title,
        url: ins.slug ? `https://niser.gov.ng/insights/${ins.slug}` : '',
        sourceType: 'insight',
        publishedYear: ins.publishedYear ?? undefined,
      });
    }
  }

  console.log(`Preparing ${items.length} embedding requests...`);

  const batchSize = 64;
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const points = [];
    for (const it of batch) {
      try {
        const vec = await getEmbedding(it.text);
        points.push({ id: it.id, vector: vec, payload: { title: it.title, excerpt: it.text.slice(0, 400), url: it.url, sourceType: it.sourceType, publishedYear: it.publishedYear } });
      } catch (err) {
        console.warn('Embedding failed for', it.id, (err && err.message) || err);
      }
    }

    if (points.length > 0) {
      try {
        await upsertEmbeddings(points);
        console.log(`Upserted ${points.length} points (${i}-${i + batch.length})`);
      } catch (err) {
        console.error('Qdrant upsert failed:', err && err.message ? err.message : err);
      }
    }
  }

  console.log('Qdrant population completed.');
}

main().catch((err) => {
  console.error('Error running upsert script:', err && err.message ? err.message : err);
  process.exit(1);
});
