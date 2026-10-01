export interface HistoricalCityDelta {
  chargingPointsTotalDelta: number;
  chargingPointsTotalPercent: number | null;
  chargingPoints150PlusKwDelta: number;
  chargingPoints150PlusKwPercent: number | null;
  share150PlusKwDeltaPercent: number;
}

export interface HistoricalCityRecord {
  slug: string;
  name: string;
  chargingPointsTotal: number;
  chargingPoints150PlusKw: number;
  share150PlusKwPercent: number;
  points150PlusKwPer1000Pop: number;
}

export interface HistoricalSnapshot {
  snapshotDate: string;
  retrievedAt: string;
  sourceSha256: string;
  totalChargingPointsDE: number;
  totalHpcPointsDE: number;
  cities: HistoricalCityRecord[];
}

export interface CityHistoricalTrend {
  citySlug: string;
  cityName: string;
  previousSnapshotDate: string;
  currentSnapshotDate: string;
  previousPointsTotal: number;
  currentPointsTotal: number;
  pointsTotalDelta: number;
  pointsTotalPercentChange: number | null;
  previousHpc: number;
  currentHpc: number;
  hpcDelta: number;
  hpcPercentChange: number | null;
  previousHpcShare: number;
  currentHpcShare: number;
  hpcShareDeltaPercent: number;
}

/**
 * Computes safe percentage changes with strict zero-division protection.
 * When baseline is 0, percentage change is returned as null (never Infinity, never NaN).
 */
export function computeSafePercentChange(previousValue: number, currentValue: number): number | null {
  if (previousValue <= 0) {
    return null;
  }
  const delta = currentValue - previousValue;
  return Number(((delta / previousValue) * 100).toFixed(2));
}

/**
 * Computes historical deltas between two snapshots for a given city.
 */
export function computeCityHistoricalTrend(
  previousSnapshot: HistoricalSnapshot,
  currentSnapshot: HistoricalSnapshot,
  citySlug: string
): CityHistoricalTrend | null {
  const prevCity = previousSnapshot.cities.find(c => c.slug === citySlug);
  const currCity = currentSnapshot.cities.find(c => c.slug === citySlug);

  if (!prevCity || !currCity) {
    return null;
  }

  const pointsTotalDelta = currCity.chargingPointsTotal - prevCity.chargingPointsTotal;
  const hpcDelta = currCity.chargingPoints150PlusKw - prevCity.chargingPoints150PlusKw;
  const hpcShareDeltaPercent = Number((currCity.share150PlusKwPercent - prevCity.share150PlusKwPercent).toFixed(2));

  return {
    citySlug,
    cityName: currCity.name,
    previousSnapshotDate: previousSnapshot.snapshotDate,
    currentSnapshotDate: currentSnapshot.snapshotDate,
    previousPointsTotal: prevCity.chargingPointsTotal,
    currentPointsTotal: currCity.chargingPointsTotal,
    pointsTotalDelta,
    pointsTotalPercentChange: computeSafePercentChange(prevCity.chargingPointsTotal, currCity.chargingPointsTotal),
    previousHpc: prevCity.chargingPoints150PlusKw,
    currentHpc: currCity.chargingPoints150PlusKw,
    hpcDelta,
    hpcPercentChange: computeSafePercentChange(prevCity.chargingPoints150PlusKw, currCity.chargingPoints150PlusKw),
    previousHpcShare: prevCity.share150PlusKwPercent,
    currentHpcShare: currCity.share150PlusKwPercent,
    hpcShareDeltaPercent
  };
}
