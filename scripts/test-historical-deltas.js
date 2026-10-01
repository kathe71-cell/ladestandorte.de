import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeSafePercentChange, computeCityHistoricalTrend } from '../dist-ssr/entry-server.js';

console.log('=== HISTORICAL DELTA & TIME-SERIES REGRESSION SUITE ===');

// 1. Test Zero-Division Protection
const zeroDelta = computeSafePercentChange(0, 50);
if (zeroDelta !== null) {
  throw new Error(`Expected computeSafePercentChange(0, 50) to return null, got ${zeroDelta}`);
}
console.log('[PASS] Zero-division protection: computeSafePercentChange(0, 50) === null verified.');

const normalDelta = computeSafePercentChange(100, 125);
if (normalDelta !== 25.0) {
  throw new Error(`Expected computeSafePercentChange(100, 125) to return 25.0, got ${normalDelta}`);
}
console.log('[PASS] Positive growth delta: computeSafePercentChange(100, 125) === 25.0 verified.');

const negativeDelta = computeSafePercentChange(200, 150);
if (negativeDelta !== -25.0) {
  throw new Error(`Expected computeSafePercentChange(200, 150) to return -25.0, got ${negativeDelta}`);
}
console.log('[PASS] Negative contraction delta: computeSafePercentChange(200, 150) === -25.0 verified.');

// 2. Test Multi-Snapshot Delta Computation
const mockPrevSnapshot = {
  snapshotDate: '2026-09-01',
  retrievedAt: '2026-09-01T00:00:00Z',
  sourceSha256: 'abc',
  totalChargingPointsDE: 50000,
  totalHpcPointsDE: 7000,
  cities: [
    {
      slug: 'berlin',
      name: 'Berlin',
      chargingPointsTotal: 7000,
      chargingPoints150PlusKw: 900,
      share150PlusKwPercent: 12.86,
      points150PlusKwPer1000Pop: 0.24
    }
  ]
};

const mockCurrSnapshot = {
  snapshotDate: '2026-10-01',
  retrievedAt: '2026-10-01T00:00:00Z',
  sourceSha256: 'xyz',
  totalChargingPointsDE: 52000,
  totalHpcPointsDE: 7500,
  cities: [
    {
      slug: 'berlin',
      name: 'Berlin',
      chargingPointsTotal: 7617,
      chargingPoints150PlusKw: 988,
      share150PlusKwPercent: 12.97,
      points150PlusKwPer1000Pop: 0.27
    }
  ]
};

const trend = computeCityHistoricalTrend(mockPrevSnapshot, mockCurrSnapshot, 'berlin');
if (!trend) {
  throw new Error('computeCityHistoricalTrend returned null for existing city');
}
if (trend.pointsTotalDelta !== 617) {
  throw new Error(`Expected pointsTotalDelta === 617, got ${trend.pointsTotalDelta}`);
}
if (trend.hpcDelta !== 88) {
  throw new Error(`Expected hpcDelta === 88, got ${trend.hpcDelta}`);
}
console.log('[PASS] Multi-snapshot delta computation verified (pointsTotalDelta=+617, hpcDelta=+88).');

// 3. Test Single-Snapshot Baseline Guardrail
const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const histPath = path.join(rootDir, 'src/data/generated/hpc-history.generated.json');
if (!fs.existsSync(histPath)) {
  throw new Error(`Missing generated history dataset at ${histPath}`);
}

const histData = JSON.parse(fs.readFileSync(histPath, 'utf-8'));
if (histData.availableSnapshots.length === 1) {
  if (histData.deltasAvailable !== false) {
    throw new Error('Expected deltasAvailable === false when only 1 snapshot exists!');
  }
  if (histData.cityTrends.length !== 0) {
    throw new Error('Expected empty cityTrends when only 1 snapshot exists!');
  }
  console.log('[PASS] Single-snapshot baseline guardrail verified: deltasAvailable=false, 0 fake trends.');
}

console.log('\n✅ ALL HISTORICAL DELTA REGRESSION CHECKS PASSED (0 ERRORS).\n');
