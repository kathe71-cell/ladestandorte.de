import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MapPin, Zap, ShieldCheck, ArrowLeft, ArrowRight, Database, ExternalLink, Navigation, HelpCircle } from 'lucide-react';
import { CITIES_DATA, getCityMotorwaySlugs } from '../data/cities';
import { MOTORWAYS_DATA } from '../data/motorways';
import { STATIONS_DATA, StationData, getStationUrl } from '../data/stations';
import { getOperatorSlugByName } from '../utils/operatorHelper';
import { StationDetailModal } from '../components/StationDetailModal';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { PageHero } from '../components/PageHero';

export const CityPage: React.FC = () => {
  const { citySlug } = useParams<{ citySlug: string }>();
  const city = CITIES_DATA.find(c => c.slug === citySlug);
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);

  if (!city) {
    return <Navigate to="/staedte" replace />;
  }

  const cityStations = STATIONS_DATA.filter(s => s.citySlug === city.slug);

  const motorwaySlugs = getCityMotorwaySlugs(city.slug);
  const connectedMotorways = motorwaySlugs
    .map(slug => MOTORWAYS_DATA.find(m => m.slug === slug))
    .filter(Boolean) as typeof MOTORWAYS_DATA;

  const faqs = [
    {
      q: `Wie viele öffentliche Ladesäulen gibt es in ${city.name}?`,
      a: `In ${city.name} stehen laut offiziellem Ladesäulenregister der Bundesnetzagentur aktuell ${city.ladepunkteGesamt.toLocaleString('de-DE')} öffentliche Ladepunkte zur Verfügung. Davon entfallen ${city.hpcLadepunkte.toLocaleString('de-DE')} auf High-Power-Charger (HPC) mit mindestens 150 kW Leistung und ${city.acLadepunkte.toLocaleString('de-DE')} auf AC-Normalladepunkte im Stadtgebiet.`
    },
    {
      q: `Welche maximale Ladeleistung bieten die Schnelllader in ${city.name}?`,
      a: `Die Schnellladeparks an den Hauptverkehrsachsen und Autobahnzubringern rund um ${city.name} erreichen Spitzenleistungen von bis zu 300 bis 400 kW (u. a. an Hubs von ${city.topBetreiber.slice(0, 3).join(', ')}). Im gesamten Stadtgebiet liegt die rechnerische Durchschnittsleistung bei ${city.avgKw} kW pro Ladepunkt.`
    },
    {
      q: `Kann man in ${city.name} spontan ohne Ladekarte laden?`,
      a: `Ja. Alle öffentlichen Ladepunkte in ${city.name} unterstützen spontanes Ad-hoc-Laden. Schnellladepunkte (ab 50 kW) bieten gemäß europäischer AFIR-Richtlinie kontaktlose Kartenzahlung mit Debit- oder Kreditkarte direkt am Terminal. Für regelmäßiges Laden empfiehlt sich jedoch ein günstiger Ladekarten-Tarif.`
    }
  ];

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
            "item": "https://www.ladestandorte.de/"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "Großstädte",
            "item": "https://www.ladestandorte.de/staedte"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": city.name,
            "item": `https://www.ladestandorte.de/staedte/${city.slug}`
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
      },
      {
        "@type": "FAQPage",
        "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title={`Ladesäulen in ${city.name}: ${city.ladepunkteGesamt.toLocaleString('de-DE')} Ladepunkte & HPC-Ladenetz 2026`}
        description={`Öffentliche Ladesäulen & HPC-Schnelllader in ${city.name} (${city.bundesland}): ${city.ladepunkteGesamt.toLocaleString('de-DE')} Ladepunkte, ${city.hpcLadepunkte} HPC-Schnelllader. BNetzA Daten & Standorte 2026.`}
        canonicalPath={`/staedte/${city.slug}`}
        schema={citySchema}
      />
      
      <PageHero
        level={3}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Großstädte', href: '/staedte' },
          { label: city.name, isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-mono font-bold">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>BUNDESLAND: {city.bundesland.toUpperCase()} · QUELLE: BNETZA OPEN DATA</span>
          </div>
        }
        title={`Ladesäulen & Schnellladeparks in ${city.name}`}
        description={city.description}
      />

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

      {/* Datengrundlage / Registerdaten-Klarstellung */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
        <Database className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 font-semibold">Datengrundlage:</strong> Die hinterlegten Stadtkennzahlen für {city.name} basieren auf BNetzA-/Registerdaten. Die HPC-Quote ({((city.hpcLadepunkte / city.ladepunkteGesamt) * 100).toFixed(1)} %) wird aus den hinterlegten Werten berechnet. Die Daten werden manuell gepflegt und stellen keine Echtzeitdaten dar. Details in der <Link to="/methodik" className="text-emerald-700 hover:text-emerald-800 font-semibold underline">Methodik</Link>.
        </p>
      </div>

      {/* Top Operators in this City with Semantic Internal Links */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <h3 className="text-sm font-mono uppercase tracking-wider text-slate-600 font-bold">
          Führende Betreiber (CPOs) in {city.name}
        </h3>
        <div className="flex flex-wrap gap-2">
          {city.topBetreiber.map((op) => {
            const opSlug = getOperatorSlugByName(op);
            if (opSlug) {
              return (
                <Link
                  key={op}
                  to={`/betreiber/${opSlug}`}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-sm text-slate-800 shadow-xs hover:border-emerald-300 hover:text-emerald-700 transition-colors inline-flex items-center gap-1.5"
                >
                  <span>{op}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              );
            }
            return (
              <span
                key={op}
                className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 font-bold text-sm text-slate-800 shadow-xs"
              >
                {op}
              </span>
            );
          })}
        </div>
      </div>

      {/* Connected Motorways Corridor Links */}
      {connectedMotorways.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-700 font-bold">
            <Navigation className="w-4 h-4" />
            <span>Fernverkehr &amp; Autobahn-Korridore</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-950">
            Autobahn-Schnellladeparks ab {city.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Wichtige Schnelllade-Achsen und Raststätten für Fernfahrten ab {city.name}.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {connectedMotorways.map((mw) => (
              <Link
                key={mw.slug}
                to={`/autobahnen/${mw.slug}`}
                className="group p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-amber-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="w-12 h-8 rounded-lg bg-amber-400 text-slate-950 font-black font-mono flex items-center justify-center text-sm shadow-xs">
                      {mw.name}
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-600">
                      Zur Autobahn
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm mb-1 line-clamp-1 group-hover:text-amber-800 transition-colors">
                    {mw.route}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    bis {mw.maxKw} kW HPC · {mw.lengthKm} km
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500 group-hover:text-amber-700">
                  <span>Raststätten-Hubs ansehen</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Verifizierte Ladestationen in dieser Stadt */}
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
              <Link
                key={st.id}
                to={getStationUrl(st)}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between group"
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
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
                  <span>Standort ansehen</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Local City FAQs */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
          <HelpCircle className="w-4 h-4" />
          <span>Häufig gestellte Fragen (FAQ)</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-950">
          Ladeinfrastruktur in {city.name}: Häufige Fragen
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="font-bold text-slate-950 text-sm sm:text-base flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
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
