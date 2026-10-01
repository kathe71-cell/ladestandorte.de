export interface CityMapping {
  slug: string;
  name: string;
  bundesland: string;
  /**
   * Official AGS (Amtlicher Gemeindeschlüssel, 8 digits)
   */
  ags: string;
  /**
   * Official ARS (Amtlicher Regionalschlüssel, 12 digits) prefix
   */
  arsPrefix?: string;
  /**
   * Distinct city names appearing in BNetzA ort column
   */
  bnetzaOrtAliases: string[];
  /**
   * PLZ prefixes (first 2 or 3 digits) or full PLZ list for matching/disambiguation
   */
  plzPrefixes: string[];
  /**
   * Official Destatis population (Zensus 2022 Fortschreibung / GV-ISys Stichtag 31.12.2023 bzw. 31.12.2024)
   */
  officialPopulation: number;
  populationReferenceDate: string;
}

export const CITY_MAPPINGS: CityMapping[] = [
  {
    slug: "berlin",
    name: "Berlin",
    bundesland: "Berlin",
    ags: "11000000",
    arsPrefix: "11000",
    bnetzaOrtAliases: ["Berlin"],
    plzPrefixes: ["10", "12", "13", "140", "141"],
    officialPopulation: 3782202,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "hamburg",
    name: "Hamburg",
    bundesland: "Hamburg",
    ags: "02000000",
    arsPrefix: "02000",
    bnetzaOrtAliases: ["Hamburg"],
    plzPrefixes: ["20", "21", "22"],
    officialPopulation: 1910160,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "muenchen",
    name: "München",
    bundesland: "Bayern",
    ags: "09162000",
    arsPrefix: "09162",
    bnetzaOrtAliases: ["München", "Muenchen"],
    plzPrefixes: ["80", "81"],
    officialPopulation: 1510378,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "koeln",
    name: "Köln",
    bundesland: "Nordrhein-Westfalen",
    ags: "05315000",
    arsPrefix: "05315",
    bnetzaOrtAliases: ["Köln", "Koeln"],
    plzPrefixes: ["50", "511", "510"],
    officialPopulation: 1087353,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "frankfurt",
    name: "Frankfurt am Main",
    bundesland: "Hessen",
    ags: "06412000",
    arsPrefix: "06412",
    bnetzaOrtAliases: ["Frankfurt am Main", "Frankfurt / Main", "Frankfurt a. M.", "Frankfurt"],
    plzPrefixes: ["60"],
    officialPopulation: 775790,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "stuttgart",
    name: "Stuttgart",
    bundesland: "Baden-Württemberg",
    ags: "08111000",
    arsPrefix: "08111",
    bnetzaOrtAliases: ["Stuttgart"],
    plzPrefixes: ["70"],
    officialPopulation: 633484,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "duesseldorf",
    name: "Düsseldorf",
    bundesland: "Nordrhein-Westfalen",
    ags: "05111000",
    arsPrefix: "05111",
    bnetzaOrtAliases: ["Düsseldorf", "Duesseldorf"],
    plzPrefixes: ["40"],
    officialPopulation: 631217,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "leipzig",
    name: "Leipzig",
    bundesland: "Sachsen",
    ags: "14713000",
    arsPrefix: "14713",
    bnetzaOrtAliases: ["Leipzig"],
    plzPrefixes: ["04"],
    officialPopulation: 619879,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "dortmund",
    name: "Dortmund",
    bundesland: "Nordrhein-Westfalen",
    ags: "05913000",
    arsPrefix: "05913",
    bnetzaOrtAliases: ["Dortmund"],
    plzPrefixes: ["44"],
    officialPopulation: 595471,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "essen",
    name: "Essen",
    bundesland: "Nordrhein-Westfalen",
    ags: "05113000",
    arsPrefix: "05113",
    bnetzaOrtAliases: ["Essen"],
    plzPrefixes: ["451", "452", "453"],
    officialPopulation: 586608,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "bremen",
    name: "Bremen",
    bundesland: "Bremen",
    ags: "04011000",
    arsPrefix: "04011",
    bnetzaOrtAliases: ["Bremen"],
    plzPrefixes: ["28"],
    officialPopulation: 577026,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "dresden",
    name: "Dresden",
    bundesland: "Sachsen",
    ags: "14612000",
    arsPrefix: "14612",
    bnetzaOrtAliases: ["Dresden"],
    plzPrefixes: ["010", "011", "012", "013"],
    officialPopulation: 566222,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "hannover",
    name: "Hannover",
    bundesland: "Niedersachsen",
    ags: "03241001",
    arsPrefix: "03241",
    bnetzaOrtAliases: ["Hannover"],
    plzPrefixes: ["30"],
    officialPopulation: 548186,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "nuernberg",
    name: "Nürnberg",
    bundesland: "Bayern",
    ags: "09564000",
    arsPrefix: "09564",
    bnetzaOrtAliases: ["Nürnberg", "Nuernberg"],
    plzPrefixes: ["904"],
    officialPopulation: 526091,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "duisburg",
    name: "Duisburg",
    bundesland: "Nordrhein-Westfalen",
    ags: "05112000",
    arsPrefix: "05112",
    bnetzaOrtAliases: ["Duisburg"],
    plzPrefixes: ["470", "471", "472"],
    officialPopulation: 503707,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "bochum",
    name: "Bochum",
    bundesland: "Nordrhein-Westfalen",
    ags: "05911000",
    arsPrefix: "05911",
    bnetzaOrtAliases: ["Bochum"],
    plzPrefixes: ["447", "448"],
    officialPopulation: 366385,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "wuppertal",
    name: "Wuppertal",
    bundesland: "Nordrhein-Westfalen",
    ags: "05124000",
    arsPrefix: "05124",
    bnetzaOrtAliases: ["Wuppertal"],
    plzPrefixes: ["421", "422", "423"],
    officialPopulation: 358876,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "bielefeld",
    name: "Bielefeld",
    bundesland: "Nordrhein-Westfalen",
    ags: "05711000",
    arsPrefix: "05711",
    bnetzaOrtAliases: ["Bielefeld"],
    plzPrefixes: ["336"],
    officialPopulation: 338410,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "bonn",
    name: "Bonn",
    bundesland: "Nordrhein-Westfalen",
    ags: "05314000",
    arsPrefix: "05314",
    bnetzaOrtAliases: ["Bonn"],
    plzPrefixes: ["531", "532"],
    officialPopulation: 335789,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "muenster",
    name: "Münster",
    bundesland: "Nordrhein-Westfalen",
    ags: "05515000",
    arsPrefix: "05515",
    bnetzaOrtAliases: ["Münster", "Muenster"],
    plzPrefixes: ["481"],
    officialPopulation: 322904,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "karlsruhe",
    name: "Karlsruhe",
    bundesland: "Baden-Württemberg",
    ags: "08212000",
    arsPrefix: "08212",
    bnetzaOrtAliases: ["Karlsruhe"],
    plzPrefixes: ["761", "762"],
    officialPopulation: 309936,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "mannheim",
    name: "Mannheim",
    bundesland: "Baden-Württemberg",
    ags: "08222000",
    arsPrefix: "08222",
    bnetzaOrtAliases: ["Mannheim"],
    plzPrefixes: ["681", "682", "683"],
    officialPopulation: 316877,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "augsburg",
    name: "Augsburg",
    bundesland: "Bayern",
    ags: "09761000",
    arsPrefix: "09761",
    bnetzaOrtAliases: ["Augsburg"],
    plzPrefixes: ["861"],
    officialPopulation: 303150,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "wiesbaden",
    name: "Wiesbaden",
    bundesland: "Hessen",
    ags: "06414000",
    arsPrefix: "06414",
    bnetzaOrtAliases: ["Wiesbaden"],
    plzPrefixes: ["651", "652"],
    officialPopulation: 285522,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "kassel",
    name: "Kassel",
    bundesland: "Hessen",
    ags: "06611000",
    arsPrefix: "06611",
    bnetzaOrtAliases: ["Kassel"],
    plzPrefixes: ["341"],
    officialPopulation: 204698,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "gelsenkirchen",
    name: "Gelsenkirchen",
    bundesland: "Nordrhein-Westfalen",
    ags: "05513000",
    arsPrefix: "05513",
    bnetzaOrtAliases: ["Gelsenkirchen"],
    plzPrefixes: ["458"],
    officialPopulation: 266624,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "moenchengladbach",
    name: "Mönchengladbach",
    bundesland: "Nordrhein-Westfalen",
    ags: "05116000",
    arsPrefix: "05116",
    bnetzaOrtAliases: ["Mönchengladbach", "Moenchengladbach"],
    plzPrefixes: ["410", "411", "412"],
    officialPopulation: 268465,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "braunschweig",
    name: "Braunschweig",
    bundesland: "Niedersachsen",
    ags: "03101000",
    arsPrefix: "03101",
    bnetzaOrtAliases: ["Braunschweig"],
    plzPrefixes: ["381"],
    officialPopulation: 252066,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "chemnitz",
    name: "Chemnitz",
    bundesland: "Sachsen",
    ags: "14511000",
    arsPrefix: "14511",
    bnetzaOrtAliases: ["Chemnitz"],
    plzPrefixes: ["091"],
    officialPopulation: 250681,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "kiel",
    name: "Kiel",
    bundesland: "Schleswig-Holstein",
    ags: "01002000",
    arsPrefix: "01002",
    bnetzaOrtAliases: ["Kiel"],
    plzPrefixes: ["241"],
    officialPopulation: 248792,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "aachen",
    name: "Aachen",
    bundesland: "Nordrhein-Westfalen",
    ags: "05334002",
    arsPrefix: "05334",
    bnetzaOrtAliases: ["Aachen"],
    plzPrefixes: ["520"],
    officialPopulation: 252769,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "halle",
    name: "Halle (Saale)",
    bundesland: "Sachsen-Anhalt",
    ags: "15002000",
    arsPrefix: "15002",
    bnetzaOrtAliases: ["Halle (Saale)", "Halle/Saale", "Halle"],
    plzPrefixes: ["061"],
    officialPopulation: 242083,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "magdeburg",
    name: "Magdeburg",
    bundesland: "Sachsen-Anhalt",
    ags: "15003000",
    arsPrefix: "15003",
    bnetzaOrtAliases: ["Magdeburg"],
    plzPrefixes: ["391"],
    officialPopulation: 240114,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "freiburg",
    name: "Freiburg im Breisgau",
    bundesland: "Baden-Württemberg",
    ags: "08311000",
    arsPrefix: "08311",
    bnetzaOrtAliases: ["Freiburg im Breisgau", "Freiburg"],
    plzPrefixes: ["790", "791"],
    officialPopulation: 237244,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "krefeld",
    name: "Krefeld",
    bundesland: "Nordrhein-Westfalen",
    ags: "05114000",
    arsPrefix: "05114",
    bnetzaOrtAliases: ["Krefeld"],
    plzPrefixes: ["477", "478"],
    officialPopulation: 231083,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "mainz",
    name: "Mainz",
    bundesland: "Rheinland-Pfalz",
    ags: "07315000",
    arsPrefix: "07315",
    bnetzaOrtAliases: ["Mainz"],
    plzPrefixes: ["551"],
    officialPopulation: 222889,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "luebeck",
    name: "Lübeck",
    bundesland: "Schleswig-Holstein",
    ags: "01003000",
    arsPrefix: "01003",
    bnetzaOrtAliases: ["Lübeck", "Luebeck"],
    plzPrefixes: ["235"],
    officialPopulation: 219044,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "erfurt",
    name: "Erfurt",
    bundesland: "Thüringen",
    ags: "16051000",
    arsPrefix: "16051",
    bnetzaOrtAliases: ["Erfurt"],
    plzPrefixes: ["990"],
    officialPopulation: 215675,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "oberhausen",
    name: "Oberhausen",
    bundesland: "Nordrhein-Westfalen",
    ags: "05119000",
    arsPrefix: "05119",
    bnetzaOrtAliases: ["Oberhausen"],
    plzPrefixes: ["460", "461"],
    officialPopulation: 211099,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "rostock",
    name: "Rostock",
    bundesland: "Mecklenburg-Vorpommern",
    ags: "13003000",
    arsPrefix: "13003",
    bnetzaOrtAliases: ["Rostock", "Hansestadt Rostock"],
    plzPrefixes: ["180", "181"],
    officialPopulation: 210795,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "hagen",
    name: "Hagen",
    bundesland: "Nordrhein-Westfalen",
    ags: "05914000",
    arsPrefix: "05914",
    bnetzaOrtAliases: ["Hagen"],
    plzPrefixes: ["580"],
    officialPopulation: 190490,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "potsdam",
    name: "Potsdam",
    bundesland: "Brandenburg",
    ags: "12054000",
    arsPrefix: "12054",
    bnetzaOrtAliases: ["Potsdam"],
    plzPrefixes: ["144"],
    officialPopulation: 187119,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "saarbruecken",
    name: "Saarbrücken",
    bundesland: "Saarland",
    ags: "10041100",
    arsPrefix: "10041",
    bnetzaOrtAliases: ["Saarbrücken", "Saarbruecken"],
    plzPrefixes: ["661"],
    officialPopulation: 183509,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "hamm",
    name: "Hamm",
    bundesland: "Nordrhein-Westfalen",
    ags: "05915000",
    arsPrefix: "05915",
    bnetzaOrtAliases: ["Hamm"],
    plzPrefixes: ["590"],
    officialPopulation: 181368,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "ludwigshafen",
    name: "Ludwigshafen am Rhein",
    bundesland: "Rheinland-Pfalz",
    ags: "07314000",
    arsPrefix: "07314",
    bnetzaOrtAliases: ["Ludwigshafen am Rhein", "Ludwigshafen"],
    plzPrefixes: ["670"],
    officialPopulation: 176110,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "muelheim",
    name: "Mülheim an der Ruhr",
    bundesland: "Nordrhein-Westfalen",
    ags: "05117000",
    arsPrefix: "05117",
    bnetzaOrtAliases: ["Mülheim an der Ruhr", "Mülheim", "Muelheim an der Ruhr"],
    plzPrefixes: ["454"],
    officialPopulation: 173255,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "oldenburg",
    name: "Oldenburg (Oldb)",
    bundesland: "Niedersachsen",
    ags: "03403000",
    arsPrefix: "03403",
    bnetzaOrtAliases: ["Oldenburg (Oldb)", "Oldenburg"],
    plzPrefixes: ["261"],
    officialPopulation: 174629,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "osnabrueck",
    name: "Osnabrück",
    bundesland: "Niedersachsen",
    ags: "03404000",
    arsPrefix: "03404",
    bnetzaOrtAliases: ["Osnabrück", "Osnabrueck"],
    plzPrefixes: ["490"],
    officialPopulation: 167366,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "leverkusen",
    name: "Leverkusen",
    bundesland: "Nordrhein-Westfalen",
    ags: "05316000",
    arsPrefix: "05316",
    bnetzaOrtAliases: ["Leverkusen"],
    plzPrefixes: ["513"],
    officialPopulation: 166414,
    populationReferenceDate: "2023-12-31"
  },
  {
    slug: "heidelberg",
    name: "Heidelberg",
    bundesland: "Baden-Württemberg",
    ags: "08221000",
    arsPrefix: "08221",
    bnetzaOrtAliases: ["Heidelberg"],
    plzPrefixes: ["691"],
    officialPopulation: 162960,
    populationReferenceDate: "2023-12-31"
  }
];
