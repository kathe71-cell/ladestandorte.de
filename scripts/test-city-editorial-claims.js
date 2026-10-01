#!/usr/bin/env node
/**
 * Test: City Editorial Claim Integrity Guardrail
 * Verifies that all 50 city editorial descriptions and city page components
 * conform to strict factual, snapshot-aligned, and superlative-free rules.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('=== CITY EDITORIAL CLAIM INTEGRITY GUARDRAIL ===');

// 1. Load data
const editorialPath = path.join(rootDir, 'src/data/cities-editorial.json');
const generatedPath = path.join(rootDir, 'src/data/generated/cities.generated.json');
const cityPagePath = path.join(rootDir, 'src/pages/CityPage.tsx');

if (!fs.existsSync(editorialPath)) {
  console.error(`[FAIL] Missing file: ${editorialPath}`);
  process.exit(1);
}
if (!fs.existsSync(generatedPath)) {
  console.error(`[FAIL] Missing file: ${generatedPath}`);
  process.exit(1);
}

const editorialCities = JSON.parse(fs.readFileSync(editorialPath, 'utf8'));
const generatedCities = JSON.parse(fs.readFileSync(generatedPath, 'utf8'));
const cityPageContent = fs.readFileSync(cityPagePath, 'utf8');

let errors = 0;

// 2. Verify all 50 cities are present
if (editorialCities.length !== 50) {
  console.error(`[FAIL] Expected 50 cities in cities-editorial.json, found: ${editorialCities.length}`);
  errors++;
} else {
  console.log(`[PASS] Exactly 50 cities present in editorial dataset.`);
}

// 3. Prohibited subjective / superlative / absolutist patterns in editorial descriptions
const bannedPatterns = [
  { pattern: /\bdichteste\b/i, name: 'dichteste' },
  { pattern: /gr(ö|oe)ßte(s)? ladenetz/i, name: 'größte(s) Ladenetz' },
  { pattern: /\bf(ü|ue)hrend(e[rsn]?)?\b/i, name: 'führend' },
  { pattern: /\bspitzenreiter\b/i, name: 'Spitzenreiter' },
  { pattern: /\bmarktfl?ührer\b/i, name: 'Marktführer' },
  { pattern: /\bnummer 1\b/i, name: 'Nummer 1' },
  { pattern: /\b(ü|ue)berdurchschnittlich\b/i, name: 'überdurchschnittlich' },
  { pattern: /\bunterdurchschnittlich\b/i, name: 'unterdurchschnittlich' },
  { pattern: /\bvollst(ä|ae)ndig\b/i, name: 'vollständig' },
  { pattern: /\balle ladestationen\b/i, name: 'alle Ladestationen' },
  { pattern: /\bhervorragend\b/i, name: 'hervorragend' },
  { pattern: /\bvorzeige\b/i, name: 'Vorzeige' },
  { pattern: /\bpionier(stadt)?\b/i, name: 'Pionier' },
  { pattern: /\bexzellent\b/i, name: 'exzellent' },
  { pattern: /\bextrem\b/i, name: 'extrem' },
  { pattern: /\bherausragend\b/i, name: 'herausragend' },
  { pattern: /\bvorbildlich\b/i, name: 'vorbildlich' },
  { pattern: /\bmega\b/i, name: 'mega' },
  { pattern: /\binnovativst\b/i, name: 'innovativst' },
  { pattern: /\bhochmodern\b/i, name: 'hochmodern' },
  { pattern: /\brasant\b/i, name: 'rasant' },
  { pattern: /\baktuell\s+\d+/i, name: 'aktuell + Zahl' },
  { pattern: /\bderzeit\s+\d+/i, name: 'derzeit + Zahl' }
];

editorialCities.forEach((city) => {
  const desc = city.description || '';
  
  // Check banned patterns
  bannedPatterns.forEach(({ pattern, name }) => {
    if (pattern.test(desc)) {
      console.error(`[FAIL] City '${city.slug}' violates banned pattern '${name}': "${desc}"`);
      errors++;
    }
  });

  // Check hardcoded numerical charge point counts in descriptions
  const hardcodedNumberMatch = desc.match(/\b\d{1,3}(?:\.\d{3})+\s*(?:ladepunkt|säule|station)/i);
  if (hardcodedNumberMatch) {
    console.error(`[FAIL] City '${city.slug}' contains hardcoded metric in description: "${hardcodedNumberMatch[0]}"`);
    errors++;
  }
});

// 4. Verify Berlin known issue fix
const berlin = editorialCities.find(c => c.slug === 'berlin');
if (!berlin) {
  console.error(`[FAIL] Berlin not found in cities-editorial.json`);
  errors++;
} else {
  if (berlin.description.includes('dichteste urbane Ladenetz')) {
    console.error(`[FAIL] Berlin still contains 'dichteste urbane Ladenetz': "${berlin.description}"`);
    errors++;
  } else {
    console.log(`[PASS] Berlin known issue resolved: "${berlin.description}"`);
  }
}

// 5. Verify CityPage.tsx FAQ and SEO snapshot compliance
if (cityPageContent.includes('aktuell ${city.ladepunkteGesamt')) {
  console.error(`[FAIL] CityPage.tsx still uses 'aktuell \${city.ladepunkteGesamt' in FAQ.`);
  errors++;
} else {
  console.log(`[PASS] CityPage.tsx FAQ uses snapshot-compliant phrasing.`);
}

if (cityPageContent.includes('Aktuelle Auswertung veröffentlichter BNetzA-Registerdaten')) {
  console.error(`[FAIL] CityPage.tsx SEO description still uses 'Aktuelle Auswertung'.`);
  errors++;
} else {
  console.log(`[PASS] CityPage.tsx SEO description uses snapshot-compliant phrasing.`);
}

if (errors === 0) {
  console.log(`\n✅ ALL 50 CITY EDITORIAL CLAIMS & TEMPLATES VERIFIED SUCCESSFULLY (0 ERRORS).`);
  process.exit(0);
} else {
  console.error(`\n❌ CITY EDITORIAL CLAIM INTEGRITY CHECKS FAILED WITH ${errors} ERROR(S).`);
  process.exit(1);
}
