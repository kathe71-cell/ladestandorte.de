import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const toAbsolute = (p) => path.resolve(rootDir, p);

/**
 * Builds the static search index from verified SSR exports.
 * Generates public/search-index.json for client-side search.
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
    GLOSSARY_DATA,
    CHARGING_CARDS,
    WALLBOXES_DATA
  } = ssr;

  const docs = [];

  // 1. Motorways (Autobahnen A1 - A99)
  for (const m of (MOTORWAYS_DATA || [])) {
    const numOnly = m.name.replace(/[^0-9]/g, '');
    docs.push({
      id: `motorway-${m.slug}`,
      category: 'motorways',
      categoryLabel: 'Autobahnen',
      title: `Bundesautobahn ${m.name}`,
      subtitle: `${m.route} · ${m.lengthKm} km · bis ${m.maxKw} kW HPC`,
      badge: `bis ${m.maxKw} kW`,
      url: `/autobahnen/${m.slug}`,
      name: m.name,
      motorway: m.name.toLowerCase(),
      operator: (m.mainCPOs || []).join(' '),
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

  // 2. Cities (Top 50 Städte)
  for (const c of (CITIES_DATA || [])) {
    docs.push({
      id: `city-${c.slug}`,
      category: 'cities',
      categoryLabel: 'Städte',
      title: `${c.name} (${c.bundesland})`,
      subtitle: `${c.ladepunkteGesamt.toLocaleString('de-DE')} Ladepunkte · ${c.hpcLadepunkte} HPC-Lader · Top: ${c.topBetreiber.slice(0, 2).join(', ')}`,
      badge: `${c.ladepunkteGesamt} Ladepunkte`,
      url: `/staedte/${c.slug}`,
      name: c.name,
      city: c.name.toLowerCase(),
      plz: (c.plzs || []).join(' '),
      operator: (c.topBetreiber || []).join(' '),
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

  // 3. Operators (CPOs)
  for (const op of (OPERATORS_DATA || [])) {
    docs.push({
      id: `op-${op.slug}`,
      category: 'operators',
      categoryLabel: 'Betreiber',
      title: `${op.name}`,
      subtitle: `${op.totalPointsDE.toLocaleString('de-DE')} Ladepunkte · bis ${op.maxKw} kW HPC · ${op.bnetzaAnteil}`,
      badge: `${op.maxKw} kW HPC`,
      url: `/betreiber/${op.slug}`,
      name: op.name,
      operator: op.name.toLowerCase(),
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

  // 4. Standorte (44 verifizierte Ladepark-Dossiers) & MCS-Cluster
  const indexableStations = (STATIONS_DATA || []).filter(s => isIndexableLocation(s));
  for (const s of indexableStations) {
    const isMcs = !!s.truckCharging?.supported;
    const connectors = (s.connectorTypes || []).join(', ');
    const motorwayStr = s.motorway ? `A${s.motorway.replace(/[^0-9]/g, '')}` : undefined;

    // Distinguish between MCS Category and Standard Stations Category
    if (isMcs) {
      docs.push({
        id: `station-mcs-${s.id}`,
        category: 'mcs',
        categoryLabel: 'MCS & Lkw',
        title: s.name,
        subtitle: `${s.street}, ${s.plz} ${s.city} · ${s.operator} · ${s.truckCharging?.mcsAvailable ? 'MCS aktiv (1.000+ kW)' : '400 kW CCS aktiv (MCS geplant)'}`,
        badge: s.truckCharging?.mcsAvailable ? 'MCS Aktiv' : 'MCS Geplant',
        url: getStationUrl(s),
        name: s.name,
        city: s.city.toLowerCase(),
        plz: s.plz,
        street: s.street.toLowerCase(),
        operator: s.operator.toLowerCase(),
        motorway: motorwayStr ? motorwayStr.toLowerCase() : undefined,
        connectors: `${connectors} MCS Megawatt`.toLowerCase(),
        keywords: [
          'mcs',
          'megawatt',
          'lkw',
          'truck',
          'schwerlast',
          s.operator.toLowerCase(),
          s.city.toLowerCase(),
          ...(motorwayStr ? [motorwayStr.toLowerCase(), `bab ${motorwayStr}`.toLowerCase()] : [])
        ],
        priority: 88
      });
    }

    // Always register in Stations category as well (or single entry with clear categorization)
    docs.push({
      id: `station-${s.id}`,
      category: 'stations',
      categoryLabel: 'Ladestandorte',
      title: s.name,
      subtitle: `${s.street}, ${s.plz} ${s.city} · ${s.operator} · ${s.pointsCount} Ladepunkte bis ${s.kwMax} kW`,
      badge: `${s.kwMax} kW ${s.isHpc ? 'HPC' : 'AC'}`,
      url: getStationUrl(s),
      name: s.name,
      city: s.city.toLowerCase(),
      plz: s.plz,
      street: s.street.toLowerCase(),
      operator: s.operator.toLowerCase(),
      motorway: motorwayStr ? motorwayStr.toLowerCase() : undefined,
      connectors: connectors.toLowerCase(),
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
      priority: isMcs ? 82 : 80
    });
  }

  // 5. MCS Wissens- und Übersichtsseiten
  const mcsPages = [
    {
      url: '/mcs',
      title: 'MCS Themenhub: Megawatt Charging System',
      subtitle: 'Übersicht über den MCS-Standard für schwere E-Lkw, Korridore & Ladeleistung',
      keywords: ['mcs', 'megawatt', 'lkw', 'truck', 'e-lkw', 'charin', 'laden']
    },
    {
      url: '/mcs/ladestationen',
      title: 'MCS & E-Lkw Ladestationen Verzeichnis',
      subtitle: 'Alle verifizierten Schwerlast-Ladeparks mit Drive-Through-Buchten in Deutschland',
      keywords: ['mcs', 'ladestationen', 'lkw', 'standorte', 'verzeichnis', 'korridore']
    },
    {
      url: '/mcs/was-ist-mcs',
      title: 'Was ist MCS? Technik & Normung erklärt',
      subtitle: 'CharIN-Standard, bis zu 3.750 kW Ladeleistung, flüssigkeitsgekühlte Stecker & ISO 15118-20',
      keywords: ['mcs', 'technik', 'was ist mcs', 'charin', 'stecker', 'kw', 'leistung', 'ampere']
    },
    {
      url: '/mcs/mcs-vs-ccs',
      title: 'MCS vs. CCS im Vergleich',
      subtitle: 'Unterschiede zwischen Pkw-CCS und Lkw-Megawatt-Laden: Dauerstrom, Pin-Layout & Kabel',
      keywords: ['mcs', 'ccs', 'vergleich', 'unterschied', 'stecker', 'pin', 'kabel']
    },
    {
      url: '/mcs/lkw-laden',
      title: 'Lkw-Laden & 45-Minuten-Pause im Fernverkehr',
      subtitle: 'Logistik im Fernverkehr: Harmonisierung mit gesetzlichen Lenk- und Ruhezeiten (EG 561/2006)',
      keywords: ['lkw-laden', 'pause', 'lenkzeit', 'ruhezeit', '45 minuten', 'logistik', 'fernverkehr']
    }
  ];

  for (const p of mcsPages) {
    docs.push({
      id: `mcs-page-${p.url.replace(/\//g, '-')}`,
      category: 'mcs',
      categoryLabel: 'MCS & Lkw',
      title: p.title,
      subtitle: p.subtitle,
      badge: 'MCS Leitfaden',
      url: p.url,
      name: p.title,
      keywords: p.keywords,
      priority: 84
    });
  }

  // 6. Tools & Rechner
  docs.push({
    id: 'tool-rechner',
    category: 'tools',
    categoryLabel: 'Tools & Rechner',
    title: 'Ladezeit- & Kostenrechner für Elektroautos',
    subtitle: 'Interaktiver Rechner für Ladedauer, Ladeverluste und Stromkosten bei AC & DC',
    badge: 'Rechner',
    url: '/rechner',
    name: 'Ladezeit- & Kostenrechner',
    keywords: ['rechner', 'ladezeit', 'kosten', 'ladezeitrechner', 'ladekosten', 'kwh', 'ladeverluste', 'batterie', 'soc'],
    priority: 87
  });

  docs.push({
    id: 'tool-suche',
    category: 'tools',
    categoryLabel: 'Tools & Rechner',
    title: 'Ladesäulen Instant-Finder & Schnellsuche',
    subtitle: 'Bundesweites Verzeichnis aller öffentlich registrierten Ladesäulen durchsuchen',
    badge: 'Finder',
    url: '/suche',
    name: 'Ladesäulen Instant-Finder',
    keywords: ['suche', 'finder', 'instant', 'filter', 'karte', 'bnetza'],
    priority: 80
  });

  // 7. Wissen & Ratgeber (Artikel)
  const ratgeberArticles = [
    {
      slug: 'ladekarten-dschungel',
      title: 'Ladekarten-Dschungel: Roaming-Preise & Grundgebühren',
      subtitle: 'Unabhängige Analyse: Welche Ladekarte lohnt sich für welches Fahrprofil?',
      keywords: ['ladekarten', 'roaming', 'grundgebühr', 'preise', 'dschungel', 'tarife', 'sparen', 'ladekarte']
    },
    {
      slug: 'ac-vs-dc-ladeverluste',
      title: 'AC vs. DC Ladeverluste im Praxis-Vergleich',
      subtitle: 'Wirkungsgrade & Sparpotenziale: Wo geht beim Laden Energie verloren?',
      keywords: ['ladeverluste', 'ac', 'dc', 'wirkungsgrad', 'onboard', 'hpc', 'verlust']
    },
    {
      slug: 'blockiergebuehren-vermeiden',
      title: 'Blockiergebühren an Ladesäulen vermeiden',
      subtitle: 'Karenzzeiten (240 Min. AC vs. 60 Min. DC), Nachtregelungen und Deckel im CPO-Vergleich',
      keywords: ['blockiergebühr', 'blockiergebuehren', 'standzeit', 'karenzzeit', 'standgebühr', 'kostenfalle']
    }
  ];

  for (const art of ratgeberArticles) {
    docs.push({
      id: `ratgeber-${art.slug}`,
      category: 'knowledge',
      categoryLabel: 'Wissen',
      title: art.title,
      subtitle: art.subtitle,
      badge: 'Ratgeber',
      url: `/ratgeber/${art.slug}`,
      name: art.title,
      keywords: art.keywords,
      priority: 76
    });
  }

  // Ratgeber Index
  docs.push({
    id: 'knowledge-ratgeber-index',
    category: 'knowledge',
    categoryLabel: 'Wissen',
    title: 'Ratgeber & Leitfäden für Elektromobilität',
    subtitle: 'Fachartikel zu Ladeverlusten, Roaming-Tarifen, Batterieschonung und Normen',
    badge: 'Ratgeber',
    url: '/ratgeber',
    name: 'Ratgeber Elektromobilität',
    keywords: ['ratgeber', 'leitfaden', 'wissen', 'tipps', 'anleitungen'],
    priority: 75
  });

  // 8. Ladekarten-Vergleich & Einzelkarten
  docs.push({
    id: 'knowledge-ladekarten-vergleich',
    category: 'knowledge',
    categoryLabel: 'Wissen',
    title: 'Ladekarten-Vergleich 2026: Tarife, Roaming & Preise',
    subtitle: 'Die wichtigsten Ladekarten und Lade-Apps für Deutschland und Europa im Vergleich',
    badge: 'Ladekarten',
    url: '/ladekarten',
    name: 'Ladekarten-Vergleich',
    keywords: ['ladekarten', 'vergleich', 'tarife', 'roaming', 'kwh-preise', 'apps', 'enbw', 'maingau', 'dkv'],
    priority: 82
  });

  for (const card of (CHARGING_CARDS || []).slice(0, 15)) {
    docs.push({
      id: `card-${card.id}`,
      category: 'knowledge',
      categoryLabel: 'Wissen',
      title: `${card.name} (${card.provider})`,
      subtitle: `Ab ${card.dcPriceOwn.toFixed(2)} €/kWh DC · ${card.roamingPoints} · ${card.bestFor}`,
      badge: 'Ladekarte',
      url: '/ladekarten',
      name: card.name,
      operator: card.provider.toLowerCase(),
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

  // 9. Glossar
  docs.push({
    id: 'knowledge-glossar-index',
    category: 'knowledge',
    categoryLabel: 'Wissen',
    title: 'E-Mobilität Glossar: Fachbegriffe von AC bis V2G',
    subtitle: 'Verständliche Erklärungen zu Ladeleistung, Steckertypen, Normen & Gesetzen',
    badge: 'Glossar',
    url: '/glossar',
    name: 'E-Mobilität Glossar',
    keywords: ['glossar', 'lexikon', 'begriffe', 'definitionen', 'faq', 'fachbegriffe'],
    priority: 74
  });

  for (const g of (GLOSSARY_DATA || [])) {
    docs.push({
      id: `glossar-${g.slug}`,
      category: 'knowledge',
      categoryLabel: 'Wissen',
      title: `${g.term}`,
      subtitle: `${g.shortDef}`,
      badge: g.category,
      url: `/glossar#${g.slug}`,
      name: g.term,
      keywords: [
        g.term.toLowerCase(),
        g.category.toLowerCase(),
        'glossar',
        'definition',
        ...(g.standardNorm ? [g.standardNorm.toLowerCase()] : [])
      ],
      priority: 72
    });
  }

  // 10. Wallbox-Vergleich
  docs.push({
    id: 'knowledge-wallbox-vergleich',
    category: 'knowledge',
    categoryLabel: 'Wissen',
    title: 'Wallbox-Vergleich 2026: Private Ladestationen für Zuhause',
    subtitle: '11 kW & 22 kW Wallboxen mit PV-Überschussladen, App-Steuerung und KfW-Förderung',
    badge: 'Wallboxen',
    url: '/wallbox-vergleich',
    name: 'Wallbox-Vergleich',
    keywords: ['wallbox', 'wallboxen', 'heimladen', 'zuhause', 'pv-laden', 'solar', '11 kw', '22 kw'],
    priority: 78
  });

  for (const wb of (WALLBOXES_DATA || []).slice(0, 10)) {
    docs.push({
      id: `wallbox-${wb.id}`,
      category: 'knowledge',
      categoryLabel: 'Wissen',
      title: `${wb.name}`,
      subtitle: `${wb.brand} · ${wb.maxKw} kW · ${wb.priceEst} € UVP · ${wb.hasSolarCharging ? 'PV-Laden' : 'App-Steuerung'}`,
      badge: `${wb.maxKw} kW Wallbox`,
      url: '/wallbox-vergleich',
      name: wb.name,
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
