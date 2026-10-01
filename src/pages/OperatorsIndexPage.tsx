import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';
import { OPERATORS_DATA } from '../data/operators';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { PageHero } from '../components/PageHero';

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
            "item": "https://www.ladestandorte.de/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Betreiber",
            "item": "https://www.ladestandorte.de/betreiber"
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
      
      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Betreiber', isCurrent: true }
        ]}
        eyebrow="OPERATOR DATA · ÜBERSICHT"
        title="Ladenetz-Betreiber in Deutschland im Vergleich"
        description="Vergleichen Sie die führenden Ladeinfrastruktur-Betreiber nach Gesamtzahl der Ladepunkte, High-Power-Charging-Leistung bis 400 kW, AutoCharge-Unterstützung und Roaming-Netzwerkgröße."
      />

      {/* CPO Monitor Banner */}
      <div className="p-6 bg-[#171917] rounded-2xl text-white border border-[#171917] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/10 text-[#C7F000] text-xs font-mono font-bold">
            <Zap className="w-3.5 h-3.5 text-[#C7F000]" />
            <span>NEUES DATENPRODUKT</span>
          </div>
          <h2 className="text-xl font-bold">CPO Monitor: Amtliche BNetzA-Registerdaten</h2>
          <p className="text-xs sm:text-sm text-[#DFE3DC] max-w-2xl leading-relaxed">
            Detaillierte Auswertung der Top 30 Betreiberunternehmen nach dokumentierten Register-Ladepunkten (≥150 kW), HPC-Ausbauquoten und städtischer Präsenz.
          </p>
        </div>
        <Link
          to="/cpo-monitor"
          className="px-5 py-2.5 rounded-xl bg-[#C7F000] hover:bg-[#b0d500] text-[#171917] font-bold text-xs uppercase tracking-wider shrink-0 transition-all flex items-center gap-2"
        >
          <span>Zum CPO Monitor</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Grid of Operators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {OPERATORS_DATA.map((op) => (
          <Link
            key={op.slug}
            to={`/betreiber/${op.slug}`}
            className="group p-6 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs hover:border-[#2F5E73] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-extrabold text-[#171917] group-hover:text-[#2F5E73] transition-colors">
                  {op.name}
                </h2>
                <span className="px-2.5 py-1 rounded-lg text-xs font-mono font-bold bg-[#171917] text-[#C7F000] border border-[#171917]">
                  bis {op.maxKw} kW
                </span>
              </div>

              <p className="text-xs text-[#6C716B] mb-3">{op.headquarters}</p>
              
              <p className="text-xs text-[#6C716B] leading-relaxed line-clamp-3 mb-5">
                {op.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#F7F7F2] p-3 rounded-xl border border-[#DFE3DC]">
                <div>
                  <span className="text-[#6C716B] block text-[10px]">LADEPUNKTE DE</span>
                  <strong className="text-[#171917] text-sm">{op.totalPointsDE.toLocaleString('de-DE')}</strong>
                </div>
                <div>
                  <span className="text-[#6C716B] block text-[10px]">HPC-QUOTE</span>
                  <strong className="text-[#2F5E73] text-sm">{op.hpcShare} %</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#DFE3DC] flex items-center justify-between text-xs font-bold text-[#2F5E73]">
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
