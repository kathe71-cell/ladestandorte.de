import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

console.log('=== DOSSIER COUNTER & TRUST CLAIM AUDIT TEST ===');

let failures = 0;
let ssrModule = null;

// 1. Verify dynamic dossier count matches indexable stations definition
try {
  ssrModule = await import(path.join(rootDir, 'dist-ssr/entry-server.js'));
  const { STATIONS_DATA, isIndexableLocation, getDossierCount, getMotorwayDossiers, MOTORWAYS_DATA } = ssrModule;

  const expectedDossierCount = STATIONS_DATA.filter(isIndexableLocation).length;
  const actualDossierCount = getDossierCount();

  if (actualDossierCount !== expectedDossierCount) {
    console.error(`[FAIL] getDossierCount() (${actualDossierCount}) !== indexable count (${expectedDossierCount})`);
    failures++;
  } else {
    console.log(`[PASS] getDossierCount() correctly equals indexable stations count (${actualDossierCount}).`);
  }

  if (expectedDossierCount <= 0) {
    console.error(`[FAIL] Expected dossier count must be > 0, got ${expectedDossierCount}`);
    failures++;
  }

  // Check motorway dossiers consistency
  let totalMotorwayDossiers = 0;
  for (const m of MOTORWAYS_DATA) {
    const list = getMotorwayDossiers(m.slug);
    // Every station in list must be indexable
    const nonIndexable = list.filter(s => !isIndexableLocation(s));
    if (nonIndexable.length > 0) {
      console.error(`[FAIL] getMotorwayDossiers("${m.slug}") returned non-indexable stations:`, nonIndexable.map(s => s.id));
      failures++;
    }
    totalMotorwayDossiers += list.length;
  }
  console.log(`[PASS] getMotorwayDossiers verified across all ${MOTORWAYS_DATA.length} motorways (${totalMotorwayDossiers} motorway dossiers).`);

} catch (e) {
  console.error('[CRASH] SSR module import failed:', e.message);
  failures++;
}

// 2. Scan all generated HTML files in dist/ for banned BNetzA-claim phrases
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith('.html')) {
      results.push(full);
    }
  }
  return results;
}

const distHtmlFiles = walk(path.join(rootDir, 'dist'));
console.log(`Auditing ${distHtmlFiles.length} generated HTML files in dist/...`);

const forbiddenPhrases = [
  { phrase: 'BNetzA-geprüfte Großhubs', regex: /BNetzA-geprüfte\s+Großhubs/i },
  { phrase: 'BNetzA-geprüft', regex: /BNetzA-geprüft/i },
  { phrase: 'BNetzA geprüft', regex: /BNetzA\s+geprüft/i },
  { phrase: 'Verifizierte BNetzA-Ladeparks', regex: /Verifizierte\s+BNetzA-Ladeparks/i }
];

let forbiddenFound = 0;
for (const file of distHtmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const relPath = path.relative(rootDir, file);

  for (const { phrase, regex } of forbiddenPhrases) {
    if (regex.test(content)) {
      console.error(`[FAIL] Banned phrase "${phrase}" found in ${relPath}`);
      failures++;
      forbiddenFound++;
    }
  }
}

if (forbiddenFound === 0) {
  console.log('[PASS] Zero banned BNetzA claim phrases found in all dist HTML files.');
}

// 3. Check Motorway Pages Zero-State & Dynamic Counts
if (ssrModule) {
  const { MOTORWAYS_DATA, getMotorwayDossiers } = ssrModule;
  let verifiedMotorwayPages = 0;

  for (const m of MOTORWAYS_DATA) {
    const filePath = path.join(rootDir, 'dist', 'autobahnen', m.slug, 'index.html');
    if (!fs.existsSync(filePath)) {
      console.error(`[FAIL] Motorway HTML file missing: dist/autobahnen/${m.slug}/index.html`);
      failures++;
      continue;
    }

    const html = fs.readFileSync(filePath, 'utf8');
    const dossiers = getMotorwayDossiers(m.slug);

    if (dossiers.length === 0) {
      // Must NOT render visible "0 Dossiers" or "0<!-- --> Dossiers"
      if (html.includes('0 Dossiers') || html.includes('0<!-- --> Dossiers')) {
        console.error(`[FAIL] /autobahnen/${m.slug} has 0 dossiers but still renders "0 Dossiers"!`);
        failures++;
      }
      // Must NOT render "Verifizierte Ladeparks" KPI tile when 0
      if (html.includes('Verifizierte Ladeparks')) {
        console.error(`[FAIL] /autobahnen/${m.slug} has 0 dossiers but renders "Verifizierte Ladeparks" KPI!`);
        failures++;
      }
    } else {
      // Must render exact dynamic count
      const expectedKpi1 = `${dossiers.length} Dossiers`;
      const expectedKpi2 = `${dossiers.length}<!-- --> Dossiers`;
      if (!html.includes(expectedKpi1) && !html.includes(expectedKpi2)) {
        console.error(`[FAIL] /autobahnen/${m.slug} has ${dossiers.length} dossiers but does not render "${expectedKpi1}"!`);
        failures++;
      }
      if (!html.includes('Quellenbasiert dokumentiert')) {
        console.error(`[FAIL] /autobahnen/${m.slug} missing "Quellenbasiert dokumentiert" claim subtitle!`);
        failures++;
      }
    }
    verifiedMotorwayPages++;
  }

  console.log(`[PASS] Verified zero-state and dynamic counts across all ${verifiedMotorwayPages} motorway pages.`);
}

console.log(`\nAudit completed: ${failures} failure(s).`);
if (failures > 0) {
  process.exit(1);
} else {
  console.log('✅ ALL DOSSIER & CLAIM TESTS PASSED.');
}
