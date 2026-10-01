import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, '..', p);

console.log('=== STRUCTURED DATA SCHEMA ISOLATION TEST ===');

function extractSchemas(filePath) {
  const fullPath = toAbsolute(filePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const html = fs.readFileSync(fullPath, 'utf8');
  const scripts = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  return scripts.map((s, idx) => {
    try {
      return JSON.parse(s[1]);
    } catch (e) {
      throw new Error(`Invalid JSON-LD in ${filePath} (script #${idx}): ${e.message}`);
    }
  });
}

let failures = 0;

// 1. Homepage MUST have FAQPage
try {
  const homeSchemas = extractSchemas('dist/index.html');
  const hasFaq = homeSchemas.some(s => {
    const raw = JSON.stringify(s);
    return raw.includes('FAQPage') && raw.includes('Wie viele öffentliche Ladesäulen gibt es in Deutschland?');
  });
  if (hasFaq) {
    console.log('[PASS] Homepage (dist/index.html) contains verified FAQPage schema.');
  } else {
    console.error('[FAIL] Homepage is missing FAQPage schema!');
    failures++;
  }
} catch (e) {
  console.error('[CRASH] Homepage schema check failed:', e.message);
  failures++;
}

// 2. MCS pages MUST NOT have FAQPage schema or leak homepage Q&A
const mcsTestFiles = [
  { path: 'dist/mcs/index.html', route: '/mcs', expectedType: 'WebPage' },
  { path: 'dist/mcs/ladestationen/index.html', route: '/mcs/ladestationen', expectedType: 'ItemList' },
  { path: 'dist/mcs/was-ist-mcs/index.html', route: '/mcs/was-ist-mcs', expectedType: 'TechArticle' },
  { path: 'dist/mcs/mcs-vs-ccs/index.html', route: '/mcs/mcs-vs-ccs', expectedType: 'TechArticle' },
  { path: 'dist/mcs/lkw-laden/index.html', route: '/mcs/lkw-laden', expectedType: 'Article' }
];

for (const mcs of mcsTestFiles) {
  try {
    const schemas = extractSchemas(mcs.path);
    const raw = JSON.stringify(schemas);
    
    // Check no FAQPage leak
    if (raw.includes('FAQPage') || raw.includes('Welche Gesetzesgrundlage regelt das Ladesäulenregister?')) {
      console.error(`[FAIL] ${mcs.route} (${mcs.path}) LEAKS homepage FAQPage schema!`);
      failures++;
      continue;
    }

    // Check specific expected schema type exists
    if (!raw.includes(mcs.expectedType)) {
      console.error(`[FAIL] ${mcs.route} (${mcs.path}) is missing expected schema type: ${mcs.expectedType}`);
      failures++;
      continue;
    }

    // Check BreadcrumbList exists
    if (!raw.includes('BreadcrumbList')) {
      console.error(`[FAIL] ${mcs.route} (${mcs.path}) is missing BreadcrumbList schema`);
      failures++;
      continue;
    }

    console.log(`[PASS] ${mcs.route} isolated: NO FAQPage leak, contains ${mcs.expectedType} & BreadcrumbList.`);
  } catch (e) {
    console.error(`[CRASH] ${mcs.route} schema check failed:`, e.message);
    failures++;
  }
}

// 3. ItemList integrity on /mcs/ladestationen
try {
  const listSchemas = extractSchemas('dist/mcs/ladestationen/index.html');
  const pageSchema = listSchemas.find(s => JSON.stringify(s).includes('ItemList'));
  const itemList = pageSchema['@graph'].find(item => item['@type'] === 'ItemList');
  if (itemList && Array.isArray(itemList.itemListElement) && itemList.itemListElement.length === 8) {
    console.log(`[PASS] /mcs/ladestationen ItemList contains exactly ${itemList.itemListElement.length} verified ChargingStation entries.`);
  } else {
    console.error(`[FAIL] /mcs/ladestationen ItemList element count mismatch! Found: ${itemList?.itemListElement?.length}`);
    failures++;
  }
} catch (e) {
  console.error('[CRASH] ItemList check failed:', e.message);
  failures++;
}

if (failures > 0) {
  console.error(`\n=> SCHEMA ISOLATION TEST FAILED WITH ${failures} ERROR(S)`);
  process.exit(1);
} else {
  console.log('\n=> ALL SCHEMA ISOLATION TESTS PASSED (0 LEAKS DETECTED).');
}
