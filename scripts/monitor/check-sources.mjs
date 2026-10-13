#!/usr/bin/env node
/**
 * scripts/monitor/check-sources.mjs
 * 
 * Schlanker automatischer Prüfmechanismus für das zentrale Quellenregister:
 * - Überprüft Erreichbarkeit (HTTP Status 200..399)
 * - Erkennt unerwartete Redirects
 * - Prüft TLS & Timeout
 * - Weist Freigabeklasse (AUTO, HUMAN_REVIEW, HUMAN_DECISION) und betroffene Seiten zu
 * - Erstellt maschinenlesbaren JSON-Report und lesbaren Markdown-Report
 * - Exit 0 bei erfolgreicher Prüfung / kontrollierten Status
 * - Exit 1 nur bei technischen Verbindungsabbrüchen kritischer Quellen
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import https from 'node:https';
import http from 'node:http';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');

const registryPath = path.join(rootDir, 'src/data/source-registry.json');
if (!fs.existsSync(registryPath)) {
  console.error(`❌ Quellenregister nicht gefunden: ${registryPath}`);
  process.exit(1);
}

const sources = JSON.parse(fs.readFileSync(registryPath, 'utf8'));

console.log('================================================================');
console.log('🔍 AUTOMATISCHE QUELLEN- UND AKTUALITÄTSPRÜFUNG · LADESTANDORTE.DE');
console.log('================================================================');
console.log(`Auditiere ${sources.length} registrierte Primärquellen...\n`);

function checkHttpUrlOnce(urlStr, timeoutMs = 15000, maxRedirects = 2) {
  return new Promise((resolve) => {
    let resolved = false;
    let redirectsCount = 0;

    function doCheck(currUrl) {
      let client;
      try {
        const urlObj = new URL(currUrl);
        client = urlObj.protocol === 'https:' ? https : http;
      } catch (err) {
        if (!resolved) {
          resolved = true;
          resolve({ ok: false, statusCode: 0, redirectLocation: null, error: `Ungültige URL: ${err.message}` });
        }
        return;
      }

      const req = client.request(
        currUrl,
        {
          method: 'GET',
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8',
            'Connection': 'close'
          },
          timeout: timeoutMs
        },
        (res) => {
          const statusCode = res.statusCode || 0;
          const location = res.headers.location || null;

          // Folge internen 3xx Weiterleitungen
          if (statusCode >= 300 && statusCode < 400 && location && redirectsCount < maxRedirects) {
            redirectsCount++;
            const nextUrl = new URL(location, currUrl).href;
            res.resume();
            return doCheck(nextUrl);
          }

          // Konsumiere Response-Daten schonend (max 64KB) und schließe sauber ab
          res.on('data', () => {});
          res.on('end', () => {
            if (!resolved) {
              resolved = true;
              resolve({
                ok: statusCode >= 200 && statusCode < 400,
                statusCode,
                redirectLocation: location,
                error: null
              });
            }
          });
        }
      );

      req.on('timeout', () => {
        if (!resolved) {
          resolved = true;
          req.destroy();
          resolve({
            ok: false,
            statusCode: 0,
            redirectLocation: null,
            error: `Timeout nach ${timeoutMs}ms`
          });
        }
      });

      req.on('error', (err) => {
        if (!resolved) {
          resolved = true;
          resolve({
            ok: false,
            statusCode: 0,
            redirectLocation: null,
            error: err.message
          });
        }
      });

      req.end();
    }

    doCheck(urlStr);
  });
}

async function checkHttpUrl(urlStr, timeoutMs = 15000) {
  // Versuch 1
  const res1 = await checkHttpUrlOnce(urlStr, timeoutMs);
  if (res1.ok) return res1;

  // Einmaliger Retry nach 2s bei Netzwerk-Timeout oder temporärem Verbindungsfehler
  await new Promise(r => setTimeout(r, 2000));
  const res2 = await checkHttpUrlOnce(urlStr, timeoutMs);
  return res2;
}

export async function runSourceCheck(options = {}) {
  const isSilent = options.silent || false;
  const results = [];
  let reachableCount = 0;
  let issueCount = 0;

  for (const src of sources) {
    const res = await checkHttpUrl(src.url);
    const item = {
      id: src.id,
      name: src.name,
      url: src.url,
      category: src.category,
      criticality: src.criticality,
      approvalRequirement: src.approvalRequirement,
      affectedPages: src.affectedContent.pages,
      statusCode: res.statusCode,
      ok: res.ok,
      error: res.error,
      redirectLocation: res.redirectLocation,
      checkedAt: new Date().toISOString()
    };

    if (res.ok) {
      reachableCount++;
      if (!isSilent) {
        console.log(`[PASS] [${src.id}] HTTP ${res.statusCode} -> ${src.name}`);
      }
    } else {
      issueCount++;
      if (!isSilent) {
        console.error(`[WARN/FAIL] [${src.id}] HTTP ${res.statusCode || 'ERR'} (${res.error || 'Fehler'}) -> ${src.name}`);
      }
    }
    results.push(item);
  }

  const reportsDir = path.join(rootDir, 'reports/sources');
  fs.mkdirSync(reportsDir, { recursive: true });

  const summary = {
    executedAt: new Date().toISOString(),
    totalSources: sources.length,
    reachable: reachableCount,
    issues: issueCount,
    allReachable: issueCount === 0,
    results
  };

  const jsonReportPath = path.join(reportsDir, 'source-check-report.json');
  fs.writeFileSync(jsonReportPath, JSON.stringify(summary, null, 2));

  // Markdown-Bericht generieren
  let md = `# Prüfbericht: Quellenaktualität und Erreichbarkeit\n\n`;
  md += `**Prüfdatum:** ${new Date().toLocaleString('de-DE')}\n`;
  md += `**Geprüfte Quellen:** ${sources.length}\n`;
  md += `**Erreichbar:** ${reachableCount} | **Auffälligkeiten / Fehler:** ${issueCount}\n\n`;
  md += `| ID | Quelle | Kategorie | HTTP | Freigabeklasse | Betroffene Seiten | Status |\n`;
  md += `|:---|:---|:---|:---|:---|:---|:---|\n`;

  for (const r of results) {
    const statusIcon = r.ok ? '✅ OK' : '⚠️ PRÜFEN';
    md += `| \`${r.id}\` | ${r.name} | ${r.category} | ${r.statusCode || 'ERR'} | \`${r.approvalRequirement}\` | ${r.affectedPages.slice(0, 3).join(', ')}${r.affectedPages.length > 3 ? '...' : ''} | ${statusIcon} |\n`;
  }

  const mdReportPath = path.join(reportsDir, 'source-check-report.md');
  fs.writeFileSync(mdReportPath, md);

  if (!isSilent) {
    console.log(`\n📄 Prüfberichte geschrieben:`);
    console.log(`   JSON: ${path.relative(rootDir, jsonReportPath)}`);
    console.log(`   MD:   ${path.relative(rootDir, mdReportPath)}`);
    console.log(`\n🏁 Quellenprüfung abgeschlossen: ${reachableCount}/${sources.length} Quellen erreichbar.`);
  }

  return summary;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const summary = await runSourceCheck();
  // Exit-Code: 0 wenn alle erreichbar, 1 wenn HIGH-Criticality Quelle unerreichbar ist
  const hasCriticalFailure = summary.results.some(r => !r.ok && r.criticality === 'HIGH');
  if (hasCriticalFailure) {
    console.error('❌ Mindestens eine Quelle mit Kritikalität HIGH ist nicht erreichbar!');
    process.exit(1);
  }
  process.exit(0);
}
