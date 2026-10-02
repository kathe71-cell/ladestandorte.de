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
  const [coveredOnly, setCoveredOnly] = useState(false);
  const [wcGastroOnly, setWcGastroOnly] = useState(false);
  const [afirOnly, setAfirOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'station' | 'city' | 'motorway' | 'operator'>('all');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [durationMs, setDurationMs] = useState<number>(0);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Execute instant search in sub-5ms
  useEffect(() => {
    const { results: matched, durationMs: elapsed } = instantSearch(query, {
      hpcOnly,
      coveredOnly,
      wcGastroOnly,
      afirOnly
    }, 25);

    let filtered = matched;
    if (activeTab !== 'all') {
      filtered = matched.filter(r => r.type === activeTab);
    }

    setResults(filtered);
    setDurationMs(elapsed);
  }, [query, hpcOnly, coveredOnly, wcGastroOnly, afirOnly, activeTab]);

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
      <div className="relative bg-white rounded-xl border border-[#DFE3DC] p-2 transition-all focus-within:border-[#171917] focus-within:ring-2 focus-within:ring-[#C7F000]">
        <div className="flex items-center gap-3 px-3 py-1">
          <Search className="w-5 h-5 text-[#6C716B] shrink-0" />
          
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
            className="w-full text-base font-medium text-[#171917] placeholder:text-[#6C716B] bg-transparent border-none outline-hidden min-h-[44px]"
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
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-[#F7F7F2] border border-[#DFE3DC] rounded-lg text-xs font-mono text-[#171917] shrink-0">
            <Gauge className="w-3.5 h-3.5 text-[#2F5E73]" />
            <span>{durationMs} ms</span>
          </div>
        </div>

        {/* Filters and Sub-Tabs */}
        {showFilters && (
          <div className="pt-2 pb-1 px-2 border-t border-[#DFE3DC] flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-[#171917] text-white'
                    : 'bg-[#F7F7F2] text-[#171917] hover:bg-[#EAECE6]'
                }`}
              >
                Alle
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('station')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'station'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Ladeparks
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('city')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
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
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === 'operator'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Betreiber
              </button>
            </div>

            {/* Quick Filters - nur verifizierte Attribute aus BNetzA Open Data */}
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <label className="inline-flex items-center gap-1 cursor-pointer select-none text-xs font-bold text-slate-800">
                <input
                  type="checkbox"
                  checked={hpcOnly}
                  onChange={(e) => setHpcOnly(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-[#171917] focus:ring-[#171917] border-slate-300"
                />
                <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono font-bold transition-colors ${
                  hpcOnly ? 'bg-[#171917] text-white border-[#171917]' : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}>
                  <Zap className="w-3 h-3 text-[#C7F000]" />
                  <span>≥ 150 kW HPC</span>
                </span>
              </label>
            </div>
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
                  className="p-3.5 sm:p-4 hover:bg-[#F7F7F2] transition-colors cursor-pointer flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isStation
                        ? 'bg-[#171917] text-white'
                        : isCity
                        ? 'bg-[#F7F7F2] text-[#2F5E73] border border-[#DFE3DC]'
                        : isMotorway
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      {isStation && <Zap className="w-5 h-5 text-[#C7F000]" />}
                      {isCity && <MapPin className="w-5 h-5 text-[#2F5E73]" />}
                      {isMotorway && <Navigation className="w-5 h-5 text-amber-700" />}
                      {isOperator && <ShieldCheck className="w-5 h-5 text-[#171917]" />}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-[#2F5E73] transition-colors truncate">
                          {item.title}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold uppercase ${
                          isStation
                            ? 'bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC]'
                            : isCity
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : isMotorway
                            ? 'bg-amber-50 text-amber-800 border border-amber-200'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}>
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 truncate mt-0.5">
                        {item.subtitle}
                      </p>

                      {isStation && (
                        <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                          {((item.data as StationData).connectorTypes || []).map(t => (
                            <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC]">
                              {t === 'Typ 2' ? 'Typ 2 (22 kW)' : t === 'CCS' ? `CCS (${(item.data as StationData).kwMax} kW)` : t}
                            </span>
                          ))}
                          {(item.data as StationData).truckCharging && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#F7F7F2] text-[#2F5E73] border border-[#DFE3DC]">
                              E-Lkw {((item.data as StationData).truckCharging?.mcsStatus === 'operational' ? 'MCS' : 'Hub')}
                            </span>
                          )}
                          {(item.data as StationData).exitDistance && (
                            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline">
                              {(item.data as StationData).exitDistance}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-1 text-slate-400 group-hover:text-[#171917] transition-colors">
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
