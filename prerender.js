import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');
const { render, CITIES_DATA, MOTORWAYS_DATA, OPERATORS_DATA, STATIONS_DATA, getStationUrl, isIndexableLocation } = await import('./dist-ssr/entry-server.js');

const staticRoutes = [
  { url: '/', title: 'Ladestandorte.de: Ladesäulen & Schnellladeparks in Deutschland', desc: 'Finde über 130.000 öffentlich zugängliche Ladesäulen, HPC-Schnelllader und Ladeparks in Deutschland. Bundesnetzagentur-Daten, Filter & Ladezeit-Rechner.' },
  { url: '/suche', title: 'Ladesäulen Suche: Schnelllader & AC-Stationen finden | ladestandorte.de', desc: 'Interaktive Suche nach Ladesäulen in ganz Deutschland. Filtern nach Leistung (kW), Steckertypen, Betreibern und kostenlosem Laden.' },
  { url: '/staedte', title: 'Ladeinfrastruktur nach Städten: Alle Standorte | ladestandorte.de', desc: 'Übersicht der Ladeinfrastruktur in über 50 deutschen Städten. Ladepunkte, durchschnittliche kW und Top-Betreiber im Vergleich.' },
  { url: '/hpc-city-monitor', title: 'HPC City Monitor: ≥150-kW-Ladepunkte in 50 Städten | ladestandorte.de', desc: 'Auswertung von Ladepunkten mit ≥150 kW Nennleistung in 50 deutschen Städten auf Basis veröffentlichter BNetzA-Registerdaten und amtlicher Destatis-Bevölkerung.' },
  { url: '/autobahnen', title: 'Laden an deutschen Autobahnen: HPC-Schnellladeparks | ladestandorte.de', desc: 'Schnellladestationen entlang der Bundesautobahnen A1 bis A99. Raststätten, Autohöfe und High-Power-Charging Ladeparks.' },
  { url: '/betreiber', title: 'Ladesäulen-Betreiber (CPO) in Deutschland im Vergleich | ladestandorte.de', desc: 'Große Ladeanbieter wie EnBW, Ionity, Tesla Supercharger, Aral pulse, Fastned und EWE Go im Profil und Netzwerkvergleich.' },
  { url: '/cpo-monitor', title: 'CPO Monitor: Betreiber im BNetzA-Registervergleich | ladestandorte.de', desc: 'Verifizierte Betreiber-Auswertung auf Basis amtlicher BNetzA-Registerdaten. Ladepunkte ≥150 kW, Ausbauquoten und Registeranteile der führenden CPOs in Deutschland.' },
  { url: '/rechner', title: 'Ladezeit- & Ladekosten-Rechner für Elektroautos | ladestandorte.de', desc: 'Berechne exakte Ladedauer, Ladekurve und Ladekosten für AC- und DC-Laden für alle gängigen Elektrofahrzeuge.' },
  { url: '/rechner-embed', title: 'Ladezeit-Rechner Widget | ladestandorte.de', desc: 'Kostenlos einbettbarer Ladezeit- und Ladekosten-Rechner für E-Autos.' },
  { url: '/ladekarten', title: 'Ladekarten-Vergleich 2026: Tarife, Roaming & kWh-Preise | ladestandorte.de', desc: 'Die besten Ladekarten und Apps im unabhängigen Vergleich: EnBW mobility+, Maingau, Ionity Passport, Tesla App und mehr.' },
  { url: '/wallbox-vergleich', title: 'Wallbox-Vergleich 2026: Testsieger für Zuhause | ladestandorte.de', desc: 'KfW-fähige Wallboxen mit 11 kW und 22 kW für Garage und Carport im Test: ABL, Heidelberg, easee, go-e und Webasto.' },
  { url: '/ratgeber', title: 'Ratgeber Elektromobilität: Lade-Tipps & Praxisleitfäden | ladestandorte.de', desc: 'Fachartikel zu Ladeverlusten, Roaming-Preisen, Batterieschonung, Stecker-Standards und Ladeetikette.' },
  { url: '/ratgeber/ladekarten-dschungel', title: 'Ladekarten-Dschungel: Roaming-Preise & Grundgebühren | ladestandorte.de', desc: 'Welche Ladekarte lohnt sich für wen? CPO vs. EMP, Roaming-Preise, monatliche Grundgebühren und Spartipps im Detail erklärt.' },
  { url: '/ratgeber/ac-vs-dc-ladeverluste', title: 'AC vs. DC Ladeverluste: Wirkungsgrad im Detail | ladestandorte.de', desc: 'Wie viel Strom verpufft beim Laden? AC-Onboard-Lader vs. DC-Schnellladung, thermisches Management und Praxisverluste.' },
  { url: '/ratgeber/blockiergebuehren-vermeiden', title: 'Blockiergebühren an Ladesäulen vermeiden: Karenzzeiten & Tarife | ladestandorte.de', desc: 'Standzeitgebühren ab 240 Min. AC und 60 Min. DC vermeiden. Karenzzeiten, Kostenfallen, Nacht-Regelungen und Betreibervergleich verständlich aufbereitet.' },
  { url: '/glossar', title: 'E-Mobilität Glossar: Fachbegriffe von AC bis V2G | ladestandorte.de', desc: 'Verständliche Erklärungen aller wichtigen Begriffe rund um Laden, Batterietechnik, Steckertypen und Normen.' },
  { url: '/methodik', title: 'Datenquellen & Methodik · ladestandorte.de', desc: 'Dokumentation der Datenquellen, Kriterien für Standortdossiers, Klassifikation von Quelldaten und abgeleiteten Kennzahlen sowie Berechnungsmodelle.' },
  { url: '/mcs', title: 'Megawatt Charging System (MCS): E-Lkw Ladehubs in Deutschland 2026', desc: 'Megawatt-Schnellladen für schwere E-Lkw in Deutschland: Verifizierte MCS- und Lkw-Ladeparks bis 1.200 kW, Standorte, Normung & Korridore.' },
  { url: '/mcs/ladestationen', title: 'MCS & E-Lkw Ladestationen Verzeichnis Deutschland 2026', desc: 'Verzeichnis aller verifizierten Megawatt- und Schwerlast-Ladeparks für Elektro-Lkw entlang deutscher Bundesautobahnen. Ladeleistung, Buchten & Dossiers.' },
  { url: '/mcs/was-ist-mcs', title: 'Was ist MCS? Das Megawatt Charging System technisch erklärt', desc: 'Alles zum MCS-Ladestandard für schwere Nutzfahrzeuge: CharIN-Norm, bis zu 3.750 kW Ladeleistung, flüssigkeitsgekühlte Stecker & ISO 15118-20.' },
  { url: '/mcs/mcs-vs-ccs', title: 'MCS vs. CCS im Vergleich: Unterschiede, Leistung & Ladezeiten', desc: 'Megawatt Charging System vs. Combined Charging System im direkten Vergleich: Steckergeometrie, Dauerstrom, Ladedauer und Einsatzbereiche.' },
  { url: '/mcs/lkw-laden', title: 'Lkw-Laden & 45-Minuten-Pause: Logistik im Fernverkehr', desc: 'Wie E-Lkw-Laden mit den gesetzlichen Lenk- und Ruhezeiten nach EG 561/2006 harmoniert. Nachlademengen, Drive-Through-Buchten und Depot vs. Highway.' },
  { url: '/impressum', title: 'Impressum | ladestandorte.de', desc: 'Rechtliche Anbieterkennzeichnung und Kontaktinformationen von ladestandorte.de.' },
  { url: '/datenschutz', title: 'Datenschutzerklärung | ladestandorte.de', desc: 'Informationen zur Datenverarbeitung, DSGVO-Konformität und Privatsphäre auf ladestandorte.de.' },
  { url: '/404', title: '404 – Seite nicht gefunden | ladestandorte.de', desc: 'Die angeforderte Seite existiert nicht oder wurde verschoben.' },
];

const cityRoutes = (CITIES_DATA || []).map((c) => ({
  url: `/staedte/${c.slug}`,
  title: `Ladestationen ${c.name}: Ladepunkte & HPC-Daten | ladestandorte.de`,
  desc: `Aktuelle Auswertung veröffentlichter BNetzA-Registerdaten für ${c.name}: ${c.ladepunkteGesamt.toLocaleString('de-DE')} Ladepunkte, ${c.hpcLadepunkte} Ladepunkte ≥150 kW und Ladepunktdichte.`,
}));

const motorwayRoutes = (MOTORWAYS_DATA || []).map((m) => ({
  url: `/autobahnen/${m.slug}`,
  title: `Schnellladen ${m.name}: HPC-Ladeparks an Raststätten & Autobahn 2026`,
  desc: `Schnellladeparks an der ${m.name} (${m.route}): IONITY, EnBW, Tesla & mehr. Bis zu ${m.maxKw} kW HPC. Alle Raststätten, Preise & Öffnungszeiten.`,
}));

const operatorRoutes = (OPERATORS_DATA || []).map((o) => ({
  url: `/betreiber/${o.slug}`,
  title: `${o.name}: Ladenetz, Tarife & ${o.totalPointsDE.toLocaleString('de-DE')} Ladepunkte in Deutschland 2026`,
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

// Legacy alias route for enbw-mobility-plus
const aliasRoutes = [
  {
    url: '/betreiber/enbw-mobility-plus',
    title: 'EnBW mobility+: Ladenetz, Tarife & 11.548 Ladepunkte in Deutschland 2026',
    desc: 'EnBW mobility+ im Faktencheck: 11.548 Ladepunkte, bis zu 300 kW HPC, 66% HPC-Anteil. Preise, Roaming, Plug & Charge & BNetzA-Daten 2026.'
  }
];

const allRoutes = [
  ...staticRoutes,
  ...cityRoutes,
  ...motorwayRoutes,
  ...operatorRoutes,
  ...stationRoutes,
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
    const fullUrl = `https://www.ladestandorte.de${route.url === '/' ? '' : route.url}`;
    rendered = rendered.replace(/<link rel="canonical" href=".*?" \/>/, `<link rel="canonical" href="${fullUrl}" />`);
    rendered = rendered.replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${fullUrl}" />`);
    rendered = rendered.replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${route.title}" />`);
    rendered = rendered.replace(/<meta name="twitter:title" content=".*?" \/>/, `<meta name="twitter:title" content="${route.title}" />`);
    rendered = rendered.replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${route.desc}" />`);
    rendered = rendered.replace(/<meta name="twitter:description" content=".*?" \/>/, `<meta name="twitter:description" content="${route.desc}" />`);

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

// Generate static search index
try {
  const { generateSearchIndex } = await import('./scripts/build-search-index.js');
  await generateSearchIndex();
} catch (searchIndexErr) {
  console.error('  ✗ Error building search index:', searchIndexErr);
}
