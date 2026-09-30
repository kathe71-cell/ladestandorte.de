import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ShieldCheck, Zap, CheckCircle2, ArrowRight, Star, CreditCard } from 'lucide-react';
import { OPERATORS_DATA } from '../data/operators';
import { STATIONS_DATA } from '../data/stations';
import { CitationBox } from '../components/CitationBox';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';

export const OperatorPage: React.FC = () => {
  const { operatorSlug } = useParams<{ operatorSlug: string }>();
  const operator = OPERATORS_DATA.find(o => o.slug === operatorSlug);

  if (!operator) {
    return <Navigate to="/betreiber" replace />;
  }

  const operatorStations = STATIONS_DATA.filter(s => s.operatorSlug === operator.slug);

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
            "name": "Betreiber",
            "item": "https://www.ladestandorte.de/betreiber"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": operator.name,
            "item": `https://www.ladestandorte.de/betreiber/${operator.slug}`
          }
        ]
      },
      {
        "@type": "Organization",
        "name": operator.name,
        "description": operator.description
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title={`${operator.name} Ladesäulen, Ladeparks & Tarife`}
        description={`Alles über das Ladenetz von ${operator.name}. ${operator.totalPointsDE} Ladepunkte in Deutschland, bis zu ${operator.maxKw} kW HPC, Tarife & Bezahlung.`}
        canonicalPath={`/betreiber/${operator.slug}`}
        schema={schema}
      />
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link to="/" className="hover:text-purple-700">Startseite</Link>
        <span>/</span>
        <Link to="/betreiber" className="hover:text-purple-700">Betreiber</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">{operator.name}</span>
      </div>

      {/* Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-50 text-purple-800 text-xs font-mono font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>CHARGE POINT OPERATOR · {operator.headquarters.toUpperCase()}</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          {operator.name}: Ladenetz, Ladeleistung &amp; Tarife
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {operator.description}
        </p>
      </div>

      {/* Operator Metrics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Ladepunkte in DE</span>
          <span className="text-3xl font-black text-slate-950 font-mono mt-1 block">
            {operator.totalPointsDE.toLocaleString('de-DE')}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">BNetzA registriert</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Spitzenleistung (HPC)</span>
          <span className="text-3xl font-black text-purple-600 font-mono mt-1 block">
            bis {operator.maxKw} kW
          </span>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
            {operator.hpcShare} % HPC-Anteil
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Roaming-Punkte</span>
          <span className="text-2xl font-black text-slate-950 font-mono mt-1 block">
            {operator.roamingPartnersCount.toLocaleString('de-DE')}+
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">In ganz Europa</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">App-Bewertung</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-3xl font-black text-slate-950 font-mono">{operator.appRating}</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">App Store / Play Store</span>
        </div>
      </div>

      {/* Features & Technologie */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <h2 className="text-base font-mono uppercase tracking-wider text-slate-800 font-bold">
          Technologische Merkmale von {operator.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {operator.features.map((feat) => (
            <div key={feat} className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>


      {/* Citation Box */}
      <CitationBox
        title={`CPO-Dossier: ${operator.name} Ladeinfrastruktur und technische Spezifikationen`}
        urlPath={`/betreiber/${operator.slug}`}
      />

      {/* Preishinweis */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
        <strong>Hinweis zu Tarifen:</strong> Alle Preisangaben (AC/DC €/kWh) basieren auf öffentlich zugänglichen Standard-Preisblättern des Betreibers (Ad-hoc ohne Vertrag). Reale Preise können durch Ladekarten-Tarife, Roaming-Partner und dynamische Preismodelle deutlich abweichen. Bitte prüfe die aktuellen Preise direkt beim Betreiber.
      </div>

      {/* EEAT Badge */}
      <EEATBadge topic={`Betreiber-Analyse ${operator.name}`} />

      <FloatingCTABar
        title="Günstig beim Betreiber laden"
        subtitle="Die passende Ladekarte im Direktvergleich"
        link="/ladekarten"
        linkLabel="Ladekarten vergleichen"
      />
    </div>
  );
};

export default OperatorPage;
