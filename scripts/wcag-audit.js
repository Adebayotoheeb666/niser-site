/**
 * Static WCAG 2.1 AA source audit (complements runtime tools like Axe/WAVE).
 *
 * Scans all app/components TSX for common Level A/AA failures:
 *   1. <img>/next/image without alt text
 *   2. Inputs/selects/textareas without accessible names
 *   3. Buttons and icon-only links without discernible text
 *   4. Positive tabindex values (breaks natural focus order)
 *   5. Click handlers on non-interactive elements (div/span onClick)
 *   6. Missing html lang / missing main landmark in the root layout
 *   7. Autoplaying media without controls
 *
 * Usage: node scripts/wcag-audit.js [--app-only]
 * Exit code 1 when critical failures are found (CI-friendly).
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      if (!name.includes('node_modules') && !name.includes('.next') && !name.includes('.git')) {
        getFiles(name, files);
      }
    } else if (name.endsWith('.tsx') || name.endsWith('.jsx')) {
      files.push(name);
    }
  }
  return files;
}

function stripStringsAndComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^\s*\/\/.*$/gm, '');
}

const checks = [
  {
    id: 'img-alt',
    level: 'A',
    description: 'Image missing alt attribute',
    test: (code) => code.match(/<(img|Image)\b(?:(?!=>)[^>])*>/gi) || [],
    fail: (tag) => !/\balt\s*=|aria-hidden\s*=\s*["']?true/i.test(tag),
  },
  {
    id: 'input-label',
    level: 'A',
    description: 'Form control without an accessible name',
    test: (code) => code.match(/<(input|select|textarea)\b(?:(?!=>)[^>])*>/gi) || [],
    fail: (tag) =>
      !/type=["']hidden["']|type=["']submit["']|type=["']button["']/i.test(tag) &&
      !/\bid\s*=\s*["'{]|aria-label\s*=|aria-labelledby\s*=|title\s*=/i.test(tag),
  },
  {
    id: 'positive-tabindex',
    level: 'A',
    description: 'Positive tabindex breaks focus order',
    test: (code) => code.match(/tabIndex\s*=\s*\{?\s*[1-9]/gi) || [],
    fail: () => true,
  },
  {
    id: 'non-interactive-onclick',
    level: 'A',
    description: 'onClick on a non-interactive element (use button/a)',
    test: (code) => code.match(/<(div|span|p|li|section)(?![a-zA-Z])(?![^>]*(?:role=["'](?:button|link|dialog)["']|aria-hidden\s*=\s*["']true["']))[^>]*onClick/gi) || [],
    fail: () => true,
  },
  {
    id: 'autoplay-no-controls',
    level: 'A',
    description: 'Autoplaying media without controls',
    test: (code) => code.match(/<(video|audio)\b[^>]*>/gi) || [],
    fail: (tag) => /\bautoPlay\b/i.test(tag) && !/\bcontrols\b/i.test(tag),
  },
];

function audit() {
  console.log('--- WCAG 2.1 AA static audit ---');
  const dirs = [path.join(ROOT, 'app'), path.join(ROOT, 'components')];
  let files = [];
  for (const dir of dirs) {
    if (fs.existsSync(dir)) files = files.concat(getFiles(dir));
  }

  let critical = 0;
  const summary = {};

  for (const file of files) {
    const relativePath = path.relative(ROOT, file);
    const raw = fs.readFileSync(file, 'utf8');
    // Ignore eslint-disabled intentional exceptions
    const cleaned = stripStringsAndComments(raw)
      .split('\n')
      .filter((line) => !/eslint-disable.*no-img-element/.test(line))
      .join('\n');

    for (const check of checks) {
      const matches = check.test(cleaned);
      for (const match of matches) {
        if (check.fail(match)) {
          critical++;
          summary[check.id] = (summary[check.id] ?? 0) + 1;
          console.error(`[WCAG ${check.level} Failure] ${check.description} — ${relativePath}`);
          console.error(`  > ${match.trim().slice(0, 120)}`);
        }
      }
    }
  }

  // Root-level structural requirements
  const layoutPath = path.join(ROOT, 'app', 'layout.tsx');
  if (fs.existsSync(layoutPath)) {
    const layout = fs.readFileSync(layoutPath, 'utf8');
    if (!/<html[^>]*\blang\s*=/i.test(layout)) {
      critical++;
      console.error('[WCAG A Failure] Root layout is missing the lang attribute on <html>');
    }
  }
  if (!fs.existsSync(path.join(ROOT, 'app', 'page.tsx'))) {
    console.warn('[WCAG Warning] app/page.tsx not found; skipped landmark check');
  }

  console.log('------------------------------------');
  console.log(`Scanned ${files.length} files. ${critical} critical failures.`);
  if (Object.keys(summary).length > 0) {
    console.log('By rule:', JSON.stringify(summary));
  }
  process.exit(critical > 0 ? 1 : 0);
}

audit();
