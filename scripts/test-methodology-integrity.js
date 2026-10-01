import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('=== METHODOLOGY & PROVENANCE INTEGRITY TEST ===');

let failures = 0;

// 1. Verify /methodik HTML exists in dist
const methodikHtmlPath = path.join(rootDir, 'dist/methodik/index.html');
if (!fs.existsSync(methodikHtmlPath)) {
  console.error('[FAIL] dist/methodik/index.html does not exist!');
  failures++;
} else {
  const methodikHtml = fs.readFileSync(methodikHtmlPath, 'utf8');
  console.log('[PASS] dist/methodik/index.html successfully generated.');

  // Check essential sections
  const requiredSnippets = [
    'Abschnitt A: Datenquellen',
    'Abschnitt B: Definition eines Standortdossiers',
    'Abschnitt C: Quelldaten vs. Abgeleitete Kennzahlen',
    'Abschnitt D: MCS- &amp; E-Lkw-Methodik',
    'Abschnitt E: Berechnungsmodell des Laderechners',
    'Abschnitt F: Ressourcenbezogene Zitierweise',
    'isIndexableLocation',
    'Verluste: 6 % bei DC',
    'Ladekurvenfaktor: 0,76',
    '<code>lastVerifiedAt</code> bezeichnet das Datum der letzten dokumentierten redaktionellen Quellenprüfung durch ladestandorte.de.'
  ];

  for (const snippet of requiredSnippets) {
    if (!methodikHtml.includes(snippet)) {
      console.error(`[FAIL] /methodik HTML missing expected snippet: "${snippet}"`);
      failures++;
    }
  }

  // Verify Schema.org isolation: ONLY WebPage and BreadcrumbList, NO FAQPage leak
  const schemaScripts = [...methodikHtml.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)];
  for (const s of schemaScripts) {
    const raw = s[1];
    if (raw.includes('FAQPage')) {
      console.error('[FAIL] /methodik contains unexpected FAQPage schema leak!');
      failures++;
    }
    if (!raw.includes('WebPage') && !raw.includes('BreadcrumbList')) {
      console.error('[FAIL] /methodik contains unexpected schema type outside WebPage/BreadcrumbList:', raw.slice(0, 100));
      failures++;
    }
  }
  console.log('[PASS] /methodik schemas strictly isolated to WebPage and BreadcrumbList.');
}

// 2. Verify all 61 motorway pages contain the Datengrundlage / Denominator note
try {
  const ssr = await import(path.join(rootDir, 'dist-ssr/entry-server.js'));
  const { MOTORWAYS_DATA } = ssr;

  let motorwaysChecked = 0;
  for (const m of MOTORWAYS_DATA) {
    const filePath = path.join(rootDir, 'dist/autobahnen', m.slug, 'index.html');
    if (!fs.existsSync(filePath)) {
      console.error(`[FAIL] Missing motorway file: ${filePath}`);
      failures++;
      continue;
    }
    const html = fs.readFileSync(filePath, 'utf8');
    if (!html.includes('Datengrundlage:') || !html.includes('redaktionell dokumentierten Ladeparks')) {
      console.error(`[FAIL] /autobahnen/${m.slug} missing Datengrundlage denominator note!`);
      failures++;
    }
    motorwaysChecked++;
  }
  console.log(`[PASS] Verified Datengrundlage denominator note across all ${motorwaysChecked} motorway pages.`);
} catch (e) {
  console.error('[CRASH] Error checking motorway files:', e.message);
  failures++;
}

// 3. Verify all 50 city pages contain the Datengrundlage note
try {
  const ssr = await import(path.join(rootDir, 'dist-ssr/entry-server.js'));
  const { CITIES_DATA } = ssr;

  let citiesChecked = 0;
  for (const c of CITIES_DATA) {
    const filePath = path.join(rootDir, 'dist/staedte', c.slug, 'index.html');
    if (!fs.existsSync(filePath)) {
      console.error(`[FAIL] Missing city file: ${filePath}`);
      failures++;
      continue;
    }
    const html = fs.readFileSync(filePath, 'utf8');
    if (!html.includes('Datengrundlage &amp; Transparenz') || !html.includes('Bundesnetzagentur') || !html.includes('Statistisches Bundesamt')) {
      console.error(`[FAIL] /staedte/${c.slug} missing Datengrundlage note!`);
      failures++;
    }
    citiesChecked++;
  }
  console.log(`[PASS] Verified Datengrundlage note across all ${citiesChecked} city pages.`);
} catch (e) {
  console.error('[CRASH] Error checking city files:', e.message);
  failures++;
}

// 4. Verify Operator pages contain the Quellenkontext note
try {
  const ssr = await import(path.join(rootDir, 'dist-ssr/entry-server.js'));
  const { OPERATORS_DATA } = ssr;

  let opsChecked = 0;
  for (const o of OPERATORS_DATA) {
    const filePath = path.join(rootDir, 'dist/betreiber', o.slug, 'index.html');
    if (!fs.existsSync(filePath)) {
      console.error(`[FAIL] Missing operator file: ${filePath}`);
      failures++;
      continue;
    }
    const html = fs.readFileSync(filePath, 'utf8');
    if (!html.includes('Quellenkontext:') || !html.includes('statische Netzkapazitäten')) {
      console.error(`[FAIL] /betreiber/${o.slug} missing Quellenkontext note!`);
      failures++;
    }
    opsChecked++;
  }
  console.log(`[PASS] Verified Quellenkontext note across all ${opsChecked} operator pages.`);
} catch (e) {
  console.error('[CRASH] Error checking operator files:', e.message);
  failures++;
}

// 5. Verify Rechner page links to /methodik#laderechner
const rechnerHtmlPath = path.join(rootDir, 'dist/rechner/index.html');
if (fs.existsSync(rechnerHtmlPath)) {
  const rechnerHtml = fs.readFileSync(rechnerHtmlPath, 'utf8');
  if (!rechnerHtml.includes('/methodik#laderechner')) {
    console.error('[FAIL] /rechner missing link to /methodik#laderechner!');
    failures++;
  } else {
    console.log('[PASS] /rechner contains direct link to /methodik#laderechner.');
  }
} else {
  console.error('[FAIL] dist/rechner/index.html not found!');
  failures++;
}

// 6. Verify MCS pages contain Aufnahmekriterien / Datengrundlage note
const mcsHubHtmlPath = path.join(rootDir, 'dist/mcs/index.html');
const mcsStationsHtmlPath = path.join(rootDir, 'dist/mcs/ladestationen/index.html');
if (fs.existsSync(mcsHubHtmlPath) && fs.existsSync(mcsStationsHtmlPath)) {
  const mcsHubHtml = fs.readFileSync(mcsHubHtmlPath, 'utf8');
  const mcsStationsHtml = fs.readFileSync(mcsStationsHtmlPath, 'utf8');
  if (!mcsHubHtml.includes('/methodik#mcs') || !mcsStationsHtml.includes('/methodik#mcs')) {
    console.error('[FAIL] MCS hub or stations page missing /methodik#mcs reference!');
    failures++;
  } else {
    console.log('[PASS] MCS pages link to /methodik#mcs.');
  }

  if (!mcsStationsHtml.includes('dokumentierten Betreiber- und Projektangaben zur Schwerlast-Ladeinfrastruktur')) {
    console.error('[FAIL] /mcs/ladestationen missing exact wording "dokumentierten Betreiber- und Projektangaben zur Schwerlast-Ladeinfrastruktur"!');
    failures++;
  } else {
    console.log('[PASS] /mcs/ladestationen contains exact requested wording "dokumentierten Betreiber- und Projektangaben".');
  }
} else {
  console.error('[FAIL] MCS HTML files not found!');
  failures++;
}

console.log(`\nAudit completed: ${failures} failure(s).`);
if (failures > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL METHODOLOGY INTEGRITY CHECKS PASSED.');
}
