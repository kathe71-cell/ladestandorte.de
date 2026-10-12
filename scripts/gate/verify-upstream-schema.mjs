/**
 * scripts/gate/verify-upstream-schema.mjs
 * Upstream Schema Validator for official BNetzA CSV files.
 *
 * Verifies:
 * - Presence of required columns
 * - Valid data types (numeric ratings, geospatial bounds)
 * - Mandatory non-null keys (station IDs, operator identifiers)
 * - Referential integrity (points map to valid stations)
 */

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';

export const REQUIRED_STATION_COLUMNS = [
  'ladestation_id',
  'betreiber',
  'ort',
  'plz',
  'breitengrad',
  'laengengrad',
  'ladestation_nennleistung',
  'anzahl_ladepunkte'
];

export const REQUIRED_POINT_COLUMNS = [
  'ladepunkt_id',
  'ladestation_id',
  'ladepunkt_nennleistung'
];

// Geospatial bounds for Germany (approx. latitude 47.0 to 55.2, longitude 5.5 to 15.5)
const GEO_LAT_MIN = 46.5;
const GEO_LAT_MAX = 55.5;
const GEO_LON_MIN = 5.0;
const GEO_LON_MAX = 16.0;

/**
 * Validates BNetzA CSV headers and data types.
 * @param {string} snapshotDir - Directory containing bnetza_api_ladestation000.csv & bnetza_api_ladepunkt000.csv
 * @param {object} [options] - Options (sampleLimit for rows check)
 * @returns {Promise<{ status: 'PASS' | 'FAIL', errors: string[], stats: object }>}
 */
export async function verifyUpstreamSchema(snapshotDir, options = {}) {
  const errors = [];
  const stats = {
    stationsChecked: 0,
    pointsChecked: 0,
    stationsFile: null,
    pointsFile: null
  };

  const sampleLimit = options.sampleLimit || 5000;

  const stationFile = path.join(snapshotDir, 'bnetza_api_ladestation000.csv');
  const pointFile = path.join(snapshotDir, 'bnetza_api_ladepunkt000.csv');

  stats.stationsFile = stationFile;
  stats.pointsFile = pointFile;

  if (!fs.existsSync(stationFile)) {
    errors.push(`Missing station CSV: ${stationFile}`);
  }
  if (!fs.existsSync(pointFile)) {
    errors.push(`Missing point CSV: ${pointFile}`);
  }

  if (errors.length > 0) {
    return { status: 'FAIL', errors, stats };
  }

  // 1. Validate Station CSV Headers & Sample Rows
  const stationIds = new Set();
  try {
    const stStream = fs.createReadStream(stationFile);
    const rlSt = readline.createInterface({ input: stStream, crlfDelay: Infinity });

    let headerSt = null;
    let colIndexMap = {};

    for await (const line of rlSt) {
      if (!headerSt) {
        headerSt = line.split(';').map(c => c.trim().toLowerCase());
        REQUIRED_STATION_COLUMNS.forEach(req => {
          const idx = headerSt.indexOf(req.toLowerCase());
          if (idx === -1) {
            errors.push(`Station CSV missing required column: "${req}"`);
          } else {
            colIndexMap[req] = idx;
          }
        });
        if (errors.length > 0) {
          rlSt.close();
          break;
        }
        continue;
      }

      const parts = line.split(';');
      const stId = parts[colIndexMap.ladestation_id]?.trim();

      if (!stId) {
        errors.push(`Station CSV contains row with missing ladestation_id at line ${stats.stationsChecked + 2}`);
      } else {
        stationIds.add(stId);
      }

      // Check data types on sample rows
      if (stats.stationsChecked < sampleLimit) {
        const latRaw = parts[colIndexMap.breitengrad]?.replace(',', '.')?.trim();
        const lonRaw = parts[colIndexMap.laengengrad]?.replace(',', '.')?.trim();
        const kwRaw = parts[colIndexMap.ladestation_nennleistung]?.replace(',', '.')?.trim();
        const pointsRaw = parts[colIndexMap.anzahl_ladepunkte]?.trim();

        if (latRaw && lonRaw) {
          const lat = parseFloat(latRaw);
          const lon = parseFloat(lonRaw);
          if (isNaN(lat) || isNaN(lon) || lat < GEO_LAT_MIN || lat > GEO_LAT_MAX || lon < GEO_LON_MIN || lon > GEO_LON_MAX) {
            errors.push(`Station ${stId} has invalid German coordinates: lat=${latRaw}, lon=${lonRaw}`);
          }
        }

        if (kwRaw) {
          const kw = parseFloat(kwRaw);
          if (isNaN(kw) || kw <= 0) {
            errors.push(`Station ${stId} has invalid power value: "${kwRaw}"`);
          }
        }

        if (pointsRaw) {
          const pts = parseInt(pointsRaw, 10);
          if (isNaN(pts) || pts <= 0) {
            errors.push(`Station ${stId} has invalid points count: "${pointsRaw}"`);
          }
        }
      }

      stats.stationsChecked++;
    }
  } catch (err) {
    errors.push(`Failed reading station CSV: ${err.message}`);
  }

  // 2. Validate Point CSV Headers & Referential Integrity
  try {
    const ptStream = fs.createReadStream(pointFile);
    const rlPt = readline.createInterface({ input: ptStream, crlfDelay: Infinity });

    let headerPt = null;
    let ptColMap = {};
    let orphanReferences = 0;

    for await (const line of rlPt) {
      if (!headerPt) {
        headerPt = line.split(';').map(c => c.trim().toLowerCase());
        REQUIRED_POINT_COLUMNS.forEach(req => {
          const idx = headerPt.indexOf(req.toLowerCase());
          if (idx === -1) {
            errors.push(`Point CSV missing required column: "${req}"`);
          } else {
            ptColMap[req] = idx;
          }
        });
        if (errors.length > 0) {
          rlPt.close();
          break;
        }
        continue;
      }

      const parts = line.split(';');
      const ptId = parts[ptColMap.ladepunkt_id]?.trim();
      const parentStId = parts[ptColMap.ladestation_id]?.trim();

      if (!ptId) {
        errors.push(`Point CSV contains row with missing ladepunkt_id at line ${stats.pointsChecked + 2}`);
      }

      // Referential check on sample
      if (stats.pointsChecked < sampleLimit) {
        if (!parentStId || !stationIds.has(parentStId)) {
          orphanReferences++;
          if (orphanReferences <= 3) {
            errors.push(`Point ${ptId} references unknown station_id "${parentStId}"`);
          }
        }

        const kwRaw = parts[ptColMap.ladepunkt_nennleistung]?.replace(',', '.')?.trim();
        if (kwRaw) {
          const kw = parseFloat(kwRaw);
          if (isNaN(kw) || kw < 0) {
            errors.push(`Point ${ptId} has invalid power rating: "${kwRaw}"`);
          }
        }
      }

      stats.pointsChecked++;
    }

    if (orphanReferences > 3) {
      errors.push(`Point CSV contains ${orphanReferences} orphan references to non-existent station IDs`);
    }
  } catch (err) {
    errors.push(`Failed reading point CSV: ${err.message}`);
  }

  return {
    status: errors.length === 0 ? 'PASS' : 'FAIL',
    errors,
    stats
  };
}

// Standalone CLI runner
if (process.argv[1] && process.argv[1].endsWith('verify-upstream-schema.mjs')) {
  const defaultDir = path.resolve(process.cwd(), 'data/raw/bnetza/2026-10-01');
  const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : defaultDir;

  console.log(`[Upstream Schema] Validating directory: ${targetDir}`);
  verifyUpstreamSchema(targetDir)
    .then(res => {
      if (res.status === 'PASS') {
        console.log(`✅ [PASS] Upstream schema verified successfully (${res.stats.stationsChecked} stations, ${res.stats.pointsChecked} points).`);
        process.exit(0);
      } else {
        console.error(`❌ [FAIL] Upstream schema check failed with ${res.errors.length} error(s):`);
        res.errors.forEach(e => console.error(`   - ${e}`));
        process.exit(1);
      }
    })
    .catch(err => {
      console.error('Fatal schema verification error:', err);
      process.exit(1);
    });
}
