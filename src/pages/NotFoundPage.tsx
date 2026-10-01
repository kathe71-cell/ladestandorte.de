import React from 'react';
import { Link } from 'react-router-dom';
import { Home, MapPin, Navigation, Truck, Calculator, ArrowRight, AlertCircle } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { SEO } from '../components/SEO';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 space-y-10">
      <SEO
        title="404 – Seite nicht gefunden | ladestandorte.de"
        description="Die angeforderte Seite existiert nicht oder wurde verschoben. Finden Sie Ladesäulen, Autobahn-Ladeparks und MCS-Stationen über unsere Verzeichnisse."
        canonicalPath="/404"
        noIndex={true}
      />

      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 text-amber-900 border border-amber-300 mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="font-mono text-sm font-bold text-emerald-800 tracking-wider uppercase">
          Fehler 404
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
          Seite nicht gefunden
        </h1>
        <p className="text-slate-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
          Die von Ihnen aufgerufene Adresse existiert auf ladestandorte.de nicht oder wurde im Rahmen unserer Datenaktualisierung verschoben.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-slate-950 font-mono">
          Empfohlene Einstiege:
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/"
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-950 group-hover:text-emerald-900 transition-colors">
                Startseite
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Überblick über alle Ladesäulen und Tools
              </div>
            </div>
          </Link>

          <Link
            to="/staedte"
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-950 group-hover:text-emerald-900 transition-colors">
                Städte-Verzeichnis
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Top 50 deutsche Großstädte mit BNetzA-Daten
              </div>
            </div>
          </Link>

          <Link
            to="/autobahnen"
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-950 group-hover:text-emerald-900 transition-colors">
                Autobahn-Schnelllader
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                HPC-Ladeparks entlang A1 bis A99
              </div>
            </div>
          </Link>

          <Link
            to="/mcs"
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-950 group-hover:text-emerald-900 transition-colors">
                MCS &amp; E-Lkw Hubs
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Megawatt-Laden und Schwerlast-Korridore
              </div>
            </div>
          </Link>

          <Link
            to="/rechner"
            className="flex items-start gap-3.5 p-4 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:bg-slate-50 transition-all group sm:col-span-2"
          >
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 group-hover:bg-emerald-600 group-hover:text-white transition-colors shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-slate-950 group-hover:text-emerald-900 transition-colors">
                Ladezeit- &amp; Kostenrechner
              </div>
              <div className="text-xs text-slate-500 mt-0.5">
                Dauer und Stromkosten für alle Elektrofahrzeuge berechnen
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
