export interface MotorwayData {
  slug: string;
  name: string;
  route: string;
  lengthKm: number;
  totalChargingHubs: number;
  maxKw: number;
  topHubs: { name: string; exit: string; operator: string; kw: number; points: number }[];
  mainCPOs: string[];
  description: string;
}

export const MOTORWAYS_DATA: MotorwayData[] = [
  {
    slug: "a1",
    name: "A1",
    route: "Heiligenhafen – Hamburg – Bremen – Osnabrück – Dortmund – Köln – Saarbrücken",
    lengthKm: 748,
    totalChargingHubs: 86,
    maxKw: 400,
    topHubs: [
      { name: "Raststätte Holmmoor Ost/West", exit: "AS Quickborn", operator: "IONITY / EnBW", kw: 350, points: 16 },
      { name: "Raststätte Grundbergsee", exit: "AS Stuckenborstel", operator: "Fastned / Aral pulse", kw: 300, points: 12 },
      { name: "Autohof Ladbergen", exit: "AS Ladbergen", operator: "Tesla Supercharger / EnBW", kw: 400, points: 24 },
      { name: "Raststätte Remscheid", exit: "AS Remscheid", operator: "EnBW HyperNetz", kw: 300, points: 12 }
    ],
    mainCPOs: ["EnBW", "IONITY", "Fastned", "Aral pulse", "Tesla"],
    description: "Die 'Hansalinie' verbindet die Ostsee mit West- und Südwestdeutschland. Durchgängig im Abstand von 30–50 km mit Hochleistungsladern (HPC) ausgestattet."
  },
  {
    slug: "a2",
    name: "A2",
    route: "Oberhausen – Dortmund – Bielefeld – Hannover – Magdeburg – Berliner Ring (A10)",
    lengthKm: 473,
    totalChargingHubs: 64,
    maxKw: 400,
    topHubs: [
      { name: "Raststätte Gütersloh", exit: "AS Gütersloh", operator: "IONITY", kw: 350, points: 12 },
      { name: "Raststätte Lehrte Nord/Süd", exit: "AS Lehrte", operator: "Aral pulse / EnBW", kw: 300, points: 16 },
      { name: "Autohof Uhrsleben", exit: "AS Uhrsleben", operator: "Fastned / Tesla", kw: 400, points: 20 },
      { name: "Raststätte Börde", exit: "AS Bornstedt", operator: "EnBW", kw: 300, points: 12 }
    ],
    mainCPOs: ["EnBW", "IONITY", "Tesla", "Fastned", "Aral pulse"],
    description: "Wichtigste Ost-West-Transversale Nordeuropas. Hohe Ladefrequenz durch dichten Schwerlast- und Pendlerverkehr mit modernen Megawatt-Parks."
  },
  {
    slug: "a3",
    name: "A3",
    route: "Elten (NL) – Oberhausen – Köln – Frankfurt am Main – Würzburg – Nürnberg – Passau (A)",
    lengthKm: 769,
    totalChargingHubs: 94,
    maxKw: 400,
    topHubs: [
      { name: "Raststätte Medenbach Ost/West", exit: "AS Wiesbaden / Niedernhausen", operator: "IONITY", kw: 350, points: 18 },
      { name: "Raststätte Weiskirchen", exit: "AS Hanau", operator: "EnBW HyperNetz", kw: 400, points: 24 },
      { name: "Autohof Schlüsselfeld", exit: "AS Schlüsselfeld", operator: "Tesla / Fastned", kw: 400, points: 28 },
      { name: "Raststätte Jura Ost/West", exit: "AS Velburg", operator: "Aral pulse / IONITY", kw: 350, points: 16 }
    ],
    mainCPOs: ["EnBW", "IONITY", "Tesla", "Aral pulse", "Fastned"],
    description: "Deutschlands bedeutendste Schnelllade-Magistrale von den Niederlanden nach Österreich. Höchste HPC-Dichte mit Standorten im 25-km-Takt."
  },
  {
    slug: "a4",
    name: "A4",
    route: "Aachen – Köln – Olpe – Bad Hersfeld – Eisenach – Erfurt – Jena – Dresden – Görlitz (PL)",
    lengthKm: 585,
    totalChargingHubs: 58,
    maxKw: 350,
    topHubs: [
      { name: "Raststätte Aachener Land", exit: "AS Eschweiler", operator: "Fastned / EnBW", kw: 300, points: 12 },
      { name: "Raststätte Eisenach Nord", exit: "AS Eisenach", operator: "IONITY", kw: 350, points: 12 },
      { name: "Autohof Nossen", exit: "Dreieck Nossen", operator: "Tesla / EnBW", kw: 350, points: 20 },
      { name: "Raststätte Dresdner Tor", exit: "AS Wilsdruff", operator: "Aral pulse", kw: 300, points: 10 }
    ],
    mainCPOs: ["EnBW", "IONITY", "Tesla", "Fastned", "TotalEnergies"],
    description: "Zentrale Ost-West-Achse der Mitte. Verbindet das Ruhr- und Rheinland mit Thüringen und Sachsen bis zur polnischen Grenze."
  },
  {
    slug: "a5",
    name: "A5",
    route: "Hattenbacher Dreieck – Frankfurt – Darmstadt – Heidelberg – Karlsruhe – Freiburg – Basel (CH)",
    lengthKm: 440,
    totalChargingHubs: 68,
    maxKw: 400,
    topHubs: [
      { name: "Raststätte Gräfenhausen Ost/West", exit: "AS Weiterstadt", operator: "EnBW HyperNetz", kw: 400, points: 20 },
      { name: "Raststätte Bruchsal", exit: "AS Bruchsal", operator: "IONITY", kw: 350, points: 16 },
      { name: "Raststätte Baden-Baden", exit: "AS Baden-Baden", operator: "Aral pulse / Tesla", kw: 350, points: 20 },
      { name: "Raststätte Mahlberg Ost/West", exit: "AS Ettenheim", operator: "EnBW / Fastned", kw: 300, points: 18 }
    ],
    mainCPOs: ["EnBW", "IONITY", "Tesla", "Aral pulse", "Fastned"],
    description: "Die Rheintalautobahn ist das Rückgrat des Nord-Süd-Verkehrs nach Frankreich und in die Schweiz mit vorbildlicher Ladeinfrastruktur."
  },
  {
    slug: "a6",
    name: "A6",
    route: "Saarbrücken – Kaiserslautern – Mannheim – Heilbronn – Nürnberg – Waidhaus (CZ)",
    lengthKm: 484,
    totalChargingHubs: 52,
    maxKw: 350,
    topHubs: [
      { name: "Raststätte Waldmohr", exit: "AS Waldmohr", operator: "IONITY", kw: 350, points: 12 },
      { name: "Raststätte Hohenlohe", exit: "AS Neuenstein", operator: "EnBW", kw: 300, points: 14 },
      { name: "Autohof Aurach", exit: "AS Aurach", operator: "Tesla Supercharger / Fastned", kw: 400, points: 24 }
    ],
    mainCPOs: ["EnBW", "IONITY", "Tesla", "Aral pulse"],
    description: "Via Carolina: Transkontinentaler Korridor von Paris nach Prag mit modernen Ladeparks entlang des Neckars und der Frankenalb."
  },
  {
    slug: "a7",
    name: "A7",
    route: "Ellund (DK) – Flensburg – Hamburg – Hannover – Kassel – Würzburg – Ulm – Füssen (A)",
    lengthKm: 962,
    totalChargingHubs: 118,
    maxKw: 400,
    topHubs: [
      { name: "Raststätte Hüttener Berge", exit: "AS Owschlag", operator: "IONITY / EWE Go", kw: 350, points: 14 },
      { name: "Raststätte Allertal", exit: "AS Buchholz", operator: "EnBW / Aral pulse", kw: 300, points: 16 },
      { name: "Autohof Rhön / Uttrichshausen", exit: "AS Motten", operator: "Fastned / Tesla", kw: 400, points: 24 },
      { name: "Raststätte Seligweiler (Ulm)", exit: "AS Ulm-Ost", operator: "Tesla / EnBW / IONITY", kw: 400, points: 36 }
    ],
    mainCPOs: ["EnBW", "IONITY", "Tesla", "Fastned", "EWE Go", "Aral pulse"],
    description: "Längste Autobahn Deutschlands und Hauptschlagader Skandinavien–Alpen. Exzellente Versorgung mit zahlreichen Mega-Ladeparks wie Seligweiler und Rhön."
  },
  {
    slug: "a8",
    name: "A8",
    route: "Perl (F) – Saarlouis – Karlsruhe – Stuttgart – Ulm – Augsburg – München – Salzburg (A)",
    lengthKm: 505,
    totalChargingHubs: 66,
    maxKw: 400,
    topHubs: [
      { name: "Raststätte Gruibingen", exit: "AS Gruibingen (Albaufstieg)", operator: "IONITY", kw: 350, points: 16 },
      { name: "Sortimo Innovationspark Zusmarshausen", exit: "AS Zusmarshausen", operator: "E-Loaded / Tesla / EnBW", kw: 400, points: 72 },
      { name: "Raststätte Holzkirchen", exit: "AS Holzkirchen", operator: "Aral pulse / EnBW", kw: 350, points: 14 }
    ],
    mainCPOs: ["EnBW", "IONITY", "Tesla", "E-Loaded", "Aral pulse"],
    description: "Südliche Quermagistrale und Tor zu den Alpen. Mit dem Sortimo Innovationspark Zusmarshausen steht hier einer der größten Ladeparks Europas."
  },
  {
    slug: "a9",
    name: "A9",
    route: "Potsdam (Berliner Ring) – Leipzig – Hof – Bayreuth – Nürnberg – Ingolstadt – München",
    lengthKm: 530,
    totalChargingHubs: 72,
    maxKw: 400,
    topHubs: [
      { name: "Raststätte Fläming", exit: "AS Niemegk", operator: "IONITY", kw: 350, points: 12 },
      { name: "Raststätte Frankenwald", exit: "AS Berg/Bad Steben", operator: "EnBW / Aral pulse", kw: 300, points: 14 },
      { name: "Autohof Himmelkron", exit: "AS Bad Berneck", operator: "Tesla Supercharger / Fastned", kw: 400, points: 28 },
      { name: "Raststätte Köschinger Forst", exit: "AS Lenting", operator: "IONITY / Audi Charging", kw: 350, points: 18 }
    ],
    mainCPOs: ["EnBW", "IONITY", "Tesla", "Fastned", "Aral pulse"],
    description: "Hauptverbindung Berlin–München. Digitale Teststrecke mit Vorzeige-Ladeinfrastruktur und kontinuierlich ausgebauten 400-kW-HPC-Stationen."
  },
  {
    slug: "a10",
    name: "A10",
    route: "Berliner Ring (Potsdam – Schönefeld – Dreieck Spreeau – Dreieck Havelland)",
    lengthKm: 196,
    totalChargingHubs: 32,
    maxKw: 400,
    topHubs: [
      { name: "Raststätte Michendorf Nord/Süd", exit: "AS Michendorf", operator: "EnBW / IONITY", kw: 350, points: 18 },
      { name: "Autohof Freienbrink (Gigafactory)", exit: "AS Freienbrink", operator: "Tesla Supercharger", kw: 250, points: 28 },
      { name: "Raststätte Seeberg", exit: "AS Seeberg", operator: "Aral pulse", kw: 300, points: 10 }
    ],
    mainCPOs: ["EnBW", "Tesla", "IONITY", "Aral pulse"],
    description: "Der Berliner Autobahnring umfasst mehrere internationale Korridore und bietet eine sehr dichte Ladeabdeckung für Umfahrungen und Pendler."
  },
  {
    slug: "a14",
    name: "A14",
    route: "Wismar – Schwerin – Magdeburg – Halle (Saale) – Leipzig – Dreieck Nossen (A4)",
    lengthKm: 345,
    totalChargingHubs: 38,
    maxKw: 350,
    topHubs: [
      { name: "Raststätte Plötzetal", exit: "AS Plötzkau", operator: "EnBW", kw: 300, points: 10 },
      { name: "Autohof Brehna", exit: "AS Halle/Torgau", operator: "Tesla / Fastned", kw: 350, points: 20 }
    ],
    mainCPOs: ["EnBW", "Tesla", "Fastned", "Allego"],
    description: "Verbindung der mitteldeutschen Wirtschaftszentren mit den Ostseehäfen, durchgängig mit modernen HPC-Standorten ausgerüstet."
  },
  {
    slug: "a45",
    name: "A45",
    route: "Dortmund – Hagen – Siegen – Wetzlar – Hanau – Seligenstädter Dreieck (A3)",
    lengthKm: 257,
    totalChargingHubs: 34,
    maxKw: 350,
    topHubs: [
      { name: "Raststätte Sauerland", exit: "AS Lüdenscheid", operator: "EnBW / IONITY", kw: 350, points: 14 },
      { name: "Autohof Wilnsdorf", exit: "AS Wilnsdorf", operator: "Tesla / Aral pulse", kw: 350, points: 16 }
    ],
    mainCPOs: ["EnBW", "Tesla", "IONITY", "Aral pulse"],
    description: "Die 'Sauerlandlinie' verbindet das östliche Ruhrgebiet mit dem Rhein-Main-Gebiet durch das hessische und westfälische Bergland."
  },
  {
    slug: "a61",
    name: "A61",
    route: "Venlo (NL) – Mönchengladbach – Koblenz – Bingen – Worms – Dreieck Hockenheim (A6)",
    lengthKm: 314,
    totalChargingHubs: 42,
    maxKw: 350,
    topHubs: [
      { name: "Raststätte Brohltal Ost/West", exit: "AS Wehr", operator: "IONITY", kw: 350, points: 14 },
      { name: "Raststätte Peppenhoven", exit: "AS Rheinbach", operator: "EnBW", kw: 300, points: 12 },
      { name: "Autohof Gau-Bickelheim", exit: "AS Gau-Bickelheim", operator: "Tesla / Fastned", kw: 350, points: 18 }
    ],
    mainCPOs: ["EnBW", "IONITY", "Tesla", "Fastned"],
    description: "Wichtige linksrheinische Ausweichroute für den Güterverkehr von den Benelux-Staaten nach Süddeutschland."
  },
  {
    slug: "a81",
    name: "A81",
    route: "Würzburg – Heilbronn – Stuttgart – Singen – Gottmadingen (CH)",
    lengthKm: 276,
    totalChargingHubs: 36,
    maxKw: 400,
    topHubs: [
      { name: "Raststätte Würzburg Süd", exit: "AS Gerchsheim", operator: "EnBW", kw: 300, points: 10 },
      { name: "Raststätte Schönbuch", exit: "AS Herrenberg", operator: "IONITY / EnBW", kw: 350, points: 16 },
      { name: "Autohof Sulz am Neckar", exit: "AS Sulz", operator: "Tesla Supercharger", kw: 350, points: 16 }
    ],
    mainCPOs: ["EnBW", "IONITY", "Tesla"],
    description: "Hauptverkehrsader Baden-Württembergs von Franken über den Großraum Stuttgart an den Bodensee und in die Schweiz."
  }
];
