import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, Filter, Search, ChevronLeft, ChevronRight, ArrowRight, 
  MapPin, Building, ShieldCheck, Database, CheckCircle2 
} from 'lucide-react';

export interface BnetzaRegistryStationItem {
  id: string;
  citySlug: string;
  cpo: string;
  cpoRaw: string;
  street: string;
  houseNumber: string;
  plz: string;
  city: string;
  state: string;
  lon: number | null;
  lat: number | null;
  ratedKw: number;
  installedKw: number;
  reportedPoints: number;
  commissioningDate: string;
  useCase: string;
  pointsCount: number;
  hpcPointsCount: number;
  maxKw: number;
  powerLevels: number[];
  dossierId: string | null;
}

interface Props {
  citySlug: string;
  cityName: string;
  totalRegisterCount: number;
}

const PAGE_SIZE = 50;

export const CityStationDirectory: React.FC<Props> = ({
  citySlug,
  cityName,
  totalRegisterCount
}) => {
  const [stations, setStations] = useState<BnetzaRegistryStationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCpo, setSelectedCpo] = useState('ALL');
  const [hpcOnly, setHpcOnly] = useState(false);
  const [minPower, setMinPower] = useState<number>(0);
  const [selectedPlz, setSelectedPlz] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch full city registry on client side
  useEffect(() => {
    let isCancelled = false;
    setLoading(true);
    fetch(`/data/registry/${citySlug}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Registry file not found');
        return res.json();
      })
      .then((data: BnetzaRegistryStationItem[]) => {
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
  }, [citySlug]);

  // Derived filter options
  const { cpoOptions, plzOptions } = useMemo(() => {
    const cpos = new Set<string>();
    const plzs = new Set<string>();

    for (const s of stations) {
      if (s.cpo) cpos.add(s.cpo);
      if (s.plz) plzs.add(s.plz);
    }

    return {
      cpoOptions: Array.from(cpos).sort((a, b) => a.localeCompare(b)),
      plzOptions: Array.from(plzs).sort()
    };
  }, [stations]);

  // Filtered dataset
  const filteredStations = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return stations.filter(st => {
      // 1. HPC filter
      if (hpcOnly && st.hpcPointsCount === 0 && st.maxKw < 150) {
        return false;
      }

      // 2. Min power filter
      if (minPower > 0 && st.maxKw < minPower) {
        return false;
      }

      // 3. CPO filter
      if (selectedCpo !== 'ALL' && st.cpo !== selectedCpo) {
        return false;
      }

      // 4. PLZ filter
      if (selectedPlz !== 'ALL' && st.plz !== selectedPlz) {
        return false;
      }

      // 5. Query filter (street, houseNumber, plz, id, cpo)
      if (q) {
        const text = `${st.street} ${st.houseNumber} ${st.plz} ${st.id} ${st.cpo} ${st.cpoRaw}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [stations, searchQuery, selectedCpo, hpcOnly, minPower, selectedPlz]);

  // Reset to page 1 on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCpo, hpcOnly, minPower, selectedPlz]);

  const totalFiltered = filteredStations.length;
  const totalPages = Math.ceil(totalFiltered / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalFiltered);
  const paginatedStations = filteredStations.slice(startIndex, endIndex);

  return (
    <div className="space-y-6">
      {/* Header & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#DFE3DC] pb-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#2F5E73] uppercase tracking-wider mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>Amtlicher BNetzA-Registerbestand</span>
          </div>
          <h2 className="text-2xl font-bold text-[#171917]">
            Alle registrierten Ladestationen in {cityName}
          </h2>
          <p className="text-xs text-[#6C716B] mt-1">
            Vollständiges Register aller {totalRegisterCount.toLocaleString('de-DE')} von der Bundesnetzagentur erfassten Ladestationen im Stadtgebiet.
          </p>
        </div>

        <div className="text-xs font-mono text-[#6C716B] shrink-0">
          Stand: Aktueller BNetzA-Snapshot
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="p-4 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          {/* Search Input */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-[#6C716B] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Straße, PLZ, Betreiber oder Stations-ID..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-[#171917] placeholder-[#6C716B] focus:border-[#171917] focus:outline-hidden text-xs"
            />
          </div>

          {/* Betreiber Dropdown */}
          <div>
            <select
              value={selectedCpo}
              onChange={e => setSelectedCpo(e.target.value)}
              aria-label="Betreiber auswählen"
              className="w-full px-3 py-2 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-[#171917] focus:border-[#171917] focus:outline-hidden text-xs"
            >
              <option value="ALL">Alle Betreiber ({cpoOptions.length})</option>
              {cpoOptions.map(cpo => (
                <option key={cpo} value={cpo}>{cpo}</option>
              ))}
            </select>
          </div>

          {/* Mindestleistung Dropdown */}
          <div>
            <select
              value={minPower}
              onChange={e => setMinPower(Number(e.target.value))}
              aria-label="Mindestleistung auswählen"
              className="w-full px-3 py-2 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-[#171917] focus:border-[#171917] focus:outline-hidden text-xs"
            >
              <option value="0">Jede Ladeleistung</option>
              <option value="50">Ab 50 kW (Schnelllader)</option>
              <option value="150">Ab 150 kW (HPC)</option>
              <option value="300">Ab 300 kW (Ultra-HPC)</option>
            </select>
          </div>

          {/* PLZ Dropdown */}
          <div>
            <select
              value={selectedPlz}
              onChange={e => setSelectedPlz(e.target.value)}
              aria-label="Postleitzahl auswählen"
              className="w-full px-3 py-2 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-[#171917] focus:border-[#171917] focus:outline-hidden text-xs"
            >
              <option value="ALL">Alle PLZ ({plzOptions.length})</option>
              {plzOptions.map(plz => (
                <option key={plz} value={plz}>{plz}</option>
              ))}
            </select>
          </div>
        </div>

        {/* HPC Toggle pill & Counter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#DFE3DC] text-xs">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setHpcOnly(!hpcOnly)}
              className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs transition-colors flex items-center gap-1.5 ${
                hpcOnly 
                  ? 'bg-[#171917] text-[#C7F000]' 
                  : 'bg-[#F7F7F2] text-[#6C716B] hover:text-[#171917] border border-[#DFE3DC]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Nur HPC (≥150 kW)</span>
            </button>
            {(searchQuery || selectedCpo !== 'ALL' || minPower > 0 || selectedPlz !== 'ALL' || hpcOnly) && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCpo('ALL');
                  setMinPower(0);
                  setSelectedPlz('ALL');
                  setHpcOnly(false);
                }}
                className="text-xs text-[#2F5E73] hover:underline font-semibold"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>

          <div className="font-mono text-xs text-[#6C716B]">
            {loading ? (
              <span>Lade Registerdaten...</span>
            ) : (
              <span>
                <strong>{totalFiltered.toLocaleString('de-DE')}</strong> von <strong>{totalRegisterCount.toLocaleString('de-DE')}</strong> Ladestationen
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Directory Table / Cards */}
      {loading ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DFE3DC] text-xs font-mono text-[#6C716B]">
          Lade {totalRegisterCount.toLocaleString('de-DE')} registrierte Ladestationen für {cityName}...
        </div>
      ) : loadError ? (
        <div className="p-8 text-center bg-white rounded-2xl border border-[#DFE3DC] text-xs text-[#6C716B]">
          Registerbestand konnte momentan nicht geladen werden. Bitte nutzen Sie die globale Suche.
        </div>
      ) : totalFiltered === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#DFE3DC] space-y-2">
          <p className="font-bold text-[#171917] text-sm">Keine Ladestationen für diese Filterkriterien gefunden</p>
          <p className="text-xs text-[#6C716B]">Passen Sie Suchbegriff, Betreiber oder Mindestleistung an.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-[#6C716B] px-1">
            <span>
              Zeige {startIndex + 1}–{endIndex} von {totalFiltered.toLocaleString('de-DE')} Ergebnissen
            </span>
            <span>Seite {currentPage} von {totalPages}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paginatedStations.map(st => {
              const isStationHpc = st.maxKw >= 150;
              const address = `${st.street} ${st.houseNumber}`.trim();
              return (
                <div
                  key={st.id}
                  className="p-4 bg-white rounded-xl border border-[#DFE3DC] shadow-xs hover:border-[#2F5E73] transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="font-bold text-sm text-[#171917] group-hover:text-[#2F5E73] transition-colors line-clamp-1">
                        {st.cpo}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0 ${
                        isStationHpc 
                          ? 'bg-[#171917] text-[#C7F000]' 
                          : 'bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC]'
                      }`}>
                        {st.maxKw} kW {isStationHpc ? 'HPC' : 'AC'}
                      </span>
                    </div>

                    <p className="text-xs text-[#6C716B] mb-2 line-clamp-1">
                      {address ? `${address}, ` : ''}{st.plz} {st.city}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-mono text-[#6C716B]">
                      <span className="px-1.5 py-0.5 rounded bg-[#F7F7F2] border border-[#DFE3DC]">
                        {st.pointsCount} {st.pointsCount === 1 ? 'Ladepunkt' : 'Ladepunkte'}
                      </span>
                      {st.hpcPointsCount > 0 && (
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold">
                          {st.hpcPointsCount} HPC
                        </span>
                      )}
                      <span className="text-[#6C716B]">ID: {st.id}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[#DFE3DC] flex items-center justify-between text-xs">
                    {st.dossierId ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Verifiziertes Dossier</span>
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#6C716B]">BNetzA-Register</span>
                    )}

                    <Link
                      to={`/ladestation-register/${st.citySlug}/${st.id}`}
                      className="font-bold text-[#2F5E73] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Registerdetails</span>
                      <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-[#DFE3DC] shadow-xs text-xs">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg border border-[#DFE3DC] font-semibold text-[#171917] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7F7F2] flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Vorherige</span>
              </button>

              <span className="font-mono text-[#6C716B]">
                Seite <strong>{currentPage}</strong> von <strong>{totalPages}</strong>
              </span>

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg border border-[#DFE3DC] font-semibold text-[#171917] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#F7F7F2] flex items-center gap-1"
              >
                <span>Nächste</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CityStationDirectory;
