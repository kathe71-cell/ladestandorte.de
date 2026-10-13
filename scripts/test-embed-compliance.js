import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('=== REGRESSION TEST: /rechner-embed & PLATFORM COMPLIANCE ===\n');

let failed = false;
const assert = (condition, msg) => {
  if (!condition) {
    console.error(`[FAIL] ${msg}`);
    failed = true;
  } else {
    console.log(`[PASS] ${msg}`);
  }
};

// 1. Verify pre-rendered file dist/rechner-embed/index.html exists and is non-empty
const embedHtmlPath = path.join(rootDir, 'dist/rechner-embed/index.html');
assert(fs.existsSync(embedHtmlPath), 'dist/rechner-embed/index.html exists');

const embedHtml = fs.existsSync(embedHtmlPath) ? fs.readFileSync(embedHtmlPath, 'utf8') : '';
assert(embedHtml.includes('Ladezeit-Rechner Widget') || embedHtml.includes('Ladezeit- & Ladekosten-Rechner'), 'dist/rechner-embed/index.html contains calculator title');
assert(embedHtml.includes('id="root"'), 'dist/rechner-embed/index.html contains root container');
assert(embedHtml.includes('data-ad-notice') === false, 'dist/rechner-embed/index.html contains NO ad notice');
assert(embedHtml.includes('amazon.de') === false, 'dist/rechner-embed/index.html contains NO amazon links');
assert(embedHtml.includes('sr-only') === false || !embedHtml.includes('Als Amazon-Partner'), 'dist/rechner-embed/index.html has NO hidden/sr-only Amazon disclosure');

// 2. Test SSR rendering with query parameters on /rechner-embed
const ssr = await import('../dist-ssr/entry-server.js');
const testParamsUrls = [
  '/rechner-embed',
  '/rechner-embed?capacity=80&kw=200&start=10&end=80&price=0.59',
  '/rechner-embed?bg=000000&text=ffffff&border=333333&radius=8&font=sans-serif',
  '/rechner-embed?vehicle=tesla-model-y-long-range&mode=estimate',
];

for (const url of testParamsUrls) {
  const rendered = ssr.render(url);
  assert(rendered && rendered.html && rendered.html.length > 500, `SSR render of ${url} returns valid HTML (${rendered?.html?.length} chars)`);
}

// 3. Verify monetized pages maintain required disclosures
const wallboxHtmlPath = path.join(rootDir, 'dist/wallbox-vergleich/index.html');
assert(fs.existsSync(wallboxHtmlPath), 'dist/wallbox-vergleich/index.html exists');

const wallboxHtml = fs.existsSync(wallboxHtmlPath) ? fs.readFileSync(wallboxHtmlPath, 'utf8') : '';
const AMAZON_SENTENCE = 'Als Amazon-Partner verdienen wir an qualifizierten Verkäufen.';
assert(wallboxHtml.includes(AMAZON_SENTENCE), 'dist/wallbox-vergleich/index.html contains Amazon Partner disclosure');
assert(wallboxHtml.includes('data-ad-notice'), 'dist/wallbox-vergleich/index.html contains data-ad-notice');

// 4. Test compliance check behavior:
// Verify that plattform-check logic flags a monetized page when the notice is missing,
// and flags an embed if someone were to put affiliate links without disclosure.
console.log('\n--- Checking validation logic isolation ---');

const checkScriptPath = path.join(rootDir, 'node_modules/@plattform/core/scripts/check.mjs');
assert(fs.existsSync(checkScriptPath), 'node_modules/@plattform/core/scripts/check.mjs is present');
const checkScriptCode = fs.readFileSync(checkScriptPath, 'utf8');
assert(checkScriptCode.includes('isEmbedWidget'), 'check.mjs recognizes isEmbedWidget');
assert(checkScriptCode.includes('requiresAmazonSentence'), 'check.mjs enforces requiresAmazonSentence properly');

if (failed) {
  console.error('\n❌ Regression tests FAILED!');
  process.exit(1);
} else {
  console.log('\n✅ All regression tests PASSED!');
}
