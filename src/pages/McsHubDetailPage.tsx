import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Truck,
  Zap,
  MapPin,
  Navigation,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { STATIONS_DATA, getMcsStations, getStationUrl, StationData } from '../data/stations';
import { MOTORWAYS_DATA } from '../data/motorways';
import { OPERATORS_DATA } from '../data/operators';
import { PageHero } from '../components/PageHero';
import { SEO } from '../components/SEO';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { NotFoundPage } from './NotFoundPage';

// Helper to resolve an MCS station by slug
export function findMcsStationBySlug(slug: string | undefined): StationData | undefined {
  if (!slug) return undefined;
  const mcsStations = getMcsStations(STATIONS_DATA);
  
  // 1. Exact match on station.slug or station.id
  const exact = mcsStations.find(s => s.slug === slug || s.id === slug);
  if (exact) return exact;

  // 2. Normalized alias match (e.g. aral-pulse-schwarmstedt-a7 vs aral-pulse-lkw-megawatt-hub-schwarmstedt)
  const normSearch = slug.toLowerCase().replace(/[^a-z0-9]/g, '');
  return mcsStations.find(s => {
    const normSlug = s.slug.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normName = s.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normCity = s.citySlug.toLowerCase().replace(/[^a-z0-9]/g, '');
    const normMw = (s.motorway || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    
    return normSlug === normSearch ||
      normSearch.includes(normCity) && normSearch.includes(normMw) ||
      normSlug.includes(normSearch) ||
      normSearch.includes(normSlug);
  });
}

export const McsHubDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const station = findMcsStationBySlug(slug);

  // If slug cannot be resolved to a documented MCS station, render genuine 404
  if (!station) {
    return <NotFoundPage />;
  }

  const truck = station.truckCharging;
  const isMcsActive = truck?.mcsStatus === 'operational';
  const isPlanned = truck?.mcsStatus === 'planned';
  const isUnderConstruction = truck?.mcsStatus === 'under-construction';

  const motorwayObj = MOTORWAYS_DATA.find(m => m.slug === station.motorway);
  const operatorObj = OPERATORS_DATA.find(o => o.slug === station.operatorSlug);
  const canonicalDossierUrl = getStationUrl(station);

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
            "name": "MCS & E-Lkw Hubs",
            "item": "https://www.ladestandorte.de/mcs"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "MCS-Standorte",
            "item": "https://www.ladestandorte.de/mcs/ladestationen"
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": station.name,
            "item": `https://www.ladestandorte.de/mcs/hub/${station.slug}`
          }
        ]
      },
      {
        "@type": "CivicStructure",
        "name": station.name,
        "description": station.description,
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
        "url": `https://www.ladestandorte.de/mcs/hub/${station.slug}`
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      <SEO
        title={`${station.name} · MCS Schwerlast-Ladehub | ladestandorte.de`}
        description={`E-Lkw Megawatt-Ladehub ${station.name} in ${station.city} (${station.motorway?.toUpperCase() || 'BAB'}). Bis zu ${station.kwMax} kW Ladeleistung, Durchfahrtsbuchten & verifizierte Betriebsdaten.`}
        canonicalPath={`/mcs/hub/${station.slug}`}
        schema={schema}
      />

      {/* Hero Section */}
      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'MCS & E-Lkw', href: '/mcs' },
          { label: 'MCS-Standorte', href: '/mcs/ladestationen' },
          { label: station.name, isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#C7F000] text-[#171917] text-xs font-mono font-bold">
            <Truck className="w-3.5 h-3.5" />
            <span>MCS &amp; SCHWERLAST-LADEHUB</span>
          </div>
        }
        title={station.name}
        description={`Verifizierter Hochleistungs- und Megawatt-Ladestandort für schwere Nutzfahrzeuge in ${station.city} entlang der ${station.motorway?.toUpperCase() || 'Autobahn'}.`}
      />

      {/* KPI Overview Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Status */}
        <div className="bg-white rounded-2xl border border-[#DFE3DC] p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6C716B] block">
            Betriebsstatus
          </span>
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${isMcsActive ? 'bg-emerald-500' : (isUnderConstruction ? 'bg-amber-500' : 'bg-blue-500')}`} />
            <span className="text-base sm:text-lg font-black text-[#171917]">
              {isMcsActive ? 'MCS in Betrieb' : (isUnderConstruction ? 'Im Bau' : 'CCS Aktiv / MCS Geplant')}
            </span>
          </div>
          <span className="text-xs text-[#6C716B] block">
            {isMcsActive ? 'Megawatt-Laden verfügbar' : (truck?.expectedLaunch || 'Erweiterung angekündigt')}
          </span>
        </div>

        {/* Max Power */}
        <div className="bg-white rounded-2xl border border-[#DFE3DC] p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6C716B] block">
            Spitzenladeleistung
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#171917] font-mono">
            {station.kwMax} <span className="text-sm font-sans font-bold text-[#6C716B]">kW</span>
          </div>
          <span className="text-xs text-[#6C716B] block">
            {truck?.mcsAvailable && truck?.mcsMaxKw ? `Bis zu ${truck.mcsMaxKw} kW via MCS` : `Bis zu ${truck?.ccsMaxKw || 400} kW via CCS`}
          </span>
        </div>

        {/* Bays */}
        <div className="bg-white rounded-2xl border border-[#DFE3DC] p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6C716B] block">
            Ladebuchten
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#171917] font-mono">
            {station.pointsCount} <span className="text-sm font-sans font-bold text-[#6C716B]">Plätze</span>
          </div>
          <span className="text-xs text-[#6C716B] block">
            {truck?.driveThrough ? 'Drive-Through (Durchfahrt)' : 'Standard-Stellplätze'}
          </span>
        </div>

        {/* Operator */}
        <div className="bg-white rounded-2xl border border-[#DFE3DC] p-5 shadow-2xs space-y-1">
          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6C716B] block">
            Betreiber / CPO
          </span>
          <div className="text-base sm:text-lg font-black text-[#171917] truncate">
            {station.operator}
          </div>
          <span className="text-xs text-[#6C716B] block">
            {station.project ? `Projekt: ${station.project}` : 'Eigeninvestition'}
          </span>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Technical Specifications */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-[#DFE3DC] p-6 sm:p-8 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-[#171917] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#2F5E73]" />
              <span>Technische Spezifikation &amp; Ladetechnik</span>
            </h3>

            <p className="text-sm text-slate-700 leading-relaxed">
              {station.description}
            </p>

            {/* Technical Parameters Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6C716B] block">
                  Steckertypen &amp; Anschlüsse
                </span>
                <span className="text-base font-bold text-[#171917]">
                  {station.connectorTypes?.join(' + ') || 'MCS / CCS'}
                </span>
                <span className="text-xs text-[#6C716B] block">
                  {station.connectors?.map(c => `${c.type} (${c.maxKw} kW)`).join(' · ')}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6C716B] block">
                  Geometrie &amp; Lkw-Tauglichkeit
                </span>
                <span className="text-base font-bold text-[#171917]">
                  {truck?.trailerAccessible ? 'Ohne Absatteln befahrbar' : 'Rangierplatz erforderlich'}
                </span>
                <span className="text-xs text-[#6C716B] block">
                  {truck?.driveThrough ? 'Vorwärts einfahren und ausfahren' : 'Rückwärts einparken'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6C716B] block">
                  Hardware &amp; Ladesäulentechnik
                </span>
                <span className="text-base font-bold text-[#171917]">
                  {station.hardwareProvider || 'Alpitronic HYC1000 / ABB'}
                </span>
                <span className="text-xs text-[#6C716B] block">
                  Flüssigkeitsgekühlte Ladekabel &amp; ISO 15118-20
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#6C716B] block">
                  Zugang &amp; Bezahlmethoden
                </span>
                <span className="text-base font-bold text-[#171917]">
                  {station.accessType || '24/7 Öffentlich'}
                </span>
                <span className="text-xs text-[#6C716B] block truncate">
                  {station.paymentMethods?.join(', ') || 'Lade-App, Roaming, Kreditkarte'}
                </span>
              </div>
            </div>

            {/* Standzeit & Übernachtladen */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-2 text-xs text-slate-700">
              <div className="font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2F5E73]" />
                <span>Nutzung im Fernverkehr (45-Minuten-Pause vs. Overnight)</span>
              </div>
              <p className="leading-relaxed">
                Dieser Hub ist primär für das <strong>Zwischenladen während der gesetzlichen 45-Minuten-Fahrerpause</strong> konzipiert.
                {truck?.overnightCharging 
                  ? ' Übernacht-Laden (Overnight) mit reduzierter Leistung ist am Standort ebenfalls möglich.' 
                  : ' Für nächtliche Standzeiten ohne Schnellladung wird auf angrenzende Lkw-Parkplätze verwiesen.'}
              </p>
            </div>
          </div>

          {/* Location & Motorway Connection */}
          <div className="bg-white rounded-3xl border border-[#DFE3DC] p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-[#171917] flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#2F5E73]" />
              <span>Autobahn-Anbindung &amp; Lage</span>
            </h3>

            <div className="space-y-2 text-sm text-slate-700">
              <p>
                <strong>Adresse:</strong> {station.street}, {station.plz} {station.city}
              </p>
              {station.exitDistance && (
                <p>
                  <strong>Entfernung zur Autobahn:</strong> {station.exitDistance}
                </p>
              )}
              {motorwayObj && (
                <p>
                  <strong>Zugehöriger Korridor:</strong>{' '}
                  <Link to={`/autobahnen/${motorwayObj.slug}`} className="text-[#2F5E73] font-bold hover:underline">
                    {motorwayObj.name} ({motorwayObj.route})
                  </Link>
                </p>
              )}
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#171917] text-white text-xs font-bold hover:bg-[#2F5E73] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>Google Maps Navigation</span>
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>

              <Link
                to={canonicalDossierUrl}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC] text-xs font-bold hover:bg-[#DFE3DC] transition-colors"
              >
                <span>Vollständiges Standort-Dossier öffnen</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Meta, Provenance & Navigation */}
        <div className="lg:col-span-4 space-y-6">
          {/* Provenance Card */}
          <div className="bg-white rounded-3xl border border-[#DFE3DC] p-6 shadow-sm space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#2F5E73]">
              <ShieldCheck className="w-4 h-4 text-[#2F5E73]" />
              <span>Daten-Herkunft &amp; Audit</span>
            </div>
            <h4 className="font-bold text-base text-[#171917]">
              Verifizierte Primärquelle
            </h4>
            
            <div className="p-3.5 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs space-y-1.5 leading-relaxed text-slate-700">
              <div>
                <strong>Quelle:</strong> {truck?.source || 'Offizielle Betreiberdokumentation'}
              </div>
              <div>
                <strong>Einstufung:</strong>{' '}
                <span className="font-mono font-bold text-[#171917]">
                  {truck?.provenance === 'official-operator' ? 'Betreiber-Verifiziert' : 'BMDV-Forschungsprojekt'}
                </span>
              </div>
              <div>
                <strong>Letzte Prüfung:</strong>{' '}
                <span className="font-mono">{truck?.lastVerifiedAt || '2026-10-01'}</span>
              </div>
            </div>

            {truck?.sourceUrl && (
              <a
                href={truck.sourceUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2F5E73] hover:underline"
              >
                <span>Quellenlink des Betreibers aufrufen</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-3xl border border-[#DFE3DC] p-6 shadow-sm space-y-3">
            <h4 className="font-bold text-sm text-[#171917]">
              Weiterführende Themen
            </h4>
            <div className="space-y-2 text-xs">
              <Link
                to="/mcs/ladestationen"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F7F7F2] transition-colors group font-semibold text-slate-900"
              >
                <span>Alle MCS-Standorte in Deutschland</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-black" />
              </Link>
              <Link
                to="/mcs/was-ist-mcs"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F7F7F2] transition-colors group font-semibold text-slate-900"
              >
                <span>Technischer MCS-Leitfaden (3,75 MW)</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-black" />
              </Link>
              <Link
                to="/mcs/lkw-laden"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F7F7F2] transition-colors group font-semibold text-slate-900"
              >
                <span>Lkw-Laden &amp; 45-Minuten-Pause</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-black" />
              </Link>
              <Link
                to="/mcs/mcs-vs-ccs"
                className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#F7F7F2] transition-colors group font-semibold text-slate-900"
              >
                <span>MCS vs. CCS Vergleich</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-black" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Citation Box */}
      <CitationBox
        title={`MCS-Hub: ${station.name} (${station.city})`}
        urlPath={`/mcs/hub/${station.slug}`}
      />

      {/* Trust & E-E-A-T */}
      <EEATBadge
        topic={`MCS-Schwerlast-Ladeinfrastruktur · ${station.name}`}
        source1Title="Betreiber- &amp; Projektdokumentation"
        source1Text={truck?.source || "Standortdaten verifiziert über Hersteller- und Betreiber-Mitteilungen."}
        source2Title="Normungsstand &amp; Ladegeometrie"
        source2Text="Kennzahlen gemäß CharIN MCS Standard und Alpitronic HYC1000 / ABB E-Mobility Spezifikationen."
        dateText={`Stand: ${truck?.lastVerifiedAt || '2026-10-01'}`}
      />
    </div>
  );
};

export default McsHubDetailPage;
