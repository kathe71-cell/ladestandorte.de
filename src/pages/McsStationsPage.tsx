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
  ExternalLink
} from 'lucide-react';
import { STATIONS_DATA, getMcsStations, getStationUrl, McsStatus } from '../data/stations';
import { PageHero } from '../components/PageHero';
import { SEO } from '../components/SEO';

export const McsStationsPage: React.FC = () => {
  const allMcsStations = useMemo(() => getMcsStations(STATIONS_DATA), []);

  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [operatorFilter, setOperatorFilter] = useState<string>('all');

  const operators = useMemo(() => {
    const ops = new Set<string>();
    allMcsStations.forEach((s) => ops.add(s.operator));
    return Array.from(ops);
  }, [allMcsStations]);

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
            "name": "Standortverzeichnis",
            "item": "https://www.ladestandorte.de/mcs/ladestationen"
          }
        ]
      },
      {
        "@type": "ItemList",
        "name": "MCS- & E-Lkw-Ladestationen in Deutschland",
        "description": "Verzeichnis aller verifizierten Megawatt- und Schwerlast-Ladeparks für Elektro-Lkw entlang deutscher Bundesautobahnen.",
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
        title="MCS- & E-Lkw-Ladestationen in Deutschland (2026)"
        description="Geprüfte Dossiers aller Pilotstandorte für Megawatt- und Hochleistungs-Schwerlastladen entlang deutscher Bundesautobahnen."
        canonicalPath="/mcs/ladestationen"
        schema={schema}
      />
      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'MCS & E-Lkw', href: '/mcs' },
          { label: 'Standortverzeichnis', isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-mono font-bold">
            <Truck className="w-4 h-4 text-emerald-800" />
            <span>Verifiziertes Standortverzeichnis</span>
          </div>
        }
        title="MCS- & E-Lkw-Ladestationen in Deutschland"
        description="Geprüfte Dossiers aller Pilotstandorte für Megawatt- und Hochleistungs-Schwerlastladen. Jeder Standort führt zum detaillierten Hauptdossier mit technischen Kennzahlen, Geodaten und Provenance-Nachweis."
      />

      {/* Filters */}
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
                <option value="operational">MCS Aktiv in Betrieb</option>
                <option value="under-construction">MCS Im Bau / Vorbereitung</option>
                <option value="planned">MCS Geplant</option>
              </select>
            </div>

            <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200 text-xs shadow-2xs">
              <span className="font-semibold text-slate-700">Betreiber:</span>
              <select
                value={operatorFilter}
                onChange={(e) => setOperatorFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-900 focus:outline-hidden cursor-pointer"
              >
                <option value="all">Alle Betreiber</option>
                {operators.map((op) => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>
            </div>

            {(statusFilter !== 'all' || operatorFilter !== 'all') && (
              <button
                onClick={() => { setStatusFilter('all'); setOperatorFilter('all'); }}
                className="text-xs text-emerald-800 font-semibold hover:underline"
              >
                Filter zurücksetzen
              </button>
            )}
          </div>

        {/* Main List */}
        <div className="space-y-6">
        <div className="text-xs font-mono text-slate-500">
          Gefunden: <span className="font-bold text-slate-950">{filteredStations.length}</span> Ladestandorte
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStations.map((st) => {
            const isMcsActive = st.truckCharging?.mcsStatus === 'operational';
            const isLocationActive = st.truckCharging?.locationStatus === 'operational';
            return (
              <div
                key={st.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between p-5 group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0 border ${
                      isMcsActive
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-amber-50 text-amber-950 border-amber-300'
                    }`}>
                      {isMcsActive ? '● MCS Aktiv' : st.truckCharging?.mcsStatus === 'planned' ? '○ MCS geplant' : '○ MCS im Ausbau'}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">
                      {isMcsActive && st.truckCharging?.mcsMaxKw 
                        ? `${st.truckCharging.mcsMaxKw} kW MCS` 
                        : `${st.truckCharging?.ccsMaxKw || st.kwMax} kW CCS`}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-slate-950 group-hover:text-emerald-800 transition-colors line-clamp-1 mb-1">
                    {st.name}
                  </h2>

                  <p className="text-xs text-slate-500 mb-3">
                    {st.street}, {st.plz} {st.city} · {st.operator}
                  </p>

                  {/* Attributes Matrix */}
                  <div className="space-y-1.5 py-3 border-y border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">MCS-Stecker:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {st.truckCharging?.mcsAvailable ? 'Ja (1.000+ kW aktiv)' : 'Geplant / Vorbereitung'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Ladebuchten:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {st.truckCharging?.mcsPointsCount 
                          ? `${st.truckCharging.mcsPointsCount} MCS-Buchten` 
                          : `${st.pointsCount} Durchfahrtsbuchten`}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Durchfahrtsfähig:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {st.truckCharging?.driveThrough ? 'Ja (Drive-Through)' : 'Rückwärts-Einparken'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Sattelzug ohne Abkuppeln:</span>
                      <span className="font-mono font-bold text-slate-900">
                        {st.truckCharging?.trailerAccessible ? 'Ja (bis 40 t)' : 'Prüfung erforderlich'}
                      </span>
                    </div>
                  </div>

                  {st.exitDistance && (
                    <div className="mt-2 text-[11px] font-mono text-slate-600">
                      📍 {st.exitDistance}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Quelle: {st.truckCharging?.provenance === 'official-operator' ? 'Betreiber' : 'HoLa-Forschung'}
                  </span>
                  <Link
                    to={getStationUrl(st)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
                  >
                    <span>Standort-Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Notice regarding canonical URLs */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kanonische Datenführung &amp; Aufnahmekriterien</span>
          </div>
          <p>
            Dieses Verzeichnis listet von ladestandorte.de dokumentierte Pilotstandorte mit E-Lkw- und MCS-Infrastruktur auf. Die verlinkten Standortdossiers liegen auf den kanonischen URLs <code>/ladestation/[ort]/[slug]</code> und bündeln die BNetzA-Registerbasisdaten mit den dokumentierten Betreiber- und Projektangaben zur Schwerlast-Ladeinfrastruktur. Details zu Kriterien und Status in der <Link to="/methodik#mcs" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Methodik</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default McsStationsPage;
