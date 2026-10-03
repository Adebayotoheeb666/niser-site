const fs = require('fs');
const path = require('path');
const pdfParse = require('pdf-parse');

(async () => {
  try {
    const file = path.join(__dirname, '..', 'test-data', 'sample.pdf');
    const buf = fs.readFileSync(file);
    const data = await pdfParse(buf);
    console.log('=== PDF parse text ===');
    console.log(data.text || '(no text extracted)');
    console.log('=== Full parse object keys ===');
    console.log(Object.keys(data));
  } catch (err) {
    console.error('Parse failed:', err);
    process.exit(1);
  }
})();
