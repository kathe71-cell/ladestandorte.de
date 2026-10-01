import { StationData } from '../data/stations';

/**
 * Calculates the great-circle distance between two points on the Earth's surface
 * using the Haversine formula (pure local calculation, 0 € API cost).
 * 
 * @param lat1 Latitude of point 1 in degrees
 * @param lon1 Longitude of point 1 in degrees
 * @param lat2 Latitude of point 2 in degrees
 * @param lon2 Longitude of point 2 in degrees
 * @returns Distance in kilometers rounded to 1 decimal place
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

export interface NearbyStationResult {
  station: StationData;
  distanceKm: number;
}

/**
 * Finds up to maxResults geographically closest charging locations for a given station.
 * 
 * @param currentStation The origin charging station
 * @param allStations Array of all available stations
 * @param maxResults Maximum number of nearby stations to return (default: 5)
 * @param maxRadiusKm Maximum search radius in kilometers (default: 85 km)
 */
export function getNearbyStations(
  currentStation: StationData,
  allStations: StationData[],
  maxResults = 5,
  maxRadiusKm = 85
): NearbyStationResult[] {
  if (!currentStation.lat || !currentStation.lng) {
    return [];
  }

  return allStations
    .filter(s => s.id !== currentStation.id && s.lat && s.lng)
    .map(s => ({
      station: s,
      distanceKm: calculateDistanceKm(currentStation.lat, currentStation.lng, s.lat, s.lng)
    }))
    .filter(item => item.distanceKm <= maxRadiusKm)
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, maxResults);
}
