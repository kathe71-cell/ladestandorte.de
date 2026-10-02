#!/usr/bin/env node
/**
 * scripts/generate-city-registries.mjs
 * 
 * Aggregates all BNetzA stations from official snapshot CSVs into:
 * 1. public/data/registry/[citySlug].json - Complete station registry for each of the 50 cities.
 * 2. public/data/registry-search-index.json - High-performance search index covering:
 *    - All 50 cities' stations (with keywords: operator, street, plz, city, id)
 *    - Cross-referenced with curated dossiers to prevent duplicates.
 * 3. src/data/generated/registry-summary.generated.json - Compile-time metrics and verification data.
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

async function main() {
  console.log('=== GENERATING BNETZA CITY REGISTRIES & SEARCH INDEX ===');
  
  const latestPointerPath = path.join(ROOT, 'data/raw/bnetza/latest.json');
  if (!fs.existsSync(latestPointerPath)) {
    console.error('No latest.json found in data/raw/bnetza!');
    process.exit(1);
  }

  const latestPointer = JSON.parse(fs.readFileSync(latestPointerPath, 'utf8'));
  const snapshotDir = path.join(ROOT, latestPointer.path);
  const snapshotDate = latestPointer.latestSnapshotDate;

  // Load city mappings
  const cityMappings = JSON.parse(fs.readFileSync(path.join(ROOT, 'src/data/mappings/cities.json'), 'utf8'));
  const arsToCity = new Map();
  for (const c of cityMappings) {
    arsToCity.set(c.ars, c);
  }

  // Load curated station dossiers to link BNetzA IDs & avoid duplicates
  const stationsFile = fs.readFileSync(path.join(ROOT, 'src/data/stations.ts'), 'utf8');
  const stBlocks = stationsFile.split(/\{\s*id:\s*"/g).slice(1);
  const dossiers = stBlocks.map(b => {
    const id = b.split('"')[0];
    const name = (b.match(/name:\s*"([^"]+)"/) || [])[1];
    const operator = (b.match(/operator:\s*"([^"]+)"/) || [])[1];
    const street = (b.match(/street:\s*"([^"]+)"/) || [])[1];
    const plz = (b.match(/plz:\s*"([^"]+)"/) || [])[1];
    const city = (b.match(/city:\s*"([^"]+)"/) || [])[1];
    const citySlug = (b.match(/citySlug:\s*"([^"]+)"/) || [])[1];
    const slug = (b.match(/slug:\s*"([^"]+)"/) || [])[1];
    return { id, name, operator, street, plz, city, citySlug, slug: slug || id };
  });

  console.log(`Loaded ${dossiers.length} curated dossiers.`);

  // 1. Stream Ladestationen CSV
  const ladestationPath = path.join(snapshotDir, 'bnetza_api_ladestation000.csv');
  const stationMap = new Map();
  const rlStation = readline.createInterface({ input: fs.createReadStream(ladestationPath), crlfDelay: Infinity });
  let headerS = null;

  for await (const line of rlStation) {
    if (!headerS) { headerS = line.split(';'); continue; }
    const parts = line.split(';');
    const stId = parts[0]?.trim();
    const ars = parts[12]?.trim();
    const city = arsToCity.get(ars);
    if (city) {
      stationMap.set(stId, {
        id: stId,
        citySlug: city.slug,
        cpo: parts[3]?.trim() || parts[1]?.trim() || 'Unbekannt',
        cpoRaw: parts[1]?.trim() || '',
        street: parts[5]?.trim() || '',
        houseNumber: parts[6]?.trim() || '',
        plz: parts[7]?.trim() || '',
        city: parts[8]?.trim() || '',
        state: parts[9]?.trim() || '',
        lon: parts[13] ? parseFloat(parts[13]) : null,
        lat: parts[14] ? parseFloat(parts[14]) : null,
        ratedKw: parseFloat(parts[17] || '0'),
        installedKw: parseFloat(parts[18] || '0'),
        reportedPoints: parseInt(parts[19] || '0', 10),
        commissioningDate: parts[15]?.trim() || '',
        useCase: parts[51]?.trim() || '',
        pointsCount: 0,
        hpcPointsCount: 0,
        maxKw: 0,
        powerLevels: [],
        dossierId: null
      });
    }
  }

  // 2. Stream Ladepunkte CSV
  const ladepunktPath = path.join(snapshotDir, 'bnetza_api_ladepunkt000.csv');
  const rlPoint = readline.createInterface({ input: fs.createReadStream(ladepunktPath), crlfDelay: Infinity });
  let headerP = null;

  for await (const line of rlPoint) {
    if (!headerP) { headerP = line.split(';'); continue; }
    const parts = line.split(';');
    const stId = parts[2]?.trim();
    const st = stationMap.get(stId);
    if (st) {
      const kw = parseFloat(parts[4] || '0');
      st.pointsCount++;
      if (kw >= 150) st.hpcPointsCount++;
      if (kw > st.maxKw) st.maxKw = kw;
      if (!st.powerLevels.includes(kw)) st.powerLevels.push(kw);
    }
  }

  // Fallback defaults and sorting
  for (const st of stationMap.values()) {
    if (st.maxKw === 0 && st.ratedKw > 0) st.maxKw = st.ratedKw;
    if (st.pointsCount === 0 && st.reportedPoints > 0) st.pointsCount = st.reportedPoints;
    st.powerLevels.sort((a,b) => a - b);
  }

  // Cross-reference dossiers
  for (const d of dossiers) {
    const streetNum = d.street.match(/(\d+)/);
    const num = streetNum ? streetNum[1] : null;
    const sNameClean = d.street.toLowerCase().replace(/str\.|straße|strasse/g, '').replace(/[\d\s,-]/g, '');

    for (const st of stationMap.values()) {
      if (st.plz === d.plz) {
        const regClean = st.street.toLowerCase().replace(/str\.|straße|strasse/g, '').replace(/[\d\s,-]/g, '');
        const numMatch = !num || st.houseNumber.includes(num);
        if (numMatch && (regClean.includes(sNameClean) || sNameClean.includes(regClean))) {
          st.dossierId = d.id;
        }
      }
    }
  }

  // Group by city
  const byCity = {};
  for (const c of cityMappings) byCity[c.slug] = [];
  for (const st of stationMap.values()) {
    byCity[st.citySlug].push(st);
  }

  // Ensure directories exist
  fs.mkdirSync(path.join(ROOT, 'public/data/registry'), { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'src/data/generated'), { recursive: true });

  const summary = {
    snapshotDate,
    totalCities: cityMappings.length,
    totalMappedStations: stationMap.size,
    cities: {}
  };

  for (const c of cityMappings) {
    const list = byCity[c.slug];
    list.sort((a, b) => b.maxKw - a.maxKw || b.pointsCount - a.pointsCount || a.street.localeCompare(b.street));
    fs.writeFileSync(path.join(ROOT, 'public/data/registry', `${c.slug}.json`), JSON.stringify(list), 'utf8');
    
    summary.cities[c.slug] = {
      name: c.name,
      stationCount: list.length,
      pointsCount: list.reduce((acc, s) => acc + s.pointsCount, 0),
      hpcPointsCount: list.reduce((acc, s) => acc + s.hpcPointsCount, 0),
      hpcStationsCount: list.filter(s => s.hpcPointsCount > 0).length
    };
  }

  fs.writeFileSync(path.join(ROOT, 'src/data/generated/registry-summary.generated.json'), JSON.stringify(summary, null, 2), 'utf8');

  // Build searchable station directory index
  // Compact payload for client search: id, citySlug, cpo, address, plz, city, maxKw, pointsCount, hpcCount, dossierId
  const searchEntries = [];
  for (const st of stationMap.values()) {
    searchEntries.push({
      i: st.id,
      cs: st.citySlug,
      o: st.cpo,
      s: `${st.street} ${st.houseNumber}`.trim(),
      p: st.plz,
      c: st.city,
      k: st.maxKw,
      n: st.pointsCount,
      h: st.hpcPointsCount,
      d: st.dossierId
    });
  }

  fs.writeFileSync(path.join(ROOT, 'public/data/registry-search-index.json'), JSON.stringify(searchEntries), 'utf8');

  console.log(`[PASS] Wrote 50 city registries (${stationMap.size} total stations).`);
  console.log(`[PASS] Wrote public/data/registry-search-index.json (${searchEntries.length} items).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
