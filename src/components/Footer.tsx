import React from 'react';
import { Link } from 'react-router-dom';
import { Zap, ExternalLink, ShieldCheck, Database } from 'lucide-react';
import { AmazonPartnerSentence } from '@plattform/core';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">

          {/* Col 1 & 2: Brand & Portal mission */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
                <Zap className="w-5 h-5 fill-white stroke-white" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                ladestandorte<span className="text-emerald-400">.de</span>
              </span>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed pr-4">
              Das redaktionell unabhängige Verbraucher- und Datenportal für die öffentliche Ladeinfrastruktur in Deutschland – finanziert über gekennzeichnete Partnerlinks. Regelmäßig gepflegte Datenbasis auf Grundlage des amtlichen Ladesäulenregisters der Bundesnetzagentur (BNetzA Open Data).
            </p>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Rechtlicher Unabhängigkeitshinweis</span>
              </div>
              <p>
                ladestandorte.de ist ein redaktionell unabhängiges Informationsportal und steht in keinem gesellschaftsrechtlichen Verhältnis zur Bundesnetzagentur oder den dargestellten Betreibern (CPOs).
              </p>
            </div>
          </div>

          {/* Col 3: Verzeichnisse */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Verzeichnisse
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/staedte" className="hover:text-emerald-400 transition-colors">Top 50 Großstädte</Link></li>
              <li><Link to="/staedte/berlin" className="hover:text-emerald-400 transition-colors">Berlin Ladesäulen</Link></li>
              <li><Link to="/staedte/hamburg" className="hover:text-emerald-400 transition-colors">Hamburg Ladesäulen</Link></li>
              <li><Link to="/staedte/muenchen" className="hover:text-emerald-400 transition-colors">München Ladesäulen</Link></li>
              <li><Link to="/autobahnen" className="hover:text-emerald-400 transition-colors">Autobahnen A1 bis A99</Link></li>
              <li><Link to="/autobahnen/a3" className="hover:text-emerald-400 transition-colors">A3 Ladekorridor</Link></li>
              <li><Link to="/autobahnen/a7" className="hover:text-emerald-400 transition-colors">A7 Schnelllader</Link></li>
              <li><Link to="/betreiber" className="hover:text-emerald-400 transition-colors">Alle CPOs im Vergleich</Link></li>
            </ul>
          </div>

          {/* Col 4: Tools & Ratgeber */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Tools &amp; Wissen
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/rechner" className="hover:text-emerald-400 transition-colors">Ladekosten- &amp; Zeitrechner</Link></li>
              <li><Link to="/rechner-embed" className="hover:text-emerald-400 transition-colors">Kostenloses Rechner-Widget</Link></li>
              <li><Link to="/ladekarten" className="hover:text-emerald-400 transition-colors">Ladekarten-Vergleich</Link></li>
              <li><Link to="/wallbox-vergleich" className="hover:text-emerald-400 transition-colors">Wallboxen für Zuhause</Link></li>
              <li><Link to="/ratgeber/ladekarten-dschungel" className="hover:text-emerald-400 transition-colors">Ladekarten-Dschungel</Link></li>
              <li><Link to="/ratgeber/ac-vs-dc-ladeverluste" className="hover:text-emerald-400 transition-colors">AC vs. DC Ladeverluste</Link></li>
              <li><Link to="/ratgeber/blockiergebuehren-vermeiden" className="hover:text-emerald-400 transition-colors">Blockiergebühren-Guide</Link></li>
              <li><Link to="/glossar" className="hover:text-emerald-400 transition-colors">E-Mobilitäts Glossar</Link></li>
            </ul>
          </div>

          {/* Col 5: Rechtliches & Daten */}
          <div className="space-y-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-200 font-bold">
              Transparenz &amp; Recht
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><Link to="/impressum" className="hover:text-emerald-400 transition-colors font-medium">→ Impressum (§ 5 DDG)</Link></li>
              <li><Link to="/datenschutz" className="hover:text-emerald-400 transition-colors">Datenschutzerklärung</Link></li>
              <li>
                <a href="/llms.txt" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                  <span>llms.txt (KI-Spezifikation)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="/feed.xml" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                  <span>RSS Feed 2.0</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://www.bundesnetzagentur.de" target="_blank" rel="nofollow noopener noreferrer" className="hover:text-emerald-400 transition-colors inline-flex items-center gap-1">
                  <Database className="w-3 h-3 text-emerald-400" />
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
            © {new Date().getFullYear()} ladestandorte.de · Alle Rechte vorbehalten
          </div>
          <div className="flex flex-wrap items-center gap-3 text-slate-300">
            <span>BNetzA Open Data (CC BY 4.0)</span>
            <span>·</span>
            <span>AFIR Marktübersicht</span>
            <span>·</span>
            <span>Lokale System-Fonts (Kein Font-CDN)</span>
            <span>·</span>
            <span>Barrierearmes Design (WCAG 2.1)</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
