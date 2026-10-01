/**
 * HPC City Monitor Metrics Helper
 * Purely deterministic calculation based solely on generated city data.
 * No manual rankings, no artificial composite score, zero third-party dependencies.
 */

import { CITIES_DATA, CityData } from '../data/cities';
import { getSnapshotDateFormatted } from './datasetDate';

export interface HpcCityRow {
  slug: string;
  name: string;
  bundesland: string;
  einwohner: number;
  ladepunkteGesamt: number;
  hpcLadepunkte: number; // >= 150 kW
  hpcSharePercent: number; // hpcLadepunkte / ladepunkteGesamt * 100
  hpcPer1000Pop: number; // hpcLadepunkte / einwohner * 1000
  pointsPer1000Pop: number; // ladepunkteGesamt / einwohner * 1000
}

export interface HpcCityMonitorSummary {
  cityCount: number;
  totalLadepunkte: number;
  totalHpc: number;
  totalPopulation: number;
  overallHpcSharePercent: number; // sum(hpc) / sum(total) * 100
  overallHpcPer100kPop: number; // sum(hpc) / sum(population) * 100000
  medianHpc: number;
  medianHpcPer1000Pop: number;
  medianHpcSharePercent: number;
  averageHpc: number;
  averageHpcPer1000Pop: number;
  averageHpcSharePercent: number;
  bnetzaSnapshotDate: string;
  destatisReferenceDate: string;
  bnetzaLicense: string;
  destatisLicense: string;
  topAbsoluteCity: { name: string; slug: string; value: number };
  topDensityCity: { name: string; slug: string; value: number };
  topShareCity: { name: string; slug: string; value: number };
}

function calculateMedian(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function getHpcCityRows(cities: CityData[] = CITIES_DATA): HpcCityRow[] {
  return cities.map((city) => {
    const ladepunkteGesamt = city.ladepunkteGesamt;
    const hpcLadepunkte = city.hpcLadepunkte;
    const einwohner = city.einwohner;

    const hpcSharePercent = ladepunkteGesamt > 0
      ? (hpcLadepunkte / ladepunkteGesamt) * 100
      : 0;

    const hpcPer1000Pop = einwohner > 0
      ? (hpcLadepunkte / einwohner) * 1000
      : 0;

    const pointsPer1000Pop = einwohner > 0
      ? (ladepunkteGesamt / einwohner) * 1000
      : 0;

    return {
      slug: city.slug,
      name: city.name,
      bundesland: city.bundesland,
      einwohner,
      ladepunkteGesamt,
      hpcLadepunkte,
      hpcSharePercent,
      hpcPer1000Pop,
      pointsPer1000Pop
    };
  });
}

export function getHpcCityMonitorSummary(cities: CityData[] = CITIES_DATA): HpcCityMonitorSummary {
  const rows = getHpcCityRows(cities);
  const cityCount = rows.length;

  const totalLadepunkte = rows.reduce((acc, r) => acc + r.ladepunkteGesamt, 0);
  const totalHpc = rows.reduce((acc, r) => acc + r.hpcLadepunkte, 0);
  const totalPopulation = rows.reduce((acc, r) => acc + r.einwohner, 0);

  const overallHpcSharePercent = totalLadepunkte > 0
    ? (totalHpc / totalLadepunkte) * 100
    : 0;

  const overallHpcPer100kPop = totalPopulation > 0
    ? (totalHpc / totalPopulation) * 100000
    : 0;

  const medianHpc = calculateMedian(rows.map((r) => r.hpcLadepunkte));
  const medianHpcPer1000Pop = calculateMedian(rows.map((r) => r.hpcPer1000Pop));
  const medianHpcSharePercent = calculateMedian(rows.map((r) => r.hpcSharePercent));

  const averageHpc = cityCount > 0 ? totalHpc / cityCount : 0;
  const averageHpcPer1000Pop = cityCount > 0
    ? rows.reduce((acc, r) => acc + r.hpcPer1000Pop, 0) / cityCount
    : 0;
  const averageHpcSharePercent = cityCount > 0
    ? rows.reduce((acc, r) => acc + r.hpcSharePercent, 0) / cityCount
    : 0;

  // Key findings leaders
  const sortedByAbsolute = [...rows].sort((a, b) => b.hpcLadepunkte - a.hpcLadepunkte);
  const sortedByDensity = [...rows].sort((a, b) => b.hpcPer1000Pop - a.hpcPer1000Pop);
  const sortedByShare = [...rows].sort((a, b) => b.hpcSharePercent - a.hpcSharePercent);

  const topAbsolute = sortedByAbsolute[0] || { name: '', slug: '', hpcLadepunkte: 0 };
  const topDensity = sortedByDensity[0] || { name: '', slug: '', hpcPer1000Pop: 0 };
  const topShare = sortedByShare[0] || { name: '', slug: '', hpcSharePercent: 0 };

  const sampleCity = cities[0];
  const bnetzaSnapshotDate = sampleCity?.bnetza?.provenance?.retrievedAt
    ? new Date(sampleCity.bnetza.provenance.retrievedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : getSnapshotDateFormatted();
  const destatisReferenceDate = sampleCity?.population?.referenceDate
    ? new Date(sampleCity.population.referenceDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '31.12.2024';

  return {
    cityCount,
    totalLadepunkte,
    totalHpc,
    totalPopulation,
    overallHpcSharePercent,
    overallHpcPer100kPop,
    medianHpc,
    medianHpcPer1000Pop,
    medianHpcSharePercent,
    averageHpc,
    averageHpcPer1000Pop,
    averageHpcSharePercent,
    bnetzaSnapshotDate,
    destatisReferenceDate,
    bnetzaLicense: 'CC BY 4.0 (Bundesnetzagentur.de)',
    destatisLicense: 'dl-de/by-2-0 (Statistisches Bundesamt)',
    topAbsoluteCity: {
      name: topAbsolute.name,
      slug: topAbsolute.slug,
      value: topAbsolute.hpcLadepunkte
    },
    topDensityCity: {
      name: topDensity.name,
      slug: topDensity.slug,
      value: topDensity.hpcPer1000Pop
    },
    topShareCity: {
      name: topShare.name,
      slug: topShare.slug,
      value: topShare.hpcSharePercent
    }
  };
}
