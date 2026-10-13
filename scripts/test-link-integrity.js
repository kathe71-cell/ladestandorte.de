#!/usr/bin/env node
/**
 * scripts/test-link-integrity.js
 * 
 * Regressions- und Integritätstest für alle internen Verlinkungen:
 * - Stellt sicher, dass keine gerenderte Seite auf nicht-existente Routen verlinkt
 * - Stellt sicher, dass sitemap.xml vollständig physisch gerendert ist
 * - Kann schnell und offline in CI / `npm test` ausgeführt werden
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('=== INTERNAL LINK INTEGRITY & SITEMAP REGRESSION TEST ===');

if (!fs.existsSync(distDir)) {
  console.error('[FAIL] dist/ Verzeichnis existiert nicht. Vorab Build ausführen!');
  process.exit(1);
}

function getHtmlFiles(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) getHtmlFiles(full, acc);
    else if (entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

const htmlFiles = getHtmlFiles(distDir);
console.log(`Prüfe ${htmlFiles.length} gerenderte HTML-Dateien...`);

const internalLinks = new Map();
for (const file of htmlFiles) {
  const relFile = path.relative(distDir, file);
  const content = fs.readFileSync(file, 'utf8');
  const hrefMatches = content.matchAll(/href=["']([^"']+)["']/g);

  for (const m of hrefMatches) {
    const rawHref = m[1].trim();
    if (rawHref.startsWith('http://') || rawHref.startsWith('https://')) {
      try {
        const u = new URL(rawHref);
        if (u.hostname === 'ladestandorte.de' || u.hostname === 'www.ladestandorte.de') {
          const p = u.pathname;
          if (!internalLinks.has(p)) internalLinks.set(p, []);
          internalLinks.get(p).push(relFile);
        }
      } catch {}
      continue;
    }

    if (rawHref.startsWith('/')) {
      const clean = rawHref.split('?')[0].split('#')[0];
      if (!internalLinks.has(clean)) internalLinks.set(clean, []);
      internalLinks.get(clean).push(relFile);
    }
  }
}

const failures = [];
for (const [routePath, sources] of internalLinks.entries()) {
  const cand1 = path.join(distDir, routePath, 'index.html');
  const cand2 = path.join(distDir, `${routePath}.html`);
  const cand3 = path.join(distDir, routePath);

  if (!fs.existsSync(cand1) && !fs.existsSync(cand2) && !fs.existsSync(cand3)) {
    failures.push({ routePath, source: sources[0], count: sources.length });
  }
}

if (failures.length > 0) {
  console.error(`[FAIL] ${failures.length} tote interne Links entdeckt:`);
  failures.forEach(f => console.error(`  - ${f.routePath} (verlinkt auf ${f.source}, insgesamt ${f.count}x)`));
  process.exit(1);
}

// Sitemap Check
const sitemapPath = path.join(rootDir, 'public/sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const content = fs.readFileSync(sitemapPath, 'utf8');
  const urls = [...content.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const missingSitemap = [];
  for (const u of urls) {
    const p = new URL(u).pathname;
    const cand1 = path.join(distDir, p, 'index.html');
    const cand2 = path.join(distDir, `${p}.html`);
    const cand3 = path.join(distDir, p);
    if (!fs.existsSync(cand1) && !fs.existsSync(cand2) && !fs.existsSync(cand3)) {
      missingSitemap.push(p);
    }
  }
  if (missingSitemap.length > 0) {
    console.error(`[FAIL] ${missingSitemap.length} Sitemap-URLs haben keine gerenderte HTML-Datei:`);
    missingSitemap.forEach(s => console.error(`  - ${s}`));
    process.exit(1);
  }
  console.log(`[PASS] Alle ${urls.length} Sitemap-URLs sind gerendert und auflösbar.`);
}

console.log(`[PASS] Alle ${internalLinks.size} internen Linkziele existieren fehlerfrei (0 tote Links).\n`);
process.exit(0);
