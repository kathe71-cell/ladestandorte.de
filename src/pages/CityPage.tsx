import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MapPin, Zap, ShieldCheck, ArrowLeft, ArrowRight, Database, ExternalLink } from 'lucide-react';
import { CITIES_DATA } from '../data/cities';
import { STATIONS_DATA, StationData } from '../data/stations';
import { StationDetailModal } from '../components/StationDetailModal';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';

export const CityPage: React.FC = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const city = CITIES_DATA.find(c => c.slug === citySlug);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);

  if (!city) {
    return <Navigate to="/staedte" replace />;
  }

  const cityStations = STATIONS_DATA.filter(s => s.citySlug === city.slug);

  const citySchema = {
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
            "name": "Großstädte",
            "item": "https://ladestandorte.de/staedte"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": city.name,
            "item": `https://ladestandorte.de/staedte/${city.slug}`
          }
        ]
      },
      {
        "@type": "Place",
        "name": `Ladeinfrastruktur ${city.name}`,
        "description": city.description,
        "address": {
          "@type": "PostalAddress",
          "addressLocality": city.name,
          "addressRegion": city.bundesland,
          "addressCountry": "DE"
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title={`Ladesäulen in ${city.name} (${city.ladepunkteGesamt} Ladepunkte)`}
        description={`Öffentliche Ladesäulen & HPC-Schnelllader in ${city.name} (${city.bundesland}). ${city.ladepunkteGesamt} Ladepunkte, ${city.hpcLadepunkte} HPC-Lader. BNetzA Daten.`}
        canonicalPath={`/staedte/${city.slug}`}
        schema={citySchema}
      />
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link to="/" className="hover:text-emerald-700">Startseite</Link>
        <span>/</span>
        <Link to="/staedte" className="hover:text-emerald-700">Großstädte</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">{city.name}</span>
      </div>

      {/* Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-mono font-bold">
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>BUNDESLAND: {city.bundesland.toUpperCase()} · QUELLE: BNETZA OPEN DATA</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Ladesäulen &amp; Schnellladeparks in {city.name}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {city.description}
        </p>
      </div>

      {/* City Statistics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Ladepunkte gesamt</span>
          <span className="text-2xl sm:text-4xl font-black text-slate-950 font-mono tracking-tight mt-1 block">
            {city.ladepunkteGesamt.toLocaleString('de-DE')}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Öffentlich registriert</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">HPC-Schnelllader (≥150 kW)</span>
          <span className="text-2xl sm:text-4xl font-black text-emerald-600 font-mono tracking-tight mt-1 block">
            {city.hpcLadepunkte}
          </span>
          <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
            {((city.hpcLadepunkte / city.ladepunkteGesamt) * 100).toFixed(1)} % HPC-Quote
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">AC-Normallader (&le;22 kW)</span>
          <span className="text-2xl sm:text-4xl font-black text-slate-950 font-mono tracking-tight mt-1 block">
            {city.acLadepunkte.toLocaleString('de-DE')}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Städtisches Laternen- &amp; Parknetz</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Durchschnittsleistung</span>
          <span className="text-2xl sm:text-4xl font-black text-slate-950 font-mono tracking-tight mt-1 block">
            {city.avgKw} kW
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">Pro Ladepunkt</span>
        </div>
      </div>

      {/* Top Operators in this City */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-600 font-bold">
          Führende Betreiber (CPOs) in {city.name}
        </h3>
        <div className="flex flex-wrap gap-2">
          {city.topBetreiber.map((op) => (
            <span
              key={op}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-sm text-slate-800 shadow-xs"
            >
              {op}
            </span>
          ))}
        </div>
      </div>


      {/* Flagship Charging Stations in this City */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Hervorgehobene Schnellladestandorte in {city.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Verifizierte Standorte aus dem BNetzA-Register mit Ladeleistung und Bezahlmethoden.
            </p>
          </div>
          <Link
            to={`/suche?q=${encodeURIComponent(city.name)}`}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
          >
            <span>Alle in der Suche filtern</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {cityStations.length === 0 ? (
          <div className="p-6 bg-white rounded-2xl border border-slate-200 text-center text-slate-500">
            <p>In der Schnellansicht sind für {city.name} alle Ladepunkte im Volltext-Finder verfügbar.</p>
            <Link
              to={`/suche?q=${encodeURIComponent(city.name)}`}
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs"
            >
              <span>Instant-Finder für {city.name} starten</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cityStations.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStation(st)}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-extrabold text-slate-950 group-hover:text-emerald-700 transition-colors">
                      {st.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
                      {st.kwMax} kW {st.isHpc ? 'HPC' : 'AC'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">
                    {st.street}, {st.plz} {st.city} · {st.operator}
                  </p>
                  
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
                    {st.connectorTypes.map(c => (
                      <span key={c} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {c}
                      </span>
                    ))}
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {st.pointsCount} Anschlüsse
                    </span>
                  </div>

                  {/* Komfort & AFIR Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {st.isCovered && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        ☔ Überdacht
                      </span>
                    )}
                    {(st.hasRestrooms || st.hasDining) && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        🚻 WC / Gastro
                      </span>
                    )}
                    {st.hasAfirTerminal && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        💳 AFIR Kartenzahlung
                      </span>
                    )}
                    {st.hasAutoCharge && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-800 border border-purple-200">
                        ⚡ AutoCharge
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Technische Spezifikation öffnen</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Citation Box */}
      <CitationBox
        title={`Ladesäulen und Schnellladeparks in ${city.name}`}
        urlPath={`/staedte/${city.slug}`}
      />

      {/* EEAT Badge */}
      <EEATBadge topic={`Stadtdossier ${city.name}`} />

      {/* Modal */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />

    </div>
  );
};

export default CityPage;
