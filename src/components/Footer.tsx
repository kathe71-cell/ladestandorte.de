import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ExternalLink, ShieldCheck, Database } from 'lucide-react';
import { AmazonPartnerSentence } from '@plattform/core';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#171917] text-slate-300 pt-16 pb-12 border-t border-[#171917]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Col 1 & 2: Brand & Portal mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#171917] p-1.5">
                <svg viewBox="0 0 32 32" className="w-full h-full" fill="none">
                  <path d="M9 7V23H21" stroke="#171917" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="23" cy="9" r="3" fill="#C7F000" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-white leading-none">
                  ladestandorte<span className="text-slate-400 font-semibold">.de</span>
                </span>
                <span className="text-[9px] font-mono uppercase tracking-widest text-[#C7F000] font-bold mt-1">
                  Ladeinfrastruktur · Datenbasiert
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Unabhängige Daten- und Informationsplattform für öffentliche Ladeinfrastruktur in Deutschland. Regelmäßig aktualisierte Auswertungen auf Basis veröffentlichter Registerdaten der Bundesnetzagentur (BNetzA Open Data, CC BY 4.0) und amtlicher Bevölkerungszahlen des Statistischen Bundesamtes (Destatis).
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2 text-[#C7F000] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Rechtlicher Unabhängigkeitshinweis</span>
              </div>
              <p>
                ladestandorte.de ist ein unabhängiges Analyse- und Informationsportal und steht in keinem gesellschaftsrechtlichen Verhältnis zur Bundesnetzagentur oder den dargestellten Betreibern (CPOs).
              </p>
            </div>
          </div>

          {/* Col 3: Verzeichnisse & Monitore */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Monitore &amp; Trassen
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/hpc-city-monitor" className="hover:text-[#C7F000] transition-colors font-medium text-white">01 HPC City Monitor (50 Städte)</Link></li>
              <li><Link to="/cpo-monitor" className="hover:text-[#C7F000] transition-colors font-medium text-white">02 CPO Monitor (BNetzA)</Link></li>
              <li><Link to="/staedte" className="hover:text-white transition-colors">Top 50 Großstädte</Link></li>
              <li><Link to="/staedte/berlin" className="hover:text-white transition-colors">Berlin Ladesäulen</Link></li>
              <li><Link to="/staedte/hamburg" className="hover:text-white transition-colors">Hamburg Ladesäulen</Link></li>
              <li><Link to="/staedte/muenchen" className="hover:text-white transition-colors">München Ladesäulen</Link></li>
              <li><Link to="/autobahnen" className="hover:text-white transition-colors">Autobahnen A1 bis A99</Link></li>
              <li><Link to="/autobahnen/a3" className="hover:text-white transition-colors">A3 Ladekorridor</Link></li>
              <li><Link to="/autobahnen/a7" className="hover:text-white transition-colors">A7 Schnelllader</Link></li>
              <li><Link to="/mcs" className="hover:text-white transition-colors">MCS &amp; E-Lkw Hubs</Link></li>
              <li><Link to="/betreiber" className="hover:text-white transition-colors">Alle CPOs im Vergleich</Link></li>
            </ul>
          </div>

          {/* Col 4: Tools & Ratgeber */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Tools &amp; Wissen
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/rechner" className="hover:text-white transition-colors">Ladekosten- &amp; Zeitrechner</Link></li>
              <li><Link to="/rechner-embed" className="hover:text-white transition-colors">Kostenloses Rechner-Widget</Link></li>
              <li><Link to="/ladekarten" className="hover:text-white transition-colors">Ladekarten-Vergleich</Link></li>
              <li><Link to="/wallbox-vergleich" className="hover:text-white transition-colors">Wallboxen für Zuhause</Link></li>
              <li><Link to="/ratgeber/ladekarten-dschungel" className="hover:text-white transition-colors">Ladekarten-Dschungel</Link></li>
              <li><Link to="/ratgeber/ac-vs-dc-ladeverluste" className="hover:text-white transition-colors">AC vs. DC Ladeverluste</Link></li>
              <li><Link to="/ratgeber/blockiergebuehren-vermeiden" className="hover:text-white transition-colors">Blockiergebühren-Guide</Link></li>
              <li><Link to="/glossar" className="hover:text-white transition-colors">E-Mobilitäts Glossar</Link></li>
            </ul>
          </div>

          {/* Col 5: Rechtliches & Daten */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Daten &amp; Recht
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/methodik" className="hover:text-[#C7F000] transition-colors font-semibold text-white">Daten &amp; Methodik</Link></li>
              <li><Link to="/impressum" className="hover:text-white transition-colors">→ Impressum (§ 5 DDG)</Link></li>
              <li><Link to="/datenschutz" className="hover:text-white transition-colors">Datenschutzerklärung</Link></li>
              <li>
                <a href="/data/hpc-city-monitor.json" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1 font-mono text-xs">
                  <span>hpc-city-monitor.json</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="/data/cpo-monitor.json" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1 font-mono text-xs">
                  <span>cpo-monitor.json</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  <span>llms.txt (KI-Spezifikation)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.bundesnetzagentur.de" target="_blank" rel="nofollow noopener noreferrer" className="hover:text-white transition-colors inline-flex items-center gap-1">
                  <Database className="w-3 h-3 text-[#C7F000]" />
                  <span>BNetzA Primärquelle</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Amazon-Pflichtsatz */}
        <div className="pt-6 pb-4 border-t border-slate-900 text-xs text-slate-400 leading-relaxed" data-amazon-sentence>
          <AmazonPartnerSentence />
        </div>

        {/* Bottom Facts Strip */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-300">
          <div>
            © {new Date().getFullYear()} ladestandorte.de · Ladeinfrastruktur. Datenbasiert.
          </div>
          <div className="flex flex-wrap items-center gap-3 text-slate-300">
            <span>BNetzA Open Data (CC BY 4.0)</span>
            <span>·</span>
            <span>Snapshot: 01.10.2026</span>
            <span>·</span>
            <span>Lokale System-Fonts</span>
            <span>·</span>
            <span>Barrierearmes Design (WCAG 2.1)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
