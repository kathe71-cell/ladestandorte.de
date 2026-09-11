import React from 'react';
import { Calculator, Zap, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
import { CalculatorEmbed } from '../components/CalculatorEmbed';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';

export const RechnerPage: React.FC = () => {
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
            "name": "Ladezeit-Rechner",
            "item": "https://ladestandorte.de/rechner"
          }
        ]
      },
      {
        "@type": "WebApplication",
        "name": "Ladezeit- und Ladekosten-Rechner für Elektrofahrzeuge",
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "All",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "EUR"
        },
        "description": "Interaktiver Rechner zur Ermittlung von Ladedauer (10-80 % SoC), Ladeverlusten und Ladekosten an öffentlichen und privaten Ladestationen."
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Ladezeit- & Ladekosten-Rechner für Elektroautos · Interaktives Tool"
        description="Ladedauer (10-80 % SoC), Ladeverluste & Stromkosten an AC- und HPC-Schnellladesäulen exakt berechnen. Kostenloses Online-Tool."
        canonicalPath="/rechner"
        schema={schema}
      />
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
          <Calculator className="w-4 h-4" />
          <span>Interaktives Analyse-Tool</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Ladezeit- &amp; Ladekosten-Rechner
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Berechnen Sie auf Basis physikalischer Messwerte und realer Ladekurven die Ladedauer von 10 % bis 80 % State of Charge (SoC), die anfallenden Ladeverluste und die exakten Kosten je Ladevorgang.
        </p>
      </div>

      {/* Main Interactive Tool */}
      <CalculatorEmbed isEmbed={false} />

      {/* Technical FAQ & Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-600" />
            <span>Warum 10 % bis 80 %?</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Elektroauto-Batterien erreichen zwischen 10 % und 50 % SoC ihre maximale Ladeleistung (Peak). Ab ca. 80 % drosselt das Batteriemanagementsystem (BMS) den Stromfluss drastisch, um eine Überhitzung und Degradation der Lithium-Ionen-Zellen zu verhindern.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>AC vs. DC Ladeverluste</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Beim Wechselstromladen (AC) wandelt der fahrzeugeigene Onboard-Charger den Strom in Gleichstrom um – hierbei entstehen 8 % bis 15 % Wandlungs- und Abwärmeverluste. Beim DC-Schnellladen (HPC) fließt der Gleichstrom direkt in die Batterie (Verluste ca. 4 % bis 8 %).
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Vorkonditionierung (Akkuheizung)</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bei kalten Außentemperaturen im Winter sinkt die chemische Reaktionsfähigkeit im Akku. Eine aktive Vorkonditionierung vor Ankunft am HPC-Lader erwärmt das Paket auf optimale 25–35 °C und verkürzt die Ladedauer um bis zu 50 %.
          </p>
        </div>
      </div>

      {/* Citation Box */}
      <CitationBox
        title="Ladezeit- und Ladekostenrechner für Elektrofahrzeuge"
        urlPath="/rechner"
      />

      {/* Trust & E-E-A-T */}
      <EEATBadge topic="Modellrechnung &amp; Elektrotechnische Wirkungsgrade" />

    </div>
  );
};

export default RechnerPage;
