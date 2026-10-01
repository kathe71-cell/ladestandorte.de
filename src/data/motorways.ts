// motorways_new.ts
// Stand: September 2026
// Quellen: autobahn.de, ADAC, GoingElectric, BNetzA-Karte, Wikipedia (Streckenführungen)
// Hinweise:
//   - Längenangaben: gerundet nach Wikipedia/Autobahn GmbH
//   - Mit * markierte Werte sind fundierte Schätzungen

export interface MotorwayData {
  slug: string;
  name: string;
  route: string;
  lengthKm: number;
  maxKw: number;
  mainCPOs: string[];
  description: string;
  majorCities?: string[];
  connectingMotorways?: string[];
}

export const MOTORWAYS_DATA: MotorwayData[] = [

  // ── BESTANDSAUTOBAHNEN (aktualisiert) ────────────────────────────────────

  {
    slug: "a1",
    name: "A1",
    route: "Heiligenhafen Nord – Saarbrücken",
    lengthKm: 734,
    maxKw: 350,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse", "Tesla"],
    description:
      "Die A1 ist eine der längsten deutschen Autobahnen und verbindet die Nordsee-Küste (Fehmarn) über Hamburg, Bremen und das Ruhrgebiet mit Saarbrücken. Sie ist eine der meistbefahrenen Transitstrecken für internationale Güterverkehre.",
  },
  {
    slug: "a2",
    name: "A2",
    route: "Oberhausen – Berlin (Dreieck Werder)",
    lengthKm: 488,
    maxKw: 350,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse", "TotalEnergies"],
    description:
      "Die A2 ist die wichtigste Ost-West-Verbindung in Norddeutschland und verläuft vom Ruhrgebiet durch Hannover, Magdeburg bis nach Berlin. Sie ist eine der am stärksten belasteten Fernstraßen Deutschlands.",
  },
  {
    slug: "a3",
    name: "A3",
    route: "Arnhem (NL) – Passau",
    lengthKm: 764,
    maxKw: 350,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse", "TotalEnergies"],
    description:
      "Die A3 ist Deutschlands zweitlängste Autobahn (innerhalb DE) und verbindet die Niederlande über das Ruhrgebiet, Frankfurt, Nürnberg mit Passau. Der Autobahnabschnitt verfügt über ein dichtes Netz an HPC-Ladestationen (u. a. Raststätte Rohrbrunn und Spessart Süd).",
  },
  {
    slug: "a4",
    name: "A4",
    route: "Aachen – Görlitz (PL-Grenze)",
    lengthKm: 643,
    maxKw: 350,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse", "Vattenfall InCharge"],
    description:
      "Die A4 ist die südliche Ost-West-Hauptachse und verbindet Aachen über Köln, Erfurt, Dresden mit der polnischen Grenze. Eine der strategisch wichtigsten Europarouten durch Mitteldeutschland.",
  },
  {
    slug: "a5",
    name: "A5",
    route: "Hattenbach – Basel (CH-Grenze)",
    lengthKm: 457,
    maxKw: 350,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse", "TotalEnergies"],
    description:
      "Die A5 verbindet den Norden Hessens über Frankfurt und Karlsruhe mit dem Schweizer Grenzübergang Basel. Sie ist ein wichtiger Korridor für den Tourismus in den Schwarzwald und die Schweiz.",
  },
  {
    slug: "a6",
    name: "A6",
    route: "Saarbrücken – Waidhaus (CZ-Grenze)",
    lengthKm: 392,
    maxKw: 350,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse", "TotalEnergies"],
    description:
      "Die A6 ist die südliche Ost-West-Route durch Bayern und die Pfalz und verbindet Saarbrücken über Mannheim, Heilbronn, Nürnberg mit der tschechischen Grenze.",
  },
  {
    slug: "a7",
    name: "A7",
    route: "Flensburg (DK-Grenze) – Füssen (A-Grenze)",
    lengthKm: 963,
    maxKw: 350,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse", "TotalEnergies"],
    description:
      "Die A7 ist mit 963 km die längste Autobahn Deutschlands und verbindet die dänische Grenze bei Flensburg über Hamburg, Hannover, Frankfurt, Würzburg, Ulm mit dem Allgäu und der österreichischen Grenze bei Füssen.",
  },
  {
    slug: "a8",
    name: "A8",
    route: "Karlsruhe – Salzburg (A-Grenze)",
    lengthKm: 480,
    maxKw: 350,
    mainCPOs: ["IONITY", "EnBW", "Tesla", "Aral pulse"],
    description:
      "Die A8 ist die wichtigste Urlaubsroute von Stuttgart und München in Richtung Österreich und verbindet Karlsruhe über Stuttgart, Augsburg, München mit Salzburg. Einer der meistfrequentierten Reiserouten in die Alpen.",
  },
  {
    slug: "a9",
    name: "A9",
    route: "Berlin – München",
    lengthKm: 531,
    maxKw: 350,
    mainCPOs: ["IONITY", "Tesla", "EnBW", "Fastned"],
    description:
      "Die A9 ist die direkte Verbindung zwischen Berlin und München und eine der meistbefahrenen Autobahnen Deutschlands. Der Korridor ist mit zahlreichen HPC-Hubs sehr gut versorgt.",
  },
  {
    slug: "a10",
    name: "A10",
    route: "Berliner Ring (vollständig)",
    lengthKm: 196,
    maxKw: 300,
    mainCPOs: ["EnBW", "IONITY", "Aral pulse", "TotalEnergies"],
    description:
      "Der A10 Berliner Ring umschließt die Bundeshauptstadt vollständig und verteilt den regionalen und Fernverkehr auf das Berliner Stadtstraßennetz. Viele Autofahrer nutzen ihn als Pendlerachse.",
  },
  {
    slug: "a14",
    name: "A14",
    route: "Halle (Saale) – Schwerin Nord",
    lengthKm: 282,
    maxKw: 300,
    mainCPOs: ["EnBW", "Vattenfall InCharge", "TotalEnergies"],
    description:
      "Die A14 verbindet Halle (Saale) über Magdeburg und Wittenberge mit Schwerin. Teile der Strecke befinden sich noch im Ausbau; die Verlängerung nach Schwerin wurde schrittweise bis 2022 fertiggestellt.",
  },
  {
    slug: "a45",
    name: "A45",
    route: "Dortmund – Hanau",
    lengthKm: 259,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse"],
    description:
      "Die A45 'Sauerlandlinie' verläuft von Dortmund durch das Sauerland und Siegerland bis nach Hanau. Die Strecke ist für ihre zahlreichen Brücken bekannt, von denen viele nach jahrzehntelangem Einsatz saniert oder neu gebaut werden.",
  },
  {
    slug: "a61",
    name: "A61",
    route: "Mönchengladbach – Hockenheim",
    lengthKm: 361,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse"],
    description:
      "Die A61 ist eine wichtige Nord-Süd-Verbindung in Westdeutschland und führt von Mönchengladbach am Rhein entlang über Koblenz, den Hunsrück bis nach Hockenheim.",
  },
  {
    slug: "a81",
    name: "A81",
    route: "Heilbronn – Singen (CH-Grenze)",
    lengthKm: 180,
    maxKw: 300,
    mainCPOs: ["EnBW", "Tesla", "Aral pulse"],
    description:
      "Die A81 verläuft von Heilbronn durch den Schwarzwald-Randbereich über Stuttgart und den Schwarzwald nach Singen an der Schweizer Grenze. Sie ist eine wichtige Zubringerroute für Urlauber in den Schwarzwald und die Schweiz.",
  },

  // ── NEUE AUTOBAHNEN ───────────────────────────────────────────────────────

  {
    slug: "a11",
    name: "A11",
    route: "Berlin (Dreieck Uckermark) – Stettin (PL-Grenze)",
    lengthKm: 103,
    maxKw: 300,
    mainCPOs: ["EnBW", "TotalEnergies"],
    description:
      "Die A11 verbindet Berlin mit der polnischen Grenze bei Stettin (Szczecin) und ist eine der wichtigsten Verbindungsrouten in die Westpommernregion. Ladeinfrastruktur konzentriert sich auf die wenigen Rastanlagen.",
  },
  {
    slug: "a12",
    name: "A12",
    route: "Berlin (Dreieck Spreeau) – Frankfurt (Oder) (PL-Grenze)",
    lengthKm: 87,
    maxKw: 300,
    mainCPOs: ["EnBW", "Fastned", "Vattenfall InCharge"],
    description:
      "Die A12 verbindet Berlin über Frankfurt (Oder) mit der polnischen Grenze und ist eine wichtige Transitstrecke zwischen Deutschland und Polen (Richtung Warschau). Ladeinfrastruktur ist aufgebaut, aber noch nicht so dicht wie auf Westkorridoren.",
  },
  {
    slug: "a13",
    name: "A13",
    route: "Berlin (Dreieck Schönefeld) – Dresden",
    lengthKm: 190,
    maxKw: 300,
    mainCPOs: ["EnBW", "IONITY", "TotalEnergies"],
    description:
      "Die A13 verbindet Berlin über Luckenwalde und Elsterwerda direkt mit Dresden und ist ein wichtiger Korridor zwischen der Bundeshauptstadt und Sachsen.",
  },
  {
    slug: "a15",
    name: "A15",
    route: "Cottbus – Forst (PL-Grenze)",
    lengthKm: 48,
    maxKw: 150,
    mainCPOs: ["EnBW", "TotalEnergies"],
    description:
      "Die A15 ist eine kurze Autobahn in der Lausitz, die Cottbus mit der polnischen Grenze bei Forst verbindet. Als Zubringer für den Kohleabbau-Strukturwandel der Region gewinnt die E-Mobilitätsinfrastruktur an Bedeutung.",
  },
  {
    slug: "a17",
    name: "A17",
    route: "Dresden – Prag (CZ-Grenze)",
    lengthKm: 56,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse"],
    description:
      "Die A17 führt von Dresden durch das Elbsandsteingebirge bis zur tschechischen Grenze bei Hrensko und ist die Hauptverbindung nach Prag. Die Strecke verläuft durch das Elbtal mit zahlreichen Tunneln und Brücken.",
  },
  {
    slug: "a19",
    name: "A19",
    route: "Dreieck Rostock – Dreieck Wittstock/Dosse",
    lengthKm: 148,
    maxKw: 300,
    mainCPOs: ["EnBW", "TotalEnergies", "Fastned"],
    description:
      "Die A19 verbindet den Großraum Rostock mit dem Berliner Ring und ist die wichtigste Urlaubsroute von Berlin an die Ostsee. Sie zählt im Sommer zu den meistbelasteten Autobahnen Norddeutschlands.",
  },
  {
    slug: "a20",
    name: "A20",
    route: "Lübeck – Bundesgrenze (Stettin/PL) via Rügen",
    lengthKm: 324,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "TotalEnergies", "Fastned"],
    description:
      "Die A20 ist die Ostseeautobahn und verläuft quer durch Mecklenburg-Vorpommern. Sie ist eine wichtige Verbindung für Urlauber aus dem Westen in Richtung Ostseeküste und Rügen.",
  },
  {
    slug: "a21",
    name: "A21",
    route: "Hamburg – Kiel",
    lengthKm: 121,
    maxKw: 300,
    mainCPOs: ["EnBW", "TotalEnergies", "Aral pulse"],
    description:
      "Die A21 verbindet Hamburg mit Kiel und Neumünster und ist eine der wichtigsten Verbindungen für Pendler und Urlauber in Schleswig-Holstein.",
  },
  {
    slug: "a23",
    name: "A23",
    route: "Hamburg – Heide",
    lengthKm: 103,
    maxKw: 150,
    mainCPOs: ["EnBW", "TotalEnergies"],
    description:
      "Die A23 führt von Hamburg nach Heide in Holstein und ist ein wichtiger Zubringer für die Westküste Schleswig-Holsteins.",
  },
  {
    slug: "a24",
    name: "A24",
    route: "Hamburg – Berlin",
    lengthKm: 229,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "Fastned"],
    description:
      "Die A24 verbindet Hamburg mit Berlin über Mecklenburg und ist eine der meistbefahrenen Nordachsen Deutschlands. Besonders am Wochenende und in Ferienzeiten sehr stark frequentiert.",
  },
  {
    slug: "a25",
    name: "A25",
    route: "Hamburg – Lauenburg",
    lengthKm: 38,
    maxKw: 150,
    mainCPOs: ["TotalEnergies", "EnBW"],
    description:
      "Die A25 ist eine kurze Autobahn östlich von Hamburg, die als Zubringer für Ausflüge ins Vierlande-Gebiet und nach Lauenburg dient.",
  },
  {
    slug: "a26",
    name: "A26",
    route: "Stade – Hamburg (A7)",
    lengthKm: 65,
    maxKw: 150,
    mainCPOs: ["EnBW", "TotalEnergies"],
    description:
      "Die A26 ist eine im Aufbau befindliche Autobahn im Hamburger Südwesten, die Stade und Buxtehude mit der A7 verbindet. Die Fertigstellung der Elbquerung (Niederelbetunnel) ist Kernprojekt dieser Strecke.",
  },
  {
    slug: "a27",
    name: "A27",
    route: "Walsrode – Bremen – Cuxhaven",
    lengthKm: 168,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "TotalEnergies"],
    description:
      "Die A27 verbindet das Wendland und Niedersachsen über Bremen mit der Nordseeküste bei Cuxhaven. Sie ist eine der wichtigsten Routen für Urlauber in Richtung Nordsee.",
  },
  {
    slug: "a28",
    name: "A28",
    route: "Dörpen – Oldenburg",
    lengthKm: 100,
    maxKw: 150,
    mainCPOs: ["EWE Go", "TotalEnergies", "EnBW"],
    description:
      "Die A28 verbindet den Emsländischen Raum und die niederländische Grenzregion über Leer mit Oldenburg und dem norddeutschen Autobahnnetz.",
  },
  {
    slug: "a29",
    name: "A29",
    route: "Wilhelmshaven – Dortmund (via Oldenburg/Bremen)",
    lengthKm: 208,
    maxKw: 300,
    mainCPOs: ["EnBW", "EWE Go", "TotalEnergies"],
    description:
      "Die A29 verbindet den Jade-Weser-Port Wilhelmshaven mit dem Autobahnnetz Niedersachsens und ist wichtig für den Schiffs- und Schwerlastverkehr aus dem Nordseehafen.",
  },
  {
    slug: "a30",
    name: "A30",
    route: "Löhne – Bad Bentheim (NL-Grenze)",
    lengthKm: 116,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse"],
    description:
      "Die A30 verbindet Ostwestfalen über Osnabrück mit den Niederlanden und ist Teil der wichtigen Europaachse von Hamburg/Bremen nach Amsterdam.",
  },
  {
    slug: "a31",
    name: "A31",
    route: "Emden – Bottrop",
    lengthKm: 260,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "EWE Go"],
    description:
      "Die A31 'Emslandautobahn' verbindet das Ruhrgebiet mit dem Emsland und der Nordseeküste bei Emden. Sie ist eine wichtige Pendlerroute und Tourismustrecke für den Nordseebereich.",
  },
  {
    slug: "a33",
    name: "A33",
    route: "Bielefeld – Paderborn",
    lengthKm: 67,
    maxKw: 150,
    mainCPOs: ["EnBW", "TotalEnergies"],
    description:
      "Die A33 verbindet Bielefeld mit Paderborn und ist ein wichtiger Zubringer im ostwestfälischen Raum. Die Verlängerung nach Süden (A33n) ist im Planfeststellungsverfahren.",
  },
  {
    slug: "a38",
    name: "A38",
    route: "Göttingen – Leipzig (A9)",
    lengthKm: 196,
    maxKw: 300,
    mainCPOs: ["EnBW", "TotalEnergies", "Fastned"],
    description:
      "Die A38 verbindet Göttingen mit dem Saaleland bei Leipzig und ist ein wichtiger Ost-West-Korridor in Mitteldeutschland, der die Harzvorderseite erschließt.",
  },
  {
    slug: "a39",
    name: "A39",
    route: "Wolfsburg – Lüneburg",
    lengthKm: 106,
    maxKw: 300,
    mainCPOs: ["EnBW", "Volkswagen/Elli", "TotalEnergies"],
    description:
      "Die A39 verbindet Wolfsburg mit Lüneburg. Als 'VW-Autobahn' gilt sie historisch als Anbindung des Volkswagen-Stammwerks. Volkswagen hat entlang der Strecke eigene Schnelllader aufgebaut.",
  },
  {
    slug: "a40",
    name: "A40",
    route: "Dortmund – Venlo (NL-Grenze)",
    lengthKm: 127,
    maxKw: 300,
    mainCPOs: ["EnBW", "IONITY", "RWE eMobility"],
    description:
      "Die A40 'Ruhrschnellweg' ist eine der dichtestbevölkerten Autobahnstrecken Europas und verbindet das östliche Ruhrgebiet mit Duisburg und Venlo in den Niederlanden.",
  },
  {
    slug: "a42",
    name: "A42",
    route: "Kamp-Lintfort – Dortmund",
    lengthKm: 47,
    maxKw: 150,
    mainCPOs: ["EnBW", "RWE eMobility"],
    description:
      "Die A42 'Emscherschnellweg' verbindet das nördliche Ruhrgebiet von Kamp-Lintfort über Oberhausen, Bottrop und Herne nach Dortmund.",
  },
  {
    slug: "a43",
    name: "A43",
    route: "Münster – Wuppertal",
    lengthKm: 133,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse"],
    description:
      "Die A43 verbindet Münster über das Ruhrgebiet mit Wuppertal und ist eine wichtige Nord-Süd-Achse westlich des Ruhrgebiets.",
  },
  {
    slug: "a44",
    name: "A44",
    route: "Aachen – Kassel",
    lengthKm: 248,
    maxKw: 350,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse"],
    description:
      "Die A44 verbindet Aachen über Dortmund und Paderborn mit Kassel und verläuft durch das rheinische Braunkohlerevier. Teile der Strecke im Tagebaugebiet sind noch im Ausbau.",
  },
  {
    slug: "a46",
    name: "A46",
    route: "Heinsberg – Bestwig",
    lengthKm: 114,
    maxKw: 300,
    mainCPOs: ["EnBW", "RWE eMobility", "Aral pulse"],
    description:
      "Die A46 verbindet den Niederrhein über Düsseldorf und das Bergische Land mit dem Sauerland und ist eine wichtige Pendlerroute zwischen dem Rheinland und Westfalen.",
  },
  {
    slug: "a48",
    name: "A48",
    route: "Koblenz – Dreieck Vulkaneifel",
    lengthKm: 85,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW"],
    description:
      "Die A48 verbindet Koblenz über Mayen und Kaisersesch mit der Eifelautobahn A1/A60 und erschließt die Vulkaneifel als Tourismusregion.",
  },
  {
    slug: "a49",
    name: "A49",
    route: "Kassel – Rodenbach (A66)",
    lengthKm: 116,
    maxKw: 300,
    mainCPOs: ["EnBW", "TotalEnergies"],
    description:
      "Die A49 verbindet Kassel über Schwalmstadt und Marburg mit dem Rhein-Main-Gebiet und ist eine wichtige Nord-Süd-Verbindung in Mittelhessen.",
  },
  {
    slug: "a52",
    name: "A52",
    route: "Roermond (NL) – Essen",
    lengthKm: 82,
    maxKw: 150,
    mainCPOs: ["EnBW", "NEW Mobility", "RWE eMobility"],
    description:
      "Die A52 verbindet die niederländische Grenze bei Roermond über den westlichen Niederrhein mit Essen und ist eine wichtige Transitroute für den grenzüberschreitenden Verkehr.",
  },
  {
    slug: "a57",
    name: "A57",
    route: "Köln – Krefeld (A40)",
    lengthKm: 57,
    maxKw: 300,
    mainCPOs: ["EnBW", "RWE eMobility"],
    description:
      "Die A57 verbindet Köln über Dormagen mit Krefeld und mündet in die A40 (Ruhrschnellweg). Sie ist eine wichtige Pendlerachse zwischen dem Kölner Raum und dem Niederrhein.",
  },
  {
    slug: "a59",
    name: "A59",
    route: "Duisburg-Süd – Bonn (A562)",
    lengthKm: 73,
    maxKw: 150,
    mainCPOs: ["EnBW", "RWE eMobility"],
    description:
      "Die A59 verläuft am linken Rheinufer von Duisburg über Düsseldorf-Flughafen bis nach Bonn. Sie entlastet den innerstädtischen Rheinverkehr in der Metropolregion Rhein-Ruhr.",
  },
  {
    slug: "a60",
    name: "A60",
    route: "Mainz – Dreieck Bingen",
    lengthKm: 39,
    maxKw: 150,
    mainCPOs: ["TotalEnergies", "EnBW"],
    description:
      "Die A60 verbindet Mainz mit dem Dreieck Bingen und schließt die Rheingauregion an das überregionale Autobahnnetz an.",
  },
  {
    slug: "a62",
    name: "A62",
    route: "Trier – Landstuhl",
    lengthKm: 89,
    maxKw: 150,
    mainCPOs: ["EnBW", "Pfalzwerke"],
    description:
      "Die A62 verbindet Trier über Birkenfeld und Kusel mit Landstuhl im westlichen Rheinland-Pfalz.",
  },
  {
    slug: "a63",
    name: "A63",
    route: "Mainz – Kaiserslautern",
    lengthKm: 76,
    maxKw: 150,
    mainCPOs: ["Pfalzwerke", "EnBW"],
    description:
      "Die A63 verbindet Mainz mit Kaiserslautern durch die rheinland-pfälzische Ebene und Hügellandschaft.",
  },
  {
    slug: "a64",
    name: "A64",
    route: "Trier – Luxemburg (LU-Grenze)",
    lengthKm: 19,
    maxKw: 150,
    mainCPOs: ["TotalEnergies", "EnBW"],
    description:
      "Die A64 ist eine kurze Autobahn von Trier bis zur luxemburgischen Grenze. Als Zubringer für das Großherzogtum Luxemburg ist sie trotz geringer Länge stark frequentiert.",
  },
  {
    slug: "a65",
    name: "A65",
    route: "Ludwigshafen – Wörth am Rhein",
    lengthKm: 49,
    maxKw: 150,
    mainCPOs: ["Pfalzwerke", "EnBW"],
    description:
      "Die A65 erschließt die Deutsche Weinstraße und verbindet Ludwigshafen mit dem Grenzübergang bei Wörth am Rhein zur französischen Seite.",
  },
  {
    slug: "a66",
    name: "A66",
    route: "Fulda – Frankfurt-Nordwestkreuz",
    lengthKm: 117,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "TotalEnergies"],
    description:
      "Die A66 verbindet Fulda über Hanau mit dem Frankfurter Nordwestkreuz und ist eine wichtige Route für Pendler und Urlauber Richtung Rhön.",
  },
  {
    slug: "a67",
    name: "A67",
    route: "Viernheim – Rüsselsheim",
    lengthKm: 53,
    maxKw: 300,
    mainCPOs: ["EnBW", "TotalEnergies"],
    description:
      "Die A67 verläuft parallel zum Rhein südlich von Frankfurt und entlastet die A5 im Rhein-Main-Gebiet.",
  },
  {
    slug: "a70",
    name: "A70",
    route: "Bamberg – Schweinfurt",
    lengthKm: 57,
    maxKw: 150,
    mainCPOs: ["EnBW", "TotalEnergies"],
    description:
      "Die A70 verbindet Bamberg mit Schweinfurt und erschließt das fränkische Weinland.",
  },
  {
    slug: "a71",
    name: "A71",
    route: "Erfurt – Schweinfurt",
    lengthKm: 174,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "TotalEnergies"],
    description:
      "Die A71 verbindet Erfurt über den Rennsteig im Thüringer Wald mit Schweinfurt und ist eine wichtige Nord-Süd-Achse in Thüringen und Unterfranken.",
  },
  {
    slug: "a72",
    name: "A72",
    route: "Chemnitz – Hof (A9)",
    lengthKm: 123,
    maxKw: 300,
    mainCPOs: ["EnBW", "TotalEnergies", "Vattenfall InCharge"],
    description:
      "Die A72 verbindet Chemnitz über Zwickau und Plauen mit der A9 bei Hof und erschließt das sächsische Vogtland.",
  },
  {
    slug: "a73",
    name: "A73",
    route: "Feucht (A9) – Suhl (A71)",
    lengthKm: 195,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "TotalEnergies"],
    description:
      "Die A73 verbindet Nürnberg über Bamberg, Coburg und den Thüringer Wald mit Suhl und ist eine wichtige Ost-Achse in Bayern und Thüringen.",
  },
  {
    slug: "a93",
    name: "A93",
    route: "Regensburg – Rosenheim (A8)",
    lengthKm: 173,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "Aral pulse"],
    description:
      "Die A93 verbindet Regensburg über den Landsberg Raum und Rosenheim mit dem österreichischen Grenzübergang am Inntal und ist eine wichtige Tourismusachse in die Alpen.",
  },
  {
    slug: "a94",
    name: "A94",
    route: "München – Passau (A3)",
    lengthKm: 155,
    maxKw: 300,
    mainCPOs: ["IONITY", "EnBW", "TotalEnergies"],
    description:
      "Die A94 verbindet München mit Passau durch das bayerische Inn-Salzach-Gebiet und ist ein wichtiger Zubringer nach Österreich (Linz).",
  },
  {
    slug: "a95",
    name: "A95",
    route: "München – Garmisch-Partenkirchen",
    lengthKm: 89,
    maxKw: 300,
    mainCPOs: ["EnBW", "Tesla", "Aral pulse"],
    description:
      "Die A95 ist die Hauptroute von München nach Garmisch-Partenkirchen und zum Zugspitzmassiv. Sie ist besonders im Winter und an Skiwochenenden sehr stark frequentiert.",
  },
  {
    slug: "a96",
    name: "A96",
    route: "München – Lindau (A-Grenze)",
    lengthKm: 191,
    maxKw: 350,
    mainCPOs: ["IONITY", "EnBW", "Tesla", "Aral pulse"],
    description:
      "Die A96 ist die wichtigste Reiseroute von München in Richtung Lindau und die Schweiz und führt durch das bayerische Schwaben und das Allgäu.",
  },
  {
    slug: "a98",
    name: "A98",
    route: "Hegau – Waldshut (CH-Grenze)",
    lengthKm: 103,
    maxKw: 150,
    mainCPOs: ["EnBW", "TotalEnergies"],
    description:
      "Die A98 verläuft als Hochrheinautobahn entlang der Schweizer Grenze von Singen bis Waldshut und erschließt den südlichen Schwarzwald und die Grenzregion zur Schweiz.",
  },
  {
    slug: "a99",
    name: "A99",
    route: "Münchenring (West) – Feldkirchen (Ost)",
    lengthKm: 55,
    maxKw: 300,
    mainCPOs: ["EnBW", "Tesla", "Aral pulse"],
    description:
      "Der A99 Münchner Autobahnring schließt den Autobahnring um München und verteilt Fernverkehr auf alle einmündenden Autobahnen (A8, A9, A92, A94, A95, A96).",
  },
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

