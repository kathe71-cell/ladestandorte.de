import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

async function runProvenanceLint() {
  console.log('🔍 Starting Data Provenance & Brand Integrity Linter...');

  let errors = 0;
  let warnings = 0;

  // 1. Check for forbidden legacy / unverified strings across src/
  const forbiddenPatterns = [
    { pattern: /\btotalChargingHubs\b/, desc: 'Legacy totalChargingHubs property in data structures' },
    { pattern: /\btopHubs\b/, desc: 'Legacy topHubs property in data structures' },
    { pattern: /\bappRating\b/, desc: 'Unverified appRating in data structures' },
    { pattern: /4\.6\s*App\s*Store/i, desc: 'Unverified 4.6 App Store / Play Store rating claim' },
    { pattern: /83\s*Ladehubs/i, desc: 'Legacy 83 Ladehubs count' },
    { pattern: /42\s*Schnelllade-Hubs/i, desc: 'Legacy 42 Schnelllade-Hubs metric' },
    { pattern: /Frankenwald\s*West/i, desc: 'Legacy incorrect station Frankenwald West' },
    { pattern: /Schkeuditzer\s*Kreuz/i, desc: 'Legacy incorrect station Schkeuditzer Kreuz' },
    { pattern: /Marktführer\s+Deutschland/i, desc: 'Unverified superlative Marktführer' },
    { pattern: /(?:name|title|description|text|headline):\s*["'][^"']*Flagship[^"']*["']/i, desc: 'Marketing buzzword Flagship in visible content' },
    { pattern: /Megahub/i, desc: 'Marketing buzzword Megahub' },
    { pattern: /DE\*[A-Z]{3}\*E\d{5}01/, desc: 'Synthetic PLZ-derived bnetzaId EVSE mock pattern' }
  ];

  function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const full = path.join(dir, file);
      const stat = fs.statSync(full);
      if (stat && stat.isDirectory()) {
        results = results.concat(walk(full));
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        results.push(full);
      }
    }
    return results;
  }

  const srcFiles = walk(path.join(rootDir, 'src'));

  for (const file of srcFiles) {
    const content = fs.readFileSync(file, 'utf8');
    for (const { pattern, desc } of forbiddenPatterns) {
      if (pattern.test(content)) {
        console.error(`❌ [LINTER ERROR] ${desc} found in ${path.relative(rootDir, file)}`);
        errors++;
      }
    }
  }

  // 2. Validate Stations & Operators integrity via SSR bundle
  try {
    const ssr = await import(path.join(rootDir, 'dist-ssr/entry-server.js'));
    const { STATIONS_DATA, OPERATORS_DATA, isIndexableLocation } = ssr;

    const indexable = STATIONS_DATA.filter(isIndexableLocation);
    console.log(`ℹ️ Auditing ${indexable.length} indexable stations and ${OPERATORS_DATA.length} operators...`);

    for (const st of indexable) {
      // Rule A: Full geographic data
      if (!st.street || !st.plz || !st.city || !st.lat || !st.lng) {
        console.error(`❌ [LINTER ERROR] Station [${st.id}] has incomplete geographic data`);
        errors++;
      }

      // Rule B: Operator relation integrity
      // If operatorSlug matches an OPERATORS_DATA entity, the names must correspond
      const op = OPERATORS_DATA.find((o) => o.slug === st.operatorSlug);
      if (op) {
        const normOpName = op.name.toLowerCase().replace(/[^a-z0-9]/g, '');
        const normStOp = st.operator.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (!normStOp.includes(normOpName) && !normOpName.includes(normStOp)) {
          console.error(`❌ [LINTER ERROR] Station [${st.id}] operator name mismatch: "${st.operator}" links to operator profile "${op.name}" (${st.operatorSlug})`);
          errors++;
        }
      }

      // Rule C: Exit distance qualification
      if (st.exitDistance && st.exitDistance.includes(' m von ') && !st.exitDistance.includes('berechnet')) {
        console.error(`❌ [LINTER ERROR] Station [${st.id}] has unverified exit distance without calculation source: "${st.exitDistance}"`);
        errors++;
      }

      // Rule D: MCS stations integrity
      if (st.truckCharging?.supported) {
        if (!st.truckCharging.source || !st.truckCharging.provenance) {
          console.error(`❌ [LINTER ERROR] MCS Station [${st.id}] missing explicit source or provenance`);
          errors++;
        }
        if (st.truckCharging.mcsStatus === 'unknown') {
          console.warn(`⚠️ [LINTER WARNING] MCS Station [${st.id}] has unknown mcsStatus`);
          warnings++;
        }
      }
    }
  } catch (err) {
    console.warn(`⚠️ Skipping live entity check (dist-ssr not yet built): ${err.message}`);
  }

  console.log(`\n🏁 Data Provenance Linter finished: ${errors} errors, ${warnings} warnings.`);
  if (errors > 0) {
    process.exit(1);
  }
}

runProvenanceLint();
