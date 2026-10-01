export interface CityMapping {
  slug: string;
  name: string;
  bundesland: string;
  ags: string;
  ars: string;
  officialPopulation: number;
  populationReferenceDate: string;
}

export const CITY_MAPPINGS: CityMapping[] = [
  {
    "slug": "berlin",
    "name": "Berlin",
    "bundesland": "Berlin",
    "ags": "11000000",
    "ars": "110000000000",
    "officialPopulation": 3685265,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "hamburg",
    "name": "Hamburg",
    "bundesland": "Hamburg",
    "ags": "02000000",
    "ars": "020000000000",
    "officialPopulation": 1862565,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "muenchen",
    "name": "München",
    "bundesland": "Bayern",
    "ags": "09162000",
    "ars": "091620000000",
    "officialPopulation": 1505005,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "koeln",
    "name": "Köln",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05315000",
    "ars": "053150000000",
    "officialPopulation": 1024621,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "frankfurt",
    "name": "Frankfurt am Main",
    "bundesland": "Hessen",
    "ags": "06412000",
    "ars": "064120000000",
    "officialPopulation": 756021,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "stuttgart",
    "name": "Stuttgart",
    "bundesland": "Baden-Württemberg",
    "ags": "08111000",
    "ars": "081110000000",
    "officialPopulation": 612663,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "duesseldorf",
    "name": "Düsseldorf",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05111000",
    "ars": "051110000000",
    "officialPopulation": 618685,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "leipzig",
    "name": "Leipzig",
    "bundesland": "Sachsen",
    "ags": "14713000",
    "ars": "147130000000",
    "officialPopulation": 611850,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "dortmund",
    "name": "Dortmund",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05913000",
    "ars": "059130000000",
    "officialPopulation": 603462,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "essen",
    "name": "Essen",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05113000",
    "ars": "051130000000",
    "officialPopulation": 574682,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "bremen",
    "name": "Bremen",
    "bundesland": "Bremen",
    "ags": "04011000",
    "ars": "040110000000",
    "officialPopulation": 586271,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "dresden",
    "name": "Dresden",
    "bundesland": "Sachsen",
    "ags": "14612000",
    "ars": "146120000000",
    "officialPopulation": 564904,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "hannover",
    "name": "Hannover",
    "bundesland": "Niedersachsen",
    "ags": "03241001",
    "ars": "032410001001",
    "officialPopulation": 522131,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "nuernberg",
    "name": "Nürnberg",
    "bundesland": "Bayern",
    "ags": "09564000",
    "ars": "095640000000",
    "officialPopulation": 529508,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "duisburg",
    "name": "Duisburg",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05112000",
    "ars": "051120000000",
    "officialPopulation": 502270,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "bochum",
    "name": "Bochum",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05911000",
    "ars": "059110000000",
    "officialPopulation": 358676,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "wuppertal",
    "name": "Wuppertal",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05124000",
    "ars": "051240000000",
    "officialPopulation": 358193,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "bielefeld",
    "name": "Bielefeld",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05711000",
    "ars": "057110000000",
    "officialPopulation": 331605,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "bonn",
    "name": "Bonn",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05314000",
    "ars": "053140000000",
    "officialPopulation": 323336,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "muenster",
    "name": "Münster",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05515000",
    "ars": "055150000000",
    "officialPopulation": 308258,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "karlsruhe",
    "name": "Karlsruhe",
    "bundesland": "Baden-Württemberg",
    "ags": "08212000",
    "ars": "082120000000",
    "officialPopulation": 309050,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "mannheim",
    "name": "Mannheim",
    "bundesland": "Baden-Württemberg",
    "ags": "08222000",
    "ars": "082220000000",
    "officialPopulation": 318035,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "augsburg",
    "name": "Augsburg",
    "bundesland": "Bayern",
    "ags": "09761000",
    "ars": "097610000000",
    "officialPopulation": 301105,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "wiesbaden",
    "name": "Wiesbaden",
    "bundesland": "Hessen",
    "ags": "06414000",
    "ars": "064140000000",
    "officialPopulation": 288850,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "kassel",
    "name": "Kassel",
    "bundesland": "Hessen",
    "ags": "06611000",
    "ars": "066110000000",
    "officialPopulation": 197230,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "gelsenkirchen",
    "name": "Gelsenkirchen",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05513000",
    "ars": "055130000000",
    "officialPopulation": 267930,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "moenchengladbach",
    "name": "Mönchengladbach",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05116000",
    "ars": "051160000000",
    "officialPopulation": 267213,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "braunschweig",
    "name": "Braunschweig",
    "bundesland": "Niedersachsen",
    "ags": "03101000",
    "ars": "031010000000",
    "officialPopulation": 252962,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "chemnitz",
    "name": "Chemnitz",
    "bundesland": "Sachsen",
    "ags": "14511000",
    "ars": "145110000000",
    "officialPopulation": 245618,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "kiel",
    "name": "Kiel",
    "bundesland": "Schleswig-Holstein",
    "ags": "01002000",
    "ars": "010020000000",
    "officialPopulation": 252668,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "aachen",
    "name": "Aachen",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05334002",
    "ars": "053340002002",
    "officialPopulation": 262670,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "halle",
    "name": "Halle (Saale)",
    "bundesland": "Sachsen-Anhalt",
    "ags": "15002000",
    "ars": "150020000000",
    "officialPopulation": 226767,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "magdeburg",
    "name": "Magdeburg",
    "bundesland": "Sachsen-Anhalt",
    "ags": "15003000",
    "ars": "150030000000",
    "officialPopulation": 244329,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "freiburg",
    "name": "Freiburg im Breisgau",
    "bundesland": "Baden-Württemberg",
    "ags": "08311000",
    "ars": "083110000000",
    "officialPopulation": 237460,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "krefeld",
    "name": "Krefeld",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05114000",
    "ars": "051140000000",
    "officialPopulation": 231406,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "mainz",
    "name": "Mainz",
    "bundesland": "Rheinland-Pfalz",
    "ags": "07315000",
    "ars": "073150000000",
    "officialPopulation": 224684,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "luebeck",
    "name": "Lübeck",
    "bundesland": "Schleswig-Holstein",
    "ags": "01003000",
    "ars": "010030000000",
    "officialPopulation": 216889,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "erfurt",
    "name": "Erfurt",
    "bundesland": "Thüringen",
    "ags": "16051000",
    "ars": "160510000000",
    "officialPopulation": 218793,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "oberhausen",
    "name": "Oberhausen",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05119000",
    "ars": "051190000000",
    "officialPopulation": 213646,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "rostock",
    "name": "Rostock",
    "bundesland": "Mecklenburg-Vorpommern",
    "ags": "13003000",
    "ars": "130030000000",
    "officialPopulation": 205307,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "hagen",
    "name": "Hagen",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05914000",
    "ars": "059140000000",
    "officialPopulation": 190384,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "potsdam",
    "name": "Potsdam",
    "bundesland": "Brandenburg",
    "ags": "12054000",
    "ars": "120540000000",
    "officialPopulation": 184754,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "saarbruecken",
    "name": "Saarbrücken",
    "bundesland": "Saarland",
    "ags": "10041100",
    "ars": "100410100100",
    "officialPopulation": 182971,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "hamm",
    "name": "Hamm",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05915000",
    "ars": "059150000000",
    "officialPopulation": 179968,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "ludwigshafen",
    "name": "Ludwigshafen am Rhein",
    "bundesland": "Rheinland-Pfalz",
    "ags": "07314000",
    "ars": "073140000000",
    "officialPopulation": 177222,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "muelheim",
    "name": "Mülheim an der Ruhr",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05117000",
    "ars": "051170000000",
    "officialPopulation": 173050,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "oldenburg",
    "name": "Oldenburg (Oldb)",
    "bundesland": "Niedersachsen",
    "ags": "03403000",
    "ars": "034030000000",
    "officialPopulation": 176614,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "osnabrueck",
    "name": "Osnabrück",
    "bundesland": "Niedersachsen",
    "ags": "03404000",
    "ars": "034040000000",
    "officialPopulation": 166057,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "leverkusen",
    "name": "Leverkusen",
    "bundesland": "Nordrhein-Westfalen",
    "ags": "05316000",
    "ars": "053160000000",
    "officialPopulation": 168581,
    "populationReferenceDate": "2024-12-31"
  },
  {
    "slug": "heidelberg",
    "name": "Heidelberg",
    "bundesland": "Baden-Württemberg",
    "ags": "08221000",
    "ars": "082210000000",
    "officialPopulation": 155756,
    "populationReferenceDate": "2024-12-31"
  }
];
