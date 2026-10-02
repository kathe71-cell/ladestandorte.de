import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, Zap, MapPin, Filter, Database, ArrowRight, ChevronLeft, ChevronRight,
  ShieldCheck, X, SlidersHorizontal, CheckCircle2, RotateCcw
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { EEATBadge } from '../components/EEATBadge';
import { CitationBox } from '../components/CitationBox';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { getSnapshotDateFormatted } from '../lib/datasetDate';
import { BnetzaSearchStation } from '../utils/searchEngine';
import { STATIONS_DATA, getStationUrl } from '../data/stations';

const PAGE_SIZE = 50;

const BUNDESLAENDER = [
  'Alle Bundesländer',
  'Baden-Württemberg',
  'Bayern',
  'Berlin',
  'Brandenburg',
  'Bremen',
  'Hamburg',
  'Hessen',
  'Mecklenburg-Vorpommern',
  'Niedersachsen',
  'Nordrhein-Westfalen',
  'Rheinland-Pfalz',
  'Saarland',
  'Sachsen',
  'Sachsen-Anhalt',
  'Schleswig-Holstein',
  'Thüringen'
];

export const NationwideDirectoryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stations, setStations] = useState<BnetzaSearchStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Synchronize state with URL search params
  const searchQuery = searchParams.get('q') || '';
  const selectedState = searchParams.get('state') || 'Alle Bundesländer';
  const selectedOperator = searchParams.get('operator') || 'Alle Betreiber';
  const hpcOnly = searchParams.get('hpc') === '1';
  const minKw = searchParams.get('minKw') || '0';
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  // Helper to update specific param without losing others
  const updateFilter = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams);
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === '' || val === '0' || val === 'Alle Bundesländer' || val === 'Alle Betreiber' || val === 'false') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    }
    // Reset page to 1 whenever a filter other than page changes
    if (!('page' in updates)) {
      nextParams.delete('page');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  useEffect(() => {
    let isCancelled = false;
    setLoading(true);

    fetch('/data/registry-search-index.json')
      .then(res => {
        if (!res.ok) throw new Error('Registry index failed to load');
        return res.json();
      })
      .then((data: BnetzaSearchStation[]) => {
        if (!isCancelled) {
          setStations(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!isCancelled) {
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, []);

  // Top operators for dropdown
  const topOperators = useMemo(() => {
    if (stations.length === 0) return [];
    const counts = new Map<string, number>();
    for (let i = 0; i < stations.length; i++) {
      const op = stations[i].o || 'Unbekannt';
      counts.set(op, (counts.get(op) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 35)
      .map(entry => entry[0]);
  }, [stations]);

  // Fast filter pipeline
  const filteredStations = useMemo(() => {
    if (stations.length === 0) return [];

    const queryTerms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const minKwNum = parseFloat(minKw) || 0;

    return stations.filter(s => {
      // 1. State filter
      if (selectedState !== 'Alle Bundesländer' && s.st !== selectedState) {
        return false;
      }

      // 2. Operator filter
      if (selectedOperator !== 'Alle Betreiber' && s.o !== selectedOperator) {
        return false;
      }

      // 3. HPC filter
      if (hpcOnly && (s.h || 0) < 1 && s.k < 150) {
        return false;
      }

      // 4. Min kW filter
      if (minKwNum > 0 && s.k < minKwNum) {
        return false;
      }

      // 5. Query terms (city, street, PLZ, operator, ID)
      if (queryTerms.length > 0) {
        const text = `${s.o} ${s.s} ${s.p} ${s.c} ${s.st || ''} ${s.i}`.toLowerCase();
        for (let t = 0; t < queryTerms.length; t++) {
          if (!text.includes(queryTerms[t])) return false;
        }
      }

      return true;
    });
  }, [stations, searchQuery, selectedState, selectedOperator, hpcOnly, minKw]);

  const totalCount = stations.length;
  const filteredCount = filteredStations.length;
  const totalPages = Math.ceil(filteredCount / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, filteredCount);

  const paginatedStations = useMemo(() => {
    return filteredStations.slice(startIndex, endIndex);
  }, [filteredStations, startIndex, endIndex]);

  const hasActiveFilters = Boolean(
    searchQuery || selectedState !== 'Alle Bundesländer' || selectedOperator !== 'Alle Betreiber' || hpcOnly || minKw !== '0'
  );

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://www.ladestandorte.de/" },
          { "@type": "ListItem", "position": 2, "name": "Ladestationen Deutschland", "item": "https://www.ladestandorte.de/ladestationen" }
        ]
      },
      {
        "@type": "CollectionPage",
        "name": "Bundesweites BNetzA-Ladestationsverzeichnis Deutschland",
        "description": "Vollständiges Register aller 117.043 öffentlich registrierten BNetzA-Ladestationen in Deutschland. Durchsuchbar nach Ort, PLZ, Bundesland, Betreiber und HPC-Leistung.",
        "url": "https://www.ladestandorte.de/ladestationen"
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <SEO
        title="Bundesweites BNetzA-Ladestationsverzeichnis: Alle Ladestationen in Deutschland"
        description="Durchsuche alle 117.043 öffentlich registrierten BNetzA-Ladestationen in ganz Deutschland nach Ort, PLZ, Betreiber und HPC-Schnellladeleistung."
        canonicalPath="/ladestationen"
        schema={schema}
      />

      {/* Kompakter Infrastruktur-Hero mit Key-Metriken */}
      <div className="bg-white rounded-2xl border border-[#DFE3DC] p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#C7F000] text-[#171917] text-xs font-mono font-bold w-fit">
            <Database className="w-3.5 h-3.5" />
            <span>AMTLICHES BNETZA-GESAMTVERZEICHNIS</span>
          </div>
          <span className="text-xs font-mono text-[#6C716B]">
            Datenstand: {getSnapshotDateFormatted()}
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#171917] tracking-tight">
            Bundesweites Ladestationsverzeichnis
          </h1>
          <p className="text-xs sm:text-sm text-[#6C716B] mt-1 max-w-3xl leading-relaxed">
            Vollständiger Datenbestand aller öffentlich gemeldeten Ladesäulen in Deutschland. Durchsuchen Sie alle registrierten Standorte von Großstädten über den ländlichen Raum bis hin zu Autobahn-Rasthöfen.
          </p>
        </div>

        {/* Kennzahlen-Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-[#DFE3DC]/60">
          <div className="p-3 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC]/60">
            <span className="text-[11px] font-mono text-[#6C716B] uppercase block">Ladestationen DE</span>
            <span className="text-lg sm:text-xl font-black text-[#171917] font-mono tabular-nums block">
              117.043
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC]/60">
            <span className="text-[11px] font-mono text-[#6C716B] uppercase block">Ladepunkte DE</span>
            <span className="text-lg sm:text-xl font-black text-[#171917] font-mono tabular-nums block">
              210.185
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC]/60">
            <span className="text-[11px] font-mono text-[#6C716B] uppercase block">HPC (≥150 kW)</span>
            <span className="text-lg sm:text-xl font-black text-[#171917] font-mono tabular-nums block">
              40.654
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC]/60">
            <span className="text-[11px] font-mono text-[#6C716B] uppercase block">Gemeinden &amp; Orte</span>
            <span className="text-lg sm:text-xl font-black text-[#171917] font-mono tabular-nums block">
              7.683
            </span>
          </div>
        </div>
      </div>

      {/* Große, prominente Suchleiste */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-5 h-5 text-[#6C716B] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => updateFilter({ q: e.target.value })}
            placeholder="Ort, PLZ, Straße oder Betreiber suchen (z. B. Berlin, 56410, Montabaur, EnBW)..."
            aria-label="Ladestationen bundesweit durchsuchen"
            className="w-full pl-12 pr-10 py-3.5 sm:py-4 rounded-2xl bg-white border border-[#DFE3DC] shadow-xs text-sm sm:text-base text-[#171917] placeholder-[#6C716B] focus:outline-none focus:border-[#171917] focus:ring-1 focus:ring-[#171917] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => updateFilter({ q: '' })}
              aria-label="Suchtext löschen"
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#6C716B] hover:text-[#171917]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop Filterleiste (Hierarchisch: Primär + Sekundär) */}
        <div className="bg-white p-4 rounded-2xl border border-[#DFE3DC] shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Primäre Filter: Betreiber, HPC-Toggle, Mindestleistung */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedOperator}
                onChange={e => updateFilter({ operator: e.target.value })}
                aria-label="Betreiber auswählen"
                className="px-3 py-2 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-bold text-[#171917] focus:outline-none focus:border-[#171917] min-h-[44px]"
              >
                <option value="Alle Betreiber">Alle Betreiber</option>
                {topOperators.map(op => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => updateFilter({ hpc: hpcOnly ? null : '1' })}
                aria-pressed={hpcOnly}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 min-h-[44px] cursor-pointer ${
                  hpcOnly 
                    ? 'bg-[#171917] text-[#C7F000]' 
                    : 'bg-[#F7F7F2] text-[#6C716B] border border-[#DFE3DC] hover:text-[#171917]'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Nur HPC (≥150 kW)</span>
              </button>

              <select
                value={minKw}
                onChange={e => updateFilter({ minKw: e.target.value })}
                aria-label="Mindestladeleistung auswählen"
                className="px-3 py-2 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-bold text-[#171917] focus:outline-none focus:border-[#171917] min-h-[44px]"
              >
                <option value="0">Jede Leistung</option>
                <option value="22">ab 22 kW</option>
                <option value="50">ab 50 kW (DC)</option>
                <option value="150">ab 150 kW (HPC)</option>
                <option value="300">ab 300 kW (Ultra-HPC)</option>
              </select>

              <select
                value={selectedState}
                onChange={e => updateFilter({ state: e.target.value })}
                aria-label="Bundesland auswählen"
                className="hidden lg:block px-3 py-2 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-bold text-[#171917] focus:outline-none focus:border-[#171917] min-h-[44px]"
              >
                {BUNDESLAENDER.map(bl => (
                  <option key={bl} value={bl}>{bl}</option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Drawer Button */}
            <div className="flex items-center gap-2 lg:hidden w-full sm:w-auto justify-between">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-bold text-[#171917] flex items-center gap-1.5 min-h-[44px]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Weitere Filter (Bundesland)</span>
              </button>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[#2F5E73] font-semibold underline flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Zurücksetzen</span>
                </button>
              )}
            </div>

            {/* Desktop Reset Button */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="hidden lg:flex text-xs text-[#2F5E73] hover:text-[#171917] font-semibold underline items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Filter zurücksetzen</span>
              </button>
            )}
          </div>

          {/* Echte Ergebnis-Metrik mit aria-live */}
          <div 
            aria-live="polite"
            className="flex flex-wrap items-center justify-between text-xs text-[#6C716B] pt-3 border-t border-[#DFE3DC]/60 font-mono"
          >
            <span>
              {loading ? (
                'Lade 117.043 Standorte...'
              ) : hasActiveFilters ? (
                <>
                  <strong className="text-[#171917] font-bold">{filteredCount.toLocaleString('de-DE')}</strong> von <strong className="text-[#171917] font-bold">{totalCount.toLocaleString('de-DE')}</strong> Ladestationen
                </>
              ) : (
                <>
                  <strong className="text-[#171917] font-bold">{totalCount.toLocaleString('de-DE')}</strong> Ladestationen in Deutschland
                </>
              )}
            </span>

            {filteredCount > 0 && (
              <span>
                Zeige {startIndex + 1}–{endIndex} von {filteredCount.toLocaleString('de-DE')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer / Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl p-6 space-y-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#DFE3DC] pb-3">
              <h3 className="font-bold text-[#171917] text-base">Filteroptionen</h3>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg hover:bg-[#F7F7F2] text-[#6C716B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-semibold">
              <div className="space-y-1.5">
                <label className="text-[#6C716B]">Bundesland</label>
                <select
                  value={selectedState}
                  onChange={e => updateFilter({ state: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-bold text-[#171917]"
                >
                  {BUNDESLAENDER.map(bl => (
                    <option key={bl} value={bl}>{bl}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#6C716B]">Betreiber (CPO)</label>
                <select
                  value={selectedOperator}
                  onChange={e => updateFilter({ operator: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-bold text-[#171917]"
                >
                  <option value="Alle Betreiber">Alle Betreiber</option>
                  {topOperators.map(op => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#6C716B]">Mindestleistung</label>
                <select
                  value={minKw}
                  onChange={e => updateFilter({ minKw: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-bold text-[#171917]"
                >
                  <option value="0">Jede Leistung</option>
                  <option value="22">ab 22 kW</option>
                  <option value="50">ab 50 kW (DC)</option>
                  <option value="150">ab 150 kW (HPC)</option>
                  <option value="300">ab 300 kW (Ultra-HPC)</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleResetFilters}
                className="w-1/2 py-3 rounded-xl border border-[#DFE3DC] text-xs font-bold text-[#171917]"
              >
                Zurücksetzen
              </button>
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-1/2 py-3 rounded-xl bg-[#171917] text-[#C7F000] text-xs font-bold"
              >
                Ergebnisse anzeigen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Directory Table / Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-sm font-mono text-[#6C716B] bg-white rounded-2xl border border-[#DFE3DC]">
            Lade amtliche BNetzA-Ladestationen...
          </div>
        ) : paginatedStations.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#DFE3DC] space-y-4 max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-[#F7F7F2] flex items-center justify-center mx-auto text-[#6C716B]">
              <Search className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-[#171917] text-base">Keine Ladestationen mit diesen Filtern gefunden.</p>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Prüfen Sie die Schreibweise oder entfernen Sie aktive Filter (z. B. HPC oder spezifische Betreiber), um alle Stationen in dieser Region anzuzeigen.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {hpcOnly && (
                <button
                  type="button"
                  onClick={() => updateFilter({ hpc: null })}
                  className="px-3 py-1.5 rounded-lg bg-[#F7F7F2] hover:bg-[#DFE3DC] text-xs font-bold text-[#171917]"
                >
                  HPC-Filter entfernen
                </button>
              )}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl bg-[#171917] text-white text-xs font-bold"
                >
                  Alle Filter zurücksetzen
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paginatedStations.map(st => {
              const isHpc = st.k >= 150;
              const hasDossier = Boolean(st.d);
              const dossier = hasDossier ? STATIONS_DATA.find(d => d.id === st.d) : null;
              const targetUrl = dossier ? getStationUrl(dossier) : `/ladestation-register/${st.cs}/${st.i}`;

              return (
                <div
                  key={st.i}
                  className={`bg-white p-4 rounded-xl border transition-all flex flex-col justify-between gap-3 group ${
                    hasDossier 
                      ? 'border-amber-200 hover:border-amber-400 bg-linear-to-b from-amber-50/20 to-white' 
                      : 'border-[#DFE3DC] hover:border-[#171917]'
                  }`}
                >
                  <div className="space-y-2">
                    {/* Betreiber & Max Power */}
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-bold text-[#171917] group-hover:text-[#2F5E73] transition-colors truncate">
                        {st.o}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0 ${
                        isHpc ? 'bg-[#C7F000] text-[#171917]' : 'bg-[#F7F7F2] text-[#6C716B] border border-[#DFE3DC]'
                      }`}>
                        max. {st.k} kW {isHpc ? 'HPC' : 'AC'}
                      </span>
                    </div>

                    {/* Adresse */}
                    <div className="text-xs text-[#171917] flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#6C716B] shrink-0" />
                      <span className="truncate">{st.s ? `${st.s} · ` : ''}{st.p} {st.c}</span>
                    </div>

                    {/* Technische Kennzahlen (Scannbar) */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-[#6C716B]">
                      <span className="px-1.5 py-0.5 rounded bg-[#F7F7F2] border border-[#DFE3DC]/60 font-semibold text-[#171917]">
                        {st.n} {st.n === 1 ? 'Ladepunkt' : 'Ladepunkte'}
                      </span>
                      {st.h > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold">
                          {st.h} HPC
                        </span>
                      )}
                      <span>{st.st || 'Deutschland'}</span>
                      <span>·</span>
                      <span>ID: {st.i}</span>
                    </div>
                  </div>

                  {/* Footer & Dossier-Vorrang */}
                  <div className="pt-2 border-t border-[#DFE3DC]/40 flex items-center justify-between text-xs">
                    {hasDossier ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-100 text-amber-950 font-bold text-[10px] uppercase font-mono border border-amber-300">
                        <CheckCircle2 className="w-3 h-3 text-amber-700" />
                        <span>Redaktionelles Dossier</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#6C716B]">BNetzA-Register</span>
                    )}

                    <Link
                      to={targetUrl}
                      className="inline-flex items-center gap-1 font-bold text-[#171917] group-hover:text-[#2F5E73] transition-colors min-h-[44px] items-center"
                    >
                      <span>{hasDossier ? 'Dossier öffnen' : 'Registerdetails'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#DFE3DC] shadow-xs text-xs font-mono">
            <button
              onClick={() => updateFilter({ page: String(Math.max(1, currentPage - 1)) })}
              disabled={currentPage === 1}
              aria-label="Vorherige Ergebnisseite"
              className="px-3.5 py-2 rounded-xl bg-white border border-[#DFE3DC] text-xs font-bold text-[#171917] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5 min-h-[44px]"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Vorherige</span>
            </button>

            <span className="text-[#6C716B]">
              Seite <strong>{currentPage}</strong> von <strong>{totalPages}</strong>
            </span>

            <button
              onClick={() => updateFilter({ page: String(Math.min(totalPages, currentPage + 1)) })}
              disabled={currentPage === totalPages}
              aria-label="Nächste Ergebnisseite"
              className="px-3.5 py-2 rounded-xl bg-white border border-[#DFE3DC] text-xs font-bold text-[#171917] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5 min-h-[44px]"
            >
              <span>Nächste</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <CitationBox
        title="Bundesweites BNetzA-Ladesäulenregister Deutschland"
        urlPath="/ladestationen"
      />

      <EEATBadge topic="Bundesweites Ladesäulenregister" />

      <FloatingCTABar
        title="Günstig laden in ganz Deutschland"
        subtitle="Unabhängiger Ladekarten-Vergleich 2026"
        link="/ladekarten"
      />
    </div>
  );
};

export default NationwideDirectoryPage;
