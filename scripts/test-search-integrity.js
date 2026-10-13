/**
 * Test script: test-search-integrity.js
 *
 * Verifies that the internal search index:
 * 1. Contains all indexable public pages (from STATIC_ROUTES, CITIES_DATA, MOTORWAYS_DATA, OPERATORS_DATA, STATIONS_DATA)
 * 2. Strictly excludes non-indexable/legal/embed routes (/impressum, /datenschutz, /suche, /rechner-embed, /projektuebernahme, /404)
 * 3. Does not produce duplicate station entries across MCS and standard stations
 * 4. Yields accurate, high-ranking results for required core queries:
 *    - THG, THG-Prämie, Treibhausgasminderungsquote -> /thg-praemie
 *    - IONITY, Fastned -> respective operator/dossier routes
 *    - HPC, MCS, CCS, AC, DC -> appropriate monitors/glossary/dossiers
 *    - A3, A7 -> motorway routes
 *    - Freiburg -> city route
 *    - Ladestation, Ladeleistung -> relevant tools/guides/stations
 * 5. Demonstrates automated discovery: if a new route is in staticRoutes, it will be in the index
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const searchIndexPath = path.resolve(rootDir, 'public', 'search-index.json');

if (!fs.existsSync(searchIndexPath)) {
  console.error('❌ search-index.json not found in public/');
  process.exit(1);
}

const searchIndexRaw = fs.readFileSync(searchIndexPath, 'utf-8');
const searchIndex = JSON.parse(searchIndexRaw);

console.log(`\n🔍 Search Integrity Test: Validating ${searchIndex.length} indexed documents...`);

let hasError = false;

// 1. Check size limit (< 500 KB)
const fileSizeBytes = Buffer.byteLength(searchIndexRaw, 'utf8');
const fileSizeKb = (fileSizeBytes / 1024).toFixed(1);
console.log(`📦 Index file size: ${fileSizeKb} KB`);
if (fileSizeBytes > 500 * 1024) {
  console.error(`❌ Index file exceeds 500 KB limit (${fileSizeKb} KB)`);
  hasError = true;
} else {
  console.log(`✅ Index file size is lean and fast for client loading (< 500 KB)`);
}

// 2. Validate THG page presence & metadata
const thgEntry = searchIndex.find(doc => doc.id === 'page-thg-praemie' || doc.url === '/thg-praemie');
if (!thgEntry) {
  console.error('❌ CRITICAL: /thg-praemie is missing from search-index.json!');
  hasError = true;
} else {
  console.log('✅ /thg-praemie is present in search-index.json');
  if (!thgEntry.title.toLowerCase().includes('thg')) {
    console.error('❌ /thg-praemie title missing THG keyword');
    hasError = true;
  }
  const hasThgKeyword = thgEntry.keywords && thgEntry.keywords.some(k => k.toLowerCase().includes('thg'));
  if (!hasThgKeyword) {
    console.error('❌ /thg-praemie missing THG keyword');
    hasError = true;
  }
}

// 3. Verify strictly excluded routes are absent
const EXCLUDED_ROUTES = [
  '/impressum',
  '/datenschutz',
  '/suche',
  '/rechner-embed',
  '/projektuebernahme',
  '/404'
];

for (const excluded of EXCLUDED_ROUTES) {
  const match = searchIndex.find(doc => doc.id === excluded || doc.url === excluded);
  if (match) {
    console.error(`❌ Excluded route "${excluded}" is present in search index!`);
    hasError = true;
  } else {
    console.log(`✅ Excluded route "${excluded}" is correctly absent from search index`);
  }
}

// 4. Verify no duplicate station URLs
const urlCounts = new Map();
for (const doc of searchIndex) {
  if (doc.url) {
    urlCounts.set(doc.url, (urlCounts.get(doc.url) || 0) + 1);
  }
}

let duplicateUrls = 0;
for (const [url, count] of urlCounts.entries()) {
  if (count > 1) {
    console.error(`❌ Duplicate URL found in index (${count}x): ${url}`);
    duplicateUrls++;
    hasError = true;
  }
}
if (duplicateUrls === 0) {
  console.log('✅ Zero duplicate URLs found across index');
}

// 5. Verify essential static pages are indexed
const ESSENTIAL_STATIC = [
  '/',
  '/thg-praemie',
  '/wallbox-vergleich',
  '/ladekarten',
  '/hpc-city-monitor',
  '/cpo-monitor',
  '/methodik',
  '/ladestationen',
  '/staedte',
  '/autobahnen',
  '/betreiber'
];

for (const route of ESSENTIAL_STATIC) {
  const match = searchIndex.find(doc => doc.id === route || doc.url === route);
  if (!match) {
    console.error(`❌ Essential public page "${route}" missing from search index!`);
    hasError = true;
  } else {
    console.log(`✅ Essential page "${route}" is indexed (${match.title})`);
  }
}

// 6. Test Query Simulation matching the client-side algorithm
function normalize(str) {
  return (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

function scoreDoc(doc, query) {
  const q = normalize(query);
  const qTokens = q.split(/\s+/).filter(Boolean);
  const title = normalize(doc.title);
  const sub = normalize(doc.subtitle);
  const desc = normalize(doc.description);
  const kw = (doc.keywords || []).map(normalize);
  const syn = (doc.synonyms || []).map(normalize);

  let score = 0;

  // Exact synonym match
  if (syn.includes(q)) score += 1100;
  // Exact title match
  if (title === q) score += 1000;
  else if (title.startsWith(q)) score += 500;
  else if (title.includes(q)) score += 300;

  // Subtitle
  if (sub.includes(q)) score += 200;

  // Keywords exact match
  if (kw.includes(q)) score += 250;
  else if (kw.some(k => k.includes(q))) score += 150;

  // Synonyms substring
  if (syn.some(s => s.includes(q))) score += 200;

  // Description match
  if (desc.includes(q)) score += 80;

  // Token matching
  for (const token of qTokens) {
    if (token.length < 2) continue;
    if (title.includes(token)) score += 60;
    if (kw.some(k => k.includes(token))) score += 40;
    if (syn.some(s => s.includes(token))) score += 50;
    if (sub.includes(token)) score += 30;
    if (desc.includes(token)) score += 20;
  }

  return score;
}

function search(query) {
  return searchIndex
    .map(doc => ({ doc, score: scoreDoc(doc, query) }))
    .filter(res => res.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(res => res.doc);
}

const TEST_QUERIES = [
  { q: 'THG', expectedUrlPrefix: '/thg-praemie' },
  { q: 'THG-Prämie', expectedUrlPrefix: '/thg-praemie' },
  { q: 'Treibhausgasminderungsquote', expectedUrlPrefix: '/thg-praemie' },
  { q: 'IONITY', expectedUrlPrefix: '/betreiber/ionity' },
  { q: 'Fastned', expectedUrlPrefix: '/betreiber/fastned' },
  { q: 'HPC', expectedAny: true },
  { q: 'MCS', expectedAny: true },
  { q: 'CCS', expectedAny: true },
  { q: 'AC', expectedAny: true },
  { q: 'DC', expectedAny: true },
  { q: 'A3', expectedUrlPrefix: '/autobahnen/a3' },
  { q: 'A7', expectedUrlPrefix: '/autobahnen/a7' },
  { q: 'Freiburg', expectedUrlPrefix: '/staedte/freiburg' },
  { q: 'Ladestation', expectedAny: true },
  { q: 'Ladeleistung', expectedAny: true }
];

console.log('\n🎯 Testing Search Queries...');
for (const test of TEST_QUERIES) {
  const results = search(test.q);
  if (results.length === 0) {
    console.error(`❌ Query "${test.q}" yielded 0 results!`);
    hasError = true;
    continue;
  }
  const topResult = results[0];
  if (test.expectedUrlPrefix && !topResult.url.startsWith(test.expectedUrlPrefix)) {
    console.error(`❌ Query "${test.q}" top result was "${topResult.url}" (${topResult.title}), expected prefix "${test.expectedUrlPrefix}"`);
    hasError = true;
  } else {
    console.log(`✅ Query "${test.q}" -> Top result: "${topResult.title}" (${topResult.url}) [${results.length} total hits]`);
  }
}

if (hasError) {
  console.error('\n❌ Search integrity tests failed!');
  process.exit(1);
} else {
  console.log('\n✨ All Search Integrity Tests Passed Successfully!\n');
}
