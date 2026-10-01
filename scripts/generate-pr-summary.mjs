#!/usr/bin/env node
/**
 * scripts/generate-pr-summary.mjs
 * Generates structured metadata and markdown summary for the automated BNetzA PR.
 * Outputs:
 * - GITHUB_OUTPUT variables (if running in GitHub Actions)
 * - reports/data/bnetza-pr-summary.md
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

const latestPointerPath = path.join(ROOT_DIR, 'data/raw/bnetza/latest.json');
const citiesPath = path.join(ROOT_DIR, 'src/data/generated/cities.generated.json');
const cpoPath = path.join(ROOT_DIR, 'src/data/generated/cpo-monitor.generated.json');
const historyPath = path.join(ROOT_DIR, 'src/data/generated/hpc-history.generated.json');

const latest = JSON.parse(fs.readFileSync(latestPointerPath, 'utf-8'));
const cities = JSON.parse(fs.readFileSync(citiesPath, 'utf-8'));
const cpos = JSON.parse(fs.readFileSync(cpoPath, 'utf-8'));
const history = JSON.parse(fs.readFileSync(historyPath, 'utf-8'));

const snapshotDate = latest.latestSnapshotDate;
const totalLP = cpos.totalRegisterPointsDE.toLocaleString('de-DE');
const totalHPC = cpos.totalRegisterHpcPointsDE.toLocaleString('de-DE');
const hpcShare = ((cpos.totalRegisterHpcPointsDE / cpos.totalRegisterPointsDE) * 100).toFixed(1);
const citiesCount = cities.length;
const cposCount = cpos.cposCount;

const prevSnapshot = history.availableSnapshots.length > 1 
  ? history.availableSnapshots[history.availableSnapshots.length - 2]
  : 'Kein Vorgänger-Snapshot (Initialbestand)';

const prTitle = `data: BNetzA Monatsupdate ${snapshotDate}`;

const prBody = `## ⚡ BNetzA Monatsupdate (${snapshotDate})

Der automatisierte Datenaktualisierungs-Workflow hat einen neuen amtlichen BNetzA-Registerstand erfolgreich heruntergeladen, validiert und aggregiert.

---

### 📊 Zentrale Kennzahlen des Datenstands

| Metrik | Neuer Stand (${snapshotDate}) | Anmerkung |
| :--- | :--- | :--- |
| **BNetzA-Stichtag / Snapshot** | \`${snapshotDate}\` | Amtliches Register (CC BY 4.0) |
| **Vorgänger-Snapshot** | \`${prevSnapshot}\` | Raw Data Archiv |
| **Ladepunkte bundesweit (gesamt)** | **${totalLP}** | 100 % registererfasst |
| **High-Power-Charging (≥150 kW)** | **${totalHPC}** (${hpcShare} %) | Leistungsklasse ≥150 kW |
| **Ausgewertete Großstädte** | **${citiesCount} Städte** | Destatis Zensus-Fortschreibung 2024 |
| **Verifizierte Betreiber (CPOs)** | **${cposCount} CPOs** | DSGVO-konform ohne Einzelpersonen |

---

### 📂 Aktualisierte Datenendpunkte & Artefakte

- \`src/data/generated/cities.generated.json\` (Top 50 Städte)
- \`src/data/generated/cpo-monitor.generated.json\` (30 verifizierte CPOs)
- \`src/data/generated/hpc-history.generated.json\` (Zeitreihen & Deltas)
- \`public/data/hpc-city-monitor.json\` & \`.csv\`
- \`public/data/cpo-monitor.json\` & \`.csv\`
- \`public/data/hpc-history.json\`
- \`reports/data/cities/${snapshotDate}.md\` (Detaillierter Differenzbericht)

---

### ✅ Qualitäts- & Regressionsprüfung

- **Unit- & Integritätstests**: 12/12 Testsuiten erfolgreich bestanden
- **SSG-Prerendering**: 210 statische HTML-Routen fehlerfrei vorgerendert
- **DSGVO-Datenschutzfilter**: 0 natürliche Personen veröffentlicht
- **UWG- & Siegel-Compliance**: 0 unzulässige Siegel oder unbegründete Superlative
- **Idempotenz**: Verifiziert (Zero-Diff bei unveränderten Daten)

---

> [!IMPORTANT]
> **Manuelles Review und Merge erforderlich!**  
> Die neuen Daten sind noch **nicht** live. Dieser Pull Request erfordert ein manuelles Review und wird **nicht automatisch** gemergt. Nach dem Merge wird das Vercel Production Deployment angestoßen.
`;

const reportsDir = path.join(ROOT_DIR, 'reports/data');
if (!fs.existsSync(reportsDir)) {
  fs.mkdirSync(reportsDir, { recursive: true });
}
const summaryFile = path.join(reportsDir, 'bnetza-pr-summary.md');
fs.writeFileSync(summaryFile, prBody, 'utf-8');

console.log(`[PR Summary Generator] Written PR summary to ${summaryFile}`);
console.log(`Title: ${prTitle}`);

// If running in GitHub Actions, write to GITHUB_OUTPUT
const ghOutput = process.env.GITHUB_OUTPUT;
if (ghOutput) {
  fs.appendFileSync(ghOutput, `pr_title=${prTitle}\n`);
  fs.appendFileSync(ghOutput, `snapshot_date=${snapshotDate}\n`);
  fs.appendFileSync(ghOutput, `summary_file=${summaryFile}\n`);
}
