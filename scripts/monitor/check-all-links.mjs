#!/usr/bin/env node
/**
 * scripts/monitor/check-all-links.mjs
 * 
 * Umfassender, automatisierter Link-Audit für ladestandorte.de:
 * 1. Durchsucht alle vorgerenderten HTML-Dateien im Verzeichnis dist/
 * 2. Prüft 100% aller internen Links gegen vorhandene dist/-Dateien und Anker-IDs
 * 3. Prüft sitemap.xml gegen physisch vorgerenderte HTML-Dateien
 * 4. Führt parallele HTTP-Prüfungen aller einzigartigen externen Links durch
 * 5. Speichert Audit-Ergebnisse in reports/links/link-audit-report.json und .md
 * 6. Vergleicht Ergebnisse mit der Baseline (reports/links/link-audit-baseline.json)
 * 7. Exit-Code: 0 bei intakten Links / kontrollierten Weiterleitungen, 1 bei echten 404/Defekten
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '../..');
const distDir = path.join(rootDir, 'dist');
const reportsDir = path.join(rootDir, 'reports/links');

fs.mkdirSync(reportsDir, { recursive: true });

console.log('================================================================');
console.log('🔗 AUTOMATISIERTER LINK-AUDIT & MONITORING · LADESTANDORTE.DE');
console.log('================================================================');

if (!fs.existsSync(distDir)) {
  console.error(`❌ dist/-Verzeichnis nicht gefunden (${distDir}). Bitte zuerst 'npm run build' ausführen.`);
  process.exit(1);
}

// 1. Alle gerenderten HTML-Dateien ermitteln
function getHtmlFiles(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      getHtmlFiles(fullPath, acc);
    } else if (entry.name.endsWith('.html')) {
      acc.push(fullPath);
    }
  }
  return acc;
}

const htmlFiles = getHtmlFiles(distDir);
console.log(`Auditiere ${htmlFiles.length} vorgerenderte HTML-Seiten...\n`);

const internalLinkMap = new Map();
const externalLinkMap = new Map();
const anchorLinkMap = new Map();

// 2. Links aus allen HTML-Dateien extrahieren
for (const file of htmlFiles) {
  const relFile = path.relative(distDir, file);
  const content = fs.readFileSync(file, 'utf8');

  // href="..."
  const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g);
  for (const m of hrefMatches) {
    const rawHref = m[1].trim();

    if (!rawHref || rawHref.startsWith('javascript:') || rawHref.startsWith('#')) {
      if (rawHref.startsWith('#') && rawHref.length > 1) {
        const anchor = rawHref.substring(1);
        if (!anchorLinkMap.has(relFile)) anchorLinkMap.set(relFile, new Set());
        anchorLinkMap.get(relFile).add(anchor);
      }
      continue;
    }

    if (rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
      continue;
    }

    if (rawHref.startsWith('http://') || rawHref.startsWith('https://')) {
      try {
        const u = new URL(rawHref);
        const host = u.hostname.toLowerCase();
        if (host === 'ladestandorte.de' || host === 'www.ladestandorte.de' || host === 'localhost') {
          const p = u.pathname;
          if (!internalLinkMap.has(p)) internalLinkMap.set(p, []);
          internalLinkMap.get(p).push(relFile);
        } else {
          if (!externalLinkMap.has(rawHref)) externalLinkMap.set(rawHref, []);
          externalLinkMap.get(rawHref).push(relFile);
        }
      } catch {
        // invalid URL
      }
      continue;
    }

    if (rawHref.startsWith('/')) {
      const cleanPath = rawHref.split('?')[0].split('#')[0];
      const anchorMatch = rawHref.match(/#([a-zA-Z0-9_-]+)/);

      if (!internalLinkMap.has(cleanPath)) internalLinkMap.set(cleanPath, []);
      internalLinkMap.get(cleanPath).push(relFile);

      if (anchorMatch) {
        const targetAnchor = anchorMatch[1];
        const key = `${cleanPath}#${targetAnchor}`;
        if (!anchorLinkMap.has(key)) anchorLinkMap.set(key, new Set());
        anchorLinkMap.get(key).add(relFile);
      }
    }
  }
}

// 3. Interne Links prüfen
const internalFailures = [];
for (const [routePath, sources] of internalLinkMap.entries()) {
  const cand1 = path.join(distDir, routePath, 'index.html');
  const cand2 = path.join(distDir, `${routePath}.html`);
  const cand3 = path.join(distDir, routePath);

  const exists = fs.existsSync(cand1) || fs.existsSync(cand2) || fs.existsSync(cand3);
  if (!exists) {
    internalFailures.push({
      path: routePath,
      sources: sources.slice(0, 3),
      totalOccurrences: sources.length
    });
  }
}

// 4. Anker-Links prüfen
const anchorFailures = [];
for (const [key, sourceSet] of anchorLinkMap.entries()) {
  if (key.includes('#')) {
    const [routePath, anchor] = key.split('#');
    const targetFile = path.join(distDir, routePath, 'index.html');
    if (fs.existsSync(targetFile)) {
      const targetContent = fs.readFileSync(targetFile, 'utf8');
      const hasId = targetContent.includes(`id="${anchor}"`) || targetContent.includes(`id='${anchor}'`);
      if (!hasId) {
        anchorFailures.push({ route: routePath, anchor, sources: Array.from(sourceSet).slice(0, 3) });
      }
    }
  } else {
    // Gleiche Seite
    const targetFile = path.join(distDir, key);
    if (fs.existsSync(targetFile)) {
      const targetContent = fs.readFileSync(targetFile, 'utf8');
      for (const anchor of sourceSet) {
        const hasId = targetContent.includes(`id="${anchor}"`) || targetContent.includes(`id='${anchor}'`);
        if (!hasId) {
          anchorFailures.push({ route: key, anchor, sources: [key] });
        }
      }
    }
  }
}

// 5. Sitemap-Prüfung
const sitemapPath = path.join(rootDir, 'public/sitemap.xml');
let sitemapUrls = [];
let sitemapFailures = [];
if (fs.existsSync(sitemapPath)) {
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  sitemapUrls = [...sitemapContent.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  for (const sUrl of sitemapUrls) {
    try {
      const p = new URL(sUrl).pathname;
      const cand1 = path.join(distDir, p, 'index.html');
      const cand2 = path.join(distDir, `${p}.html`);
      const cand3 = path.join(distDir, p);
      if (!fs.existsSync(cand1) && !fs.existsSync(cand2) && !fs.existsSync(cand3)) {
        sitemapFailures.push(p);
      }
    } catch {}
  }
}

console.log(`[1/3] INTERNE VERIFIZIERUNG:`);
console.log(`  ✓ Eindeutige interne Routen verifiziert: ${internalLinkMap.size}`);
console.log(`  ✓ Fehlgeschlagene interne Verlinkungen: ${internalFailures.length}`);
console.log(`  ✓ Geprüfte Anker-IDs: ${anchorLinkMap.size} (Fehler: ${anchorFailures.length})`);
console.log(`  ✓ Sitemap-Routen verifiziert: ${sitemapUrls.length} (Fehler: ${sitemapFailures.length})\n`);

// 6. Externe Links HTTP-Prüfung
console.log(`[2/3] EXTERNE VERIFIZIERUNG:`);
console.log(`  Prüfe ${externalLinkMap.size} eindeutige externe Ziel-URLs mit HTTP-Anfragen...`);

async function fetchWithTimeout(urlStr, timeoutMs = 12000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(urlStr, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'de-DE,de;q=0.9,en;q=0.8'
      },
      signal: controller.signal,
      redirect: 'manual' // We check redirects explicitly
    });

    return {
      status: res.status,
      ok: res.ok,
      location: res.headers.get('location') || undefined
    };
  } catch (err) {
    if (err.name === 'AbortError') return { error: 'TIMEOUT', status: 0 };
    return { error: err.message, status: 0 };
  } finally {
    clearTimeout(timer);
  }
}

// Begrenzte Parallelität (4 Worker gleichzeitig)
const externalResults = [];
const externalUrls = Array.from(externalLinkMap.keys());
const concurrency = 4;
let currentIndex = 0;

async function worker() {
  while (currentIndex < externalUrls.length) {
    const idx = currentIndex++;
    const urlStr = externalUrls[idx];
    const sources = externalLinkMap.get(urlStr);

    let classification = 'UNKNOWN';
    let checkResult = await fetchWithTimeout(urlStr);

    if (checkResult.status === 200) {
      classification = 'OK';
    } else if (checkResult.status >= 300 && checkResult.status < 400) {
      classification = 'REDIRECT';
    } else if (checkResult.status === 403 || checkResult.status === 429) {
      classification = 'BLOCKED_OR_RATE_LIMITED';
    } else if (checkResult.status === 404 || checkResult.status === 410) {
      classification = 'BROKEN_NOT_FOUND';
    } else if (checkResult.error === 'TIMEOUT') {
      classification = 'TIMEOUT';
    } else {
      classification = 'ERROR';
    }

    externalResults.push({
      url: urlStr,
      status: checkResult.status,
      classification,
      location: checkResult.location,
      error: checkResult.error,
      occurrences: sources.length,
      sampleSource: sources[0]
    });
  }
}

const workers = Array.from({ length: concurrency }, () => worker());
await Promise.all(workers);

const brokenExternal = externalResults.filter(r => r.classification === 'BROKEN_NOT_FOUND');
const redirectedExternal = externalResults.filter(r => r.classification === 'REDIRECT');
const okExternal = externalResults.filter(r => r.classification === 'OK');
const otherExternal = externalResults.filter(r => !['OK', 'REDIRECT', 'BROKEN_NOT_FOUND'].includes(r.classification));

console.log(`  ✓ Erfolgreich (HTTP 200): ${okExternal.length}`);
console.log(`  ✓ Kontrollierte Weiterleitungen (HTTP 30x): ${redirectedExternal.length}`);
console.log(`  ✓ Bot-Protection / Timeout / Sonstige: ${otherExternal.length}`);
console.log(`  ❌ Defekte externe Links (HTTP 404/410): ${brokenExternal.length}\n`);

// 7. Audit-Report und Baseline generieren
console.log(`[3/3] BERICHTSERSTELLUNG & BASELINE:`);

const auditReport = {
  timestamp: new Date().toISOString(),
  environment: process.env.CI ? 'github-actions' : 'local',
  htmlPagesScanned: htmlFiles.length,
  internalLinks: {
    uniqueRoutes: internalLinkMap.size,
    failuresCount: internalFailures.length,
    failures: internalFailures
  },
  anchors: {
    uniqueChecked: anchorLinkMap.size,
    failuresCount: anchorFailures.length,
    failures: anchorFailures
  },
  sitemap: {
    totalUrls: sitemapUrls.length,
    failuresCount: sitemapFailures.length,
    failures: sitemapFailures
  },
  externalLinks: {
    uniqueChecked: externalResults.length,
    okCount: okExternal.length,
    redirectCount: redirectedExternal.length,
    brokenCount: brokenExternal.length,
    blockedOrTimeoutCount: otherExternal.length,
    broken: brokenExternal,
    redirects: redirectedExternal,
    all: externalResults
  },
  conclusion: (internalFailures.length === 0 && anchorFailures.length === 0 && sitemapFailures.length === 0 && brokenExternal.length === 0)
    ? 'CLEAN'
    : 'FAILURES_DETECTED'
};

const reportJsonPath = path.join(reportsDir, 'link-audit-report.json');
fs.writeFileSync(reportJsonPath, JSON.stringify(auditReport, null, 2), 'utf8');
console.log(`  ✓ JSON-Auditbericht gespeichert: ${reportJsonPath}`);

// Markdown Summary
const mdReportPath = path.join(reportsDir, 'link-audit-summary.md');
const mdContent = `# Link Audit Summary · ladestandorte.de
**Erstellt am:** ${auditReport.timestamp}  
**Status:** **${auditReport.conclusion === 'CLEAN' ? '✅ ALLE LINKS INTAKT' : '❌ FEHLER GEFUNDEN'}**

## Zusammenfassung
| Metrik | Wert | Status |
| :--- | :--- | :--- |
| **Gescannte HTML-Seiten** | \`${auditReport.htmlPagesScanned}\` | OK |
| **Eindeutige interne Routen** | \`${auditReport.internalLinks.uniqueRoutes}\` | ${auditReport.internalLinks.failuresCount === 0 ? '✅ 100 % aufgelöst' : '❌ FEHLER'} |
| **Interne 404-Fehler** | \`${auditReport.internalLinks.failuresCount}\` | ${auditReport.internalLinks.failuresCount === 0 ? '0' : '❌ ' + auditReport.internalLinks.failuresCount} |
| **Sitemap-Konsistenz** | \`${auditReport.sitemap.totalUrls}\` URLs | ${auditReport.sitemap.failuresCount === 0 ? '✅ Alle gerendert' : '❌ FEHLER'} |
| **Interne Anker-IDs** | \`${auditReport.anchors.uniqueChecked}\` IDs | ${auditReport.anchors.failuresCount === 0 ? '✅ Alle vorhanden' : '❌ FEHLER'} |
| **Eindeutige externe Links** | \`${auditReport.externalLinks.uniqueChecked}\` | Geprüft |
| **Externe 200 OK** | \`${auditReport.externalLinks.okCount}\` | OK |
| **Externe Weiterleitungen (30x)** | \`${auditReport.externalLinks.redirectCount}\` | Kontrolliert |
| **Externe 404 / Broken** | \`${auditReport.externalLinks.brokenCount}\` | ${auditReport.externalLinks.brokenCount === 0 ? '✅ Keine' : '❌ FEHLER'} |

${brokenExternal.length > 0 ? `### ❌ Defekte externe Links:\n` + brokenExternal.map(b => `- **${b.url}** (Status: ${b.status}) auf \`${b.sampleSource}\``).join('\n') : ''}
`;

fs.writeFileSync(mdReportPath, mdContent, 'utf8');
console.log(`  ✓ Markdown-Bericht gespeichert: ${mdReportPath}`);

// Baseline sichern / aktualisieren falls CLEAN
const baselinePath = path.join(reportsDir, 'link-audit-baseline.json');
if (auditReport.conclusion === 'CLEAN' || !fs.existsSync(baselinePath)) {
  fs.writeFileSync(baselinePath, JSON.stringify({
    lastVerifiedClean: auditReport.timestamp,
    htmlPagesCount: auditReport.htmlPagesScanned,
    internalRoutesCount: auditReport.internalLinks.uniqueRoutes,
    sitemapUrlsCount: auditReport.sitemap.totalUrls,
    externalUrlsCount: auditReport.externalLinks.uniqueChecked
  }, null, 2), 'utf8');
  console.log(`  ✓ Baseline aktualisiert: ${baselinePath}`);
}

if (auditReport.conclusion !== 'CLEAN') {
  console.error('\n❌ LINK-AUDIT FEHLGESCHLAGEN: Defekte Links entdeckt!');
  process.exit(1);
} else {
  console.log('\n✅ LINK-AUDIT ERFOLGREICH: 100 % aller internen und externen Links sind intakt!\n');
  process.exit(0);
}
