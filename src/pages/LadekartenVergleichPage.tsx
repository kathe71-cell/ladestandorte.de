import { Zap, CheckCircle2 } from 'lucide-react';
import { CHARGING_CARDS } from '../data/cards';
import { EEATBadge } from '../components/EEATBadge';
import { CitationBox } from '../components/CitationBox';
import { SEO } from '../components/SEO';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { PageHero } from '../components/PageHero';

export const LadekartenVergleichPage: React.FC = () => {
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
            "name": "Ladekarten-Vergleich",
            "item": "https://www.ladestandorte.de/ladekarten"
          }
        ]
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Ladekarten-Vergleich: Tarife, Roaming & kWh-Preise im Überblick"
        description="Herstellerunabhängiger Vergleich führender Ladekarten in Deutschland. Grundgebühren, AC- & DC-Preise und Roaming-Netze im transparenten Faktencheck."
        canonicalPath="/ladekarten"
        schema={schema}
      />
      
      <PageHero
        level={2}
        eyebrow={
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
            <Zap className="w-4 h-4" />
            <span>Marktübersicht &amp; Tarifvergleich</span>
          </div>
        }
        title="Ladekarten-Vergleich: Tarife & Roaming im Überblick"
        description="Welche Ladekarte spart im Alltag wirklich? Wir vergleichen monatliche Grundgebühren, Kilowattstunden-Preise für AC und DC sowie Roaming-Konditionen bei über 700.000 europäischen Ladepunkten neutral und herstellerunabhängig."
      />

      {/* Info notice */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <strong>Unabhängiger Verbraucherhinweis (Stand: September 2026):</strong> Alle Angaben zu Tarifen, kWh-Preisen und Grundgebühren basieren auf den öffentlich zugänglichen Standard-Preisblättern der jeweiligen Elektromobilitätsanbieter (EMP). Reale Abrechnungspreise können durch Roaming-Partner, dynamische Tarife und Blockiergebühren abweichen. ladestandorte.de führt diesen Vergleich rein redaktionell und unabhängig.
      </div>

      {/* Cards Comparison Grid */}
      <div className="space-y-6">
        {CHARGING_CARDS.map((card) => (
          <div
            key={card.id}
            className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                {card.badge && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                    {card.badge}
                  </span>
                )}
                <span className="text-xs font-mono text-slate-500 font-semibold">
                  {card.roamingPoints}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                  {card.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                  Ideal für: <span className="text-slate-900 font-bold">{card.bestFor}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div>
                  <span className="text-slate-400 block text-[10px]">GRUNDGEBÜHR</span>
                  <strong className="text-slate-900 text-sm">
                    {card.monthlyFee === 0 ? '0,00 €' : `${card.monthlyFee.toFixed(2).replace('.', ',')} €`} / Mo.
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">EIGENES AC</span>
                  <strong className="text-slate-900 text-sm">
                    {card.acPriceOwn > 0 ? `${card.acPriceOwn.toFixed(2).replace('.', ',')} €` : '–'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">EIGENES DC (HPC)</span>
                  <strong className="text-emerald-700 text-sm">
                    {card.dcPriceOwn > 0 ? `${card.dcPriceOwn.toFixed(2).replace('.', ',')} €` : '–'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">ROAMING DC</span>
                  <strong className="text-slate-900 text-sm">{card.dcPriceRoaming.toFixed(2).replace('.', ',')} €</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                {card.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-slate-500 font-mono">
                Standzeitregelung: {card.blockiergebuehr}
              </div>
            </div>

            {/* Info Column */}
            <div className="lg:w-60 shrink-0 flex flex-col justify-center space-y-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-center space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 block uppercase font-bold">Tarif-Modell</span>
                <span className="text-base font-black text-slate-950 block">
                  {card.monthlyFee === 0 ? 'Ohne Grundgebühr' : `${card.monthlyFee.toFixed(2).replace('.', ',')} € / Monat`}
                </span>
                <div className="pt-2 border-t border-slate-200/60 text-[11px] text-slate-500 font-medium">
                  Anbieter: <span className="font-semibold text-slate-800">{card.provider}</span>
                </div>
              </div>
              <div className="py-2.5 px-3 bg-slate-100 rounded-xl text-center text-xs font-semibold text-slate-600">
                Reine Verbraucher-Information
              </div>
            </div>
          </div>
        ))}
      </div>

      <CitationBox
        title="Ladekarten-Vergleich: Tarife, Roaming und Grundgebühren im Überblick"
        urlPath="/ladekarten"
      />

      <EEATBadge
        topic="Ladekarten- und EMP-Tarifvergleich"
        source1Title="Tarifdaten der Mobilitätsanbieter (EMP)"
        source1Text="Erfasst anhand öffentlich einsehbarer Preisblätter und Vertragsbedingungen der Betreiber (EnBW, EWE Go, Maingau, Ionity, Tesla u. a.)."
        source2Title="Verbraucherhinweis zu Roaming &amp; Nebenentgelten"
        source2Text="Preise an Fremdladestationen können durch Roaming-Aufschläge, variable Ad-hoc-Tarife oder Blockiergebühren variieren. Vor dem Laden stets Säulendisplay oder App prüfen."
        dateText="Stand: Tarifblätter September 2026"
      />

    </div>
  );
};

export default LadekartenVergleichPage;
