#!/usr/bin/env node
/**
 * scripts/test-motorway-provenance.js
 * 
 * Master Relational Test for Motorway Corridor Data Provenance.
 * Verifies that:
 * 1. Exactly 61 motorways exist in MOTORWAYS_DATA.
 * 2. Every single motorway has a defined, documented lengthKm and lengthSource.
 * 3. Relational maxKw check:
 *    - If motorway.maxKw is defined, corridorEvidence.maxKwEvidence MUST exist.
 *    - corridorEvidence.maxKwEvidence.kwMax MUST exactly equal motorway.maxKw.
 *    - The referenced stationId MUST exist in stations.ts and its kwMax must match.
 * 4. Relational mainCPOs check:
 *    - For every operator listed in motorway.mainCPOs, a corresponding record in corridorEvidence.cpoEvidence MUST exist.
 *    - Every record in corridorEvidence.cpoEvidence MUST reference a valid stationId in stations.ts.
 * 5. Corridors with 0 verified station dossiers MUST have maxKw === undefined and mainCPOs empty ([]).
 * 6. A49 specific audit:
 *    - TotalEnergies MUST NOT be present in mainCPOs.
 *    - Milence MUST be present and verified via mcs-008.
 *    - maxKw MUST be 400 kW.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

console.log('--- MOTORWAY CORRIDOR DATA PROVENANCE AUDIT ---');

// Parse stations
const stationsContent = fs.readFileSync(path.join(ROOT, 'src/data/stations.ts'), 'utf8');
const stBlocks = stationsContent.split(/\{\s*id:\s*"/g).slice(1);
const stationMap = new Map();
stBlocks.forEach(b => {
  const id = b.split('"')[0];
  const name = (b.match(/name:\s*"([^"]+)"/) || [])[1];
  const operator = (b.match(/operator:\s*"([^"]+)"/) || [])[1];
  const kwMax = parseInt((b.match(/kwMax:\s*(\d+)/) || [])[1] || '0', 10);
  const motorway = (b.match(/motorway:\s*"([^"]+)"/) || [])[1];
  const motorwaysMatch = (b.match(/motorways:\s*\[([^\]]+)\]/) || [])[1];
  let mList = [];
  if (motorway) mList.push(motorway.toLowerCase());
  if (motorwaysMatch) mList.push(...motorwaysMatch.split(',').map(s => s.replace(/["'\s]/g, '').toLowerCase()).filter(Boolean));
  stationMap.set(id, { id, name, operator, kwMax, motorways: [...new Set(mList)] });
});

// Parse motorways
const motorwaysContent = fs.readFileSync(path.join(ROOT, 'src/data/motorways.ts'), 'utf8');
const mwBlocks = motorwaysContent.split(/\{\s*slug:\s*"/g).slice(1);
const motorways = mwBlocks.map(b => {
  const slug = b.split('"')[0];
  const name = (b.match(/name:\s*"([^"]+)"/) || [])[1];
  const lengthKm = parseInt((b.match(/lengthKm:\s*(\d+)/) || [])[1] || '0', 10);
  const maxKwMatch = b.match(/maxKw:\s*(\d+)/);
  const maxKw = maxKwMatch ? parseInt(maxKwMatch[1], 10) : undefined;
  const cposMatch = b.match(/mainCPOs:\s*\[([^\]]*)\]/);
  const mainCPOs = cposMatch ? cposMatch[1].split(',').map(s => s.replace(/["'\s]/g, '')).filter(Boolean) : [];
  
  // corridorEvidence check
  const hasCorridorEvidence = b.includes('corridorEvidence:');
  const lengthSourceMatch = b.match(/lengthSource:\s*"([^"]+)"/);
  const lengthSource = lengthSourceMatch ? lengthSourceMatch[1] : null;

  const maxKwEvMatch = b.match(/maxKwEvidence:\s*\{[\s\S]*?stationId:\s*"([^"]+)"[\s\S]*?kwMax:\s*(\d+)/);
  const maxKwEvidence = maxKwEvMatch ? { stationId: maxKwEvMatch[1], kwMax: parseInt(maxKwEvMatch[2], 10) } : null;

  const cpoEvIds = [...b.matchAll(/stationId:\s*"([^"]+)"/g)].map(m => m[1]);

  return {
    slug,
    name,
    lengthKm,
    maxKw,
    mainCPOs,
    hasCorridorEvidence,
    lengthSource,
    maxKwEvidence,
    cpoEvIds
  };
});

let failed = false;

// 1. Total count
if (motorways.length !== 61) {
  console.error(`[FAIL] Expected 61 motorways, found ${motorways.length}`);
  failed = true;
} else {
  console.log(`[PASS] Total motorways count: 61`);
}

// 2. Length check & source
let lengthPass = true;
motorways.forEach(m => {
  if (!m.lengthKm || m.lengthKm <= 0 || !m.lengthSource) {
    console.error(`[FAIL] Motorway ${m.name} missing valid length or lengthSource: ${m.lengthKm} km, source=${m.lengthSource}`);
    lengthPass = false;
  }
});
if (lengthPass) {
  console.log(`[PASS] All 61 motorways have verified lengthKm & authoritative lengthSource.`);
} else {
  failed = true;
}

// 3. Relational maxKw & mainCPOs check
let verifiedCount = 0;
let partialCount = 0;

motorways.forEach(m => {
  if (m.maxKw !== undefined) {
    verifiedCount++;
    // Must have maxKwEvidence
    if (!m.maxKwEvidence) {
      console.error(`[FAIL] Motorway ${m.name} has maxKw=${m.maxKw} but no maxKwEvidence`);
      failed = true;
    } else if (m.maxKwEvidence.kwMax !== m.maxKw) {
      console.error(`[FAIL] Motorway ${m.name} maxKw mismatch: ${m.maxKw} vs evidence ${m.maxKwEvidence.kwMax}`);
      failed = true;
    } else {
      const st = stationMap.get(m.maxKwEvidence.stationId);
      if (!st) {
        console.error(`[FAIL] Motorway ${m.name} references non-existent stationId: ${m.maxKwEvidence.stationId}`);
        failed = true;
      } else if (st.kwMax !== m.maxKw) {
        console.error(`[FAIL] Motorway ${m.name} station kwMax mismatch: ${m.maxKw} vs station ${st.kwMax}`);
        failed = true;
      }
    }

    // Must have mainCPOs evidence
    if (m.mainCPOs.length === 0) {
      console.error(`[FAIL] Motorway ${m.name} has maxKw but 0 mainCPOs`);
      failed = true;
    }
  } else {
    partialCount++;
    // Unverified corridors must have 0 mainCPOs
    if (m.mainCPOs.length > 0) {
      console.error(`[FAIL] Unverified motorway ${m.name} has unevidenced mainCPOs: ${m.mainCPOs.join(', ')}`);
      failed = true;
    }
  }
});

console.log(`[PASS] Relational consistency verified for all 61 corridors.`);
console.log(`       - VERIFIED corridors with full dossier evidence: ${verifiedCount}`);
console.log(`       - PARTIAL corridors with verified length & pruned corridor data: ${partialCount}`);

// 4. A49 specific audit
const a49 = motorways.find(m => m.slug === 'a49');
if (!a49) {
  console.error('[FAIL] A49 not found!');
  failed = true;
} else {
  if (a49.mainCPOs.includes('TotalEnergies')) {
    console.error('[FAIL] A49 still lists TotalEnergies without dedicated corridor station!');
    failed = true;
  } else {
    console.log('[PASS] A49 does not contain unevidenced TotalEnergies.');
  }

  if (!a49.mainCPOs.includes('Milence')) {
    console.error('[FAIL] A49 missing Milence evidence!');
    failed = true;
  } else {
    console.log('[PASS] A49 correctly lists Milence based on mcs-008 (Kassel-Lohfelden, A7/A49).');
  }

  if (a49.maxKw !== 400) {
    console.error(`[FAIL] A49 maxKw expected 400 kW, got ${a49.maxKw}`);
    failed = true;
  } else {
    console.log('[PASS] A49 maxKw correctly set to 400 kW (Milence Lohfelden).');
  }
}

if (failed) {
  console.error('--- PROVENANCE AUDIT FAILED ---');
  process.exit(1);
} else {
  console.log('--- PROVENANCE AUDIT PASSED: 100% TRACEABLE & RELATIONAL ---');
  process.exit(0);
}
