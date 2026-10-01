import React, { useState, useEffect, useRef, useTransition } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, X, Navigation, MapPin, ShieldCheck, Zap, Truck, Calculator, 
  BookOpen, ArrowRight, CornerDownLeft, Loader2, Sparkles, Filter 
} from 'lucide-react';
import { SearchDoc, SearchResultsGrouped, SearchCategory } from '../types/search';
import { loadSearchIndex, searchEntities } from '../utils/globalSearch';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  initialQuery = ''
}) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const [query, setQuery] = useState(initialQuery);
  const [docs, setDocs] = useState<SearchDoc[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [groupedResults, setGroupedResults] = useState<SearchResultsGrouped[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<SearchCategory | 'all'>('all');
  const [isPending, startTransition] = useTransition();

  // Load search index when modal opens
  useEffect(() => {
    if (isOpen) {
      if (docs.length === 0) {
        setIsLoading(true);
        loadSearchIndex()
          .then(data => {
            setDocs(data);
            setIsLoading(false);
          })
          .catch(() => setIsLoading(false));
      }
      // Focus input with slight delay to ensure modal transition has mounted
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      // Reset state on close
      setQuery('');
      setSelectedCategory('all');
    }
  }, [isOpen]);

  // Execute search when query or docs change
  useEffect(() => {
    if (!docs.length) return;

    startTransition(() => {
      const results = searchEntities(docs, query, 6);
      setGroupedResults(results);
    });
  }, [query, docs]);

  // Handle ESC key and backdrop lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectResult = (url: string) => {
    onClose();
    navigate(url);
  };

  const getCategoryIcon = (category: SearchCategory) => {
    switch (category) {
      case 'motorways':
        return <Navigation className="w-4 h-4 text-amber-600" />;
      case 'cities':
        return <MapPin className="w-4 h-4 text-emerald-600" />;
      case 'stations':
        return <Zap className="w-4 h-4 text-blue-600" />;
      case 'mcs':
        return <Truck className="w-4 h-4 text-purple-600" />;
      case 'operators':
        return <ShieldCheck className="w-4 h-4 text-indigo-600" />;
      case 'tools':
        return <Calculator className="w-4 h-4 text-emerald-600" />;
      case 'knowledge':
        return <BookOpen className="w-4 h-4 text-slate-600" />;
      default:
        return <Search className="w-4 h-4 text-slate-500" />;
    }
  };

  // Filter groups if category chip is selected
  const visibleGroups = selectedCategory === 'all' 
    ? groupedResults 
    : groupedResults.filter(g => g.category === selectedCategory);

  const totalResultsCount = groupedResults.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center p-0 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-label="Globale Suche"
      onClick={onClose}
    >
      <div 
        className="w-full sm:max-w-3xl bg-white sm:rounded-2xl shadow-2xl border-0 sm:border border-slate-200 flex flex-col h-full sm:h-auto sm:max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-3 sm:p-4 border-b border-[#DFE3DC] bg-white shrink-0">
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center gap-2.5 bg-[#F7F7F2] rounded-xl px-3.5 py-2.5 border border-[#DFE3DC] focus-within:border-[#171917] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#171917]/10 transition-all">
              <Search className="w-5 h-5 text-[#6C716B] shrink-0" />
              
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Suchen nach A3, Kassel, IONITY, MCS, 400 kW, Rechner..."
                className="w-full bg-transparent text-base sm:text-lg font-medium text-[#171917] placeholder:text-[#6C716B] focus:outline-hidden min-h-[36px]"
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />

              {isLoading && (
                <Loader2 className="w-5 h-5 text-[#2F5E73] animate-spin shrink-0" />
              )}

              {query && !isLoading && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  className="p-1 rounded-lg text-[#6C716B] hover:text-[#171917] hover:bg-[#EAECE6] min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                  aria-label="Sucheingabe leeren"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Prominent Global Close Button (Desktop & Mobile, min 44x44px) */}
            <button
              type="button"
              onClick={onClose}
              className="w-11 h-11 shrink-0 rounded-xl bg-[#F7F7F2] hover:bg-[#EAECE6] text-[#171917] border border-[#DFE3DC] flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Suche schließen"
              title="Suche schließen (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick-Filter Chips */}
          {query.trim().length > 0 && groupedResults.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-0.5 no-scrollbar text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[32px] flex items-center ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                Alle ({totalResultsCount})
              </button>
              {groupedResults.map((g) => (
                <button
                  key={g.category}
                  type="button"
                  onClick={() => setSelectedCategory(g.category)}
                  className={`px-2.5 py-1 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer min-h-[32px] flex items-center gap-1 ${
                    selectedCategory === g.category
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{g.categoryLabel}</span>
                  <span className="opacity-75 font-mono text-[11px]">({g.items.length})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Container */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-3 sm:p-5 space-y-6 overscroll-contain"
        >
          {/* Case 1: Empty Query / Prompt Suggestions */}
          {!query.trim() && (
            <div className="py-6 px-2 space-y-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
                  Häufig gesuchte Entitäten
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Autobahn A3', q: 'A3' },
                    { label: 'Autobahn A7', q: 'A7' },
                    { label: 'Kassel', q: 'Kassel' },
                    { label: 'Frankfurt', q: 'Frankfurt' },
                    { label: 'IONITY', q: 'IONITY' },
                    { label: 'Aral pulse', q: 'Aral' },
                    { label: 'MCS Megawatt Hubs', q: 'MCS' },
                    { label: 'E-Lkw Laden', q: 'Lkw' },
                    { label: 'Ladezeitrechner', q: 'Rechner' },
                    { label: 'Ladekarten', q: 'Ladekarten' },
                    { label: '400 kW HPC', q: '400 kW' }
                  ].map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setQuery(s.q)}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-900 border border-slate-200/80 text-xs font-medium text-slate-700 transition-colors cursor-pointer min-h-[36px]"
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-slate-800">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Direktes Navigieren in Echtzeit</span>
                </div>
                <p>
                  Geben Sie Gemeinden, Raststätten, CPO-Netze, Trassen oder technische Begriffe ein. Der Index durchsucht alle 240 indexierten Entitäten clientseitig ohne Serveranfrage.
                </p>
              </div>
            </div>
          )}

          {/* Case 2: Query active but no results */}
          {query.trim() && totalResultsCount === 0 && !isLoading && (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Keine direkten Treffer für „{query}“ gefunden
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
                Prüfen Sie die Schreibweise oder versuchen Sie allgemeine Suchbegriffe wie Autobahnnummer (z. B. A3), Stadt (z. B. Frankfurt) oder Betreiber (z. B. EnBW).
              </p>
            </div>
          )}

          {/* Case 3: Grouped Search Results */}
          {query.trim() && visibleGroups.length > 0 && (
            <div className="space-y-6">
              {visibleGroups.map((group) => (
                <div key={group.category} className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono uppercase tracking-wider text-slate-500 font-bold px-1">
                    <span className="flex items-center gap-1.5">
                      {getCategoryIcon(group.category)}
                      <span>{group.categoryLabel}</span>
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {group.items.length} {group.items.length === 1 ? 'Treffer' : 'Treffer'}
                    </span>
                  </div>

                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-200/90 bg-white overflow-hidden shadow-xs">
                    {group.items.map(({ doc }) => (
                      <button
                        key={doc.id}
                        type="button"
                        onClick={() => handleSelectResult(doc.url)}
                        className="w-full text-left p-3 sm:p-3.5 hover:bg-slate-50 transition-colors flex items-center justify-between gap-3 group cursor-pointer min-h-[48px]"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors truncate">
                              {doc.title}
                            </span>
                            {doc.badge && (
                              <span className="shrink-0 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                {doc.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1">
                            {doc.subtitle}
                          </p>
                        </div>

                        <div className="flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-emerald-600 shrink-0">
                          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer info (Desktop keyboard hint, Mobile dismiss) */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px]">240 Entitäten im Index</span>
            <span>·</span>
            <span className="text-emerald-700 font-medium">BNetzA &amp; Redaktion</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span>ESC zum Schließen</span>
          </div>
        </div>
      </div>
    </div>
  );
};
