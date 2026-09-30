import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');
const { render, CITIES_DATA, MOTORWAYS_DATA, OPERATORS_DATA } = await import('./dist-ssr/entry-server.js');

const staticRoutes = [
  { url: '/', title: 'Ladestandorte.de: Ladesäulen & Schnellladeparks in Deutschland', desc: 'Finde über 130.000 öffentlich zugängliche Ladesäulen, HPC-Schnelllader und Ladeparks in Deutschland. Bundesnetzagentur-Daten, Filter & Ladezeit-Rechner.' },
  { url: '/suche', title: 'Ladesäulen Suche: Schnelllader & AC-Stationen finden | ladestandorte.de', desc: 'Interaktive Suche nach Ladesäulen in ganz Deutschland. Filtern nach Leistung (kW), Steckertypen, Betreibern und kostenlosem Laden.' },
  { url: '/staedte', title: 'Ladeinfrastruktur nach Städten: Alle Standorte | ladestandorte.de', desc: 'Übersicht der Ladeinfrastruktur in über 50 deutschen Städten. Ladepunkte, durchschnittliche kW und Top-Betreiber im Vergleich.' },
  { url: '/autobahnen', title: 'Laden an deutschen Autobahnen: HPC-Schnellladeparks | ladestandorte.de', desc: 'Schnellladestationen entlang der Bundesautobahnen A1 bis A99. Raststätten, Autohöfe und High-Power-Charging Ladeparks.' },
  { url: '/betreiber', title: 'Ladesäulen-Betreiber (CPO) in Deutschland im Vergleich | ladestandorte.de', desc: 'Große Ladeanbieter wie EnBW, Ionity, Tesla Supercharger, Aral pulse, Fastned und EWE Go im Profil und Netzwerkvergleich.' },
  { url: '/rechner', title: 'Ladezeit- & Ladekosten-Rechner für Elektroautos | ladestandorte.de', desc: 'Berechne exakte Ladedauer, Ladekurve und Ladekosten für AC- und DC-Laden für alle gängigen Elektrofahrzeuge.' },
  { url: '/rechner-embed', title: 'Ladezeit-Rechner Widget | ladestandorte.de', desc: 'Kostenlos einbettbarer Ladezeit- und Ladekosten-Rechner für E-Autos.' },
  { url: '/ladekarten', title: 'Ladekarten-Vergleich 2026: Tarife, Roaming & kWh-Preise | ladestandorte.de', desc: 'Die besten Ladekarten und Apps im unabhängigen Vergleich: EnBW mobility+, Maingau, Ionity Passport, Tesla App und mehr.' },
  { url: '/wallbox-vergleich', title: 'Wallbox-Vergleich 2026: Testsieger für Zuhause | ladestandorte.de', desc: 'KfW-fähige Wallboxen mit 11 kW und 22 kW für Garage und Carport im Test: ABL, Heidelberg, easee, go-e und Webasto.' },
  { url: '/ratgeber', title: 'Ratgeber Elektromobilität: Lade-Tipps & Praxisleitfäden | ladestandorte.de', desc: 'Fachartikel zu Ladeverlusten, Roaming-Preisen, Batterieschonung, Stecker-Standards und Ladeetikette.' },
  { url: '/ratgeber/ladekarten-dschungel', title: 'Ladekarten-Dschungel: Roaming-Preise & Grundgebühren | ladestandorte.de', desc: 'Welche Ladekarte lohnt sich für wen? CPO vs. EMP, Roaming-Preise, monatliche Grundgebühren und Spartipps im Detail erklärt.' },
  { url: '/ratgeber/ac-vs-dc-ladeverluste', title: 'AC vs. DC Ladeverluste: Wirkungsgrad im Detail | ladestandorte.de', desc: 'Wie viel Strom verpufft beim Laden? AC-Onboard-Lader vs. DC-Schnellladung, thermisches Management und Praxisverluste.' },
  { url: '/ratgeber/blockiergebuehren-vermeiden', title: 'Blockiergebühren an Ladesäulen vermeiden: Karenzzeiten & Tarife | ladestandorte.de', desc: 'Standzeitgebühren ab 240 Min. AC und 60 Min. DC vermeiden. Karenzzeiten, Kostenfallen, Nacht-Regelungen und Betreibervergleich verständlich aufbereitet.' },
  { url: '/glossar', title: 'E-Mobilität Glossar: Fachbegriffe von AC bis V2G | ladestandorte.de', desc: 'Verständliche Erklärungen aller wichtigen Begriffe rund um Laden, Batterietechnik, Steckertypen und Normen.' },
  { url: '/impressum', title: 'Impressum | ladestandorte.de', desc: 'Rechtliche Anbieterkennzeichnung und Kontaktinformationen von ladestandorte.de.' },
  { url: '/datenschutz', title: 'Datenschutzerklärung | ladestandorte.de', desc: 'Informationen zur Datenverarbeitung, DSGVO-Konformität und Privatsphäre auf ladestandorte.de.' },
];

const cityRoutes = (CITIES_DATA || []).map((c) => ({
  url: `/staedte/${c.slug}`,
  title: `Ladesäulen in ${c.name}: ${c.ladepunkteGesamt.toLocaleString('de-DE')} Ladepunkte & HPC-Ladenetz 2026`,
  desc: `Öffentliche Ladesäulen & HPC-Schnelllader in ${c.name} (${c.bundesland}): ${c.ladepunkteGesamt.toLocaleString('de-DE')} Ladepunkte, ${c.hpcLadepunkte} HPC-Schnelllader. BNetzA Daten & Standorte 2026.`,
}));

const motorwayRoutes = (MOTORWAYS_DATA || []).map((m) => ({
  url: `/autobahnen/${m.slug}`,
  title: `Schnellladen ${m.name}: HPC-Ladeparks an Raststätten & Autobahn 2026`,
  desc: `${m.totalChargingHubs} Schnellladeparks an der ${m.name} (${m.route}): IONITY, EnBW, Tesla & mehr. Bis zu ${m.maxKw} kW HPC. Alle Raststätten, Preise & Öffnungszeiten.`,
}));

const operatorRoutes = (OPERATORS_DATA || []).map((o) => ({
  url: `/betreiber/${o.slug}`,
  title: `${o.name}: Ladenetz, Tarife & ${o.totalPointsDE.toLocaleString('de-DE')} Ladepunkte in Deutschland 2026`,
  desc: `${o.name} im Faktencheck: ${o.totalPointsDE.toLocaleString('de-DE')} Ladepunkte, bis zu ${o.maxKw} kW HPC, ${o.hpcShare}% HPC-Anteil. Preise, Roaming, Plug & Charge & BNetzA-Daten 2026.`,
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
