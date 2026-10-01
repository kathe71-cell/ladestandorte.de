import generatedCitiesData from './generated/cities.generated.json';
import editorialCitiesData from './cities-editorial.json';

export interface CityPopulation {
  value: number;
  referenceDate: string;
  source: string;
  license: string;
}

export interface CityPowerClasses {
  upTo22Kw: number;
  between22And150Kw: number;
  hpc150PlusKw: number;
}

export interface CityProvenance {
  dataSource: string;
  technicalDistributor: string;
  license: string;
  licenseUrl: string;
  attribution: string;
  retrievedAt: string;
  sourcePublishedAt: string;
  sourceDatasetDate: string | null;
  maxRecordTimestamp: string;
  rawSnapshotSha256: string;
  completenessDisclaimer: string;
}

export interface CityBnetzaData {
  ladestationen: number;
  ladepunkteGesamt: number;
  powerClasses: CityPowerClasses;
  hpcLadepunkte: number; // >= 150 kW
  avgKw: number;
  topBetreiber: string[];
  pointsPer1000Pop: number;
  hpcPer1000Pop: number;
  provenance: CityProvenance;
}

export interface CityData {
  slug: string;
  name: string;
  bundesland: string;
  ags: string;
  ars: string;
  einwohner: number; // Destatis 2024
  population: CityPopulation;
  ladepunkteGesamt: number;
  hpcLadepunkte: number; // >= 150 kW
  powerClasses: CityPowerClasses;
  pointsPer1000Pop: number;
  hpcPer1000Pop: number;
  avgKw: number;
  topBetreiber: string[];
  plzs: string[];
  description: string;
  bnetza: CityBnetzaData;
  connectedMotorways?: string[];
}

const editorialMap = new Map<string, { plzs: string[]; description: string }>();
for (const ed of editorialCitiesData) {
  editorialMap.set(ed.slug, {
    plzs: ed.plzs,
    description: ed.description
  });
}

export const CITY_MOTORWAYS_MAP: Record<string, string[]> = {
  berlin: ['a10', 'a111', 'a113', 'a115'],
  hamburg: ['a1', 'a7', 'a23', 'a24', 'a25', 'a26', 'a255', 'a261'],
  muenchen: ['a8', 'a9', 'a94', 'a95', 'a96', 'a99', 'a995'],
  koeln: ['a1', 'a3', 'a4', 'a57', 'a59', 'a555', 'a559'],
  frankfurt: ['a3', 'a5', 'a66', 'a648', 'a661'],
  stuttgart: ['a8', 'a81', 'a831'],
  duesseldorf: ['a3', 'a44', 'a46', 'a52', 'a57', 'a59'],
  leipzig: ['a9', 'a14', 'a38'],
  dortmund: ['a1', 'a2', 'a40', 'a42', 'a44', 'a45'],
  essen: ['a40', 'a42', 'a52'],
  bremen: ['a1', 'a27', 'a281'],
  dresden: ['a4', 'a13', 'a17'],
  hannover: ['a2', 'a7', 'a37'],
  nuernberg: ['a3', 'a6', 'a9', 'a73'],
  duisburg: ['a3', 'a40', 'a42', 'a59'],
  bochum: ['a40', 'a43', 'a448'],
  wuppertal: ['a1', 'a46', 'a535'],
  bielefeld: ['a2', 'a33'],
  bonn: ['a59', 'a555', 'a562', 'a565'],
  muenster: ['a1', 'a43'],
  karlsruhe: ['a5', 'a8'],
  mannheim: ['a6', 'a656', 'a659'],
  augsburg: ['a8'],
  wiesbaden: ['a66', 'a643', 'a671'],
  kassel: ['a7', 'a44', 'a49'],
  gelsenkirchen: ['a2', 'a42'],
  moenchengladbach: ['a44', 'a46', 'a52', 'a61'],
  braunschweig: ['a2', 'a36', 'a39', 'a391', 'a392'],
  chemnitz: ['a4', 'a72'],
  kiel: ['a7', 'a21'],
  aachen: ['a4', 'a44'],
  halle: ['a9', 'a14', 'a38'],
  magdeburg: ['a2', 'a14'],
  freiburg: ['a5'],
  krefeld: ['a44', 'a57'],
  mainz: ['a60', 'a63'],
  luebeck: ['a1', 'a20'],
  erfurt: ['a4', 'a71'],
  oberhausen: ['a2', 'a3', 'a42'],
  rostock: ['a19', 'a20'],
  hagen: ['a1', 'a45', 'a46'],
  potsdam: ['a10'],
  saarbruecken: ['a1', 'a6'],
  hamm: ['a1', 'a2'],
  ludwigshafen: ['a6', 'a61'],
  muelheim: ['a40', 'a52'],
  oldenburg: ['a28', 'a29'],
  osnabrueck: ['a1', 'a30', 'a33'],
  leverkusen: ['a1', 'a3', 'a59'],
  heidelberg: ['a5']
};

export function getCityMotorwaySlugs(citySlug: string): string[] {
  return CITY_MOTORWAYS_MAP[citySlug] || [];
}

export const CITIES_DATA: CityData[] = (generatedCitiesData as any[]).map((gen) => {
  const editorial = editorialMap.get(gen.slug);
  return {
    slug: gen.slug,
    name: gen.name,
    bundesland: gen.bundesland,
    ags: gen.ags,
    ars: gen.ars,
    einwohner: gen.population.value,
    population: gen.population,
    ladepunkteGesamt: gen.bnetza.ladepunkteGesamt,
    hpcLadepunkte: gen.bnetza.hpcLadepunkte,
    powerClasses: gen.bnetza.powerClasses,
    pointsPer1000Pop: gen.bnetza.pointsPer1000Pop,
    hpcPer1000Pop: gen.bnetza.hpcPer1000Pop,
    avgKw: gen.bnetza.avgKw,
    topBetreiber: gen.bnetza.topBetreiber,
    plzs: editorial?.plzs || [],
    description: editorial?.description || `Öffentliche Ladeinfrastruktur in ${gen.name} (${gen.bundesland}) laut amtlichem BNetzA-Ladesäulenregister.`,
    bnetza: gen.bnetza,
    connectedMotorways: CITY_MOTORWAYS_MAP[gen.slug] || []
  };
});
