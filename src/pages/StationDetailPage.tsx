import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Zap, MapPin, Navigation, ShieldCheck, CreditCard, ExternalLink, 
  ArrowRight, ArrowLeft, Clock, Info, CheckCircle2, AlertCircle, Compass, Truck 
} from 'lucide-react';
import { STATIONS_DATA, getStationConnectors, isIndexableLocation, getStationUrl } from '../data/stations';
import { CITIES_DATA } from '../data/cities';
import { OPERATORS_DATA } from '../data/operators';
import { getNearbyStations } from '../utils/geo';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { PageHero } from '../components/PageHero';

export const StationDetailPage: React.FC = () => {
  const { citySlug, stationSlug } = useParams<{ citySlug: string; stationSlug: string }>();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const station = STATIONS_DATA.find(s => 
    s.citySlug === citySlug && (s.slug === stationSlug || s.id === stationSlug)
  );

  if (!station) {
    return <Navigate to={citySlug ? `/staedte/${citySlug}` : '/staedte'} replace />;
  }

  const hasCityPage = CITIES_DATA.some(c => c.slug === station.citySlug);
  const operatorProfile = OPERATORS_DATA.find(o => o.slug === station.operatorSlug && (o.name === station.operator || o.slug === station.operator.toLowerCase()));
  const connectors = getStationConnectors(station);
  const nearbyStations = getNearbyStations(station, STATIONS_DATA, 5, 85);
  const isIndexable = isIndexableLocation(station);

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
  const osmUrl = `https://www.openstreetmap.org/?mlat=${station.lat}&mlon=${station.lng}#map=16/${station.lat}/${station.lng}`;
  const appleMapsUrl = `https://maps.apple.com/?daddr=${station.lat},${station.lng}`;

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
            "name": "Großstädte",
            "item": "https://www.ladestandorte.de/staedte"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": station.city,
            "item": hasCityPage 
              ? `https://www.ladestandorte.de/staedte/${station.citySlug}`
              : `https://www.ladestandorte.de/ladestation/${station.citySlug}/${station.slug}`
          },
          {
            "@type": "ListItem",
            "position": 4,
            "name": station.name,
            "item": `https://www.ladestandorte.de/ladestation/${station.citySlug}/${station.slug}`
          }
        ]
      },
      {
        "@type": "ChargingStation",
        "name": station.name,
        "description": `Öffentlicher Schnellladepark ${station.name} mit bis zu ${station.kwMax} kW HPC-Ladeleistung und ${station.pointsCount} Anschlüssen in ${station.city}. Betrieben von ${station.operator}.`,
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
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title={`${station.name} (${station.kwMax} kW HPC) · Ladepark ${station.city} 2026`}
        description={`Öffentlicher Schnellladepark ${station.name} in ${station.plz} ${station.city} (${station.street}): ${station.pointsCount} Ladepunkte, bis zu ${station.kwMax} kW HPC. Betreiber: ${station.operator}. BNetzA Open Data 2026.`}
        canonicalPath={`/ladestation/${station.citySlug}/${station.slug}`}
        schema={schema}
        noIndex={!isIndexable}
      />

      <PageHero
        level={3}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Ladeorte', href: '/staedte' },
          ...(hasCityPage ? [{ label: station.city, href: `/staedte/${station.citySlug}` }] : [{ label: station.city }]),
          { label: station.name, isCurrent: true }
        ]}
        eyebrow={
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-200">
              {station.kwMax} kW HPC-Spitzenleistung
            </span>
            <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-slate-100 text-slate-800 border border-slate-200">
              {station.pointsCount} Ladepunkte
            </span>
            {station.project && (
              <span className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-blue-50 text-blue-900 border border-blue-200">
                Projekt: {station.project}
              </span>
            )}
            {station.hardwareProvider && (
              <span className="px-3 py-1 rounded-md text-xs font-mono font-medium bg-slate-50 text-slate-700 border border-slate-200">
                Hardware: {station.hardwareProvider}
              </span>
            )}
            {station.truckCharging && (
              <Link
                to="/mcs/ladestationen"
                className={`px-3 py-1 rounded-md text-xs font-mono font-bold inline-flex items-center gap-1.5 shadow-2xs ${
                  station.truckCharging.mcsStatus === 'operational'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-amber-100 text-amber-950 border border-amber-300 hover:bg-amber-200'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>
                  {station.truckCharging.mcsStatus === 'operational' 
                    ? 'MCS Megawatt-Hub (Aktiv)' 
                    : station.truckCharging.locationStatus === 'operational' 
                      ? (station.truckCharging.mcsStatus === 'planned' ? 'E-Lkw Hub (400 kW CCS aktiv · MCS geplant)' : 'E-Lkw Hub (400 kW CCS aktiv · MCS im Ausbau)')
                      : 'MCS Lkw-Hub (Geplant / Im Bau)'}
                </span>
              </Link>
            )}
            {station.motorway && (
              <Link
                to={`/autobahnen/${station.motorway}`}
                className="px-3 py-1 rounded-md text-xs font-mono font-bold bg-amber-400 text-slate-950 hover:bg-amber-500 transition-colors inline-flex items-center gap-1 shadow-2xs"
              >
                <span>BAB {station.motorway.toUpperCase()}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        }
        title={station.name}
        subtitle={
          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm sm:text-base text-slate-600">
            <div className="flex items-center gap-1.5 font-medium">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{station.street}, {station.plz} {station.city}</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Betreiber:</span>
              <Link 
                to={`/betreiber/${station.operatorSlug}`} 
                className="font-bold text-slate-900 hover:text-emerald-700 underline decoration-slate-300 hover:decoration-emerald-500 transition-colors"
              >
                {station.operator}
              </Link>
            </div>
          </div>
        }
        description={station.description}
      />

      {/* Bento Grid: Technische Kennzahlen */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Max. Ladeleistung</span>
          <span className="text-3xl font-black text-emerald-600 font-mono mt-1 block">
            {station.kwMax} kW
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">High Power Charging (HPC)</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Ladepunkte gesamt</span>
          <span className="text-3xl font-black text-slate-950 font-mono mt-1 block">
            {station.pointsCount}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Gleichzeitige Ladeplätze</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Betreiber (CPO)</span>
          {operatorProfile ? (
            <>
              <Link 
                to={`/betreiber/${station.operatorSlug}`} 
                className="text-base font-extrabold text-slate-900 hover:text-emerald-700 mt-2 block truncate"
                title={station.operator}
              >
                {station.operator}
              </Link>
              <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">Betreiberprofil ansehen →</span>
            </>
          ) : (
            <>
              <span className="text-base font-extrabold text-slate-900 mt-2 block truncate" title={station.operator}>
                {station.operator}
              </span>
              <span className="text-[11px] text-slate-500 font-mono mt-1 block">Betreiber / Konsortium</span>
            </>
          )}
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Ersterfassung</span>
          <span className="text-3xl font-black text-slate-950 font-mono mt-1 block">
            {station.openingYear}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">BNetzA-Registerjahr</span>
        </div>
      </div>

      {/* 2-Column Content: Links Stecker & Bezahlung / Rechts Karte & Lage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Linke Spalte (2 Spalten breit): Stecker, Zugang, Ausstattung */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Steckertypen & Ladeleistung */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <span>Verfügbare Steckertypen &amp; Ladeleistung</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {connectors.map((conn) => (
                <div key={conn.type} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-slate-900 text-base">{conn.type}</span>
                    <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-emerald-100 text-emerald-950 border border-emerald-200">
                      bis {conn.maxKw} kW {conn.type === 'Typ 2' ? '(AC)' : '(DC)'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {conn.type === 'CCS' && 'Standard-Schnellladung für alle modernen europäischen E-Autos.'}
                    {conn.type === 'Typ 2' && 'Normalladung für Wechselstrom (AC), Bordlader limitiert.'}
                    {conn.type === 'CHAdeMO' && 'Japanischer Gleichstrom-Standard (z. B. Nissan Leaf).'}
                  </p>
                </div>
              ))}
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              * Die tatsächliche Ladezeit hängt von der fahrzeugseitigen Ladekurve, Batterietemperatur und dem State of Charge (SoC) ab. Die angegebene Spitzenleistung (kW) stellt das technische Maximum der Ladesäule dar.
            </p>
          </div>

          {/* Zugang & Bezahlung */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Zugang &amp; Bezahlung</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700 leading-relaxed">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Info className="w-4 h-4 text-emerald-600" />
                <span>Öffentliche Zugänglichkeit &amp; Abrechnung</span>
              </div>
              <p>
                Dieser Standort ist im offiziellen Register der Bundesnetzagentur als öffentlich zugänglicher Ladepunkt erfasst ({station.accessType || 'Öffentlich zugänglich'}). 
              </p>
              <p>
                Die verfügbaren Ad-hoc-Zahlungsmöglichkeiten unterscheiden sich je nach Ladepunkt und Betreiber. Gängige Autorisierungswege umfassen Betreiber-Apps, Ladekarten im Roaming-Verbund (RFID) sowie Direktbezahlsysteme (z. B. via QR-Code oder Kartenterminal).
              </p>
            </div>

            {/* Transparenter Preishinweis */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Hinweis zu Tarifen &amp; Preisen:</strong> ladestandorte.de erhebt keine simulierten Live-Preise. Der Abrechnungspreis pro Kilowattstunde (kWh) richtet sich nach dem von Ihnen genutzten Ladekarten-Tarif oder dem Ad-hoc-Direktladepreis des Betreibers ({station.operator}). 
              <Link to="/ladekarten" className="font-bold underline ml-1 hover:text-amber-950">
                Günstigste Ladekarten im Vergleich ansehen →
              </Link>
            </div>
          </div>

          {/* Standort- & Netzanbindung (nur belegte Daten) */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Standort- &amp; Netzanbindung</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <span className="text-xl">📍</span>
                <div>
                  <span className="text-slate-500 block">Lage / Anbindung:</span>
                  <strong className="text-slate-900 truncate block">
                    {station.motorway ? `Fernverkehrskorridor BAB ${station.motorway.toUpperCase()}` : `Stadtgebiet ${station.city}`}
                  </strong>
                </div>
              </div>

              {station.exitDistance && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
                  <span className="text-xl">🛣️</span>
                  <div>
                    <span className="text-slate-500 block">Autobahnanbindung:</span>
                    <strong className="text-slate-900 truncate block">
                      {station.exitDistance}
                    </strong>
                  </div>
                </div>
              )}

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <span className="text-xl">⚡</span>
                <div>
                  <span className="text-slate-500 block">Netzkategorie:</span>
                  <strong className="text-emerald-700 block">
                    {station.isHpc ? 'High-Power-Charging (HPC)' : 'Schnelllader'}
                  </strong>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
                <span className="text-xl">🏛️</span>
                <div>
                  <span className="text-slate-500 block">Datenquelle:</span>
                  <strong className="text-slate-900 text-xs block">
                    BNetzA-Ladesäulenregister (Open Data)
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* MCS & E-Lkw Schwerlast-Laden (Additive Erweiterung) */}
          {station.truckCharging && (
            <div className="bg-white rounded-2xl p-6 border-2 border-blue-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <span>MCS &amp; E-Lkw Schwerlast-Ladeinfrastruktur</span>
                </h2>
                <div className="flex items-center gap-1.5">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                    station.truckCharging.locationStatus === 'operational'
                      ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                      : 'bg-amber-100 text-amber-950 border border-amber-300'
                  }`}>
                    Ladepark: {station.truckCharging.locationStatus === 'operational' ? 'Geöffnet' : 'Im Bau'}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold ${
                    station.truckCharging.mcsStatus === 'operational'
                      ? 'bg-blue-100 text-blue-950 border border-blue-300'
                      : 'bg-slate-100 text-slate-700 border border-slate-300'
                  }`}>
                    MCS: {station.truckCharging.mcsStatus === 'operational' ? '● Aktiv' : station.truckCharging.mcsStatus === 'under-construction' ? '○ Im Ausbau' : 'Geplant'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <span className="text-slate-500 block font-mono uppercase text-[10px]">Ladeleistung</span>
                  <strong className="text-base font-black text-blue-900 font-mono block mt-0.5">
                    {station.truckCharging.mcsAvailable && station.truckCharging.mcsMaxKw 
                      ? `bis ${station.truckCharging.mcsMaxKw} kW MCS` 
                      : `${station.truckCharging.ccsMaxKw || station.kwMax} kW CCS`}
                  </strong>
                  <span className="text-[11px] text-blue-700">
                    {station.truckCharging.mcsAvailable 
                      ? 'MCS-Standard verfügbar' 
                      : `CCS aktiv (${station.truckCharging.ccsMaxKw || 400} kW) · MCS geplant`}
                  </span>
                </div>

                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                  <span className="text-slate-500 block font-mono uppercase text-[10px]">Lkw-Ladeplätze</span>
                  <strong className="text-base font-black text-slate-950 font-mono block mt-0.5">
                    {station.truckCharging.mcsPointsCount 
                      ? `${station.truckCharging.mcsPointsCount} MCS-Punkte` 
                      : `${station.pointsCount} Durchfahrtsbuchten`}
                  </strong>
                  <span className="text-[11px] text-slate-600">Gespanne / Sattelzüge</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-mono uppercase text-[10px]">Durchfahrtsbuchten</span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1">
                    {station.truckCharging.driveThrough ? '✓ Vorhanden' : 'Nicht belegt'}
                  </strong>
                  <span className="text-[10px] text-slate-500">Kein Absatteln nötig</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-500 block font-mono uppercase text-[10px]">Auflieger-Zugang</span>
                  <strong className="text-sm font-bold text-slate-900 block mt-1">
                    {station.truckCharging.trailerAccessible ? '✓ 40t-geeignet' : 'Nicht belegt'}
                  </strong>
                  <span className="text-[10px] text-slate-500">Sattelzug-Geometrie</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1 font-mono">
                <div className="flex items-center justify-between text-slate-700 font-bold">
                  <span>Datenherkunft (Provenance): {station.truckCharging.provenance}</span>
                  <span>Verifiziert: {station.truckCharging.lastVerifiedAt}</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Quelle: {station.truckCharging.source} {station.truckCharging.sourceUrl && `(${station.truckCharging.sourceUrl})`}
                </p>
                {station.truckCharging.expectedLaunch && (
                  <p className="text-[11px] text-amber-800 font-semibold">
                    Angekündigte Inbetriebnahme: {station.truckCharging.expectedLaunch}
                  </p>
                )}
              </div>

              <div className="pt-1 flex items-center justify-between text-xs">
                <Link to="/mcs" className="text-blue-700 hover:text-blue-900 font-bold inline-flex items-center gap-1">
                  <span>Zurück zum MCS-Themenhub</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link to="/mcs/was-ist-mcs" className="text-slate-600 hover:text-slate-900 underline">
                  Was ist MCS? Technik erklärt →
                </Link>
              </div>
            </div>
          )}

        </div>

        {/* Rechte Spalte (1 Spalte breit): OpenStreetMap, Navigation, Trassen-Links */}
        <div className="space-y-6">
          
          {/* Karte & Navigations-Box */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-700 font-bold">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Geografische Lage</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {station.lat.toFixed(4)}°, {station.lng.toFixed(4)}°
              </span>
            </div>

            {/* OpenStreetMap iframe Embed (0 € API-Kosten, DSGVO-konform, SSR-safe) */}
            <div className="relative w-full h-56 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner flex items-center justify-center">
              {mounted ? (
                <iframe
                  title={`OpenStreetMap Karte für ${station.name}`}
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="border-0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${station.lng - 0.008}%2C${station.lat - 0.005}%2C${station.lng + 0.008}%2C${station.lat + 0.005}&layer=mapnik&marker=${station.lat}%2C${station.lng}`}
                />
              ) : (
                <div className="text-center p-4 text-xs text-slate-500 font-mono">
                  <span>Karte lädt nach Seitenaufruf…</span>
                </div>
              )}
            </div>

            {/* Navigations-Buttons */}
            <div className="space-y-2 pt-1">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-2xs"
              >
                <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                <span>Google Maps Navigation starten</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={osmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors text-center"
                >
                  <span>OpenStreetMap</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>

                <a
                  href={appleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors text-center"
                >
                  <span>Apple Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Anbindung & Verwandte Verzeichnisse */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs">
            <span className="font-mono uppercase text-slate-500 font-bold block">
              Zugehörige Ladeverzeichnisse
            </span>

            <div className="space-y-2">
              {hasCityPage ? (
                <Link
                  to={`/staedte/${station.citySlug}`}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors group"
                >
                  <div>
                    <span className="text-slate-500 block text-[11px]">Stadtdossier:</span>
                    <strong className="text-slate-900 group-hover:text-emerald-700">{station.city}</strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                </Link>
              ) : (
                <Link
                  to="/staedte"
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors group"
                >
                  <div>
                    <span className="text-slate-500 block text-[11px]">Regionalübersicht:</span>
                    <strong className="text-slate-900 group-hover:text-emerald-700">Ladeorte in Deutschland</strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}

              {station.motorway && (
                <Link
                  to={`/autobahnen/${station.motorway}`}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-amber-300 transition-colors group"
                >
                  <div>
                    <span className="text-slate-500 block text-[11px]">Fernverkehrs-Korridor:</span>
                    <strong className="text-slate-900 group-hover:text-amber-800">Autobahn {station.motorway.toUpperCase()}</strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}

              {operatorProfile && (
                <Link
                  to={`/betreiber/${station.operatorSlug}`}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-purple-300 transition-colors group"
                >
                  <div>
                    <span className="text-slate-500 block text-[11px]">Betreiber-Profil:</span>
                    <strong className="text-slate-900 group-hover:text-purple-700">{operatorProfile.name}</strong>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Datenstand & CC BY 4.0 Lizenzhinweis */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-500 font-mono">
            <div className="flex items-center gap-1.5 text-slate-700 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Amtliche Datenbasis &amp; Herkunft</span>
            </div>
            <p>
              Quelle der Registerdaten: <a href="https://www.bundesnetzagentur.de" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-800">bundesnetzagentur.de</a> · Datenstand: 01.10.2026
            </p>
            <p className="text-[10px] text-slate-500 pt-0.5">
              Amtliche Registerdaten lizenziert unter <a href="https://creativecommons.org/licenses/by/4.0/deed.de" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-700">Creative Commons Namensnennung 4.0 International (CC BY 4.0)</a>.
            </p>
            <p className="text-[10px] text-slate-400 pt-0.5">
              Angaben können sich kurzfristig ändern. Keine Gewähr für Belegungsstatus oder Live-Verfügbarkeit.
            </p>
          </div>

        </div>

      </div>

      {/* Geografischer Nearby-Graph: Laden in der Umgebung */}
      {nearbyStations.length > 0 && (
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold mb-1">
                <Navigation className="w-4 h-4" />
                <span>Geografischer Umkreis (Haversine-Distanz)</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-950">
                Alternative Schnellladeparks im Umkreis
              </h2>
            </div>
            {hasCityPage ? (
              <Link
                to={`/staedte/${station.citySlug}`}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                <span>Alle in {station.city}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            ) : (
              <Link
                to="/staedte"
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
              >
                <span>Alle Ladeorte</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {nearbyStations.map(({ station: nearSt, distanceKm }) => (
              <Link
                key={nearSt.id}
                to={getStationUrl(nearSt)}
                className="group p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-extrabold text-slate-950 group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {nearSt.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 shrink-0">
                      {nearSt.kwMax} kW
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-2">
                    {nearSt.street}, {nearSt.city}
                  </p>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 font-mono font-bold">
                      📍 ca. {distanceKm.toFixed(1).replace('.', ',')} km Luftlinie
                    </span>
                    <span className="text-slate-500 truncate">{nearSt.operator}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Standort ansehen</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Citation Box */}
      <CitationBox
        title={`Standort-Dossier: ${station.name} (${station.city}) Ladeinfrastruktur`}
        urlPath={getStationUrl(station)}
      />

      {/* EEAT Badge */}
      <EEATBadge topic={`Ladepark-Analyse ${station.name}`} />

      {/* Floating CTA Bar */}
      <FloatingCTABar
        title="Günstig am Schnelllader laden"
        subtitle="Die passende Ladekarte im Direktvergleich"
        link="/ladekarten"
        linkLabel="Ladekarten vergleichen"
      />
    </div>
  );
};

export default StationDetailPage;
