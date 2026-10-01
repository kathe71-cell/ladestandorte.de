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
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Ladekarten-Vergleich', isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC] text-[#171917] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#2F5E73]"></span>
            <span>COMPARISON · LADEKARTEN</span>
          </div>
        }
        title="Ladekarten-Vergleich: Tarife & Roaming im Überblick"
        description="Welche Ladekarte spart im Alltag wirklich? Wir vergleichen monatliche Grundgebühren, Kilowattstunden-Preise für AC und DC sowie Roaming-Konditionen bei über 700.000 europäischen Ladepunkten neutral und herstellerunabhängig."
      />

      {/* Info notice */}
      <div className="p-4 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs text-[#6C716B] leading-relaxed">
        <strong className="text-[#171917]">Unabhängiger Verbraucherhinweis (Stand: September 2026):</strong> Alle Angaben zu Tarifen, kWh-Preisen und Grundgebühren basieren auf den öffentlich zugänglichen Standard-Preisblättern der jeweiligen Elektromobilitätsanbieter (EMP). Reale Abrechnungspreise können durch Roaming-Partner, dynamische Tarife und Blockiergebühren abweichen. ladestandorte.de führt diesen Vergleich rein redaktionell und unabhängig.
      </div>

      {/* Cards Comparison Grid */}
      <div className="space-y-6">
        {CHARGING_CARDS.map((card) => (
          <div
            key={card.id}
            className="p-6 sm:p-8 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs hover:shadow-md hover:border-[#171917] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
          >
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                {card.badge && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC]">
                    {card.badge}
                  </span>
                )}
                <span className="text-xs font-mono text-[#6C716B] font-semibold">
                  {card.roamingPoints}
                </span>
              </div>

              <div>
                <h2 className="text-2xl font-black text-[#171917] tracking-tight">
                  {card.name}
                </h2>
                <p className="text-xs sm:text-sm text-[#6C716B] mt-1 font-medium">
                  Ideal für: <span className="text-[#171917] font-bold">{card.bestFor}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono bg-[#F7F7F2] p-3.5 rounded-xl border border-[#DFE3DC]">
                <div>
                  <span className="text-[#6C716B] block text-[10px]">GRUNDGEBÜHR</span>
                  <strong className="text-[#171917] text-sm tabular-nums">
                    {card.monthlyFee === 0 ? '0,00 €' : `${card.monthlyFee.toFixed(2).replace('.', ',')} €`} / Mo.
                  </strong>
                </div>
                <div>
                  <span className="text-[#6C716B] block text-[10px]">EIGENES AC</span>
                  <strong className="text-[#171917] text-sm tabular-nums">
                    {card.acPriceOwn > 0 ? `${card.acPriceOwn.toFixed(2).replace('.', ',')} €` : '–'}
                  </strong>
                </div>
                <div>
                  <span className="text-[#6C716B] block text-[10px]">EIGENES DC (HPC)</span>
                  <strong className="text-[#2F5E73] text-sm tabular-nums">
                    {card.dcPriceOwn > 0 ? `${card.dcPriceOwn.toFixed(2).replace('.', ',')} €` : '–'}
                  </strong>
                </div>
                <div>
                  <span className="text-[#6C716B] block text-[10px]">ROAMING DC</span>
                  <strong className="text-[#171917] text-sm tabular-nums">{card.dcPriceRoaming.toFixed(2).replace('.', ',')} €</strong>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#171917]">
                {card.features.map(f => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2F5E73] shrink-0" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>

              <div className="text-[11px] text-[#6C716B] font-mono">
                Standzeitregelung: {card.blockiergebuehr}
              </div>
            </div>

            {/* Info Column */}
            <div className="lg:w-60 shrink-0 flex flex-col justify-center space-y-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-[#DFE3DC] lg:pl-6">
              <div className="bg-[#F7F7F2] p-4 rounded-xl border border-[#DFE3DC] text-center space-y-1.5">
                <span className="text-[10px] font-mono text-[#6C716B] block uppercase font-bold">Tarif-Modell</span>
                <span className="text-base font-black text-[#171917] block tabular-nums">
                  {card.monthlyFee === 0 ? 'Ohne Grundgebühr' : `${card.monthlyFee.toFixed(2).replace('.', ',')} € / Monat`}
                </span>
                <div className="pt-2 border-t border-[#DFE3DC] text-[11px] text-[#6C716B] font-medium">
                  Anbieter: <span className="font-semibold text-[#171917]">{card.provider}</span>
                </div>
              </div>
              <div className="py-2.5 px-3 bg-[#F7F7F2] border border-[#DFE3DC] rounded-xl text-center text-xs font-semibold text-[#6C716B]">
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
