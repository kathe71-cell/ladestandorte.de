export interface OperatorData {
  slug: string;
  name: string;
  headquarters: string;
  totalPointsDE: number;
  hpcShare: number; // in percent
  maxKw: number;
  roamingPartnersCount: number;
  plugAndCharge: boolean;
  autocharge: boolean;
  appRating: number;
  standardPriceAc: number; // €/kWh
  standardPriceDc: number; // €/kWh
  bnetzaAnteil: string;
  description: string;
  features: string[];
}

export const OPERATORS_DATA: OperatorData[] = [
  {
    slug: "enbw",
    name: "EnBW mobility+",
    headquarters: "Karlsruhe, Baden-Württemberg",
    totalPointsDE: 5200,
    hpcShare: 78,
    maxKw: 400,
    roamingPartnersCount: 750000,
    plugAndCharge: false,
    autocharge: true, // AutoCharge via MAC-Adresse
    appRating: 4.8,
    standardPriceAc: 0.54,
    standardPriceDc: 0.54,
    bnetzaAnteil: "Größter Schnelllade-CPO Deutschlands",
    description: "Marktführer bei Ultra-Schnellladeparks (HyperNetz) mit überdachten Großhubs, Solar-PV-Dächern und nahtlosem AutoCharge.",
    features: ["EnBW HyperNetz mit bis zu 400 kW", "AutoCharge (Kabel einstecken und laden)", "100 % zertifizierter Ökostrom", "ADAC-Empfehlung und Testsieger bei Stiftung Warentest"]
  },
  {
    slug: "ionity",
    name: "IONITY",
    headquarters: "München, Bayern",
    totalPointsDE: 1850,
    hpcShare: 100,
    maxKw: 350,
    roamingPartnersCount: 200000,
    plugAndCharge: true,
    autocharge: false,
    appRating: 4.5,
    standardPriceAc: 0.0, // Reine DC-HPC-Stationen
    standardPriceDc: 0.72,
    bnetzaAnteil: "Führender europäischer Autobahn-HPC-Verbund",
    description: "Gemeinschaftsunternehmen von BMW, Mercedes-Benz, Ford, Hyundai, Porsche und Audi. Konzentriert sich exklusiv auf High Power Charging an europäischen Autobahnachsen.",
    features: ["Ausschließlich 350 kW HPC Lader", "Plug & Charge nach ISO 15118", "Direkt an Autobahn-Raststätten und Tank & Rast", "Europäisches Ladenetzwerk"]
  },
  {
    slug: "tesla",
    name: "Tesla Supercharger",
    headquarters: "Berlin / Grünheide & Austin",
    totalPointsDE: 3400,
    hpcShare: 96,
    maxKw: 350,
    roamingPartnersCount: 50000,
    plugAndCharge: true,
    autocharge: true,
    appRating: 4.9,
    standardPriceAc: 0.0,
    standardPriceDc: 0.46, // Variabel je nach Uhrzeit, Region und Auslastung
    bnetzaAnteil: "Höchste Zuverlässigkeit & dynamische Tarife",
    description: "Das weltweit größte Schnellladenetzwerk. In Deutschland sind über 85 % aller Supercharger-Standorte (V3 und V4) für alle Elektroautos aller Marken freigeschaltet.",
    features: ["Über 85 % für alle Fabrikate geöffnet", "Bis zu 350 kW an V4-Stationen", "Sehr günstige dynamische Tarife (ab ca. 0,38 €/kWh)", "AFIR-Kartenterminals an V4-Stationen"]
  },
  {
    slug: "aral-pulse",
    name: "Aral pulse",
    headquarters: "Bochum, Nordrhein-Westfalen",
    totalPointsDE: 2900,
    hpcShare: 88,
    maxKw: 350,
    roamingPartnersCount: 450000,
    plugAndCharge: true,
    autocharge: true,
    appRating: 4.4,
    standardPriceAc: 0.57,
    standardPriceDc: 0.69,
    bnetzaAnteil: "Dichtestes Schnellladenetz an Tankstellen",
    description: "Die E-Mobilitätsmarke von bp und Aral. Wandelt das bundesweite Aral-Tankstellennetz in urbane und Autobahn-Schnelllade-Hubs mit Shop- und Bistro-Infrastruktur um.",
    features: ["Schnellladen an bekannten Aral Tankstellen", "Rewe To Go Shops und Gastronomie während des Ladens", "ADAC e-Charge Kooperationspartner", "HPC bis 350 kW"]
  },
  {
    slug: "fastned",
    name: "Fastned",
    headquarters: "Amsterdam / Köln",
    totalPointsDE: 1400,
    hpcShare: 100,
    maxKw: 400,
    roamingPartnersCount: 300000,
    plugAndCharge: false,
    autocharge: true,
    appRating: 4.7,
    standardPriceAc: 0.0,
    standardPriceDc: 0.69,
    bnetzaAnteil: "Pionier für überdachte Schnelllade-Architektur",
    description: "Niederländischer Schnelllade-Spezialist, bekannt für charakteristische gelbe Holzdächer mit Solarzellen. Bietet extrem verlässliche 300–400 kW Ladepunkte.",
    features: ["Ikonisches wetterfestes Solardach", "Autocharge für automatisches Starten", "Durchfahr-Layouts auch für Gespanne/Anhänger", "100 % erneuerbare Energie"]
  },
  {
    slug: "allego",
    name: "Allego",
    headquarters: "Arnhem / Berlin",
    totalPointsDE: 2100,
    hpcShare: 65,
    maxKw: 300,
    roamingPartnersCount: 500000,
    plugAndCharge: false,
    autocharge: false,
    appRating: 4.1,
    standardPriceAc: 0.56,
    standardPriceDc: 0.68,
    bnetzaAnteil: "Breite Verteilung an Autobahnen und Handelsstandorten",
    description: "Einer der traditionsreichsten Betreiber Europas mit Ladepunkten an Schnellstraßen, Bauhaus-Märkten und Fast-Food-Ketten.",
    features: ["Standorte an bekannten Baumärkten und Gastronomie", "Umfassende Roaming-Kompatibilität", "Direktbezahlung via Kreditkarte gemäß AFIR"]
  },
  {
    slug: "eon-drive",
    name: "E.ON Drive",
    headquarters: "Essen, Nordrhein-Westfalen",
    totalPointsDE: 2400,
    hpcShare: 60,
    maxKw: 350,
    roamingPartnersCount: 500000,
    plugAndCharge: true,
    autocharge: false,
    appRating: 4.2,
    standardPriceAc: 0.54,
    standardPriceDc: 0.65,
    bnetzaAnteil: "Große Bandbreite von City-AC bis Autobahn-HPC",
    description: "Der Energiekonzern E.ON betreibt ein dichtes Ladenetz aus kommunalen AC-Säulen und modernen High-Power-Chargern entlang der Hauptverkehrswege.",
    features: ["Kombinierte Angebote mit Hausstrom-Tarifen", "Verlässliche HPC-Infrastruktur", "Umfangreiche Flottenlösungen"]
  },
  {
    slug: "shell-recharge",
    name: "Shell Recharge",
    headquarters: "Hamburg / Den Haag",
    totalPointsDE: 1950,
    hpcShare: 72,
    maxKw: 350,
    roamingPartnersCount: 600000,
    plugAndCharge: false,
    autocharge: false,
    appRating: 4.3,
    standardPriceAc: 0.55,
    standardPriceDc: 0.64,
    bnetzaAnteil: "Starke Expansion an Shell Tankstellen & Rewe Märkten",
    description: "Globales Ladenetzwerk der Shell Gruppe. Bietet neben Tankstellen-HPC-Ladern auch Schnellladestationen an Supermärkten wie Rewe und Penny.",
    features: ["Laden während des Supermarkteinkaufs", "Shell ClubSmart Punkte sammeln", "Großes internationales Roaming-Netzwerk"]
  },
  {
    slug: "ewe-go",
    name: "EWE Go",
    headquarters: "Oldenburg, Niedersachsen",
    totalPointsDE: 2600,
    hpcShare: 68,
    maxKw: 350,
    roamingPartnersCount: 400000,
    plugAndCharge: false,
    autocharge: false,
    appRating: 4.4,
    standardPriceAc: 0.52,
    standardPriceDc: 0.62,
    bnetzaAnteil: "Exklusivpartner für McDonald's Schnelllader",
    description: "Nordwestdeutscher Energieversorger mit bundesweitem HPC-Netz an über 1.000 McDonald's Restaurants in ganz Deutschland.",
    features: ["Laden an hunderten McDonald's Restaurants", "Transparente Einheitspreise", "Starke regionale Verankerung in Norddeutschland"]
  },
  {
    slug: "pfalzwerke",
    name: "Pfalzwerke",
    headquarters: "Ludwigshafen, Rheinland-Pfalz",
    totalPointsDE: 1750,
    hpcShare: 70,
    maxKw: 300,
    roamingPartnersCount: 350000,
    plugAndCharge: false,
    autocharge: false,
    appRating: 4.3,
    standardPriceAc: 0.53,
    standardPriceDc: 0.64,
    bnetzaAnteil: "Spezialist für Einzelhandels-Schnellladung",
    description: "Vorreiter bei der Elektrifizierung von Baumärkten (u.a. Hornbach) und Einkaufszentren mit zuverlässigen Alpitronic Hypercharger-Stationen.",
    features: ["Hypercharger an Hornbach, Globus und Möbelmärkten", "100 % Ökostrom aus regionalen Anlagen", "Einfache Ad-hoc-Zahlung"]
  }
];
