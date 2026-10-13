import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const toAbsolute = (p) => path.resolve(rootDir, p);

/**
 * Builds the static search index from verified SSR exports.
 * Generates public/search-index.json for client-side search.
 * 
 * GUARANTEE:
 * NEW PUBLIC CONTENT MUST BE SEARCHABLE.
 * All public, indexable routes defined in STATIC_ROUTES or generated
 * from CITIES_DATA, MOTORWAYS_DATA, OPERATORS_DATA and STATIONS_DATA
 * are automatically indexed exactly once.
 */
export async function generateSearchIndex() {
  const entryServerPath = toAbsolute('dist-ssr/entry-server.js');
  const ssr = await import(entryServerPath);
  const {
    CITIES_DATA,
    MOTORWAYS_DATA,
    OPERATORS_DATA,
    STATIONS_DATA,
    getStationUrl,
    isIndexableLocation,
    STATIC_ROUTES,
    getIndexableStaticRoutes,
    GLOSSARY_DATA,
    CHARGING_CARDS,
    WALLBOXES_DATA
  } = ssr;

  const docs = [];
  const registeredUrls = new Set();

  // Helper to ensure each canonical URL is indexed once as primary entity
  const addDoc = (doc) => {
    docs.push(doc);
    if (!doc.url.includes('#')) {
      registeredUrls.add(doc.url);
    }
  };

  // 1. Static Routes (Central Source of Truth for all top-level public pages)
  const indexableStaticRoutes = getIndexableStaticRoutes
    ? getIndexableStaticRoutes()
    : (STATIC_ROUTES || []).filter(r => !r.excludeFromSearch && !r.noIndex);

  for (const sr of indexableStaticRoutes) {
    const slugId = sr.url === '/' ? 'home' : sr.url.replace(/^\//, '').replace(/\//g, '-');
    addDoc({
      id: `page-${slugId}`,
      category: sr.category || 'knowledge',
      categoryLabel: sr.categoryLabel || 'Wissen & Ratgeber',
      title: sr.title,
      subtitle: sr.desc,
      description: sr.desc,
      badge: sr.badge || 'Ratgeber',
      url: sr.url,
      name: sr.title,
      keywords: sr.keywords || [sr.title.toLowerCase()],
      priority: sr.priority ?? 80
    });
  }

  // 2. Motorways (Autobahnen A1 - A99)
  for (const m of (MOTORWAYS_DATA || [])) {
    const numOnly = m.name.replace(/[^0-9]/g, '');
    addDoc({
      id: `motorway-${m.slug}`,
      category: 'motorways',
      categoryLabel: 'Autobahnen',
      title: `Bundesautobahn ${m.name}`,
      subtitle: `${m.route} · ${m.lengthKm} km · bis ${m.maxKw} kW HPC`,
      description: `Schnellladeparks an der Autobahn ${m.name} (${m.route}) mit bis zu ${m.maxKw} kW HPC.`,
      badge: `bis ${m.maxKw} kW`,
      url: `/autobahnen/${m.slug}`,
      name: m.name,
      motorway: m.name.toLowerCase(),
      operator: (m.mainCPOs || []).join(' '),
      synonyms: [m.name, `a ${numOnly}`, `bab ${numOnly}`, `bab ${m.name}`, `autobahn ${m.name}`],
      keywords: [
        m.name.toLowerCase(),
        `bab ${m.name}`.toLowerCase(),
        `a ${numOnly}`.toLowerCase(),
        `autobahn ${m.name}`.toLowerCase(),
        ...(m.mainCPOs || []).map(c => c.toLowerCase()),
        'fernverkehr',
        'raststätte',
        'autohof'
      ],
      priority: 95
    });
  }

  // 3. Cities (Top 50 Städte)
  for (const c of (CITIES_DATA || [])) {
    addDoc({
      id: `city-${c.slug}`,
      category: 'cities',
      categoryLabel: 'Städte',
      title: `${c.name} (${c.bundesland})`,
      subtitle: `${c.ladepunkteGesamt.toLocaleString('de-DE')} Ladepunkte · ${c.hpcLadepunkte} HPC-Lader · Top: ${c.topBetreiber.slice(0, 2).join(', ')}`,
      description: `Ladeinfrastruktur in ${c.name} (${c.bundesland}): ${c.ladepunkteGesamt} Ladepunkte und ${c.hpcLadepunkte} HPC-Schnelllader.`,
      badge: `${c.ladepunkteGesamt} Ladepunkte`,
      url: `/staedte/${c.slug}`,
      name: c.name,
      city: c.name.toLowerCase(),
      plz: (c.plzs || []).join(' '),
      operator: (c.topBetreiber || []).join(' '),
      synonyms: [c.name, ...(c.plzs || [])],
      keywords: [
        c.name.toLowerCase(),
        c.bundesland.toLowerCase(),
        ...(c.plzs || []),
        ...(c.topBetreiber || []).map(b => b.toLowerCase()),
        'stadt',
        'ballungsraum'
      ],
      priority: 90
    });
  }

  // 4. Operators (CPOs)
  for (const op of (OPERATORS_DATA || [])) {
    addDoc({
      id: `op-${op.slug}`,
      category: 'operators',
      categoryLabel: 'Betreiber (CPOs)',
      title: `${op.name}`,
      subtitle: `${op.totalPointsDE.toLocaleString('de-DE')} Ladepunkte · bis ${op.maxKw} kW HPC · ${op.bnetzaAnteil}`,
      description: `${op.name} Ladeanbieterprofil: ${op.totalPointsDE} Ladepunkte in Deutschland, bis ${op.maxKw} kW Ladeleistung.`,
      badge: `${op.maxKw} kW HPC`,
      url: `/betreiber/${op.slug}`,
      name: op.name,
      operator: op.name.toLowerCase(),
      synonyms: [op.name, op.slug],
      keywords: [
        op.name.toLowerCase(),
        op.headquarters.toLowerCase(),
        'cpo',
        'betreiber',
        'ladeanbieter',
        'ladenetz',
        ...(op.features || []).map(f => f.toLowerCase())
      ],
      priority: 85
    });
  }

  // 5. Standorte (44 verifizierte Ladepark-Dossiers)
  // Jedes Dossier wird genau einmal in den Index aufgenommen
  const indexableStations = (STATIONS_DATA || []).filter(s => isIndexableLocation ? isIndexableLocation(s) : s.isPilot);
  for (const s of indexableStations) {
    const isMcs = !!s.truckCharging?.supported;
    const connectors = (s.connectorTypes || []).join(', ');
    const motorwayStr = s.motorway ? `A${s.motorway.replace(/[^0-9]/g, '')}` : undefined;
    const stationUrl = getStationUrl(s);

    if (isMcs) {
      addDoc({
        id: `station-${s.id}`,
        category: 'stations',
        categoryLabel: 'MCS & Lkw',
        title: s.name,
        subtitle: `${s.street}, ${s.plz} ${s.city} · ${s.operator} · ${s.truckCharging?.mcsAvailable ? 'MCS aktiv (1.000+ kW)' : '400 kW CCS aktiv (MCS geplant)'}`,
        description: `E-Lkw Ladepark ${s.name} in ${s.city} (${s.operator}): Drive-Through-Buchten, bis ${s.kwMax} kW HPC / MCS.`,
        badge: s.truckCharging?.mcsAvailable ? 'MCS Aktiv' : 'MCS Geplant',
        url: stationUrl,
        name: s.name,
        city: s.city.toLowerCase(),
        plz: s.plz,
        street: s.street.toLowerCase(),
        operator: s.operator.toLowerCase(),
        motorway: motorwayStr ? motorwayStr.toLowerCase() : undefined,
        connectors: `${connectors} MCS Megawatt`.toLowerCase(),
        synonyms: ['mcs', 'megawatt', 'e-lkw', s.name],
        keywords: [
          'mcs',
          'megawatt',
          'lkw',
          'truck',
          'schwerlast',
          s.operator.toLowerCase(),
          s.city.toLowerCase(),
          s.name.toLowerCase(),
          ...(motorwayStr ? [motorwayStr.toLowerCase(), `bab ${motorwayStr}`.toLowerCase()] : [])
        ],
        priority: 88
      });
    } else {
      addDoc({
        id: `station-${s.id}`,
        category: 'stations',
        categoryLabel: 'Ladestandorte',
        title: s.name,
        subtitle: `${s.street}, ${s.plz} ${s.city} · ${s.operator} · ${s.pointsCount} Ladepunkte bis ${s.kwMax} kW`,
        description: `Ladepark ${s.name} in ${s.city}: ${s.pointsCount} Ladepunkte mit bis zu ${s.kwMax} kW HPC.`,
        badge: `${s.kwMax} kW ${s.isHpc ? 'HPC' : 'AC'}`,
        url: stationUrl,
        name: s.name,
        city: s.city.toLowerCase(),
        plz: s.plz,
        street: s.street.toLowerCase(),
        operator: s.operator.toLowerCase(),
        motorway: motorwayStr ? motorwayStr.toLowerCase() : undefined,
        connectors: connectors.toLowerCase(),
        synonyms: [s.name],
        keywords: [
          s.name.toLowerCase(),
          s.city.toLowerCase(),
          s.operator.toLowerCase(),
          s.plz,
          `${s.kwMax} kw`,
          `${s.kwMax}kw`,
          ...(motorwayStr ? [motorwayStr.toLowerCase(), `bab ${motorwayStr}`.toLowerCase()] : []),
          'ladepark',
          'schnelllader',
          'hpc'
        ],
        priority: 80
      });
    }
  }

  // 6. Sub-Entitäten (Tiefeinbettungen mit Hash-URLs oder spezifischen Begriffen)
  // Glossar-Begriffe mit Deep-Links (/glossar#slug)
  for (const g of (GLOSSARY_DATA || [])) {
    addDoc({
      id: `glossar-${g.slug}`,
      category: 'knowledge',
      categoryLabel: 'Wissen & Ratgeber',
      title: `${g.term}`,
      subtitle: `${g.shortDef}`,
      description: g.shortDef,
      badge: g.category,
      url: `/glossar#${g.slug}`,
      name: g.term,
      synonyms: [g.term, ...(g.standardNorm ? [g.standardNorm] : [])],
      keywords: [
        g.term.toLowerCase(),
        g.category.toLowerCase(),
        'glossar',
        'definition',
        'fachbegriff',
        ...(g.standardNorm ? [g.standardNorm.toLowerCase()] : [])
      ],
      priority: 72
    });
  }

  // Ladekarten-Tarife mit Deep-Link auf /ladekarten#tarif-id
  for (const card of (CHARGING_CARDS || []).slice(0, 15)) {
    addDoc({
      id: `card-${card.id}`,
      category: 'knowledge',
      categoryLabel: 'Wissen & Ratgeber',
      title: `${card.name} (${card.provider})`,
      subtitle: `Ab ${card.dcPriceOwn.toFixed(2)} €/kWh DC · ${card.roamingPoints} · ${card.bestFor}`,
      description: `${card.name} Ladekartentarif von ${card.provider}: ${card.roamingPoints} Roaming-Punkte, ${card.bestFor}.`,
      badge: 'Ladekarte',
      url: `/ladekarten#${card.id}`,
      name: card.name,
      operator: card.provider.toLowerCase(),
      synonyms: [card.name, card.provider],
      keywords: [
        card.name.toLowerCase(),
        card.provider.toLowerCase(),
        'ladekarte',
        'tarif',
        'roaming',
        ...(card.features || []).map(f => f.toLowerCase())
      ],
      priority: 70
    });
  }

  // Wallboxen mit Deep-Link auf /wallbox-vergleich#wallbox-id
  for (const wb of (WALLBOXES_DATA || []).slice(0, 10)) {
    addDoc({
      id: `wallbox-${wb.id}`,
      category: 'knowledge',
      categoryLabel: 'Wissen & Ratgeber',
      title: `${wb.name}`,
      subtitle: `${wb.brand} · ${wb.maxKw} kW · ${wb.priceEst} € UVP · ${wb.hasSolarCharging ? 'PV-Laden' : 'App-Steuerung'}`,
      description: `${wb.name} Heimladestation von ${wb.brand}: ${wb.maxKw} kW Ladeleistung, ${wb.hasSolarCharging ? 'PV-Überschussladen' : 'App-Steuerung'}.`,
      badge: `${wb.maxKw} kW Wallbox`,
      url: `/wallbox-vergleich#${wb.id}`,
      name: wb.name,
      synonyms: [wb.name, wb.brand],
      keywords: [
        wb.name.toLowerCase(),
        wb.brand.toLowerCase(),
        'wallbox',
        `${wb.maxKw} kw`,
        `${wb.maxKw}kw`,
        'heimladen'
      ],
      priority: 68
    });
  }

  // Output paths
  const publicDir = toAbsolute('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const outputPath = path.join(publicDir, 'search-index.json');
  fs.writeFileSync(outputPath, JSON.stringify(docs), 'utf-8');

  // Also write into dist if dist exists (so prerender/client build has immediate access)
  const distDir = toAbsolute('dist');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'search-index.json'), JSON.stringify(docs), 'utf-8');
  }

  const sizeKb = (Buffer.byteLength(JSON.stringify(docs)) / 1024).toFixed(1);
  console.log(`✓ Global search index generated: ${docs.length} entities indexed (${sizeKb} kB) -> ${outputPath}`);

  return docs;
}

// Allow running standalone: node scripts/build-search-index.js
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  generateSearchIndex().catch(err => {
    console.error('Failed to generate search index:', err);
    process.exit(1);
  });
}
