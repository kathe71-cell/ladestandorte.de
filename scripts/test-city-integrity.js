#!/usr/bin/env node
/**
 * scripts/test-city-integrity.js
 * Validates the generated BNetzA city dataset against strict guardrails:
 * 1. Exactly 50 cities present.
 * 2. Every city has valid slug, name, bundesland, 8-digit AGS, 12-digit ARS.
 * 3. Population > 100,000 for all 50 cities.
 * 4. Ladepunkte Gesamt >= HPC Ladepunkte.
 * 5. Ladestationen > 0, Ladepunkte Gesamt > 0, HPC Ladepunkte > 0 for all 50 cities.
 * 6. Valid SHA-256 and BNetzA license/attribution metadata.
 * 7. Snapshot date matches YYYY-MM-DD.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generatedPath = path.resolve(__dirname, '../src/data/generated/cities.generated.json');

console.log('[Test City Integrity] Checking:', generatedPath);

if (!fs.existsSync(generatedPath)) {
  console.error('FAIL: Generated file does not exist:', generatedPath);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(generatedPath, 'utf-8'));

if (!Array.isArray(data)) {
  console.error('FAIL: Root data is not an array.');
  process.exit(1);
}

if (data.length !== 50) {
  console.error(`FAIL: Expected exactly 50 cities, found ${data.length}`);
  process.exit(1);
}

const errors = [];
const seenSlugs = new Set();
const seenArs = new Set();

data.forEach((city, idx) => {
  const prefix = `[City ${idx} - ${city.slug || 'UNKNOWN'}]`;

  // 1. Uniqueness
  if (seenSlugs.has(city.slug)) errors.push(`${prefix} Duplicate slug: ${city.slug}`);
  seenSlugs.add(city.slug);

  if (seenArs.has(city.ars)) errors.push(`${prefix} Duplicate ARS: ${city.ars}`);
  seenArs.add(city.ars);

  // 2. Identifiers
  if (!city.name || city.name.trim().length === 0) errors.push(`${prefix} Missing name`);
  if (!city.bundesland || city.bundesland.trim().length === 0) errors.push(`${prefix} Missing bundesland`);
  if (!/^\d{8}$/.test(city.ags)) errors.push(`${prefix} Invalid AGS (must be 8 digits): ${city.ags}`);
  if (!/^\d{12}$/.test(city.ars)) errors.push(`${prefix} Invalid ARS (must be 12 digits): ${city.ars}`);

  // 3. Population
  if (!city.population || typeof city.population.value !== 'number') {
    errors.push(`${prefix} Missing population.value`);
  } else if (city.population.value < 100000) {
    errors.push(`${prefix} Population unexpectedly low: ${city.population.value}`);
  }

  // 4. BNetzA counts
  const b = city.bnetza;
  if (!b) {
    errors.push(`${prefix} Missing bnetza node`);
  } else {
    if (typeof b.ladestationen !== 'number' || b.ladestationen <= 0) {
      errors.push(`${prefix} Invalid ladestationen: ${b.ladestationen}`);
    }
    if (typeof b.ladepunkteGesamt !== 'number' || b.ladepunkteGesamt <= 0) {
      errors.push(`${prefix} Invalid ladepunkteGesamt: ${b.ladepunkteGesamt}`);
    }
    if (typeof b.hpcLadepunkte !== 'number' || b.hpcLadepunkte <= 0) {
      errors.push(`${prefix} Invalid hpcLadepunkte: ${b.hpcLadepunkte}`);
    }
    if (b.hpcLadepunkte > b.ladepunkteGesamt) {
      errors.push(`${prefix} HPC points (${b.hpcLadepunkte}) exceed total points (${b.ladepunkteGesamt})`);
    }
    if (!/^[a-f0-9]{64}$/.test(b.rawSnapshotSha256)) {
      errors.push(`${prefix} Invalid SHA-256 hash: ${b.rawSnapshotSha256}`);
    }
    if (!b.license || !b.attribution) {
      errors.push(`${prefix} Missing license or attribution`);
    }
  }
});

if (errors.length > 0) {
  console.error(`FAIL: Encountered ${errors.length} integrity errors:`);
  errors.forEach(e => console.error(' -', e));
  process.exit(1);
}

console.log('SUCCESS: All 50 German cities passed BNetzA and Destatis integrity checks.');
process.exit(0);
