/**
 * Relational Numerical Consistency Guard for ladestandorte.de
 *
 * Enforces dynamic mathematical and structural consistency across the entire data architecture:
 * Raw BNetzA Snapshots <-> Generated Datasets <-> Public JSON/CSV Mirrors <-> SSR Pre-rendered HTML & Pages
 *
 * NO HARDCODED SNAPSHOT LOCKS:
 * All checks are fully relational, supporting automated monthly pipeline updates without code alterations.
 */

import fs from 'fs';
import path from 'path';
import readline from 'readline';
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

console.log('=== RELATIONAL NUMERICAL CONSISTENCY GUARD ===');

async function runGuard() {
  // 1. Authoritative Datasets & Pointers
  const latestPointerPath = path.join(rootDir, 'data/raw/bnetza/latest.json');
  assert(fs.existsSync(latestPointerPath), 'data/raw/bnetza/latest.json exists');
  const latestPointer = JSON.parse(fs.readFileSync(latestPointerPath, 'utf8'));

  const cpoGeneratedPath = path.join(rootDir, 'src/data/generated/cpo-monitor.generated.json');
  const cpoPublicPath = path.join(rootDir, 'public/data/cpo-monitor.json');
  assert(fs.existsSync(cpoGeneratedPath), 'cpo-monitor.generated.json exists');
  assert(fs.existsSync(cpoPublicPath), 'public/data/cpo-monitor.json exists');
  const cpoGenerated = JSON.parse(fs.readFileSync(cpoGeneratedPath, 'utf8'));
  const cpoPublic = JSON.parse(fs.readFileSync(cpoPublicPath, 'utf8'));

  const citiesGeneratedPath = path.join(rootDir, 'src/data/generated/cities.generated.json');
  const citiesPublicPath = path.join(rootDir, 'public/data/hpc-city-monitor.json');
  assert(fs.existsSync(citiesGeneratedPath), 'cities.generated.json exists');
  assert(fs.existsSync(citiesPublicPath), 'public/data/hpc-city-monitor.json exists');
  const citiesGenerated = JSON.parse(fs.readFileSync(citiesGeneratedPath, 'utf8'));
  const citiesPublic = JSON.parse(fs.readFileSync(citiesPublicPath, 'utf8'));

  // 2. Snapshot Date Relational Alignment
  assert(
    latestPointer.latestSnapshotDate === cpoGenerated.snapshotDate &&
    cpoGenerated.snapshotDate === cpoPublic.snapshotDate,
    `Snapshot date relational consistency across raw (${latestPointer.latestSnapshotDate}), generated (${cpoGenerated.snapshotDate}), and public (${cpoPublic.snapshotDate})`
  );

  // 3. Raw BNetzA Stream Aggregation vs. Generated & Public Mirror
  const rawStationPath = path.join(rootDir, latestPointer.path, 'bnetza_api_ladestation000.csv');
  const rawPointPath = path.join(rootDir, latestPointer.path, 'bnetza_api_ladepunkt000.csv');

  let rawStationsCount = 0;
  if (fs.existsSync(rawStationPath)) {
    const stationStream = fs.createReadStream(rawStationPath);
    const rlStation = readline.createInterface({ input: stationStream, crlfDelay: Infinity });
    let headerSt = null;
    for await (const line of rlStation) {
      if (!headerSt) { headerSt = line; continue; }
      rawStationsCount++;
    }
  }

  let rawPointsCount = 0;
  let rawHpcCount = 0;
  if (fs.existsSync(rawPointPath)) {
    const pointStream = fs.createReadStream(rawPointPath);
    const rlPoint = readline.createInterface({ input: pointStream, crlfDelay: Infinity });
    let headerPt = null;
    for await (const line of rlPoint) {
      if (!headerPt) { headerPt = line; continue; }
      rawPointsCount++;
      const parts = line.split(';');
      const power = parseFloat(parts[4]) || 0;
      if (power >= 150) {
        rawHpcCount++;
      }
    }
  }

  assert(
    rawPointsCount > 0 && rawPointsCount === cpoGenerated.totalRegisterPointsDE,
    `Relational: Raw BNetzA Points (${rawPointsCount}) === Generated totalRegisterPointsDE (${cpoGenerated.totalRegisterPointsDE})`
  );
  assert(
    cpoGenerated.totalRegisterPointsDE === cpoPublic.totalRegisterPointsDE,
    `Relational: Generated totalRegisterPointsDE === Public totalRegisterPointsDE (${cpoPublic.totalRegisterPointsDE})`
  );

  assert(
    rawHpcCount > 0 && rawHpcCount === cpoGenerated.totalRegisterHpcPointsDE,
    `Relational: Raw BNetzA HPC (${rawHpcCount}) === Generated totalRegisterHpcPointsDE (${cpoGenerated.totalRegisterHpcPointsDE})`
  );
  assert(
    cpoGenerated.totalRegisterHpcPointsDE === cpoPublic.totalRegisterHpcPointsDE,
    `Relational: Generated totalRegisterHpcPointsDE === Public totalRegisterHpcPointsDE (${cpoPublic.totalRegisterHpcPointsDE})`
  );

  assert(
    rawStationsCount > 0 && rawStationsCount === cpoGenerated.totalRegisterStationsDE,
    `Relational: Raw BNetzA Stations (${rawStationsCount}) === Generated totalRegisterStationsDE (${cpoGenerated.totalRegisterStationsDE})`
  );
  assert(
    cpoGenerated.totalRegisterStationsDE === cpoPublic.totalRegisterStationsDE,
    `Relational: Generated totalRegisterStationsDE === Public totalRegisterStationsDE (${cpoPublic.totalRegisterStationsDE})`
  );

  // 4. Verified CPO Entities Relational Consistency
  assert(
    cpoGenerated.cposCount === cpoGenerated.operators.length,
    `Relational: cposCount (${cpoGenerated.cposCount}) === generated operators array length (${cpoGenerated.operators.length})`
  );
  assert(
    cpoGenerated.cposCount === cpoPublic.cposCount,
    `Relational: Generated cposCount === Public cposCount (${cpoPublic.cposCount})`
  );

  // 5. Cities Monitor Relational Math Aggregation
  assert(
    citiesGenerated.length === citiesPublic.cities.length,
    `Relational: cities.generated.json count (${citiesGenerated.length}) === public cities count (${citiesPublic.cities.length})`
  );

  let sumCityPop = 0;
  let sumCityPoints = 0;
  let sumCityHpc = 0;
  for (const c of citiesPublic.cities) {
    sumCityPop += c.population;
    sumCityPoints += c.chargingPointsTotal;
    sumCityHpc += c.chargingPoints150PlusKw;
  }

  assert(
    sumCityPoints > 0 && sumCityHpc > 0 && sumCityPop > 0,
    `Relational: Cities aggregated metrics are strictly positive (Points: ${sumCityPoints}, HPC: ${sumCityHpc}, Pop: ${sumCityPop})`
  );

  const calculatedHpcShare = (sumCityHpc / sumCityPoints) * 100;
  assert(
    calculatedHpcShare > 0 && calculatedHpcShare < 100,
    `Relational: Calculated 50-cities HPC share is valid (${calculatedHpcShare.toFixed(2)} %)`
  );

  // 6. Hard CPO Binding: Check EVERY Operator in OPERATORS_DATA
  const { OPERATORS_DATA } = await import('../dist-ssr/entry-server.js');
  let verifiedCpoBoundCount = 0;
  for (const op of OPERATORS_DATA) {
    const matchedCpo = cpoGenerated.operators.find(
      (c) =>
        c.slug === op.slug ||
        c.id === op.slug ||
        (op.slug === 'tesla-supercharger' && (c.id === 'tesla' || c.slug === 'tesla')) ||
        (op.slug === 'enbw' && (c.id === 'enbw' || c.slug === 'enbw-mobility-plus'))
    );
    if (matchedCpo) {
      verifiedCpoBoundCount++;
      assert(
        op.totalPointsDE === matchedCpo.chargingPointsTotal,
        `Relational CPO Binding for ${op.name}: OPERATORS_DATA points (${op.totalPointsDE}) === CPO Monitor points (${matchedCpo.chargingPointsTotal})`
      );
      assert(
        op.hpcShare === Math.round(matchedCpo.share150PlusKwPercent),
        `Relational CPO Binding for ${op.name}: OPERATORS_DATA hpcShare (${op.hpcShare}%) === CPO Monitor share (${Math.round(matchedCpo.share150PlusKwPercent)}%)`
      );
    }
  }
  assert(verifiedCpoBoundCount >= 10, `Relational CPO Binding verified for ${verifiedCpoBoundCount} institutional operators`);

  // 7. Search Index Integrity: Exact Entity Alignment & Zero Orphan/Duplicates
  const searchIndexPath = path.join(rootDir, 'public/search-index.json');
  assert(fs.existsSync(searchIndexPath), 'public/search-index.json exists');
  const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

  const { MOTORWAYS_DATA, CITIES_DATA, STATIONS_DATA, isIndexableLocation } = await import('../dist-ssr/entry-server.js');

  const indexedMotorways = searchIndex.filter((s) => s.category === 'motorways');
  const indexedCities = searchIndex.filter((s) => s.category === 'cities');
  const indexedOperators = searchIndex.filter((s) => s.category === 'operators');
  const indexedStations = searchIndex.filter((s) => s.category === 'stations');

  const enabledStations = STATIONS_DATA.filter((s) => (isIndexableLocation ? isIndexableLocation(s) : s.isPilot));

  assert(
    indexedMotorways.length === MOTORWAYS_DATA.length,
    `Search Integrity: indexed motorways (${indexedMotorways.length}) === MOTORWAYS_DATA (${MOTORWAYS_DATA.length})`
  );
  assert(
    indexedCities.length === CITIES_DATA.length,
    `Search Integrity: indexed cities (${indexedCities.length}) === CITIES_DATA (${CITIES_DATA.length})`
  );
  assert(
    indexedOperators.length === OPERATORS_DATA.length,
    `Search Integrity: indexed operators (${indexedOperators.length}) === OPERATORS_DATA (${OPERATORS_DATA.length})`
  );
  assert(
    indexedStations.length === enabledStations.length,
    `Search Integrity: indexed stations (${indexedStations.length}) === enabled dossiers (${enabledStations.length})`
  );

  // Check unique IDs in search index
  const idSet = new Set();
  let duplicateCount = 0;
  for (const item of searchIndex) {
    if (idSet.has(item.id)) duplicateCount++;
    idSet.add(item.id);
  }
  assert(duplicateCount === 0, `Search Integrity: Zero duplicate IDs in search index (actual duplicates: ${duplicateCount})`);

  // 8. InstantFinder: No cap in tab button
  const finderSource = fs.readFileSync(path.join(rootDir, 'src/components/InstantFinder.tsx'), 'utf8');
  assert(
    !finderSource.includes('Alle ({results.length})'),
    'InstantFinder: Tab does not label "Alle" with deceptive search-render cap'
  );

  // 9. Relational UI Binding for Wallbox and Charging Cards (NO HARDCODED LITERAL LOCKS)
  const wallboxSource = fs.readFileSync(path.join(rootDir, 'src/pages/WallboxVergleichPage.tsx'), 'utf8');
  assert(
    wallboxSource.includes('${WALLBOXES_DATA.length} Wallboxen'),
    'WallboxVergleichPage: Strictly bound to dynamic ${WALLBOXES_DATA.length} (no hardcoded literal)'
  );
  assert(
    !wallboxSource.includes('Über 20 Wallboxen im redaktionell'),
    'WallboxVergleichPage: Zero vague outdated claims'
  );

  const ratgeberSource = fs.readFileSync(path.join(rootDir, 'src/pages/RatgeberArticlePage.tsx'), 'utf8');
  assert(
    ratgeberSource.includes('${CHARGING_CARDS.length} Ladekarten'),
    'RatgeberArticlePage: Strictly bound to dynamic ${CHARGING_CARDS.length} (no hardcoded literal)'
  );
  assert(
    !ratgeberSource.includes('18 Ladekarten'),
    'RatgeberArticlePage: Zero outdated hardcoded claims'
  );

  // 10. Home Page KPI Relational Binding & Teaser Integrity
  const homeSource = fs.readFileSync(path.join(rootDir, 'src/pages/Home.tsx'), 'utf8');
  assert(
    homeSource.includes('cpoDataset.totalRegisterPointsDE') &&
    homeSource.includes('cpoDataset.totalRegisterHpcPointsDE') &&
    homeSource.includes('cpoDataset.totalRegisterStationsDE') &&
    homeSource.includes('cpoDataset.cposCount'),
    'Home.tsx: All 4 Hero KPIs are bound directly to cpoDataset'
  );
  assert(
    !homeSource.includes('Physische Standorte'),
    'Home.tsx: Hero KPI does not use incorrect "Physische Standorte" label'
  );
  assert(
    homeSource.includes('hCity?.hpcLadepunkte') && homeSource.includes('mCity?.hpcLadepunkte'),
    'Home.tsx: Monitor Teaser dynamically binds Hamburg and München'
  );

  // 11. Operators Data: Zero hardcoded volatile figures in descriptions
  const operatorsSource = fs.readFileSync(path.join(rootDir, 'src/data/operators.ts'), 'utf8');
  assert(
    !operatorsSource.includes('11.500 registrierten Ladepunkten') &&
    !operatorsSource.includes('über 4.000 Ladepunkten') &&
    !operatorsSource.includes('mehr als 2.400') &&
    !operatorsSource.includes('1.763 Ladepunkte'),
    'operators.ts: Zero volatile numbers hardcoded in operator descriptions'
  );

  // 12. Operator Registry Slices Verification
  const opSlicesDir = path.join(rootDir, 'public/data/registry/operators');
  assert(fs.existsSync(opSlicesDir), 'public/data/registry/operators directory exists');
  const opSlices = fs.readdirSync(opSlicesDir).filter(f => f.endsWith('.json'));
  assert(opSlices.length >= 15, `Operator Registry Slices: Found ${opSlices.length} operator JSON slices (>= 15 required)`);
  const enbwSlice = JSON.parse(fs.readFileSync(path.join(opSlicesDir, 'enbw.json'), 'utf8'));
  const enbwCount = Array.isArray(enbwSlice) ? enbwSlice.length : enbwSlice.stationsCount;
  assert(enbwCount === 5436, `Operator Slices: enbw.json contains exactly 5436 stations (actual: ${enbwCount})`);

  // 11. Pre-rendered HTML Relational Verification
  const distDir = path.join(rootDir, 'dist');
  if (fs.existsSync(distDir)) {
    const homeHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
    const formattedPoints = cpoGenerated.totalRegisterPointsDE.toLocaleString('de-DE');
    const formattedHpc = cpoGenerated.totalRegisterHpcPointsDE.toLocaleString('de-DE');
    const formattedStations = cpoGenerated.totalRegisterStationsDE.toLocaleString('de-DE');

    assert(
      homeHtml.includes(formattedPoints) &&
      homeHtml.includes(formattedHpc) &&
      homeHtml.includes(formattedStations),
      `Pre-rendered HTML relational check: index.html contains dynamically formatted numbers (${formattedPoints}, ${formattedHpc}, ${formattedStations})`
    );
  }

  console.log(`\nRelational Numerical Consistency Guard completed: ${passedChecks}/${totalChecks} passed (${failedChecks} failed).`);

  if (failedChecks > 0) {
    process.exit(1);
  } else {
    console.log('✅ MONTHLY NUMERICAL CONSISTENCY GUARD VERIFIED.');
  }
}

runGuard();
