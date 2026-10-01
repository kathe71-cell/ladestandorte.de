export interface CpoCityPresence {
  citySlug: string;
  cityName: string;
  stationsCount: number;
}

export interface CpoAggregateRecord {
  id: string;
  slug: string;
  name: string;
  brandName: string;
  parentCompany: string;
  headquarters: string;
  website: string;
  description: string;
  stationsTotal: number;
  chargingPointsTotal: number;
  chargingPoints150PlusKw: number;
  share150PlusKwPercent: number;
  shareOfRegisterHpcPercent: number; // Share of all register HPC points (explicit label!)
  shareOfRegisterTotalPercent: number; // Share of all register points
  citiesWithPresenceCount: number;
  topCities: CpoCityPresence[];
  powerBrackets: {
    upTo22Kw: number;
    between22And150Kw: number;
    points150PlusKw: number;
  };
  provenance: {
    source: string;
    snapshotDate: string;
    license: string;
    attribution: string;
    datasetDisclaimer: string;
  };
}

export interface CpoMonitorDataset {
  publisher: string;
  canonicalUrl: string;
  snapshotDate: string;
  totalRegisterPointsDE: number;
  totalRegisterHpcPointsDE: number;
  cposCount: number;
  methodologyUrl: string;
  definition: {
    hpcClass: string;
    aggregationScope: string;
    disclaimer: string;
  };
  operators: CpoAggregateRecord[];
}
