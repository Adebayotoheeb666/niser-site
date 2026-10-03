const http = require('http');

const PORT = process.env.PORT || 8003;

function sendJson(res, status, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
  });
  res.end(body);
}

const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/translate') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          const data = JSON.parse(body || '{}');
          const text = String(data.text ?? '');
          const targetLangRaw = String(data.targetLang ?? data.target_language ?? 'unknown');
          const targetLang = normalizeLang(targetLangRaw);

          const translated = translateTextMock(text, targetLang);
          sendJson(res, 200, { translatedText: translated, sourceLanguage: 'eng_Latn' });
        } catch (err) {
          sendJson(res, 400, { error: 'invalid json' });
        }
      });
      return;
    }

  // default 404
  sendJson(res, 404, { error: 'not found' });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Mock NLLB translation service listening on http://127.0.0.1:${PORT}`);
});

// --- Simple mock translation logic ---
function normalizeLang(l) {
  const s = String(l || '').toLowerCase();
  if (s.startsWith('yo') || s.includes('yor')) return 'yo';
  if (s.startsWith('ha')) return 'ha';
  if (s.startsWith('ig') || s.includes('ibo')) return 'ig';
  return s;
}

const DICTIONARY = {
  yo: {
    hello: 'bawo',
    world: 'ayé',
    'thank you': 'ẹ ṣe',
    thanks: 'ẹ ṣe',
    yes: 'bẹẹni',
    no: 'rara',
    policy: 'ilana',
    agriculture: 'ogbin',
    finance: 'owo',
  },
  ha: {
    hello: 'sannu',
    world: 'duniya',
    'thank you': 'na gode',
    thanks: 'na gode',
    yes: 'eh',
    no: 'a’a',
    policy: 'manufa',
    agriculture: 'noman',
    finance: 'kudi',
  },
  ig: {
    hello: 'ndewo',
    world: 'ụwa',
    'thank you': 'daalu',
    thanks: 'daalu',
    yes: 'ee',
    no: 'mba',
    policy: 'usoro',
    agriculture: 'ọpụpụ',
    finance: 'ego',
  },
};

function translateTextMock(text, targetLang) {
  if (!text) return '';
  // simple tokenization on whitespace, preserve punctuation
  const tokens = text.split(/(\s+)/);
  const out = tokens.map((tok) => {
    if (/^\s+$/.test(tok)) return tok;
    const leading = tok.match(/^\W+/)?.[0] ?? '';
    const trailing = tok.match(/\W+$/)?.[0] ?? '';
    const core = tok.replace(/^\W+/, '').replace(/\W+$/, '');
    const translatedCore = translateWord(core, targetLang);
    // preserve capitalization
    const preserved = preserveCase(core, translatedCore);
    return leading + preserved + trailing;
  });
  return out.join('');
}

function translateWord(word, targetLang) {
  if (!word) return word;
  const key = word.toLowerCase();
  const dict = DICTIONARY[targetLang];
  if (!dict) return `${word} (mock -> ${targetLang})`;
  // try multi-word phrase matches (e.g., "thank you") - handled at token level only if exact
  if (dict[key]) return dict[key];
  return `${word} (mock -> ${targetLang})`;
}

function preserveCase(orig, translated) {
  if (!orig) return translated;
  if (orig === orig.toUpperCase()) return translated.toUpperCase();
  if (orig[0] === orig[0].toUpperCase()) return translated[0]?.toUpperCase() + translated.slice(1);
  return translated;
}
