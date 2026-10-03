const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

function normalizeText(value) {
  return (value ?? '').replace(/\s+/g, ' ').trim();
}

function chunkText(text, maxChars = 700) {
  const normalized = normalizeText(text);
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];
  const sentences = normalized.split(/(?<=[.!?])\s+/).filter(Boolean);
  const chunks = [];
  let current = '';
  for (const sentence of sentences) {
    if (!current) { current = sentence; continue; }
    const candidate = `${current} ${sentence}`;
    if (candidate.length <= maxChars) current = candidate;
    else { chunks.push(current); current = sentence; }
  }
  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [normalized.slice(0, maxChars)];
}

function buildDocumentChunks(document) {
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

(async () => {
  try {
    const file = path.join(__dirname, '..', 'test-data', 'sample.pdf');
    const buf = fs.readFileSync(file);
    const data = await pdfParse(buf);
    const text = data.text ?? '';
    console.log('Extracted text (first 200 chars):', text.slice(0, 200));

    const chunks = buildDocumentChunks({
      id: 'upload-test-1',
      title: 'Sample PDF',
      excerpt: text.slice(0, 200),
      url: 'uploaded://sample.pdf',
      sourceType: 'publication',
      content: text,
    });

    console.log('\nChunks found:', chunks.length);
    chunks.forEach((c, i) => {
      console.log(`--- Chunk ${i} ---`);
      console.log('text:', c.text);
      console.log('payload:', c.payload);
    });
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
})();
