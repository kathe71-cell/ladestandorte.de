import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Zap,
  Filter,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  MapPin,
  ExternalLink,
  Activity,
  Layers,
  Scale,
  Building2,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { STATIONS_DATA, getMcsStations, getStationUrl, McsStatus } from '../data/stations';
import { getMcsMonitorMetrics } from '../data/mcsMetrics';
import { PageHero } from '../components/PageHero';
import { SEO } from '../components/SEO';

export const McsStationsPage: React.FC = () => {
  const allMcsStations = useMemo(() => getMcsStations(STATIONS_DATA), []);
  const metrics = useMemo(() => getMcsMonitorMetrics(STATIONS_DATA), []);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [operatorFilter, setOperatorFilter] = useState<string>('all');
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  const operators = useMemo(() => {
    return metrics.operatorDistribution.map((o) => o.operator);
  }, [metrics]);

  const filteredStations = useMemo(() => {
    return allMcsStations.filter((s) => {
      if (statusFilter !== 'all' && s.truckCharging?.mcsStatus !== statusFilter) {
        return false;
      }
      if (operatorFilter !== 'all' && s.operator !== operatorFilter) {
        return false;
      }
      return true;
    });
  }, [allMcsStations, statusFilter, operatorFilter]);

  const citationText = `ladestandorte.de: „MCS-Monitor Deutschland – Dokumentierte MCS- und E-Lkw-Ladeinfrastruktur“, ${
    metrics.datasetDateFormatted ? `Datenstand: ${metrics.datasetDateFormatted}, ` : ''
  }https://www.ladestandorte.de/mcs/ladestationen`;

  const handleCopyCitation = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(citationText);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    }
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Startseite",
            "item": "https://www.ladestandorte.de/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "MCS & E-Lkw",
            "item": "https://www.ladestandorte.de/mcs"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "MCS-Monitor",
            "item": "https://www.ladestandorte.de/mcs/ladestationen"
          }
        ]
      },
      {
        "@type": "ItemList",
        "name": "MCS-Monitor Deutschland – Dokumentierte Standorte für E-Lkw",
        "description": "Quellenbasierte Übersicht der von ladestandorte.de dokumentierten Standorte für Megawatt- und Hochleistungs-Schwerlastladen in Deutschland.",
        "numberOfItems": allMcsStations.length,
        "itemListElement": allMcsStations.map((station, index) => {
          const isMcsActive = station.truckCharging?.mcsStatus === 'operational';
          const descriptionText = isMcsActive
            ? `E-Lkw Megawatt-Hub mit bis zu ${station.kwMax} kW Ladeleistung in ${station.city}. Betreiber: ${station.operator}.`
            : `Schwerlast-Ladepark für E-Lkw (400 kW CCS aktiv, MCS-Erweiterung geplant) in ${station.city}. Betreiber: ${station.operator}.`;

          return {
            "@type": "ListItem",
            "position": index + 1,
            "item": {
              "@type": "ChargingStation",
              "name": station.name,
              "url": `https://www.ladestandorte.de${getStationUrl(station)}`,
              "description": descriptionText,
              "address": {
                "@type": "PostalAddress",
                "streetAddress": station.street,
                "postalCode": station.plz,
                "addressLocality": station.city,
                "addressCountry": "DE"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": station.lat,
                "longitude": station.lng
              },
              "provider": {
                "@type": "Organization",
                "name": station.operator,
                "url": `https://www.ladestandorte.de/betreiber/${station.operatorSlug}`
              }
            }
          };
        })
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="MCS-Monitor Deutschland: Dokumentierte MCS- & E-Lkw-Ladestationen (2026)"
        description="Quellenbasierte Übersicht der von ladestandorte.de dokumentierten Standorte für Megawatt- und Hochleistungs-Schwerlastladen in Deutschland. Technische Kennzahlen, Status und Betreiber."
        canonicalPath="/mcs/ladestationen"
        schema={schema}
      />
      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'MCS & E-Lkw', href: '/mcs' },
          { label: 'MCS-Monitor', isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC] text-[#171917] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#2F5E73]"></span>
            <span>MONITOR / 03 · MCS MONITOR</span>
          </div>
        }
        title="MCS-Monitor Deutschland: Dokumentierte MCS- und E-Lkw-Ladeinfrastruktur"
        description="Quellenbasierte Übersicht der von ladestandorte.de dokumentierten Standorte für Megawatt- und Hochleistungs-Lkw-Laden in Deutschland. Jeder Standort führt zum detaillierten Hauptdossier mit technischen Spezifikationen, Geodaten und Quellennachweis."
      />

      {/* DATA STATUS BAR */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-slate-700 text-[#C7F000] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F000] animate-pulse"></span>
            Monitor-Status
          </span>
          <span className="text-slate-200">
            {metrics.datasetDateFormatted
              ? `Datenstand: redaktionell geprüft am ${metrics.datasetDateFormatted}`
              : (metrics.verificationDateRangeFormatted
                  ? `Standortbezogene redaktionelle Prüfstände (${metrics.verificationDateRangeFormatted})`
                  : 'Standortbezogene redaktionelle Prüfstände')}
          </span>
          <span className="text-slate-600">·</span>
          <span>{metrics.totalDocumented} dokumentierte Standorte</span>
          <span className="text-slate-600">·</span>
          <span>Quellenbasierter Datensatz</span>
        </div>
        <Link
          to="/methodik#mcs"
          className="text-[#C7F000] hover:underline font-semibold inline-flex items-center gap-1 transition-colors"
        >
          <span>Methodik &amp; Kriterien</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* PRIMARY KPI GRID (4 KENNZAHLEN) */}
      <section className="space-y-3">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Dokumentierte Standorte
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {metrics.totalDocumented}
            </div>
            <div className="text-xs text-slate-500 leading-snug">
              kuratierte E-Lkw-Hubs mit MCS-Bezug
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center justify-between">
              <span>MCS aktiv</span>
              <span className="w-2 h-2 rounded-full bg-[#C7F000] border border-black/20"></span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-[#171917] tracking-tight">
              {metrics.mcsOperational}
            </div>
            <div className="text-xs text-slate-500 leading-snug">
              im dokumentierten Datensatz ({metrics.operationalSharePercent} %)
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-amber-800 flex items-center justify-between">
              <span>MCS geplant</span>
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            </div>
            <div className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">
              {metrics.mcsPlanned}
            </div>
            <div className="text-xs text-slate-500 leading-snug">
              im dokumentierten Datensatz (Phase 2 / Bau)
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
              Max. operative MCS-Leistung
            </div>
            <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              {metrics.operationalMcsPowerMax ? `${(metrics.operationalMcsPowerMax / 1000).toLocaleString('de-DE', { maximumFractionDigits: 1 })} MW` : '—'}
            </div>
            <div className="text-xs text-slate-500 leading-snug">
              Spitzenleistung unter den aktiven Hubs
            </div>
          </div>
        </div>
      </section>

      {/* MCS ≠ CCS EXPLAINER & TECHNISCHER HINTERGRUND */}
      <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-slate-800 shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold text-slate-950">
            MCS und CCS getrennt betrachten
          </h2>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          Ein Schwerlast-Ladepark kann bereits für den elektrischen Straßengüterverkehr mit CCS in Betrieb sein, während die Megawatt-Kupplung (MCS) erst in der Nachrüstung oder Inbetriebnahmephase ist. Um Fehlinterpretationen zu vermeiden, differenziert ladestandorte.de strikt zwischen dem Gesamtstatus des Standorts und dem spezifischen MCS-Status:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
            <div className="font-bold text-slate-900 font-mono">
              CCS operativ: {metrics.ccsOperationalCount} von {metrics.totalDocumented} Standorten
            </div>
            <p className="text-slate-600 leading-relaxed">
              Alle {metrics.totalDocumented} dokumentierten Hubs sind physisch für Lkw geöffnet und speisen mit bis zu 400 kW CCS Ladestrom ein.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs space-y-1">
            <div className="font-bold text-slate-950 font-mono">
              MCS operativ: {metrics.mcsOperational} von {metrics.totalDocumented} Standorten
            </div>
            <p className="text-slate-700 leading-relaxed">
              {metrics.mcsOperational} Standorte verfügen über funktionsfähige MCS-Megawatt-Ladeeinrichtungen mit realem Betrieb (Aral pulse &amp; HoLa-Reallabor).
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 text-xs space-y-1">
            <div className="font-bold text-amber-950 font-mono">
              MCS geplant: {metrics.mcsPlanned} von {metrics.totalDocumented} Standorten
            </div>
            <p className="text-amber-900 leading-relaxed">
              {metrics.mcsPlanned} Standorte betreiben bereits 400 kW CCS für Lkw, haben die MCS-Megawatt-Erweiterung jedoch für Phase 2 angekündigt.
            </p>
          </div>
        </div>
      </section>

      {/* LEISTUNGSANALYSE & CCS-KONTEXT & BETREIBERVERTEILUNG */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEISTUNG DER OPERATIVEN MCS-STANDORTE */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-slate-800" />
              <h3 className="text-base font-bold text-slate-950">
                Leistung der operativen MCS-Standorte
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Berechnet ausschließlich aus den Standorten mit aktivem Megawatt-Ladebetrieb. Nicht mit geplanten Ausbauleistungen vermischt.
            </p>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Bandbreite</div>
                <div className="text-base font-bold text-slate-950 font-mono mt-0.5">
                  {metrics.operationalMcsPowerMin && metrics.operationalMcsPowerMax
                    ? `${metrics.operationalMcsPowerMin.toLocaleString('de-DE')}–${metrics.operationalMcsPowerMax.toLocaleString('de-DE')} kW`
                    : '—'}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Durchschnitt</div>
                <div className="text-base font-bold text-slate-950 font-mono mt-0.5">
                  {metrics.operationalMcsPowerAverage
                    ? `${metrics.operationalMcsPowerAverage.toLocaleString('de-DE')} kW`
                    : '—'}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
                <div className="text-[11px] font-mono text-slate-500 uppercase">Median</div>
                <div className="text-base font-bold text-slate-950 font-mono mt-0.5">
                  {metrics.operationalMcsPowerMedian
                    ? `${metrics.operationalMcsPowerMedian.toLocaleString('de-DE')} kW`
                    : '—'}
                </div>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-500 pt-1">
              Basis: {metrics.operationalMcsWithPowerCount} dokumentierte Standorte mit operativem MCS.
            </div>
          </div>

          <div className="p-3.5 bg-[#F7F7F2] rounded-xl border border-[#DFE3DC] text-xs text-slate-900 space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#2F5E73]" />
              <span>CCS bei den dokumentierten E-Lkw-Standorten</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              {metrics.allDocumentedHave400KwCcs
                ? `${metrics.totalDocumented} von ${metrics.totalDocumented} dokumentierten E-Lkw-Standorten verfügen über bis zu 400 kW CCS-Ladeleistung.`
                : 'Unterschiedliche CCS-Leistungsstufen im Datensatz dokumentiert.'}
            </p>
          </div>
        </div>

        {/* BETREIBERVERTEILUNG DER DOKUMENTIERTEN HUBS */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-slate-800" />
            <h3 className="text-base font-bold text-slate-950">
              Verteilung der dokumentierten Standorte nach Betreiber
            </h3>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Häufigkeit der Betreiber innerhalb des von ladestandorte.de dokumentierten Datensatzes (Basis: {metrics.totalDocumented} Standorte). Bildet die kuratierte Stichprobe ab und keine bundesweite Gesamtmarkterhebung.
          </p>

          <div className="space-y-3 pt-1">
            {metrics.operatorDistribution.map((op) => (
              <div key={op.operator} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-900">{op.operator}</span>
                  <span className="font-mono text-slate-600">
                    <strong className="text-slate-950">{op.count}</strong> von {metrics.totalDocumented} ({op.sharePercent} %)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-slate-900 rounded-full transition-all duration-300"
                    style={{ width: `${(op.count / metrics.totalDocumented) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 font-mono">
            Eignung für Sattelzüge: {metrics.trailerAccessibleCount} von {metrics.totalDocumented} Standorten mit Durchfahrtsspuren (100 %).
          </div>
        </div>
      </section>

      {/* FILTER-LEISTE */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">MCS-Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-900 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Alle ({allMcsStations.length})</option>
              <option value="operational">MCS Aktiv ({metrics.mcsOperational})</option>
              <option value="planned">MCS Geplant ({metrics.mcsPlanned})</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-2xs">
            <span className="font-semibold text-slate-700">Betreiber:</span>
            <select
              value={operatorFilter}
              onChange={(e) => setOperatorFilter(e.target.value)}
              className="bg-transparent font-medium text-slate-900 focus:outline-hidden cursor-pointer"
            >
              <option value="all">Alle Betreiber ({operators.length})</option>
              {operators.map((op) => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          {(statusFilter !== 'all' || operatorFilter !== 'all') && (
            <button
              onClick={() => { setStatusFilter('all'); setOperatorFilter('all'); }}
              className="text-xs text-slate-800 font-semibold hover:underline"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>

        <div className="text-xs font-mono text-slate-500">
          Gefiltert: <strong className="text-slate-950">{filteredStations.length}</strong> von {metrics.totalDocumented} Standorten
        </div>
      </div>

      {/* MONITOR STATION TABLE (DESKTOP) & CARDS (MOBILE) */}
      <section className="space-y-4">
        {/* Desktop Table View (ab md) */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-mono uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 font-bold text-slate-900">Standort</th>
                <th className="py-3.5 px-3 font-bold text-slate-900">Autobahn</th>
                <th className="py-3.5 px-3 font-bold text-slate-900">Betreiber</th>
                <th className="py-3.5 px-3 font-bold text-slate-900">MCS-Status</th>
                <th className="py-3.5 px-3 font-bold text-slate-900">MCS-Leistung</th>
                <th className="py-3.5 px-3 font-bold text-slate-900">CCS-Standard</th>
                <th className="py-3.5 px-3 font-bold text-slate-900">Eignung</th>
                <th className="py-3.5 px-3 font-bold text-slate-900">Quelle</th>
                <th className="py-3.5 px-4 text-right font-bold text-slate-900">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStations.map((st) => {
                const isMcsActive = st.truckCharging?.mcsStatus === 'operational';
                const mcsKwDisplay = st.truckCharging?.mcsMaxKw
                  ? `${st.truckCharging.mcsMaxKw.toLocaleString('de-DE')} kW`
                  : '—';
                const ccsKwDisplay = st.truckCharging?.ccsMaxKw
                  ? `${st.truckCharging.ccsMaxKw} kW · aktiv`
                  : `${st.kwMax} kW`;

                return (
                  <tr key={st.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-slate-950">
                      <div>{st.name}</div>
                      <div className="text-[11px] font-normal text-slate-500">
                        {st.plz} {st.city}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900 uppercase">
                      {st.motorway || '—'}
                    </td>
                    <td className="py-3.5 px-3 text-slate-700">
                      {st.operator}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${
                        isMcsActive
                          ? 'bg-[#F7F7F2] text-[#171917] border-[#DFE3DC]'
                          : 'bg-amber-50 text-amber-950 border-amber-300'
                      }`}>
                        {isMcsActive ? '● MCS aktiv' : '○ MCS geplant'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">
                      {mcsKwDisplay}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-700">
                      {ccsKwDisplay}
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      <div className="flex flex-col gap-0.5 text-[11px] font-mono">
                        <span>{st.truckCharging?.driveThrough ? '✓ Drive-Through' : '—'}</span>
                        <span>{st.truckCharging?.trailerAccessible ? '✓ Sattelzug' : '—'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-[11px] text-slate-500">
                      {st.truckCharging?.sourceUrl ? (
                        <a
                          href={st.truckCharging.sourceUrl}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[#2F5E73] hover:text-[#171917] underline font-medium"
                          title={st.truckCharging.source}
                        >
                          <span>{st.truckCharging.provenance === 'official-operator' ? 'Betreiber' : 'HoLa-Projekt'}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span>{st.truckCharging?.provenance || 'Dokumentiert'}</span>
                      )}
                      <div className="font-mono text-[10px] text-slate-500">
                        Geprüft: {st.truckCharging?.lastVerifiedAt || '—'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to={getStationUrl(st)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-[#171917] text-slate-900 hover:text-white text-xs font-bold transition-colors font-mono"
                      >
                        <span>Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View (unter md) */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {filteredStations.map((st) => {
            const isMcsActive = st.truckCharging?.mcsStatus === 'operational';
            const mcsKwDisplay = st.truckCharging?.mcsMaxKw
              ? `${st.truckCharging.mcsMaxKw.toLocaleString('de-DE')} kW`
              : '—';
            const ccsKwDisplay = st.truckCharging?.ccsMaxKw
              ? `${st.truckCharging.ccsMaxKw} kW (aktiv)`
              : `${st.kwMax} kW`;

            return (
              <div
                key={st.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-950 text-base leading-snug">
                      {st.name}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {st.plz} {st.city} · Autobahn {st.motorway?.toUpperCase() || '—'}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0 border ${
                    isMcsActive
                      ? 'bg-[#F7F7F2] text-[#171917] border-[#DFE3DC]'
                      : 'bg-amber-50 text-amber-950 border-amber-300'
                  }`}>
                    {isMcsActive ? '● MCS aktiv' : '○ MCS geplant'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-slate-100 font-mono">
                  <div>
                    <span className="text-slate-500 block text-[11px]">MCS-Leistung</span>
                    <span className="font-bold text-slate-950">{mcsKwDisplay}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">CCS-Standard</span>
                    <span className="font-bold text-slate-950">{ccsKwDisplay}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Betreiber</span>
                    <span className="text-slate-800">{st.operator}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Eignung</span>
                    <span className="text-slate-800">
                      {st.truckCharging?.driveThrough ? 'Drive-Through' : 'Rückwärts'} · 40t
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <div className="text-[11px] text-slate-500 font-mono">
                    Geprüft am: {st.truckCharging?.lastVerifiedAt || '—'}
                  </div>
                  <Link
                    to={getStationUrl(st)}
                    className="inline-flex items-center gap-1 font-bold text-[#171917] hover:underline"
                  >
                    <span>Standort-Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* DIESEN DATENSATZ ZITIEREN (CITATION BOX) */}
      <section className="bg-slate-50 rounded-2xl border border-slate-200 p-6 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-800" />
            <h3 className="text-sm font-bold text-slate-950">
              Diesen Datensatz zitieren
            </h3>
          </div>
          <button
            onClick={handleCopyCitation}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:text-slate-950 text-xs font-semibold shadow-2xs transition-colors"
          >
            {copiedCitation ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#2F5E73]" />
                <span>Zitiervorschlag kopiert</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Zitiervorschlag kopieren</span>
              </>
            )}
          </button>
        </div>
        <div className="p-3 bg-white rounded-xl border border-slate-200/80 font-mono text-xs text-slate-800 leading-relaxed select-all">
          {citationText}
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Die Übersicht bildet den von ladestandorte.de dokumentierten Datensatz ab und erhebt keinen Anspruch auf Vollständigkeit des deutschen Gesamtmarktes.
        </p>
      </section>

      {/* METHODIK & KANONISCHE DATENFÜHRUNG */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
        <div className="flex items-center gap-1.5 font-bold text-slate-900">
          <ShieldCheck className="w-4 h-4 text-[#2F5E73]" />
          <span>Kanonische Datenführung &amp; Aufnahmekriterien</span>
        </div>
        <p>
          Dieses Datenprodukt listet von ladestandorte.de dokumentierte Pilotstandorte mit E-Lkw- und MCS-Infrastruktur auf. Die verlinkten Standortdossiers liegen auf den kanonischen URLs <code>/ladestation/[ort]/[slug]</code> und bündeln die BNetzA-Registerbasisdaten mit den dokumentierten Betreiber- und Projektangaben zur Schwerlast-Ladeinfrastruktur. Details zu Kriterien, Statusunterscheidung und Leistungsberechnung in der <Link to="/methodik#mcs" className="text-[#171917] hover:underline font-semibold underline">Methodik</Link>.
        </p>
      </div>
    </div>
  );
};

export default McsStationsPage;
