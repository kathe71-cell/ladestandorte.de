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
import { getDossierCount } from '../data/stations';
import { FloatingCTABar } from '../components/FloatingCTABar';

export const Home: React.FC = () => {
  const dossierCount = getDossierCount();
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
      
      {/* Hero Section: Infrastructure Intelligence */}
      <section className="relative bg-white pt-12 sm:pt-16 pb-12 sm:pb-20 border-b border-[#DFE3DC] overflow-hidden">
        {/* Subtle grid pattern background */}
        <div 
          className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(#171917 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Eyebrow Tag (Mockup: Lime Pill) */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#C7F000] text-[#171917] text-xs font-mono font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-[#171917]"></span>
            <span>MARKTMONITOR · DATA / 01.10.2026</span>
          </div>

          {/* Display Headline & Subline */}
          <div className="max-w-4xl space-y-4 mb-8">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.06]">
              <span className="text-[#171917] block">Ladeinfrastruktur.</span>
              <span className="text-[#6C716B] block">Datenbasiert.</span>
            </h1>
            <p className="text-lg sm:text-xl text-[#6C716B] leading-relaxed max-w-3xl">
              Standorte, Betreiber und HPC-Ausbau in Deutschland – transparent aufbereitet auf Basis amtlicher Registerdaten der Bundesnetzagentur.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to="/hpc-city-monitor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C7F000] hover:bg-[#d4fa00] text-[#171917] font-bold text-sm transition-all shadow-sm active:scale-95"
              >
                <span>HPC City Monitor</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/cpo-monitor"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC] font-bold text-sm transition-all shadow-sm active:scale-95"
              >
                <span>CPO Monitor</span>
              </Link>
            </div>
          </div>

          {/* 4-Column KPI Strip directly beneath Hero (Mockup-Style: White cards with subtle border, 1 Lime Accent Line) */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-10">
            <div className="p-5 rounded-2xl bg-white border border-[#DFE3DC] shadow-sm">
              <span className="text-[11px] font-mono text-[#6C716B] uppercase font-bold block">Ladepunkte gesamt</span>
              <span className="text-2xl sm:text-3xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">210.185</span>
              <span className="text-[11px] text-[#2F5E73] font-mono font-medium block mt-1">BNetzA-Registerbestand</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#DFE3DC] border-t-4 border-t-[#C7F000] shadow-sm">
              <span className="text-[11px] font-mono text-[#6C716B] uppercase font-bold block">HPC ≥ 150 kW</span>
              <span className="text-2xl sm:text-3xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">40.654</span>
              <span className="text-[11px] text-[#2F5E73] font-mono font-medium block mt-1">19,34 % Registeranteil</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#DFE3DC] shadow-sm">
              <span className="text-[11px] font-mono text-[#6C716B] uppercase font-bold block">Ladestationen</span>
              <span className="text-2xl sm:text-3xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">117.043</span>
              <span className="text-[11px] text-[#2F5E73] font-mono font-medium block mt-1">Physische Standorte</span>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-[#DFE3DC] shadow-sm">
              <span className="text-[11px] font-mono text-[#6C716B] uppercase font-bold block">Verifizierte CPOs</span>
              <span className="text-2xl sm:text-3xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">30</span>
              <span className="text-[11px] text-[#2F5E73] font-mono font-medium block mt-1">Institutionelle Betreiber</span>
            </div>
          </div>

          {/* Core Product Family: Monitor 01 & Monitor 02 (Mockup visual layout) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
            {/* Card 1: MONITOR / 01 - HPC City Monitor */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#DFE3DC] shadow-sm hover:border-[#171917] transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#6C716B] uppercase tracking-wider">
                    MONITOR / 01
                  </span>
                  <Link
                    to="/hpc-city-monitor"
                    aria-label="HPC City Monitor aufrufen"
                    className="w-9 h-9 rounded-full bg-[#C7F000] text-[#171917] flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95 shadow-sm"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#171917] tracking-tight group-hover:text-[#2F5E73] transition-colors">
                    HPC City Monitor
                  </h3>
                  <p className="text-sm text-[#6C716B] leading-relaxed mt-1">
                    Schnelllade-Infrastruktur deutscher Großstädte im Vergleich.
                  </p>
                </div>

                {/* Data Preview / Mini Bar Chart (Mockup) */}
                <div className="pt-2 space-y-2.5">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#171917] font-semibold">Berlin</span>
                      <span className="text-[#171917] font-bold tabular-nums">988</span>
                    </div>
                    <div className="h-2 w-full bg-[#F7F7F2] rounded-full overflow-hidden">
                      <div className="h-full bg-[#C7F000] rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#171917] font-semibold">Hamburg</span>
                      <span className="text-[#6C716B] tabular-nums">—</span>
                    </div>
                    <div className="h-2 w-full bg-[#F7F7F2] rounded-full overflow-hidden">
                      <div className="h-full bg-[#171917] rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#171917] font-semibold">München</span>
                      <span className="text-[#6C716B] tabular-nums">—</span>
                    </div>
                    <div className="h-2 w-full bg-[#F7F7F2] rounded-full overflow-hidden">
                      <div className="h-full bg-[#171917] rounded-full" style={{ width: '58%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tag Pills (Mockup) */}
              <div className="pt-6 mt-6 border-t border-[#DFE3DC] flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#C7F000] text-[#171917] text-[10px] font-mono font-bold uppercase tracking-wider">
                  50 STÄDTE
                </span>
                <span className="px-2.5 py-1 rounded bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC] text-[10px] font-mono font-semibold uppercase tracking-wider">
                  BNETZA
                </span>
                <span className="px-2.5 py-1 rounded bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC] text-[10px] font-mono font-semibold uppercase tracking-wider">
                  MONATLICH
                </span>
              </div>
            </div>

            {/* Card 2: MONITOR / 02 - CPO Monitor */}
            <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#DFE3DC] shadow-sm hover:border-[#171917] transition-all flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#6C716B] uppercase tracking-wider">
                    MONITOR / 02
                  </span>
                  <Link
                    to="/cpo-monitor"
                    aria-label="CPO Monitor aufrufen"
                    className="w-9 h-9 rounded-full bg-white border border-[#DFE3DC] text-[#171917] flex items-center justify-center transition-transform group-hover:scale-105 active:scale-95 shadow-sm hover:bg-[#F7F7F2]"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#171917] tracking-tight group-hover:text-[#2F5E73] transition-colors">
                    CPO Monitor
                  </h3>
                  <p className="text-sm text-[#6C716B] leading-relaxed mt-1">
                    Betreiberstrukturen und HPC-Bestand im BNetzA-Register.
                  </p>
                </div>

                {/* Operator List Data Preview (Mockup) */}
                <div className="pt-2 space-y-2 font-mono text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC]">
                    <span className="font-semibold text-[#171917]">EnBW mobility+</span>
                    <span className="font-bold text-[#171917] tabular-nums">8.338</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC]">
                    <span className="font-semibold text-[#171917]">Tesla Supercharger</span>
                    <span className="font-bold text-[#171917] tabular-nums">3.950</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC]">
                    <span className="font-semibold text-[#171917]">Aral pulse</span>
                    <span className="font-bold text-[#171917] tabular-nums">3.119</span>
                  </div>
                </div>
              </div>

              {/* Tag Pills (Mockup) */}
              <div className="pt-6 mt-6 border-t border-[#DFE3DC] flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded bg-[#C7F000] text-[#171917] text-[10px] font-mono font-bold uppercase tracking-wider">
                  HPC ≥150 KW
                </span>
                <span className="px-2.5 py-1 rounded bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC] text-[10px] font-mono font-semibold uppercase tracking-wider">
                  30 CPOS
                </span>
                <span className="px-2.5 py-1 rounded bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC] text-[10px] font-mono font-semibold uppercase tracking-wider">
                  REGISTERANTEILE
                </span>
              </div>
            </div>
          </div>

          {/* Instant-Finder Component (data-svsearch) */}
          <div className="max-w-4xl space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#6C716B] px-1">
              <span>⚡ Schnellsuche: Verifizierte Ladeparks ({dossierCount} Dossiers) &amp; BNetzA-Verzeichnisse</span>
              <span className="text-[#171917] font-bold">50 Städte · Autobahnen A1–A99 · CPOs</span>
            </div>
            <InstantFinder autoFocus={false} showFilters={true} />
          </div>

        </div>
      </section>

      {/* Hub-and-Spoke Silo 1: Top 50 Großstädte */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2F5E73] font-bold mb-1">
              <MapPin className="w-4 h-4" />
              <span>Städtische Ladeinfrastruktur</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171917]">
              Top 50 deutsche Großstädte im Lade-Vergleich
            </h2>
            <p className="text-sm text-[#6C716B] mt-1">
              Detaillierte Registerdaten zu Gesamtzahl, HPC-Anteil und städtischen Ausbauquoten.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/hpc-city-monitor"
              className="inline-flex items-center gap-1 text-sm font-semibold text-[#171917] hover:text-[#2F5E73]"
            >
              <span>HPC City Monitor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-[#DFE3DC]">|</span>
            <Link
              to="/staedte"
              className="inline-flex items-center gap-1 text-sm font-bold text-[#2F5E73] hover:text-[#171917]"
            >
              <span>Alle 50 Städte ansehen</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {topCities.map((city) => (
            <Link
              key={city.slug}
              to={`/staedte/${city.slug}`}
              className="group p-4 bg-white rounded-xl border border-[#DFE3DC] hover:border-[#171917] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-extrabold text-[#171917] group-hover:text-[#2F5E73] transition-colors">
                    {city.name}
                  </span>
                  <span className="text-xs font-mono font-bold bg-[#F7F7F2] text-[#171917] px-2 py-0.5 rounded border border-[#DFE3DC]">
                    {city.bundesland}
                  </span>
                </div>
                <div className="space-y-1 text-xs text-[#6C716B]">
                  <div className="flex justify-between">
                    <span>Ladepunkte gesamt:</span>
                    <strong className="text-[#171917] font-mono tabular-nums">{city.ladepunkteGesamt.toLocaleString('de-DE')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Ladepunkte (≥150 kW):</span>
                    <strong className="text-[#171917] font-mono tabular-nums">{city.hpcLadepunkte.toLocaleString('de-DE')}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Häufigste Betreiber:</span>
                    <span className="text-[#171917] truncate max-w-[140px]">{city.topBetreiber[0]}</span>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-[#DFE3DC] flex items-center justify-between text-xs font-semibold text-[#6C716B] group-hover:text-[#171917]">
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
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#171917] font-bold mb-1">
              <Navigation className="w-4 h-4 text-[#2F5E73]" />
              <span>Fernverkehr &amp; Transit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171917]">
              Bundesautobahnen: High-Power-Ladekorridore
            </h2>
            <p className="text-sm text-[#6C716B] mt-1">
              Raststätten, Autohöfe und Schnellladeparks entlang der Hauptverkehrsachsen A1 bis A99.
            </p>
          </div>
          <Link
            to="/autobahnen"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#2F5E73] hover:text-[#171917] shrink-0"
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
              className="group p-5 bg-white rounded-xl border border-[#DFE3DC] hover:border-[#171917] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-8 rounded-lg bg-[#171917] text-[#C7F000] font-black font-mono flex items-center justify-center text-sm border border-[#171917]">
                    {mw.name}
                  </div>
                  <span className="text-xs font-mono font-bold text-[#171917] bg-[#F7F7F2] border border-[#DFE3DC] px-2 py-0.5 rounded">
                    bis {mw.maxKw} kW
                  </span>
                </div>
                <h3 className="font-bold text-[#171917] text-sm mb-1 line-clamp-2">
                  {mw.route}
                </h3>
                <p className="text-xs text-[#6C716B] font-mono">
                  {mw.lengthKm} km Strecke · bis {mw.maxKw} kW HPC
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DFE3DC] flex items-center justify-between text-xs font-semibold text-[#6C716B] group-hover:text-[#171917]">
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
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2F5E73] font-bold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Charge Point Operators</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171917]">
              Lade-Betreiber im Leistungs- &amp; Tarif-Check
            </h2>
            <p className="text-sm text-[#6C716B] mt-1">
              Infrastruktur, Ladeleistungen bis 400 kW, Roaming-Netzwerke und AFIR-Zahlungsoptionen.
            </p>
          </div>
          <Link
            to="/betreiber"
            className="inline-flex items-center gap-1 text-sm font-bold text-[#2F5E73] hover:text-[#171917] shrink-0"
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
              className="group p-5 bg-white rounded-xl border border-[#DFE3DC] hover:border-[#171917] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-[#171917] text-base group-hover:text-[#2F5E73] transition-colors">
                    {op.name}
                  </h3>
                  <span className="text-xs font-mono font-bold bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC] px-2 py-0.5 rounded">
                    bis {op.maxKw} kW
                  </span>
                </div>
                <p className="text-xs text-[#6C716B] mb-3">{op.headquarters}</p>
                <p className="text-xs text-[#171917] line-clamp-2 leading-relaxed mb-4">
                  {op.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#F7F7F2] p-2.5 rounded-lg border border-[#DFE3DC]">
                  <div>
                    <span className="text-[#6C716B] block text-[10px]">LADEPUNKTE</span>
                    <strong className="text-[#171917] tabular-nums">{op.totalPointsDE.toLocaleString('de-DE')}</strong>
                  </div>
                  <div>
                    <span className="text-[#6C716B] block text-[10px]">HPC-ANTEIL</span>
                    <strong className="text-[#2F5E73] tabular-nums">{op.hpcShare} %</strong>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#DFE3DC] flex items-center justify-between text-xs font-semibold text-[#6C716B] group-hover:text-[#171917]">
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
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC] text-xs font-mono font-bold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-[#2F5E73]" />
            <span>RATGEBER &amp; LEITFÄDEN</span>
          </div>
          <h2 className="text-3xl font-extrabold text-[#171917] tracking-tight">
            Fundierte Leitfäden &amp; Marktanalysen
          </h2>
          <p className="text-sm text-[#6C716B] mt-2">
            Verlässliche Leitfäden zu Tarifen, Elektrotechnik und gesetzlichen Neuregelungen.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <Link
            to="/ratgeber/ladekarten-dschungel"
            className="group p-6 bg-white rounded-xl border border-[#DFE3DC] hover:border-[#171917] transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#2F5E73] font-bold block mb-2">
                Tarife &amp; Roaming
              </span>
              <h3 className="text-lg font-bold text-[#171917] group-hover:text-[#2F5E73] transition-colors mb-3 leading-snug">
                Ladekarten-Dschungel: Roaming-Preise, Grundgebühren &amp; wer wirklich spart
              </h3>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Überblick über Grundgebühren, Roaming-Aufschläge bei Dritt-CPOs und die besten Kombinationen für Viellader vs. Gelegenheitslader.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#DFE3DC] flex items-center gap-2 text-xs font-bold text-[#171917] group-hover:text-[#2F5E73]">
              <span>Leitfaden lesen</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/ratgeber/ac-vs-dc-ladeverluste"
            className="group p-6 bg-white rounded-xl border border-[#DFE3DC] hover:border-[#171917] transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#2F5E73] font-bold block mb-2">
                Elektrotechnik &amp; Physik
              </span>
              <h3 className="text-lg font-bold text-[#171917] group-hover:text-[#2F5E73] transition-colors mb-3 leading-snug">
                AC vs. DC Ladeverluste im Praxis-Vergleich: Wirkungsgrade &amp; Sparpotenziale
              </h3>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Warum an der Schuko-Steckdose bis zu 20 % verloren gehen, wie der Onboard-Charger arbeitet und welche Ladeleistung am effizientesten ist.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#DFE3DC] flex items-center gap-2 text-xs font-bold text-[#171917] group-hover:text-[#2F5E73]">
              <span>Technische Analyse</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/ratgeber/blockiergebuehren-vermeiden"
            className="group p-6 bg-white rounded-xl border border-[#DFE3DC] hover:border-[#171917] transition-all flex flex-col justify-between"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-[#2F5E73] font-bold block mb-2">
                Verbraucherschutz
              </span>
              <h3 className="text-lg font-bold text-[#171917] group-hover:text-[#2F5E73] transition-colors mb-3 leading-snug">
                Blockiergebühren an Ladesäulen vermeiden: Karenzzeiten &amp; CPO-Übersicht
              </h3>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Ab wann greift die Standzeitgebühr? Vergleichen Sie Karenzzeiten (240 Min. AC vs. 60 Min. DC) und Nachtregelungen aller Anbieter.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#DFE3DC] flex items-center gap-2 text-xs font-bold text-[#171917] group-hover:text-[#2F5E73]">
              <span>Gebühren-Vergleich</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

        </div>
      </section>

      {/* Glossar-Vorschau */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl p-6 sm:p-8 border border-[#DFE3DC] space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#171917] font-bold mb-1">
                <Cpu className="w-4 h-4 text-[#2F5E73]" />
                <span>E-Mobilitäts-Lexikon</span>
              </div>
              <h2 className="text-2xl font-black text-[#171917] tracking-tight">
                Fachglossar zur Ladeinfrastruktur
              </h2>
            </div>
            <Link
              to="/glossar"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold bg-[#F7F7F2] hover:bg-[#EAECE6] text-[#171917] border border-[#DFE3DC] transition-colors shrink-0"
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
                className="p-3.5 bg-[#F7F7F2] rounded-lg border border-[#DFE3DC] hover:border-[#171917] transition-colors group"
              >
                <span className="text-[10px] font-mono uppercase text-[#6C716B] block mb-1">
                  {term.category}
                </span>
                <span className="font-bold text-[#171917] group-hover:text-[#2F5E73] transition-colors text-sm block">
                  {term.term}
                </span>
                <p className="text-xs text-[#6C716B] line-clamp-2 mt-1">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC] text-xs font-mono font-bold">
            <HelpCircle className="w-3.5 h-3.5 text-[#2F5E73]" />
            <span>HÄUFIG GESTELLTE FRAGEN</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#171917] tracking-tight">
            Wissenswertes zur Ladeinfrastruktur in Deutschland
          </h2>
          <p className="text-sm sm:text-base text-[#6C716B] max-w-2xl mx-auto">
            Wichtige Fragen und Antworten zum Bundesnetzagentur-Ladesäulenregister, Ladearten und Abrechnung.
          </p>
        </div>

        <div className="space-y-3">
          <details className="group bg-white rounded-xl border border-[#DFE3DC] p-5 transition-all">
            <summary className="font-bold text-[#171917] cursor-pointer list-none flex justify-between items-center select-none text-base">
              <span>Wie viele öffentliche Ladesäulen gibt es in Deutschland?</span>
              <span className="text-[#6C716B] group-open:rotate-180 transition-transform text-lg">▾</span>
            </summary>
            <p className="text-sm text-[#6C716B] leading-relaxed mt-3 pt-3 border-t border-[#DFE3DC]">
              In Deutschland sind über 100.000 öffentlich zugängliche Ladepunkte im amtlichen Ladesäulenregister der Bundesnetzagentur (BNetzA) erfasst, darunter mehr als 28.500 HPC-Schnellladepunkte mit mindestens 150 kW Leistung.
            </p>
          </details>

          <details className="group bg-white rounded-xl border border-[#DFE3DC] p-5 transition-all">
            <summary className="font-bold text-[#171917] cursor-pointer list-none flex justify-between items-center select-none text-base">
              <span>Welche Gesetzesgrundlage regelt das Ladesäulenregister?</span>
              <span className="text-[#6C716B] group-open:rotate-180 transition-transform text-lg">▾</span>
            </summary>
            <p className="text-sm text-[#6C716B] leading-relaxed mt-3 pt-3 border-t border-[#DFE3DC]">
              Das Register basiert auf § 5 der Ladesäulenverordnung (LSV) sowie der europäischen AFIR-Verordnung (EU 2023/1804) über den Aufbau der Infrastruktur für alternative Kraftstoffe. Alle Betreiber sind gesetzlich verpflichtet, Inbetriebnahmen und technische Parameter zu melden.
            </p>
          </details>

          <details className="group bg-white rounded-xl border border-[#DFE3DC] p-5 transition-all">
            <summary className="font-bold text-[#171917] cursor-pointer list-none flex justify-between items-center select-none text-base">
              <span>Was ist der Unterschied zwischen AC- und DC-Laden?</span>
              <span className="text-[#6C716B] group-open:rotate-180 transition-transform text-lg">▾</span>
            </summary>
            <p className="text-sm text-[#6C716B] leading-relaxed mt-3 pt-3 border-t border-[#DFE3DC]">
              AC-Laden (Wechselstrom, typisch 11 bis 22 kW) nutzt den bordeigenen Gleichrichter des Elektroautos und ist ideal für längere Standzeiten (Arbeitsplatz, Übernachtung). DC-Laden (Gleichstrom, 50 bis 400 kW) speist direkt in die Batterie ein und lädt moderne E-Autos in 15 bis 30 Minuten von 10 % auf 80 % SoC.
            </p>
          </details>

          <details className="group bg-white rounded-xl border border-[#DFE3DC] p-5 transition-all">
            <summary className="font-bold text-[#171917] cursor-pointer list-none flex justify-between items-center select-none text-base">
              <span>Kann man an allen öffentlichen Ladesäulen ohne Vertrag laden?</span>
              <span className="text-[#6C716B] group-open:rotate-180 transition-transform text-lg">▾</span>
            </summary>
            <p className="text-sm text-[#6C716B] leading-relaxed mt-3 pt-3 border-t border-[#DFE3DC]">
              Ja. Gemäß europäischer AFIR-Richtlinie müssen alle öffentlich zugänglichen Schnellladepunkte spontanes Ad-hoc-Laden via Debitkarte, Kreditkarte oder kontaktlose Zahlung ohne feste Vertragsbindung oder App-Zwang ermöglichen.
            </p>
          </details>

          <details className="group bg-white rounded-xl border border-[#DFE3DC] p-5 transition-all">
            <summary className="font-bold text-[#171917] cursor-pointer list-none flex justify-between items-center select-none text-base">
              <span>Welche Betreiber betreiben die meisten Schnellladeparks?</span>
              <span className="text-[#6C716B] group-open:rotate-180 transition-transform text-lg">▾</span>
            </summary>
            <p className="text-sm text-[#6C716B] leading-relaxed mt-3 pt-3 border-t border-[#DFE3DC]">
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
          source2Title="Redaktionelle Kuration &amp; Verifizierte Ladeparks"
          source2Text="Ausgewählte Standorte und Betreiberübersichten redaktionell geprüft. Keine Gewähr für Echtzeit-Belegung oder Live-Betriebsbereitschaft vor Ort."
          dateText="Stand: BNetzA Open Data 01.10.2026"
        />
      </section>

    </div>
  );
};

export default Home;
