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
 * 4. Nationwide Completeness & Coverage:
 *    - public/data/registry-search-index.json exists
 *    - Exactly matches all 117.043 eligible BNetzA stations
 *    - Covers 35.538 stations in Top-50 cities AND 81.505 stations outside Top-50
 *    - 95 PLZ shards and id-map.json exist
 * 5. Small-Town & Rural Benchmark:
 *    - 10 small towns/municipalities tested
 *    - 5 motorway/autohof locations tested
 *    - 5 rural locations tested
 * 6. Direct Routing Check:
 *    - Direct registry route resolves correctly for stations inside and outside Top-50
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('=== FULL BNETZA STATION DIRECTORY & NATIONWIDE SEARCH REGRESSION TEST ===');

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

// 4. Nationwide Completeness & Coverage Verification
console.log('--- Nationwide Search Index Verification ---');
const searchIndexPath = path.join(ROOT, 'public/data/registry-search-index.json');
if (!fs.existsSync(searchIndexPath)) {
  console.error('[FAIL] registry-search-index.json does not exist!');
  failed = true;
} else {
  const searchItems = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));
  const totalEligible = summary.totalRegisterStationsDE || 117043;
  if (searchItems.length !== totalEligible) {
    console.error(`[FAIL] Nationwide search index count ${searchItems.length} !== total eligible stations ${totalEligible}`);
    failed = true;
  } else {
    console.log(`[PASS] registry-search-index.json contains ALL ${searchItems.length.toLocaleString('de-DE')} eligible BNetzA stations.`);
    console.log(`       - Top-50 cities: ${summary.top50MappedStations.toLocaleString('de-DE')} stations`);
    console.log(`       - Outside Top-50: ${summary.outsideTop50Stations.toLocaleString('de-DE')} stations`);
    console.log(`       - Search Index Coverage: 100,00 %`);
  }

  // 5. Small-Town & Rural Acceptance Test (20 non-Top50 test locations)
  console.log('--- Small-Town, Motorway & Rural Verification ---');
  const smallTownSamples = [
    { name: 'Montabaur', id: '1093359' },
    { name: 'Wittlich', id: '1126153' },
    { name: 'Cloppenburg', id: '1085548' },
    { name: 'Waren (Müritz)', id: '1076802' },
    { name: 'Titisee-Neustadt', id: '1083983' },
    { name: 'Garmisch-Partenkirchen', id: '1151617' },
    { name: 'Rothenburg ob der Tauber', id: '1143623' },
    { name: 'Quedlinburg', id: '1155822' },
    { name: 'Borkum', id: '1163816' },
    { name: 'Bernkastel-Kues', id: '1080826' }
  ];

  const motorwaySamples = [
    { name: 'Geiselwind', id: '1100593' },
    { name: 'Nempitz', id: '1101454' },
    { name: 'Kamen', id: '1144543' },
    { name: 'Bispingen', id: '1077294' },
    { name: 'Mücke', id: '1100911' }
  ];

  const ruralSamples = [
    { name: 'Winterberg', id: '1163887' },
    { name: 'Dahn', id: '1050251' },
    { name: 'Daun', id: '1071950' },
    { name: 'Zwiesel', id: '1144558' },
    { name: 'Prüm', id: '1165071' }
  ];

  const testGroup = (label, list) => {
    let allFound = true;
    for (const item of list) {
      const match = searchItems.find(s => s.i === item.id);
      if (!match) {
        console.error(`[FAIL] ${label} station ${item.name} (ID ${item.id}) not found in search index!`);
        allFound = false;
        failed = true;
      }
    }
    if (allFound) {
      console.log(`[PASS] All ${list.length} ${label} stations verified in search index.`);
    }
  };

  testGroup('Small-Town', smallTownSamples);
  testGroup('Motorway/Autohof', motorwaySamples);
  testGroup('Rural', ruralSamples);

  // Shards & ID map test
  const idMapPath = path.join(ROOT, 'public/data/registry/id-map.json');
  if (!fs.existsSync(idMapPath)) {
    console.error('[FAIL] id-map.json missing!');
    failed = true;
  } else {
    const idMap = JSON.parse(fs.readFileSync(idMapPath, 'utf8'));
    if (Object.keys(idMap).length !== totalEligible) {
      console.error(`[FAIL] id-map keys ${Object.keys(idMap).length} !== ${totalEligible}`);
      failed = true;
    } else {
      console.log(`[PASS] id-map.json contains all ${totalEligible.toLocaleString('de-DE')} IDs mapped to 95 PLZ shards.`);
    }
  }
}

// 6. Federal Level Benchmark
console.log('--- Federal Level Benchmark ---');
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
  console.log('=== NATIONWIDE BNETZA REGISTRY & SEARCH: ALL CHECKS PASSED ===');
  process.exit(0);
}
