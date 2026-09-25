import React from 'react';
import { Zap, CheckCircle2, Sun, Smartphone, Info } from 'lucide-react';
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
            "item": "https://www.ladestandorte.de/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Wallbox-Vergleich",
            "item": "https://www.ladestandorte.de/wallbox-vergleich"
          }
        ]
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Wallbox-Vergleich: 11 kW & 22 kW Heimladestationen im Überblick"
        description="Führende Wallboxen im herstellerunabhängigen Vergleich. 11 kW vs. 22 kW, PV-Überschussladen, Förderstatus (Länder/Kommunen), App-Steuerung und Sicherheit im Überblick."
        canonicalPath="/wallbox-vergleich"
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
          Sicher und komfortabel in der eigenen Garage oder im Carport laden. Entdecken Sie führende Wallboxen mit PV-Überschussladung, App-Steuerung und Lastmanagement im direkten Leistungsvergleich.
        </p>
      </div>

      {/* Info notice on Subsidies / KfW */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 leading-relaxed space-y-1.5">
        <div className="font-bold flex items-center gap-1.5 text-sm text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Aktueller Hinweis zum Förderstatus (KfW &amp; Regionale Förderprogramme):</span>
        </div>
        <p className="text-slate-700">
          Die früheren bundesweiten KfW-Zuschussprogramme für private Wallboxen (KfW 440 und KfW 442 „Solarstrom für Elektroautos“) sind geschlossen bzw. deren Fördermittel sind ausgeschöpft. Auch das Bundesprogramm <strong>KfW 441 (Ladestationen für Elektrofahrzeuge – Unternehmen)</strong> nimmt keine Neuanträge mehr an und ist beendet. Eine finanzielle Förderung privater und gewerblicher Ladepunkte ist aktuell primär über <strong>regionale Förderprogramme einzelner Bundesländer, Landkreise, Kommunen oder lokaler Stadtwerke/Energieversorger</strong> möglich.
        </p>
      </div>

      {/* Unabhängiger Marktüberblick Notice */}
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
                {wb.fundingEligible && (
                  <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md font-medium text-[11px]" title={wb.fundingNote}>
                    <span>Regionale Förderung möglich</span>
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

              <p className="text-[11px] text-slate-500 pt-1 border-t border-slate-100/80">
                Förderstatus: {wb.fundingNote}
              </p>
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

      {/* Fachlicher Hinweis zur Dimensionierung bei PV-Überschussladung */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
        <h3 className="font-extrabold text-slate-900 text-base">
          Wie viel Solarenergie wird für das Laden zu Hause benötigt?
        </h3>
        <p>
          Um ein Elektroauto an sonnigen Tagen ganz oder teilweise mit eigenem Dachstrom zu versorgen, wird in der Praxis meist eine Photovoltaikanlage ab etwa 6 bis 10 kWp in Kombination mit einer steuerbaren Wallbox empfohlen. Den voraussichtlichen Jahresertrag und Eigenverbrauchsanteil für verschiedene Dachausrichtungen können Sie mit dem herstellerneutralen <a href="https://www.wattpeak.de/ertragsrechner" target="_blank" rel="noopener" className="font-bold text-emerald-800 underline hover:text-emerald-600">PV-Ertragsrechner auf wattpeak.de</a> berechnen.
        </p>
      </div>

      <CitationBox
        title="Wallbox-Vergleich: Heimladestationen mit PV-Überschussladen"
        urlPath="/wallbox-vergleich"
      />

      <EEATBadge
        topic="Heimladeinfrastruktur &amp; Wallbox-Installation"
        source1Title="Herstellerangaben &amp; Datenblätter"
        source1Text="Technische Spezifikationen (Ladeleistung, Schnittstellen, IP-Schutzklasse) laut offiziellen Herstellerdatenblättern (go-e, Heidelberg, Webasto, Easee, ABL u. a.)."
        source2Title="Normen &amp; Installationsvorgaben"
        source2Text="Vorgaben nach DIN EN 61851-1, VDE-AR-N 4100 und Steuerbarkeit nach § 14a EnWG. Fachgerechte Installation durch eingetragene Elektrofachbetriebe erforderlich."
        dateText="Stand: Herstellerdaten 2026"
      />

    </div>
  );
};

export default WallboxVergleichPage;
