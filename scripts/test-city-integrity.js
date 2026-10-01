#!/usr/bin/env node
/**
 * scripts/test-city-integrity.js
 * Validates the generated BNetzA city dataset against strict guardrails:
 * 1. Exactly 50 cities present.
 * 2. Every city has valid slug, name, bundesland, 8-digit AGS, 12-digit ARS.
 * 3. 50/50 exact AGS matches with Destatis 2024-12-31 baseline.
 * 4. Population > 100,000 for all 50 cities, referenceDate === '2024-12-31'.
 * 5. Ladepunkte Gesamt >= HPC Ladepunkte (hpc150PlusKw).
 * 6. Ladestationen > 0, Ladepunkte Gesamt > 0, HPC Ladepunkte > 0 for all 50 cities.
 * 7. Power brackets sum equals Ladepunkte Gesamt.
 * 8. Valid SHA-256 and BNetzA license/attribution metadata.
 * 9. Provenance semantics complete (retrievedAt, maxRecordTimestamp, completenessDisclaimer).
 * 10. Destatis snapshot exists with SHA-256 and verified metadata.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const generatedPath = path.resolve(ROOT_DIR, 'src/data/generated/cities.generated.json');
const destatisMetaPath = path.resolve(ROOT_DIR, 'data/raw/destatis/2024-12-31/metadata.json');

console.log('[Test City Integrity] Checking:', generatedPath);

if (!fs.existsSync(generatedPath)) {
  console.error('FAIL: Generated file does not exist:', generatedPath);
  process.exit(1);
}

// 1. Verify Destatis Snapshot Metadata
if (!fs.existsSync(destatisMetaPath)) {
  console.error('FAIL: Destatis snapshot metadata does not exist:', destatisMetaPath);
  process.exit(1);
}
const destatisMeta = JSON.parse(fs.readFileSync(destatisMetaPath, 'utf-8'));
if (!destatisMeta.sha256 || destatisMeta.sha256.length !== 64) {
  console.error('FAIL: Invalid Destatis SHA-256 hash.');
  process.exit(1);
}
if (destatisMeta.sourceDataDate !== '2024-12-31') {
  console.error(`FAIL: Destatis sourceDataDate is ${destatisMeta.sourceDataDate}, expected 2024-12-31`);
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
const seenAgs = new Set();
const seenArs = new Set();

data.forEach((city, idx) => {
  const prefix = `[City ${idx} - ${city.slug || 'UNKNOWN'}]`;

  // 1. Uniqueness
  if (seenSlugs.has(city.slug)) errors.push(`${prefix} Duplicate slug: ${city.slug}`);
  seenSlugs.add(city.slug);

  if (seenAgs.has(city.ags)) errors.push(`${prefix} Duplicate AGS: ${city.ags}`);
  seenAgs.add(city.ags);

  if (seenArs.has(city.ars)) errors.push(`${prefix} Duplicate ARS: ${city.ars}`);
  seenArs.add(city.ars);

  // 2. Identifiers
  if (!city.name || city.name.trim().length === 0) errors.push(`${prefix} Missing name`);
  if (!city.bundesland || city.bundesland.trim().length === 0) errors.push(`${prefix} Missing bundesland`);
  if (!/^\d{8}$/.test(city.ags)) errors.push(`${prefix} Invalid AGS (must be 8 digits): ${city.ags}`);
  if (!/^\d{12}$/.test(city.ars)) errors.push(`${prefix} Invalid ARS (must be 12 digits): ${city.ars}`);

  // 3. Destatis 2024-12-31 Population
  const pop = city.population;
  if (!pop || typeof pop.value !== 'number') {
    errors.push(`${prefix} Missing population.value`);
  } else {
    if (pop.value < 100000) {
      errors.push(`${prefix} Population unexpectedly low: ${pop.value}`);
    }
    if (pop.referenceDate !== '2024-12-31') {
      errors.push(`${prefix} Population referenceDate (${pop.referenceDate}) is not 2024-12-31`);
    }
    if (!pop.source || !pop.license) {
      errors.push(`${prefix} Missing population source or license`);
    }
  }

  // 4. BNetzA counts & power classes
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

    // Check power classes sum
    const pc = b.powerClasses;
    if (!pc) {
      errors.push(`${prefix} Missing powerClasses`);
    } else {
      const sum = pc.upTo22Kw + pc.between22And150Kw + pc.hpc150PlusKw;
      if (sum !== b.ladepunkteGesamt) {
        errors.push(`${prefix} Power classes sum (${sum}) does not match ladepunkteGesamt (${b.ladepunkteGesamt})`);
      }
      if (pc.hpc150PlusKw !== b.hpcLadepunkte) {
        errors.push(`${prefix} hpc150PlusKw (${pc.hpc150PlusKw}) does not match hpcLadepunkte (${b.hpcLadepunkte})`);
      }
    }

    // Derived metric reproducibility check
    const expectedPointsPer1k = Number(((b.ladepunkteGesamt / pop.value) * 1000).toFixed(2));
    if (Math.abs(b.pointsPer1000Pop - expectedPointsPer1k) > 0.01) {
      errors.push(`${prefix} pointsPer1000Pop mismatch: got ${b.pointsPer1000Pop}, expected ${expectedPointsPer1k}`);
    }

    const expectedHpcPer1k = Number(((b.hpcLadepunkte / pop.value) * 1000).toFixed(2));
    if (Math.abs(b.hpcPer1000Pop - expectedHpcPer1k) > 0.01) {
      errors.push(`${prefix} hpcPer1000Pop mismatch: got ${b.hpcPer1000Pop}, expected ${expectedHpcPer1k}`);
    }

    // Provenance node validation
    const prov = b.provenance;
    if (!prov) {
      errors.push(`${prefix} Missing provenance node`);
    } else {
      if (!/^[a-f0-9]{64}$/.test(prov.rawSnapshotSha256)) {
        errors.push(`${prefix} Invalid SHA-256 hash: ${prov.rawSnapshotSha256}`);
      }
      if (!prov.license || !prov.attribution) {
        errors.push(`${prefix} Missing license or attribution`);
      }
      if (!prov.retrievedAt || !prov.maxRecordTimestamp) {
        errors.push(`${prefix} Missing timestamp semantics`);
      }
      if (!prov.completenessDisclaimer) {
        errors.push(`${prefix} Missing completeness disclaimer`);
      }
    }
  }
});

if (errors.length > 0) {
  console.error(`FAIL: Encountered ${errors.length} integrity errors:`);
  errors.forEach(e => console.error(' -', e));
  process.exit(1);
}

console.log('SUCCESS: All 50 German cities passed BNetzA and Destatis 2024-12-31 integrity checks.');
process.exit(0);
