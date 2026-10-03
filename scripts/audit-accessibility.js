const fs = require('fs');
const path = require('path');

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      if (!name.includes('node_modules') && !name.includes('.next') && !name.includes('.git')) {
        getFiles(name, files);
      }
    } else {
      if (name.endsWith('.tsx') || name.endsWith('.html') || name.endsWith('.js')) {
        files.push(name);
      }
    }
  }
  return files;
}

function auditAccessibility() {
  console.log('--- Starting Accessibility Audit ---');
  const projectDir = path.join(__dirname, '../app');
  const files = getFiles(projectDir);
  let errorsCount = 0;

  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(path.join(__dirname, '..'), file);

    // Check for <img> tags missing alt
    const imgMatches = content.match(/<img[^>]*>/gi) || [];
    for (const img of imgMatches) {
      if (!img.toLowerCase().includes('alt=')) {
        console.error(`[WCAG Failure] Image missing alt attribute in ${relativePath}:`);
        console.error(`  > ${img.trim()}`);
        errorsCount++;
      }
    }

    // Check for inputs without ID or labels
    const inputMatches = content.match(/<input[^>]*>/gi) || [];
    for (const input of inputMatches) {
      if (
        !input.toLowerCase().includes('aria-label=') &&
        !input.toLowerCase().includes('id=') &&
        !input.toLowerCase().includes('type="hidden"') &&
        !input.toLowerCase().includes('type="submit"')
      ) {
        console.warn(`[WCAG Warning] Input without ID or aria-label in ${relativePath}:`);
        console.warn(`  > ${input.trim()}`);
      }
    }
  }

  console.log('------------------------------------');
  console.log(`Audit complete. Found ${errorsCount} critical accessibility errors.`);
  if (errorsCount > 0) {
    process.exit(1);
  }
}

auditAccessibility();
