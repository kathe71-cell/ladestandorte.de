#!/usr/bin/env node
/**
 * scripts/data/aggregate-cities.mjs
 * Aggregates raw BNetzA snapshot CSVs for the 50 German cities in ladestandorte.de.
 *
 * Methodological Principles:
 * 1. Strictly power-based classification: upTo22Kw (<=22 kW), between22And150Kw (>22 kW and <150 kW), points150PlusKw (>=150 kW).
 *    No inference of AC vs DC from power alone!
 * 2. HPC Definition ladestandorte.de: "points150PlusKw" (Ladepunkte mit einer Nennleistung von mindestens 150 kW).
 *    In text/methodology clearly framed as: "Ladepunkte >=150 kW" without asserting unverified DC/connector status or legal norms.
 * 3. Exact source date semantics: retrievedAt, sourcePublishedAt, sourceDatasetDate (null), maxRecordTimestamp.
 * 4. Attribution: Bundesnetzagentur.de (CC BY 4.0).
 * 5. Completeness disclaimer.
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

async function main() {
  const latestPointerPath = path.join(ROOT_DIR, 'data/raw/bnetza/latest.json');
  if (!fs.existsSync(latestPointerPath)) {
    console.error('[Aggregate Cities] No latest.json found in data/raw/bnetza. Run download first!');
    process.exit(1);
  }

  const latestPointer = JSON.parse(fs.readFileSync(latestPointerPath, 'utf-8'));
  const snapshotDate = latestPointer.latestSnapshotDate;
  const snapshotDir = path.join(ROOT_DIR, latestPointer.path);
  const metadata = latestPointer.metadata;

  console.log(`[Aggregate Cities] Processing snapshot from ${snapshotDate} (${snapshotDir})...`);

  // 1. Load City Mappings
  const mappingsPath = path.join(ROOT_DIR, 'src/data/mappings/cities.json');
  const cityMappings = JSON.parse(fs.readFileSync(mappingsPath, 'utf-8'));
  console.log(`[Aggregate Cities] Loaded ${cityMappings.length} city definitions.`);

  const arsToCity = new Map();
  for (const c of cityMappings) {
    arsToCity.set(c.ars, c);
  }

  // 2. Stream Ladestationen CSV
  const ladestationPath = path.join(snapshotDir, 'bnetza_api_ladestation000.csv');
  console.log(`[Aggregate Cities] Reading ${ladestationPath}...`);
  const stationStream = fs.createReadStream(ladestationPath);
  const rlStation = readline.createInterface({ input: stationStream, crlfDelay: Infinity });

  let headerStation = null;
  const stationMap = new Map(); // stationId -> { citySlug, cpo }
  const cityStationCounts = new Map();
  const cityCpoCounts = new Map(); // citySlug -> Map<cpo, count>

  for (const c of cityMappings) {
    cityStationCounts.set(c.slug, 0);
    cityCpoCounts.set(c.slug, new Map());
  }

  let totalRawStations = 0;
  let maxStationTimestamp = '';

  for await (const line of rlStation) {
    if (!headerStation) {
      headerStation = line.split(';');
      continue;
    }
    totalRawStations++;
    const parts = line.split(';');
    const stId = parts[0]?.trim();
    const cpoRaw = parts[3]?.trim() || parts[1]?.trim() || 'Unbekannt';
    const ars = parts[12]?.trim();
    const rowDate = parts[parts.length - 1]?.trim();

    if (rowDate && rowDate > maxStationTimestamp) {
      maxStationTimestamp = rowDate;
    }

    const city = arsToCity.get(ars);
    if (city) {
      stationMap.set(stId, { citySlug: city.slug, cpo: cpoRaw });
      cityStationCounts.set(city.slug, cityStationCounts.get(city.slug) + 1);

      const cpos = cityCpoCounts.get(city.slug);
      cpos.set(cpoRaw, (cpos.get(cpoRaw) || 0) + 1);
    }
  }

  console.log(`[Aggregate Cities] Total raw stations: ${totalRawStations}. Mapped stations: ${stationMap.size}.`);
  console.log(`[Aggregate Cities] Max station record timestamp: ${maxStationTimestamp}`);

  // 3. Stream Ladepunkte CSV
  const ladepunktPath = path.join(snapshotDir, 'bnetza_api_ladepunkt000.csv');
  console.log(`[Aggregate Cities] Reading ${ladepunktPath}...`);
  const pointStream = fs.createReadStream(ladepunktPath);
  const rlPoint = readline.createInterface({ input: pointStream, crlfDelay: Infinity });

  let headerPoint = null;
  const cityMetrics = new Map();
  for (const c of cityMappings) {
    cityMetrics.set(c.slug, {
      ladepunkteGesamt: 0,
      points150PlusKw: 0, // >= 150 kW (HPC according to ladestandorte.de classification)
      pointsBetween22And150Kw: 0, // > 22 kW & < 150 kW
      pointsUpTo22Kw: 0, // <= 22 kW
      powerSumKw: 0
    });
  }

  let totalRawPoints = 0;
  let maxPointTimestamp = '';
  let mappedPointsCount = 0;

  for await (const line of rlPoint) {
    if (!headerPoint) {
      headerPoint = line.split(';');
      continue;
    }
    totalRawPoints++;
    const parts = line.split(';');
    const stId = parts[2]?.trim();
    const power = parseFloat(parts[4]) || 0;
    const rowDate = parts[parts.length - 1]?.trim();

    if (rowDate && rowDate > maxPointTimestamp) {
      maxPointTimestamp = rowDate;
    }

    const stInfo = stationMap.get(stId);
    if (!stInfo) continue;

    mappedPointsCount++;
    const m = cityMetrics.get(stInfo.citySlug);
    m.ladepunkteGesamt++;
    m.powerSumKw += power;

    if (power >= 150) {
      m.points150PlusKw++;
    } else if (power > 22) {
      m.pointsBetween22And150Kw++;
    } else {
      m.pointsUpTo22Kw++;
    }
  }

  console.log(`[Aggregate Cities] Total raw points: ${totalRawPoints}. Mapped points: ${mappedPointsCount}.`);
  console.log(`[Aggregate Cities] Max point record timestamp: ${maxPointTimestamp}`);

  // 4. Construct Generated Dataset
  const generatedCities = [];

  for (const c of cityMappings) {
    const m = cityMetrics.get(c.slug);
    const stationCount = cityStationCounts.get(c.slug);
    const avgKw = m.ladepunkteGesamt > 0 ? Number((m.powerSumKw / m.ladepunkteGesamt).toFixed(1)) : 0;

    // Sort top operators by stations
    const cpos = cityCpoCounts.get(c.slug);
    const topBetreiber = Array.from(cpos.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => `${name} (${count})`);

    const pointsPer1k = c.officialPopulation > 0
      ? Number(((m.ladepunkteGesamt / c.officialPopulation) * 1000).toFixed(2))
      : 0;

    const points150PlusPer1k = c.officialPopulation > 0
      ? Number(((m.points150PlusKw / c.officialPopulation) * 1000).toFixed(2))
      : 0;

    generatedCities.push({
      slug: c.slug,
      name: c.name,
      bundesland: c.bundesland,
      ags: c.ags,
      ars: c.ars,
      population: {
        value: c.officialPopulation,
        referenceDate: c.populationReferenceDate,
        source: 'Statistisches Bundesamt (Destatis) / GV-ISys',
        license: 'dl-de/by-2-0'
      },
      bnetza: {
        ladestationen: stationCount,
        ladepunkteGesamt: m.ladepunkteGesamt,
        // Neutral power-bracket classification (no unverified AC/DC inference)
        powerClasses: {
          upTo22Kw: m.pointsUpTo22Kw,
          between22And150Kw: m.pointsBetween22And150Kw,
          hpc150PlusKw: m.points150PlusKw
        },
        // Alias for compatibility with existing codebase
        hpcLadepunkte: m.points150PlusKw,
        avgKw: avgKw,
        topBetreiber: topBetreiber,
        pointsPer1000Pop: pointsPer1k,
        hpcPer1000Pop: points150PlusPer1k,
        // Precise Provenance Semantics
        provenance: {
          dataSource: metadata.dataSource,
          technicalDistributor: metadata.technicalDistributor,
          license: metadata.license,
          licenseUrl: metadata.licenseUrl,
          attribution: metadata.attributionRequired,
          retrievedAt: metadata.retrievedAt,
          sourcePublishedAt: metadata.files.ladestationen.sourcePublishedAt,
          sourceDatasetDate: null, // API does not publish an official dataset date
          maxRecordTimestamp: maxStationTimestamp,
          rawSnapshotSha256: metadata.files.ladestationen.sha256,
          completenessDisclaimer: 'Die Auswertung basiert auf den im verwendeten Register/API-Datenbestand veröffentlichten Ladeeinrichtungen. Der Datenbestand stellt keine zwingend vollständige Erfassung der gesamten öffentlich zugänglichen Ladeinfrastruktur dar.'
        }
      }
    });
  }

  // 5. Write generated JSON
  const generatedPath = path.join(ROOT_DIR, 'src/data/generated/cities.generated.json');
  fs.writeFileSync(generatedPath, JSON.stringify(generatedCities, null, 2), 'utf-8');
  console.log(`[Aggregate Cities] Successfully wrote ${generatedPath}`);

  // 6. Generate Difference Report against legacy CITIES_DATA
  const legacyContent = fs.readFileSync(path.join(ROOT_DIR, 'src/data/cities.ts'), 'utf-8');
  const legacyCities = [];
  const cityRegex = /slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*bundesland:\s*"([^"]+)",\s*einwohner:\s*([0-9]+),\s*ladepunkteGesamt:\s*([0-9]+),\s*hpcLadepunkte:\s*([0-9]+)/g;
  let match;
  while ((match = cityRegex.exec(legacyContent)) !== null) {
    legacyCities.push({
      slug: match[1],
      name: match[2],
      einwohner: parseInt(match[4], 10),
      ladepunkteGesamt: parseInt(match[5], 10),
      hpcLadepunkte: parseInt(match[6], 10)
    });
  }

  const legacyMap = new Map(legacyCities.map(c => [c.slug, c]));

  let totalLegacyPoints = 0;
  let totalLegacyHpc = 0;
  let totalNewPoints = 0;
  let totalNewHpc = 0;

  const comparisonRows = [];

  for (const gen of generatedCities) {
    const leg = legacyMap.get(gen.slug);
    const legPoints = leg ? leg.ladepunkteGesamt : 0;
    const legHpc = leg ? leg.hpcLadepunkte : 0;
    const legPop = leg ? leg.einwohner : 0;

    totalLegacyPoints += legPoints;
    totalLegacyHpc += legHpc;
    totalNewPoints += gen.bnetza.ladepunkteGesamt;
    totalNewHpc += gen.bnetza.hpcLadepunkte;

    const deltaPoints = gen.bnetza.ladepunkteGesamt - legPoints;
    const deltaHpc = gen.bnetza.hpcLadepunkte - legHpc;
    const deltaPointsPct = legPoints > 0 ? ((deltaPoints / legPoints) * 100).toFixed(1) : '+100';

    comparisonRows.push({
      city: gen.name,
      slug: gen.slug,
      legPop,
      newPop: gen.population.value,
      legPoints,
      newPoints: gen.bnetza.ladepunkteGesamt,
      deltaPoints,
      deltaPointsPct: deltaPoints >= 0 ? `+${deltaPointsPct}%` : `${deltaPointsPct}%`,
      legHpc,
      newHpc: gen.bnetza.hpcLadepunkte,
      deltaHpc
    });
  }

  // 7. Write Markdown Report
  const reportPath = path.join(ROOT_DIR, `reports/data/cities/${snapshotDate}.md`);
  let md = `# BNetzA City Data Verification & Difference Report

- **Snapshot-Abruf (retrievedAt):** ${metadata.retrievedAt}
- **Server HTTP Last-Modified (sourcePublishedAt):** \`${metadata.files.ladestationen.sourcePublishedAt}\`
- **Amtliches Dataset-Datum (sourceDatasetDate):** *null* (von der API nicht als eigenständiger Parameter bereitgestellt)
- **Maximaler Datensatz-Zeitstempel (maxRecordTimestamp):** \`${maxStationTimestamp}\`
- **Datenquelle:** ${metadata.dataSource}
- **Technischer Distributor:** ${metadata.technicalDistributor}
- **Rohdaten-Hash (Ladestationen):** \`${metadata.files.ladestationen.sha256}\`
- **Rohdaten-Hash (Ladepunkte):** \`${metadata.files.ladepunkte.sha256}\`
- **Lizenz:** ${metadata.license} (\`${metadata.licenseUrl}\`)
- **Namensnennung / Attribution:** \`${metadata.attributionRequired}\`
- **Einwohnerquelle:** Statistisches Bundesamt (Destatis) GV-ISys (Zensus 2022 Fortschreibung, 31.12.2023) (\`dl-de/by-2-0\`)
- **Vollständigkeitshinweis:** Die Auswertung basiert auf den im verwendeten Register/API-Datenbestand veröffentlichten Ladeeinrichtungen. Der Datenbestand stellt keine zwingend vollständige Erfassung der gesamten öffentlich zugänglichen Ladeinfrastruktur dar.

---

## 1. Aggregierte Gesamtergebnisse (50 Städte)

| Metrik | Altbestand (CITIES_DATA) | Neu berechnet (BNetzA Snapshot) | Absolute Differenz | Relative Differenz |
| :--- | :--- | :--- | :--- | :--- |
| **Ladepunkte Gesamt** | ${totalLegacyPoints.toLocaleString('de-DE')} | ${totalNewPoints.toLocaleString('de-DE')} | ${totalNewPoints >= totalLegacyPoints ? '+' : ''}${(totalNewPoints - totalLegacyPoints).toLocaleString('de-DE')} | ${(((totalNewPoints - totalLegacyPoints) / totalLegacyPoints) * 100).toFixed(1)}% |
| **Ladepunkte ≥150 kW (HPC ladestandorte.de)** | ${totalLegacyHpc.toLocaleString('de-DE')} | ${totalNewHpc.toLocaleString('de-DE')} | ${totalNewHpc >= totalLegacyHpc ? '+' : ''}${(totalNewHpc - totalLegacyHpc).toLocaleString('de-DE')} | ${(((totalNewHpc - totalLegacyHpc) / totalLegacyHpc) * 100).toFixed(1)}% |
| **Dokumentierte Ladestationen** | *Keine Angabe* | ${stationMap.size.toLocaleString('de-DE')} | - | - |

---

## 2. Detaillierter Städtevergleich (Alle 50 Städte)

| Stadt | Einwohner (Destatis) | Ladepunkte alt | Ladepunkte BNetzA | Delta LP | LP ≥150kW alt | LP ≥150kW BNetzA | Delta ≥150kW |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
`;

  for (const r of comparisonRows) {
    const deltaSign = r.deltaPoints >= 0 ? '+' : '';
    const hpcSign = r.deltaHpc >= 0 ? '+' : '';
    md += `| **${r.city}** | ${r.newPop.toLocaleString('de-DE')} | ${r.legPoints.toLocaleString('de-DE')} | ${r.newPoints.toLocaleString('de-DE')} | ${deltaSign}${r.deltaPoints} (${r.deltaPointsPct}) | ${r.legHpc} | ${r.newHpc} | ${hpcSign}${r.deltaHpc} |\n`;
  }

  md += `
---

## 3. Methodische Anmerkungen & Klassifikation

1. **Leistungsklassen statt technischer Stromart (Keine unzulässige AC/DC-Inferenz):**
   - Da im Ladepunkt-Rohdatensatz keine direkte Stromart (AC/DC) übergeben wird, unterteilt ladestandorte.de rein nach Nennleistungsklassen:
     - \`upTo22Kw\`: Ladepunkte mit Nennleistung $\\le 22\\text{ kW}$
     - \`between22And150Kw\`: Ladepunkte mit Nennleistung $> 22\\text{ kW}$ und $< 150\\text{ kW}$
     - \`hpc150PlusKw\`: Ladepunkte mit Nennleistung $\\ge 150\\text{ kW}$
   - Es wird ausdrücklich **nicht** behauptet, dass $\\le 22\\text{ kW}$ zwingend technisch AC oder $> 22\\text{ kW}$ zwingend technisch DC entspricht.

2. **Definition HPC auf ladestandorte.de:**
   - Als **HPC** werden auf ladestandorte.de redaktionell Ladepunkte mit einer Nennleistung von mindestens $150\\text{ kW}$ klassifiziert (\`points150PlusKw\`).
   - Die irreführende Bezeichnung „gesetzliche HPC-Schwelle“ wurde gestrichen.

3. **Zeitstempel- und Datumssemantik:**
   - \`retrievedAt\`: Tatsächlicher Download-Zeitstempel des Snapshots (${metadata.retrievedAt}).
   - \`sourcePublishedAt\`: Vom Server übermittelter HTTP Last-Modified-Header (\`${metadata.files.ladestationen.sourcePublishedAt}\`).
   - \`sourceDatasetDate\`: \`null\` (die API liefert kein offizielles Datensatzdatum).
   - \`maxRecordTimestamp\`: Maximaler im Datenbestand gefundener Datensatz-Zeitstempel (\`${maxStationTimestamp}\`).

4. **Geografische Zuordnung (ARS):**
   - Jede Ladestation ist eindeutig über ihren 12-stelligen ARS (Amtlicher Regionalschlüssel) der Kernstadt zugeordnet.
`;

  fs.writeFileSync(reportPath, md, 'utf-8');
  console.log(`[Aggregate Cities] Successfully wrote difference report to ${reportPath}`);
}

main().catch((err) => {
  console.error('[Aggregate Cities] Error during aggregation:', err);
  process.exit(1);
});
