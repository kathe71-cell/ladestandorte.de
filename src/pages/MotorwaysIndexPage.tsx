import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { MOTORWAYS_DATA } from '../data/motorways';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { FloatingCTABar } from '../components/FloatingCTABar';

export const MotorwaysIndexPage: React.FC = () => {
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
          }
        ]
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Schnellladen auf deutschen Autobahnen · Übersicht A1 bis A99"
        description="Übersicht aller Schnellladeparks & Raststätten entlang deutscher Bundesautobahnen. HPC-Ladestationen mit bis zu 400 kW Leistung laut BNetzA-Register."
        canonicalPath="/autobahnen"
        schema={schema}
      />
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 font-bold">
          <Navigation className="w-4 h-4" />
          <span>Fernstraßen &amp; Ladekorridore</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Schnellladen auf Bundesautobahnen (A1 bis A99)
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Reisen ohne Reichweitenangst: Übersicht aller Raststätten, Autohöfe und High-Power-Charging-Parks (bis zu 400 kW) entlang des deutschen Autobahnnetzes.
        </p>
      </div>

      {/* Grid of Motorways */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOTORWAYS_DATA.map((mw) => (
          <Link
            key={mw.slug}
            to={`/autobahnen/${mw.slug}`}
            className="group p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-amber-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-9 rounded-xl bg-amber-400 text-slate-950 font-black font-mono flex items-center justify-center text-base shadow-xs">
                  {mw.name}
                </div>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                  {mw.totalChargingHubs} Schnelllade-Hubs
                </span>
              </div>

              <h2 className="text-lg font-bold text-slate-950 group-hover:text-amber-700 transition-colors mb-2 line-clamp-2 leading-snug">
                {mw.route}
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                {mw.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">STRECKENLÄNGE</span>
                  <strong className="text-slate-900">{mw.lengthKm} km</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">MAX. LEISTUNG</span>
                  <strong className="text-amber-700">{mw.maxKw} kW HPC</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
              <span>Ladekorridor analysieren</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Trust & E-E-A-T */}
      <EEATBadge topic="Bundesautobahnen Ladeinfrastruktur" />

    </div>
  );
};

export default MotorwaysIndexPage;
