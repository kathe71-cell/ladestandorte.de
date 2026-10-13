export interface StaticRouteItem {
  url: string;
  title: string;
  desc: string;
  category: 'tools' | 'knowledge' | 'mcs' | 'stations' | 'motorways' | 'cities' | 'operators';
  categoryLabel?: string;
  badge?: string;
  keywords?: string[];
  priority?: number;
  noIndex?: boolean;
  excludeFromSearch?: boolean;
}

export const STATIC_ROUTES: StaticRouteItem[] = [
  // 1. Startseite
  {
    url: '/',
    title: 'Ladestandorte.de – Schnellladestationen, Ladeparks & Ladeinfrastruktur',
    desc: 'Finde über 130.000 öffentlich zugängliche Ladesäulen, HPC-Schnelllader und Ladeparks in Deutschland. Bundesnetzagentur-Daten, Filter & Ladezeit-Rechner.',
    category: 'tools',
    categoryLabel: 'Portal',
    badge: 'Portal',
    keywords: ['ladestandorte', 'ladeinfrastruktur', 'deutschland', 'schnellladen', 'hpc', 'ladeparks', 'ladesäulen', 'portal', 'home', 'übersicht'],
    priority: 100
  },

  // 2. Monitore & Register-Aggregatoren
  {
    url: '/staedte',
    title: 'Ladeinfrastruktur nach Städten: Alle Standorte | ladestandorte.de',
    desc: 'Übersicht der Ladeinfrastruktur in über 50 deutschen Städten. Ladepunkte, durchschnittliche kW und Top-Betreiber im Vergleich.',
    category: 'tools',
    categoryLabel: 'Portal & Register',
    badge: 'Städte',
    keywords: ['städte', 'staedte', 'staedtevergleich', 'großstädte', 'metropolen', 'kommunen', 'ladeinfrastruktur', 'bnetza', 'ladepunkte'],
    priority: 88
  },
  {
    url: '/hpc-city-monitor',
    title: 'HPC City Monitor: ≥150-kW-Ladepunkte in 50 Städten | ladestandorte.de',
    desc: 'Auswertung von Ladepunkten mit ≥150 kW Nennleistung in 50 deutschen Städten auf Basis veröffentlichter BNetzA-Registerdaten und amtlicher Destatis-Bevölkerung.',
    category: 'tools',
    categoryLabel: 'Monitore & Tools',
    badge: 'HPC Monitor',
    keywords: ['hpc city monitor', 'hpc monitor', 'high power charging', '150 kw', 'städtetest', 'destatis', 'bnetza', 'ranking', 'ausbauquote', 'hpc'],
    priority: 89
  },
  {
    url: '/cpo-monitor',
    title: 'CPO Monitor: Betreiber im BNetzA-Registervergleich | ladestandorte.de',
    desc: 'Verifizierte Betreiber-Auswertung auf Basis amtlicher BNetzA-Registerdaten. Ladepunkte ≥150 kW, Ausbauquoten und Registeranteile der führenden CPOs in Deutschland.',
    category: 'tools',
    categoryLabel: 'Monitore & Tools',
    badge: 'CPO Monitor',
    keywords: ['cpo monitor', 'cpo', 'betreiber', 'bnetza-registervergleich', 'marktanteile', 'marktführer', 'enbw', 'ionity', 'aral pulse', 'tesla', 'fastned'],
    priority: 89
  },
  {
    url: '/autobahnen',
    title: 'Laden an deutschen Autobahnen: HPC-Schnellladeparks | ladestandorte.de',
    desc: 'Schnellladestationen entlang der Bundesautobahnen A1 bis A99. Raststätten, Autohöfe und High-Power-Charging Ladeparks.',
    category: 'tools',
    categoryLabel: 'Portal & Register',
    badge: 'Autobahnen',
    keywords: ['autobahnen', 'bundesautobahn', 'bab', 'raststätten', 'autohöfe', 'fernverkehr', 'schnellladeparks', 'hpc', 'korridore'],
    priority: 88
  },
  {
    url: '/betreiber',
    title: 'Ladesäulen-Betreiber (CPO) in Deutschland im Vergleich | ladestandorte.de',
    desc: 'Große Ladeanbieter wie EnBW, Ionity, Tesla Supercharger, Aral pulse, Fastned und EWE Go im Profil und Netzwerkvergleich.',
    category: 'tools',
    categoryLabel: 'Portal & Register',
    badge: 'Betreiber',
    keywords: ['betreiber', 'cpo', 'ladeanbieter', 'ladenetz', 'enbw', 'ionity', 'tesla', 'aral pulse', 'fastned', 'ewe go', 'vergleich'],
    priority: 88
  },
  {
    url: '/ladestationen',
    title: 'Bundesweites BNetzA-Ladestationsverzeichnis: Alle Ladestationen in Deutschland | ladestandorte.de',
    desc: 'Vollständiges Register aller 117.043 öffentlich registrierten BNetzA-Ladestationen in ganz Deutschland nach Bundesland, Ort, PLZ, Betreiber und HPC-Schnellladeleistung.',
    category: 'tools',
    categoryLabel: 'Portal & Register',
    badge: 'Register',
    keywords: ['ladestationen', 'ladesäulen', 'verzeichnis', 'register', 'bnetza', 'bundesweit', 'suchverzeichnis', 'karte', 'hpc', 'standorte'],
    priority: 87
  },

  // 3. Tools & Rechner
  {
    url: '/rechner',
    title: 'Ladezeit- & Ladekosten-Rechner für Elektroautos | ladestandorte.de',
    desc: 'Berechne exakte Ladedauer, Ladekurve und Ladekosten für AC- und DC-Laden für alle gängigen Elektrofahrzeuge.',
    category: 'tools',
    categoryLabel: 'Tools & Rechner',
    badge: 'Rechner',
    keywords: ['rechner', 'ladezeit', 'ladekosten', 'ladezeitrechner', 'ladekostenrechner', 'ladeleistung', 'kwh', 'batterie', 'soc', 'ladeverluste', 'stromkosten'],
    priority: 87
  },

  // 4. Wissen, Ratgeber, Vergleiche & Förderprogramme
  {
    url: '/thg-praemie',
    title: 'THG-Prämie für Elektroautos: Antrag & Voraussetzungen | ladestandorte.de',
    desc: 'THG-Prämie für Elektroautos: Voraussetzungen, Antragsfristen und Auszahlung für 2026 und 2027 im Faktencheck. So funktioniert die Beantragung.',
    category: 'knowledge',
    categoryLabel: 'Wissen & Ratgeber',
    badge: 'THG-Prämie',
    keywords: [
      'thg',
      'thg-prämie',
      'thg prämie',
      'thg quote',
      'thg-quote',
      'thg quote verkaufen',
      'treibhausgasquote',
      'treibhausgasminderungsquote',
      'uba',
      'umweltbundesamt',
      '38. bimschv',
      'bimschv',
      '37a bimschg',
      'co2-zertifikate',
      'fahrzeugschein',
      'zulassungsbescheinigung teil i',
      'auszahlung',
      'antragsfrist',
      'quote 2026',
      'quote 2027',
      'e-auto förderung'
    ],
    priority: 86
  },
  {
    url: '/ladekarten',
    title: 'Ladekarten-Vergleich: Tarife, Roaming & kWh-Preise | ladestandorte.de',
    desc: 'Die besten Ladekarten und Apps im unabhängigen Vergleich: EnBW mobility+, Maingau, Ionity Passport, Tesla App und mehr.',
    category: 'knowledge',
    categoryLabel: 'Wissen & Ratgeber',
    badge: 'Ladekarten',
    keywords: ['ladekarten', 'ladekarten-vergleich', 'roaming', 'tarife', 'kwh-preise', 'grundgebühr', 'enbw mobility+', 'maingau', 'ionity passport', 'tesla app', 'apps'],
    priority: 85
  },
  {
    url: '/wallbox-vergleich',
    title: 'Wallbox-Vergleich: Modelle, Preise & Funktionen | ladestandorte.de',
    desc: 'KfW-fähige Wallboxen mit 11 kW und 22 kW für Garage und Carport im Test: ABL, Heidelberg, easee, go-e und Webasto.',
    category: 'knowledge',
    categoryLabel: 'Wissen & Ratgeber',
    badge: 'Wallboxen',
    keywords: ['wallbox', 'wallboxen', 'wallbox-vergleich', 'heimladen', 'garage', 'carport', 'pv-überschussladen', '11 kw', '22 kw', 'kfw-förderung'],
    priority: 84
  },
  {
    url: '/ratgeber',
    title: 'Ratgeber Elektromobilität: Lade-Tipps & Praxisleitfäden | ladestandorte.de',
    desc: 'Fachartikel zu Ladeverlusten, Roaming-Preisen, Batterieschonung, Stecker-Standards und Ladeetikette.',
    category: 'knowledge',
    categoryLabel: 'Wissen & Ratgeber',
    badge: 'Ratgeber',
    keywords: ['ratgeber', 'leitfäden', 'wissen', 'tipps', 'lade-tipps', 'praxis', 'elektromobilität', 'e-auto', 'anleitungen'],
    priority: 82
  },
  {
    url: '/ratgeber/ladekarten-dschungel',
    title: 'Ladekarten-Dschungel: Roaming-Preise & Grundgebühren | ladestandorte.de',
    desc: 'Welche Ladekarte lohnt sich für wen? CPO vs. EMP, Roaming-Preise, monatliche Grundgebühren und Spartipps im Detail erklärt.',
    category: 'knowledge',
    categoryLabel: 'Wissen & Ratgeber',
    badge: 'Ratgeber',
    keywords: ['ladekarten-dschungel', 'cpo vs emp', 'roaming-preise', 'grundgebühren', 'tarife', 'spartipps', 'ladekarte', 'emp', 'cpo'],
    priority: 80
  },
  {
    url: '/ratgeber/ac-vs-dc-ladeverluste',
    title: 'AC vs. DC Ladeverluste: Wirkungsgrad im Detail | ladestandorte.de',
    desc: 'Wie viel Strom verpufft beim Laden? AC-Onboard-Lader vs. DC-Schnellladung, thermisches Management und Praxisverluste.',
    category: 'knowledge',
    categoryLabel: 'Wissen & Ratgeber',
    badge: 'Ratgeber',
    keywords: ['ac vs dc', 'ladeverluste', 'wirkungsgrad', 'onboard-lader', 'gleichrichter', 'hpc', 'energieverlust', 'ac', 'dc'],
    priority: 80
  },
  {
    url: '/ratgeber/blockiergebuehren-vermeiden',
    title: 'Blockiergebühren an Ladesäulen vermeiden: Karenzzeiten & Tarife | ladestandorte.de',
    desc: 'Standzeitgebühren ab 240 Min. AC und 60 Min. DC vermeiden. Karenzzeiten, Kostenfallen, Nacht-Regelungen und Betreibervergleich verständlich aufbereitet.',
    category: 'knowledge',
    categoryLabel: 'Wissen & Ratgeber',
    badge: 'Ratgeber',
    keywords: ['blockiergebühren', 'blockiergebühr', 'standzeitgebühr', 'karenzzeit', 'standzeit', 'kostenfalle', 'nachtregelung', 'abzocke vermeiden'],
    priority: 80
  },
  {
    url: '/glossar',
    title: 'E-Mobilität Glossar: Fachbegriffe von AC bis V2G | ladestandorte.de',
    desc: 'Verständliche Erklärungen aller wichtigen Begriffe rund um Laden, Batterietechnik, Steckertypen und Normen.',
    category: 'knowledge',
    categoryLabel: 'Wissen & Ratgeber',
    badge: 'Glossar',
    keywords: ['glossar', 'lexikon', 'fachbegriffe', 'definitionen', 'ac', 'dc', 'hpc', 'mcs', 'ccs', 'typ 2', 'plug and charge', 'v2g', 'soc', 'afir'],
    priority: 78
  },
  {
    url: '/methodik',
    title: 'Datenquellen & Methodik · ladestandorte.de',
    desc: 'Dokumentation der Datenquellen, Kriterien für Standortdossiers, Klassifikation von Quelldaten und abgeleiteten Kennzahlen sowie Berechnungsmodelle.',
    category: 'knowledge',
    categoryLabel: 'Wissen & Ratgeber',
    badge: 'Methodik',
    keywords: ['methodik', 'datenquellen', 'bnetza daten', 'datenintegrität', 'berechnungsmodelle', 'standortdossiers', 'transparenz', 'hpc kennzahlen'],
    priority: 75
  },

  // 5. MCS (Megawatt Charging System) & Schwerlast
  {
    url: '/mcs',
    title: 'Megawatt Charging System (MCS): E-Lkw Ladehubs in Deutschland',
    desc: 'Megawatt-Schnellladen für schwere E-Lkw in Deutschland: Verifizierte MCS- und Lkw-Ladeparks bis 1.200 kW, Standorte, Normung & Korridore.',
    category: 'mcs',
    categoryLabel: 'MCS & Lkw',
    badge: 'MCS Hub',
    keywords: ['mcs', 'megawatt charging system', 'megawatt', 'e-lkw', 'lkw-laden', 'schwerlast', 'charin', 'korridore', '1000 kw', 'ladehubs'],
    priority: 86
  },
  {
    url: '/mcs/ladestationen',
    title: 'MCS & E-Lkw Ladestationen Verzeichnis Deutschland',
    desc: 'Verzeichnis aller verifizierten Megawatt- und Schwerlast-Ladeparks für Elektro-Lkw entlang deutscher Bundesautobahnen. Ladeleistung, Buchten & Dossiers.',
    category: 'mcs',
    categoryLabel: 'MCS & Lkw',
    badge: 'MCS Verzeichnis',
    keywords: ['mcs ladestationen', 'lkw ladestationen', 'megawatt ladeparks', 'autobahn ladeparks', 'drive-through', 'buchten', 'schwerlast', 'standorte'],
    priority: 85
  },
  {
    url: '/mcs/was-ist-mcs',
    title: 'Was ist MCS? Das Megawatt Charging System technisch erklärt',
    desc: 'Alles zum MCS-Ladestandard für schwere Nutzfahrzeuge: CharIN-Norm, bis zu 3.750 kW Ladeleistung, flüssigkeitsgekühlte Stecker & ISO 15118-20.',
    category: 'mcs',
    categoryLabel: 'MCS & Lkw',
    badge: 'MCS Technik',
    keywords: ['was ist mcs', 'mcs standard', 'charin', 'megawatt stecker', 'flüssigkeitskühlung', '3750 kw', 'iso 15118-20', 'technik'],
    priority: 83
  },
  {
    url: '/mcs/mcs-vs-ccs',
    title: 'MCS vs. CCS im Vergleich: Unterschiede, Leistung & Ladezeiten',
    desc: 'Megawatt Charging System vs. Combined Charging System im direkten Vergleich: Steckergeometrie, Dauerstrom, Ladedauer und Einsatzbereiche.',
    category: 'mcs',
    categoryLabel: 'MCS & Lkw',
    badge: 'MCS vs. CCS',
    keywords: ['mcs vs ccs', 'ccs', 'mcs', 'unterschied', 'vergleich', 'steckergeometrie', 'dauerstrom', 'ladezeiten', 'pkw vs lkw'],
    priority: 83
  },
  {
    url: '/mcs/lkw-laden',
    title: 'Lkw-Laden & 45-Minuten-Pause: Logistik im Fernverkehr',
    desc: 'Wie E-Lkw-Laden mit den gesetzlichen Lenk- und Ruhezeiten nach EG 561/2006 harmoniert. Nachlademengen, Drive-Through-Buchten und Depot vs. Highway.',
    category: 'mcs',
    categoryLabel: 'MCS & Lkw',
    badge: 'Lkw Logistik',
    keywords: ['lkw-laden', '45 minuten pause', 'lenkzeiten', 'ruhezeiten', 'eg 561 2006', 'logistik', 'fernverkehr', 'nachladen', 'depot'],
    priority: 83
  },

  // 6. Ausgeschlossene / Nicht-indexierte Seiten (noIndex oder rechtlich/technisch)
  {
    url: '/suche',
    title: 'Ladesäulen Suche: Schnelllader & AC-Stationen finden | ladestandorte.de',
    desc: 'Interaktive Suche nach Ladesäulen in ganz Deutschland. Filtern nach Leistung (kW), Steckertypen, Betreibern und kostenlosem Laden.',
    category: 'tools',
    noIndex: true,
    excludeFromSearch: true
  },
  {
    url: '/rechner-embed',
    title: 'Ladezeit-Rechner Widget | ladestandorte.de',
    desc: 'Kostenlos einbettbarer Ladezeit- und Ladekosten-Rechner für E-Autos.',
    category: 'tools',
    noIndex: true,
    excludeFromSearch: true
  },
  {
    url: '/impressum',
    title: 'Impressum | ladestandorte.de',
    desc: 'Rechtliche Anbieterkennzeichnung und Kontaktinformationen von ladestandorte.de.',
    category: 'knowledge',
    noIndex: false,
    excludeFromSearch: true
  },
  {
    url: '/datenschutz',
    title: 'Datenschutzerklärung | ladestandorte.de',
    desc: 'Informationen zur Datenverarbeitung, DSGVO-Konformität und Privatsphäre auf ladestandorte.de.',
    category: 'knowledge',
    noIndex: false,
    excludeFromSearch: true
  },
  {
    url: '/projektuebernahme',
    title: 'Projektübernahme | ladestandorte.de',
    desc: 'Informationen zur möglichen Übernahme von ladestandorte.de',
    category: 'knowledge',
    noIndex: true,
    excludeFromSearch: true
  },
  {
    url: '/404',
    title: '404 – Seite nicht gefunden | ladestandorte.de',
    desc: 'Die angeforderte Seite existiert nicht oder wurde verschoben.',
    category: 'tools',
    noIndex: true,
    excludeFromSearch: true
  }
];

/**
 * Filtert alle suchfähigen öffentlichen Routen
 */
export function getIndexableStaticRoutes(): StaticRouteItem[] {
  return STATIC_ROUTES.filter(r => !r.excludeFromSearch && !r.noIndex);
}
