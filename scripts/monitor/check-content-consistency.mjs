#!/usr/bin/env node
/**
 * scripts/monitor/check-content-consistency.mjs
 * 
 * Automatisierte Fakten- und Regelprüfung (Phase H Quality Rules):
 * 
 * QR-01: VALID_SOURCE_URLS
 *        Alle sourceUrls in stations.ts müssen gültige HTTP(S)-URLs sein.
 * QR-02: OPERATOR_PRICING_INTEGRITY
 *        Wenn ein Betreiber standardPriceDc hat, muss dieser > 0 sein und tariffModel muss fixed_adhoc sein.
 *        Wenn tariffModel variable_station oder dynamic ist, darf kein starrer standardPriceDc definiert sein.
 * QR-03: POWER_CLASSIFICATION_INTEGRITY
 *        Ladepunkte < 150 kW dürfen nicht als HPC bezeichnet werden.
 * QR-04: AFIR_PAYMENT_RULE_COMPLIANCE
 *        Aussagen zu AFIR Art. 5 müssen klarstellen, dass Kartenzahlung für >= 50 kW seit 13.04.2024
 *        verpflichtend ist und ein QR-Code allein nicht genügt, ohne QR-Zahlung generell zu verbieten.
 * QR-05: NO_SUPERLATIVE_CLAIMS
 *        Keine unbelegten Superlative ("Testsieger", "Bestes Girokonto", "Offizielles Portal").
 * QR-06: THG_LEGAL_COMPLIANCE
 *        Keine unzutreffende Mindestmengenbegründung bezüglich UBA im THG-Ratgeber.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

console.log('================================================================');
console.log('⚖️  AUTOMATISIERTE FAKTEN- UND QUALITÄTSREGELN · LADESTANDORTE.DE');
console.log('================================================================');

let violations = 0;
const results = [];

function recordRule(id, name, severity, passed, message) {
  results.push({ id, name, severity, passed, message });
  if (passed) {
    console.log(`[PASS] [${id}] ${name}`);
  } else {
    console.error(`[FAIL] [${id}] [${severity}] ${name}: ${message}`);
    violations++;
  }
}

// 1. QR-01: VALID_SOURCE_URLS
try {
  const ssr = await import(path.join(rootDir, 'dist-ssr/entry-server.js'));
  const { STATIONS_DATA, OPERATORS_DATA } = ssr;

  let invalidUrls = 0;
  for (const st of STATIONS_DATA) {
    if (st.truckCharging?.sourceUrl) {
      try {
        new URL(st.truckCharging.sourceUrl);
      } catch {
        invalidUrls++;
      }
    }
  }
  recordRule('QR-01', 'VALID_SOURCE_URLS', 'HIGH', invalidUrls === 0, `${invalidUrls} ungültige Quell-URLs gefunden`);

  // 2. QR-02: OPERATOR_PRICING_INTEGRITY
  let pricingContradictions = 0;
  for (const op of OPERATORS_DATA) {
    if ((op.tariffModel === 'variable_station' || op.tariffModel === 'dynamic') && op.standardPriceDc !== null) {
      pricingContradictions++;
    }
    if (op.tariffModel === 'fixed_adhoc' && (!op.standardPriceDc || op.standardPriceDc <= 0)) {
      pricingContradictions++;
    }
  }
  recordRule('QR-02', 'OPERATOR_PRICING_INTEGRITY', 'HIGH', pricingContradictions === 0, `${pricingContradictions} widersprüchliche Betreiber-Tarifmodelle`);

  // 3. QR-03: POWER_CLASSIFICATION_INTEGRITY
  let falseHpcCount = 0;
  for (const st of STATIONS_DATA) {
    if (st.kwMax < 150 && st.isHpc === true) {
      falseHpcCount++;
    }
  }
  recordRule('QR-03', 'POWER_CLASSIFICATION_INTEGRITY', 'HIGH', falseHpcCount === 0, `${falseHpcCount} Ladestationen < 150 kW als HPC deklariert`);

} catch (err) {
  recordRule('QR-00', 'SSR_BUNDLE_READ', 'HIGH', false, `SSR-Bundle konnte nicht geladen werden: ${err.message}`);
}

// 4. QR-04: AFIR_PAYMENT_RULE_COMPLIANCE
const homePath = path.join(rootDir, 'src/pages/Home.tsx');
if (fs.existsSync(homePath)) {
  const content = fs.readFileSync(homePath, 'utf8');
  const hasArt5Mention = content.includes('Art. 5 Abs. 1');
  const hasQrSoloCheck = content.includes('ein QR-Code allein');
  recordRule('QR-04', 'AFIR_PAYMENT_RULE_COMPLIANCE', 'HIGH', hasArt5Mention && hasQrSoloCheck, 'AFIR Art. 5 Differenzierung unvollständig');
}

// 5. QR-05: NO_SUPERLATIVE_CLAIMS
const forbiddenSuperlatives = [/TESTSIEGER/i, /BESTES\s+GIROKONTO/i, /OFFIZIELLES\s+PORTAL/i];
let superlativeFound = false;
function checkTextFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      checkTextFiles(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const txt = fs.readFileSync(full, 'utf8');
      for (const p of forbiddenSuperlatives) {
        if (p.test(txt)) {
          superlativeFound = true;
        }
      }
    }
  }
}
checkTextFiles(path.join(rootDir, 'src'));
recordRule('QR-05', 'NO_SUPERLATIVE_CLAIMS', 'HIGH', !superlativeFound, 'Unzulässige Superlative in Quellcode gefunden');

// 6. QR-06: THG_LEGAL_COMPLIANCE
const thgPath = path.join(rootDir, 'src/pages/ThgPraemiePage.tsx');
if (fs.existsSync(thgPath)) {
  const txt = fs.readFileSync(thgPath, 'utf8');
  const hasNoMinClaim = !txt.includes('Mindestquotenmengen verlangt') && !txt.includes('Mindestmenge');
  recordRule('QR-06', 'THG_LEGAL_COMPLIANCE', 'HIGH', hasNoMinClaim, 'Unzutreffende UBA-Mindestmengenbegründung vorhanden');
}

console.log(`\n🏁 Qualitätsprüfung abgeschlossen: ${results.length - violations}/${results.length} Regeln erfüllt.`);

if (violations > 0) {
  process.exit(1);
} else {
  console.log('✅ ALLE QUALITÄTSREGELN ERFÜLLT.');
  process.exit(0);
}
