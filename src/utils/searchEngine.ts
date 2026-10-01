import { STATIONS_DATA, StationData } from '../data/stations';
import { CITIES_DATA, CityData } from '../data/cities';
import { MOTORWAYS_DATA, MotorwayData } from '../data/motorways';
import { OPERATORS_DATA, OperatorData } from '../data/operators';

export interface SearchResultItem {
  type: 'station' | 'city' | 'motorway' | 'operator';
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  url: string;
  data: StationData | CityData | MotorwayData | OperatorData;
  score: number;
}

export interface SearchFilters {
  hpcOnly?: boolean;
  coveredOnly?: boolean;
  wcGastroOnly?: boolean;
  afirOnly?: boolean;
  autoChargeOnly?: boolean;
  operatorSlug?: string;
  connectorType?: string;
  motorwaySlug?: string;
}

// Pre-compiled search index for sub-millisecond lookups
interface SearchIndexEntry {
  tokens: string[];
  item: SearchResultItem;
}

let searchIndex: SearchIndexEntry[] | null = null;

export function buildSearchIndex(): SearchIndexEntry[] {
  if (searchIndex) return searchIndex;

  const entries: SearchIndexEntry[] = [];

  // Index Cities
  for (const city of CITIES_DATA) {
    const rawText = `${city.name} ${city.bundesland} ${city.plzs.join(' ')} ${city.topBetreiber.join(' ')} stadt grossstadt`;
    const tokens = rawText.toLowerCase().split(/\s+/).filter(Boolean);
    entries.push({
      tokens,
      item: {
        type: 'city',
        id: `city-${city.slug}`,
        title: `${city.name} (${city.bundesland})`,
        subtitle: `${city.ladepunkteGesamt.toLocaleString('de-DE')} Ladepunkte · ${city.hpcLadepunkte} HPC-Lader · Top: ${city.topBetreiber.slice(0, 2).join(', ')}`,
        badge: `${city.ladepunkteGesamt} Ladepunkte`,
        url: `/staedte/${city.slug}`,
        data: city,
        score: 100
      }
    });
  }

  // Index Motorways
  for (const mw of MOTORWAYS_DATA) {
    const rawText = `${mw.name} autobahn bab a ${mw.route} ${mw.mainCPOs.join(' ')}`;
    const tokens = rawText.toLowerCase().split(/[\s–,-]+/).filter(Boolean);
    entries.push({
      tokens,
      item: {
        type: 'motorway',
        id: `mw-${mw.slug}`,
        title: `Bundesautobahn ${mw.name}`,
        subtitle: `${mw.route} · ${mw.lengthKm} km · bis ${mw.maxKw} kW HPC`,
        badge: `bis ${mw.maxKw} kW`,
        url: `/autobahnen/${mw.slug}`,
        data: mw,
        score: 90
      }
    });
  }

  // Index Operators
  for (const op of OPERATORS_DATA) {
    const rawText = `${op.name} ${op.headquarters} ${op.features.join(' ')} cpo betreiber ladeanbieter`;
    const tokens = rawText.toLowerCase().split(/\s+/).filter(Boolean);
    entries.push({
      tokens,
      item: {
        type: 'operator',
        id: `op-${op.slug}`,
        title: `${op.name} (Ladeinfrastruktur)`,
        subtitle: `${op.totalPointsDE.toLocaleString('de-DE')} Ladepunkte · bis ${op.maxKw} kW · ${op.bnetzaAnteil}`,
        badge: `${op.maxKw} kW HPC`,
        url: `/betreiber/${op.slug}`,
        data: op,
        score: 85
      }
    });
  }

  // Index Verifizierte Ladestationen
  for (const st of STATIONS_DATA) {
    const rawText = `${st.name} ${st.street} ${st.plz} ${st.city} ${st.operator} ${st.motorway || ''} ${st.connectorTypes.join(' ')} ladesaeule ladestation`;
    const tokens = rawText.toLowerCase().split(/\s+/).filter(Boolean);
    entries.push({
      tokens,
      item: {
        type: 'station',
        id: st.id,
        title: st.name,
        subtitle: `${st.street}, ${st.plz} ${st.city} · ${st.operator} · ${st.pointsCount} Ladepunkte`,
        badge: `${st.kwMax} kW ${st.isHpc ? 'HPC' : 'AC'}`,
        url: `/suche?station=${st.id}`,
        data: st,
        score: 70
      }
    });
  }

  searchIndex = entries;
  return entries;
}

/**
 * Ultra-fast client-side search query executor (< 5 milliseconds execution time)
 */
export function instantSearch(query: string, filters: SearchFilters = {}, limit: number = 25): { results: SearchResultItem[]; durationMs: number } {
  const startTime = performance.now();
  const index = buildSearchIndex();
  const cleanQuery = query.trim().toLowerCase();

  if (!cleanQuery && !filters.hpcOnly && !filters.operatorSlug && !filters.connectorType && !filters.motorwaySlug) {
    return {
      results: index.slice(0, limit).map(e => e.item),
      durationMs: Number((performance.now() - startTime).toFixed(2))
    };
  }

  const queryTerms = cleanQuery ? cleanQuery.split(/\s+/).filter(Boolean) : [];

  const matched: { item: SearchResultItem; matchScore: number }[] = [];

  for (let i = 0; i < index.length; i++) {
    const entry = index[i];
    const { item, tokens } = entry;

    // Filter checks
    if (filters.hpcOnly) {
      if (item.type === 'station') {
        const st = item.data as StationData;
        if (!st.isHpc || st.kwMax < 150) continue;
      }
    }

    if (filters.coveredOnly) {
      if (item.type === 'station') {
        const st = item.data as StationData;
        if (!st.isCovered) continue;
      }
    }

    if (filters.wcGastroOnly) {
      if (item.type === 'station') {
        const st = item.data as StationData;
        if (!st.hasRestrooms && !st.hasDining) continue;
      }
    }

    if (filters.afirOnly) {
      if (item.type === 'station') {
        const st = item.data as StationData;
        if (!st.hasAfirTerminal) continue;
      }
    }

    if (filters.autoChargeOnly) {
      if (item.type === 'station') {
        const st = item.data as StationData;
        if (!st.hasAutoCharge) continue;
      }
    }

    if (filters.operatorSlug) {
      if (item.type === 'station') {
        const st = item.data as StationData;
        if (st.operatorSlug !== filters.operatorSlug) continue;
      } else if (item.type === 'operator') {
        const op = item.data as OperatorData;
        if (op.slug !== filters.operatorSlug) continue;
      }
    }

    if (filters.connectorType) {
      if (item.type === 'station') {
        const st = item.data as StationData;
        if (!st.connectorTypes.includes(filters.connectorType)) continue;
      }
    }

    if (filters.motorwaySlug) {
      if (item.type === 'station') {
        const st = item.data as StationData;
        if (st.motorway !== filters.motorwaySlug) continue;
      } else if (item.type === 'motorway') {
        const mw = item.data as MotorwayData;
        if (mw.slug !== filters.motorwaySlug) continue;
      }
    }

    if (queryTerms.length === 0) {
      matched.push({ item, matchScore: item.score });
      continue;
    }

    // Token matching
    let allMatched = true;
    let extraScore = 0;

    for (const term of queryTerms) {
      let termMatched = false;

      // Exact or prefix match on title
      const titleLower = item.title.toLowerCase();
      if (titleLower.includes(term)) {
        termMatched = true;
        extraScore += titleLower.startsWith(term) ? 40 : 20;
      }

      // Check tokens
      if (!termMatched) {
        for (let t = 0; t < tokens.length; t++) {
          if (tokens[t].startsWith(term)) {
            termMatched = true;
            extraScore += 15;
            break;
          } else if (tokens[t].includes(term)) {
            termMatched = true;
            extraScore += 5;
            break;
          }
        }
      }

      if (!termMatched) {
        allMatched = false;
        break;
      }
    }

    if (allMatched) {
      matched.push({ item, matchScore: item.score + extraScore });
    }
  }

  // Sort descending by calculated match score
  matched.sort((a, b) => b.matchScore - a.matchScore);

  const results = matched.slice(0, limit).map(m => m.item);
  const durationMs = Number((performance.now() - startTime).toFixed(2));

  return { results, durationMs };
}
