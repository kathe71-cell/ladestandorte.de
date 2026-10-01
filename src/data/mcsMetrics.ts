import { StationData, getMcsStations } from './stations';

export interface OperatorDistributionItem {
  operator: string;
  operatorSlug: string;
  count: number;
  sharePercent: number; // Share WITHIN documented dataset
}

export interface McsMonitorMetrics {
  totalDocumented: number;
  mcsOperational: number;
  mcsPlanned: number;
  operationalSharePercent: number;

  // Power metrics strictly for operational MCS
  operationalMcsPowerMin: number | null;
  operationalMcsPowerMax: number | null;
  operationalMcsPowerAverage: number | null;
  operationalMcsPowerMedian: number | null;
  operationalMcsWithPowerCount: number;

  // CCS metrics across documented truck stations
  ccsPowerValues: number[];
  allDocumentedHave400KwCcs: boolean;
  ccsOperationalCount: number;

  // Truck suitability
  driveThroughCount: number;
  trailerAccessibleCount: number;
  allDriveThrough: boolean;
  allTrailerAccessible: boolean;

  // Operator distribution
  operatorDistribution: OperatorDistributionItem[];

  // Verification & Dataset Date
  lastVerifiedDates: string[];
  datasetLastVerifiedAt: string | null;
  datasetDateFormatted: string | null;
  verificationDateRangeFormatted: string | null;
}

function calculateMedian(values: number[]): number | null {
  if (values.length === 0) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 !== 0) {
    return sorted[mid];
  }
  return Math.round((sorted[mid - 1] + sorted[mid]) / 2);
}

function formatIsoGermanDate(isoDate: string): string {
  // isoDate format YYYY-MM-DD
  const parts = isoDate.split('-');
  if (parts.length !== 3) return isoDate;
  const day = parseInt(parts[2], 10);
  const monthIdx = parseInt(parts[1], 10) - 1;
  const year = parts[0];
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'
  ];
  const monthName = months[monthIdx] || parts[1];
  return `${day}. ${monthName} ${year}`;
}

export function getMcsMonitorMetrics(allStations: StationData[]): McsMonitorMetrics {
  const mcsStations = getMcsStations(allStations);
  const totalDocumented = mcsStations.length;

  const mcsOperationalStations = mcsStations.filter(
    (s) => s.truckCharging?.mcsStatus === 'operational'
  );
  const mcsPlannedStations = mcsStations.filter(
    (s) => s.truckCharging?.mcsStatus === 'planned'
  );

  const mcsOperational = mcsOperationalStations.length;
  const mcsPlanned = mcsPlannedStations.length;
  const operationalSharePercent = totalDocumented > 0
    ? Math.round((mcsOperational / totalDocumented) * 1000) / 10
    : 0;

  // Operational MCS power values (only existing non-null numbers)
  const operationalMcsPowers: number[] = [];
  for (const s of mcsOperationalStations) {
    if (typeof s.truckCharging?.mcsMaxKw === 'number' && s.truckCharging.mcsMaxKw > 0) {
      operationalMcsPowers.push(s.truckCharging.mcsMaxKw);
    }
  }

  const operationalMcsWithPowerCount = operationalMcsPowers.length;
  const operationalMcsPowerMin = operationalMcsPowers.length > 0
    ? Math.min(...operationalMcsPowers)
    : null;
  const operationalMcsPowerMax = operationalMcsPowers.length > 0
    ? Math.max(...operationalMcsPowers)
    : null;
  const operationalMcsPowerAverage = operationalMcsPowers.length > 0
    ? Math.round(operationalMcsPowers.reduce((a, b) => a + b, 0) / operationalMcsPowers.length)
    : null;
  const operationalMcsPowerMedian = calculateMedian(operationalMcsPowers);

  // CCS metrics
  const ccsPowers = mcsStations
    .map((s) => s.truckCharging?.ccsMaxKw)
    .filter((kw): kw is number => typeof kw === 'number');

  const allDocumentedHave400KwCcs = totalDocumented > 0 &&
    ccsPowers.length === totalDocumented &&
    ccsPowers.every((kw) => kw === 400);

  const ccsOperationalCount = mcsStations.filter(
    (s) => s.truckCharging?.locationStatus === 'operational'
  ).length;

  // Truck suitability
  const driveThroughCount = mcsStations.filter(
    (s) => s.truckCharging?.driveThrough === true
  ).length;
  const trailerAccessibleCount = mcsStations.filter(
    (s) => s.truckCharging?.trailerAccessible === true
  ).length;

  const allDriveThrough = totalDocumented > 0 && driveThroughCount === totalDocumented;
  const allTrailerAccessible = totalDocumented > 0 && trailerAccessibleCount === totalDocumented;

  // Operator distribution
  const operatorMap = new Map<string, { operator: string; operatorSlug: string; count: number }>();
  for (const s of mcsStations) {
    const existing = operatorMap.get(s.operator);
    if (existing) {
      existing.count += 1;
    } else {
      operatorMap.set(s.operator, {
        operator: s.operator,
        operatorSlug: s.operatorSlug,
        count: 1
      });
    }
  }

  const operatorDistribution: OperatorDistributionItem[] = Array.from(operatorMap.values())
    .map((item) => ({
      operator: item.operator,
      operatorSlug: item.operatorSlug,
      count: item.count,
      sharePercent: totalDocumented > 0 ? Math.round((item.count / totalDocumented) * 1000) / 10 : 0
    }))
    .sort((a, b) => b.count - a.count || a.operator.localeCompare(b.operator));

  // Verification dates
  const verifiedDatesSet = new Set<string>();
  let allHaveValidDate = totalDocumented > 0;
  for (const s of mcsStations) {
    const d = s.truckCharging?.lastVerifiedAt;
    if (d && typeof d === 'string' && d.trim().length > 0) {
      verifiedDatesSet.add(d.trim());
    } else {
      allHaveValidDate = false;
    }
  }

  const lastVerifiedDates = Array.from(verifiedDatesSet).sort();
  // Fall A - Alle dokumentierten Standorte besitzen das exakt identische Prüfdatum:
  // Nur dann existiert ein legitimierter gemeinsamer Datenstand.
  // Fall B - Unterschiedliche oder unvollständige Prüfstände:
  // KEIN gemeinsames Datum (datasetLastVerifiedAt = null).
  let datasetLastVerifiedAt: string | null = null;
  let datasetDateFormatted: string | null = null;
  let verificationDateRangeFormatted: string | null = null;

  if (allHaveValidDate && lastVerifiedDates.length === 1) {
    const singleDate = lastVerifiedDates[0];
    datasetLastVerifiedAt = singleDate;
    datasetDateFormatted = formatIsoGermanDate(singleDate);
  } else if (lastVerifiedDates.length > 1) {
    const earliest = formatIsoGermanDate(lastVerifiedDates[0]);
    const latest = formatIsoGermanDate(lastVerifiedDates[lastVerifiedDates.length - 1]);
    verificationDateRangeFormatted = `Prüfstände: ${earliest} bis ${latest}`;
  }

  return {
    totalDocumented,
    mcsOperational,
    mcsPlanned,
    operationalSharePercent,
    operationalMcsPowerMin,
    operationalMcsPowerMax,
    operationalMcsPowerAverage,
    operationalMcsPowerMedian,
    operationalMcsWithPowerCount,
    ccsPowerValues: ccsPowers,
    allDocumentedHave400KwCcs,
    ccsOperationalCount,
    driveThroughCount,
    trailerAccessibleCount,
    allDriveThrough,
    allTrailerAccessible,
    operatorDistribution,
    lastVerifiedDates,
    datasetLastVerifiedAt,
    datasetDateFormatted,
    verificationDateRangeFormatted
  };
}
