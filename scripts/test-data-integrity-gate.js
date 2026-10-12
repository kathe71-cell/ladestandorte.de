/**
 * scripts/test-data-integrity-gate.js
 * Comprehensive Regression Suite for the Data Integrity Gate.
 *
 * Uses isolated mock fixtures without modifying productive BNetzA data:
 * 1. Valid data import (PASS)
 * 2. Missing required column (FAIL)
 * 3. Invalid data types (FAIL)
 * 4. Mathematical contradiction (FAIL)
 * 5. Unusual monthly decrease (REVIEW_REQUIRED)
 * 6. Unusual monthly increase (REVIEW_REQUIRED)
 * 7. Valid specific approval with SHA-256 match (PASS)
 * 8. Rejection of blanket approval ("ALL" / "*") (BLOCKED)
 * 9. Rejection of approval with wrong/tampered SHA-256 (BLOCKED)
 * 10. Rejection of partial approval when newly added warning is unapproved (BLOCKED)
 * 11. Rejection of outdated approval with wrong snapshot date (BLOCKED)
 * 12. Missing approval file when review required (BLOCKED)
 * 13. Baseline recognition without fake deltas (BASELINE_ESTABLISHED)
 * 14. Unchanged dataset comparison (PASS)
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { verifyUpstreamSchema } from './gate/verify-upstream-schema.mjs';
import { verifyPlausibilityBounds } from './gate/verify-plausibility-bounds.mjs';
import { verifyApproval } from './gate/verify-approval.mjs';

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function assert(condition, message) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`[PASS] ${message}`);
  } else {
    failedChecks++;
    console.error(`[FAIL] ${message}`);
  }
}

console.log('=== DATA INTEGRITY GATE UNIT & SCENARIO REGRESSION SUITE ===');

// Setup temporary isolated fixtures directory
const tmpBase = fs.mkdtempSync(path.join(os.tmpdir(), 'gate-test-fixtures-'));

function createMockCsvDir(stHeader, stRows, ptHeader, ptRows) {
  const dir = fs.mkdtempSync(path.join(tmpBase, 'mock-'));
  fs.writeFileSync(path.join(dir, 'bnetza_api_ladestation000.csv'), [stHeader, ...stRows].join('\n'), 'utf8');
  fs.writeFileSync(path.join(dir, 'bnetza_api_ladepunkt000.csv'), [ptHeader, ...ptRows].join('\n'), 'utf8');
  return dir;
}

const validStHeader = 'ladestation_id;betreiber;betreiber_anzeigename;betreiber_bereinigt;betreiber_kategorie;strasse;hausnummer;plz;ort;bundesland;landkreis;gemeinde;ars;laengengrad;breitengrad;inbetriebnahmedatum;betriebsstatus;ladestation_nennleistung;ladestationsbasierte_installierte_ladeleistung;anzahl_ladepunkte;ladestation_art;clustergruppe_standort_5m;clustergruppe_standort_25m;bezahlsystem_kostenlos;bezahlsystem_bargeld;bezahlsystem_kreditkarte_lesegeraet;bezahlsystem_kreditkarte_nfc;bezahlsystem_kreditkarte_websiteapp;bezahlsystem_debitkarte_lesegeraet;bezahlsystem_debitkarte_nfc;bezahlsystem_online;bezahlsystem_rfid;bezahlsystem_kostenlos_registrierung;bezahlsystem_plugandcharge;bezahlsystem_sonstiges;oeffnungszeiten;montag_von;montag_bis;dienstag_von;dienstag_bis;mittwoch_von;mittwoch_bis;donnerstag_von;donnerstag_bis;freitag_von;freitag_bis;samstag_von;samstag_bis;sonntag_von;sonntag_bis;zugangsbeschraenkung;lade_use_case;datenstand';
const validStRow = 'st-101;EnBW;EnBW mobility+;EnBW mobility+;cpo;Hauptstr.;1;10115;Berlin;Berlin;Berlin;Berlin;110000000000;13,4050;52,5200;2024-01-01;In Betrieb;300;300;2;öffentlich;;;0;0;0;1;1;0;1;1;1;0;1;0;24/7;;;;;;;;;;;;;;;;;;öffentlich;Öffentlicher Raum;2026-10-01';

const validPtHeader = 'ladepunkt_id;ladepunkt_hk;ladestation_id;evse_id;ladepunkt_nennleistung;ladepunkt_art_lsv;ladepunkt_art_hpc;ladepunkt_art_fr;ladepunkt_art_charin;datenstand';
const validPtRow1 = 'pt-201;1;st-101;DE*EBW*E101*1;150;DC;1;0;0;2026-10-01';
const validPtRow2 = 'pt-202;1;st-101;DE*EBW*E101*2;150;DC;1;0;0;2026-10-01';

const mockSha256 = '31da754d8b51209bbb8352acb60863bfd1302134c9bf1a0b168a25f8ec17a8ca';

async function runTests() {
  // Test 1: Valid Data Import
  const validDir = createMockCsvDir(validStHeader, [validStRow], validPtHeader, [validPtRow1, validPtRow2]);
  const res1 = await verifyUpstreamSchema(validDir);
  assert(res1.status === 'PASS', 'Scenario 1: Valid mock dataset passes upstream schema verification');

  // Test 2: Missing Required Column
  const invalidStHeaderMissingCol = 'ladestation_id;betreiber;ort;plz;laengengrad;ladestation_nennleistung;anzahl_ladepunkte'; // missing breitengrad
  const missingColDir = createMockCsvDir(invalidStHeaderMissingCol, ['st-102;EnBW;Berlin;10115;13.4;300;2'], validPtHeader, [validPtRow1]);
  const res2 = await verifyUpstreamSchema(missingColDir);
  assert(res2.status === 'FAIL' && res2.errors.some(e => e.includes('breitengrad')), 'Scenario 2: Missing required column "breitengrad" triggers FAIL');

  // Test 3: Invalid Data Types
  const invalidTypeRow = 'st-103;EnBW;EnBW;EnBW;cpo;Str;1;10115;Berlin;Berlin;Berlin;Berlin;110000000000;99.9999;10.0000;2024-01-01;In Betrieb;nicht_numerisch;300;2;offen;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;';
  const invalidTypeDir = createMockCsvDir(validStHeader, [invalidTypeRow], validPtHeader, [validPtRow1]);
  const res3 = await verifyUpstreamSchema(invalidTypeDir);
  assert(res3.status === 'FAIL' && res3.errors.some(e => e.includes('coordinates') || e.includes('power')), 'Scenario 3: Invalid coordinate / power data type triggers FAIL');

  // Test 4: Mathematical Inconsistency (HPC > Total Points)
  const badMathSnapshot = {
    totalPoints: 1000,
    totalHpc: 1200, // Impossibility
    totalStations: 500,
    operators: [],
    cities: []
  };
  const res4 = verifyPlausibilityBounds(badMathSnapshot, null);
  assert(res4.status === 'FAIL' && res4.failures.some(f => f.includes('HPC points (1200) > Total points (1000)')), 'Scenario 4: Mathematical contradiction (HPC > Total) triggers FAIL');

  // Test 5: Unusual Monthly Decrease (> -0.5% drop)
  const prevSnapshot = {
    totalPoints: 200000,
    totalHpc: 40000,
    totalStations: 100000,
    operators: [{ id: 'enbw', slug: 'enbw', chargingPointsTotal: 10000 }],
    cities: [{ slug: 'berlin', name: 'Berlin', chargingPointsTotal: 7000 }]
  };
  const currDroppedSnapshot = {
    totalPoints: 190000, // -5.0% drop
    totalHpc: 39900,
    totalStations: 99900,
    operators: [{ id: 'enbw', slug: 'enbw', chargingPointsTotal: 10000 }],
    cities: [{ slug: 'berlin', name: 'Berlin', chargingPointsTotal: 7000 }]
  };
  const res5 = verifyPlausibilityBounds(currDroppedSnapshot, prevSnapshot);
  assert(res5.status === 'REVIEW_REQUIRED' && res5.warnings.some(w => w.includes('dropped by -5%')), 'Scenario 5: Nationwide points drop of -5% triggers REVIEW_REQUIRED');

  // Test 6: Unusual Monthly Increase (> +10.0% spike)
  const currSpikedSnapshot = {
    totalPoints: 230000, // +15.0% spike
    totalHpc: 42000,
    totalStations: 102000,
    operators: [{ id: 'enbw', slug: 'enbw', chargingPointsTotal: 10000 }],
    cities: [{ slug: 'berlin', name: 'Berlin', chargingPointsTotal: 7000 }]
  };
  const res6 = verifyPlausibilityBounds(currSpikedSnapshot, prevSnapshot);
  assert(res6.status === 'REVIEW_REQUIRED' && res6.warnings.some(w => w.includes('grew by unusual 15%')), 'Scenario 6: Nationwide points spike of +15% triggers REVIEW_REQUIRED');

  // Setup approvals testing
  const mockApprovalsDir = path.join(tmpBase, 'approvals');
  fs.mkdirSync(mockApprovalsDir, { recursive: true });

  // Test 7: Valid Specific Approval with SHA-256 Binding (PASS)
  const validSpecificApprovalFile = path.join(mockApprovalsDir, 'approval-2026-11-01.json');
  fs.writeFileSync(validSpecificApprovalFile, JSON.stringify({
    snapshotDate: '2026-11-01',
    snapshotSha256: mockSha256,
    reviewedAt: '2026-11-01T10:00:00Z',
    reviewedBy: 'Leiter Redaktion & Daten',
    rationale: 'BNetzA Registerbereinigung durch Stilllegung alter AC-Stationen von Betreiber X fachlich verifiziert.',
    approvedWarnings: ['WARN_NATIONWIDE_POINTS_DROP', 'dropped by -5%']
  }, null, 2), 'utf8');

  const res7 = verifyApproval('2026-11-01', ['Nationwide charging points dropped by -5%'], mockApprovalsDir, { expectedSha256: mockSha256 });
  assert(res7.approved === true, 'Scenario 7: Specific documented approval with valid SHA-256 match confirms sign-off');

  // Test 8: Rejection of Blanket Approval ("ALL" or "*")
  const blanketApprovalFile = path.join(mockApprovalsDir, 'approval-2026-11-02.json');
  fs.writeFileSync(blanketApprovalFile, JSON.stringify({
    snapshotDate: '2026-11-02',
    snapshotSha256: mockSha256,
    reviewedAt: '2026-11-02T10:00:00Z',
    reviewedBy: 'Reviewer',
    rationale: 'Blanket approval attempt',
    approvedWarnings: ['ALL']
  }), 'utf8');
  const res8 = verifyApproval('2026-11-02', ['some warning'], mockApprovalsDir, { expectedSha256: mockSha256 });
  assert(res8.approved === false && res8.reason.includes('REJECTED_BLANKET_APPROVAL'), 'Scenario 8: Blanket approval ("ALL") is strictly rejected');

  // Test 9: Rejection of Approval with Wrong/Tampered SHA-256
  const tamperedApprovalFile = path.join(mockApprovalsDir, 'approval-2026-11-03.json');
  fs.writeFileSync(tamperedApprovalFile, JSON.stringify({
    snapshotDate: '2026-11-03',
    snapshotSha256: 'deadbeef1234567890deadbeef1234567890deadbeef1234567890deadbeef1234',
    reviewedAt: '2026-11-03T10:00:00Z',
    reviewedBy: 'Reviewer',
    rationale: 'Valid rationale but wrong hash',
    approvedWarnings: ['some warning']
  }), 'utf8');
  const res9 = verifyApproval('2026-11-03', ['some warning'], mockApprovalsDir, { expectedSha256: mockSha256 });
  assert(res9.approved === false && res9.reason.includes('HASH_MISMATCH'), 'Scenario 9: Approval with mismatched SHA-256 is strictly rejected');

  // Test 10: Partial Approval with Newly Added Unapproved Warning
  const partialApprovalFile = path.join(mockApprovalsDir, 'approval-2026-11-04.json');
  fs.writeFileSync(partialApprovalFile, JSON.stringify({
    snapshotDate: '2026-11-04',
    snapshotSha256: mockSha256,
    reviewedAt: '2026-11-04T10:00:00Z',
    reviewedBy: 'Reviewer',
    rationale: 'Approved only points drop, not operator anomaly',
    approvedWarnings: ['WARN_NATIONWIDE_POINTS_DROP']
  }), 'utf8');
  const res10 = verifyApproval('2026-11-04', ['WARN_NATIONWIDE_POINTS_DROP', 'WARN_OPERATOR_DROP_tesla'], mockApprovalsDir, { expectedSha256: mockSha256 });
  assert(res10.approved === false && res10.reason.includes('UNAPPROVED_WARNINGS'), 'Scenario 10: Partial approval rejecting unapproved new warning');

  // Test 11: Outdated Approval with Wrong Snapshot Date
  const outdatedApprovalFile = path.join(mockApprovalsDir, 'approval-2027-01-01.json');
  fs.writeFileSync(outdatedApprovalFile, JSON.stringify({
    snapshotDate: '2026-11-01', // Outdated mismatch!
    snapshotSha256: mockSha256,
    reviewedAt: '2026-11-01T10:00:00Z',
    reviewedBy: 'Reviewer',
    rationale: 'Old approval copy',
    approvedWarnings: ['warning']
  }), 'utf8');
  const res11 = verifyApproval('2027-01-01', ['warning'], mockApprovalsDir, { expectedSha256: mockSha256 });
  assert(res11.approved === false && res11.reason.includes('OUTDATED_APPROVAL'), 'Scenario 11: Outdated approval with snapshotDate mismatch correctly rejected');

  // Test 12: Missing Approval when Required
  const res12 = verifyApproval('2026-12-01', ['points dropped by -2%'], mockApprovalsDir, { expectedSha256: mockSha256 });
  assert(res12.approved === false && res12.reason.includes('MISSING_APPROVAL'), 'Scenario 12: Missing approval file correctly identified and blocks sign-off');

  // Test 13: Baseline Recognition Without Fake Historical Deltas
  const baselineRes = verifyPlausibilityBounds(prevSnapshot, null);
  assert(baselineRes.status === 'PASS' && baselineRes.baselineStatus === 'BASELINE_ESTABLISHED', 'Scenario 13: Single snapshot correctly identified as BASELINE_ESTABLISHED without fake deltas');

  // Test 14: Unchanged Dataset (PASS)
  const unchangedCurrent = {
    totalPoints: 200000,
    totalHpc: 40000,
    totalStations: 100000,
    operators: [{ id: 'enbw', slug: 'enbw', chargingPointsTotal: 10000 }],
    cities: [{ slug: 'berlin', name: 'Berlin', chargingPointsTotal: 7000 }]
  };
  const res14 = verifyPlausibilityBounds(unchangedCurrent, prevSnapshot);
  assert(res14.status === 'PASS' && res14.warnings.length === 0 && res14.baselineStatus === 'COMPARISON_ACTIVE', 'Scenario 14: Unchanged dataset yields PASS with 0 warnings');

  // Clean up fixtures
  try {
    fs.rmSync(tmpBase, { recursive: true, force: true });
  } catch {
    // ignore
  }

  console.log(`\nGate Test Suite completed: ${passedChecks}/${totalChecks} passed (${failedChecks} failed).`);

  if (failedChecks > 0) {
    process.exit(1);
  } else {
    console.log('✅ ALL 14 DATA INTEGRITY GATE SCENARIOS VERIFIED.');
  }
}

runTests();
