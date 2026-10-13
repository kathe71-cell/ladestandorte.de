#!/usr/bin/env node
/**
 * scripts/monitor/create-github-issues.mjs
 * 
 * Erzeugt GitHub Issues über die offizielle GitHub CLI (gh) oder schreibt
 * GitHub Step Summaries / Env-Variablen für GitHub Actions.
 * 
 * - Idempotenz über state-file (data/snapshots/sources-monitor-state.json)
 * - Verhindert Duplicate Issues
 * - Getrennte Behandlung von technischen Ausfällen und fachlichen Änderungen
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import { processNotifications } from './dispatch-notifications.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

async function issueCreator(notif) {
  const hasGhCli = Boolean(process.env.GITHUB_TOKEN || process.env.GH_TOKEN);
  
  const body = `## 🔍 Fachprüfung erforderlich für: ${notif.sourceName}

**Quelle:** [${notif.sourceUrl}](${notif.sourceUrl})
**Quellen-ID:** \`${notif.sourceId}\`
**Erforderliche Freigabeklasse:** \`${notif.approvalRequirement}\`
**Prüfsignatur:** \`${notif.diffSignature}\`

---

### 📋 Erkannte Fakten-Änderungen:
${notif.differences.map(d => `- **\`${d.factKey}\`**: \`${JSON.stringify(d.oldValue)}\` ➔ \`${JSON.stringify(d.newValue)}\``).join('\n')}

---

### 📄 Betroffene Website-Seiten:
${notif.affectedPages.map(p => `- [https://www.ladestandorte.de${p}](https://www.ladestandorte.de${p})`).join('\n')}

---

### 🛡️ Human-in-the-Loop Freigabe-Instruktionen:
1. Prüfen Sie die offizielle Quelle: [${notif.sourceUrl}](${notif.sourceUrl}).
2. Verifizieren Sie, ob die Änderung redaktionell / rechtlich freigegeben werden soll.
3. Bei Freigabe: Aktualisieren Sie die betroffenen Seiten bzw. Datensätze und den Snapshot in \`data/snapshots/sources-fact-snapshots.json\`.
4. Schließen Sie dieses Issue mit Vermerk zur Freigabe.
`;

  if (hasGhCli) {
    try {
      const labelsArg = notif.labels.join(',');
      const cmd = `gh issue create --title "${notif.title.replace(/"/g, '\\"')}" --body "${body.replace(/"/g, '\\"')}" --label "${labelsArg}"`;
      const stdout = execSync(cmd, { cwd: rootDir, encoding: 'utf8' });
      console.log(`[GITHUB ISSUE CREATED] ${stdout.trim()}`);
      return { url: stdout.trim(), created: true };
    } catch (err) {
      console.warn(`[GITHUB ISSUE WARNING] CLI-Erstellung fehlgeschlagen: ${err.message}. Simuliere Benachrichtigung.`);
      return { created: false, error: err.message };
    }
  } else {
    console.log(`[LOCAL NOTICE] Neues Issue würde erstellt: "${notif.title}" (kein GitHub-Token in lokaler Umgebung)`);
    return { created: false, localSimulated: true };
  }
}

const summary = await processNotifications({ issueCreator });
console.log(`\nIssue-Dispatch abgeschlossen: ${summary.newNotificationsCount} neue Benachrichtigungen.`);
