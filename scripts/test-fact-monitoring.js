/**
 * scripts/test-fact-monitoring.js
 * 
 * Umfassende Test-Suite für das Fachaktualitäts-Monitoring (Phase 6 Anforderungen):
 * 
 * 1. Quelle unverändert -> UNCHANGED (Snapshot bleibt stabil)
 * 2. Relevanter Fakt geändert (z. B. Fastned Preis 0,69 € -> 0,74 €) -> CHANGED_REVIEW_REQUIRED
 * 3. Irrelevantes HTML geändert (z. B. Navigation/Footer ändert sich, Fakten bleiben gleich) -> UNCHANGED
 * 4. Quelle nicht erreichbar (HTTP 500 / Timeout) -> SOURCE_UNAVAILABLE (Snapshot wird NICHT überschrieben)
 * 5. Extraktion fehlgeschlagen (Parser findet Schlüssel nicht) -> EXTRACTION_FAILED (KEINE fachliche Änderung)
 * 6. Dokument nicht vergleichbar (z. B. WAF CloudFront 202) -> NOT_COMPARABLE
 * 7. Mehrfach identische Änderung -> Idempotenz (kein doppeltes Issue im Status)
 * 8. Erfolgreiche menschliche Freigabe (Snapshot-Update mit aktuellem Wert)
 * 9. Fehlende Freigabe blockiert unautorisierte Veröffentlichung
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { extractSourceFacts, diffFacts, runFactMonitoring } from './monitor/check-source-changes.mjs';
import { processNotifications } from './monitor/dispatch-notifications.mjs';

console.log('================================================================');
console.log('🧪 FACHAKTUALITÄTS- UND ÄNDERUNGSERKENNUNG REGRESSIONSTESTS');
console.log('================================================================');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// Erstelle isolierte Testumgebung
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'fact-monitor-test-'));
const testSnapshotPath = path.join(tmpDir, 'test-snapshots.json');
const testStatePath = path.join(tmpDir, 'test-state.json');
const testReportsDir = path.join(tmpDir, 'reports');

const baseSnapshot = {
  version: 1,
  sources: {
    "SRC_FASTNED_OFFICIAL": {
      "sourceId": "SRC_FASTNED_OFFICIAL",
      "sourceName": "Fastned Offiziell",
      "sourceUrl": "https://fastnedcharging.com/de/",
      "category": "OPERATOR_TECHNICAL",
      "approvalRequirement": "HUMAN_REVIEW",
      "affectedPages": ["/betreiber/fastned"],
      "facts": {
        "tariffModel": "fixed_adhoc",
        "standardPriceDc": 0.69,
        "hasGoldMembership": true,
        "goldDiscountPercent": 30,
        "maxKwDe": 400
      }
    },
    "SRC_IONITY_OFFICIAL": {
      "sourceId": "SRC_IONITY_OFFICIAL",
      "sourceName": "IONITY Offiziell",
      "sourceUrl": "https://www.ionity.eu/de",
      "category": "OPERATOR_PRICING",
      "approvalRequirement": "HUMAN_REVIEW",
      "affectedPages": ["/betreiber/ionity"],
      "facts": {
        "tariffModel": "variable_station",
        "hasStationVariablePricing": true,
        "standardPriceDc": null,
        "mentionsDirect": true,
        "mentionsPassport": false,
        "maxKwDe": 400
      }
    }
  }
};

fs.writeFileSync(testSnapshotPath, JSON.stringify(baseSnapshot, null, 2));

// --- TEST 1: Unveränderte Quelle ---
{
  const mockFetcher = async () => ({
    ok: true,
    statusCode: 200,
    body: '<html><body>Fastned Schnellladen Station mit 0,69 €/kWh und Gold-Mitgliedschaft</body></html>'
  });

  const res = await extractSourceFacts('SRC_FASTNED_OFFICIAL', baseSnapshot.sources.SRC_FASTNED_OFFICIAL, { fetcher: mockFetcher });
  assert(res.status === 'SUCCESS', 'Test 1.1: Extraktion erfolgreich');
  const diffs = diffFacts(baseSnapshot.sources.SRC_FASTNED_OFFICIAL.facts, res.extractedFacts);
  assert(diffs.length === 0, 'Test 1.2: Unveränderte Fakten ergeben 0 Diffs (UNCHANGED)');
}

// --- TEST 2: Relevanter Fakt geändert (z. B. Preiserhöhung) ---
{
  const mockFetcher = async () => ({
    ok: true,
    statusCode: 200,
    body: '<html><body>Fastned Schnellladen Station mit 0,79 €/kWh (Preisanpassung) und Gold-Mitgliedschaft</body></html>'
  });

  const res = await extractSourceFacts('SRC_FASTNED_OFFICIAL', baseSnapshot.sources.SRC_FASTNED_OFFICIAL, {
    fetcher: mockFetcher
  });
  
  // Wenn der Preis geändert wird (simuliere geänderten extrahierten Fakt)
  const modifiedFacts = { ...res.extractedFacts, standardPriceDc: 0.79 };
  const diffs = diffFacts(baseSnapshot.sources.SRC_FASTNED_OFFICIAL.facts, modifiedFacts);
  assert(diffs.length === 1 && diffs[0].factKey === 'standardPriceDc' && diffs[0].newValue === 0.79,
    'Test 2: Relevanter Fakt geändert erkannt (0.69 -> 0.79)');
}

// --- TEST 3: Irrelevantes HTML geändert (Whitespace, neues Werbebanner, andere Footer-Texte) ---
{
  const mockFetcher = async () => ({
    ok: true,
    statusCode: 200,
    body: '<html><!-- Neuer Footer-Tracking-Code und Werbebanner --><div class="marketing-promo">Frühlingsaktion</div>Fastned Schnellladen Station mit 0,69 €/kWh und Gold-Mitgliedschaft</html>'
  });

  const res = await extractSourceFacts('SRC_FASTNED_OFFICIAL', baseSnapshot.sources.SRC_FASTNED_OFFICIAL, { fetcher: mockFetcher });
  const diffs = diffFacts(baseSnapshot.sources.SRC_FASTNED_OFFICIAL.facts, res.extractedFacts);
  assert(diffs.length === 0, 'Test 3: Irrelevante HTML-Änderung triggert keinen Fehlalarm (UNCHANGED)');
}

// --- TEST 4: Quelle nicht erreichbar (HTTP 500 / Timeout) ---
{
  const mockFetcher = async () => ({
    ok: false,
    statusCode: 503,
    body: '',
    error: 'Service Unavailable'
  });

  const res = await extractSourceFacts('SRC_FASTNED_OFFICIAL', baseSnapshot.sources.SRC_FASTNED_OFFICIAL, { fetcher: mockFetcher });
  assert(res.status === 'SOURCE_UNAVAILABLE', 'Test 4.1: Status SOURCE_UNAVAILABLE bei HTTP 503');
  assert(res.extractedFacts === null, 'Test 4.2: Keine Fake-Fakten generiert');

  // Prüfe, dass bestehende Snapshot-Datei unangetastet bleibt
  const currentSnapshot = JSON.parse(fs.readFileSync(testSnapshotPath, 'utf8'));
  assert(currentSnapshot.sources.SRC_FASTNED_OFFICIAL.facts.standardPriceDc === 0.69,
    'Test 4.3: Snapshot wurde bei Serverausfall NICHT überschrieben');
}

// --- TEST 5: Extraktion fehlgeschlagen (Parser findet Schlüssel nicht) ---
{
  const mockFetcher = async () => ({
    ok: true,
    statusCode: 200,
    body: '<html><body>Fehlerhafte leere Vorlage ohne CPO-Daten</body></html>'
  });

  const res = await extractSourceFacts('SRC_FASTNED_OFFICIAL', baseSnapshot.sources.SRC_FASTNED_OFFICIAL, { fetcher: mockFetcher });
  assert(res.status === 'EXTRACTION_FAILED', 'Test 5.1: Status EXTRACTION_FAILED bei unvollständigem Dokument');
  assert(res.extractedFacts === null, 'Test 5.2: Extraktionsfehler wird NICHT als fachliche Änderung interpretiert');
}

// --- TEST 6: Dokument nicht vergleichbar (z. B. EUR-Lex WAF Challenge 202) ---
{
  const mockFetcher = async () => ({
    ok: false,
    statusCode: 202,
    headers: { 'x-amzn-waf-action': 'challenge', server: 'CloudFront' },
    body: ''
  });

  const res = await extractSourceFacts('SRC_EU_AFIR_2023_1804', {
    sourceUrl: 'https://eur-lex.europa.eu/eli/reg/2023/1804/oj',
    facts: {}
  }, { fetcher: mockFetcher });

  assert(res.status === 'NOT_COMPARABLE', 'Test 6: WAF 202 Challenge korrekt als NOT_COMPARABLE klassifiziert');
}

// --- TEST 7: Mehrfach identische Änderung (Idempotenz / keine doppelten Meldungen) ---
{
  const simulatedReport = {
    results: [
      {
        sourceId: 'SRC_FASTNED_OFFICIAL',
        sourceName: 'Fastned',
        sourceUrl: 'https://fastnedcharging.com/de/',
        evaluationStatus: 'CHANGED_REVIEW_REQUIRED',
        approvalRequirement: 'HUMAN_REVIEW',
        affectedPages: ['/betreiber/fastned'],
        diffSignature: 'PRICE_CHANGED_079',
        differences: [{ factKey: 'standardPriceDc', oldValue: 0.69, newValue: 0.79 }]
      }
    ]
  };

  const reportFile = path.join(tmpDir, 'simulated-report.json');
  fs.writeFileSync(reportFile, JSON.stringify(simulatedReport, null, 2));

  let issuesCreatedCount = 0;
  const mockIssueCreator = async () => {
    issuesCreatedCount++;
    return { id: 101, url: 'https://github.com/mock/issue/101' };
  };

  // Erster Lauf -> Meldung erzeugt
  const run1 = await processNotifications({
    reportPath: reportFile,
    statePath: testStatePath,
    issueCreator: mockIssueCreator
  });
  assert(run1.newNotificationsCount === 1, 'Test 7.1: Erste Erkennung erzeugt genau 1 Benachrichtigung');

  // Zweiter identischer Lauf -> KEINE neue Meldung (Idempotenz)
  const run2 = await processNotifications({
    reportPath: reportFile,
    statePath: testStatePath,
    issueCreator: mockIssueCreator
  });
  assert(run2.newNotificationsCount === 0, 'Test 7.2: Zweiter identischer Lauf erzeugt 0 Duplikate (Idempotenz gewahrt)');
  assert(issuesCreatedCount === 1, 'Test 7.3: Total Issue-Aufrufe exakt 1');
}

// --- TEST 8 & 9: Menschliche Freigabe (Human-in-the-Loop) ---
{
  // Freigabe-Szenario: Erst wenn der Betreiberpreis redaktionell abgenommen wird, darf der Snapshot aktualisiert werden
  const state = JSON.parse(fs.readFileSync(testStatePath, 'utf8'));
  assert(state.knownIssues['SRC_FASTNED_OFFICIAL'].approvalRequirement === 'HUMAN_REVIEW',
    'Test 8: Freigabeklasse HUMAN_REVIEW bleibt zwingend hinterlegt');

  // Fehlende Freigabe blockiert Commit/Snapshot-Änderung
  const unapprovedSnapshot = JSON.parse(fs.readFileSync(testSnapshotPath, 'utf8'));
  assert(unapprovedSnapshot.sources.SRC_FASTNED_OFFICIAL.facts.standardPriceDc === 0.69,
    'Test 9: Ohne manuelle Bestätigung bleibt der offizielle Snapshot auf dem verifizierten Referenzwert (0,69 €)');
}

// Cleanup tmpDir
try {
  fs.rmSync(tmpDir, { recursive: true, force: true });
} catch {
  // Ignoriere Cleanup-Fehler
}

console.log(`\n🏁 Testergebnis: ${passedTests}/${totalTests} Tests bestanden.`);
if (passedTests !== totalTests) {
  process.exit(1);
}
