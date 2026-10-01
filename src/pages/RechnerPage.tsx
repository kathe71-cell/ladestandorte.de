import React from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Zap, Clock, ShieldCheck, HelpCircle, BookOpen, ArrowRight } from 'lucide-react';
import { CalculatorEmbed } from '../components/CalculatorEmbed';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { PageHero } from '../components/PageHero';

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
            "item": "https://www.ladestandorte.de/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Ladezeit-Rechner",
            "item": "https://www.ladestandorte.de/rechner"
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
        description="Ladedauer (10-80 % SoC), Ladeverluste & Stromkosten an AC- und HPC-Schnellladesäulen im Modell berechnen. Kostenloses Online-Tool."
        canonicalPath="/rechner"
        schema={schema}
      />
      
      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Ladezeit-Rechner', isCurrent: true }
        ]}
        eyebrow="CALCULATOR · MODEL ENGINE"
        title="Ladezeit- & Ladekosten-Rechner"
        description="Ermitteln Sie im Rahmen einer beispielhaften Modellrechnung die geschätzte Ladedauer (10 % bis 80 % SoC), typische Ladeverluste und ungefähre Kosten je Ladevorgang."
      />

      {/* Main Interactive Tool */}
      <CalculatorEmbed isEmbed={false} />

      {/* Technical FAQ & Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="p-6 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs space-y-2">
          <h3 className="font-bold text-[#171917] text-base flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#2F5E73]" />
            <span>Warum 10 % bis 80 %?</span>
          </h3>
          <p className="text-xs text-[#6C716B] leading-relaxed">
            Elektroauto-Batterien erreichen zwischen 10 % und 50 % SoC ihre maximale Ladeleistung (Peak). Ab ca. 80 % drosselt das Batteriemanagementsystem (BMS) den Stromfluss drastisch, um eine Überhitzung und Degradation der Lithium-Ionen-Zellen zu verhindern.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs space-y-2">
          <h3 className="font-bold text-[#171917] text-base flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#2F5E73]" />
            <span>AC vs. DC Ladeverluste</span>
          </h3>
          <p className="text-xs text-[#6C716B] leading-relaxed">
            Beim Wechselstromladen (AC) wandelt der fahrzeugeigene Onboard-Charger den Strom in Gleichstrom um – hierbei entstehen 8 % bis 15 % Wandlungs- und Abwärmeverluste. Beim DC-Schnellladen (HPC) fließt der Gleichstrom direkt in die Batterie (Verluste ca. 4 % bis 8 %).
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs space-y-2">
          <h3 className="font-bold text-[#171917] text-base flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#2F5E73]" />
            <span>Vorkonditionierung (Akkuheizung)</span>
          </h3>
          <p className="text-xs text-[#6C716B] leading-relaxed">
            Bei kalten Außentemperaturen im Winter sinkt die chemische Reaktionsfähigkeit im Akku. Eine aktive Vorkonditionierung vor Ankunft am HPC-Lader erwärmt das Paket auf optimale 25–35 °C und verkürzt die Ladedauer um bis zu 50 %.
          </p>
        </div>
      </div>

      {/* Methodik & Modellannahmen Link-Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-start gap-2.5">
          <BookOpen className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <strong className="text-slate-900 font-semibold block sm:inline">Transparente Modellierung: </strong>
            <span>Alle Formeln, Wirkungsgrade (AC 88 % / DC 94 %) und Ladekurven-Plateaufaktoren (0,76 / 0,82) sind in unserer Methodik offengelegt.</span>
          </div>
        </div>
        <Link
          to="/methodik#laderechner"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-emerald-800 font-bold border border-slate-200 shadow-xs transition-colors shrink-0"
        >
          <span>Methodik &amp; Modellannahmen</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Citation Box */}
      <CitationBox
        title="Ladezeit- und Ladekostenrechner für Elektrofahrzeuge"
        urlPath="/rechner"
      />

      {/* Trust & E-E-A-T */}
      <EEATBadge
        topic="Modellrechnung &amp; Ladeverluste"
        source1Title="Fahrzeugdaten &amp; Berechnungsgrundlage"
        source1Text="Modellrechnung basierend auf Herstellerangaben zu nutzbaren Netto-Batteriekapazitäten, On-Board-Lader-Limits (AC) und Ladekurven."
        source2Title="Modellannahmen zu Ladeverlusten"
        source2Text="Modellannahme: Energieaufschlag auf die Nettoenergie von 12 % bei AC und 6 % bei DC. Reale Werte variieren je nach Fahrzeug, Temperatur und Ladeleistung."
        dateText="Stand: Modellrechnung 2026"
      />

    </div>
  );
};

export default RechnerPage;
