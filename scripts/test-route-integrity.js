#!/usr/bin/env node
/**
 * scripts/test-route-integrity.js
 * Validates route integrity across ladestandorte.de:
 * 1. Must resolve:
 *    - Static routes: '/', '/staedte', '/mcs', '/mcs/was-ist-mcs', '/mcs/mcs-vs-ccs', '/mcs/lkw-laden', '/rechner', '/methodik'
 *    - All 8 canonical MCS station dossiers
 * 2. Must NOT resolve to homepage (Must render 404 / NotFoundPage):
 *    - '/definitely-not-a-real-page'
 *    - '/mcs/lkw-lenkzeitpause'
 *    - '/mcs/hub/aral-pulse-schwarmstedt-a7'
 *    - '/mcs/hub/definitely-not-real'
 *    - '/standorte'
 * 3. Asserts that unknown routes render NotFoundPage and NOT Homepage content.
 */

import { render, STATIONS_DATA, getMcsStations, getStationUrl } from '../dist-ssr/entry-server.js';

console.log('=== ROUTE INTEGRITY & NOT-FOUND REGRESSION TEST ===');

const MUST_RESOLVE_ROUTES = [
  '/',
  '/staedte',
  '/hpc-city-monitor',
  '/cpo-monitor',
  '/mcs',
  '/mcs/was-ist-mcs',
  '/mcs/mcs-vs-ccs',
  '/mcs/lkw-laden',
  '/ladestationen',
  '/rechner',
  '/methodik'
];

// Add all 8 canonical MCS dossiers
const mcsStations = getMcsStations(STATIONS_DATA);
if (mcsStations.length !== 8) {
  console.error(`FAIL: Expected 8 MCS stations, found ${mcsStations.length}`);
  process.exit(1);
}

for (const st of mcsStations) {
  MUST_RESOLVE_ROUTES.push(getStationUrl(st));
}

let failures = 0;

// Test 1: Must resolve valid pages
for (const url of MUST_RESOLVE_ROUTES) {
  try {
    const { html } = render(url);
    if (!html || html.length < 500) {
      console.error(`[FAIL] Route ${url} rendered suspiciously small or empty HTML (${html?.length} chars)`);
      failures++;
    } else if (html.includes('Seite nicht gefunden') && url !== '/404') {
      console.error(`[FAIL] Valid route ${url} unexpectedly rendered 404 page!`);
      failures++;
    } else {
      console.log(`[PASS] Valid route resolves: ${url} (length: ${html.length})`);
    }
  } catch (err) {
    console.error(`[FAIL] Exception rendering route ${url}:`, err);
    failures++;
  }
}

// Test 2: Must NOT resolve to Homepage for invalid/legacy/unknown URLs
const UNKNOWN_ROUTES = [
  '/definitely-not-a-real-page',
  '/mcs/lkw-lenkzeitpause',
  '/mcs/hub/aral-pulse-schwarmstedt-a7',
  '/mcs/hub/definitely-not-real',
  '/standorte'
];

// Distinct strings unique to Home page Hero
const HOMEPAGE_EXCLUSIVE_STRINGS = [
  'Finde über 130.000 öffentlich zugängliche Ladesäulen',
  'Öffentliche Ladeinfrastruktur in Deutschland'
];

for (const url of UNKNOWN_ROUTES) {
  try {
    const { html } = render(url);

    // 1. Must NOT contain Homepage-exclusive content
    const containsHomepage = HOMEPAGE_EXCLUSIVE_STRINGS.some(str => html.includes(str));
    if (containsHomepage) {
      console.error(`[FAIL] Unknown route ${url} falsely rendered Homepage content!`);
      failures++;
      continue;
    }

    // 2. Must render 404 / Seite nicht gefunden
    if (!html.includes('Seite nicht gefunden') && !html.includes('Fehler 404')) {
      console.error(`[FAIL] Unknown route ${url} did not render NotFound page!`);
      failures++;
      continue;
    }

    // 3. Must contain return links
    if (!html.includes('/staedte') || !html.includes('/autobahnen') || !html.includes('/mcs')) {
      console.error(`[FAIL] Unknown route ${url} rendered 404 page missing key return links!`);
      failures++;
      continue;
    }

    console.log(`[PASS] Unknown route correctly caught by NotFoundPage: ${url}`);
  } catch (err) {
    console.error(`[FAIL] Exception rendering unknown route ${url}:`, err);
    failures++;
  }
}

if (failures > 0) {
  console.error(`\n❌ Route Integrity test failed with ${failures} error(s).`);
  process.exit(1);
}

console.log('\n✅ ALL ROUTE INTEGRITY & NOT-FOUND REGRESSION TESTS PASSED (0 ERRORS).');
process.exit(0);
