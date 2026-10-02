// operators_new.ts
// Stand: September 2026
// Quellen: BNetzA-Berichte, Unternehmenswebsites, GoingElectric, electrive.net, ecomento.de
// Hinweis: Mit * markierte Zahlen sind fundierte Schätzungen auf Basis öffentlicher Daten

import cpoDataset from './generated/cpo-monitor.generated.json';

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
  standardPriceAc: number; // €/kWh, 0 if no AC
  standardPriceDc: number; // €/kWh
  bnetzaAnteil: string; // kurze Positionierungsbeschreibung
  description: string;
  features: string[];
}

const BASE_OPERATORS_DATA: OperatorData[] = [
  // ── BESTANDSBETREIBER (aktualisiert) ─────────────────────────────────────

  {
    slug: "enbw",
    name: "EnBW mobility+",
    headquarters: "Karlsruhe, Deutschland",
    totalPointsDE: 11548, // BNetzA-Daten Q1 2026
    hpcShare: 66, // 7.644 HPC-Punkte von 11.548 gesamt (GoingElectric Sep 2026)
    maxKw: 300,
    roamingPartnersCount: 120,
    plugAndCharge: true,
    autocharge: true,
    standardPriceAc: 0.49,
    standardPriceDc: 0.49, // Tarif Free (ad-hoc); Tarif M: 0,46 €/kWh mit 5,99 € GG
    bnetzaAnteil: "Überregionaler CPO mit breiter Bundesabdeckung",
    description:
      "EnBW mobility+ ist Einer der führenden überregionalen Ladeinfrastrukturbetreiber in Deutschland mit über 11.500 registrierten Ladepunkten. Das Netz ist besonders dicht entlang von Autobahnen und in Ballungsräumen. Mit dem Tarif M (5,99 €/Monat) sinkt der kWh-Preis auf 0,46 € ohne weitere Unterscheidung zwischen AC und DC.",
    features: [
      "Dichtes Schnellladenetz an Autobahnen",
      "AutoCharge (Plug & Charge ohne Karte)",
      "HyperNetz mit über 750.000 europaweiten Roaming-Punkten",
      "Dynamische Abrechnung nach kWh (kein Minutentarif)",
      "App mit Echtzeit-Belegungsanzeige",
    ],
  },
  {
    slug: "ionity",
    name: "IONITY",
    headquarters: "München, Deutschland",
    totalPointsDE: 3200, // ca. 250 Standorte × ~13 Punkte, gerundet; GoingElectric + BNetzA Q1 2026
    hpcShare: 100,
    maxKw: 350,
    roamingPartnersCount: 80,
    plugAndCharge: true,
    autocharge: false,
    standardPriceAc: 0,
    standardPriceDc: 0.79, // ad-hoc 2026; Passport Power: 0,41 €/kWh + 11,99 €/Monat
    bnetzaAnteil: "HPC-Spezialist an Autobahnen (Raststätten)",
    description:
      "IONITY ist das führende paneuropäische HPC-Netzwerk an Autobahnraststätten und wurde von den großen Automobilherstellern (BMW, Mercedes, Ford, VW-Gruppe, Hyundai) gegründet. Alle Säulen liefern bis zu 350 kW und ausschließlich CCS. Mit dem IONITY Passport lässt sich der kWh-Preis auf 0,41 € senken.",
    features: [
      "Bis zu 350 kW Ladeleistung (CCS)",
      "Exklusiv an Autobahnraststätten",
      "Plug & Charge (ISO 15118) unterstützt",
      "IONITY Passport für Vielnutzer",
      "100 % Ökostrom",
    ],
  },
  {
    slug: "tesla-supercharger",
    name: "Tesla Supercharger",
    headquarters: "Austin, USA (DE-Betrieb: Amsterdam/Berlin)",
    totalPointsDE: 3665, // BNetzA Q1 2026 (offiziell registriert)
    hpcShare: 100,
    maxKw: 350, // V4 Supercharger
    roamingPartnersCount: 0, // Eigennetz; seit 2023 für Fremdmarken geöffnet
    plugAndCharge: true,
    autocharge: true,
    standardPriceAc: 0,
    standardPriceDc: 0.52, // Non-Tesla-Tarif; Tesla-Besitzer i.d.R. günstiger je nach Tarif
    bnetzaAnteil: "HPC-Netzwerk für Tesla- und CCS-Fahrzeuge",
    description:
      "Tesla Supercharger ist nach installierter Leistung der zweitstärkste Betreiber in Deutschland. Seit 2022/23 sind viele Standorte für Fremdmarken geöffnet. Die V4-Generation liefert bis zu 350 kW. Tesla-Besitzer zahlen günstiger, da Kosten im Fahrzeugvertrag oder Ladeabo integriert sind.",
    features: [
      "V4-Supercharger bis 350 kW",
      "Für Fremdmarken (CCS) geöffnet",
      "Automatische Abrechnung im Tesla-Fahrzeug",
      "Sehr hohe Verfügbarkeit und Zuverlässigkeit",
      "Magic Dock (Adapter integriert) bei neueren Standorten",
    ],
  },
  {
    slug: "aral-pulse",
    name: "Aral pulse",
    headquarters: "Bochum, Deutschland / London, UK",
    totalPointsDE: 4000, // Pressemitteilung Aral Mai 2026: „4.000 Ladepunkte Meilenstein"
    hpcShare: 76, // 3.054 HPC / 4.000 gesamt (GoingElectric Sep 2026)
    maxKw: 300,
    roamingPartnersCount: 50,
    plugAndCharge: true,
    autocharge: false,
    standardPriceAc: 0.52,
    standardPriceDc: 0.62,
    bnetzaAnteil: "HPC-Netz an Tankstellen und Knotenpunkten",
    description:
      "Aral pulse (betrieben von bp pulse) ist eines der führenden Schnellladenetze Deutschlands mit über 4.000 Ladepunkten. Das Netz umfasst vorwiegend moderne HPC-Stationen mit bis zu 300 kW an Aral-Tankstellen sowie neue Megawatt-Ladeparks für E-LKW. Neben schnellen Ladezeiten profitieren Fahrer von Payback-Punkten, REWE To Go Shops und verlässlicher Beleuchtung.",
    features: [
      "4.000+ Ladepunkte an Aral-Tankstellen",
      "Megawatt-Ladeparks für E-LKW (seit 2026)",
      "Integration mit Aral-App und Payback",
      "Plug & Charge unterstützt",
      "Kombination Kraftstoff + Laden an einem Standort",
    ],
  },
  {
    slug: "fastned",
    name: "Fastned",
    headquarters: "Amsterdam, Niederlande",
    totalPointsDE: 620, // ca. 100 Stationen × 6 Punkte, Schätzung* basierend auf GoingElectric
    hpcShare: 100,
    maxKw: 300,
    roamingPartnersCount: 60,
    plugAndCharge: true,
    autocharge: false,
    standardPriceAc: 0,
    standardPriceDc: 0.69, // ad-hoc; mit Fastned Unlimited günstiger
    bnetzaAnteil: "Premium-HPC-Netz an Autobahnen und Ballungsräumen",
    description:
      "Fastned betreibt charakteristische goldene Dachstationen ausschließlich mit HPC. In Deutschland konzentriert sich das Netz auf Autobahnen und Großstädte. Das Fastned Unlimited Abo bietet unbegrenzte Ladevorgänge für eine Monatspauschale.",
    features: [
      "Ikonische goldene Solardach-Stationen",
      "Nur HPC (kein AC)",
      "Fastned Unlimited Abo",
      "CCS und CHAdeMO (auslaufend)",
      "Ökostrom aus eigenen Solaranlagen",
    ],
  },
  {
    slug: "allego",
    name: "Allego",
    headquarters: "Arnhem, Niederlande",
    totalPointsDE: 3800, // Schätzung* ca. 2.500 eigene + 1.300 verwaltete Drittstandorte DE
    hpcShare: 45,
    maxKw: 300,
    roamingPartnersCount: 70,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.48,
    standardPriceDc: 0.68,
    bnetzaAnteil: "Großer B2B-CPO mit Standorten an Einzelhandel und Parkplätzen",
    description:
      "Allego ist ein führender europäischer Charge Point Operator mit Fokus auf B2B-Lösungen (Einzelhandel, Gewerbeimmobilien, Kommunen). In Deutschland betreibt Allego ein umfangreiches gemischtes Netz aus AC- und DC-Ladepunkten.",
    features: [
      "B2B-Fokus: Einzelhandel, Bürostandorte, Kommunen",
      "Europaweites Roaming-Netzwerk",
      "Flexible Abrechnungsmodelle für Betreiber",
      "Allego-App mit Standortsuche",
      "Gebündelte EU-Netze (App-Chaos-Reduktion)",
    ],
  },
  {
    slug: "eon-drive",
    name: "E.ON Drive",
    headquarters: "Essen, Deutschland",
    totalPointsDE: 4752, // BNetzA Q1 2026
    hpcShare: 30,
    maxKw: 150,
    roamingPartnersCount: 90,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.47,
    standardPriceDc: 0.57,
    bnetzaAnteil: "Bundesweites Ladenetz an Gewerbestandorten",
    description:
      "E.ON Drive ist der zweitgrößte Ladeinfrastrukturbetreiber in Deutschland nach Bundesnetzagentur-Daten. Das Netz konzentriert sich auf städtische Standorte, Wohngebäude, Firmenparkplätze und Einzelhandelsstandorte mit einem Mix aus AC und DC.",
    features: [
      "4.752 Ladepunkte (BNetzA Q1 2026)",
      "Europaweites E.ON Roaming-Netzwerk",
      "Schwerpunkt städtische Standorte",
      "B2B-Lösungen für Unternehmen",
      "Integration mit E.ON Strom-Produkten",
    ],
  },
  {
    slug: "shell-recharge",
    name: "Shell Recharge",
    headquarters: "Den Haag, Niederlande (DE: Hamburg)",
    totalPointsDE: 3200, // Schätzung* basierend auf Shell DE-Marktpräsenz, diverse Quellen
    hpcShare: 35,
    maxKw: 175,
    roamingPartnersCount: 85,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.55,
    standardPriceDc: 0.64,
    bnetzaAnteil: "Tankstellenintegriertes Netz mit dynamischer Preisgestaltung",
    description:
      "Shell Recharge kombiniert Ladeinfrastruktur an Shell-Tankstellen mit einem breiten Roaming-Netzwerk. 2026 führte Shell dynamische Ladepreise basierend auf Börsenstrompreisen ein. Das Netz deckt über 650.000 europaweite Roaming-Punkte ab.",
    features: [
      "Laden an Shell-Tankstellen deutschlandweit",
      "Dynamische Preisgestaltung (2026 eingeführt)",
      "Shell ClubSmart Treuepunkte",
      "650.000+ europaweite Roaming-Punkte",
      "Keine Grundgebühr (Shell Recharge Karte)",
    ],
  },
  {
    slug: "ewe-go",
    name: "EWE Go",
    headquarters: "Oldenburg, Deutschland",
    totalPointsDE: 4200, // 1.163 Standorte (GoingElectric Sep 2026) × ~3,6 Punkte
    hpcShare: 25,
    maxKw: 150,
    roamingPartnersCount: 40,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.45,
    standardPriceDc: 0.55,
    bnetzaAnteil: "Regionaler CPO im norddeutschen Raum",
    description:
      "EWE Go ist die E-Mobilitäts-Marke des norddeutschen Energieversorgers EWE AG. Das Ladenetz ist besonders stark in Norddeutschland (Niedersachsen, Bremen, Hamburg-Umland) und wächst kontinuierlich. Günstiger Regionaltarif für EWE-Kunden.",
    features: [
      "Breite Abdeckung im norddeutschen Raum",
      "Günstige Tarife für EWE-Strom-Kunden",
      "Integration mit EWE-Energie-Produkten",
      "Roaming über mehrere Plattformen",
      "Fokus auf städtische Wohnquartiere",
    ],
  },
  {
    slug: "pfalzwerke",
    name: "Pfalzwerke ePunkt",
    headquarters: "Ludwigshafen, Deutschland",
    totalPointsDE: 800, // Schätzung* für regionalen Betreiber Rheinland-Pfalz
    hpcShare: 20,
    maxKw: 150,
    roamingPartnersCount: 25,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.44,
    standardPriceDc: 0.54,
    bnetzaAnteil: "Regionaler Stadtwerke-CPO Rheinland-Pfalz/Saarland",
    description:
      "Pfalzwerke ePunkt ist der E-Mobilitätsanbieter der Pfalzwerke AG und deckt vorwiegend Rheinland-Pfalz und das Saarland ab. Das Netz wächst über Kooperationen mit Kommunen und Einzelhandel.",
    features: [
      "Regionales Netz Rheinland-Pfalz/Saarland",
      "Günstiger Heimattarif für Pfalzwerke-Kunden",
      "Kooperation mit lokalen Kommunen",
      "AC-Fokus im Wohnquartier",
      "Integration in regionale Roaming-Verbünde",
    ],
  },

  // ── NEUE BETREIBER ────────────────────────────────────────────────────────

  {
    slug: "rewe-eMobility",
    name: "REWE/Penny eMobility",
    headquarters: "Köln, Deutschland",
    totalPointsDE: 2800, // Schätzung* REWE Group: 700+ Märkte mit je 2-6 Ladepunkten
    hpcShare: 15,
    maxKw: 150,
    roamingPartnersCount: 10,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.49,
    standardPriceDc: 0.59,
    bnetzaAnteil: "Supermarkt-integriertes Laden (Betrieb durch CPO-Partner)",
    description:
      "REWE und Penny-Filialen bieten über Kooperationen mit verschiedenen CPOs Ladestationen auf ihren Parkplätzen an. Die Betreiber variieren (Shell, EVBox, Allego), das Laden ist beim Einkauf möglich. REWE Group zählt zu den wichtigsten Einzelhandels-Ladestandorten in Deutschland.",
    features: [
      "Laden beim Einkaufen (800+ Märkte)",
      "Mix aus AC (22 kW) und DC (bis 150 kW)",
      "Bezahlung über verschiedene CPO-Apps",
      "Kostenfreie Einkaufsparkzeit oft inklusive",
      "Wachsendes HPC-Angebot an Großmärkten",
    ],
  },
  {
    slug: "lidl-charge",
    name: "Lidl Charge",
    headquarters: "Neckarsulm, Deutschland",
    totalPointsDE: 2443, // GoingElectric Sep 2026
    hpcShare: 20,
    maxKw: 150,
    roamingPartnersCount: 5,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.45,
    standardPriceDc: 0.55,
    bnetzaAnteil: "Discounter-Ladenetz an Filialstandorten",
    description:
      "Lidl betreibt über Tochterunternehmen und CPO-Kooperationen eigene Ladestationen an mehr als 2.400 Ladepunkten in deutschen Filialen. Das Netz wächst stark und zählt nach GoingElectric zu den größten Einzelhandels-Ladenetzen. Bezahlung per App, Karte oder per QR-Code.",
    features: [
      "2.400+ Ladepunkte an Lidl-Filialen",
      "Wachsendes HPC-Segment",
      "Einkaufen & Laden parallel",
      "Einfache Bezahlung ohne Abo",
      "Günstige Preise im Discounter-Stil",
    ],
  },
  {
    slug: "volkswagen-we-charge-elli",
    name: "Volkswagen We Charge / Elli",
    headquarters: "Berlin, Deutschland",
    totalPointsDE: 15000, // Roaming-Netzwerk Elli: >500.000 EU-Punkte; DE-eigene: ~2.000*
    hpcShare: 30,
    maxKw: 350, // über IONITY-Partnerschaft
    roamingPartnersCount: 200,
    plugAndCharge: true,
    autocharge: true,
    standardPriceAc: 0.47,
    standardPriceDc: 0.55,
    bnetzaAnteil: "VW-Gruppe-Mobilitätsdienstleister mit Plug-&-Charge-Integration",
    description:
      "Elli (Electric Life) ist der E-Mobilitätsdienstleister der Volkswagen-Gruppe und betreibt das We Charge-Netzwerk. Kunden von VW, Audi, Skoda, SEAT, Porsche und Cupra können über eine einheitliche Karte / App laden. We Charge hat Zugang zu über 500.000 Ladepunkten in Europa durch Roaming-Kooperationen.",
    features: [
      "Plattform für alle VW-Gruppenmarken",
      "Plug & Charge (ISO 15118) ab Werk",
      "Zugang zu 500.000+ EU-Roaming-Punkten",
      "We Charge Karte und App (Android/iOS)",
      "Integration in Volkswagen ID.Software",
    ],
  },
  {
    slug: "totalenergies-charge",
    name: "TotalEnergies Charge",
    headquarters: "Paris, Frankreich (DE: Berlin)",
    totalPointsDE: 8000, // ecomento.de Mai 2026: „ca. 8.000 Ladepunkte"
    hpcShare: 10, // 429 HPC von 8.000 gesamt; Ziel 800 HPC bis Ende 2026
    maxKw: 400, // Hub Berliner HBF mit 400 kW (Mai 2026)
    roamingPartnersCount: 60,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.48,
    standardPriceDc: 0.58,
    bnetzaAnteil: "Schnell wachsender internationaler CPO mit HPC-Fokus",
    description:
      "TotalEnergies Charge baut sein deutsches Netz rasant aus. 2026 eröffnete das Unternehmen einen 400-kW-Schnellladepark am Berliner Hauptbahnhof und am Berliner Flughafen. Bis Ende 2026 soll die Anzahl der HPC-Standorte auf ~800 verdoppelt werden. Zudem gewann TotalEnergies staatliche Fördermittel für 1.200+ Schnelllader.",
    features: [
      "400-kW-Hub am Berliner Hauptbahnhof",
      "Starke staatliche Förderprojekte",
      "Tankstellenintegration (Total-Stationen)",
      "Europaweites TotalEnergies-Netzwerk",
      "Wachstum: Ziel 800 HPC-Standorte Ende 2026",
    ],
  },
  {
    slug: "bp-pulse",
    name: "bp pulse (Aral pulse international)",
    headquarters: "London, UK",
    totalPointsDE: 1200, // bp pulse DE außerhalb Aral-Marke, Schätzung*
    hpcShare: 60,
    maxKw: 150,
    roamingPartnersCount: 40,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.50,
    standardPriceDc: 0.60,
    bnetzaAnteil: "Internationaler CPO-Arm von BP in Deutschland",
    description:
      "bp pulse ist der internationale Ladeinfrastrukturarm von BP und in Deutschland primär über die Marke Aral pulse (Aral-Tankstellen) vertreten. Darüber hinaus betreibt bp pulse eigenständige Stationen außerhalb des Aral-Netzes, insbesondere im Gewerbe- und Flottenbereich.",
    features: [
      "Synergie mit Aral pulse-Tankstellennetz",
      "Flotten- und Gewerbelösungen",
      "bp Charge Now-Roaming-Karte",
      "Europaweite bp-Infrastruktur",
      "E-LKW-Megawatt-Charging (seit 2026)",
    ],
  },
  {
    slug: "mer-charge",
    name: "Mer (ehem. Fortum Charge & Drive)",
    headquarters: "Oslo, Norwegen (DE: Berlin)",
    totalPointsDE: 1800, // Schätzung* basierend auf Markttransformation von Fortum zu Mer 2022+
    hpcShare: 40,
    maxKw: 150,
    roamingPartnersCount: 55,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.47,
    standardPriceDc: 0.57,
    bnetzaAnteil: "Skandinavischer CPO mit wachsender DE-Präsenz",
    description:
      "Mer (früher Fortum Charge & Drive) ist ein skandinavischer E-Mobilitätsdienstleister mit wachsender Präsenz in Deutschland. Das Netz fokussiert sich auf B2B-Lösungen für Immobilienbetreiber und Kommunen sowie AI-optimierte Preisstrategie. 2026 führte Mer dynamische Preise basierend auf Netzauslastung und Verkehr ein.",
    features: [
      "AI-optimierte dynamische Ladepreise",
      "B2B-Fokus: Immobilien, Kommunen",
      "Skandinavische Zuverlässigkeitsstandards",
      "Roaming in Nordeuropa",
      "App mit Live-Preisanzeige",
    ],
  },
  {
    slug: "chargepoint",
    name: "ChargePoint",
    headquarters: "Campbell, USA (EU: Amsterdam)",
    totalPointsDE: 800, // ladestationguru.de: primär Software-Plattform; eigene DE-Punkte ~800*
    hpcShare: 25,
    maxKw: 400,
    roamingPartnersCount: 150,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.46,
    standardPriceDc: 0.58,
    bnetzaAnteil: "Software-Plattform-CPO mit eigenem Netz in NRW/BY/BW",
    description:
      "ChargePoint ist primär ein Software-Plattformanbieter für Ladestationen-Management, betreibt aber auch eigene Stationen in Deutschland, v.a. in NRW, Bayern und Baden-Württemberg. Das Netz basiert auf Drittanbieter-Hardware mit ChargePoint-Software. Weltweit einer der größten Netzwerke nach Anzahl der Standorte.",
    features: [
      "Internationales Ladenetzwerk",
      "ChargePoint-App für alle Partner-Stationen",
      "Flexible Abrechnungsmodelle",
      "Fokus NRW, Bayern, Baden-Württemberg",
      "ChargePoint Home für Wallbox-Integration",
    ],
  },
  {
    slug: "evbox",
    name: "EVBox",
    headquarters: "Amsterdam, Niederlande",
    totalPointsDE: 2200, // Schätzung* EVBox als Hardware+Software CPO in DE
    hpcShare: 20,
    maxKw: 200,
    roamingPartnersCount: 80,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.46,
    standardPriceDc: 0.59,
    bnetzaAnteil: "Niederländischer Anbieter mit starker DE-Hardware-Präsenz",
    description:
      "EVBox ist ein führender Hersteller von Ladesäulenhardware und betreibt in Deutschland auch selbst Ladepunkte unter der Marke Everon (früher EVBox Business Line). Das Netz ist stark bei Einzelhandel, Parkgaragen und Unternehmen vertreten.",
    features: [
      "Hardware + Betrieb aus einer Hand",
      "Starke Präsenz bei Einzelhandel und Garagen",
      "Everon Cloud-Plattform",
      "Roaming über Hubject/OCPI",
      "Breites AC- und DC-Portfolio",
    ],
  },
  {
    slug: "clever-charge",
    name: "Clever",
    headquarters: "Kopenhagen, Dänemark",
    totalPointsDE: 300, // Schätzung* kleines aber wachsendes DE-Netz
    hpcShare: 80,
    maxKw: 300,
    roamingPartnersCount: 30,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0,
    standardPriceDc: 0.65,
    bnetzaAnteil: "Dänischer HPC-Betreiber mit zunehmender DE-Expansion",
    description:
      "Clever ist ein dänisches Schnelllade-Unternehmen mit wachsender Präsenz in Deutschland, v.a. entlang der Korridore Richtung Dänemark und Nordeuropa. Das Netz fokussiert fast ausschließlich auf HPC und bietet Kombi-Abos für Dänemark + Deutschland.",
    features: [
      "Fokus auf Korridore DE-DK",
      "HPC-Spezialist (80% der Punkte)",
      "Clever-Abo auch in Deutschland",
      "Zuverlässiges skandinavisches Betriebsmodell",
      "Roaming über mehrere EU-Plattformen",
    ],
  },
  {
    slug: "adac-e-charge",
    name: "ADAC e-Charge",
    headquarters: "München, Deutschland",
    totalPointsDE: 800, // Schätzung* eigene ADAC-Stationen (Kooperation)
    hpcShare: 30,
    maxKw: 150,
    roamingPartnersCount: 100,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.43,
    standardPriceDc: 0.53,
    bnetzaAnteil: "ADAC-Vertrauensmarke für Mitglieder",
    description:
      "ADAC e-Charge bietet ADAC-Mitgliedern und Nichtmitgliedern Zugang zu einem breiten Ladenetz. Die ADAC e-Charge-Karte ermöglicht Roaming auf über 100.000 DE-Ladepunkten. ADAC ist kein eigener CPO im klassischen Sinne, sondern bündelt Partnernetze unter einer Vertrauensmarke.",
    features: [
      "ADAC-Mitglieder-Vorteilspreise",
      "Zugang zu 100.000+ DE-Ladepunkten (Roaming)",
      "Vertraute ADAC-Marke mit Pannenhilfe-Kombi",
      "Transparente Preisgestaltung",
      "App mit ADAC-Routenplaner-Integration",
    ],
  },
  {
    slug: "ladenetz-stadtwerke",
    name: "Ladenetz.de (Stadtwerke-Verbund)",
    headquarters: "München, Deutschland (BEV)",
    totalPointsDE: 5725, // GoingElectric Sep 2026: 5.725 Standorte (größtes Roaming-Netz)
    hpcShare: 15,
    maxKw: 150,
    roamingPartnersCount: 200,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.44,
    standardPriceDc: 0.54,
    bnetzaAnteil: "Stadtwerke-Verbundnetzwerk",
    description:
      "Ladenetz.de ist der Zusammenschluss von über 100 deutschen Stadtwerken und Regionalversorgern unter dem Dach der Bayernwerk Netz. Mit 5.725 Standorten ist es das größte regional verwurzelte Ladenetz Deutschlands. Die Stationen befinden sich vorwiegend in Wohnquartieren, Innenstädten und kommunalen Bereichen.",
    features: [
      "100+ Stadtwerke-Partner",
      "5.725 Standorte (Sep 2026)",
      "Regionale Tarifgestaltung",
      "Vorwiegend Wohnquartier und Innenstadt",
      "Ladenetz.de-App und RFID-Karte",
    ],
  },
  {
    slug: "kaufland-charge",
    name: "Kaufland Ladeinfrastruktur",
    headquarters: "Neckarsulm, Deutschland",
    totalPointsDE: 1350, // GoingElectric Sep 2026
    hpcShare: 10,
    maxKw: 50,
    roamingPartnersCount: 5,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.43,
    standardPriceDc: 0.53,
    bnetzaAnteil: "Großmarkt-integriertes Laden (Kaufland-Standorte)",
    description:
      "Kaufland betreibt Ladestationen auf den Parkplätzen seiner Verbrauchermärkte in ganz Deutschland. Mit 1.350 Ladepunkten zählt Kaufland zu den großen Einzelhandels-Ladenetzwerken. Die Stationen sind vorwiegend AC-22-kW-Charger, ergänzt durch vereinzelte DC-Schnelllader.",
    features: [
      "Laden an 300+ Kaufland-Standorten",
      "Kostenfrei während des Einkaufs (Standortabhängig)",
      "Grünstrom-Versorgung (laut Kaufland.de)",
      "Einfache Kreditkartenzahlung",
      "Wachsender DC-Anteil",
    ],
  },
  {
    slug: "edeka-charge",
    name: "EDEKA Ladeinfrastruktur",
    headquarters: "Hamburg, Deutschland",
    totalPointsDE: 600, // Schätzung* dezentral über regionale EDEKA-Verbünde
    hpcShare: 5,
    maxKw: 50,
    roamingPartnersCount: 10,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.46,
    standardPriceDc: 0.56,
    bnetzaAnteil: "Dezentrale Einzelhandels-Ladestationen (regionale EDEKA-Verbünde)",
    description:
      "EDEKA-Märkte bieten regional unterschiedliche Ladeinfrastruktur an, betrieben über verschiedene regionale EDEKA-Verbünde und CPO-Kooperationspartner. Die Infrastruktur ist weniger zentral gesteuert als bei Lidl oder Kaufland.",
    features: [
      "Laden an EDEKA-Supermärkten",
      "Regionale Varianz (7 EDEKA-Regionen)",
      "Mix verschiedener CPO-Betreiber",
      "AC-Fokus (22 kW)",
      "Wachsend in Zusammenarbeit mit Partnern",
    ],
  },
  {
    slug: "tanke-aachener-sw",
    name: "TankE (STAWAG Aachen)",
    headquarters: "Aachen, Deutschland",
    totalPointsDE: 250, // Schätzung* regionaler Betreiber Aachen-Region
    hpcShare: 20,
    maxKw: 150,
    roamingPartnersCount: 20,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.43,
    standardPriceDc: 0.53,
    bnetzaAnteil: "Regionaler Stadtwerke-CPO Aachener Stadtgebiet",
    description:
      "TankE ist die E-Mobilitätsmarke der Stadtwerke Aachen (STAWAG). Das Netz deckt hauptsächlich die Region Aachen ab und ist in das regionale Stadtwerke-Roaming eingebunden. Günstiger Heimattarif für STAWAG-Kunden.",
    features: [
      "Regionales Netz Aachen und Umland",
      "Günstiger Heimattarif für STAWAG-Kunden",
      "TankE-App mit Echtzeit-Status",
      "Einbindung in Ladenetz.de",
      "Fokus auf städtische Quartierslösungen",
    ],
  },
  {
    slug: "rwe-emobility",
    name: "RWE eMobility",
    headquarters: "Essen, Deutschland",
    totalPointsDE: 1500, // Schätzung* RWE AG eMobility-Sparte
    hpcShare: 30,
    maxKw: 150,
    roamingPartnersCount: 70,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.46,
    standardPriceDc: 0.56,
    bnetzaAnteil: "Energiekonzern-CPO mit Fokus auf Westdeutschland",
    description:
      "RWE eMobility ist die E-Mobilitätssparte des Energiekonzerns RWE AG und betreibt Ladeinfrastruktur vorwiegend in Westdeutschland (NRW, Rheinland). RWE kooperiert mit Kommunen und Gewerbekunden und bietet B2B-Ladelösungen für Unternehmen.",
    features: [
      "Schwerpunkt Westdeutschland (NRW)",
      "B2B-Lösungen für Unternehmen",
      "RWE-Ökostrom-Integration",
      "Kooperation mit Kommunen und Gemeinden",
      "Roaming über Hubject und OCPI",
    ],
  },
  {
    slug: "vattenfall-incharge",
    name: "Vattenfall InCharge",
    headquarters: "Berlin, Deutschland / Stockholm, Schweden",
    totalPointsDE: 2000, // Schätzung* basierend auf Vattenfall-DE-Marktpräsenz
    hpcShare: 50,
    maxKw: 150,
    roamingPartnersCount: 65,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.47,
    standardPriceDc: 0.44, // electrive.net März 2026: Senkung auf 0,44-0,49 €/kWh DC
    bnetzaAnteil: "Transparenter CPO mit gesenkten HPC-Preisen 2026",
    description:
      "Vattenfall InCharge betreibt Schnellladestationen in Deutschland und hat 2026 seine DC-Preise auf 0,44–0,49 €/kWh gesenkt. Damit ist InCharge einer der günstigsten HPC-Anbieter ohne Abo. Das Netz fokussiert auf städtische Standorte und hat eine starke Präsenz in Berlin und Hamburg.",
    features: [
      "DC-Preis ab 0,44 €/kWh (ad-hoc, März 2026)",
      "Keine Grundgebühr erforderlich",
      "Starke Präsenz Berlin und Hamburg",
      "InCharge-App und -Ladekarte",
      "Europaweites Roaming über InCharge-Netz",
    ],
  },
  {
    slug: "new-mobility",
    name: "NEW Mobility (Niederrhein)",
    headquarters: "Mönchengladbach, Deutschland",
    totalPointsDE: 350, // Schätzung* regionaler Stadtwerke-Betreiber
    hpcShare: 15,
    maxKw: 150,
    roamingPartnersCount: 15,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.44,
    standardPriceDc: 0.54,
    bnetzaAnteil: "Regionaler CPO für die Niederrhein-Region",
    description:
      "NEW Mobility ist die E-Mobilitätsmarke der NEW AG (Niederrheinische Energie- und Wasserversorgung) mit Schwerpunkt im Großraum Mönchengladbach, Krefeld und Viersen. Das Netz umfasst Wohnquartiere, Einkaufszentren und öffentliche Parkplätze.",
    features: [
      "Regionales Netz Niederrhein",
      "Günstige Tarife für NEW-Kunden",
      "Einbindung in NRW-Stadtwerke-Verbund",
      "AC und DC-Ladepunkte",
      "Lokale Verankerung und Service",
    ],
  },
  {
    slug: "aldi-sued-charge",
    name: "ALDI SÜD Ladeinfrastruktur",
    headquarters: "Mülheim an der Ruhr, Deutschland",
    totalPointsDE: 1763, // GoingElectric Sep 2026
    hpcShare: 10,
    maxKw: 50,
    roamingPartnersCount: 5,
    plugAndCharge: false,
    autocharge: false,
    standardPriceAc: 0.44,
    standardPriceDc: 0.54,
    bnetzaAnteil: "Discounter-integriertes Laden, Eigenregie",
    description:
      "ALDI SÜD betreibt mit 1.763 Ladepunkten eines der größten Discounter-Ladenetze in Deutschland. Die Stationen befinden sich auf den Parkplätzen der Märkte und ermöglichen kostengünstiges Laden beim Einkauf. ALDI NORD hat ein eigenständiges, kleineres Netz.",
    features: [
      "1.763 Ladepunkte (GoingElectric Sep 2026)",
      "Laden an ALDI SÜD-Märkten",
      "Einfache Kreditkartenzahlung",
      "AC-Fokus (22 kW)",
      "Günstige Preise",
    ],
  },
];

/**
 * OPERATORS_DATA (Synchronized Single Source of Truth)
 * Wenn der CPO im amtlichen BNetzA-CPO-Monitor erfasst ist, stammen totalPointsDE und hpcShare
 * deterministisch und tagesaktuell direkt aus der autoritativen CPO-Pipeline.
 */
export const OPERATORS_DATA: OperatorData[] = BASE_OPERATORS_DATA.map((op) => {
  const verified = cpoDataset.operators.find(
    (c) =>
      c.slug === op.slug ||
      c.id === op.slug ||
      (op.slug === 'tesla-supercharger' && (c.id === 'tesla' || c.slug === 'tesla')) ||
      (op.slug === 'enbw' && (c.id === 'enbw' || c.slug === 'enbw-mobility-plus'))
  );

  if (verified) {
    return {
      ...op,
      totalPointsDE: verified.chargingPointsTotal,
      hpcShare: Math.round(verified.share150PlusKwPercent)
    };
  }

  return op;
});

