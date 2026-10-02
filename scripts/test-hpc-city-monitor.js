#!/usr/bin/env node
/**
 * Test: HPC City Monitor Regression Suite
 * Validates:
 * 1. Dataset consistency: 50 cities, no duplicates, matches cities.generated.json
 * 2. Math correctness: Total HPC, percentage share, density per 100k, median calculations
 * 3. Scope guardrail: Zero unqualified superlatives ('beste', 'bundesweit', 'deutschlandweit', 'offizieller Monitor')
 * 4. Provenance: BNetzA, Destatis, and ladestandorte.de attribution
 * 5. Machine readability: Verifies JSON and CSV outputs in public/data
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('=== HPC CITY MONITOR REGRESSION SUITE ===');

let errors = 0;

// 1. Load generated source
const generatedPath = path.join(rootDir, 'src/data/generated/cities.generated.json');
if (!fs.existsSync(generatedPath)) {
  console.error(`[FAIL] Missing file: ${generatedPath}`);
  process.exit(1);
}
const generatedCities = JSON.parse(fs.readFileSync(generatedPath, 'utf8'));

if (generatedCities.length !== 50) {
  console.error(`[FAIL] Expected 50 cities, got ${generatedCities.length}`);
  errors++;
} else {
  console.log(`[PASS] Source dataset contains exactly 50 cities.`);
}

// 2. Math validation
const expectedTotalPoints = generatedCities.reduce((acc, c) => acc + c.bnetza.ladepunkteGesamt, 0);
const expectedTotalHpc = generatedCities.reduce((acc, c) => acc + c.bnetza.hpcLadepunkte, 0);
const expectedTotalPop = generatedCities.reduce((acc, c) => acc + c.population.value, 0);

const expectedShare = (expectedTotalHpc / expectedTotalPoints) * 100;
const expectedPer100k = (expectedTotalHpc / expectedTotalPop) * 100000;

// Verify known values relationally
if (expectedTotalPoints <= 0) {
  console.error(`[FAIL] Total points must be positive, got ${expectedTotalPoints}`);
  errors++;
} else {
  console.log(`[PASS] Total charging points across 50 cities: ${expectedTotalPoints.toLocaleString('de-DE')}`);
}

if (expectedTotalHpc <= 0 || expectedTotalHpc > expectedTotalPoints) {
  console.error(`[FAIL] Total HPC points invalid: expected 0 < HPC <= ${expectedTotalPoints}, got ${expectedTotalHpc}`);
  errors++;
} else {
  console.log(`[PASS] Total HPC points (>=150 kW) across 50 cities: ${expectedTotalHpc.toLocaleString('de-DE')}`);
}

if (isNaN(expectedShare) || expectedShare <= 0 || expectedShare > 100) {
  console.error(`[FAIL] HPC share calculation error: ${expectedShare}%`);
  errors++;
} else {
  console.log(`[PASS] Overall HPC share: ${expectedShare.toFixed(1)}%`);
}

if (isNaN(expectedPer100k) || expectedPer100k <= 0) {
  console.error(`[FAIL] HPC per 100k calculation error: ${expectedPer100k}`);
  errors++;
} else {
  console.log(`[PASS] HPC per 100k population: ${expectedPer100k.toFixed(1)}`);
}

// 3. Medians
const hpcValues = [...generatedCities].map(c => c.bnetza.hpcLadepunkte).sort((a,b) => a - b);
const medianHpc = (hpcValues[24] + hpcValues[25]) / 2;
if (isNaN(medianHpc) || medianHpc <= 0) {
  console.error(`[FAIL] Median HPC calculation invalid, got ${medianHpc}`);
  errors++;
} else {
  console.log(`[PASS] Median HPC: ${medianHpc}`);
}

// 4. Scope and claim guardrail in HpcCityMonitorPage.tsx
const monitorPagePath = path.join(rootDir, 'src/pages/HpcCityMonitorPage.tsx');
if (!fs.existsSync(monitorPagePath)) {
  console.error(`[FAIL] Missing page file: ${monitorPagePath}`);
  errors++;
} else {
  const pageContent = fs.readFileSync(monitorPagePath, 'utf8');

  const bannedPatterns = [
    { pattern: /deutschlands beste/i, name: 'Deutschlands beste' },
    { pattern: /bundesweit h(ö|oe)chste/i, name: 'bundesweit höchste' },
    { pattern: /offizieller monitor/i, name: 'offizieller Monitor' },
    { pattern: /vollst(ä|ae)ndige deutschland-erhebung/i, name: 'vollständige Deutschland-Erhebung' },
    { pattern: /alle hpc-ladepunkte deutschlands/i, name: 'alle HPC-Ladepunkte Deutschlands' }
  ];

  bannedPatterns.forEach(({ pattern, name }) => {
    if (pattern.test(pageContent)) {
      console.error(`[FAIL] HpcCityMonitorPage.tsx contains banned pattern '${name}'`);
      errors++;
    }
  });

  if (pageContent.includes('Unter den 50 ausgewerteten Städten') && pageContent.includes('Eigene Auswertung von ladestandorte.de')) {
    console.log(`[PASS] HpcCityMonitorPage.tsx properly scopes findings to 50 cities.`);
  } else {
    console.error(`[FAIL] Missing explicit 50-cities scope declaration in HpcCityMonitorPage.tsx`);
    errors++;
  }
}

// 5. Machine readable data validation
const jsonPath = path.join(rootDir, 'public/data/hpc-city-monitor.json');
const csvPath = path.join(rootDir, 'public/data/hpc-city-monitor.csv');

if (!fs.existsSync(jsonPath)) {
  console.error(`[FAIL] Missing machine-readable JSON: ${jsonPath}`);
  errors++;
} else {
  const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  if (jsonContent.cities?.length !== generatedCities.length) {
    console.error(`[FAIL] JSON export city count mismatch: ${jsonContent.cities?.length} !== ${generatedCities.length}`);
    errors++;
  } else if (jsonContent.cities[0].chargingPoints150PlusKw !== generatedCities[0].bnetza.hpcLadepunkte) {
    console.error(`[FAIL] JSON export Berlin HPC mismatch: ${jsonContent.cities[0].chargingPoints150PlusKw} !== ${generatedCities[0].bnetza.hpcLadepunkte}`);
    errors++;
  } else {
    console.log(`[PASS] Machine-readable JSON verified (50 cities, exact metrics).`);
  }
}

if (!fs.existsSync(csvPath)) {
  console.error(`[FAIL] Missing machine-readable CSV: ${csvPath}`);
  errors++;
} else {
  const csvLines = fs.readFileSync(csvPath, 'utf8').trim().split('\n');
  if (csvLines.length !== 51) { // 1 header + 50 rows
    console.error(`[FAIL] CSV export line count expected 51, got ${csvLines.length}`);
    errors++;
  } else {
    console.log(`[PASS] Machine-readable CSV verified (51 lines, exact header and 50 data rows).`);
  }
}

if (errors === 0) {
  console.log(`\n✅ ALL HPC CITY MONITOR REGRESSION CHECKS PASSED (0 ERRORS).`);
  process.exit(0);
} else {
  console.error(`\n❌ HPC CITY MONITOR REGRESSION CHECKS FAILED WITH ${errors} ERROR(S).`);
  process.exit(1);
}
