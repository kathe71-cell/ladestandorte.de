import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');
const { render, CITIES_DATA, MOTORWAYS_DATA, OPERATORS_DATA, STATIONS_DATA, getStationUrl, isIndexableLocation, STATIC_ROUTES } = await import('./dist-ssr/entry-server.js');

const staticRoutes = STATIC_ROUTES;

const cityRoutes = (CITIES_DATA || []).map((c) => ({
  url: `/staedte/${c.slug}`,
  title: `Ladestationen ${c.name}: Ladepunkte & HPC-Daten | ladestandorte.de`,
  desc: `Aktuelle Auswertung veröffentlichter BNetzA-Registerdaten für ${c.name}: ${c.ladepunkteGesamt.toLocaleString('de-DE')} Ladepunkte, ${c.hpcLadepunkte} Ladepunkte ≥150 kW und Ladepunktdichte.`,
}));

const motorwayRoutes = (MOTORWAYS_DATA || []).map((m) => ({
  url: `/autobahnen/${m.slug}`,
  title: `Schnellladen ${m.name}: HPC-Ladeparks an Raststätten & Autobahn`,
  desc: `Schnellladeparks an der ${m.name} (${m.route}): IONITY, EnBW, Tesla & mehr. Bis zu ${m.maxKw} kW HPC. Alle Raststätten, Preise & Öffnungszeiten.`,
}));

const operatorRoutes = (OPERATORS_DATA || []).map((o) => ({
  url: `/betreiber/${o.slug}`,
  title: `${o.name}: Ladenetz, Tarife & ${o.totalPointsDE.toLocaleString('de-DE')} Ladepunkte in Deutschland`,
  desc: `${o.name} im Faktencheck: ${o.totalPointsDE.toLocaleString('de-DE')} Ladepunkte, bis zu ${o.maxKw} kW HPC, ${o.hpcShare}% HPC-Anteil. Preise, Roaming, Plug & Charge & BNetzA-Daten 2026.`,
}));

// Pilot station dossier routes (Strict indexable check)
const stationRoutes = (STATIONS_DATA || [])
  .filter((s) => isIndexableLocation ? isIndexableLocation(s) : s.isPilot)
  .map((s) => ({
    url: getStationUrl(s),
    title: `${s.name} (${s.operator}): Ladestation ${s.city} – ${s.kwMax} kW HPC | ladestandorte.de`,
    desc: `Ladestation ${s.name} in ${s.city} (${s.street}): ${s.pointsCount} Ladepunkte bis ${s.kwMax} kW HPC (${s.connectorTypes.join(', ')}). Betreiber: ${s.operator}. Anfahrt, Stecker & Ausstattung.`,
  }));

// MCS Hub routes (/mcs/hub/:slug)
const mcsHubStations = (STATIONS_DATA || []).filter((s) => s.truckCharging && s.truckCharging.supported);
const mcsHubRoutes = mcsHubStations.map((s) => ({
  url: `/mcs/hub/${s.slug}`,
  title: `${s.name} · MCS Schwerlast-Ladehub | ladestandorte.de`,
  desc: `E-Lkw Megawatt-Ladehub ${s.name} in ${s.city} (${s.motorway?.toUpperCase() || 'BAB'}). Bis zu ${s.kwMax} kW Ladeleistung, Durchfahrtsbuchten & verifizierte Betriebsdaten.`
}));

// /mcs/hub/aral-pulse-schwarmstedt-a7 is a permanent redirect in vercel.json (not prerendered, avoids duplicate title/description)

// Legacy alias route for enbw-mobility-plus
const aliasRoutes = [
  {
    url: '/betreiber/enbw-mobility-plus',
    title: 'EnBW mobility+: Ladenetz, Tarife & 11.334 Ladepunkte in Deutschland',
    desc: 'EnBW mobility+ im Faktencheck: 11.334 Ladepunkte, bis zu 300 kW HPC, 74% HPC-Anteil. Preise, Roaming, Plug & Charge & BNetzA-Daten 2026.',
    canonicalUrl: '/betreiber/enbw',
    noIndex: true
  }
];

const allRoutes = [
  ...staticRoutes,
  ...cityRoutes,
  ...motorwayRoutes,
  ...operatorRoutes,
  ...stationRoutes,
  ...mcsHubRoutes,
  ...aliasRoutes,
];

console.log(`Starting prerendering of ${allRoutes.length} routes for ladestandorte.de...`);

let successCount = 0;

for (const route of allRoutes) {
  try {
    const { html: appHtml } = render(route.url);
    let rendered = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
    rendered = rendered.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`);
    rendered = rendered.replace(/<meta name="description" content=".*?" \/>/, `<meta name="description" content="${route.desc}" />`);
    const canonicalPath = route.canonicalUrl || (route.url === '/' ? '/' : route.url);
    const fullUrl = `https://www.ladestandorte.de${canonicalPath === '/' ? '/' : canonicalPath}`;
    rendered = rendered.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${fullUrl}" />`);
    rendered = rendered.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${fullUrl}" />`);
    rendered = rendered.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${route.title}" />`);
    rendered = rendered.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${route.title}" />`);
    rendered = rendered.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${route.desc}" />`);
    rendered = rendered.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${route.desc}" />`);
    if (route.noIndex) {
      rendered = rendered.replace(/<meta name="robots" content=".*?" \/>/, '<meta name="robots" content="noindex, follow" />');
    }

    const filePath = route.url === '/' ? 'dist/index.html' : `dist${route.url}/index.html`;
    const absolutePath = toAbsolute(filePath);
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, rendered);
    successCount++;
  } catch (err) {
    console.error(`  ✗ Error prerendering ${route.url}:`, err);
  }
}

console.log(`Successfully prerendered ${successCount} of ${allRoutes.length} routes!`);

// Ensure Vercel custom 404 handler can serve static 404.html directly
if (fs.existsSync(toAbsolute('dist/404/index.html'))) {
  fs.copyFileSync(toAbsolute('dist/404/index.html'), toAbsolute('dist/404.html'));
  console.log('Copied dist/404/index.html to dist/404.html for Vercel static error routing.');
}

// Generate static search index
try {
  const { generateSearchIndex } = await import('./scripts/build-search-index.js');
  await generateSearchIndex();
} catch (searchIndexErr) {
  console.error('  ✗ Error building search index:', searchIndexErr);
}
