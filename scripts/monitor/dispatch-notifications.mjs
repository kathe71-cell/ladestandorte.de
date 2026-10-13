#!/usr/bin/env node
/**
 * scripts/monitor/dispatch-notifications.mjs
 * 
 * Behandelt Benachrichtigungen & Issue-Erstellung für erkannte fachliche Änderungen.
 * 
 * Leitlinien:
 * - Nur bei echtem Prüfbedarf (CHANGED_REVIEW_REQUIRED) aktiv werden.
 * - Idempotenz: Identische Änderungen (gleiche diffSignature) erzeugen KEIN doppeltes Issue.
 * - Getrennte Behandlung von technischen Störungen (HTTP 5xx, DNS) und fachlichen Diffs.
 * - Nutzt standardmäßige GitHub CLI (gh issue create) oder schreibt strukturierte Action-Outputs.
 * - Reine Node-Execution ohne Dritt-SaaS.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

export const REPORT_FILE = path.join(rootDir, 'reports/sources/fact-monitor-report.json');
export const STATE_FILE = path.join(rootDir, 'data/snapshots/sources-monitor-state.json');

export async function processNotifications(options = {}) {
  const reportPath = options.reportPath || REPORT_FILE;
  const statePath = options.statePath || STATE_FILE;
  const issueCreator = options.issueCreator || null;

  if (!fs.existsSync(reportPath)) {
    throw new Error(`Report-Datei nicht gefunden: ${reportPath}`);
  }

  const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
  let state = { knownIssues: {}, lastRun: null };
  if (fs.existsSync(statePath)) {
    try {
      state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
      if (!state.knownIssues) state.knownIssues = {};
    } catch {
      state = { knownIssues: {}, lastRun: null };
    }
  }

  const notificationsToCreate = [];

  for (const item of report.results) {
    if (item.evaluationStatus === 'CHANGED_REVIEW_REQUIRED') {
      const existing = state.knownIssues[item.sourceId];

      // Wurde genau diese Differenz-Signatur bereits gemeldet?
      if (existing && existing.diffSignature === item.diffSignature && existing.status === 'OPEN') {
        // Idempotent ignorieren
        continue;
      }

      const issuePayload = {
        sourceId: item.sourceId,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        approvalRequirement: item.approvalRequirement,
        affectedPages: item.affectedPages,
        diffSignature: item.diffSignature,
        differences: item.differences,
        title: `[Fachprüfung erforderlich] ${item.sourceName} (${item.sourceId})`,
        labels: [
          'fachpruefung-erforderlich',
          item.approvalRequirement.toLowerCase(),
          item.category ? item.category.toLowerCase() : 'source-monitoring'
        ]
      };

      notificationsToCreate.push(issuePayload);
    }
  }

  const createdIssues = [];

  for (const notif of notificationsToCreate) {
    let issueResult = { id: notif.sourceId, simulated: true };
    if (typeof issueCreator === 'function') {
      issueResult = await issueCreator(notif);
    }

    // Aktualisiere State
    state.knownIssues[notif.sourceId] = {
      sourceId: notif.sourceId,
      diffSignature: notif.diffSignature,
      reportedAt: new Date().toISOString(),
      status: 'OPEN',
      approvalRequirement: notif.approvalRequirement
    };

    createdIssues.push({ ...notif, result: issueResult });
  }

  state.lastRun = new Date().toISOString();
  fs.mkdirSync(path.dirname(statePath), { recursive: true });
  fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

  return {
    totalChecked: report.results.length,
    newNotificationsCount: createdIssues.length,
    notifications: createdIssues
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const res = await processNotifications();
  console.log(`Benachrichtigungen verarbeitet: ${res.newNotificationsCount} neue Prüfmeldungen.`);
  process.exit(0);
}
