import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Zap, Search, ChevronLeft, ChevronRight, ArrowRight, 
  MapPin, ShieldCheck, Database, CheckCircle2, RotateCcw
} from 'lucide-react';
import { STATIONS_DATA, getStationUrl } from '../data/stations';
import { BnetzaSearchStation } from '../utils/searchEngine';

interface Props {
  operatorSlug: string;
  operatorName: string;
  totalRegisterCount: number;
}

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

export const OperatorStationDirectory: React.FC<Props> = ({
  operatorSlug,
  operatorName,
  totalRegisterCount
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [stations, setStations] = useState<BnetzaSearchStation[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // URL state persistence
  const searchQuery = searchParams.get('q') || '';
  const selectedState = searchParams.get('state') || 'Alle Bundesländer';
  const hpcOnly = searchParams.get('hpc') === '1';
  const minKw = searchParams.get('minKw') || '0';
  const currentPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));

  const updateFilter = (updates: Record<string, string | null>) => {
    const nextParams = new URLSearchParams(searchParams);
    for (const [key, val] of Object.entries(updates)) {
      if (val === null || val === '' || val === '0' || val === 'Alle Bundesländer' || val === 'false') {
        nextParams.delete(key);
      } else {
        nextParams.set(key, val);
      }
    }
    if (!('page' in updates)) {
      nextParams.delete('page');
    }
    setSearchParams(nextParams, { replace: true });
  };

  const handleResetFilters = () => {
    setSearchParams(new URLSearchParams(), { replace: true });
  };

  // Fetch operator stations pre-sliced JSON
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    setLoadError(false);

    fetch(`/data/registry/operators/${operatorSlug}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Operator registry file not found');
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
          setLoadError(true);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [operatorSlug]);

  // Filter pipeline
  const filteredStations = useMemo(() => {
    if (stations.length === 0) return [];
    const terms = searchQuery.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const minKwNum = parseFloat(minKw) || 0;

    return stations.filter(st => {
      if (selectedState !== 'Alle Bundesländer' && st.st !== selectedState) {
        return false;
      }
      if (hpcOnly && (st.h || 0) < 1 && st.k < 150) {
        return false;
      }
      if (minKwNum > 0 && st.k < minKwNum) {
        return false;
      }
      if (terms.length > 0) {
        const text = `${st.o} ${st.s} ${st.p} ${st.c} ${st.st || ''} ${st.i}`.toLowerCase();
        for (let t = 0; t < terms.length; t++) {
          if (!text.includes(terms[t])) return false;
        }
      }
      return true;
    });
  }, [stations, searchQuery, selectedState, hpcOnly, minKw]);

  const totalFiltered = filteredStations.length;
  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalFiltered);
  const paginatedStations = useMemo(() => {
    return filteredStations.slice(startIndex, endIndex);
  }, [filteredStations, startIndex, endIndex]);

  const hasActiveFilters = Boolean(
    searchQuery || selectedState !== 'Alle Bundesländer' || hpcOnly || minKw !== '0'
  );

  if (loadError) {
    return null;
  }

  return (
    <div className="space-y-6 pt-4 border-t border-[#DFE3DC]">
      {/* Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#DFE3DC] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#2F5E73] uppercase tracking-wider mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Vollständiges BNetzA-Register</span>
          </div>
          <h2 className="text-2xl font-bold text-[#171917]">
            Alle registrierten {operatorName}-Ladestationen
          </h2>
          <p className="text-xs text-[#6C716B] mt-1">
            Vollständiger Datenbestand aller {totalRegisterCount.toLocaleString('de-DE')} im amtlichen BNetzA-Ladesäulenregister gemeldeten Standorte von {operatorName}.
          </p>
        </div>

        <div className="text-xs font-mono text-[#6C716B] shrink-0">
          Stand: BNetzA-Snapshot
        </div>
      </div>

      {/* Filterleiste */}
      <div className="bg-white p-4 rounded-xl border border-[#DFE3DC] shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
          {/* Suche */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6C716B] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => updateFilter({ q: e.target.value })}
              placeholder="Ort, PLZ, Straße oder ID suchen..."
              aria-label={`Ladestationen von ${operatorName} filtern`}
              className="w-full pl-9 pr-4 py-2 bg-[#F7F7F2] border border-[#DFE3DC] rounded-lg text-xs font-bold text-[#171917] focus:outline-none focus:border-[#171917]"
            />
          </div>

          {/* Bundesland */}
          <select
            value={selectedState}
            onChange={e => updateFilter({ state: e.target.value })}
            aria-label="Bundesland filtern"
            className="px-3 py-2 bg-[#F7F7F2] border border-[#DFE3DC] rounded-lg text-xs font-bold text-[#171917]"
          >
            {BUNDESLAENDER.map(bl => (
              <option key={bl} value={bl}>{bl}</option>
            ))}
          </select>

          {/* Mindestleistung */}
          <select
            value={minKw}
            onChange={e => updateFilter({ minKw: e.target.value })}
            aria-label="Mindestleistung filtern"
            className="px-3 py-2 bg-[#F7F7F2] border border-[#DFE3DC] rounded-lg text-xs font-bold text-[#171917]"
          >
            <option value="0">Jede Leistung</option>
            <option value="22">ab 22 kW</option>
            <option value="50">ab 50 kW (DC)</option>
            <option value="150">ab 150 kW (HPC)</option>
            <option value="300">ab 300 kW (Ultra-HPC)</option>
          </select>

          {/* HPC Button */}
          <button
            type="button"
            onClick={() => updateFilter({ hpc: hpcOnly ? null : '1' })}
            aria-pressed={hpcOnly}
            className={`px-3 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              hpcOnly
                ? 'bg-[#171917] text-[#C7F000]'
                : 'bg-[#F7F7F2] text-[#6C716B] border border-[#DFE3DC] hover:text-[#171917]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Nur HPC</span>
          </button>
        </div>

        {/* Counter & Paginierung Info */}
        <div 
          aria-live="polite"
          className="flex flex-wrap items-center justify-between text-xs text-[#6C716B] pt-2 border-t border-[#DFE3DC]/60 font-mono"
        >
          <span>
            {loading ? (
              `Lade ${totalRegisterCount.toLocaleString('de-DE')} Standorte...`
            ) : hasActiveFilters ? (
              <>
                <strong className="text-[#171917] font-bold">{totalFiltered.toLocaleString('de-DE')}</strong> von <strong className="text-[#171917] font-bold">{stations.length.toLocaleString('de-DE')}</strong> Stationen
              </>
            ) : (
              <>
                <strong className="text-[#171917] font-bold">{stations.length.toLocaleString('de-DE')}</strong> registrierte Ladestationen
              </>
            )}
          </span>

          <div className="flex items-center gap-3">
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
            {totalFiltered > 0 && (
              <span>
                Zeige {startIndex + 1}–{endIndex} von {totalFiltered.toLocaleString('de-DE')}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Grid Liste */}
      {loading ? (
        <div className="p-12 text-center text-sm font-mono text-[#6C716B] bg-white rounded-xl border border-[#DFE3DC]">
          Lade amtliche BNetzA-Ladestationen von {operatorName}...
        </div>
      ) : paginatedStations.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-xl border border-[#DFE3DC] space-y-3">
          <p className="font-bold text-[#171917] text-sm">Keine Ladestationen mit diesen Filtern gefunden.</p>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-3.5 py-2 rounded-xl bg-[#171917] text-white text-xs font-bold"
            >
              Filter zurücksetzen
            </button>
          )}
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
                className={`p-4 bg-white rounded-xl border transition-all flex flex-col justify-between gap-3 group ${
                  hasDossier 
                    ? 'border-amber-200 hover:border-amber-400 bg-linear-to-b from-amber-50/20 to-white' 
                    : 'border-[#DFE3DC] hover:border-[#171917]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-[#171917] text-sm group-hover:text-[#2F5E73] transition-colors truncate">
                      {st.s || st.c}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0 ${
                      isHpc ? 'bg-[#171917] text-[#C7F000]' : 'bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC]'
                    }`}>
                      max. {st.k} kW {isHpc ? 'HPC' : 'AC'}
                    </span>
                  </div>

                  <p className="text-xs text-[#6C716B]">
                    {st.s ? `${st.s}, ` : ''}{st.p} {st.c}
                  </p>

                  <div className="flex items-center gap-2 mt-2 text-[11px] font-mono text-[#6C716B]">
                    <span>{st.n} {st.n === 1 ? 'Ladepunkt' : 'Ladepunkte'}</span>
                    <span>·</span>
                    <span>{st.st || 'Deutschland'}</span>
                    <span>·</span>
                    <span>ID: {st.i}</span>
                  </div>
                </div>

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
                    className="inline-flex items-center gap-1 font-bold text-[#171917] group-hover:text-[#2F5E73] transition-colors min-h-[36px]"
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

      {/* Paginierung */}
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
  );
};
