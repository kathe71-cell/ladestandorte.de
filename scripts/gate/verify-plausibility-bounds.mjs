/**
 * scripts/gate/verify-plausibility-bounds.mjs
 * Plausibility & Sanity Bounds Validator for monthly BNetzA snapshots.
 *
 * Implements configurable statistical guards:
 * - Warns (REVIEW_REQUIRED) on unusual drop or spike in nationwide / city / operator totals
 * - Hard fails (FAIL) on mathematical contradictions (e.g. HPC points > total points, negative counts)
 * - Assigns normalized warning codes for explicit, auditable sign-offs
 * - Strictly distinguishes between BASELINE_ESTABLISHED and COMPARISON_ACTIVE
 */

export const DEFAULT_THRESHOLDS = {
  // Nationwide delta bounds
  minNationwidePointsDeltaPct: -0.5,
  maxNationwidePointsDeltaPct: 10.0,
  minNationwideHpcDeltaPct: -0.5,
  maxNationwideHpcDeltaPct: 15.0,
  minNationwideStationsDeltaPct: -0.5,
  maxNationwideStationsDeltaPct: 10.0,

  // Institutional operator bounds
  maxOperatorPointsDropPct: -1.5, // e.g. EnBW or Tesla losing > 1.5% points suggests regex / mapping breakage

  // City level bounds
  maxCityPointsDropPct: -2.0 // e.g. Berlin losing > 2.0% points suggests AGS filtering anomaly
};

/**
 * Computes safe percentage delta between two numbers.
 */
export function computeDeltaPct(prev, curr) {
  if (typeof prev !== 'number' || typeof curr !== 'number' || prev <= 0) {
    return 0;
  }
  return Number((((curr - prev) / prev) * 100).toFixed(2));
}

/**
 * Validates plausibility of current snapshot against baseline/previous.
 * @param {object} currentData - { totalPoints, totalHpc, totalStations, operators: [...], cities: [...] }
 * @param {object|null} previousData - Previous snapshot object or null if baseline
 * @param {object} [customThresholds]
 * @returns {{ status: 'PASS' | 'REVIEW_REQUIRED' | 'FAIL', failures: string[], warnings: string[], warningCodes: string[], baselineStatus: string, deltas: object }}
 */
export function verifyPlausibilityBounds(currentData, previousData = null, customThresholds = {}) {
  const cfg = { ...DEFAULT_THRESHOLDS, ...customThresholds };
  const failures = [];
  const warnings = [];
  const warningCodes = [];
  const deltas = {
    nationwide: {},
    operators: [],
    cities: []
  };

  let baselineStatus = previousData ? 'COMPARISON_ACTIVE' : 'BASELINE_ESTABLISHED';

  // 1. Hard Invariant Checks (FAIL if violated)
  if (!currentData) {
    failures.push('Current snapshot data is null or empty.');
    return { status: 'FAIL', failures, warnings, warningCodes, baselineStatus, deltas };
  }

  if (currentData.totalPoints <= 0 || currentData.totalHpc <= 0 || currentData.totalStations <= 0) {
    failures.push(`Non-positive nationwide totals: points=${currentData.totalPoints}, hpc=${currentData.totalHpc}, stations=${currentData.totalStations}`);
  }

  if (currentData.totalHpc > currentData.totalPoints) {
    failures.push(`Mathematical contradiction: HPC points (${currentData.totalHpc}) > Total points (${currentData.totalPoints})`);
  }

  // City invariants
  if (Array.isArray(currentData.cities)) {
    for (const c of currentData.cities) {
      if (c.chargingPointsTotal < 0 || c.chargingPoints150PlusKw < 0) {
        failures.push(`City ${c.slug || c.name} contains negative numbers.`);
      }
      if (c.chargingPoints150PlusKw > c.chargingPointsTotal) {
        failures.push(`City ${c.slug || c.name} has HPC points (${c.chargingPoints150PlusKw}) > Total points (${c.chargingPointsTotal})`);
      }
    }
  }

  // Operator invariants
  if (Array.isArray(currentData.operators)) {
    for (const op of currentData.operators) {
      if (op.chargingPointsTotal < 0 || op.chargingPoints150PlusKw < 0) {
        failures.push(`Operator ${op.slug || op.name} contains negative numbers.`);
      }
      if (op.chargingPoints150PlusKw > op.chargingPointsTotal) {
        failures.push(`Operator ${op.slug || op.name} has HPC points (${op.chargingPoints150PlusKw}) > Total points (${op.chargingPointsTotal})`);
      }
    }
  }

  if (failures.length > 0) {
    return { status: 'FAIL', failures, warnings, warningCodes, baselineStatus, deltas };
  }

  // 2. Statistical Plausibility Checks (REVIEW_REQUIRED if violated)
  if (previousData) {
    // Check comparability
    if (previousData.totalPoints <= 0 || previousData.totalHpc <= 0) {
      warnings.push('Previous comparison snapshot contains incomplete or non-positive totals. Historical comparison marked non-comparable.');
      warningCodes.push('WARN_INCOMPARABLE_BASELINE');
      return { status: 'REVIEW_REQUIRED', failures, warnings, warningCodes, baselineStatus: 'INCOMPARABLE_BASELINE', deltas };
    }

    // Nationwide checks
    const ptsDelta = computeDeltaPct(previousData.totalPoints, currentData.totalPoints);
    const hpcDelta = computeDeltaPct(previousData.totalHpc, currentData.totalHpc);
    const stDelta = computeDeltaPct(previousData.totalStations, currentData.totalStations);

    deltas.nationwide = {
      points: { prev: previousData.totalPoints, curr: currentData.totalPoints, deltaPct: ptsDelta },
      hpc: { prev: previousData.totalHpc, curr: currentData.totalHpc, deltaPct: hpcDelta },
      stations: { prev: previousData.totalStations, curr: currentData.totalStations, deltaPct: stDelta }
    };

    if (ptsDelta < cfg.minNationwidePointsDeltaPct) {
      warnings.push(`Nationwide charging points dropped by ${ptsDelta}% (threshold: ${cfg.minNationwidePointsDeltaPct}%) [prev=${previousData.totalPoints}, curr=${currentData.totalPoints}]`);
      warningCodes.push('WARN_NATIONWIDE_POINTS_DROP');
    } else if (ptsDelta > cfg.maxNationwidePointsDeltaPct) {
      warnings.push(`Nationwide charging points grew by unusual ${ptsDelta}% (threshold: ${cfg.maxNationwidePointsDeltaPct}%) [prev=${previousData.totalPoints}, curr=${currentData.totalPoints}]`);
      warningCodes.push('WARN_NATIONWIDE_POINTS_SPIKE');
    }

    if (hpcDelta < cfg.minNationwideHpcDeltaPct) {
      warnings.push(`Nationwide HPC points dropped by ${hpcDelta}% (threshold: ${cfg.minNationwideHpcDeltaPct}%) [prev=${previousData.totalHpc}, curr=${currentData.totalHpc}]`);
      warningCodes.push('WARN_NATIONWIDE_HPC_DROP');
    } else if (hpcDelta > cfg.maxNationwideHpcDeltaPct) {
      warnings.push(`Nationwide HPC points grew by unusual ${hpcDelta}% (threshold: ${cfg.maxNationwideHpcDeltaPct}%) [prev=${previousData.totalHpc}, curr=${currentData.totalHpc}]`);
      warningCodes.push('WARN_NATIONWIDE_HPC_SPIKE');
    }

    if (stDelta < cfg.minNationwideStationsDeltaPct) {
      warnings.push(`Nationwide stations dropped by ${stDelta}% (threshold: ${cfg.minNationwideStationsDeltaPct}%) [prev=${previousData.totalStations}, curr=${currentData.totalStations}]`);
      warningCodes.push('WARN_NATIONWIDE_STATIONS_DROP');
    } else if (stDelta > cfg.maxNationwideStationsDeltaPct) {
      warnings.push(`Nationwide stations grew by unusual ${stDelta}% (threshold: ${cfg.maxNationwideStationsDeltaPct}%) [prev=${previousData.totalStations}, curr=${currentData.totalStations}]`);
      warningCodes.push('WARN_NATIONWIDE_STATIONS_SPIKE');
    }

    // Top Operator Checks
    if (Array.isArray(currentData.operators) && Array.isArray(previousData.operators)) {
      const topKeys = ['enbw', 'tesla', 'aral-pulse', 'ewe-go', 'shell-recharge', 'allego', 'ionity'];
      for (const opKey of topKeys) {
        const currOp = currentData.operators.find(o => o.slug === opKey || o.id === opKey);
        const prevOp = previousData.operators.find(o => o.slug === opKey || o.id === opKey);

        if (currOp && prevOp && prevOp.chargingPointsTotal > 0) {
          const opDelta = computeDeltaPct(prevOp.chargingPointsTotal, currOp.chargingPointsTotal);
          deltas.operators.push({
            slug: opKey,
            prev: prevOp.chargingPointsTotal,
            curr: currOp.chargingPointsTotal,
            deltaPct: opDelta
          });

          if (opDelta < cfg.maxOperatorPointsDropPct) {
            warnings.push(`Operator "${currOp.name || opKey}" points dropped by ${opDelta}% (threshold: ${cfg.maxOperatorPointsDropPct}%) [prev=${prevOp.chargingPointsTotal}, curr=${currOp.chargingPointsTotal}]`);
            warningCodes.push(`WARN_OPERATOR_DROP_${opKey}`);
          }
        }
      }
    }

    // 50 Cities Checks
    if (Array.isArray(currentData.cities) && Array.isArray(previousData.cities)) {
      for (const currCity of currentData.cities) {
        const prevCity = previousData.cities.find(c => c.slug === currCity.slug);
        if (prevCity && prevCity.chargingPointsTotal > 0) {
          const cityDelta = computeDeltaPct(prevCity.chargingPointsTotal, currCity.chargingPointsTotal);
          if (cityDelta < cfg.maxCityPointsDropPct) {
            deltas.cities.push({
              slug: currCity.slug,
              name: currCity.name,
              prev: prevCity.chargingPointsTotal,
              curr: currCity.chargingPointsTotal,
              deltaPct: cityDelta
            });
            warnings.push(`City "${currCity.name}" points dropped by ${cityDelta}% (threshold: ${cfg.maxCityPointsDropPct}%) [prev=${prevCity.chargingPointsTotal}, curr=${currCity.chargingPointsTotal}]`);
            warningCodes.push(`WARN_CITY_DROP_${currCity.slug}`);
          }
        }
      }
    }
  }

  return {
    status: warnings.length > 0 ? 'REVIEW_REQUIRED' : 'PASS',
    failures: [],
    warnings,
    warningCodes,
    baselineStatus,
    deltas
  };
}
