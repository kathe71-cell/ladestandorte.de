import { STATIONS_DATA, StationData } from '../data/stations';
import { CITIES_DATA, CityData } from '../data/cities';
import { MOTORWAYS_DATA, MotorwayData } from '../data/motorways';
import { OPERATORS_DATA, OperatorData } from '../data/operators';

export interface BnetzaSearchStation {
  i: string;       // id
  cs: string;      // citySlug
  o: string;       // cpo
  s: string;       // street + houseNumber
  p: string;       // plz
  c: string;       // city
  k: number;       // maxKw
  n: number;       // pointsCount
  h: number;       // hpcPointsCount
  d: string | null;// dossierId
}

export type SearchResultType = 'dossier' | 'bnetza' | 'city' | 'motorway' | 'operator';

export interface SearchResultItem {
  type: SearchResultType;
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  url: string;
  data: StationData | CityData | MotorwayData | OperatorData | BnetzaSearchStation;
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

interface SearchIndexEntry {
  tokens: string[];
  item: SearchResultItem;
}

let primarySearchIndex: SearchIndexEntry[] | null = null;
let bnetzaRegistryIndex: BnetzaSearchStation[] | null = null;
let isFetchingRegistry = false;

/**
 * Builds primary fast in-memory search index for high-priority entities:
 * Cities, Motorways, Operators, Curated Dossiers.
 */
export function buildSearchIndex(): SearchIndexEntry[] {
  if (primarySearchIndex) return primarySearchIndex;

  const entries: SearchIndexEntry[] = [];

  // 1. Index Cities
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

  // 2. Index Motorways
  for (const mw of MOTORWAYS_DATA) {
    const rawText = `${mw.name} autobahn bab a ${mw.route} ${mw.mainCPOs.join(' ')}`;
    const tokens = rawText.toLowerCase().split(/[\s–,-]+/).filter(Boolean);
    entries.push({
      tokens,
      item: {
        type: 'motorway',
        id: `mw-${mw.slug}`,
        title: `Bundesautobahn ${mw.name}`,
        subtitle: `${mw.route} · ${mw.lengthKm} km · ${mw.maxKw ? `bis ${mw.maxKw} kW HPC` : 'Korridor in Prüfung'}`,
        badge: mw.maxKw ? `bis ${mw.maxKw} kW` : 'Autobahn',
        url: `/autobahnen/${mw.slug}`,
        data: mw,
        score: 90
      }
    });
  }

  // 3. Index Operators
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

  // 4. Index Redaktionelle Dossiers
  for (const st of STATIONS_DATA) {
    const rawText = `${st.name} ${st.street} ${st.plz} ${st.city} ${st.operator} ${st.motorway || ''} ${st.connectorTypes.join(' ')} ladepark ladesaeule ladestation dossier`;
    const tokens = rawText.toLowerCase().split(/\s+/).filter(Boolean);
    entries.push({
      tokens,
      item: {
        type: 'dossier',
        id: st.id,
        title: st.name,
        subtitle: `${st.street}, ${st.plz} ${st.city} · ${st.operator} · ${st.pointsCount} Ladepunkte`,
        badge: `${st.kwMax} kW ${st.isHpc ? 'HPC' : 'AC'}`,
        url: `/suche?station=${st.id}`,
        data: st,
        score: 80
      }
    });
  }

  primarySearchIndex = entries;
  return entries;
}

/**
 * Lazy loads the full BNetzA registry search index in the background on client.
 */
export function ensureRegistryLoaded() {
  if (bnetzaRegistryIndex || isFetchingRegistry || typeof window === 'undefined') return;
  isFetchingRegistry = true;

  fetch('/data/registry-search-index.json')
    .then(res => {
      if (!res.ok) throw new Error('Registry index not found');
      return res.json();
    })
    .then((data: BnetzaSearchStation[]) => {
      bnetzaRegistryIndex = data;
      isFetchingRegistry = false;
    })
    .catch(() => {
      isFetchingRegistry = false;
    });
}

/**
 * Searches the full BNetzA registry index.
 * Deduplication: Omits BNetzA station if it has a linked curated dossier (dossier preferred).
 */
function searchBnetzaRegistry(
  terms: string[],
  filters: SearchFilters,
  limit: number
): SearchResultItem[] {
  if (!bnetzaRegistryIndex || terms.length === 0) return [];

  const results: SearchResultItem[] = [];

  for (let i = 0; i < bnetzaRegistryIndex.length; i++) {
    const st = bnetzaRegistryIndex[i];

    // Filter checks
    if (filters.hpcOnly && st.h < 1 && st.k < 150) continue;

    // Deduplication: if station belongs to an existing curated dossier, omit duplicate register card
    if (st.d) continue;

    const searchableText = `${st.o} ${st.s} ${st.p} ${st.c} ${st.i}`.toLowerCase();

    let allMatch = true;
    for (let t = 0; t < terms.length; t++) {
      if (!searchableText.includes(terms[t])) {
        allMatch = false;
        break;
      }
    }

    if (allMatch) {
      const isHpc = st.k >= 150;
      results.push({
        type: 'bnetza',
        id: `bnetza-${st.i}`,
        title: `${st.o} · ${st.s || st.c}`,
        subtitle: `${st.p} ${st.c} · ID: ${st.i} · ${st.n} ${st.n === 1 ? 'Ladepunkt' : 'Ladepunkte'}`,
        badge: `${st.k} kW ${isHpc ? 'HPC' : 'AC'}`,
        url: `/ladestation-register/${st.cs}/${st.i}`,
        data: st,
        score: isHpc ? 65 : 50
      });

      if (results.length >= limit) break;
    }
  }

  return results;
}

/**
 * Fast search combining Curated Entities + BNetzA Registry Stations with zero duplicates.
 */
export function instantSearch(
  query: string,
  filters: SearchFilters = {},
  limit: number = 30
): { results: SearchResultItem[]; durationMs: number } {
  const startTime = performance.now();
  const primaryIndex = buildSearchIndex();
  const cleanQuery = query.trim().toLowerCase();

  // Trigger lazy loading of registry when user interacts
  if (typeof window !== 'undefined') {
    ensureRegistryLoaded();
  }

  if (!cleanQuery && !filters.hpcOnly && !filters.operatorSlug && !filters.connectorType && !filters.motorwaySlug) {
    return {
      results: primaryIndex.slice(0, limit).map(e => e.item),
      durationMs: Number((performance.now() - startTime).toFixed(2))
    };
  }

  const queryTerms = cleanQuery ? cleanQuery.split(/\s+/).filter(Boolean) : [];
  const matched: { item: SearchResultItem; matchScore: number }[] = [];

  for (let i = 0; i < primaryIndex.length; i++) {
    const entry = primaryIndex[i];
    const { item, tokens } = entry;

    // Filter checks
    if (filters.hpcOnly) {
      if (item.type === 'dossier') {
        const st = item.data as StationData;
        if (!st.isHpc || st.kwMax < 150) continue;
      }
    }

    if (filters.coveredOnly) {
      if (item.type === 'dossier') {
        const st = item.data as StationData;
        if (!st.isCovered) continue;
      }
    }

    if (filters.wcGastroOnly) {
      if (item.type === 'dossier') {
        const st = item.data as StationData;
        if (!st.hasRestrooms && !st.hasDining) continue;
      }
    }

    if (filters.afirOnly) {
      if (item.type === 'dossier') {
        const st = item.data as StationData;
        if (!st.hasAfirTerminal) continue;
      }
    }

    if (filters.autoChargeOnly) {
      if (item.type === 'dossier') {
        const st = item.data as StationData;
        if (!st.hasAutoCharge) continue;
      }
    }

    if (filters.operatorSlug) {
      if (item.type === 'dossier') {
        const st = item.data as StationData;
        if (st.operatorSlug !== filters.operatorSlug) continue;
      } else if (item.type === 'operator') {
        const op = item.data as OperatorData;
        if (op.slug !== filters.operatorSlug) continue;
      }
    }

    if (filters.connectorType) {
      if (item.type === 'dossier') {
        const st = item.data as StationData;
        if (!st.connectorTypes.includes(filters.connectorType)) continue;
      }
    }

    if (filters.motorwaySlug) {
      if (item.type === 'dossier') {
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
      const titleLower = item.title.toLowerCase();
      if (titleLower.includes(term)) {
        termMatched = true;
        extraScore += titleLower.startsWith(term) ? 40 : 20;
      }

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

  // Also query BNetzA Register stations
  if (queryTerms.length > 0) {
    const registryResults = searchBnetzaRegistry(queryTerms, filters, 15);
    registryResults.forEach(item => {
      matched.push({ item, matchScore: item.score });
    });
  }

  // Sort descending by calculated match score
  matched.sort((a, b) => b.matchScore - a.matchScore);

  const results = matched.slice(0, limit).map(m => m.item);
  const durationMs = Number((performance.now() - startTime).toFixed(2));

  return { results, durationMs };
}
