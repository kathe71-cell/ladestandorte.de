#!/usr/bin/env node
// Meldet alle URLs aus den Sitemaps per IndexNow an Bing & Co. – nur bei Production-Builds auf Vercel.
// Schlüsseldatei: public/6ddfd346236ca688c7c7d1d509a461d5.txt (muss online erreichbar bleiben).
import fs from 'node:fs';

const KEY = '6ddfd346236ca688c7c7d1d509a461d5';
const HOST = 'www.ladestandorte.de';

if (process.env.VERCEL_ENV !== 'production') {
  console.log('IndexNow: kein Production-Build, übersprungen.');
  process.exit(0);
}

const urls = ['public/sitemap.xml', 'public/sitemap-ladestationen.xml']
  .filter((f) => fs.existsSync(f))
  .flatMap((f) => [...fs.readFileSync(f, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));

try {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `https://${HOST}/${KEY}.txt`, urlList: urls }),
  });
  console.log(`IndexNow: ${urls.length} URLs gemeldet, Antwort ${res.status}`);
} catch (e) {
  console.log('IndexNow: Meldung fehlgeschlagen (Build läuft weiter):', e.message);
}
