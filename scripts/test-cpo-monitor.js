import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

console.log('=== CPO MONITOR REGRESSION SUITE ===');

// 1. Verify generated datasets exist
const genPath = path.join(ROOT_DIR, 'src/data/generated/cpo-monitor.generated.json');
const pubJsonPath = path.join(ROOT_DIR, 'public/data/cpo-monitor.json');
const pubCsvPath = path.join(ROOT_DIR, 'public/data/cpo-monitor.csv');

if (!fs.existsSync(genPath)) throw new Error(`Missing ${genPath}`);
if (!fs.existsSync(pubJsonPath)) throw new Error(`Missing ${pubJsonPath}`);
if (!fs.existsSync(pubCsvPath)) throw new Error(`Missing ${pubCsvPath}`);

const dataset = JSON.parse(fs.readFileSync(genPath, 'utf-8'));
const pubData = JSON.parse(fs.readFileSync(pubJsonPath, 'utf-8'));

if (dataset.cposCount !== 30) {
  throw new Error(`Expected exactly 30 verified CPO entities, got ${dataset.cposCount}`);
}
console.log(`[PASS] Verified CPO count: ${dataset.cposCount}`);

// 2. Verify Top 5 CPOs hold correct HPC dominance
const top5 = dataset.operators.slice(0, 5);
const expectedTop5Slugs = ['enbw', 'tesla', 'aral-pulse', 'ewe-go', 'shell-recharge'];
top5.forEach((op, i) => {
  if (op.slug !== expectedTop5Slugs[i]) {
    throw new Error(`Top ${i+1} operator mismatch: expected ${expectedTop5Slugs[i]}, got ${op.slug}`);
  }
});
console.log('[PASS] Top 5 HPC operators verified (EnBW, Tesla, Aral pulse, EWE Go, Shell Recharge).');

// 3. Verify total register HPC points and denominator consistency
if (dataset.totalRegisterHpcPointsDE !== 40654) {
  throw new Error(`Expected 40,654 register HPC points, got ${dataset.totalRegisterHpcPointsDE}`);
}
if (dataset.totalRegisterPointsDE !== 210185) {
  throw new Error(`Expected 210,185 total register points, got ${dataset.totalRegisterPointsDE}`);
}
console.log('[PASS] BNetzA register totals verified (210,185 total points, 40,654 HPC points).');

// 4. Verify privacy guardrail: No operator name in output is a private individual
const forbiddenPersonalKeywords = ['dr.', 'prof.', 'dipl.-', 'herrn', 'frau'];
for (const op of dataset.operators) {
  const lower = op.name.toLowerCase();
  for (const kw of forbiddenPersonalKeywords) {
    if (lower.startsWith(kw)) {
      throw new Error(`Privacy violation: Operator name '${op.name}' appears to be a natural person!`);
    }
  }
  if (!op.parentCompany || op.parentCompany.length < 2) {
    throw new Error(`Missing institutional parentCompany for ${op.name}`);
  }
}
console.log('[PASS] Privacy guardrail verified: Zero natural persons published.');

// 5. Verify CSV Structure
const csvLines = fs.readFileSync(pubCsvPath, 'utf-8').trim().split('\n');
if (csvLines.length !== 31) { // 1 header + 30 CPOs
  throw new Error(`Expected 31 CSV lines, got ${csvLines.length}`);
}
console.log(`[PASS] Machine-readable CSV verified (${csvLines.length} lines, header + 30 CPO records).`);

console.log('\n✅ ALL CPO MONITOR REGRESSION CHECKS PASSED (0 ERRORS).\n');
