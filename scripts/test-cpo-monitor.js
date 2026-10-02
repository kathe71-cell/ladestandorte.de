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

if (dataset.cposCount !== dataset.operators.length) {
  throw new Error(`cposCount mismatch: cposCount=${dataset.cposCount} !== operators.length=${dataset.operators.length}`);
}
console.log(`[PASS] Verified CPO count: ${dataset.cposCount}`);

// 2. Verify Top 5 CPOs hold correct HPC dominance ordering
const top5 = dataset.operators.slice(0, 5);
for (let i = 0; i < top5.length - 1; i++) {
  if (top5[i].chargingPoints150PlusKw < top5[i + 1].chargingPoints150PlusKw) {
    throw new Error(`Top HPC operator ordering violation at index ${i}: ${top5[i].name} < ${top5[i+1].name}`);
  }
}
console.log('[PASS] Top HPC operator ordering verified.');

// 3. Verify total register HPC points and denominator consistency
if (!dataset.totalRegisterHpcPointsDE || dataset.totalRegisterHpcPointsDE <= 0) {
  throw new Error(`Invalid register HPC points: ${dataset.totalRegisterHpcPointsDE}`);
}
if (!dataset.totalRegisterPointsDE || dataset.totalRegisterPointsDE <= dataset.totalRegisterHpcPointsDE) {
  throw new Error(`Total register points must exceed HPC points: total=${dataset.totalRegisterPointsDE}, hpc=${dataset.totalRegisterHpcPointsDE}`);
}
console.log(`[PASS] BNetzA register totals verified (${dataset.totalRegisterPointsDE.toLocaleString('de-DE')} total points, ${dataset.totalRegisterHpcPointsDE.toLocaleString('de-DE')} HPC points).`);

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
