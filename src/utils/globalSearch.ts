import { SearchDoc, SearchMatch, SearchResultsGrouped, SearchCategory } from '../types/search';

let cachedIndex: SearchDoc[] | null = null;
let fetchPromise: Promise<SearchDoc[]> | null = null;

/**
 * Loads search index lazily from /search-index.json.
 * Uses in-memory cache after first successful load.
 */
export async function loadSearchIndex(): Promise<SearchDoc[]> {
  if (cachedIndex) return cachedIndex;

  if (fetchPromise) return fetchPromise;

  fetchPromise = (async () => {
    try {
      const res = await fetch('/search-index.json');
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data: SearchDoc[] = await res.json();
      cachedIndex = data;
      return data;
    } catch (err) {
      console.warn('Failed to load search-index.json, falling back to empty index:', err);
      return [];
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

/**
 * Sets search index synchronously (useful for testing or SSR fallback)
 */
export function setPreloadedSearchIndex(docs: SearchDoc[]) {
  cachedIndex = docs;
}

/**
 * Normalizes input string: lowercase, trims, removes excess spaces,
 * strips umlauts or treats them consistently.
 */
export function normalizeSearchTerm(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[ß]/g, 'ss')
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue');
}

/**
 * Standard token clean without transliteration for exact token matches
 */
function clean(str?: string): string {
  if (!str) return '';
  return str.toLowerCase().trim();
}

/**
 * Executes high-speed ranking search over the search documents.
 * 
 * Ranking Logic:
 * 1. Exact Name / Title Match (score: 1000+)
 * 2. Exact City / Motorway / Operator Match (score: 800+)
 * 3. Prefix Match on Name / Title / Motorway / City (score: 600+)
 * 4. Word boundary match on Title / City / Motorway (score: 400+)
 * 5. Keyword or Fulltext Match (score: 200+)
 * 
 * Includes high-priority bonuses (e.g. Motorway A3 for query 'a3' or '3').
 */
export function searchEntities(
  docs: SearchDoc[],
  query: string,
  limitPerCategory: number = 5
): SearchResultsGrouped[] {
  const rawQ = query.trim();
  if (!rawQ) return [];

  const q = rawQ.toLowerCase();
  const qNorm = normalizeSearchTerm(rawQ);
  const qTokens = q.split(/[\s,/-]+/).filter(Boolean);
  const qNormTokens = qNorm.split(/[\s,/-]+/).filter(Boolean);

  // Check if query is looking for an autobahn like "a3", "bab 3", "3"
  const babMatch = q.match(/^(?:bab\s*|a\s*)?(\d{1,3})$/i);
  const targetBabNum = babMatch ? babMatch[1] : null;

  const matches: SearchMatch[] = [];

  for (let i = 0; i < docs.length; i++) {
    const doc = docs[i];

    const titleLower = clean(doc.title);
    const titleNorm = normalizeSearchTerm(doc.title);
    const nameLower = clean(doc.name);
    const nameNorm = normalizeSearchTerm(doc.name);
    const cityLower = clean(doc.city);
    const cityNorm = doc.city ? normalizeSearchTerm(doc.city) : '';
    const operatorLower = clean(doc.operator);
    const opNorm = doc.operator ? normalizeSearchTerm(doc.operator) : '';
    const motorwayLower = clean(doc.motorway);
    const streetLower = clean(doc.street);
    const plzLower = clean(doc.plz);

    let score = 0;
    let matchType: 'exact' | 'prefix' | 'word' | 'fulltext' = 'fulltext';

    // Special Autobahn boost: exact match like "A3" or "3"
    if (targetBabNum && doc.category === 'motorways') {
      const docBabNum = doc.name.replace(/[^0-9]/g, '');
      if (docBabNum === targetBabNum) {
        score += 1500;
        matchType = 'exact';
      }
    }

    // 1. Exact Name / Title Match
    if (nameLower === q || titleLower === q || nameNorm === qNorm || titleNorm === qNorm) {
      score += 1200;
      matchType = 'exact';
    } else if (
      (doc.motorway && (motorwayLower === q || motorwayLower === `a${targetBabNum}`)) ||
      (doc.city && (cityLower === q || cityNorm === qNorm)) ||
      (doc.operator && (operatorLower === q || opNorm === qNorm))
    ) {
      // 2. Exact City / Motorway / Operator Match
      score += 900;
      matchType = 'exact';
    } else if (nameLower.startsWith(q) || nameNorm.startsWith(qNorm) || titleLower.startsWith(q)) {
      // 3. Prefix Match
      score += 650;
      matchType = 'prefix';
    } else if (
      (doc.city && (cityLower.startsWith(q) || cityNorm.startsWith(qNorm))) ||
      (doc.operator && (operatorLower.startsWith(q) || opNorm.startsWith(qNorm))) ||
      (doc.motorway && motorwayLower.startsWith(q))
    ) {
      score += 550;
      matchType = 'prefix';
    } else {
      // 4. Word boundary & Token matching
      let allTokensFound = true;
      let tokenBonus = 0;

      for (let t = 0; t < qTokens.length; t++) {
        const token = qTokens[t];
        const tokenNorm = qNormTokens[t];

        const inName = nameLower.includes(token) || nameNorm.includes(tokenNorm);
        const inTitle = titleLower.includes(token) || titleNorm.includes(tokenNorm);
        const inCity = cityLower.includes(token) || cityNorm.includes(tokenNorm);
        const inOperator = operatorLower.includes(token) || opNorm.includes(tokenNorm);
        const inPlz = plzLower.includes(token);
        const inStreet = streetLower.includes(token);
        const inMotorway = motorwayLower.includes(token);
        const inConnectors = doc.connectors ? doc.connectors.includes(token) : false;
        const inKeywords = doc.keywords ? doc.keywords.some(k => k.includes(token) || normalizeSearchTerm(k).includes(tokenNorm)) : false;

        if (inName || inTitle) {
          tokenBonus += 150;
        } else if (inCity || inMotorway || inOperator) {
          tokenBonus += 100;
        } else if (inPlz || inStreet || inConnectors || inKeywords) {
          tokenBonus += 60;
        } else {
          allTokensFound = false;
          break;
        }
      }

      if (allTokensFound) {
        score += 300 + tokenBonus;
        matchType = tokenBonus >= 150 ? 'word' : 'fulltext';
      }
    }

    if (score > 0) {
      // Add entity priority weight (0-100) to break ties
      score += doc.priority;
      matches.push({ doc, score, matchType });
    }
  }

  // Sort descending by score
  matches.sort((a, b) => b.score - a.score);

  // Group into defined order
  const categoryOrder: SearchCategory[] = [
    'motorways',
    'cities',
    'stations',
    'mcs',
    'operators',
    'tools',
    'knowledge'
  ];

  const categoryLabels: Record<SearchCategory, string> = {
    motorways: 'Autobahnen',
    cities: 'Städte',
    stations: 'Ladestandorte',
    mcs: 'MCS & Lkw',
    operators: 'Betreiber (CPOs)',
    tools: 'Tools & Rechner',
    knowledge: 'Wissen & Ratgeber'
  };

  const groups: Record<SearchCategory, SearchMatch[]> = {
    motorways: [],
    cities: [],
    stations: [],
    mcs: [],
    operators: [],
    tools: [],
    knowledge: []
  };

  for (const m of matches) {
    if (groups[m.doc.category].length < limitPerCategory) {
      groups[m.doc.category].push(m);
    }
  }

  // Format grouped results, filtering out empty categories
  const result: SearchResultsGrouped[] = [];
  for (const cat of categoryOrder) {
    if (groups[cat].length > 0) {
      result.push({
        category: cat,
        categoryLabel: categoryLabels[cat],
        items: groups[cat]
      });
    }
  }

  return result;
}
