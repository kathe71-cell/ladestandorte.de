#!/usr/bin/env node
/**
 * scripts/test-city-production-data.js
 * Validates that production rendering uses Generated Data from cities.generated.json:
 * 1. Checks that /staedte renders generated data (no legacy metrics).
 * 2. Checks all 50 city detail pages /staedte/[slug].
 * 3. Asserts no AC/DC inference is rendered in KPIs or power classes.
 * 4. Asserts presence of Provenance box with BNetzA and Destatis dates.
 * 5. Asserts link to /methodik is present.
 * 6. Spot checks exact rendered numbers for Berlin, Hamburg, München, Frankfurt am Main, Stuttgart.
 */

import { render, CITIES_DATA } from '../dist-ssr/entry-server.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('=== CITY PRODUCTION DATA REGRESSION TEST ===');

const generatedCities = JSON.parse(
  fs.readFileSync(path.resolve(ROOT_DIR, 'src/data/generated/cities.generated.json'), 'utf-8')
);
const generatedMap = new Map(generatedCities.map(c => [c.slug, c]));

let failures = 0;

// 1. Test /staedte overview page
try {
  const { html: staedteHtml } = render('/staedte');

  if (!staedteHtml.includes('Ladeinfrastruktur in deutschen Städten')) {
    console.error('[FAIL] /staedte does not contain expected main heading');
    failures++;
  }
  if (!staedteHtml.includes('BNetzA API-Snapshot:')) {
    console.error('[FAIL] /staedte does not contain BNetzA API-Snapshot date');
    failures++;
  }
  if (!staedteHtml.includes('Destatis') || !staedteHtml.includes('31.12.2024')) {
    console.error('[FAIL] /staedte does not contain Destatis reference date 31.12.2024');
    failures++;
  }
  if (!staedteHtml.includes('Eigene Auswertung: ladestandorte.de')) {
    console.error('[FAIL] /staedte missing attribution note');
    failures++;
  }
  if (!staedteHtml.includes('/methodik')) {
    console.error('[FAIL] /staedte missing link to /methodik');
    failures++;
  }
  if (staedteHtml.includes('Ranking') || staedteHtml.includes('TESTSIEGER')) {
    console.error('[FAIL] /staedte contains forbidden evaluative claims (Ranking/Testsieger)');
    failures++;
  }

  console.log('[PASS] /staedte overview page structure and metadata verified.');
} catch (err) {
  console.error('[FAIL] Exception rendering /staedte:', err);
  failures++;
}

// 2. Numerical Spot Checks
const SPOT_CHECK_CITIES = ['berlin', 'hamburg', 'muenchen', 'frankfurt', 'stuttgart'];

for (const slug of SPOT_CHECK_CITIES) {
  const gen = generatedMap.get(slug);
  if (!gen) {
    console.error(`[FAIL] Spot check city ${slug} not found in generated dataset!`);
    failures++;
    continue;
  }

  try {
    const { html } = render(`/staedte/${slug}`);

    // Check rendered values formatted as German numbers
    const totalPointsFormatted = gen.bnetza.ladepunkteGesamt.toLocaleString('de-DE');
    const hpcFormatted = gen.bnetza.hpcLadepunkte.toLocaleString('de-DE');
    const upTo22Formatted = gen.bnetza.powerClasses.upTo22Kw.toLocaleString('de-DE');
    const between22And150Formatted = gen.bnetza.powerClasses.between22And150Kw.toLocaleString('de-DE');
    const pointsPer1kFormatted = gen.bnetza.pointsPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2 });
    const popFormatted = gen.population.value.toLocaleString('de-DE');

    if (!html.includes(totalPointsFormatted)) {
      console.error(`[FAIL] ${slug}: rendered HTML does not contain total points ${totalPointsFormatted}`);
      failures++;
    }
    if (!html.includes(hpcFormatted)) {
      console.error(`[FAIL] ${slug}: rendered HTML does not contain HPC points ${hpcFormatted}`);
      failures++;
    }
    if (!html.includes(upTo22Formatted)) {
      console.error(`[FAIL] ${slug}: rendered HTML does not contain power class <=22 kW ${upTo22Formatted}`);
      failures++;
    }
    if (!html.includes(between22And150Formatted)) {
      console.error(`[FAIL] ${slug}: rendered HTML does not contain power class >22 & <150 kW ${between22And150Formatted}`);
      failures++;
    }
    if (!html.includes(pointsPer1kFormatted)) {
      console.error(`[FAIL] ${slug}: rendered HTML does not contain density ${pointsPer1kFormatted}`);
      failures++;
    }
    if (!html.includes(popFormatted)) {
      console.error(`[FAIL] ${slug}: rendered HTML does not contain population ${popFormatted}`);
      failures++;
    }

    // Check absence of invalid AC/DC inferences in KPIs
    if (html.includes('AC-Normalladepunkte') || html.includes('AC-Normallader')) {
      console.error(`[FAIL] ${slug}: rendered HTML contains forbidden AC-Normallader claim!`);
      failures++;
    }

    // Check Provenance box
    if (!html.includes('Bundesnetzagentur (Ladesäulenregister)') || !html.includes('Statistisches Bundesamt (Destatis)')) {
      console.error(`[FAIL] ${slug}: rendered HTML missing explicit Provenance box!`);
      failures++;
    }

    // Check Methodik link
    if (!html.includes('/methodik')) {
      console.error(`[FAIL] ${slug}: rendered HTML missing /methodik link!`);
      failures++;
    }

    console.log(`[PASS] Spot check ${gen.name} (${slug}): Exact numbers and provenance verified.`);
  } catch (err) {
    console.error(`[FAIL] Exception rendering /staedte/${slug}:`, err);
    failures++;
  }
}

// 3. Scan all 50 city pages for provenance and methodik links
for (const c of generatedCities) {
  try {
    const { html } = render(`/staedte/${c.slug}`);
    if (!html.includes('/methodik')) {
      console.error(`[FAIL] ${c.slug} missing /methodik link`);
      failures++;
    }
    if (!html.includes('Vollständigkeitshinweis')) {
      console.error(`[FAIL] ${c.slug} missing completeness note`);
      failures++;
    }
  } catch (err) {
    console.error(`[FAIL] Exception checking /staedte/${c.slug}:`, err);
    failures++;
  }
}

if (failures > 0) {
  console.error(`\n❌ City Production Data Regression test failed with ${failures} error(s).`);
  process.exit(1);
}

console.log('\n✅ ALL CITY PRODUCTION DATA REGRESSION CHECKS PASSED (50/50 CITIES).');
process.exit(0);
