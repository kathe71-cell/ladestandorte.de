export type SearchCategory = 
  | 'stations' 
  | 'motorways' 
  | 'cities' 
  | 'operators' 
  | 'mcs' 
  | 'tools' 
  | 'knowledge';

export interface SearchDoc {
  id: string;
  category: SearchCategory;
  categoryLabel: string;
  title: string;
  subtitle: string;
  badge?: string;
  url: string;
  // Normalized searchable text fields
  name: string;
  city?: string;
  plz?: string;
  street?: string;
  operator?: string;
  motorway?: string;
  connectors?: string;
  keywords?: string[];
  // Priority weight for tie-breaking
  priority: number;
}

export interface SearchMatch {
  doc: SearchDoc;
  score: number;
  matchType: 'exact' | 'prefix' | 'word' | 'fulltext';
}

export interface SearchResultsGrouped {
  category: SearchCategory;
  categoryLabel: string;
  items: SearchMatch[];
}
