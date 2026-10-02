import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Zap, MapPin, Filter, Database, ArrowRight, ChevronLeft, ChevronRight,
  ShieldCheck, Gauge, Building2
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';
import { EEATBadge } from '../components/EEATBadge';
import { CitationBox } from '../components/CitationBox';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { getSnapshotDateFormatted } from '../lib/datasetDate';
import { BnetzaSearchStation } from '../utils/searchEngine';

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
  const [stations, setStations] = useState<BnetzaSearchStation[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('Alle Bundesländer');
  const [selectedOperator, setSelectedOperator] = useState('Alle Betreiber');
  const [hpcOnly, setHpcOnly] = useState(false);
  const [minKw, setMinKw] = useState('0');
  const [currentPage, setCurrentPage] = useState(1);

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

  // Extract top operators for filter dropdown (top 30 most frequent across DE)
  const topOperators = useMemo(() => {
    if (stations.length === 0) return [];
    const counts = new Map<string, number>();
    for (let i = 0; i < stations.length; i++) {
      const op = stations[i].o || 'Unbekannt';
      counts.set(op, (counts.get(op) || 0) + 1);
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 30)
      .map(entry => entry[0]);
  }, [stations]);

  // Filter pipeline
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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedState, selectedOperator, hpcOnly, minKw]);

  // Pagination slice
  const totalPages = Math.ceil(filteredStations.length / PAGE_SIZE) || 1;
  const paginatedStations = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStations.slice(start, start + PAGE_SIZE);
  }, [filteredStations, currentPage]);

  const hpcCountFiltered = useMemo(() => {
    return filteredStations.filter(s => s.k >= 150).length;
  }, [filteredStations]);

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
        "description": "Vollständiges Register aller öffentlich registrierten BNetzA-Ladestationen in Deutschland. Durchsuchbar nach Ort, PLZ, Bundesland, Betreiber und HPC-Leistung.",
        "url": "https://www.ladestandorte.de/ladestationen"
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <SEO
        title="Bundesweites BNetzA-Ladestationsverzeichnis: Alle Ladestationen in Deutschland"
        description="Durchsuche alle 117.043 öffentlich registrierten BNetzA-Ladestationen in ganz Deutschland nach Bundesland, Ort, PLZ, Betreiber und HPC-Schnellladeleistung."
        canonicalPath="/ladestationen"
        schema={schema}
      />

      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Ladestationen Deutschland', isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#C7F000] text-[#171917] text-xs font-mono font-bold">
            <Database className="w-3.5 h-3.5" />
            <span>OFFIZIELLES BNETZA-GESAMTVERZEICHNIS</span>
          </div>
        }
        title="Bundesweites Ladestationsverzeichnis"
        subtitle={`Vollständiges amtliches Register aller 117.043 gemeldeten Ladestationen in Deutschland (Stand: ${getSnapshotDateFormatted()})`}
      />

      {/* Distinction & Provenance Box */}
      <div className="bg-white p-6 rounded-2xl border border-[#DFE3DC] shadow-xs space-y-3">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#2F5E73] shrink-0 mt-0.5" />
          <div className="text-xs text-[#6C716B] leading-relaxed space-y-1">
            <strong className="text-[#171917] font-semibold block text-sm">
              Amtliche Bundesnetzagentur-Datenbasis (Ebene B)
            </strong>
            <p>
              Dieses Verzeichnis umfasst sämtliche öffentlich zugänglichen Ladestationen in Deutschland – von Großstädten über ländliche Gemeinden bis hin zu Gewerbegebieten und Autohöfen. Die Daten stammen direkt aus dem amtlichen Ladesäulenregister der Bundesnetzagentur.
            </p>
            <p className="text-[#2F5E73] font-medium">
              Hinweis: Redaktionell begutachtete Ladeparks mit Fotos, Ladekurven und Ausstattung finden Sie unter den <Link to="/suche" className="underline font-bold text-[#171917]">Redaktionellen Dossiers</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#DFE3DC] shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#6C716B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Ort, PLZ, Straße, Betreiber oder BNetzA-ID suchen (z. B. Montabaur, 56410, Tesla)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-sm text-[#171917] placeholder-[#6C716B] focus:outline-none focus:border-[#171917] transition-colors"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-bold text-[#171917] focus:outline-none focus:border-[#171917]"
            >
              {BUNDESLAENDER.map(bl => (
                <option key={bl} value={bl}>{bl}</option>
              ))}
            </select>

            <select
              value={selectedOperator}
              onChange={e => setSelectedOperator(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-bold text-[#171917] focus:outline-none focus:border-[#171917] max-w-[200px] truncate"
            >
              <option value="Alle Betreiber">Alle Betreiber</option>
              {topOperators.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>

            <select
              value={minKw}
              onChange={e => setMinKw(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-bold text-[#171917] focus:outline-none focus:border-[#171917]"
            >
              <option value="0">Alle Leistungen</option>
              <option value="22">ab 22 kW</option>
              <option value="50">ab 50 kW (DC)</option>
              <option value="150">ab 150 kW (HPC)</option>
              <option value="300">ab 300 kW (Ultra-HPC)</option>
            </select>

            <button
              onClick={() => setHpcOnly(!hpcOnly)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                hpcOnly 
                  ? 'bg-[#171917] text-[#C7F000]' 
                  : 'bg-[#F7F7F2] text-[#6C716B] border border-[#DFE3DC] hover:text-[#171917]'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Nur HPC (≥150 kW)</span>
            </button>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-[#6C716B] pt-2 border-t border-[#DFE3DC]/60">
          <span>
            {loading ? (
              'Lade bundesweites Verzeichnis...'
            ) : (
              <>
                <strong className="text-[#171917] font-semibold">{filteredStations.length.toLocaleString('de-DE')}</strong> Ladestationen gefunden
                {hpcCountFiltered > 0 && ` (davon ${hpcCountFiltered.toLocaleString('de-DE')} mit HPC ≥150 kW)`}
              </>
            )}
          </span>
          <span>
            Seite {currentPage} von {totalPages} (50 Einträge pro Seite)
          </span>
        </div>
      </div>

      {/* Directory Table / Cards */}
      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-sm font-mono text-[#6C716B] bg-white rounded-2xl border border-[#DFE3DC]">
            Lade 117.043 amtliche BNetzA-Ladestationen...
          </div>
        ) : paginatedStations.length === 0 ? (
          <div className="p-12 text-center text-sm text-[#6C716B] bg-white rounded-2xl border border-[#DFE3DC] space-y-2">
            <p className="font-bold text-[#171917]">Keine Ladestationen für diese Filterkriterien gefunden.</p>
            <p className="text-xs">Versuchen Sie die Filter zurückzusetzen oder nach einer anderen PLZ / Gemeinde zu suchen.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {paginatedStations.map(st => {
              const isHpc = st.k >= 150;
              const linkUrl = `/ladestation-register/${st.cs}/${st.i}`;

              return (
                <div
                  key={st.i}
                  className="bg-white p-4 rounded-xl border border-[#DFE3DC] hover:border-[#171917] transition-all flex flex-col justify-between gap-3 group"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-[#171917] group-hover:text-[#2F5E73] transition-colors truncate">
                        {st.o}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0 ${
                        isHpc ? 'bg-[#C7F000] text-[#171917]' : 'bg-[#F7F7F2] text-[#6C716B] border border-[#DFE3DC]'
                      }`}>
                        {st.k} kW {isHpc ? 'HPC' : 'AC'}
                      </span>
                    </div>

                    <div className="text-xs font-medium text-[#171917] flex items-center gap-1.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#6C716B] shrink-0" />
                      <span className="truncate">{st.s ? `${st.s}, ` : ''}{st.p} {st.c}</span>
                    </div>

                    <div className="text-[11px] text-[#6C716B] flex items-center gap-2">
                      <span>{st.st || 'Deutschland'}</span>
                      <span>·</span>
                      <span>{st.n} {st.n === 1 ? 'Ladepunkt' : 'Ladepunkte'}</span>
                      <span>·</span>
                      <span className="font-mono">ID: {st.i}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DFE3DC]/40 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-mono text-[#6C716B]">BNetzA-Register</span>
                    <Link
                      to={linkUrl}
                      className="inline-flex items-center gap-1 font-bold text-[#171917] group-hover:text-[#2F5E73] transition-colors"
                    >
                      <span>Details & Daten</span>
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
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl bg-white border border-[#DFE3DC] text-xs font-bold text-[#171917] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Vorherige Seite</span>
            </button>

            <span className="text-xs text-[#6C716B] font-mono">
              Seite {currentPage} von {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl bg-white border border-[#DFE3DC] text-xs font-bold text-[#171917] disabled:opacity-40 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
            >
              <span>Nächste Seite</span>
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
