const path = require('path');
const fs = require('fs');
const { extractTextFromDocument } = require('../lib/ai/document-parser');
const { buildDocumentChunks } = require('../lib/ai/indexing');

(async () => {
  try {
    const file = path.join(__dirname, '..', 'test-data', 'sample.pdf');
    const buf = fs.readFileSync(file);
    const parsed = await extractTextFromDocument('sample.pdf', buf);
    console.log('Extracted text:\n', parsed.slice(0, 400));

    const chunks = buildDocumentChunks({
      id: 'upload-test-1',
      title: 'Sample PDF',
      excerpt: parsed.slice(0, 200),
      url: 'uploaded://sample.pdf',
      sourceType: 'publication',
      content: parsed,
    });

    console.log('\nChunks:');
    chunks.forEach((c, i) => {
      console.log('--- Chunk', i);
      console.log('text:', c.text.slice(0, 200));
      console.log('payload:', c.payload);
    });
  } catch (err) {
    console.error('Error running chunk test:', err);
    process.exit(1);
  }
})();
