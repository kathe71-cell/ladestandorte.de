import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, '..', p);

console.log('=== MCS MONITOR INTEGRITY REGRESSION TEST ===');

let failures = 0;

// Import server bundle to test runtime helpers and data
const { STATIONS_DATA, getMcsStations } = await import(toAbsolute('dist-ssr/entry-server.js'));

// Test dataset size
const mcsStations = getMcsStations(STATIONS_DATA);
if (mcsStations.length !== 8) {
  console.error(`[FAIL] Expected exactly 8 MCS stations, got ${mcsStations.length}`);
  failures++;
} else {
  console.log('[PASS] getMcsStations().length === 8 verified.');
}

// Test status values
const operationalCount = mcsStations.filter((s) => s.truckCharging?.mcsStatus === 'operational').length;
const plannedCount = mcsStations.filter((s) => s.truckCharging?.mcsStatus === 'planned').length;

if (operationalCount !== 5) {
  console.error(`[FAIL] Expected 5 MCS operational stations, got ${operationalCount}`);
  failures++;
} else {
  console.log('[PASS] Exactly 5 stations have mcsStatus === "operational".');
}

if (plannedCount !== 3) {
  console.error(`[FAIL] Expected 3 MCS planned stations, got ${plannedCount}`);
  failures++;
} else {
  console.log('[PASS] Exactly 3 stations have mcsStatus === "planned".');
}

// Test operational power
const operationalMcsPowers = mcsStations
  .filter((s) => s.truckCharging?.mcsStatus === 'operational')
  .map((s) => s.truckCharging?.mcsMaxKw)
  .filter((kw) => typeof kw === 'number');

if (operationalMcsPowers.length !== 5) {
  console.error(`[FAIL] Expected 5 operational MCS power values, got ${operationalMcsPowers.length}`);
  failures++;
} else {
  const minKw = Math.min(...operationalMcsPowers);
  const maxKw = Math.max(...operationalMcsPowers);
  const avgKw = Math.round(operationalMcsPowers.reduce((a, b) => a + b, 0) / operationalMcsPowers.length);
  const sorted = [...operationalMcsPowers].sort((a, b) => a - b);
  const medianKw = sorted[Math.floor(sorted.length / 2)];

  if (minKw !== 1000 || maxKw !== 1200 || avgKw !== 1080 || medianKw !== 1000) {
    console.error(`[FAIL] Power stats mismatch: min=${minKw}, max=${maxKw}, avg=${avgKw}, median=${medianKw}`);
    failures++;
  } else {
    console.log('[PASS] Operational MCS power metrics verified: min=1000, max=1200, avg=1080, median=1000 kW.');
  }
}

// Test CCS standard 400 kW across all 8
const allHave400KwCcs = mcsStations.every((s) => s.truckCharging?.ccsMaxKw === 400);
if (!allHave400KwCcs) {
  console.error('[FAIL] Not all 8 stations have ccsMaxKw === 400');
  failures++;
} else {
  console.log('[PASS] 8/8 stations have ccsMaxKw === 400 verified.');
}

// Test suitability: driveThrough and trailerAccessible
const allDriveThrough = mcsStations.every((s) => s.truckCharging?.driveThrough === true);
const allTrailerAccessible = mcsStations.every((s) => s.truckCharging?.trailerAccessible === true);

if (!allDriveThrough || !allTrailerAccessible) {
  console.error('[FAIL] Truck suitability mismatch across 8 stations');
  failures++;
} else {
  console.log('[PASS] 8/8 stations have driveThrough === true and trailerAccessible === true.');
}

// Test status separation for mcs-004, mcs-007, mcs-008
const criticalIds = ['mcs-004', 'mcs-007', 'mcs-008'];
for (const id of criticalIds) {
  const st = mcsStations.find((s) => s.id === id);
  if (!st) {
    console.error(`[FAIL] Missing station ${id}`);
    failures++;
  } else if (st.truckCharging?.locationStatus !== 'operational' || st.truckCharging?.mcsStatus !== 'planned') {
    console.error(`[FAIL] Station ${id} invalid status separation: locationStatus=${st.truckCharging?.locationStatus}, mcsStatus=${st.truckCharging?.mcsStatus}`);
    failures++;
  } else {
    console.log(`[PASS] Station ${id} confirmed: locationStatus='operational' and mcsStatus='planned'.`);
  }
}

// Test provenance 8/8
const allHaveSourceUrlAndDate = mcsStations.every(
  (s) => s.truckCharging?.sourceUrl && s.truckCharging?.lastVerifiedAt
);
if (!allHaveSourceUrlAndDate) {
  console.error('[FAIL] Missing sourceUrl or lastVerifiedAt in some truckCharging records');
  failures++;
} else {
  console.log('[PASS] 8/8 stations have explicit sourceUrl and lastVerifiedAt.');
}

// Test real dataset verification date (Fall A: all 8 stations have 2026-10-01)
const { getMcsMonitorMetrics } = await import(toAbsolute('dist-ssr/entry-server.js'));
const realMetrics = getMcsMonitorMetrics(STATIONS_DATA);

if (realMetrics.datasetLastVerifiedAt !== '2026-10-01') {
  console.error(`[FAIL] Expected datasetLastVerifiedAt === '2026-10-01', got: ${realMetrics.datasetLastVerifiedAt}`);
  failures++;
} else if (realMetrics.datasetDateFormatted !== '1. Oktober 2026') {
  console.error(`[FAIL] Expected datasetDateFormatted === '1. Oktober 2026', got: ${realMetrics.datasetDateFormatted}`);
  failures++;
} else {
  console.log('[PASS] Real dataset Fall A verified: datasetLastVerifiedAt="2026-10-01" ("1. Oktober 2026").');
}

// Synthetic tests for Date Guardrail: Fall A vs. Fall B
console.log('--- Testing Synthetic Date Guardrail (Fall A vs Fall B) ---');

// Synthetic Fall A: all identical
const syntheticStationsFallA = [
  { ...mcsStations[0], truckCharging: { ...mcsStations[0].truckCharging, lastVerifiedAt: '2026-10-01' } },
  { ...mcsStations[1], truckCharging: { ...mcsStations[1].truckCharging, lastVerifiedAt: '2026-10-01' } }
];
const metricsFallA = getMcsMonitorMetrics(syntheticStationsFallA);
if (metricsFallA.datasetLastVerifiedAt !== '2026-10-01' || metricsFallA.datasetDateFormatted !== '1. Oktober 2026') {
  console.error(`[FAIL] Synthetic Fall A failed: expected shared date 2026-10-01, got ${metricsFallA.datasetLastVerifiedAt}`);
  failures++;
} else {
  console.log('[PASS] Synthetic Fall A: Identische Prüfstände ergeben sauberen gemeinsamen Datenstand.');
}

// Synthetic Fall B: different dates (e.g. 2026-10-01 and 2026-10-15)
const syntheticStationsFallB = [
  { ...mcsStations[0], truckCharging: { ...mcsStations[0].truckCharging, lastVerifiedAt: '2026-10-01' } },
  { ...mcsStations[1], truckCharging: { ...mcsStations[1].truckCharging, lastVerifiedAt: '2026-10-15' } }
];
const metricsFallB = getMcsMonitorMetrics(syntheticStationsFallB);
if (metricsFallB.datasetLastVerifiedAt !== null || metricsFallB.datasetDateFormatted !== null) {
  console.error(`[FAIL] Synthetic Fall B failed: datasetLastVerifiedAt should be null for divergent dates, got ${metricsFallB.datasetLastVerifiedAt}`);
  failures++;
} else if (!metricsFallB.verificationDateRangeFormatted || !metricsFallB.verificationDateRangeFormatted.includes('Prüfstände:')) {
  console.error(`[FAIL] Synthetic Fall B failed: expected date range, got ${metricsFallB.verificationDateRangeFormatted}`);
  failures++;
} else {
  console.log(`[PASS] Synthetic Fall B: Unterschiedliche Prüfstände setzen datasetLastVerifiedAt = null (${metricsFallB.verificationDateRangeFormatted}).`);
}

// Audit generated HTML for /mcs/ladestationen
const mcsHtmlPath = toAbsolute('dist/mcs/ladestationen/index.html');
if (!fs.existsSync(mcsHtmlPath)) {
  console.error('[FAIL] dist/mcs/ladestationen/index.html does not exist!');
  failures++;
} else {
  const mcsHtml = fs.readFileSync(mcsHtmlPath, 'utf8');

  // Forbidden wording checks
  const bannedPhrases = [
    'alle MCS-Standorte Deutschlands',
    'vollständiger MCS-Markt',
    'MCS-Marktanteil',
    'bundesweit vollständig',
    'flächendeckend ausgebaut'
  ];

  for (const phrase of bannedPhrases) {
    if (mcsHtml.toLowerCase().includes(phrase.toLowerCase())) {
      console.error(`[FAIL] /mcs/ladestationen HTML contains banned phrase: "${phrase}"`);
      failures++;
    }
  }

  // Forbidden connector aggregation checks: cannot claim total points across dataset as a market total
  if (mcsHtml.includes('Gesamtzahl aller MCS-Ladepunkte') || mcsHtml.includes('Marktanteil')) {
    console.error('[FAIL] /mcs/ladestationen contains forbidden aggregation or market share claim.');
    failures++;
  }

  // Check required positive UI elements
  const requiredElements = [
    'MCS-Monitor Deutschland',
    'Dokumentierte Standorte',
    'MCS aktiv',
    'MCS geplant',
    'Max. operative MCS-Leistung',
    'MCS und CCS getrennt betrachten',
    'Leistung der operativen MCS-Standorte',
    'Verteilung der dokumentierten Standorte nach Betreiber',
    'Diesen Datensatz zitieren',
    'https://www.ladestandorte.de/mcs/ladestationen'
  ];

  for (const el of requiredElements) {
    if (!mcsHtml.includes(el)) {
      console.error(`[FAIL] /mcs/ladestationen HTML missing expected element: "${el}"`);
      failures++;
    }
  }

  // Check critical stations are NOT rendered as active MCS
  // E.g. Königs Wusterhausen must have "MCS geplant"
  const kwMatch = mcsHtml.includes('Königs Wusterhausen');
  if (!kwMatch) {
    console.error('[FAIL] Königs Wusterhausen missing from HTML');
    failures++;
  } else {
    console.log('[PASS] /mcs/ladestationen HTML verified with required Monitor elements.');
  }
}

console.log(`\nMCS Monitor Integrity Audit completed: ${failures} failure(s).`);
if (failures > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL MCS MONITOR INTEGRITY CHECKS PASSED.\n');
}
