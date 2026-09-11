import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Navigation, Zap, MapPin, ArrowRight, ShieldCheck, ExternalLink } from 'lucide-react';
import { MOTORWAYS_DATA } from '../data/motorways';
import { STATIONS_DATA } from '../data/stations';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';

export const MotorwayPage: React.FC = () => {
  const { autobahnSlug } = useParams<{ autobahnSlug: string }>();
  const motorway = MOTORWAYS_DATA.find(m => m.slug === autobahnSlug);

  if (!motorway) {
    return <Navigate to="/autobahnen" replace />;
  }

  const motorwayStations = STATIONS_DATA.filter(s => s.motorway === motorway.slug);

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
            "item": "https://ladestandorte.de/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Autobahnen",
            "item": "https://ladestandorte.de/autobahnen"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": motorway.name,
            "item": `https://ladestandorte.de/autobahnen/${motorway.slug}`
          }
        ]
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title={`Ladesäulen & Schnellladeparks an der ${motorway.name}`}
        description={`Alle HPC-Schnelllader & Raststätten entlang der Bundesautobahn ${motorway.name} (${motorway.route}). ${motorway.totalChargingHubs} Ladeparks mit bis zu ${motorway.maxKw} kW.`}
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
          <span className="text-xs font-mono text-slate-500 uppercase block">Schnelllade-Hubs</span>
          <span className="text-3xl font-black text-slate-950 font-mono mt-1 block">
            {motorway.totalChargingHubs}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Im 25-35 km Takt</span>
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
          <span className="text-sm font-bold text-slate-900 mt-2 block truncate">
            {motorway.mainCPOs.join(', ')}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Direkt an Rastanlagen</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Durchschnittsabstand</span>
          <span className="text-3xl font-black text-emerald-600 font-mono mt-1 block">
            ~ {(motorway.lengthKm / motorway.totalChargingHubs).toFixed(1)} km
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Zwischen zwei Ladeparks</span>
        </div>
      </div>

      {/* Top Hubs along this Motorway */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-950">
          Wichtigste Schnelllade-Stationen an der {motorway.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {motorway.topHubs.map((hub) => (
            <div key={hub.name} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-950 text-base">{hub.name}</span>
                <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  {hub.kw} kW
                </span>
              </div>
              <p className="text-xs text-slate-500">Ausfahrt: {hub.exit} · Betreiber: {hub.operator}</p>
              <div className="text-xs font-mono font-semibold text-slate-700 bg-slate-50 p-2 rounded-lg">
                {hub.points} HPC-Ladepunkte verfügbar
              </div>
            </div>
          ))}
        </div>
      </div>


      {/* Citation Box */}
      <CitationBox
        title={`Ladeinfrastruktur und Schnellladeparks an der Autobahn ${motorway.name}`}
        urlPath={`/autobahnen/${motorway.slug}`}
      />

      {/* EEAT Badge */}
      <EEATBadge topic={`Autobahnkorridor ${motorway.name}`} />

    </div>
  );
};

export default MotorwayPage;
