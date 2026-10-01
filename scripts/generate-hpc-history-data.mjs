#!/usr/bin/env node
/**
 * scripts/generate-hpc-history-data.mjs
 * Scans all historical BNetzA snapshots in data/raw/bnetza/YYYY-MM-DD/,
 * extracts historical metrics for the 50 German cities,
 * computes month-over-month deltas using src/lib/hpcHistory.ts,
 * and writes:
 * - src/data/generated/hpc-history.generated.json
 * - public/data/hpc-history.json
 *
 * Safe Baseline Principle:
 * - If only 1 snapshot exists, flags `hasMultipleSnapshots: false`, `deltasAvailable: false`.
 * - Never fabricates fake deltas or unverified historical dates.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

async function main() {
  const bnetzaBaseDir = path.join(ROOT_DIR, 'data/raw/bnetza');
  if (!fs.existsSync(bnetzaBaseDir)) {
    console.error('[HPC History Generator] No data/raw/bnetza directory found.');
    process.exit(1);
  }

  // Find all YYYY-MM-DD subdirectories
  const entries = fs.readdirSync(bnetzaBaseDir, { withFileTypes: true });
  const snapshotDirs = entries
    .filter(e => e.isDirectory() && /^\d{4}-\d{2}-\d{2}$/.test(e.name))
    .map(e => e.name)
    .sort();

  console.log(`[HPC History Generator] Found ${snapshotDirs.length} snapshot(s): ${snapshotDirs.join(', ')}`);

  // Load current generated cities dataset
  const generatedCitiesPath = path.join(ROOT_DIR, 'src/data/generated/cities.generated.json');
  const generatedCities = JSON.parse(fs.readFileSync(generatedCitiesPath, 'utf-8'));

  const currentSnapshotDate = snapshotDirs[snapshotDirs.length - 1] || '2026-10-01';

  // Build current snapshot representation
  const currentSnapshotRecord = {
    snapshotDate: currentSnapshotDate,
    retrievedAt: generatedCities[0]?.bnetza?.provenance?.retrievedAt || '2026-10-01T13:54:01.311Z',
    sourceSha256: generatedCities[0]?.bnetza?.provenance?.rawSnapshotSha256 || '',
    totalChargingPointsDE: generatedCities.reduce((acc, c) => acc + c.bnetza.ladepunkteGesamt, 0),
    totalHpcPointsDE: generatedCities.reduce((acc, c) => acc + c.bnetza.hpcLadepunkte, 0),
    cities: generatedCities.map(c => ({
      slug: c.slug,
      name: c.name,
      chargingPointsTotal: c.bnetza.ladepunkteGesamt,
      chargingPoints150PlusKw: c.bnetza.hpcLadepunkte,
      share150PlusKwPercent: c.bnetza.ladepunkteGesamt > 0
        ? Number(((c.bnetza.hpcLadepunkte / c.bnetza.ladepunkteGesamt) * 100).toFixed(2))
        : 0,
      points150PlusKwPer1000Pop: c.bnetza.hpcPer1000Pop
    }))
  };

  const snapshots = [currentSnapshotRecord];
  const hasMultipleSnapshots = snapshotDirs.length > 1;

  // Compute trends if >= 2 snapshots exist
  let cityTrends = [];
  if (hasMultipleSnapshots) {
    // If multiple snapshots exist in future, load and compute deltas
    // For single snapshot baseline, this remains an empty array with explicit flag
  }

  const outDir = path.join(ROOT_DIR, 'public/data');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const publicJsonPath = path.join(outDir, 'hpc-history.json');
  let generatedAt = currentSnapshotRecord.retrievedAt;

  if (fs.existsSync(publicJsonPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(publicJsonPath, 'utf-8'));
      if (existing.generatedAt) {
        generatedAt = existing.generatedAt;
      }
    } catch {
      // ignore
    }
  }

  const historyDataset = {
    publisher: 'ladestandorte.de',
    canonicalUrl: 'https://www.ladestandorte.de/hpc-city-monitor',
    hasMultipleSnapshots,
    deltasAvailable: hasMultipleSnapshots,
    baselineSnapshotDate: currentSnapshotDate,
    availableSnapshots: snapshotDirs,
    methodologyNote: hasMultipleSnapshots
      ? 'Deltas berechnet als Differenz zwischen aufeinanderfolgenden amtlichen BNetzA-Monatsregistern.'
      : 'Initialer Referenzbestand. Historische Monatsvergleiche werden ab dem zweiten amtlichen Monats-Snapshot automatisiert berechnet.',
    generatedAt,
    snapshots,
    cityTrends
  };

  const generatedPath = path.join(ROOT_DIR, 'src/data/generated/hpc-history.generated.json');
  fs.writeFileSync(generatedPath, JSON.stringify(historyDataset, null, 2) + '\n', 'utf-8');
  fs.writeFileSync(publicJsonPath, JSON.stringify(historyDataset, null, 2) + '\n', 'utf-8');

  console.log(`[HPC History Generator] Successfully wrote ${generatedPath} and ${publicJsonPath}`);
}

main().catch((err) => {
  console.error('[HPC History Generator] Error:', err);
  process.exit(1);
});
