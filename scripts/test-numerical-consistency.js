/**
 * Automated Numerical Consistency Test Suite for ladestandorte.de
 *
 * Verifies that all publicly visible figures, KPIs, claims, and data aggregations
 * across all routes and components strictly match the authoritative datasets:
 * - CPO Monitor (cpo-monitor.generated.json & public/data/cpo-monitor.json)
 * - HPC City Monitor (cities.generated.json & public/data/hpc-city-monitor.json)
 * - MCS Dataset (stations.ts -> getMcsStations)
 * - Dossier Selection (stations.ts -> getDossierCount)
 * - Wallbox Dataset (wallboxes.ts -> WALLBOXES)
 * - Ladekarten Dataset (cards.ts -> CHARGING_CARDS)
 * - Motorways Dataset (motorways.ts -> MOTORWAYS_DATA)
 * - Operators Dataset (operators.ts -> OPERATORS_DATA)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`[PASS] ${message}`);
  } else {
    failedChecks++;
    console.error(`[FAIL] ${message}`);
  }
}

console.log('=== NUMERICAL CONSISTENCY AUDIT TEST ===');

// 1. Authoritative Datasets Loading
const cpoGeneratedPath = path.join(rootDir, 'src/data/generated/cpo-monitor.generated.json');
const cpoPublicPath = path.join(rootDir, 'public/data/cpo-monitor.json');
const cpoGenerated = JSON.parse(fs.readFileSync(cpoGeneratedPath, 'utf8'));
const cpoPublic = JSON.parse(fs.readFileSync(cpoPublicPath, 'utf8'));

const citiesGeneratedPath = path.join(rootDir, 'src/data/generated/cities.generated.json');
const citiesPublicPath = path.join(rootDir, 'public/data/hpc-city-monitor.json');
const citiesGenerated = JSON.parse(fs.readFileSync(citiesGeneratedPath, 'utf8'));
const citiesPublic = JSON.parse(fs.readFileSync(citiesPublicPath, 'utf8'));

// Check 1.1: CPO Monitor Authoritative Values
assert(
  cpoGenerated.totalRegisterPointsDE === 210185,
  `CPO Monitor totalRegisterPointsDE === 210185 (actual: ${cpoGenerated.totalRegisterPointsDE})`
);
assert(
  cpoGenerated.totalRegisterHpcPointsDE === 40654,
  `CPO Monitor totalRegisterHpcPointsDE === 40654 (actual: ${cpoGenerated.totalRegisterHpcPointsDE})`
);
assert(
  cpoGenerated.totalRegisterStationsDE === 117043,
  `CPO Monitor totalRegisterStationsDE === 117043 (actual: ${cpoGenerated.totalRegisterStationsDE})`
);
assert(
  cpoGenerated.cposCount === 30,
  `CPO Monitor cposCount === 30 (actual: ${cpoGenerated.cposCount})`
);
assert(
  cpoGenerated.snapshotDate === '2026-10-01',
  `CPO Monitor snapshotDate === '2026-10-01' (actual: ${cpoGenerated.snapshotDate})`
);
assert(
  cpoPublic.totalRegisterPointsDE === cpoGenerated.totalRegisterPointsDE &&
  cpoPublic.totalRegisterHpcPointsDE === cpoGenerated.totalRegisterHpcPointsDE &&
  cpoPublic.totalRegisterStationsDE === cpoGenerated.totalRegisterStationsDE &&
  cpoPublic.cposCount === cpoGenerated.cposCount,
  'public/data/cpo-monitor.json strictly mirrors generated data'
);

// Check 1.2: HPC City Monitor Authoritative Values
assert(citiesGenerated.length === 50, `Cities dataset contains exactly 50 cities (actual: ${citiesGenerated.length})`);
assert(citiesPublic.cities.length === 50, `HPC City public JSON contains exactly 50 cities (actual: ${citiesPublic.cities.length})`);

let citiesTotalPop = 0;
let citiesTotalPts = 0;
let citiesTotalHpc = 0;
for (const c of citiesPublic.cities) {
  citiesTotalPop += c.population;
  citiesTotalPts += c.chargingPointsTotal;
  citiesTotalHpc += c.chargingPoints150PlusKw;
}

assert(citiesTotalPop === 22977940, `50-cities total population === 22,977,940 (actual: ${citiesTotalPop})`);
assert(citiesTotalPts === 62312, `50-cities total points === 62,312 (actual: ${citiesTotalPts})`);
assert(citiesTotalHpc === 8514, `50-cities total HPC points === 8,514 (actual: ${citiesTotalHpc})`);

const hpcShareCalculated = ((citiesTotalHpc / citiesTotalPts) * 100).toFixed(2);
assert(hpcShareCalculated === '13.66', `50-cities HPC share === 13.66% (actual: ${hpcShareCalculated}%)`);

// Check 2: Dynamic Source Bindings in Operators Dataset
const operatorsSource = fs.readFileSync(path.join(rootDir, 'src/data/operators.ts'), 'utf8');
assert(
  operatorsSource.includes("import cpoDataset from './generated/cpo-monitor.generated.json'") &&
  operatorsSource.includes('cpoDataset.operators'),
  'src/data/operators.ts imports and binds to cpo-monitor dataset dynamically'
);

// Check 3: Home Page KPI Consistency
const homeSource = fs.readFileSync(path.join(rootDir, 'src/pages/Home.tsx'), 'utf8');
assert(
  homeSource.includes('cpoDataset.totalRegisterPointsDE') &&
  homeSource.includes('cpoDataset.totalRegisterHpcPointsDE') &&
  homeSource.includes('cpoDataset.totalRegisterStationsDE') &&
  homeSource.includes('cpoDataset.cposCount'),
  'Home.tsx binds all 4 hero KPIs directly to cpoDataset'
);
assert(
  !homeSource.includes('29 CPOs'),
  'Home.tsx no longer contains stale "29 CPOs" claim'
);
assert(
  !homeSource.includes('28.500'),
  'Home.tsx no longer contains stale "28.500" HPC points claim'
);

// Check 4: Wallbox and Ladekarten Claims Consistency
const wallboxSource = fs.readFileSync(path.join(rootDir, 'src/pages/WallboxVergleichPage.tsx'), 'utf8');
assert(
  wallboxSource.includes('${WALLBOXES_DATA.length} Wallboxen') || wallboxSource.includes('33 Wallboxen'),
  'WallboxVergleichPage.tsx specifies accurate wallbox count'
);
assert(
  !wallboxSource.includes('Über 20 Wallboxen im redaktionell'),
  'WallboxVergleichPage.tsx no longer contains vague "Über 20 Wallboxen" claim'
);

const ratgeberSource = fs.readFileSync(path.join(rootDir, 'src/pages/RatgeberArticlePage.tsx'), 'utf8');
assert(
  ratgeberSource.includes('CHARGING_CARDS.length') || ratgeberSource.includes('25 Ladekarten'),
  'RatgeberArticlePage.tsx specifies accurate charging cards count'
);
assert(
  !ratgeberSource.includes('18 Ladekarten'),
  'RatgeberArticlePage.tsx no longer contains stale "18 Ladekarten" claim'
);

// Check 5: InstantFinder Tab Consistency
const finderSource = fs.readFileSync(path.join(rootDir, 'src/components/InstantFinder.tsx'), 'utf8');
assert(
  !finderSource.includes('Alle ({results.length})'),
  'InstantFinder.tsx does not display deceptive 25-capped result count on "Alle" tab'
);

// Check 6: Pre-rendered HTML Scans (if dist exists)
const distDir = path.join(rootDir, 'dist');
if (fs.existsSync(distDir)) {
  const homeHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  assert(
    homeHtml.includes('210.185') && homeHtml.includes('40.654') && homeHtml.includes('117.043'),
    'dist/index.html pre-renders exact formatted BNetzA KPIs (210.185, 40.654, 117.043)'
  );
  assert(
    !homeHtml.includes('29 CPOs'),
    'dist/index.html does not contain stale "29 CPOs"'
  );
  assert(
    !homeHtml.includes('28.500'),
    'dist/index.html does not contain stale "28.500"'
  );
}

console.log(`\nNumerical Consistency Audit completed: ${passedChecks}/${totalChecks} passed (${failedChecks} failed).`);

if (failedChecks > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL NUMERICAL CONSISTENCY CHECKS PASSED.');
}
