import fs from 'node:fs';
import path from 'node:path';

let idMapCache = null;
let templateCache = null;
let notFoundHtmlCache = null;

function getIdMap() {
  if (!idMapCache) {
    const idMapPath = path.join(process.cwd(), 'dist/data/registry/id-map.json');
    const fallbackPath = path.join(process.cwd(), 'public/data/registry/id-map.json');
    const target = fs.existsSync(idMapPath) ? idMapPath : fallbackPath;
    if (fs.existsSync(target)) {
      idMapCache = JSON.parse(fs.readFileSync(target, 'utf8'));
    } else {
      idMapCache = {};
    }
  }
  return idMapCache;
}

function getTemplate() {
  if (!templateCache) {
    const tPath = path.join(process.cwd(), 'dist/index.html');
    if (fs.existsSync(tPath)) {
      templateCache = fs.readFileSync(tPath, 'utf8');
    } else {
      templateCache = '<!doctype html><html><head><title>Ladestandorte.de</title></head><body><div id="root"></div></body></html>';
    }
  }
  return templateCache;
}

function getNotFoundHtml() {
  if (!notFoundHtmlCache) {
    const nPath = path.join(process.cwd(), 'dist/404/index.html');
    const fPath = path.join(process.cwd(), 'dist/404.html');
    const target = fs.existsSync(nPath) ? nPath : fPath;
    if (fs.existsSync(target)) {
      notFoundHtmlCache = fs.readFileSync(target, 'utf8');
    } else {
      notFoundHtmlCache = '<!doctype html><html lang="de"><head><meta charset="UTF-8"><title>404 – Seite nicht gefunden | ladestandorte.de</title></head><body><h1>404 – Seite nicht gefunden</h1></body></html>';
    }
  }
  return notFoundHtmlCache;
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'https://www.ladestandorte.de');
  const city = (url.searchParams.get('city') || '').trim().toLowerCase();
  const id = (url.searchParams.get('id') || '').trim();

  // Basic sanitization
  if (!id || !/^\d+$/.test(id)) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    return res.status(404).send(getNotFoundHtml());
  }

  const idMap = getIdMap();
  const prefix = idMap[id];

  // If ID does not exist in the official 117.043 BNetzA station register: Genuine HTTP 404
  if (!prefix) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    return res.status(404).send(getNotFoundHtml());
  }

  // Load shard to verify canonical citySlug
  let shardData = null;
  const shardDist = path.join(process.cwd(), `dist/data/registry/shards/${prefix}.json`);
  const shardPublic = path.join(process.cwd(), `public/data/registry/shards/${prefix}.json`);
  const shardFile = fs.existsSync(shardDist) ? shardDist : shardPublic;

  if (fs.existsSync(shardFile)) {
    try {
      shardData = JSON.parse(fs.readFileSync(shardFile, 'utf8'));
    } catch {
      shardData = null;
    }
  }

  const station = shardData ? shardData.find(s => s.id === id) : null;
  if (!station) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow');
    return res.status(404).send(getNotFoundHtml());
  }

  // Canonical city enforcement: if URL requested /ladestation-register/<wrongCity>/<id>, 301 redirect to canonical URL
  const canonicalCity = station.citySlug || city;
  if (city && canonicalCity && city !== canonicalCity) {
    res.setHeader('Location', `/ladestation-register/${canonicalCity}/${id}`);
    return res.status(301).end();
  }

  // Render server-side or inject hydration template
  try {
    const { render } = await import('../dist-ssr/entry-server.js');
    const { html: appHtml } = render(`/ladestation-register/${canonicalCity}/${id}`);

    let html = getTemplate().replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

    const pageTitle = `${station.cpo || 'BNetzA'} Ladestation ${id}: ${station.city || ''} | ladestandorte.de`;
    const pageDesc = `BNetzA-Registereintrag für Ladestation ${id} in ${station.city || ''} (${station.street || ''} ${station.houseNumber || ''}): ${station.pointsCount || 2} Ladepunkte, bis ${station.maxKw || 0} kW, Betreiber: ${station.cpo || 'BNetzA'}.`;
    const canonicalUrl = `https://www.ladestandorte.de/ladestation-register/${canonicalCity}/${id}`;

    html = html.replace(/<title>.*?<\/title>/, `<title>${pageTitle}</title>`);
    html = html.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${pageDesc}" />`);
    html = html.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${canonicalUrl}" />`);
    html = html.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${canonicalUrl}" />`);
    html = html.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${pageTitle}" />`);
    html = html.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${pageTitle}" />`);
    html = html.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${pageDesc}" />`);
    html = html.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${pageDesc}" />`);

    // Technical register view: strictly enforce noindex, follow to protect crawl budget
    html = html.replace(/<meta name="robots" content=".*?" \/>/, '<meta name="robots" content="noindex, follow" />');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, follow');
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    return res.status(200).send(html);
  } catch (err) {
    // Fallback: send template with 200 for client hydration
    const template = getTemplate();
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('X-Robots-Tag', 'noindex, follow');
    return res.status(200).send(template);
  }
}
