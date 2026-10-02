// motorways.ts
// Stand: Oktober 2026
// Streckennetz & Längenangaben: Die Autobahn GmbH des Bundes / BMVI Streckennetz
// Ladeinfrastruktur-Evidence: Redaktionell verifizierte Ladepark-Dossiers (stations.ts)

export interface MotorwayEvidence {
  lengthSource: string;
  maxKwEvidence?: {
    stationId: string;
    stationName: string;
    operator: string;
    kwMax: number;
    location: string;
  };
  cpoEvidence: Array<{
    operator: string;
    stationId: string;
    stationName: string;
    location: string;
  }>;
}

export interface MotorwayData {
  slug: string;
  name: string;
  route: string;
  lengthKm: number;
  maxKw?: number;
  mainCPOs: string[];
  description: string;
  corridorEvidence: MotorwayEvidence;
  majorCities?: string[];
  connectingMotorways?: string[];
}

export const MOTORWAYS_DATA: MotorwayData[] = [
  {
    slug: "a1",
    name: "A1",
    route: "Heiligenhafen Nord – Saarbrücken",
    lengthKm: 734,
    maxKw: 400,
    mainCPOs: ["EnBW mobility+","Fastned","IONITY","Tesla"],
    description: "Die A1 ist eine der längsten deutschen Autobahnen und verbindet die Nordsee-Küste (Fehmarn) über Hamburg, Bremen und das Ruhrgebiet mit Saarbrücken. Sie ist eine der meistbefahrenen Transitstrecken für internationale Güterverkehre.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "hub-004",
        stationName: "EnBW HyperHub Kamener Kreuz (A1 / A2)",
        operator: "EnBW mobility+",
        kwMax: 400,
        location: "Kamen Karree 2, Kamen"
      },
      cpoEvidence: [
        {
                "operator": "EnBW mobility+",
                "stationId": "hub-004",
                "stationName": "EnBW HyperHub Kamener Kreuz (A1 / A2)",
                "location": "Kamen Karree 2, Kamen"
        },
        {
                "operator": "Fastned",
                "stationId": "bre-001",
                "stationName": "wesernetz & Fastned Ladepark Weserpark Bremen (A1 / A27)",
                "location": "Hans-Bredow-Straße 19, Bremen"
        },
        {
                "operator": "IONITY",
                "stationId": "hl-001",
                "stationName": "IONITY Lübeck Travemünde (A1)",
                "location": "Bei der Lohmühle 84, Lübeck"
        },
        {
                "operator": "Tesla",
                "stationId": "mot-004",
                "stationName": "Tesla Supercharger Braak (A1)",
                "location": "Braaker Bogen 1, Braak"
        }
]
    }
  },
  {
    slug: "a2",
    name: "A2",
    route: "Oberhausen – Berlin (Dreieck Werder)",
    lengthKm: 488,
    maxKw: 1200,
    mainCPOs: ["EnBW mobility+","Fastned","IONITY","Shell Recharge"],
    description: "Die A2 ist die wichtigste Ost-West-Verbindung in Norddeutschland und verläuft vom Ruhrgebiet durch Hannover, Magdeburg bis nach Berlin. Sie ist eine der am stärksten belasteten Fernstraßen Deutschlands.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "mcs-005",
        stationName: "HoLa Lkw-Megawatt Hub Lipperland Süd (A2)",
        operator: "EnBW mobility+",
        kwMax: 1200,
        location: "Raststätte Lipperland Süd, BAB 2, Extertal"
      },
      cpoEvidence: [
        {
                "operator": "EnBW mobility+",
                "stationId": "hub-004",
                "stationName": "EnBW HyperHub Kamener Kreuz (A1 / A2)",
                "location": "Kamen Karree 2, Kamen"
        },
        {
                "operator": "Fastned",
                "stationId": "haj-002",
                "stationName": "Fastned Hannover Herrenhausen (A2)",
                "location": "Am Leineufer 51, Hannover"
        },
        {
                "operator": "IONITY",
                "stationId": "bie-001",
                "stationName": "IONITY Bielefeld Süd (A2)",
                "location": "Raststätte Lipperland Süd, Bielefeld"
        },
        {
                "operator": "Shell Recharge",
                "stationId": "mcs-006",
                "stationName": "HoLa Lkw-Megawatt Hub Lehre (A2)",
                "location": "Autohof Lehre, Hauptstraße 1, Lehre"
        }
]
    }
  },
  {
    slug: "a3",
    name: "A3",
    route: "Arnhem (NL) – Passau",
    lengthKm: 764,
    maxKw: 400,
    mainCPOs: ["IONITY","Tesla","Fastned","EnBW mobility+"],
    description: "Die A3 ist Deutschlands zweitlängste Autobahn (innerhalb DE) und verbindet die Niederlande über das Ruhrgebiet, Frankfurt, Nürnberg mit Passau. Der Autobahnabschnitt verfügt über ein dichtes Netz an HPC-Ladestationen (u. a. Raststätte Rohrbrunn und Spessart Süd).",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "fra-003",
        stationName: "EnBW HyperHub Frankfurt Flughafen (A3 / A5)",
        operator: "EnBW mobility+",
        kwMax: 400,
        location: "Hugo-Eckener-Ring, Frankfurt am Main"
      },
      cpoEvidence: [
        {
                "operator": "IONITY",
                "stationId": "mot-009",
                "stationName": "IONITY Raststätte Spessart Süd (A3)",
                "location": "Raststätte Spessart Süd, BAB 3, Rohrbrunn"
        },
        {
                "operator": "Tesla",
                "stationId": "hub-003",
                "stationName": "Seed & Greet Ladepark Kreuz Hilden (A3 / A46)",
                "location": "Nordpark 2, Hilden"
        },
        {
                "operator": "Fastned",
                "stationId": "hub-003",
                "stationName": "Seed & Greet Ladepark Kreuz Hilden (A3 / A46)",
                "location": "Nordpark 2, Hilden"
        },
        {
                "operator": "EnBW mobility+",
                "stationId": "fra-003",
                "stationName": "EnBW HyperHub Frankfurt Flughafen (A3 / A5)",
                "location": "Hugo-Eckener-Ring, Frankfurt am Main"
        }
]
    }
  },
  {
    slug: "a4",
    name: "A4",
    route: "Aachen – Görlitz (PL-Grenze)",
    lengthKm: 643,
    maxKw: 400,
    mainCPOs: ["EnBW mobility+","SachsenEnergie","STAWAG","Fastned","Milence"],
    description: "Die A4 ist die südliche Ost-West-Hauptachse und verbindet Aachen über Köln, Erfurt, Dresden mit der polnischen Grenze. Eine der strategisch wichtigsten Europarouten durch Mitteldeutschland.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "hub-006",
        stationName: "EnBW HyperHub Meerane (A4)",
        operator: "EnBW mobility+",
        kwMax: 400,
        location: "Guteborner Allee 4, Meerane"
      },
      cpoEvidence: [
        {
                "operator": "EnBW mobility+",
                "stationId": "hub-006",
                "stationName": "EnBW HyperHub Meerane (A4)",
                "location": "Guteborner Allee 4, Meerane"
        },
        {
                "operator": "SachsenEnergie",
                "stationId": "drs-001",
                "stationName": "SachsenEnergie HPC-Park Dresden Elbe Park (A4)",
                "location": "Peschelstraße 33, Dresden"
        },
        {
                "operator": "STAWAG",
                "stationId": "ac-001",
                "stationName": "STAWAG & Fastned Ladepark Aachen Tivoli (A4)",
                "location": "Krefelder Str. 205, Aachen"
        },
        {
                "operator": "Fastned",
                "stationId": "ac-001",
                "stationName": "STAWAG & Fastned Ladepark Aachen Tivoli (A4)",
                "location": "Krefelder Str. 205, Aachen"
        },
        {
                "operator": "Milence",
                "stationId": "mcs-007",
                "stationName": "Milence E-Lkw Ladepark Hermsdorfer Kreuz (A4 / A9)",
                "location": "Am Rüdersdorfer Wege 5D, Kraftsdorf"
        }
]
    }
  },
  {
    slug: "a5",
    name: "A5",
    route: "Hattenbach – Basel (CH-Grenze)",
    lengthKm: 457,
    maxKw: 400,
    mainCPOs: ["EnBW mobility+","Fastned"],
    description: "Die A5 verbindet den Norden Hessens über Frankfurt und Karlsruhe mit dem Schweizer Grenzübergang Basel. Sie ist ein wichtiger Korridor für den Tourismus in den Schwarzwald und die Schweiz.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "fra-003",
        stationName: "EnBW HyperHub Frankfurt Flughafen (A3 / A5)",
        operator: "EnBW mobility+",
        kwMax: 400,
        location: "Hugo-Eckener-Ring, Frankfurt am Main"
      },
      cpoEvidence: [
        {
                "operator": "EnBW mobility+",
                "stationId": "fra-003",
                "stationName": "EnBW HyperHub Frankfurt Flughafen (A3 / A5)",
                "location": "Hugo-Eckener-Ring, Frankfurt am Main"
        },
        {
                "operator": "Fastned",
                "stationId": "mot-002",
                "stationName": "Fastned Autohof Mücke (A5)",
                "location": "Gewerbeweg 1, Mücke"
        }
]
    }
  },
  {
    slug: "a6",
    name: "A6",
    route: "Saarbrücken – Waidhaus (CZ-Grenze)",
    lengthKm: 392,
    maxKw: 300,
    mainCPOs: ["Aral pulse","Fastned"],
    description: "Die A6 ist die südliche Ost-West-Route durch Bayern und die Pfalz und verbindet Saarbrücken über Mannheim, Heilbronn, Nürnberg mit der tschechischen Grenze.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "nue-002",
        stationName: "Aral pulse Nürnberg Zollhaus (A6 / B8)",
        operator: "Aral pulse",
        kwMax: 300,
        location: "Zollhausstraße 84, Nürnberg"
      },
      cpoEvidence: [
        {
                "operator": "Aral pulse",
                "stationId": "nue-002",
                "stationName": "Aral pulse Nürnberg Zollhaus (A6 / B8)",
                "location": "Zollhausstraße 84, Nürnberg"
        },
        {
                "operator": "Fastned",
                "stationId": "ma-001",
                "stationName": "Fastned Mannheim Käfertal (B38 / A6)",
                "location": "Wingertsbuckel 16, Mannheim"
        }
]
    }
  },
  {
    slug: "a7",
    name: "A7",
    route: "Flensburg (DK-Grenze) – Füssen (A-Grenze)",
    lengthKm: 963,
    maxKw: 1000,
    mainCPOs: ["EnBW mobility+","Tesla","Aral pulse","Milence"],
    description: "Die A7 ist mit 963 km die längste Autobahn Deutschlands und verbindet die dänische Grenze bei Flensburg über Hamburg, Hannover, Frankfurt, Würzburg, Ulm mit dem Allgäu und der österreichischen Grenze bei Füssen.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "mcs-001",
        stationName: "Aral pulse E-Lkw Megawatt Hub Schwarmstedt (A7)",
        operator: "Aral pulse",
        kwMax: 1000,
        location: "Münchehofe 1, Schwarmstedt"
      },
      cpoEvidence: [
        {
                "operator": "EnBW mobility+",
                "stationId": "ks-001",
                "stationName": "EnBW Schnellladepark Kassel Leipziger Straße (A7)",
                "location": "Leipziger Str. 156, Kassel"
        },
        {
                "operator": "Tesla",
                "stationId": "ks-003",
                "stationName": "Tesla Supercharger Lohfelden / Kassel (A7 / A49)",
                "location": "Alexander-von-Humboldt-Straße 1, Lohfelden"
        },
        {
                "operator": "Aral pulse",
                "stationId": "mcs-001",
                "stationName": "Aral pulse E-Lkw Megawatt Hub Schwarmstedt (A7)",
                "location": "Münchehofe 1, Schwarmstedt"
        },
        {
                "operator": "Milence",
                "stationId": "mcs-008",
                "stationName": "Milence E-Lkw Ladepark Kassel Lohfelden (A7 / A49)",
                "location": "Alexander-von-Humboldt-Straße 1, Lohfelden"
        }
]
    }
  },
  {
    slug: "a8",
    name: "A8",
    route: "Karlsruhe – Salzburg (A-Grenze)",
    lengthKm: 480,
    maxKw: 400,
    mainCPOs: ["E-Loaded","Tesla","EnBW mobility+"],
    description: "Die A8 ist die wichtigste Urlaubsroute von Stuttgart und München in Richtung Österreich und verbindet Karlsruhe über Stuttgart, Augsburg, München mit Salzburg. Einer der meistfrequentierten Reiserouten in die Alpen.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "hub-001",
        stationName: "Sortimo Innovationspark Zusmarshausen (A8)",
        operator: "E-Loaded / Tesla / EnBW",
        kwMax: 400,
        location: "Innovationspark 1, Zusmarshausen"
      },
      cpoEvidence: [
        {
                "operator": "E-Loaded",
                "stationId": "hub-001",
                "stationName": "Sortimo Innovationspark Zusmarshausen (A8)",
                "location": "Innovationspark 1, Zusmarshausen"
        },
        {
                "operator": "Tesla",
                "stationId": "hub-001",
                "stationName": "Sortimo Innovationspark Zusmarshausen (A8)",
                "location": "Innovationspark 1, Zusmarshausen"
        },
        {
                "operator": "EnBW mobility+",
                "stationId": "hub-001",
                "stationName": "Sortimo Innovationspark Zusmarshausen (A8)",
                "location": "Innovationspark 1, Zusmarshausen"
        }
]
    }
  },
  {
    slug: "a9",
    name: "A9",
    route: "Berlin – München",
    lengthKm: 531,
    maxKw: 1000,
    mainCPOs: ["Tesla","IONITY","Fastned","Aral pulse","Milence"],
    description: "Die A9 ist die direkte Verbindung zwischen Berlin und München und eine der meistbefahrenen Autobahnen Deutschlands. Der Korridor ist mit zahlreichen HPC-Hubs sehr gut versorgt.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "mcs-002",
        stationName: "Aral pulse E-Lkw Megawatt Hub Schnaittach (A9)",
        operator: "Aral pulse",
        kwMax: 1000,
        location: "Hedersdorfer Str. 1, Schnaittach"
      },
      cpoEvidence: [
        {
                "operator": "Tesla",
                "stationId": "lej-002",
                "stationName": "Tesla Supercharger Leipzig Günthersdorf (A9)",
                "location": "Nova Eventis Park, Leipzig"
        },
        {
                "operator": "IONITY",
                "stationId": "mot-007",
                "stationName": "IONITY Raststätte Köckern West (A9)",
                "location": "Raststätte Köckern West, Sandersdorf-Brehna"
        },
        {
                "operator": "Fastned",
                "stationId": "mot-008",
                "stationName": "Fastned Autohof Nempitz (A9)",
                "location": "Autohof Nempitz 1, Bad Dürrenberg"
        },
        {
                "operator": "Aral pulse",
                "stationId": "mcs-002",
                "stationName": "Aral pulse E-Lkw Megawatt Hub Schnaittach (A9)",
                "location": "Hedersdorfer Str. 1, Schnaittach"
        },
        {
                "operator": "Milence",
                "stationId": "mcs-007",
                "stationName": "Milence E-Lkw Ladepark Hermsdorfer Kreuz (A4 / A9)",
                "location": "Am Rüdersdorfer Wege 5D, Kraftsdorf"
        }
]
    }
  },
  {
    slug: "a10",
    name: "A10",
    route: "Berliner Ring (vollständig)",
    lengthKm: 196,
    maxKw: 1000,
    mainCPOs: ["Aral pulse"],
    description: "Der A10 Berliner Ring umschließt die Bundeshauptstadt vollständig und verteilt den regionalen und Fernverkehr auf das Berliner Stadtstraßennetz. Viele Autofahrer nutzen ihn als Pendlerachse.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "mcs-004",
        stationName: "Aral pulse E-Lkw Megawatt Hub Königs Wusterhausen (A10)",
        operator: "Aral pulse",
        kwMax: 1000,
        location: "Gewerbepark Nord 3, Königs Wusterhausen"
      },
      cpoEvidence: [
        {
                "operator": "Aral pulse",
                "stationId": "mcs-004",
                "stationName": "Aral pulse E-Lkw Megawatt Hub Königs Wusterhausen (A10)",
                "location": "Gewerbepark Nord 3, Königs Wusterhausen"
        }
]
    }
  },
  {
    slug: "a14",
    name: "A14",
    route: "Halle (Saale) – Schwerin Nord",
    lengthKm: 282,
    maxKw: 300,
    mainCPOs: ["EnBW mobility+"],
    description: "Die A14 verbindet Halle (Saale) über Magdeburg und Wittenberge mit Schwerin. Teile der Strecke befinden sich noch im Ausbau; die Verlängerung nach Schwerin wurde schrittweise bis 2022 fertiggestellt.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "hal-001",
        stationName: "EnBW Ladepark Halle-Peißen (A14)",
        operator: "EnBW mobility+",
        kwMax: 300,
        location: "Saarbrücker Str. 1, Halle (Saale)"
      },
      cpoEvidence: [
        {
                "operator": "EnBW mobility+",
                "stationId": "hal-001",
                "stationName": "EnBW Ladepark Halle-Peißen (A14)",
                "location": "Saarbrücker Str. 1, Halle (Saale)"
        }
]
    }
  },
  {
    slug: "a45",
    name: "A45",
    route: "Dortmund – Hanau",
    lengthKm: 259,
    maxKw: 300,
    mainCPOs: ["Aral pulse"],
    description: "Die A45 'Sauerlandlinie' verläuft von Dortmund durch das Sauerland und Siegerland bis nach Hanau. Die Strecke ist für ihre zahlreichen Brücken bekannt, von denen viele nach jahrzehntelangem Einsatz saniert oder neu gebaut werden.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "hag-001",
        stationName: "Aral pulse Hagen Bathey (A45)",
        operator: "Aral pulse",
        kwMax: 300,
        location: "Kabeler Str. 12, Hagen"
      },
      cpoEvidence: [
        {
                "operator": "Aral pulse",
                "stationId": "hag-001",
                "stationName": "Aral pulse Hagen Bathey (A45)",
                "location": "Kabeler Str. 12, Hagen"
        }
]
    }
  },
  {
    slug: "a61",
    name: "A61",
    route: "Mönchengladbach – Hockenheim",
    lengthKm: 361,
    maxKw: 350,
    mainCPOs: ["Aral pulse","IONITY"],
    description: "Die A61 ist eine wichtige Nord-Süd-Verbindung in Westdeutschland und führt von Mönchengladbach am Rhein entlang über Koblenz, den Hunsrück bis nach Hockenheim.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "mot-001",
        stationName: "IONITY Raststätte Brohltal Ost (A61)",
        operator: "IONITY",
        kwMax: 350,
        location: "Raststätte Brohltal Ost, Niederzissen"
      },
      cpoEvidence: [
        {
                "operator": "Aral pulse",
                "stationId": "hub-005",
                "stationName": "Aral pulse Schnellladepark Mönchengladbach (A61)",
                "location": "Am Nordpark 1, Mönchengladbach"
        },
        {
                "operator": "IONITY",
                "stationId": "mot-001",
                "stationName": "IONITY Raststätte Brohltal Ost (A61)",
                "location": "Raststätte Brohltal Ost, Niederzissen"
        }
]
    }
  },
  {
    slug: "a81",
    name: "A81",
    route: "Heilbronn – Singen (CH-Grenze)",
    lengthKm: 180,
    mainCPOs: [],
    description: "Die A81 verläuft von Heilbronn durch den Schwarzwald-Randbereich über Stuttgart und den Schwarzwald nach Singen an der Schweizer Grenze. Sie ist eine wichtige Zubringerroute für Urlauber in den Schwarzwald und die Schweiz.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a11",
    name: "A11",
    route: "Berlin (Dreieck Uckermark) – Stettin (PL-Grenze)",
    lengthKm: 103,
    mainCPOs: [],
    description: "Die A11 verbindet Berlin mit der polnischen Grenze bei Stettin (Szczecin) und ist eine der wichtigsten Verbindungsrouten in die Westpommernregion. Ladeinfrastruktur konzentriert sich auf die wenigen Rastanlagen.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a12",
    name: "A12",
    route: "Berlin (Dreieck Spreeau) – Frankfurt (Oder) (PL-Grenze)",
    lengthKm: 87,
    mainCPOs: [],
    description: "Die A12 verbindet Berlin über Frankfurt (Oder) mit der polnischen Grenze und ist eine wichtige Transitstrecke zwischen Deutschland und Polen (Richtung Warschau). Ladeinfrastruktur ist aufgebaut, aber noch nicht so dicht wie auf Westkorridoren.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a13",
    name: "A13",
    route: "Berlin (Dreieck Schönefeld) – Dresden",
    lengthKm: 190,
    mainCPOs: [],
    description: "Die A13 verbindet Berlin über Luckenwalde und Elsterwerda direkt mit Dresden und ist ein wichtiger Korridor zwischen der Bundeshauptstadt und Sachsen.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a15",
    name: "A15",
    route: "Cottbus – Forst (PL-Grenze)",
    lengthKm: 48,
    mainCPOs: [],
    description: "Die A15 ist eine kurze Autobahn in der Lausitz, die Cottbus mit der polnischen Grenze bei Forst verbindet. Als Zubringer für den Kohleabbau-Strukturwandel der Region gewinnt die E-Mobilitätsinfrastruktur an Bedeutung.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a17",
    name: "A17",
    route: "Dresden – Prag (CZ-Grenze)",
    lengthKm: 56,
    mainCPOs: [],
    description: "Die A17 führt von Dresden durch das Elbsandsteingebirge bis zur tschechischen Grenze bei Hrensko und ist die Hauptverbindung nach Prag. Die Strecke verläuft durch das Elbtal mit zahlreichen Tunneln und Brücken.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a19",
    name: "A19",
    route: "Dreieck Rostock – Dreieck Wittstock/Dosse",
    lengthKm: 148,
    maxKw: 300,
    mainCPOs: ["EnBW mobility+"],
    description: "Die A19 verbindet den Großraum Rostock mit dem Berliner Ring und ist die wichtigste Urlaubsroute von Berlin an die Ostsee. Sie zählt im Sommer zu den meistbelasteten Autobahnen Norddeutschlands.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "hro-001",
        stationName: "EnBW Schnellladepark Rostock Hanse Center (A19)",
        operator: "EnBW mobility+",
        kwMax: 300,
        location: "An der Autobahn 1, Rostock"
      },
      cpoEvidence: [
        {
                "operator": "EnBW mobility+",
                "stationId": "hro-001",
                "stationName": "EnBW Schnellladepark Rostock Hanse Center (A19)",
                "location": "An der Autobahn 1, Rostock"
        }
]
    }
  },
  {
    slug: "a20",
    name: "A20",
    route: "Lübeck – Bundesgrenze (Stettin/PL) via Rügen",
    lengthKm: 324,
    mainCPOs: [],
    description: "Die A20 ist die Ostseeautobahn und verläuft quer durch Mecklenburg-Vorpommern. Sie ist eine wichtige Verbindung für Urlauber aus dem Westen in Richtung Ostseeküste und Rügen.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a21",
    name: "A21",
    route: "Hamburg – Kiel",
    lengthKm: 121,
    mainCPOs: [],
    description: "Die A21 verbindet Hamburg mit Kiel und Neumünster und ist eine der wichtigsten Verbindungen für Pendler und Urlauber in Schleswig-Holstein.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a23",
    name: "A23",
    route: "Hamburg – Heide",
    lengthKm: 103,
    mainCPOs: [],
    description: "Die A23 führt von Hamburg nach Heide in Holstein und ist ein wichtiger Zubringer für die Westküste Schleswig-Holsteins.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a24",
    name: "A24",
    route: "Hamburg – Berlin",
    lengthKm: 229,
    maxKw: 1000,
    mainCPOs: ["Aral pulse"],
    description: "Die A24 verbindet Hamburg mit Berlin über Mecklenburg und ist eine der meistbefahrenen Nordachsen Deutschlands. Besonders am Wochenende und in Ferienzeiten sehr stark frequentiert.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "mcs-003",
        stationName: "Aral pulse E-Lkw Megawatt Hub Rastow (A24)",
        operator: "Aral pulse",
        kwMax: 1000,
        location: "Am Bahndamm 2, Rastow"
      },
      cpoEvidence: [
        {
                "operator": "Aral pulse",
                "stationId": "mcs-003",
                "stationName": "Aral pulse E-Lkw Megawatt Hub Rastow (A24)",
                "location": "Am Bahndamm 2, Rastow"
        }
]
    }
  },
  {
    slug: "a25",
    name: "A25",
    route: "Hamburg – Lauenburg",
    lengthKm: 38,
    mainCPOs: [],
    description: "Die A25 ist eine kurze Autobahn östlich von Hamburg, die als Zubringer für Ausflüge ins Vierlande-Gebiet und nach Lauenburg dient.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a26",
    name: "A26",
    route: "Stade – Hamburg (A7)",
    lengthKm: 65,
    mainCPOs: [],
    description: "Die A26 ist eine im Aufbau befindliche Autobahn im Hamburger Südwesten, die Stade und Buxtehude mit der A7 verbindet. Die Fertigstellung der Elbquerung (Niederelbetunnel) ist Kernprojekt dieser Strecke.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a27",
    name: "A27",
    route: "Walsrode – Bremen – Cuxhaven",
    lengthKm: 168,
    mainCPOs: [],
    description: "Die A27 verbindet das Wendland und Niedersachsen über Bremen mit der Nordseeküste bei Cuxhaven. Sie ist eine der wichtigsten Routen für Urlauber in Richtung Nordsee.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a28",
    name: "A28",
    route: "Dörpen – Oldenburg",
    lengthKm: 100,
    maxKw: 300,
    mainCPOs: ["EWE Go"],
    description: "Die A28 verbindet den Emsländischen Raum und die niederländische Grenzregion über Leer mit Oldenburg und dem norddeutschen Autobahnnetz.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "ol-001",
        stationName: "EWE Go Schnellladepark Oldenburg EWE Arena (A28)",
        operator: "EWE Go",
        kwMax: 300,
        location: "Maastrichter Str. 1, Oldenburg (Oldb)"
      },
      cpoEvidence: [
        {
                "operator": "EWE Go",
                "stationId": "ol-001",
                "stationName": "EWE Go Schnellladepark Oldenburg EWE Arena (A28)",
                "location": "Maastrichter Str. 1, Oldenburg (Oldb)"
        }
]
    }
  },
  {
    slug: "a29",
    name: "A29",
    route: "Wilhelmshaven – Dortmund (via Oldenburg/Bremen)",
    lengthKm: 208,
    mainCPOs: [],
    description: "Die A29 verbindet den Jade-Weser-Port Wilhelmshaven mit dem Autobahnnetz Niedersachsens und ist wichtig für den Schiffs- und Schwerlastverkehr aus dem Nordseehafen.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a30",
    name: "A30",
    route: "Löhne – Bad Bentheim (NL-Grenze)",
    lengthKm: 116,
    maxKw: 300,
    mainCPOs: ["Aral pulse"],
    description: "Die A30 verbindet Ostwestfalen über Osnabrück mit den Niederlanden und ist Teil der wichtigen Europaachse von Hamburg/Bremen nach Amsterdam.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "mot-005",
        stationName: "Aral pulse Autohof Salzbergen (A30 / A31)",
        operator: "Aral pulse",
        kwMax: 300,
        location: "Holsterfeld 1, Salzbergen"
      },
      cpoEvidence: [
        {
                "operator": "Aral pulse",
                "stationId": "mot-005",
                "stationName": "Aral pulse Autohof Salzbergen (A30 / A31)",
                "location": "Holsterfeld 1, Salzbergen"
        }
]
    }
  },
  {
    slug: "a31",
    name: "A31",
    route: "Emden – Bottrop",
    lengthKm: 260,
    mainCPOs: [],
    description: "Die A31 'Emslandautobahn' verbindet das Ruhrgebiet mit dem Emsland und der Nordseeküste bei Emden. Sie ist eine wichtige Pendlerroute und Tourismustrecke für den Nordseebereich.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a33",
    name: "A33",
    route: "Bielefeld – Paderborn",
    lengthKm: 67,
    mainCPOs: [],
    description: "Die A33 verbindet Bielefeld mit Paderborn und ist ein wichtiger Zubringer im ostwestfälischen Raum. Die Verlängerung nach Süden (A33n) ist im Planfeststellungsverfahren.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a38",
    name: "A38",
    route: "Göttingen – Leipzig (A9)",
    lengthKm: 196,
    mainCPOs: [],
    description: "Die A38 verbindet Göttingen mit dem Saaleland bei Leipzig und ist ein wichtiger Ost-West-Korridor in Mitteldeutschland, der die Harzvorderseite erschließt.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a39",
    name: "A39",
    route: "Wolfsburg – Lüneburg",
    lengthKm: 106,
    mainCPOs: [],
    description: "Die A39 verbindet Wolfsburg mit Lüneburg. Als 'VW-Autobahn' gilt sie historisch als Anbindung des Volkswagen-Stammwerks. Volkswagen hat entlang der Strecke eigene Schnelllader aufgebaut.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a40",
    name: "A40",
    route: "Dortmund – Venlo (NL-Grenze)",
    lengthKm: 127,
    maxKw: 400,
    mainCPOs: ["DEW21","EnBW mobility+"],
    description: "Die A40 'Ruhrschnellweg' ist eine der dichtestbevölkerten Autobahnstrecken Europas und verbindet das östliche Ruhrgebiet mit Duisburg und Venlo in den Niederlanden.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "boc-001",
        stationName: "EnBW HyperHub Ruhr Park Bochum (A40)",
        operator: "EnBW mobility+",
        kwMax: 400,
        location: "Am Einkaufszentrum 1, Bochum"
      },
      cpoEvidence: [
        {
                "operator": "DEW21",
                "stationId": "dtm-001",
                "stationName": "DEW21 Schnellladepark Dortmund Westfalenhallen (B1 / A40)",
                "location": "Rheinlanddamm 200, Dortmund"
        },
        {
                "operator": "EnBW mobility+",
                "stationId": "dtm-001",
                "stationName": "DEW21 Schnellladepark Dortmund Westfalenhallen (B1 / A40)",
                "location": "Rheinlanddamm 200, Dortmund"
        }
]
    }
  },
  {
    slug: "a42",
    name: "A42",
    route: "Kamp-Lintfort – Dortmund",
    lengthKm: 47,
    maxKw: 300,
    mainCPOs: ["Fastned","EWE Go"],
    description: "Die A42 'Emscherschnellweg' verbindet das nördliche Ruhrgebiet von Kamp-Lintfort über Oberhausen, Bottrop und Herne nach Dortmund.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "dui-002",
        stationName: "Fastned Duisburg Meiderich (A42)",
        operator: "Fastned",
        kwMax: 300,
        location: "Auf der Höhe 10, Duisburg"
      },
      cpoEvidence: [
        {
                "operator": "Fastned",
                "stationId": "dui-002",
                "stationName": "Fastned Duisburg Meiderich (A42)",
                "location": "Auf der Höhe 10, Duisburg"
        },
        {
                "operator": "EWE Go",
                "stationId": "ge-001",
                "stationName": "EWE Go Gelsenkirchen Buer (A42)",
                "location": "Willy-Brandt-Allee 50, Gelsenkirchen"
        }
]
    }
  },
  {
    slug: "a43",
    name: "A43",
    route: "Münster – Wuppertal",
    lengthKm: 133,
    mainCPOs: [],
    description: "Die A43 verbindet Münster über das Ruhrgebiet mit Wuppertal und ist eine wichtige Nord-Süd-Achse westlich des Ruhrgebiets.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a44",
    name: "A44",
    route: "Aachen – Kassel",
    lengthKm: 248,
    mainCPOs: [],
    description: "Die A44 verbindet Aachen über Dortmund und Paderborn mit Kassel und verläuft durch das rheinische Braunkohlerevier. Teile der Strecke im Tagebaugebiet sind noch im Ausbau.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a46",
    name: "A46",
    route: "Heinsberg – Bestwig",
    lengthKm: 114,
    maxKw: 350,
    mainCPOs: ["Tesla","Fastned","Aral pulse"],
    description: "Die A46 verbindet den Niederrhein über Düsseldorf und das Bergische Land mit dem Sauerland und ist eine wichtige Pendlerroute zwischen dem Rheinland und Westfalen.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "hub-003",
        stationName: "Seed & Greet Ladepark Kreuz Hilden (A3 / A46)",
        operator: "Tesla Supercharger / Fastned",
        kwMax: 350,
        location: "Nordpark 2, Hilden"
      },
      cpoEvidence: [
        {
                "operator": "Tesla",
                "stationId": "hub-003",
                "stationName": "Seed & Greet Ladepark Kreuz Hilden (A3 / A46)",
                "location": "Nordpark 2, Hilden"
        },
        {
                "operator": "Fastned",
                "stationId": "hub-003",
                "stationName": "Seed & Greet Ladepark Kreuz Hilden (A3 / A46)",
                "location": "Nordpark 2, Hilden"
        },
        {
                "operator": "Aral pulse",
                "stationId": "wup-001",
                "stationName": "Aral pulse Wuppertal Varresbeck (A46)",
                "location": "Düsseldorfer Str. 180, Wuppertal"
        }
]
    }
  },
  {
    slug: "a48",
    name: "A48",
    route: "Koblenz – Dreieck Vulkaneifel",
    lengthKm: 85,
    mainCPOs: [],
    description: "Die A48 verbindet Koblenz über Mayen und Kaisersesch mit der Eifelautobahn A1/A60 und erschließt die Vulkaneifel als Tourismusregion.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a49",
    name: "A49",
    route: "Kassel – Rodenbach (A66)",
    lengthKm: 116,
    maxKw: 400,
    mainCPOs: ["Milence"],
    description: "Die A49 verbindet Kassel über Schwalmstadt und Marburg mit dem Rhein-Main-Gebiet und ist eine wichtige Nord-Süd-Verbindung in Mittelhessen.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "mcs-008",
        stationName: "Milence E-Lkw Ladepark Kassel Lohfelden (A7 / A49)",
        operator: "Milence",
        kwMax: 400,
        location: "Alexander-von-Humboldt-Straße 1, Lohfelden"
      },
      cpoEvidence: [
        {
                "operator": "Milence",
                "stationId": "mcs-008",
                "stationName": "Milence E-Lkw Ladepark Kassel Lohfelden (A7 / A49)",
                "location": "Alexander-von-Humboldt-Straße 1, Lohfelden"
        }
]
    }
  },
  {
    slug: "a52",
    name: "A52",
    route: "Roermond (NL) – Essen",
    lengthKm: 82,
    maxKw: 300,
    mainCPOs: ["Aral pulse"],
    description: "Die A52 verbindet die niederländische Grenze bei Roermond über den westlichen Niederrhein mit Essen und ist eine wichtige Transitroute für den grenzüberschreitenden Verkehr.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "ess-001",
        stationName: "Stadtwerke Essen & Aral pulse Hub Messe Essen (A52)",
        operator: "Aral pulse",
        kwMax: 300,
        location: "Norbertstraße 2, Essen"
      },
      cpoEvidence: [
        {
                "operator": "Aral pulse",
                "stationId": "ess-001",
                "stationName": "Stadtwerke Essen & Aral pulse Hub Messe Essen (A52)",
                "location": "Norbertstraße 2, Essen"
        }
]
    }
  },
  {
    slug: "a57",
    name: "A57",
    route: "Köln – Krefeld (A40)",
    lengthKm: 57,
    maxKw: 300,
    mainCPOs: ["Aral pulse"],
    description: "Die A57 verbindet Köln über Dormagen mit Krefeld und mündet in die A40 (Ruhrschnellweg). Sie ist eine wichtige Pendlerachse zwischen dem Kölner Raum und dem Niederrhein.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "kr-001",
        stationName: "Aral pulse Krefeld Dießemer Bruch (A57)",
        operator: "Aral pulse",
        kwMax: 300,
        location: "Dießemer Bruch 100, Krefeld"
      },
      cpoEvidence: [
        {
                "operator": "Aral pulse",
                "stationId": "kr-001",
                "stationName": "Aral pulse Krefeld Dießemer Bruch (A57)",
                "location": "Dießemer Bruch 100, Krefeld"
        }
]
    }
  },
  {
    slug: "a59",
    name: "A59",
    route: "Duisburg-Süd – Bonn (A562)",
    lengthKm: 73,
    maxKw: 300,
    mainCPOs: ["EnBW mobility+"],
    description: "Die A59 verläuft am linken Rheinufer von Duisburg über Düsseldorf-Flughafen bis nach Bonn. Sie entlastet den innerstädtischen Rheinverkehr in der Metropolregion Rhein-Ruhr.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "bon-002",
        stationName: "EnBW HyperHub Bonn Beuel (A59 / A565)",
        operator: "EnBW mobility+",
        kwMax: 300,
        location: "Königswinterer Str. 110, Bonn"
      },
      cpoEvidence: [
        {
                "operator": "EnBW mobility+",
                "stationId": "bon-002",
                "stationName": "EnBW HyperHub Bonn Beuel (A59 / A565)",
                "location": "Königswinterer Str. 110, Bonn"
        }
]
    }
  },
  {
    slug: "a60",
    name: "A60",
    route: "Mainz – Dreieck Bingen",
    lengthKm: 39,
    maxKw: 400,
    mainCPOs: ["EnBW mobility+"],
    description: "Die A60 verbindet Mainz mit dem Dreieck Bingen und schließt die Rheingauregion an das überregionale Autobahnnetz an.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "mz-001",
        stationName: "EnBW HyperHub Mainz-Finthen (A60)",
        operator: "EnBW mobility+",
        kwMax: 400,
        location: "Kurmainzstraße 31, Mainz"
      },
      cpoEvidence: [
        {
                "operator": "EnBW mobility+",
                "stationId": "mz-001",
                "stationName": "EnBW HyperHub Mainz-Finthen (A60)",
                "location": "Kurmainzstraße 31, Mainz"
        }
]
    }
  },
  {
    slug: "a62",
    name: "A62",
    route: "Trier – Landstuhl",
    lengthKm: 89,
    mainCPOs: [],
    description: "Die A62 verbindet Trier über Birkenfeld und Kusel mit Landstuhl im westlichen Rheinland-Pfalz.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a63",
    name: "A63",
    route: "Mainz – Kaiserslautern",
    lengthKm: 76,
    mainCPOs: [],
    description: "Die A63 verbindet Mainz mit Kaiserslautern durch die rheinland-pfälzische Ebene und Hügellandschaft.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a64",
    name: "A64",
    route: "Trier – Luxemburg (LU-Grenze)",
    lengthKm: 19,
    mainCPOs: [],
    description: "Die A64 ist eine kurze Autobahn von Trier bis zur luxemburgischen Grenze. Als Zubringer für das Großherzogtum Luxemburg ist sie trotz geringer Länge stark frequentiert.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a65",
    name: "A65",
    route: "Ludwigshafen – Wörth am Rhein",
    lengthKm: 49,
    mainCPOs: [],
    description: "Die A65 erschließt die Deutsche Weinstraße und verbindet Ludwigshafen mit dem Grenzübergang bei Wörth am Rhein zur französischen Seite.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a66",
    name: "A66",
    route: "Fulda – Frankfurt-Nordwestkreuz",
    lengthKm: 117,
    maxKw: 300,
    mainCPOs: ["EnBW mobility+"],
    description: "Die A66 verbindet Fulda über Hanau mit dem Frankfurter Nordwestkreuz und ist eine wichtige Route für Pendler und Urlauber Richtung Rhön.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "wi-001",
        stationName: "EnBW Schnellladepark Wiesbaden Äppelallee (A66)",
        operator: "EnBW mobility+",
        kwMax: 300,
        location: "Äppelallee 69, Wiesbaden"
      },
      cpoEvidence: [
        {
                "operator": "EnBW mobility+",
                "stationId": "wi-001",
                "stationName": "EnBW Schnellladepark Wiesbaden Äppelallee (A66)",
                "location": "Äppelallee 69, Wiesbaden"
        }
]
    }
  },
  {
    slug: "a67",
    name: "A67",
    route: "Viernheim – Rüsselsheim",
    lengthKm: 53,
    mainCPOs: [],
    description: "Die A67 verläuft parallel zum Rhein südlich von Frankfurt und entlastet die A5 im Rhein-Main-Gebiet.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a70",
    name: "A70",
    route: "Bamberg – Schweinfurt",
    lengthKm: 57,
    mainCPOs: [],
    description: "Die A70 verbindet Bamberg mit Schweinfurt und erschließt das fränkische Weinland.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a71",
    name: "A71",
    route: "Erfurt – Schweinfurt",
    lengthKm: 174,
    mainCPOs: [],
    description: "Die A71 verbindet Erfurt über den Rennsteig im Thüringer Wald mit Schweinfurt und ist eine wichtige Nord-Süd-Achse in Thüringen und Unterfranken.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a72",
    name: "A72",
    route: "Chemnitz – Hof (A9)",
    lengthKm: 123,
    mainCPOs: [],
    description: "Die A72 verbindet Chemnitz über Zwickau und Plauen mit der A9 bei Hof und erschließt das sächsische Vogtland.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a73",
    name: "A73",
    route: "Feucht (A9) – Suhl (A71)",
    lengthKm: 195,
    maxKw: 300,
    mainCPOs: ["EnBW mobility+"],
    description: "Die A73 verbindet Nürnberg über Bamberg, Coburg und den Thüringer Wald mit Suhl und ist eine wichtige Ost-Achse in Bayern und Thüringen.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      maxKwEvidence: {
        stationId: "nue-001",
        stationName: "N-ERGIE & EnBW Schnellladepark Nürnberg Hafen (A73)",
        operator: "EnBW mobility+",
        kwMax: 300,
        location: "Hafenstraße 25, Nürnberg"
      },
      cpoEvidence: [
        {
                "operator": "EnBW mobility+",
                "stationId": "nue-001",
                "stationName": "N-ERGIE & EnBW Schnellladepark Nürnberg Hafen (A73)",
                "location": "Hafenstraße 25, Nürnberg"
        }
]
    }
  },
  {
    slug: "a93",
    name: "A93",
    route: "Regensburg – Rosenheim (A8)",
    lengthKm: 173,
    mainCPOs: [],
    description: "Die A93 verbindet Regensburg über den Landsberg Raum und Rosenheim mit dem österreichischen Grenzübergang am Inntal und ist eine wichtige Tourismusachse in die Alpen.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a94",
    name: "A94",
    route: "München – Passau (A3)",
    lengthKm: 155,
    mainCPOs: [],
    description: "Die A94 verbindet München mit Passau durch das bayerische Inn-Salzach-Gebiet und ist ein wichtiger Zubringer nach Österreich (Linz).",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a95",
    name: "A95",
    route: "München – Garmisch-Partenkirchen",
    lengthKm: 89,
    mainCPOs: [],
    description: "Die A95 ist die Hauptroute von München nach Garmisch-Partenkirchen und zum Zugspitzmassiv. Sie ist besonders im Winter und an Skiwochenenden sehr stark frequentiert.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a96",
    name: "A96",
    route: "München – Lindau (A-Grenze)",
    lengthKm: 191,
    mainCPOs: [],
    description: "Die A96 ist die wichtigste Reiseroute von München in Richtung Lindau und die Schweiz und führt durch das bayerische Schwaben und das Allgäu.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a98",
    name: "A98",
    route: "Hegau – Waldshut (CH-Grenze)",
    lengthKm: 103,
    mainCPOs: [],
    description: "Die A98 verläuft als Hochrheinautobahn entlang der Schweizer Grenze von Singen bis Waldshut und erschließt den südlichen Schwarzwald und die Grenzregion zur Schweiz.",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  },
  {
    slug: "a99",
    name: "A99",
    route: "Münchenring (West) – Feldkirchen (Ost)",
    lengthKm: 55,
    mainCPOs: [],
    description: "Der A99 Münchner Autobahnring schließt den Autobahnring um München und verteilt Fernverkehr auf alle einmündenden Autobahnen (A8, A9, A92, A94, A95, A96).",
    corridorEvidence: {
      lengthSource: "Die Autobahn GmbH des Bundes / BMVI Streckennetz",
      cpoEvidence: []
    }
  }
];

export const MOTORWAY_CITIES_MAP: Record<string, string[]> = {
  a1: ['hamburg', 'bremen', 'osnabrueck', 'muenster', 'dortmund', 'hagen', 'wuppertal', 'leverkusen', 'koeln', 'saarbruecken'],
  a2: ['oberhausen', 'gelsenkirchen', 'dortmund', 'hamm', 'bielefeld', 'hannover', 'braunschweig', 'magdeburg', 'potsdam', 'berlin'],
  a3: ['oberhausen', 'duisburg', 'duesseldorf', 'leverkusen', 'koeln', 'bonn', 'wiesbaden', 'frankfurt', 'nuernberg'],
  a4: ['aachen', 'koeln', 'erfurt', 'chemnitz', 'dresden'],
  a5: ['frankfurt', 'heidelberg', 'mannheim', 'karlsruhe', 'freiburg'],
  a6: ['saarbruecken', 'mannheim', 'heidelberg', 'nuernberg'],
  a7: ['hamburg', 'hannover', 'kassel', 'augsburg'],
  a8: ['karlsruhe', 'stuttgart', 'augsburg', 'muenchen'],
  a9: ['berlin', 'potsdam', 'leipzig', 'halle', 'nuernberg', 'muenchen'],
  a10: ['potsdam', 'berlin'],
  a14: ['magdeburg', 'halle', 'leipzig', 'dresden'],
  a24: ['hamburg', 'berlin'],
  a40: ['duisburg', 'muelheim', 'essen', 'bochum', 'dortmund'],
  a44: ['aachen', 'duesseldorf', 'dortmund', 'kassel'],
  a45: ['dortmund', 'hagen', 'frankfurt'],
  a52: ['moenchengladbach', 'krefeld', 'duesseldorf', 'essen', 'gelsenkirchen'],
  a57: ['krefeld', 'duesseldorf', 'koeln'],
  a59: ['duisburg', 'duesseldorf', 'leverkusen', 'koeln', 'bonn'],
  a66: ['wiesbaden', 'frankfurt'],
  a67: ['frankfurt', 'mannheim'],
  a73: ['nuernberg'],
  a81: ['stuttgart'],
  a99: ['muenchen']
};

export const MOTORWAY_CROSSINGS_MAP: Record<string, string[]> = {
  a1: ['a2', 'a3', 'a4', 'a7', 'a20', 'a24', 'a28', 'a30', 'a43', 'a44', 'a45', 'a46', 'a59', 'a61'],
  a2: ['a1', 'a3', 'a7', 'a9', 'a10', 'a14', 'a33', 'a39', 'a42', 'a43', 'a45'],
  a3: ['a1', 'a2', 'a4', 'a5', 'a6', 'a7', 'a9', 'a40', 'a46', 'a52', 'a59', 'a66', 'a67', 'a73', 'a93'],
  a4: ['a1', 'a3', 'a5', 'a7', 'a9', 'a13', 'a14', 'a17', 'a44', 'a57', 'a61', 'a71', 'a72'],
  a5: ['a3', 'a6', 'a7', 'a8', 'a66', 'a67'],
  a6: ['a1', 'a3', 'a5', 'a7', 'a9', 'a61', 'a62', 'a63', 'a65', 'a67', 'a73', 'a93'],
  a7: ['a1', 'a2', 'a3', 'a4', 'a5', 'a8', 'a21', 'a23', 'a38', 'a39', 'a44', 'a49', 'a70', 'a71', 'a96', 'a98'],
  a8: ['a5', 'a7', 'a81', 'a92', 'a94', 'a95', 'a96', 'a99'],
  a9: ['a2', 'a3', 'a4', 'a6', 'a10', 'a14', 'a38', 'a70', 'a72', 'a92', 'a93', 'a99'],
  a10: ['a2', 'a9', 'a11', 'a12', 'a13', 'a24'],
  a40: ['a3', 'a42', 'a43', 'a44', 'a45', 'a52', 'a57', 'a59'],
  a45: ['a1', 'a2', 'a3', 'a4', 'a40', 'a42', 'a44', 'a46', 'a66'],
  a66: ['a3', 'a5', 'a7', 'a67'],
  a81: ['a6', 'a8', 'a98'],
  a99: ['a8', 'a9', 'a92', 'a94', 'a96']
};

export function getMotorwayCitySlugs(motorwaySlug: string): string[] {
  return MOTORWAY_CITIES_MAP[motorwaySlug] || [];
}

export function getMotorwayCrossingSlugs(motorwaySlug: string): string[] {
  return MOTORWAY_CROSSINGS_MAP[motorwaySlug] || [];
}
