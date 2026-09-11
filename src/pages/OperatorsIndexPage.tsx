import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { OPERATORS_DATA } from '../data/operators';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';

export const OperatorsIndexPage: React.FC = () => {
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
            "name": "Betreiber",
            "item": "https://ladestandorte.de/betreiber"
          }
        ]
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Ladenetz-Betreiber (CPO) im Vergleich · Deutschland"
        description="Übersicht aller führenden Ladeinfrastruktur-Betreiber in Deutschland. EnBW, IONITY, Fastned, Aral pulse & mehr im Kennzahlen- und Tarifvergleich."
        canonicalPath="/betreiber"
        schema={schema}
      />
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-700 font-bold">
          <ShieldCheck className="w-4 h-4" />
          <span>Charge Point Operators (CPOs)</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Ladenetz-Betreiber in Deutschland im Vergleich
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Vergleichen Sie die führenden Ladeinfrastruktur-Betreiber nach Gesamtzahl der Ladepunkte, High-Power-Charging-Leistung bis 400 kW, AutoCharge-Unterstützung und Roaming-Netzwerkgröße.
        </p>
      </div>

      {/* Grid of Operators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {OPERATORS_DATA.map((op) => (
          <Link
            key={op.slug}
            to={`/betreiber/${op.slug}`}
            className="group p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-purple-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-extrabold text-slate-950 group-hover:text-purple-700 transition-colors">
                  {op.name}
                </h2>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200">
                  bis {op.maxKw} kW
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-3">{op.headquarters}</p>
              
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-5">
                {op.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">LADEPUNKTE DE</span>
                  <strong className="text-slate-900 text-sm">{op.totalPointsDE.toLocaleString('de-DE')}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">HPC-QUOTE</span>
                  <strong className="text-emerald-700 text-sm">{op.hpcShare} %</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
              <span>Betreiber-Profil ansehen</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Trust & E-E-A-T */}
      <EEATBadge topic="CPO-Marktanteile &amp; Ladeinfrastruktur" />

    </div>
  );
};

export default OperatorsIndexPage;
