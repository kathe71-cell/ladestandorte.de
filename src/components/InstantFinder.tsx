import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Zap, MapPin, Navigation, ShieldCheck, X, ArrowRight, Gauge } from 'lucide-react';
import { instantSearch, SearchResultItem } from '../utils/searchEngine';
import { StationData } from '../data/stations';
import { StationDetailModal } from './StationDetailModal';

interface Props {
  autoFocus?: boolean;
  initialQuery?: string;
  defaultHpcOnly?: boolean;
  showFilters?: boolean;
  className?: string;
}

export const InstantFinder: React.FC<Props> = ({
  autoFocus = false,
  initialQuery = '',
  defaultHpcOnly = false,
  showFilters = true,
  className = ''
}) => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [query, setQuery] = useState(initialQuery);
  const [hpcOnly, setHpcOnly] = useState(defaultHpcOnly);
  const [activeTab, setActiveTab] = useState<'all' | 'station' | 'city' | 'motorway' | 'operator'>('all');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Execute instant search in sub-5ms
  useEffect(() => {
    const { results: matched, durationMs: elapsed } = instantSearch(query, {
      hpcOnly: hpcOnly
    }, 20);

    let filtered = matched;
    if (activeTab !== 'all') {
      filtered = matched.filter(r => r.type === activeTab);
    }

    setResults(filtered);
    setDurationMs(elapsed);
  }, [query, hpcOnly, activeTab]);

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) inputRef.current.focus();
  };

  const handleItemClick = (item: SearchResultItem) => {
    if (item.type === 'station') {
      setSelectedStation(item.data as StationData);
    } else {
      navigate(item.url);
    }
  };

  const quickPills = [
    { label: 'Berlin', q: 'Berlin' },
    { label: 'München', q: 'München' },
    { label: 'Frankfurt', q: 'Frankfurt' },
    { label: 'A3 Autobahn', q: 'A3' },
    { label: 'A7 Autobahn', q: 'A7' },
    { label: 'EnBW HyperNetz', q: 'EnBW' },
    { label: 'Tesla Supercharger', q: 'Tesla' },
    { label: 'Ionity 350 kW', q: 'Ionity' }
  ];

  return (
    <div className={`w-full ${className}`} data-svsearch="ladestandorte">
      {/* Search Input Container */}
      <div className="relative bg-white rounded-2xl shadow-lg border border-slate-200/80 p-2 sm:p-2.5 transition-all focus-within:ring-4 focus-within:ring-emerald-500/20 focus-within:border-emerald-500">
        <div className="flex items-center gap-3 px-3 py-1.5">
          <Search className="w-6 h-6 text-emerald-600 shrink-0" />
          
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHasInteracted(true);
            }}
            autoFocus={autoFocus}
            placeholder="Stadt, PLZ, Betreiber (EnBW, Ionity, Tesla) oder Autobahn (A3, A7)..."
            className="w-full text-base sm:text-lg font-medium text-slate-900 placeholder:text-slate-400 bg-transparent border-none outline-none min-h-[44px]"
            aria-label="Ladesäulen und Standorte suchen"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Eingabe löschen"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          {/* High-speed counter badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-mono text-emerald-800 shrink-0">
            <Gauge className="w-3.5 h-3.5 text-emerald-600" />
            <span>{durationMs} ms</span>
          </div>
        </div>

        {/* Filters and Sub-Tabs */}
        {showFilters && (
          <div className="pt-2 pb-1 px-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Alle ({results.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('city')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'city'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Städte
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('motorway')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'motorway'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Autobahnen
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('operator')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'operator'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Betreiber (CPOs)
              </button>
            </div>

            {/* HPC Switch */}
            <label className="inline-flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-slate-800">
              <input
                type="checkbox"
                checked={hpcOnly}
                onChange={(e) => setHpcOnly(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span className="flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" />
                <span>Nur HPC (≥ 150 kW)</span>
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Quick Search Shortcut Pills */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold mr-1">
          Häufig gesucht:
        </span>
        {quickPills.map((pill) => (
          <button
            key={pill.label}
            type="button"
            onClick={() => {
              setQuery(pill.q);
              setHasInteracted(true);
            }}
            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-xs transition-colors hover:border-slate-300 min-h-[32px]"
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Instant Search Results Dropdown/List */}
      {(hasInteracted || query.length > 0) && (
        <div className="mt-4 bg-white rounded-2xl shadow-xl border border-slate-200 divide-y divide-slate-100 overflow-hidden max-h-[500px] overflow-y-auto">
          {results.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Search className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="font-semibold text-slate-800">Keine Ladestandorte gefunden für „{query}“</p>
              <p className="text-xs text-slate-500 mt-1">
                Tipp: Versuchen Sie eine Postleitzahl (z. B. „60311“), eine Autobahn (z. B. „A3“) oder den Namen einer Stadt.
              </p>
            </div>
          ) : (
            results.map((item) => {
              const isStation = item.type === 'station';
              const isCity = item.type === 'city';
              const isMotorway = item.type === 'motorway';
              const isOperator = item.type === 'operator';

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className="p-3.5 sm:p-4 hover:bg-slate-50 transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isStation
                        ? 'bg-emerald-100 text-emerald-800'
                        : isCity
                        ? 'bg-blue-100 text-blue-800'
                        : isMotorway
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {isStation && <Zap className="w-5 h-5 fill-emerald-600 text-emerald-600" />}
                      {isCity && <MapPin className="w-5 h-5 text-blue-600" />}
                      {isMotorway && <Navigation className="w-5 h-5 text-amber-700" />}
                      {isOperator && <ShieldCheck className="w-5 h-5 text-purple-700" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors truncate">
                          {item.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                          isStation
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : isCity
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : isMotorway
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-purple-50 text-purple-800 border border-purple-200'
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 truncate mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 text-slate-400 group-hover:text-emerald-600 transition-colors">
                    <span className="hidden sm:inline text-xs font-semibold">
                      {isStation ? 'Details ansehen' : 'Übersicht öffnen'}
                    </span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Modal for Station Detail */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />
    </div>
  );
};

export default InstantFinder;
