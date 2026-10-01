import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { MapPin, Zap, ShieldCheck, ArrowLeft, ArrowRight, Database, ExternalLink, Navigation, HelpCircle, Activity } from 'lucide-react';
import { CITIES_DATA, getCityMotorwaySlugs } from '../data/cities';
import { MOTORWAYS_DATA } from '../data/motorways';
import { STATIONS_DATA, StationData, getStationUrl } from '../data/stations';
import { getOperatorSlugByName } from '../utils/operatorHelper';
import { StationDetailModal } from '../components/StationDetailModal';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';
import { getSnapshotDateFormatted } from '../lib/datasetDate';

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

  const bnetzaSnapshotDate = city.bnetza?.provenance?.retrievedAt
    ? new Date(city.bnetza.provenance.retrievedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : getSnapshotDateFormatted();
  const destatisDate = city.population?.referenceDate
    ? new Date(city.population.referenceDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '31.12.2024';

  const faqs = [
    {
      q: `Wie viele öffentliche Ladepunkte sind in ${city.name} registriert?`,
      a: `Im ausgewerteten BNetzA-Registersnapshot (Stand ${bnetzaSnapshotDate}) sind für ${city.name} ${city.ladepunkteGesamt.toLocaleString('de-DE')} öffentliche Ladepunkte erfasst. Davon entfallen ${city.hpcLadepunkte.toLocaleString('de-DE')} auf Ladepunkte der HPC-Klasse mit mindestens 150 kW Nennleistung.`
    },
    {
      q: `Wie verteilt sich die Ladeleistung in ${city.name}?`,
      a: `Der erfasste Registerbestand in ${city.name} gliedert sich in ${city.powerClasses.upTo22Kw.toLocaleString('de-DE')} Ladepunkte bis 22 kW, ${city.powerClasses.between22And150Kw.toLocaleString('de-DE')} Ladepunkte zwischen >22 kW und <150 kW sowie ${city.powerClasses.hpc150PlusKw.toLocaleString('de-DE')} Ladepunkte mit mindestens 150 kW Nennleistung.`
    },
    {
      q: `Wie viele Ladepunkte gibt es in ${city.name} pro 1.000 Einwohner?`,
      a: `Bezogen auf die amtliche Einwohnerzahl von ${city.einwohner.toLocaleString('de-DE')} (Statistisches Bundesamt, Stand ${destatisDate}) weist der Registerbestand für ${city.name} rechnerisch ${city.pointsPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2 })} Ladepunkte pro 1.000 Einwohner aus (davon ${city.hpcPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2 })} mit ≥150 kW).`
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
            "name": "Städte",
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
        title={`Ladestationen ${city.name}: Ladepunkte & HPC-Daten | ladestandorte.de`}
        description={`Auswertung veröffentlichter BNetzA-Registerdaten für ${city.name}: ${city.ladepunkteGesamt.toLocaleString('de-DE')} Ladepunkte, ${city.hpcLadepunkte} Ladepunkte ≥150 kW und rechnerische Ladepunktdichte.`}
        canonicalPath={`/staedte/${city.slug}`}
        schema={citySchema}
      />

      <PageHero
        level={3}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Städte', href: '/staedte' },
          { label: city.name, isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#C7F000] text-[#171917] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#171917]"></span>
            <span>CITY DATA · {city.bundesland.toUpperCase()}</span>
          </div>
        }
        title={`Ladeinfrastruktur ${city.name}`}
        description={city.description}
      />

      {/* City Primary KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Ladepunkte gesamt</span>
          <span className="text-2xl sm:text-4xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">
            {city.ladepunkteGesamt.toLocaleString('de-DE')}
          </span>
          <span className="text-[11px] text-[#6C716B] mt-1 block font-mono">
            {city.bnetza.ladestationen.toLocaleString('de-DE')} Stationen
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] border-t-4 border-t-[#C7F000] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Ladepunkte ≥150 kW</span>
          <span className="text-2xl sm:text-4xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">
            {city.hpcLadepunkte.toLocaleString('de-DE')}
          </span>
          <span className="text-[11px] text-[#2F5E73] font-mono font-semibold mt-1 block">
            {((city.hpcLadepunkte / city.ladepunkteGesamt) * 100).toFixed(1)} % HPC-Klasse
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">LP / 1.000 Einwohner</span>
          <span className="text-2xl sm:text-4xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">
            {city.pointsPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-[#6C716B] mt-1 block font-mono">
            {city.einwohner.toLocaleString('de-DE')} Einw.
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">≥150 kW / 1.000 Einw.</span>
          <span className="text-2xl sm:text-4xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">
            {city.hpcPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[11px] text-[#6C716B] mt-1 block">
            HPC-Dichte
          </span>
        </div>
      </div>

      {/* Leistungsklassen Aufteilung */}
      <div className="bg-white rounded-xl p-6 border border-[#DFE3DC] shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DFE3DC] pb-3">
          <div>
            <h3 className="font-bold text-[#171917] text-base">
              Verteilung nach Leistungsklassen in {city.name}
            </h3>
            <p className="text-xs text-[#6C716B]">
              Dokumentierte Nennleistung der Ladepunkte im BNetzA-Registerbestand (keine Inferenz der Stromart).
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/hpc-city-monitor" className="text-xs font-semibold text-[#2F5E73] hover:text-[#171917] underline flex items-center gap-1">
              <Activity className="w-3 h-3" />
              <span>Im HPC City Monitor vergleichen</span>
            </Link>
            <span className="text-[#DFE3DC]">·</span>
            <Link to="/methodik" className="text-xs font-semibold text-[#6C716B] hover:text-[#171917] underline">
              Methodik
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono">
          <div className="p-4 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC]">
            <span className="text-xs text-[#6C716B] block font-sans">bis 22 kW</span>
            <span className="text-xl sm:text-2xl font-black text-[#171917] block mt-1 tabular-nums">
              {city.powerClasses.upTo22Kw.toLocaleString('de-DE')}
            </span>
            <span className="text-[11px] text-[#6C716B] block mt-0.5">
              {((city.powerClasses.upTo22Kw / city.ladepunkteGesamt) * 100).toFixed(1)} % aller Ladepunkte
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC]">
            <span className="text-xs text-[#6C716B] block font-sans">&gt;22 bis &lt;150 kW</span>
            <span className="text-xl sm:text-2xl font-black text-[#171917] block mt-1 tabular-nums">
              {city.powerClasses.between22And150Kw.toLocaleString('de-DE')}
            </span>
            <span className="text-[11px] text-[#6C716B] block mt-0.5">
              {((city.powerClasses.between22And150Kw / city.ladepunkteGesamt) * 100).toFixed(1)} % aller Ladepunkte
            </span>
          </div>

          <div className="p-4 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC]">
            <span className="text-xs text-[#171917] block font-sans font-bold">≥150 kW (HPC-Klasse)</span>
            <span className="text-xl sm:text-2xl font-black text-[#171917] block mt-1 tabular-nums">
              {city.powerClasses.hpc150PlusKw.toLocaleString('de-DE')}
            </span>
            <span className="text-[11px] text-[#2F5E73] font-mono font-semibold block mt-0.5">
              {((city.powerClasses.hpc150PlusKw / city.ladepunkteGesamt) * 100).toFixed(1)} % aller Ladepunkte
            </span>
          </div>
        </div>
      </div>

      {/* Provenance Box directly on page */}
      <div className="bg-white rounded-xl p-6 border border-[#DFE3DC] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2F5E73] font-bold">
          <Database className="w-4 h-4" />
          <span>Datengrundlage &amp; Transparenz</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div className="space-y-1">
            <div className="font-bold text-[#171917] uppercase font-mono">Ladeinfrastruktur</div>
            <div className="text-[#6C716B]">Bundesnetzagentur (Ladesäulenregister)</div>
            <div className="text-[#6C716B]">API-Snapshot: {bnetzaSnapshotDate}</div>
            <div className="text-[#6C716B]">Lizenz: CC BY 4.0 (Namensnennung: Bundesnetzagentur.de)</div>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-[#171917] uppercase font-mono">Bevölkerung</div>
            <div className="text-[#6C716B]">Statistisches Bundesamt (Destatis)</div>
            <div className="text-[#6C716B]">Stand: {destatisDate} (Zensus 2022 Fortschreibung)</div>
            <div className="text-[#6C716B]">Lizenz: dl-de/by-2-0 (GV-ISys)</div>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-slate-950 uppercase font-mono">Kennzahlen</div>
            <div className="text-slate-700">Eigene Berechnung von ladestandorte.de</div>
            <div className="text-slate-500">Dichtewerte pro 1.000 Einw. auf Basis dieser Stände</div>
            <div>
              <Link to="/methodik" className="text-slate-900 hover:underline font-bold inline-flex items-center gap-1">
                <span>Methodik ansehen</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-200 text-[11px] text-slate-500 leading-normal">
          <strong>Vollständigkeitshinweis:</strong> Die Auswertung basiert auf den im verwendeten Register/API-Datenbestand veröffentlichten Ladeeinrichtungen. Der Datenbestand stellt keine zwingend vollständige Erfassung der gesamten öffentlich zugänglichen Ladeinfrastruktur dar. Weder die Bundesnetzagentur noch Destatis haben die redaktionellen Auswertungen geprüft.
        </div>
      </div>

      {/* Top Operators in this City with Semantic Internal Links */}
      {city.topBetreiber && city.topBetreiber.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-mono uppercase tracking-wider text-slate-700 font-bold">
            Häufigste Betreiber im ausgewerteten Registerbestand ({city.name})
          </h3>
          <p className="text-xs text-slate-500">
            Häufigste gewerbliche und kommunale Betreiber nach dokumentierten Ladestationen im Stadtgebiet (keine Marktanteilsbehauptung):
          </p>
          <div className="flex flex-wrap gap-2">
            {city.topBetreiber.map((opStr) => {
              const cleanedName = opStr.replace(/\s\(\d+\)$/, '').trim();
              const opSlug = getOperatorSlugByName(cleanedName);
              if (opSlug) {
                return (
                  <Link
                    key={opStr}
                    to={`/betreiber/${opSlug}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-xs text-slate-800 hover:border-slate-400 hover:text-black transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{opStr}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </Link>
                );
              }
              return (
                <span
                  key={opStr}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-50 border border-slate-200 font-semibold text-xs text-slate-700"
                >
                  {opStr}
                </span>
              );
            })}
          </div>
        </div>
      )}

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

      {/* Hervorgehobene Ladestationen in dieser Stadt */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Hervorgehobene Schnellladestandorte in {city.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Dokumentierte Standorte aus dem BNetzA-Register mit Ladeleistung und Ausstattung.
            </p>
          </div>
          <Link
            to={`/suche?q=${encodeURIComponent(city.name)}`}
            className="text-xs font-bold text-slate-900 hover:underline inline-flex items-center gap-1"
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
              className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-[#171917] hover:bg-black text-white rounded-xl font-bold text-xs"
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
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-400 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-extrabold text-slate-950 group-hover:text-black transition-colors">
                      {st.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC] shrink-0">
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

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-900 group-hover:underline">
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
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-800 font-bold">
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
                <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-800 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
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
