import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('=== SOURCE REGISTRY INTEGRITY TEST ===');

let failures = 0;

const registryFile = path.join(rootDir, 'src/data/source-registry.json');
if (!fs.existsSync(registryFile)) {
  console.error('❌ src/data/source-registry.json fehlt!');
  process.exit(1);
}

const sources = JSON.parse(fs.readFileSync(registryFile, 'utf8'));

// 1. Array-Prüfung
if (!Array.isArray(sources) || sources.length === 0) {
  console.error('❌ Quellenregister ist leer oder kein Array!');
  failures++;
} else {
  console.log(`[PASS] Quellenregister enthält ${sources.length} Einträge.`);
}

// 2. Eindeutige IDs
const ids = new Set();
for (const s of sources) {
  if (!s.id) {
    console.error('❌ Quelle ohne ID gefunden!');
    failures++;
  } else if (ids.has(s.id)) {
    console.error(`❌ Doppelte Quellen-ID gefunden: ${s.id}`);
    failures++;
  } else {
    ids.add(s.id);
  }
}
console.log(`[PASS] Alle ${ids.size} Quellen-IDs sind eindeutig.`);

// 3. Gültige URLs
for (const s of sources) {
  try {
    const u = new URL(s.url);
    if (u.protocol !== 'http:' && u.protocol !== 'https:') {
      console.error(`❌ Ungültiges URL-Protokoll bei ${s.id}: ${s.url}`);
      failures++;
    }
  } catch (e) {
    console.error(`❌ Ungültige URL bei ${s.id}: ${s.url}`);
    failures++;
  }
}
console.log('[PASS] Alle Quellen-URLs sind syntaktisch valide HTTP(S)-URLs.');

// 4. Pflichtfelder & Freigabeklassen
const validApprovals = ['AUTO', 'HUMAN_REVIEW', 'HUMAN_DECISION'];
const validCategories = [
  'REGISTRY_DATA',
  'OPERATOR_PRICING',
  'OPERATOR_TECHNICAL',
  'LEGAL_REGULATORY',
  'THG',
  'MCS_INFRASTRUCTURE',
  'METHODOLOGY'
];

for (const s of sources) {
  if (!validApprovals.includes(s.approvalRequirement)) {
    console.error(`❌ Ungültige Freigabeklasse bei ${s.id}: ${s.approvalRequirement}`);
    failures++;
  }
  if (!validCategories.includes(s.category)) {
    console.error(`❌ Ungültige Kategorie bei ${s.id}: ${s.category}`);
    failures++;
  }
  if (!s.affectedContent || !Array.isArray(s.affectedContent.pages) || s.affectedContent.pages.length === 0) {
    console.error(`❌ Fehlende betroffene Seiten bei ${s.id}`);
    failures++;
  }
}
console.log('[PASS] Alle Pflichtfelder, Kategorien und Freigabeklassen sind valide.');

if (failures > 0) {
  console.error(`\n❌ ${failures} Fehler bei der Validierung des Quellenregisters!`);
  process.exit(1);
} else {
  console.log('\n✅ QUELLENREGISTER VOLLSTÄNDIG VALIDE.');
  process.exit(0);
}
