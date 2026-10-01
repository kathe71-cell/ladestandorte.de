import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Truck,
  ShieldCheck,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Clock,
  Layers,
  Fuel,
  Info,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { STATIONS_DATA, getMcsStations, getStationUrl } from '../data/stations';

import { Breadcrumb } from '../components/Breadcrumb';
import { SEO } from '../components/SEO';

export const McsHubPage: React.FC = () => {
  const mcsStations = useMemo(() => getMcsStations(STATIONS_DATA), []);

  const operationalCount = mcsStations.filter((s) => s.truckCharging?.mcsStatus === 'operational').length;
  const underConstructionCount = mcsStations.filter((s) => s.truckCharging?.mcsStatus === 'under-construction').length;
  const plannedCount = mcsStations.filter((s) => s.truckCharging?.mcsStatus === 'planned').length;

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
            "name": "MCS & E-Lkw Ladehubs",
            "item": "https://www.ladestandorte.de/mcs"
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://www.ladestandorte.de/mcs#webpage",
        "url": "https://www.ladestandorte.de/mcs",
        "name": "Megawatt Charging System (MCS): E-Lkw Ladehubs in Deutschland 2026",
        "description": "Übersicht und verifizierte Dossiers öffentlich zugänglicher MCS- und Schwerlast-Ladeparks für schwere Nutzfahrzeuge entlang der Bundesautobahnen. Ladeleistungen von 400 kW bis 1.200 kW.",
        "inLanguage": "de-DE",
        "isPartOf": {
          "@type": "WebSite",
          "@id": "https://www.ladestandorte.de/#website",
          "name": "ladestandorte.de",
          "url": "https://www.ladestandorte.de/"
        }
      }
    ]
  };

  return (
    <div className="bg-white min-h-screen">
      <SEO
        title="Megawatt Charging System (MCS): E-Lkw Ladehubs in Deutschland 2026"
        description="Megawatt-Schnellladen für schwere E-Lkw in Deutschland: Verifizierte MCS- und Lkw-Ladeparks bis 1.200 kW, Standorte, Normung & Korridore."
        canonicalPath="/mcs"
        schema={schema}
      />
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-slate-50 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: 'Startseite', href: '/' },
              { label: 'MCS & E-Lkw Ladehubs', isCurrent: true }
            ]}
          />
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-14 sm:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold">
              <Truck className="w-4 h-4 text-emerald-400" />
              <span>Megawatt Charging System (MCS) · CharIN Standard</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.15]">
              Megawatt-Laden für E-Lkw in Deutschland
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Übersicht und verifizierte Dossiers öffentlich zugänglicher MCS- und Schwerlast-Ladeparks für schwere Nutzfahrzeuge (Klasse N3) entlang der Bundesautobahnen. Ladeleistungen von 400 kW bis 1.200 kW.
            </p>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Pilot-Hubs</span>
                <span className="text-2xl font-black font-mono text-white mt-0.5 block">{mcsStations.length}</span>
                <span className="text-[11px] text-emerald-400">Verifiziert</span>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Aktiv (In Betrieb)</span>
                <span className="text-2xl font-black font-mono text-emerald-400 mt-0.5 block">{operationalCount}</span>
                <span className="text-[11px] text-slate-400">Realer Pilotbetrieb</span>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Im Bau / Geplant</span>
                <span className="text-2xl font-black font-mono text-amber-400 mt-0.5 block">{underConstructionCount + plannedCount}</span>
                <span className="text-[11px] text-slate-400">Netzausbau 2026/27</span>
              </div>
              <div className="bg-slate-900/80 rounded-xl p-3.5 border border-slate-800">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Spitzenleistung</span>
                <span className="text-2xl font-black font-mono text-white mt-0.5 block">1.200 kW</span>
                <span className="text-[11px] text-slate-400">Flüssigkeitsgekühlt</span>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap gap-3">
              <Link
                to="/mcs/ladestationen"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>Alle MCS-Standorte ansehen</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/mcs/was-ist-mcs"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all"
              >
                <span>Was ist MCS? Technik erklärt</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        
        {/* Hub Verzeichnis Teaser */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 mb-1">
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Verifizierte Pilotstandorte</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
                Aktuelle Schwerlast-Ladeparks in Deutschland
              </h2>
            </div>
            <Link
              to="/mcs/ladestationen"
              className="inline-flex items-center gap-1 text-sm font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              <span>Vollständiges Verzeichnis öffnen ({mcsStations.length})</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mcsStations.slice(0, 6).map((st) => (
              <Link
                key={st.id}
                to={getStationUrl(st)}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="font-extrabold text-slate-950 group-hover:text-emerald-800 transition-colors line-clamp-1">
                      {st.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold shrink-0 border ${
                      st.truckCharging?.mcsStatus === 'operational'
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
                        : 'bg-amber-50 text-amber-950 border-amber-300'
                    }`}>
                      {st.truckCharging?.mcsStatus === 'operational' ? 'MCS Aktiv' : 'MCS Im Bau / Geplant'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mb-3">
                    {st.street}, {st.plz} {st.city} · {st.operator}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Ladeleistung</span>
                      <span className="font-bold text-slate-900">
                        {st.truckCharging?.mcsAvailable && st.truckCharging?.mcsMaxKw 
                          ? `${st.truckCharging.mcsMaxKw} kW MCS` 
                          : `${st.truckCharging?.ccsMaxKw || st.kwMax} kW CCS`}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Ladebuchten</span>
                      <span className="font-bold text-slate-900">
                        {st.truckCharging?.mcsPointsCount 
                          ? `${st.truckCharging.mcsPointsCount} MCS-Punkte` 
                          : `${st.pointsCount} Buchten`}
                      </span>
                    </div>
                  </div>

                  {st.truckCharging?.driveThrough && (
                    <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-emerald-800 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Drive-Through (Durchfahrtsspur für Gespanne)</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-800">
                  <span>Dossier öffnen</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Wissen & Grundlagen */}
        <section className="bg-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200 space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 mb-1">
              <Zap className="w-4 h-4 text-emerald-600" />
              <span>Hintergrundwissen</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              Technologie &amp; Logistik-Praxis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link
              to="/mcs/was-ist-mcs"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-950 group-hover:text-emerald-800 transition-colors">
                  Was ist MCS?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Der weltweite CharIN-Standard für Megawatt-Charging: Bis zu 3.750 kW Ladeleistung, aktive Flüssigkeitskühlung und 1.250 Volt Systemspannung.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-emerald-800">
                <span>Leitfaden lesen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              to="/mcs/mcs-vs-ccs"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-950 group-hover:text-emerald-800 transition-colors">
                  MCS vs. CCS im Vergleich
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Stecker-Geometrie, Ladezeiten, Kabelgewicht und Kühlung im direkten Vergleich: Warum CCS bei kurzen Fernverkehrs-Ladepausen an technische Grenzen stößt.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-emerald-800">
                <span>Vergleichstabelle ansehen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>

            <Link
              to="/mcs/lkw-laden"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Clock className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-950 group-hover:text-emerald-800 transition-colors">
                  Lkw-Laden &amp; Lenkzeitpause
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Wie die gesetzliche 45-Minuten-Pause nach EG-Sozialvorschriften mit 1.000 kW Ladeleistung für 400 km Nachladen genutzt werden kann.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-emerald-800">
                <span>Praxisleitfaden lesen</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          </div>
        </section>

        {/* Relevante Autobahn-Korridore */}
        <section className="space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 mb-1">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Logistik-Achsen</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight">
              MCS-Korridore an den Bundesautobahnen
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Entlang der zentralen Transitkorridore entstehen aktuell die ersten Hochleistungskorridore für den elektrischen Straßengüterverkehr.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { name: 'A2', slug: 'a2', desc: 'HoLa-Pilotkorridor (Hannover–Berlin)' },
              { name: 'A7', slug: 'a7', desc: 'Nord-Süd-Achse (Schwarmstedt, Kassel)' },
              { name: 'A9', slug: 'a9', desc: 'München–Berlin (Schnaittach)' },
              { name: 'A10', slug: 'a10', desc: 'Berliner Ring (Königs Wusterhausen)' },
              { name: 'A24', slug: 'a24', desc: 'Hamburg–Berlin (Rastow)' },
              { name: 'A4', slug: 'a4', desc: 'Ost-West-Magistrale (Hermsdorfer Kreuz)' },
            ].map((m) => (
              <Link
                key={m.name}
                to={`/autobahnen/${m.slug}`}
                className="p-4 bg-white rounded-xl border border-slate-200 hover:border-emerald-300 hover:shadow-xs transition-all text-center group"
              >
                <span className="text-2xl font-black text-slate-950 group-hover:text-emerald-700 transition-colors block">
                  {m.name}
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block line-clamp-2">
                  {m.desc}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Data Provenance Notice */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-900">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Datenquellen &amp; Datenherkunft</span>
          </div>
          <p>
            Alle Angaben zu Ladeleistung, MCS-Standard und Lkw-Stellplätzen stammen aus offiziellen Betreibermitteilungen (Aral pulse, Milence) oder wissenschaftlich begleiteten Förderprojekten des Bundes (z. B. HoLa Hochleistungsladen im Lkw-Fernverkehr). Das amtliche BNetzA-Register führt MCS-Anschlüsse aktuell noch ohne gesonderte Steckertyp-Differenzierung.
          </p>
        </div>
      </main>
    </div>
  );
};

export default McsHubPage;
