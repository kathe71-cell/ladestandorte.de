import React from 'react';
import { Zap, CheckCircle2, Sun, Smartphone } from 'lucide-react';
import { WALLBOXES_DATA } from '../data/wallboxes';
import { EEATBadge } from '../components/EEATBadge';
import { CitationBox } from '../components/CitationBox';
import { SEO } from '../components/SEO';

export const WallboxVergleichPage: React.FC = () => {
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
            "name": "Wallbox-Vergleich",
            "item": "https://ladestandorte.de/wallboxen"
          }
        ]
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Wallbox-Vergleich: 11 kW & 22 kW Heimladestationen im Überblick"
        description="Führende Wallboxen im herstellerunabhängigen Vergleich. 11 kW vs. 22 kW, PV-Überschussladen, KfW-Förderung, App-Steuerung und Sicherheit im Überblick."
        canonicalPath="/wallboxen"
        schema={schema}
      />
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
          <Zap className="w-4 h-4" />
          <span>Heimladestationen &amp; Photovoltaik</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Wallbox-Vergleich: 11-kW- &amp; 22-kW-Heimladestationen im Überblick
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Sicher und komfortabel in der eigenen Garage oder im Carport laden. Entdecken Sie führende Wallboxen mit PV-Überschussladung, App-Steuerung und KfW-Förderfähigkeit im direkten Leistungsvergleich.
        </p>
      </div>

      {/* Info notice */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <strong>Unabhängiger Marktüberblick:</strong> Alle Preisangaben sind unverbindliche Richtwerte (UVP bzw. durchschnittlicher Marktpreis). ladestandorte.de bietet diesen Vergleich rein informatorisch und unabhängig von Händlern oder Herstellern an.
      </div>

      {/* Wallboxen Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WALLBOXES_DATA.map((wb) => (
          <div
            key={wb.id}
            className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  {wb.maxKw} kW Ladeleistung
                </span>
                <span className="text-lg font-black text-slate-950 font-mono">
                  ~ {wb.priceEst} €
                </span>
              </div>

              <div>
                <span className="text-xs font-mono text-slate-400 uppercase font-semibold">{wb.brand}</span>
                <h2 className="text-xl font-black text-slate-950 tracking-tight mt-0.5">
                  {wb.name}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2 text-xs">
                {wb.hasSolarCharging && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                    <Sun className="w-3 h-3 text-amber-600" />
                    <span>PV-Überschuss</span>
                  </span>
                )}
                {wb.hasApp && (
                  <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-md font-medium">
                    <Smartphone className="w-3 h-3 text-blue-600" />
                    <span>App-Steuerung</span>
                  </span>
                )}
                {wb.kfwEligible && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 px-2 py-0.5 rounded-md font-medium">
                    <span>KfW-förderfähig</span>
                  </span>
                )}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                {wb.features.map(f => (
                  <div key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-5 border-t border-slate-100 mt-6 space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>Richtwert UVP:</span>
                <span className="font-bold text-slate-900 font-mono">ca. {wb.priceEst} €</span>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl text-center">
                <span className="text-[11px] font-semibold text-slate-700 block">Hersteller-Spezifikation</span>
                <span className="text-[10px] text-slate-400 block">Reine technische Fachinformation</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <CitationBox
        title="Wallbox-Vergleich: Heimladestationen mit PV-Überschussladen"
        urlPath="/wallbox-vergleich"
      />

      <EEATBadge topic="Heimladeinfrastruktur &amp; Wallbox-Installation" />

    </div>
  );
};

export default WallboxVergleichPage;
