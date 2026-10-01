#!/usr/bin/env node
/**
 * Script to generate machine-readable endpoints for HPC City Monitor:
 * - public/data/hpc-city-monitor.json
 * - public/data/hpc-city-monitor.csv
 *
 * Runs as part of build pipeline or data pipeline to guarantee 100% data sync.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const generatedCitiesPath = path.join(rootDir, 'src/data/generated/cities.generated.json');
const generatedCities = JSON.parse(fs.readFileSync(generatedCitiesPath, 'utf8'));

const outDir = path.join(rootDir, 'public/data');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const bnetzaSnapshot = generatedCities[0]?.bnetza?.provenance?.retrievedAt || '2026-10-01';
const destatisDate = generatedCities[0]?.population?.referenceDate || '2024-12-31';

  const existingJsonPath = path.join(outDir, 'hpc-city-monitor.json');
  let generatedAt = bnetzaSnapshot;
  if (fs.existsSync(existingJsonPath)) {
    try {
      const existingData = JSON.parse(fs.readFileSync(existingJsonPath, 'utf8'));
      if (existingData.generatedAt) {
        generatedAt = existingData.generatedAt;
      }
    } catch {
      // ignore
    }
  }

  const citiesPayload = generatedCities.map((c) => {
    const total = c.bnetza.ladepunkteGesamt;
    const hpc = c.bnetza.hpcLadepunkte;
    const pop = c.population.value;
    return {
      slug: c.slug,
      name: c.name,
      bundesland: c.bundesland,
      population: pop,
      chargingPointsTotal: total,
      chargingPoints150PlusKw: hpc,
      share150PlusKwPercent: total > 0 ? Number(((hpc / total) * 100).toFixed(2)) : 0,
      points150PlusKwPer1000Pop: pop > 0 ? Number(((hpc / pop) * 1000).toFixed(2)) : 0,
      chargingPointsPer1000Pop: pop > 0 ? Number(((total / pop) * 1000).toFixed(2)) : 0
    };
  });

  // Check if content has changed compared to existing file (excluding generatedAt)
  if (fs.existsSync(existingJsonPath)) {
    try {
      const existingData = JSON.parse(fs.readFileSync(existingJsonPath, 'utf8'));
      const existingCities = JSON.stringify(existingData.cities);
      const newCities = JSON.stringify(citiesPayload);
      if (existingCities !== newCities) {
        generatedAt = new Date().toISOString();
      }
    } catch {
      generatedAt = new Date().toISOString();
    }
  }

  const monitorData = {
    name: 'HPC City Monitor',
    publisher: 'ladestandorte.de',
    canonicalUrl: 'https://www.ladestandorte.de/hpc-city-monitor',
    scope: {
      country: 'DE',
      citiesCount: generatedCities.length
    },
    definition: {
      hpcClass: 'Ladepunkte mit einer dokumentierten Nennleistung von >=150 kW',
      methodologyUrl: 'https://www.ladestandorte.de/methodik'
    },
    sources: {
      chargingInfrastructure: {
        provider: 'Bundesnetzagentur (Ladesäulenregister)',
        retrievedAt: bnetzaSnapshot,
        license: 'CC BY 4.0',
        attribution: 'Bundesnetzagentur.de'
      },
      population: {
        provider: 'Statistisches Bundesamt (Destatis)',
        referenceDate: destatisDate,
        license: 'dl-de/by-2-0'
      }
    },
    generatedAt,
    cities: citiesPayload
  };

  fs.writeFileSync(path.join(outDir, 'hpc-city-monitor.json'), JSON.stringify(monitorData, null, 2) + '\n', 'utf8');

const csvHeaders = [
  'city',
  'slug',
  'state',
  'population',
  'charging_points_total',
  'points_150kw_plus',
  'share_150kw_plus_percent',
  'points_150kw_plus_per_1000_population',
  'charging_points_per_1000_population',
  'bnetza_snapshot',
  'population_reference_date'
];

const csvRows = monitorData.cities.map((c) => [
  `"${c.name}"`,
  c.slug,
  `"${c.bundesland}"`,
  c.population,
  c.chargingPointsTotal,
  c.chargingPoints150PlusKw,
  c.share150PlusKwPercent,
  c.points150PlusKwPer1000Pop,
  c.chargingPointsPer1000Pop,
  '2026-10-01',
  '2024-12-31'
].join(','));

const csvContent = [csvHeaders.join(','), ...csvRows].join('\n') + '\n';
fs.writeFileSync(path.join(outDir, 'hpc-city-monitor.csv'), csvContent, 'utf8');

console.log('Generated public/data/hpc-city-monitor.json and public/data/hpc-city-monitor.csv successfully.');
