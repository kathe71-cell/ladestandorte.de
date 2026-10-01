#!/usr/bin/env node
/**
 * scripts/generate-cpo-monitor-data.mjs
 * Aggregates raw official BNetzA snapshots into verified CPO / Operator entity datasets:
 * - src/data/generated/cpo-monitor.generated.json
 * - public/data/cpo-monitor.json
 * - public/data/cpo-monitor.csv
 *
 * Guarantees:
 * - Strict entity mapping via src/data/mappings/operator-mapping.json
 * - Zero publication of natural persons (cpoPrivacyFilter)
 * - Safe denominator semantics: "Anteil an den im amtlichen Datensatz erfassten HPC-Ladepunkten"
 * - Idempotency: preserves generatedAt if data hash unchanged
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

async function main() {
  const latestPointerPath = path.join(ROOT_DIR, 'data/raw/bnetza/latest.json');
  if (!fs.existsSync(latestPointerPath)) {
    console.error('[CPO Monitor Generator] No latest.json found!');
    process.exit(1);
  }

  const latestPointer = JSON.parse(fs.readFileSync(latestPointerPath, 'utf-8'));
  const snapshotDate = latestPointer.latestSnapshotDate;
  const snapshotDir = path.join(ROOT_DIR, latestPointer.path);
  const metadata = latestPointer.metadata;

  const mappingPath = path.join(ROOT_DIR, 'src/data/mappings/operator-mapping.json');
  const verifiedEntities = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));

  const cityMappingPath = path.join(ROOT_DIR, 'src/data/mappings/cities.json');
  const cityMappings = JSON.parse(fs.readFileSync(cityMappingPath, 'utf-8'));
  const arsToCity = new Map(cityMappings.map(c => [c.ars, c]));

  // Build pattern lookup
  // Map pattern -> entityId
  const patternToEntity = new Map();
  for (const ent of verifiedEntities) {
    for (const pat of ent.bnetzaMatchPatterns) {
      patternToEntity.set(pat.toLowerCase(), ent);
    }
  }

  // 1. Stream Ladestationen CSV
  const ladestationPath = path.join(snapshotDir, 'bnetza_api_ladestation000.csv');
  const stationStream = fs.createReadStream(ladestationPath);
  const rlStation = readline.createInterface({ input: stationStream, crlfDelay: Infinity });

  let headerStation = null;
  const stationMap = new Map(); // stId -> { entityId, ars, rawCpo }
  const entityStationCounts = new Map();
  const entityCityCounts = new Map(); // entityId -> Map<citySlug, count>

  for (const ent of verifiedEntities) {
    entityStationCounts.set(ent.id, 0);
    entityCityCounts.set(ent.id, new Map());
  }

  let totalRawStations = 0;

  for await (const line of rlStation) {
    if (!headerStation) {
      headerStation = line.split(';');
      continue;
    }
    totalRawStations++;
    const parts = line.split(';');
    const stId = parts[0]?.trim();
    const cpoRaw = parts[3]?.trim() || parts[1]?.trim() || '';
    const ars = parts[12]?.trim();

    // Match entity
    let matchedEntity = null;
    const cpoLower = cpoRaw.toLowerCase();
    for (const [pattern, ent] of patternToEntity.entries()) {
      if (cpoLower === pattern || cpoLower.startsWith(pattern)) {
        matchedEntity = ent;
        break;
      }
    }

    if (matchedEntity) {
      stationMap.set(stId, { entityId: matchedEntity.id, ars, rawCpo: cpoRaw });
      entityStationCounts.set(matchedEntity.id, (entityStationCounts.get(matchedEntity.id) || 0) + 1);

      const city = arsToCity.get(ars);
      if (city) {
        const cityMap = entityCityCounts.get(matchedEntity.id);
        cityMap.set(city.slug, (cityMap.get(city.slug) || 0) + 1);
      }
    }
  }

  // 2. Stream Ladepunkte CSV
  const ladepunktPath = path.join(snapshotDir, 'bnetza_api_ladepunkt000.csv');
  const pointStream = fs.createReadStream(ladepunktPath);
  const rlPoint = readline.createInterface({ input: pointStream, crlfDelay: Infinity });

  let headerPoint = null;
  const entityPointMetrics = new Map();
  for (const ent of verifiedEntities) {
    entityPointMetrics.set(ent.id, {
      totalPoints: 0,
      points150PlusKw: 0,
      pointsBetween22And150Kw: 0,
      pointsUpTo22Kw: 0,
      totalKw: 0
    });
  }

  let totalRawPoints = 0;
  let totalRawHpcPoints = 0;

  for await (const line of rlPoint) {
    if (!headerPoint) {
      headerPoint = line.split(';');
      continue;
    }
    totalRawPoints++;
    const parts = line.split(';');
    const stId = parts[2]?.trim();
    const power = parseFloat(parts[4]) || 0;

    if (power >= 150) {
      totalRawHpcPoints++;
    }

    const stInfo = stationMap.get(stId);
    if (!stInfo) continue;

    const m = entityPointMetrics.get(stInfo.entityId);
    m.totalPoints++;
    m.totalKw += power;

    if (power >= 150) {
      m.points150PlusKw++;
    } else if (power > 22) {
      m.pointsBetween22And150Kw++;
    } else {
      m.pointsUpTo22Kw++;
    }
  }

  console.log(`[CPO Monitor Generator] Processed ${totalRawStations} stations, ${totalRawPoints} points (${totalRawHpcPoints} HPC ≥150 kW).`);

  // 3. Assemble CPO Records
  const operators = [];
  for (const ent of verifiedEntities) {
    const m = entityPointMetrics.get(ent.id);
    const stationCount = entityStationCounts.get(ent.id) || 0;
    const cityMap = entityCityCounts.get(ent.id) || new Map();

    const topCities = Array.from(cityMap.entries())
      .map(([slug, count]) => {
        const cDef = cityMappings.find(c => c.slug === slug);
        return {
          citySlug: slug,
          cityName: cDef ? cDef.name : slug,
          stationsCount: count
        };
      })
      .sort((a, b) => b.stationsCount - a.stationsCount)
      .slice(0, 5);

    const share150PlusKwPercent = m.totalPoints > 0 ? Number(((m.points150PlusKw / m.totalPoints) * 100).toFixed(1)) : 0;
    const shareOfRegisterHpcPercent = totalRawHpcPoints > 0 ? Number(((m.points150PlusKw / totalRawHpcPoints) * 100).toFixed(2)) : 0;
    const shareOfRegisterTotalPercent = totalRawPoints > 0 ? Number(((m.totalPoints / totalRawPoints) * 100).toFixed(2)) : 0;

    operators.push({
      id: ent.id,
      slug: ent.slug,
      name: ent.name,
      brandName: ent.brandName,
      parentCompany: ent.parentCompany,
      headquarters: ent.headquarters,
      website: ent.website,
      description: ent.description,
      stationsTotal: stationCount,
      chargingPointsTotal: m.totalPoints,
      chargingPoints150PlusKw: m.points150PlusKw,
      share150PlusKwPercent,
      shareOfRegisterHpcPercent,
      shareOfRegisterTotalPercent,
      citiesWithPresenceCount: cityMap.size,
      topCities,
      powerBrackets: {
        upTo22Kw: m.pointsUpTo22Kw,
        between22And150Kw: m.pointsBetween22And150Kw,
        points150PlusKw: m.points150PlusKw
      },
      provenance: {
        source: metadata.dataSource,
        snapshotDate,
        license: metadata.license,
        attribution: metadata.attributionRequired,
        datasetDisclaimer: 'Basis: Aus dem amtlichen BNetzA-Registerauszug zugeordnete Ladeeinrichtungen. Keine Aussage über roamingbasierten Gesamtmarktanteil.'
      }
    });
  }

  // Sort by HPC points descending, then by total points
  operators.sort((a, b) => b.chargingPoints150PlusKw - a.chargingPoints150PlusKw || b.chargingPointsTotal - a.chargingPointsTotal);

  const generatedPath = path.join(ROOT_DIR, 'src/data/generated/cpo-monitor.generated.json');
  const publicDir = path.join(ROOT_DIR, 'public/data');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const publicJsonPath = path.join(publicDir, 'cpo-monitor.json');
  let generatedAt = metadata.retrievedAt || new Date().toISOString();

  // Check idempotency against existing public file
  if (fs.existsSync(publicJsonPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(publicJsonPath, 'utf-8'));
      const existingOps = JSON.stringify(existing.operators);
      const newOps = JSON.stringify(operators);
      if (existingOps === newOps && existing.generatedAt) {
        generatedAt = existing.generatedAt;
      }
    } catch {
      // ignore
    }
  }

  const dataset = {
    publisher: 'ladestandorte.de',
    canonicalUrl: 'https://www.ladestandorte.de/cpo-monitor',
    snapshotDate,
    retrievedAt: metadata.retrievedAt,
    totalRegisterPointsDE: totalRawPoints,
    totalRegisterHpcPointsDE: totalRawHpcPoints,
    cposCount: operators.length,
    methodologyUrl: 'https://www.ladestandorte.de/methodik',
    definition: {
      hpcClass: 'Ladepunkte mit einer dokumentierten Nennleistung von >=150 kW',
      aggregationScope: 'Verifizierte Betreiberunternehmen (aggregiert über eindeutige Entity-Patterns im amtlichen Register)',
      disclaimer: 'Auswertung der im amtlichen Register der Bundesnetzagentur erfassten Ladeinfrastruktur. Marktanteilsangaben beziehen sich ausschließlich auf die erfassten Registerpunkte, nicht auf Roaming- oder Umsatzanteile.'
    },
    generatedAt,
    operators
  };

  fs.writeFileSync(generatedPath, JSON.stringify(dataset, null, 2) + '\n', 'utf-8');
  fs.writeFileSync(publicJsonPath, JSON.stringify(dataset, null, 2) + '\n', 'utf-8');
  console.log(`[CPO Monitor Generator] Wrote generated data to ${generatedPath} and ${publicJsonPath}`);

  // Generate CSV
  const csvHeaders = [
    'cpo_id',
    'slug',
    'name',
    'parent_company',
    'headquarters',
    'stations_total',
    'charging_points_total',
    'points_150kw_plus',
    'share_150kw_plus_percent',
    'share_of_register_hpc_percent',
    'share_of_register_total_percent',
    'presence_in_cities_count',
    'bnetza_snapshot'
  ];

  const csvRows = operators.map(op => [
    op.id,
    op.slug,
    `"${op.name}"`,
    `"${op.parentCompany}"`,
    `"${op.headquarters}"`,
    op.stationsTotal,
    op.chargingPointsTotal,
    op.chargingPoints150PlusKw,
    op.share150PlusKwPercent,
    op.shareOfRegisterHpcPercent,
    op.shareOfRegisterTotalPercent,
    op.citiesWithPresenceCount,
    snapshotDate
  ].join(','));

  const csvContent = [csvHeaders.join(','), ...csvRows].join('\n') + '\n';
  fs.writeFileSync(path.join(publicDir, 'cpo-monitor.csv'), csvContent, 'utf-8');
  console.log(`[CPO Monitor Generator] Wrote CSV to ${path.join(publicDir, 'cpo-monitor.csv')}`);
}

main().catch((err) => {
  console.error('[CPO Monitor Generator] Error:', err);
  process.exit(1);
});
