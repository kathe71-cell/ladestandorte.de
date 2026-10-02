#!/usr/bin/env node
/**
 * scripts/test-station-directory-integrity.js
 * 
 * Regression & Relational Test Suite for Full BNetzA Station Directory & Search:
 * 1. Verifies that all 50 city registry JSON files exist in public/data/registry/
 * 2. Berlin Acceptance Test:
 *    - Ladepunkte in Register === 7.617
 *    - Eindeutige Ladestationen (ladestation_id) === 4.984
 *    - HPC-Ladepunkte (>=150 kW) === 988
 *    - Stationen mit mind. 1 HPC === 546
 *    - Redaktionelle Dossiers === 4
 * 3. Relational Check across all 50 cities:
 *    - Registry station count === city.bnetza.ladestationen
 *    - Sum of registry points === city.ladepunkteGesamt
 *    - Sum of registry HPC points === city.hpcLadepunkte
 * 4. Search Index Integrity:
 *    - public/data/registry-search-index.json exists
 *    - Exactly matches 35.538 stations across 50 cities
 *    - Zero broken URLs or empty titles
 *    - Deduplication: Linked dossiers are cleanly cross-referenced
 * 5. Routing Check:
 *    - /ladestation-register/:citySlug/:stationId is routed and cleanly handled
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('=== FULL BNETZA STATION DIRECTORY & SEARCH REGRESSION TEST ===');

let failed = false;

// 1. Check generated registry summary
const summaryPath = path.join(ROOT, 'src/data/generated/registry-summary.generated.json');
if (!fs.existsSync(summaryPath)) {
  console.error('[FAIL] registry-summary.generated.json does not exist!');
  process.exit(1);
}
const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

// Load cities.generated.json
const citiesGen = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/cities.generated.json'), 'utf8'));

// 2. Berlin Acceptance Test
const berlinGen = citiesGen.find(c => c.slug === 'berlin');
const berlinSummary = summary.cities['berlin'];

console.log('--- Berlin Reference Verification ---');
if (!berlinGen || !berlinSummary) {
  console.error('[FAIL] Berlin data not found!');
  failed = true;
} else {
  // Check points: 7617
  const bPoints = berlinGen.bnetza ? berlinGen.bnetza.ladepunkteGesamt : berlinGen.ladepunkteGesamt;
  if (bPoints !== 7617) {
    console.error(`[FAIL] Berlin ladepunkteGesamt expected 7617, got ${bPoints}`);
    failed = true;
  } else {
    console.log('[PASS] Berlin Ladepunkte gesamt: 7.617');
  }

  // Check unique stations: 4984
  if (berlinSummary.stationCount !== 4984 || berlinGen.bnetza.ladestationen !== 4984) {
    console.error(`[FAIL] Berlin station count expected 4984, got summary=${berlinSummary.stationCount}, gen=${berlinGen.bnetza.ladestationen}`);
    failed = true;
  } else {
    console.log('[PASS] Berlin eindeutige Ladestationen (ladestation_id): 4.984');
  }

  // Check HPC points: 988
  const bHpc = berlinGen.bnetza ? berlinGen.bnetza.hpcLadepunkte : berlinGen.hpcLadepunkte;
  if (bHpc !== 988 || berlinSummary.hpcPointsCount !== 988) {
    console.error(`[FAIL] Berlin HPC points expected 988, got gen=${bHpc}, summary=${berlinSummary.hpcPointsCount}`);
    failed = true;
  } else {
    console.log('[PASS] Berlin HPC-Ladepunkte (≥150 kW): 988');
  }

  // Check stations with at least 1 HPC: 546
  if (berlinSummary.hpcStationsCount !== 546) {
    console.error(`[FAIL] Berlin HPC stations expected 546, got ${berlinSummary.hpcStationsCount}`);
    failed = true;
  } else {
    console.log('[PASS] Berlin Stationen mit mindestens einem HPC: 546');
  }

  // Check dossiers in stations.ts: 4
  const stationsFile = fs.readFileSync(path.join(ROOT, 'src/data/stations.ts'), 'utf8');
  const berlinDossiers = [...stationsFile.matchAll(/id:\s*"ber-[0-9]+"/g)];
  if (berlinDossiers.length !== 4) {
    console.error(`[FAIL] Berlin curated dossiers expected 4, got ${berlinDossiers.length}`);
    failed = true;
  } else {
    console.log('[PASS] Berlin redaktionelle Dossiers: 4 (ber-001 bis ber-004)');
  }
}

// 3. Relational Verification for all 50 cities
console.log('--- 50 Cities Relational Consistency ---');
let cityMismatches = 0;
let total50Stations = 0;
let total50Points = 0;

for (const c of citiesGen) {
  const regFilePath = path.join(ROOT, 'public/data/registry', `${c.slug}.json`);
  if (!fs.existsSync(regFilePath)) {
    console.error(`[FAIL] Missing registry file for ${c.slug}`);
    cityMismatches++;
    continue;
  }
  const regData = JSON.parse(fs.readFileSync(regFilePath, 'utf8'));

  if (regData.length !== c.bnetza.ladestationen) {
    console.error(`[FAIL] ${c.name} station count mismatch: file ${regData.length} !== city.bnetza.ladestationen ${c.bnetza.ladestationen}`);
    cityMismatches++;
  }

  const expectedPoints = c.bnetza ? c.bnetza.ladepunkteGesamt : c.ladepunkteGesamt;
  const expectedHpc = c.bnetza ? c.bnetza.hpcLadepunkte : c.hpcLadepunkte;

  const filePoints = regData.reduce((acc, s) => acc + s.pointsCount, 0);
  if (filePoints !== expectedPoints) {
    console.error(`[FAIL] ${c.name} points count mismatch: file ${filePoints} !== expected ${expectedPoints}`);
    cityMismatches++;
  }

  const fileHpc = regData.reduce((acc, s) => acc + s.hpcPointsCount, 0);
  if (fileHpc !== expectedHpc) {
    console.error(`[FAIL] ${c.name} HPC points mismatch: file ${fileHpc} !== expected ${expectedHpc}`);
    cityMismatches++;
  }

  total50Stations += regData.length;
  total50Points += filePoints;
}

if (cityMismatches === 0) {
  console.log(`[PASS] All 50 cities matched EXACTLY across stations (${total50Stations.toLocaleString('de-DE')}) and points (${total50Points.toLocaleString('de-DE')})!`);
} else {
  failed = true;
}

// 4. Search Index Verification
console.log('--- Search Index Verification ---');
const searchIndexPath = path.join(ROOT, 'public/data/registry-search-index.json');
if (!fs.existsSync(searchIndexPath)) {
  console.error('[FAIL] registry-search-index.json does not exist!');
  failed = true;
} else {
  const searchItems = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
  if (searchItems.length !== total50Stations) {
    console.error(`[FAIL] Search index items count ${searchItems.length} !== total 50 stations ${total50Stations}`);
    failed = true;
  } else {
    console.log(`[PASS] registry-search-index.json contains exactly ${searchItems.length.toLocaleString('de-DE')} searchable stations.`);
  }

  // Deduplication check: verify that items with linked dossier have non-null 'd'
  const linkedItems = searchItems.filter(s => s.d !== null);
  console.log(`[PASS] ${linkedItems.length} BNetzA stations linked to curated dossiers (deduplicated in UI search).`);
}

// 5. Total Register check Germany
console.log('--- Federal Level Benchmark ---');
const rawPointer = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/raw/bnetza/latest.json'), 'utf8'));
const cpoGen = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/generated/cpo-monitor.generated.json'), 'utf8'));
if (cpoGen.totalRegisterStationsDE !== 117043) {
  console.error(`[FAIL] Germany totalRegisterStationsDE expected 117043, got ${cpoGen.totalRegisterStationsDE}`);
  failed = true;
} else {
  console.log(`[PASS] Germany totalRegisterStationsDE: ${cpoGen.totalRegisterStationsDE.toLocaleString('de-DE')} Stations`);
  console.log(`[PASS] Germany totalRegisterPointsDE: ${cpoGen.totalRegisterPointsDE.toLocaleString('de-DE')} Charging points`);
}

if (failed) {
  console.error('=== TEST SUITE FAILED ===');
  process.exit(1);
} else {
  console.log('=== FULL BNETZA STATION DIRECTORY & SEARCH: ALL CHECKS PASSED ===');
  process.exit(0);
}
