import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, MapPin, Navigation, ShieldCheck, Database, ArrowRight, CheckCircle2, TrendingUp, Cpu, Award, HelpCircle } from 'lucide-react';
import { InstantFinder } from '../components/InstantFinder';
import { CalculatorEmbed } from '../components/CalculatorEmbed';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { CITIES_DATA } from '../data/cities';
import { MOTORWAYS_DATA } from '../data/motorways';
import { OPERATORS_DATA } from '../data/operators';
import { GLOSSARY_DATA } from '../data/glossary';
import { FloatingCTABar } from '../components/FloatingCTABar';

export const Home: React.FC = () => {
  const topCities = CITIES_DATA.slice(0, 12);
  const topMotorways = MOTORWAYS_DATA.slice(0, 8);
  const topOperators = OPERATORS_DATA.slice(0, 6);

  const homeSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://www.ladestandorte.de/#website",
        "url": "https://www.ladestandorte.de/",
        "name": "ladestandorte.de",
        "description": "Bundesweites Ladesäulenregister und Instant-Finder öffentlicher Ladeinfrastruktur in Deutschland.",
        "inLanguage": "de-DE",
        "publisher": {
          "@type": "Organization",
          "name": "ladestandorte.de",
          "url": "https://www.ladestandorte.de/"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://www.ladestandorte.de/suche?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://www.ladestandorte.de/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Wie viele öffentliche Ladesäulen gibt es in Deutschland?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "In Deutschland sind über 100.000 öffentlich zugängliche Ladepunkte im amtlichen Ladesäulenregister der Bundesnetzagentur (BNetzA) erfasst, darunter mehr als 28.500 HPC-Schnellladepunkte mit mindestens 150 kW Leistung."
            }
          },
          {
            "@type": "Question",
            "name": "Welche Gesetzesgrundlage regelt das Ladesäulenregister?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Das Register basiert auf § 5 der Ladesäulenverordnung (LSV) sowie der europäischen AFIR-Verordnung (EU 2023/1804) über den Aufbau der Infrastruktur für alternative Kraftstoffe."
            }
          },
          {
            "@type": "Question",
            "name": "Was ist der Unterschied zwischen AC- und DC-Laden?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "AC-Laden (Wechselstrom, 11 bis 22 kW) nutzt den bordeigenen Inverter des Autos für längere Standzeiten. DC-Laden (Gleichstrom, 50 bis 400 kW) speist direkt in die Batterie ein und lädt moderne E-Autos in 15 bis 30 Minuten von 10 % auf 80 % SoC."
            }
          },
          {
            "@type": "Question",
            "name": "Kann man an allen öffentlichen Ladesäulen ohne Vertrag laden?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Ja. Gemäß AFIR-Richtlinie müssen alle öffentlich zugänglichen Schnellladepunkte spontanes Ad-hoc-Laden via Debitkarte, Kreditkarte oder kontaktlose Zahlung ohne feste Vertragsbindung ermöglichen."
            }
          },
          {
            "@type": "Question",
            "name": "Welche Betreiber betreiben die meisten Schnellladeparks?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Zu den größten überregionalen Betreibern (CPOs) in Deutschland gehören u. a. EnBW mobility+, IONITY, EWE GO, Fastned, Aral pulse und Tesla (für Fremdfabrikate geöffnete Supercharger)."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      <SEO
        title="Ladesäulen Deutschland 2026: 100.000+ Ladepunkte · Finder & Vergleich"
        description="Über 100.000 öffentliche Ladesäulen in Deutschland: Schnellladeparks an Autobahnen, Betreibervergleich (29 CPOs), Ladekarten-Ranking & kostenloser Instant-Finder. BNetzA Open Data 2026."
        canonicalPath="/"
        schema={homeSchema}
      />
      
      {/* Hero Section */}
      <section className="relative bg-white pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-slate-200 overflow-hidden">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#0f172a 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Superscript Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-mono font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>LADESÄULEN-VERZEICHNIS · E-MOBILITÄT DEUTSCHLAND</span>
          </div>

          {/* Display Headline */}
          <div className="max-w-4xl space-y-4 mb-8">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-950 leading-[1.08]">
              Öffentliches <span className="text-emerald-600">Ladesäulenregister</span> Deutschland
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-3xl">
              Über 100.000 öffentlich zugängliche Ladepunkte in Deutschland laut BNetzA Open Data. Nutzen Sie unsere redaktionellen Verzeichnisse für 50 Großstädte, Autobahnen und Betreiber sowie den Instant-Finder für kuratierte Flagship-Hubs in unter 5 Millisekunden.
            </p>
          </div>

          {/* Instant-Finder Component (data-svsearch) */}
          <div className="max-w-4xl mb-12 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-slate-500 px-1">
              <span>⚡ Schnellsuche: Flagship-Hubs (83 Standorte) &amp; Verzeichnisse (Musterbestand)</span>
              <span className="text-emerald-700 font-semibold">Bundesweit: &gt; 100.000 BNetzA-Ladepunkte</span>
            </div>
            <InstantFinder autoFocus={false} showFilters={true} />
          </div>

          {/* Position-0 Featured Snippet Definitions-Box */}
          <div className="max-w-4xl bg-slate-50 rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-2 mb-12">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
              <Database className="w-4 h-4" />
              <span>Amtliche Definition &amp; Gesetzesgrundlage</span>
            </div>
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-medium">
              Das <strong>Ladesäulenregister der Bundesnetzagentur</strong> erfasst gemäß <strong>§ 5 der Ladesäulenverordnung (LSV)</strong> alle öffentlich zugänglichen Normal- und Schnellladepunkte für Elektrofahrzeuge in Deutschland. Die Datenbasis dokumentiert Ladeleistung (kW), Steckertypen (CCS, Typ 2), Betreiber sowie geographische Standorte und wird nach der europäischen <strong>AFIR-Verordnung (EU) 2023/1804</strong> bezüglich transparenter Ad-hoc-Zahlungsmittel reguliert.
            </p>
          </div>

          {/* Live Register Statistics Panel */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-4 border-t border-slate-200">
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-mono text-slate-500 uppercase block">Erfasste Ladepunkte</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">&gt; 100.000</span>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">Bundesweit aktiv</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-mono text-slate-500 uppercase block">HPC-Schnelllader</span>
              <span className="text-2xl sm:text-3xl font-black text-emerald-600 font-mono tracking-tight">&gt; 28.500</span>
              <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">≥ 150 kW Leistung</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-mono text-slate-500 uppercase block">Registrierte CPOs</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">&gt; 1.250</span>
              <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">EnBW, Ionity, Tesla uvm.</span>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200">
              <span className="text-xs font-mono text-slate-500 uppercase block">Datenaktualität</span>
              <span className="text-2xl sm:text-3xl font-black text-slate-950 font-mono tracking-tight">Aktuell</span>
              <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">BNetzA Open Data</span>
            </div>
          </div>

        </div>
      </section>

      {/* Hub-and-Spoke Silo 1: Top 50 Großstädte */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold mb-1">
              <MapPin className="w-4 h-4" />
              <span>Städtische Ladeinfrastruktur</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Top 50 deutsche Großstädte im Lade-Vergleich
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Detaillierte Registerdaten zu Gesamtzahl, HPC-Anteil und städtischen Ausbauquoten.
            </p>
          </div>
          <Link
            to="/staedte"
            className="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800 shrink-0"
          >
            <span>Alle 50 Städte ansehen</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topCities.map((city) => (
            <Link
              key={city.slug}
              to={`/staedte/${city.slug}`}
              className="group p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-extrabold text-slate-900 group-hover:text-emerald-700 transition-colors">
                    {city.name}
                  </span>
                  <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {city.bundesland}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Ladepunkte gesamt:</span>
                    <strong className="text-slate-900 font-mono">{city.ladepunkteGesamt.toLocaleString('de-DE')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>HPC-Anteil (≥150 kW):</span>
                    <strong className="text-emerald-700 font-mono">{city.hpcLadepunkte} Hubs</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Top-Betreiber:</span>
                    <span className="text-slate-800 truncate max-w-[140px]">{city.topBetreiber[0]}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-emerald-700">
                <span>Stadt-Dossier öffnen</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hub-and-Spoke Silo 2: Autobahn-Korridore (A1 - A99) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 font-bold mb-1">
              <Navigation className="w-4 h-4" />
              <span>Fernverkehr &amp; Transit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Bundesautobahnen: High-Power-Ladekorridore
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Raststätten, Autohöfe und 400-kW-Megahubs entlang der Hauptverkehrsachsen A1 bis A99.
            </p>
          </div>
          <Link
            to="/autobahnen"
            className="inline-flex items-center gap-1 text-sm font-bold text-amber-700 hover:text-amber-800 shrink-0"
          >
            <span>Alle Autobahnen ansehen</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topMotorways.map((mw) => (
            <Link
              key={mw.slug}
              to={`/autobahnen/${mw.slug}`}
              className="group p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-8 rounded-lg bg-amber-400 text-slate-950 font-black font-mono flex items-center justify-center text-sm shadow-xs">
                    {mw.name}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {mw.totalChargingHubs} Ladehubs
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-2">
                  {mw.route}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  {mw.lengthKm} km Strecke · bis {mw.maxKw} kW HPC
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-amber-700">
                <span>Raststätten-Hubs</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Hub-and-Spoke Silo 3: Betreiber (CPOs) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-700 font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Charge Point Operators</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
              Lade-Betreiber im Leistungs- &amp; Tarif-Check
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Infrastruktur, Ladeleistungen bis 400 kW, Roaming-Netzwerke und AFIR-Zahlungsoptionen.
            </p>
          </div>
          <Link
            to="/betreiber"
            className="inline-flex items-center gap-1 text-sm font-bold text-purple-700 hover:text-purple-800 shrink-0"
          >
            <span>Alle Betreiber vergleichen</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topOperators.map((op) => (
            <Link
              key={op.slug}
              to={`/betreiber/${op.slug}`}
              className="group p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-slate-950 text-base group-hover:text-purple-700 transition-colors">
                    {op.name}
                  </h3>
                  <span className="text-xs font-mono font-bold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded">
                    bis {op.maxKw} kW
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-3">{op.headquarters}</p>
                <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed mb-4">
                  {op.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px]">LADEPUNKTE</span>
                    <strong className="text-slate-900">{op.totalPointsDE.toLocaleString('de-DE')}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">HPC-ANTEIL</span>
                    <strong className="text-emerald-700">{op.hpcShare} %</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-purple-700">
                <span>CPO-Profil &amp; Tarife</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Interactive Tool Section: Ladezeit- & Kostenrechner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CalculatorEmbed />
      </section>

      {/* Topical Authority: Die 3 Ratgeber */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-mono font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>RATGEBER &amp; LEITFÄDEN</span>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">
            Fundierte Leitfäden &amp; Marktanalysen
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Verlässliche Leitfäden zu Tarifen, Elektrotechnik und gesetzlichen Neuregelungen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link
            to="/ratgeber/ladekarten-dschungel"
            className="group p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold block mb-2">
                Tarife &amp; Roaming
              </span>
              <h3 className="text-lg font-bold text-slate-950 group-hover:text-emerald-700 transition-colors mb-3 leading-snug">
                Ladekarten-Dschungel: Roaming-Preise, Grundgebühren &amp; wer wirklich spart
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Überblick über Grundgebühren, Roaming-Aufschläge bei Dritt-CPOs und die besten Kombinationen für Viellader vs. Gelegenheitslader.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
              <span>Leitfaden lesen</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/ratgeber/ac-vs-dc-ladeverluste"
            className="group p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold block mb-2">
                Elektrotechnik &amp; Physik
              </span>
              <h3 className="text-lg font-bold text-slate-950 group-hover:text-emerald-700 transition-colors mb-3 leading-snug">
                AC vs. DC Ladeverluste im Praxis-Vergleich: Wirkungsgrade &amp; Sparpotenziale
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Warum an der Schuko-Steckdose bis zu 20 % verloren gehen, wie der Onboard-Charger arbeitet und wie Sie bares Geld sparen.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
              <span>Technische Analyse</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/ratgeber/blockiergebuehren-vermeiden"
            className="group p-6 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold block mb-2">
                Verbraucherschutz
              </span>
              <h3 className="text-lg font-bold text-slate-950 group-hover:text-emerald-700 transition-colors mb-3 leading-snug">
                Blockiergebühren an Ladesäulen vermeiden: Karenzzeiten &amp; CPO-Übersicht
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ab wann greift die Standzeitgebühr? Vergleichen Sie Karenzzeiten (240 Min. AC vs. 60 Min. DC) und Nachtregelungen aller Anbieter.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-emerald-700">
              <span>Gebühren-Vergleich</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* Glossar-Vorschau */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200/90 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-700 font-bold mb-1">
                <Cpu className="w-4 h-4 text-emerald-600" />
                <span>E-Mobilitäts-Lexikon</span>
              </div>
              <h2 className="text-2xl font-black text-slate-950 tracking-tight">
                Fachglossar zur Ladeinfrastruktur
              </h2>
            </div>
            <Link
              to="/glossar"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 shadow-xs transition-colors shrink-0"
            >
              <span>Gesamtes Glossar öffnen</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GLOSSARY_DATA.slice(0, 8).map((term) => (
              <Link
                key={term.slug}
                to={`/glossar#${term.slug}`}
                className="p-3.5 bg-white rounded-xl border border-slate-200 hover:border-emerald-400 transition-colors group"
              >
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">
                  {term.category}
                </span>
                <span className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors text-sm block">
                  {term.term}
                </span>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                  {term.shortDef}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Akkordeon / Wissensbereich */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-mono font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>HÄUFIG GESTELLTE FRAGEN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
            Wissenswertes zur Ladeinfrastruktur in Deutschland
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Wichtige Fragen und Antworten zum Bundesnetzagentur-Ladesäulenregister, Ladearten und Abrechnung.
          </p>
        </div>

        <div className="space-y-3">
          <details className="group bg-white rounded-2xl border border-slate-200 p-5 open:shadow-sm transition-all">
            <summary className="font-bold text-slate-900 cursor-pointer list-none flex justify-between items-center select-none text-base">
              <span>Wie viele öffentliche Ladesäulen gibt es in Deutschland?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg">▾</span>
            </summary>
            <p className="text-sm text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100">
              In Deutschland sind über 100.000 öffentlich zugängliche Ladepunkte im amtlichen Ladesäulenregister der Bundesnetzagentur (BNetzA) erfasst, darunter mehr als 28.500 HPC-Schnellladepunkte mit mindestens 150 kW Leistung.
            </p>
          </details>

          <details className="group bg-white rounded-2xl border border-slate-200 p-5 open:shadow-sm transition-all">
            <summary className="font-bold text-slate-900 cursor-pointer list-none flex justify-between items-center select-none text-base">
              <span>Welche Gesetzesgrundlage regelt das Ladesäulenregister?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg">▾</span>
            </summary>
            <p className="text-sm text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100">
              Das Register basiert auf § 5 der Ladesäulenverordnung (LSV) sowie der europäischen AFIR-Verordnung (EU 2023/1804) über den Aufbau der Infrastruktur für alternative Kraftstoffe. Alle Betreiber sind gesetzlich verpflichtet, Inbetriebnahmen und technische Parameter zu melden.
            </p>
          </details>

          <details className="group bg-white rounded-2xl border border-slate-200 p-5 open:shadow-sm transition-all">
            <summary className="font-bold text-slate-900 cursor-pointer list-none flex justify-between items-center select-none text-base">
              <span>Was ist der Unterschied zwischen AC- und DC-Laden?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg">▾</span>
            </summary>
            <p className="text-sm text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100">
              AC-Laden (Wechselstrom, typisch 11 bis 22 kW) nutzt den bordeigenen Gleichrichter des Elektroautos und ist ideal für längere Standzeiten (Arbeitsplatz, Übernachtung). DC-Laden (Gleichstrom, 50 bis 400 kW) speist direkt in die Batterie ein und lädt moderne E-Autos in 15 bis 30 Minuten von 10 % auf 80 % SoC.
            </p>
          </details>

          <details className="group bg-white rounded-2xl border border-slate-200 p-5 open:shadow-sm transition-all">
            <summary className="font-bold text-slate-900 cursor-pointer list-none flex justify-between items-center select-none text-base">
              <span>Kann man an allen öffentlichen Ladesäulen ohne Vertrag laden?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg">▾</span>
            </summary>
            <p className="text-sm text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100">
              Ja. Gemäß europäischer AFIR-Richtlinie müssen alle öffentlich zugänglichen Schnellladepunkte spontanes Ad-hoc-Laden via Debitkarte, Kreditkarte oder kontaktlose Zahlung ohne feste Vertragsbindung oder App-Zwang ermöglichen.
            </p>
          </details>

          <details className="group bg-white rounded-2xl border border-slate-200 p-5 open:shadow-sm transition-all">
            <summary className="font-bold text-slate-900 cursor-pointer list-none flex justify-between items-center select-none text-base">
              <span>Welche Betreiber betreiben die meisten Schnellladeparks?</span>
              <span className="text-slate-400 group-open:rotate-180 transition-transform text-lg">▾</span>
            </summary>
            <p className="text-sm text-slate-600 leading-relaxed mt-3 pt-3 border-t border-slate-100">
              Zu den größten überregionalen Betreibern (CPOs) in Deutschland gehören u. a. EnBW mobility+, IONITY, EWE GO, Fastned, Aral pulse und Tesla (Supercharger für Fremdmarken). Regional stellen Stadtwerke und Verteilnetzbetreiber die Mehrheit der AC-Punkte.
            </p>
          </details>
        </div>
      </section>

      {/* E-E-A-T Redaktionelle Trust-Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <EEATBadge
          topic="Ladeinfrastruktur Deutschland"
          source1Title="Amtliche Primärdatenbasis"
          source1Text="Ladesäulenregister der Bundesnetzagentur (BNetzA) gemäß § 5 LSV (Open Data, CC BY 4.0) für bundesweite Registerstatistiken."
          source2Title="Redaktionelle Kuration &amp; Flagship-Hubs"
          source2Text="Ausgewählte Musterstandorte und Betreiberübersichten redaktionell aufbereitet. Keine Echtzeitdaten zur aktuellen Belegung oder Betriebsbereitschaft."
          dateText="Stand: BNetzA Open Data"
        />
      </section>

    </div>
  );
};

export default Home;
