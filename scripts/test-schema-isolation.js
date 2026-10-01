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

// 4. HPC City Monitor isolation check
try {
  const hpcSchemas = extractSchemas('dist/hpc-city-monitor/index.html');
  const rawHpc = JSON.stringify(hpcSchemas);

  if (rawHpc.includes('FAQPage') || rawHpc.includes('ChargingStation') || rawHpc.includes('TechArticle')) {
    console.error('[FAIL] /hpc-city-monitor LEAKS unauthorized schema (FAQPage/ChargingStation/TechArticle)!');
    failures++;
  } else if (!rawHpc.includes('WebPage') || !rawHpc.includes('BreadcrumbList')) {
    console.error('[FAIL] /hpc-city-monitor is missing WebPage or BreadcrumbList schema!');
    failures++;
  } else {
    console.log('[PASS] /hpc-city-monitor isolated: NO schema leaks, contains WebPage & BreadcrumbList.');
  }
} catch (e) {
  console.error('[CRASH] /hpc-city-monitor schema check failed:', e.message);
  failures++;
}

// 5. CPO Monitor isolation check
try {
  const cpoSchemas = extractSchemas('dist/cpo-monitor/index.html');
  const rawCpo = JSON.stringify(cpoSchemas);

  if (rawCpo.includes('FAQPage') || rawCpo.includes('ChargingStation') || rawCpo.includes('TechArticle')) {
    console.error('[FAIL] /cpo-monitor LEAKS unauthorized schema (FAQPage/ChargingStation/TechArticle)!');
    failures++;
  } else if (!rawCpo.includes('WebPage') || !rawCpo.includes('BreadcrumbList')) {
    console.error('[FAIL] /cpo-monitor is missing WebPage or BreadcrumbList schema!');
    failures++;
  } else {
    console.log('[PASS] /cpo-monitor isolated: NO schema leaks, contains WebPage & BreadcrumbList.');
  }
} catch (e) {
  console.error('[CRASH] /cpo-monitor schema check failed:', e.message);
  failures++;
}

if (failures > 0) {
  console.error(`\n=> SCHEMA ISOLATION TEST FAILED WITH ${failures} ERROR(S)`);
  process.exit(1);
} else {
  console.log('\n=> ALL SCHEMA ISOLATION TESTS PASSED (0 LEAKS DETECTED).');
}
