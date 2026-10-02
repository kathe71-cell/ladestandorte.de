#!/usr/bin/env node
/**
 * scripts/generate-city-registries.mjs
 * 
 * Aggregates all 117.043 BNetzA stations from official snapshot CSVs into:
 * 1. public/data/registry/[citySlug].json - Complete station registry for each of the 50 cities (relational integrity preserved).
 * 2. public/data/registry/shards/[prefix].json - 95 PLZ 2-digit shards covering ALL 117.043 stations nationwide (~15-50 KB gzip each).
 * 3. public/data/registry/id-map.json - Compact ID-to-prefix lookup table for O(1) direct station routing across Germany.
 * 4. public/data/registry-search-index.json - Full nationwide search index of all 117.043 eligible BNetzA stations.
 * 5. src/data/generated/registry-summary.generated.json - Compile-time metrics and verification data.
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

function toSlug(name) {
  if (!name) return 'deutschland';
  return name
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'deutschland';
}

async function main() {
  console.log('=== GENERATING NATIONWIDE BNETZA REGISTRIES & SEARCH INDEX ===');
  
  const latestPointerPath = path.join(ROOT, 'data/raw/bnetza/latest.json');
  if (!fs.existsSync(latestPointerPath)) {
    console.error('No latest.json found in data/raw/bnetza!');
    process.exit(1);
  }

  const latestPointer = JSON.parse(fs.readFileSync(latestPointerPath, 'utf8'));
  const snapshotDir = path.join(ROOT, latestPointer.path);
  const snapshotDate = latestPointer.latestSnapshotDate;

  // Load 50 city mappings
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

  // 1. Stream Ladestationen CSV (ALL 117.043 rows)
  const ladestationPath = path.join(snapshotDir, 'bnetza_api_ladestation000.csv');
  const allStationMap = new Map();
  const rlStation = readline.createInterface({ input: fs.createReadStream(ladestationPath), crlfDelay: Infinity });
  let headerS = null;

  for await (const line of rlStation) {
    if (!headerS) { headerS = line.split(';'); continue; }
    const parts = line.split(';');
    const stId = parts[0]?.trim();
    const ars = parts[12]?.trim();
    const matchedCity = arsToCity.get(ars);

    const plz = parts[7]?.trim() || '';
    const prefix = plz.length >= 2 ? plz.slice(0, 2) : 'other';
    const rawCity = parts[8]?.trim() || '';
    const citySlug = matchedCity ? matchedCity.slug : toSlug(rawCity);

    allStationMap.set(stId, {
      id: stId,
      citySlug,
      cpo: parts[3]?.trim() || parts[1]?.trim() || 'Unbekannt',
      cpoRaw: parts[1]?.trim() || '',
      street: parts[5]?.trim() || '',
      houseNumber: parts[6]?.trim() || '',
      plz,
      prefix,
      city: rawCity,
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
      dossierId: null,
      isTop50: !!matchedCity
    });
  }

  console.log(`Read ${allStationMap.size} total stations from BNetzA register.`);

  // 2. Stream Ladepunkte CSV (ALL 210.185 points)
  const ladepunktPath = path.join(snapshotDir, 'bnetza_api_ladepunkt000.csv');
  const rlPoint = readline.createInterface({ input: fs.createReadStream(ladepunktPath), crlfDelay: Infinity });
  let headerP = null;
  let totalPointsCount = 0;

  for await (const line of rlPoint) {
    if (!headerP) { headerP = line.split(';'); continue; }
    totalPointsCount++;
    const parts = line.split(';');
    const stId = parts[2]?.trim();
    const st = allStationMap.get(stId);
    if (st) {
      const kw = parseFloat(parts[4] || '0');
      st.pointsCount++;
      if (kw >= 150) st.hpcPointsCount++;
      if (kw > st.maxKw) st.maxKw = kw;
      if (!st.powerLevels.includes(kw)) st.powerLevels.push(kw);
    }
  }

  console.log(`Mapped ${totalPointsCount} total charging points.`);

  // Fallback defaults and sorting
  for (const st of allStationMap.values()) {
    if (st.maxKw === 0 && st.ratedKw > 0) st.maxKw = st.ratedKw;
    if (st.pointsCount === 0 && st.reportedPoints > 0) st.pointsCount = st.reportedPoints;
    st.powerLevels.sort((a,b) => a - b);
  }

  // Cross-reference dossiers
  let linkedDossierCount = 0;
  for (const d of dossiers) {
    const streetNum = d.street.match(/(\d+)/);
    const num = streetNum ? streetNum[1] : null;
    const sNameClean = d.street.toLowerCase().replace(/str\.|straße|strasse/g, '').replace(/[\d\s,-]/g, '');

    for (const st of allStationMap.values()) {
      if (st.plz === d.plz) {
        const regClean = st.street.toLowerCase().replace(/str\.|straße|strasse/g, '').replace(/[\d\s,-]/g, '');
        const numMatch = !num || st.houseNumber.includes(num);
        if (numMatch && (regClean.includes(sNameClean) || sNameClean.includes(regClean))) {
          if (!st.dossierId) {
            st.dossierId = d.id;
            linkedDossierCount++;
          }
        }
      }
    }
  }

  console.log(`Linked ${linkedDossierCount} BNetzA stations to curated dossiers.`);

  // Ensure directories exist
  fs.mkdirSync(path.join(ROOT, 'public/data/registry'), { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'public/data/registry/shards'), { recursive: true });
  fs.mkdirSync(path.join(ROOT, 'src/data/generated'), { recursive: true });

  // 3. Write 50 Top-City Registries (Strictly preserving city schema & relational tests)
  const byTopCity = {};
  for (const c of cityMappings) byTopCity[c.slug] = [];
  for (const st of allStationMap.values()) {
    if (st.isTop50 && byTopCity[st.citySlug]) {
      byTopCity[st.citySlug].push(st);
    }
  }

  const summary = {
    snapshotDate,
    totalRegisterStationsDE: allStationMap.size,
    totalRegisterPointsDE: totalPointsCount,
    top50CitiesCount: cityMappings.length,
    top50MappedStations: 0,
    top50MappedPoints: 0,
    outsideTop50Stations: 0,
    cities: {}
  };

  for (const c of cityMappings) {
    const list = byTopCity[c.slug];
    list.sort((a, b) => b.maxKw - a.maxKw || b.pointsCount - a.pointsCount || a.street.localeCompare(b.street));
    fs.writeFileSync(path.join(ROOT, 'public/data/registry', `${c.slug}.json`), JSON.stringify(list), 'utf8');
    
    const pCount = list.reduce((acc, s) => acc + s.pointsCount, 0);
    const hpcCount = list.reduce((acc, s) => acc + s.hpcPointsCount, 0);
    summary.top50MappedStations += list.length;
    summary.top50MappedPoints += pCount;

    summary.cities[c.slug] = {
      name: c.name,
      stationCount: list.length,
      pointsCount: pCount,
      hpcPointsCount: hpcCount,
      hpcStationsCount: list.filter(s => s.hpcPointsCount > 0).length
    };
  }

  summary.outsideTop50Stations = allStationMap.size - summary.top50MappedStations;
  fs.writeFileSync(path.join(ROOT, 'src/data/generated/registry-summary.generated.json'), JSON.stringify(summary, null, 2), 'utf8');

  // 4. Write 95 PLZ 2-Digit Nationwide Shards (for ultra-fast O(1) single-station detail lookups anywhere in Germany)
  const shards = {};
  const idMap = {};
  for (const st of allStationMap.values()) {
    idMap[st.id] = st.prefix;
    if (!shards[st.prefix]) shards[st.prefix] = [];
    shards[st.prefix].push(st);
  }

  for (const [prefix, list] of Object.entries(shards)) {
    fs.writeFileSync(path.join(ROOT, 'public/data/registry/shards', `${prefix}.json`), JSON.stringify(list), 'utf8');
  }
  fs.writeFileSync(path.join(ROOT, 'public/data/registry/id-map.json'), JSON.stringify(idMap), 'utf8');
  console.log(`[PASS] Wrote ${Object.keys(shards).length} nationwide PLZ shards + id-map.json.`);

  // 5. Build Nationwide Search Index (ALL 117.043 stations)
  // Highly compact schema:
  // i: id, cs: citySlug, o: cpo, s: address, p: plz, c: city, st: state, k: maxKw, n: pointsCount, h: hpcCount, d: dossierId
  const searchEntries = [];
  for (const st of allStationMap.values()) {
    searchEntries.push({
      i: st.id,
      cs: st.citySlug,
      o: st.cpo,
      s: `${st.street} ${st.houseNumber}`.trim(),
      p: st.plz,
      c: st.city,
      st: st.state,
      k: st.maxKw,
      n: st.pointsCount,
      h: st.hpcPointsCount,
      d: st.dossierId
    });
  }

  fs.writeFileSync(path.join(ROOT, 'public/data/registry-search-index.json'), JSON.stringify(searchEntries), 'utf8');

  console.log(`[PASS] Wrote 50 city registries (${summary.top50MappedStations} stations).`);
  console.log(`[PASS] Wrote nationwide registry search index (${searchEntries.length} items, covering ${summary.outsideTop50Stations} stations outside Top-50).`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
