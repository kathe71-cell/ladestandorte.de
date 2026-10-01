import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Navigation, Zap, MapPin, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { MOTORWAYS_DATA, getMotorwayCitySlugs, getMotorwayCrossingSlugs } from '../data/motorways';
import { CITIES_DATA } from '../data/cities';
import { getOperatorSlugByName } from '../utils/operatorHelper';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { STATIONS_DATA, StationData, getStationUrl } from '../data/stations';
import { StationDetailModal } from '../components/StationDetailModal';
import { FloatingCTABar } from '../components/FloatingCTABar';

export const MotorwayPage: React.FC = () => {
  const { autobahnSlug } = useParams<{ autobahnSlug: string }>();
  const motorway = MOTORWAYS_DATA.find(m => m.slug === autobahnSlug);
  const [selectedStation, setSelectedStation] = React.useState<StationData | null>(null);

  if (!motorway) {
    return <Navigate to="/autobahnen" replace />;
  }

  const motorwayStations = STATIONS_DATA.filter(s => s.motorway === motorway.slug);

  const citySlugs = getMotorwayCitySlugs(motorway.slug);
  const connectedCities = citySlugs
    .map(slug => CITIES_DATA.find(c => c.slug === slug))
    .filter(Boolean) as typeof CITIES_DATA;

  const crossingSlugs = getMotorwayCrossingSlugs(motorway.slug);
  const crossingMotorways = crossingSlugs
    .map(slug => MOTORWAYS_DATA.find(m => m.slug === slug))
    .filter(Boolean) as typeof MOTORWAYS_DATA;

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
            "name": "Autobahnen",
            "item": "https://www.ladestandorte.de/autobahnen"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": motorway.name,
            "item": `https://www.ladestandorte.de/autobahnen/${motorway.slug}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": `Welche Schnelllader gibt es an der ${motorway.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": `Entlang der ${motorway.name} (${motorway.route}) stehen moderne Schnellladeparks mit bis zu ${motorway.maxKw} kW Ladeleistung zur Verfügung. Zu den führenden Betreibern zählen ${motorway.mainCPOs.join(', ')} direkt an Rastanlagen und Autohöfen.`
            }
          },
          {
            "@type": "Question",
            "name": `Brauche ich eine Ladekarte für die ${motorway.name}?`,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Nein. Seit April 2024 (AFIR-Verordnung) müssen alle Schnelllader über 50 kW kontaktlose Kartenzahlung akzeptieren. Eine Ladekarte (z.B. ADAC, EnBW, IONITY Passport) ermöglicht aber deutlich günstigere kWh-Preise."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title={`Schnellladen ${motorway.name}: HPC-Ladeparks an Raststätten & Autobahn 2026`}
        description={`HPC-Schnellladeparks an der ${motorway.name} (${motorway.route}): ${motorway.mainCPOs.join(', ')} u.v.m. Bis zu ${motorway.maxKw} kW Ladeleistung. Verifizierte Standorte und Anfahrt.`}
        canonicalPath={`/autobahnen/${motorway.slug}`}
        schema={schema}
      />
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link to="/" className="hover:text-amber-700">Startseite</Link>
        <span>/</span>
        <Link to="/autobahnen" className="hover:text-amber-700">Autobahnen</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">{motorway.name}</span>
      </div>

      {/* Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="flex items-center gap-3">
          <div className="w-16 h-10 rounded-xl bg-amber-400 text-slate-950 font-black font-mono flex items-center justify-center text-xl shadow-xs">
            {motorway.name}
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold">
            BUNDESAUTOBAHN {motorway.name} · {motorway.lengthKm} KM GESAMTLÄNGE
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Schnelllader &amp; Raststätten an der {motorway.name}
        </h1>

        <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-medium">
          Streckenführung: {motorway.route}
        </p>
        <p className="text-sm text-slate-600 leading-relaxed">
          {motorway.description}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Streckenlänge</span>
          <span className="text-3xl font-black text-slate-950 font-mono mt-1 block">
            {motorway.lengthKm} km
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Gesamter Trassenverlauf</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Max. Ladeleistung</span>
          <span className="text-3xl font-black text-amber-600 font-mono mt-1 block">
            bis {motorway.maxKw} kW
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">High Power Charging (HPC)</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Führende Netze</span>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {motorway.mainCPOs.map((cpo, i) => {
              const slug = getOperatorSlugByName(cpo);
              return slug ? (
                <Link
                  key={cpo}
                  to={`/betreiber/${slug}`}
                  className="text-xs font-bold text-amber-900 hover:text-amber-700 hover:underline"
                >
                  {cpo}{i < motorway.mainCPOs.length - 1 ? ',' : ''}
                </Link>
              ) : (
                <span key={cpo} className="text-xs font-bold text-slate-900">
                  {cpo}{i < motorway.mainCPOs.length - 1 ? ',' : ''}
                </span>
              );
            })}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Direkt an Rastanlagen</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Verifizierte Ladeparks</span>
          <span className="text-3xl font-black text-emerald-600 font-mono mt-1 block">
            {motorwayStations.length} Dossiers
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">
            BNetzA-geprüfte Großhubs
          </span>
        </div>
      </div>


      {motorwayStations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-950">
            Verifizierte BNetzA-Ladeparks entlang der {motorway.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {motorwayStations.map((st) => (
              <Link
                key={st.id}
                to={getStationUrl(st)}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-extrabold text-slate-950 group-hover:text-amber-800 transition-colors">
                      {st.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200 shrink-0">
                      {st.kwMax} kW HPC
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {st.street}, {st.plz} {st.city} · {st.operator}
                  </p>
                  
                  {st.exitDistance && (
                    <span className="text-[10px] font-mono text-slate-600 block w-full mt-1">
                      📍 {st.exitDistance}
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-800">
                  <span>Standort ansehen</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* MCS & E-Lkw Schwerlast-Laden an der Autobahn (falls vorhanden) */}
      {motorwayStations.some((s) => s.truckCharging?.supported) && (
        <div className="p-6 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Megawatt Charging System (MCS) &amp; E-Lkw Korridor</span>
            </div>
            <Link
              to="/mcs"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold underline"
            >
              Zum MCS-Hub-Portal →
            </Link>
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              E-Lkw &amp; Megawatt-Ladeinfrastruktur an der {motorway.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Für schwere Nutzfahrzeuge stehen an der {motorway.name} dedizierte Schwerlast-Ladeparks mit Durchfahrtsspuren (Drive-Through) und Leistungen bis 1.000+ kW zur Verfügung.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {motorwayStations
              .filter((s) => s.truckCharging?.supported)
              .map((st) => (
                <Link
                  key={`truck-${st.id}`}
                  to={getStationUrl(st)}
                  className="p-4 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-bold text-white text-sm group-hover:text-emerald-300 transition-colors line-clamp-1">
                        {st.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                        st.truckCharging?.mcsStatus === 'operational'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-blue-950 text-blue-300 border border-blue-800'
                      }`}>
                        {st.truckCharging?.mcsStatus === 'operational' ? 'MCS Aktiv' : '400 kW CCS (MCS im Bau)'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      {st.city} · {st.operator} · {st.truckCharging?.mcsMaxKw || st.kwMax} kW
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] font-mono text-emerald-400 font-semibold">
                    <span>{st.truckCharging?.mcsPointsCount || st.pointsCount} Lkw-Buchten {st.truckCharging?.driveThrough ? '· Drive-Through' : ''}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
          </div>
        </div>
      )}

      {/* Städte entlang der Strecke */}
      {connectedCities.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
            <MapPin className="w-4 h-4" />
            <span>Städte &amp; Ballungsräume entlang der {motorway.name}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-950">
            Urbane Ladeinfrastruktur an der {motorway.name}-Trasse
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {connectedCities.map((city) => (
              <Link
                key={city.slug}
                to={`/staedte/${city.slug}`}
                className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group flex flex-col justify-between"
              >
                <span className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {city.name}
                </span>
                <span className="text-[11px] font-mono text-slate-500 mt-1">
                  {city.ladepunkteGesamt.toLocaleString('de-DE')} Ladepunkte
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Anschluss-Autobahnen & Autobahnkreuze */}
      {crossingMotorways.length > 0 && (
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 font-bold">
            <Navigation className="w-4 h-4" />
            <span>Autobahnkreuze &amp; Anschluss-Strecken</span>
          </div>
          <h2 className="text-xl font-bold text-slate-950">
            Kreuzende Autobahnkorridore ab {motorway.name}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {crossingMotorways.map((mw) => (
              <Link
                key={mw.slug}
                to={`/autobahnen/${mw.slug}`}
                className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 hover:shadow-sm transition-all group flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span className="w-10 h-7 rounded bg-amber-400 text-slate-950 font-black font-mono flex items-center justify-center text-xs">
                    {mw.name}
                  </span>
                  <span className="text-xs font-medium text-slate-700 truncate max-w-[120px]">
                    {mw.route}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Citation Box */}
      <CitationBox
        title={`Ladeinfrastruktur und Schnellladeparks an der Autobahn ${motorway.name}`}
        urlPath={`/autobahnen/${motorway.slug}`}
      />

      {/* EEAT Badge */}
      <EEATBadge topic={`Autobahnkorridor ${motorway.name}`} />

      {/* Modal for Station Detail */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />

      <FloatingCTABar
        title="Günstig an Autobahnen laden"
        subtitle="Die passende Ladekarte für Fernstrecken im Vergleich"
        link="/ladekarten"
        linkLabel="Ladekarten vergleichen"
      />
    </div>
  );
};

export default MotorwayPage;
