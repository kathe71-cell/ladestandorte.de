import cpoData from '../data/generated/cpo-monitor.generated.json';
import citiesData from '../data/generated/cities.generated.json';

/**
 * Returns the central snapshot date formatted as DD.MM.YYYY (e.g. "01.10.2026")
 * Dynamically read from the latest BNetzA pipeline snapshot generated artifacts.
 */
export function getSnapshotDateFormatted(): string {
  if (cpoData?.snapshotDate && typeof cpoData.snapshotDate === 'string') {
    const parts = cpoData.snapshotDate.split('-');
    if (parts.length === 3) {
      return `${parts[2]}.${parts[1]}.${parts[0]}`;
    }
  }

  const firstCity = citiesData?.[0];
  if (firstCity?.bnetza?.provenance?.retrievedAt) {
    return new Date(firstCity.bnetza.provenance.retrievedAt).toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  return '01.10.2026';
}

/**
 * Returns the raw ISO date string of the current dataset (e.g. "2026-10-01")
 */
export function getSnapshotDateIso(): string {
  return cpoData?.snapshotDate || '2026-10-01';
}
