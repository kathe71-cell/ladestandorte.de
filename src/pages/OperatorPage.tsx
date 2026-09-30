import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ShieldCheck, Zap, CheckCircle2, ArrowRight, Star, CreditCard, HelpCircle, MapPin } from 'lucide-react';
import { OPERATORS_DATA } from '../data/operators';
import { STATIONS_DATA, StationData } from '../data/stations';
import { CitationBox } from '../components/CitationBox';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { StationDetailModal } from '../components/StationDetailModal';

export const OperatorPage: React.FC = () => {
  const { operatorSlug } = useParams<{ operatorSlug: string }>();
  const [selectedStation, setSelectedStation] = useState<StationData | null>(null);

  // Normalize aliases so legacy indexed URLs (/betreiber/enbw-mobility-plus or /betreiber/tesla) resolve reliably
  const normalizedSlug = operatorSlug === 'enbw-mobility-plus' 
    ? 'enbw' 
    : (operatorSlug === 'tesla' ? 'tesla-supercharger' : operatorSlug);

  const operator = OPERATORS_DATA.find(o => o.slug === normalizedSlug || o.slug === operatorSlug);

  if (!operator) {
    return <Navigate to="/betreiber" replace />;
  }

  // Match stations across normalized slugs
  const operatorStations = STATIONS_DATA.filter(s => 
    s.operatorSlug === operator.slug ||
    (operator.slug === 'enbw' && (s.operatorSlug === 'enbw' || s.operatorSlug === 'enbw-mobility-plus')) ||
    (operator.slug === 'tesla-supercharger' && (s.operatorSlug === 'tesla' || s.operatorSlug === 'tesla-supercharger'))
  );

  const faqs = [
    {
      q: `Wie viel kostet das Laden bei ${operator.name}?`,
      a: `Im Standard-Ad-hoc-Tarif ohne Vertragsbindung liegt der kWh-Preis bei ${operator.standardPriceDc > 0 ? `${operator.standardPriceDc.toFixed(2).replace('.', ',')} €/kWh für DC-Schnellladung` : 'marktüblichen Konditionen'}${operator.standardPriceAc > 0 ? ` und ${operator.standardPriceAc.toFixed(2).replace('.', ',')} €/kWh für AC-Normalladung` : ''}. Mit Ladekarten von Partner-EMPs (z.B. EnBW mobility+, ADAC, Maingau) oder einem Betreiber-Abonnement können die Kosten pro Kilowattstunde oft signifikant gesenkt werden.`
    },
    {
      q: `Kann man an ${operator.name} Stationen ohne Ladekarte und Registrierung laden?`,
      a: `Ja. Gemäß der europäischen AFIR-Verordnung (EU 2023/1804) unterstützen alle neueren Schnellladepunkte von ${operator.name} das direkte Ad-hoc-Laden mit kontaktloser Debit- oder Kreditkarte (Girocard, Visa, Mastercard, Apple Pay, Google Pay) direkt an der Säule oder über einen dynamischen QR-Code.`
    },
    {
      q: `Unterstützt ${operator.name} Plug & Charge oder AutoCharge?`,
      a: `${operator.plugAndCharge ? `${operator.name} unterstützt den nach ISO 15118 zertifizierten Standard Plug & Charge, bei dem das Fahrzeug nach dem Einstecken automatisch erkannt und abgerechnet wird.` : ''}${operator.autocharge ? ` Zudem steht AutoCharge über die Betreiber-App zur Verfügung.` : ''}${!operator.plugAndCharge && !operator.autocharge ? `Die Freischaltung erfolgt derzeit bequem über RFID-Ladekarte, die Betreiber-App oder Ad-hoc-Kartenzahlung.` : ''}`
    },
    {
      q: `Welche maximale Ladeleistung bieten die Stationen von ${operator.name}?`,
      a: `In der Spitze liefert ${operator.name} bis zu ${operator.maxKw} kW Ladeleistung pro HPC-Ladepunkt. Mit einem HPC-Anteil von rund ${operator.hpcShare} % ist das Ladenetz optimal für zügige Zwischenstopps auf Fernreisen und Pendelstrecken ausgelegt.`
    }
  ];

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
            "name": "Betreiber",
            "item": "https://www.ladestandorte.de/betreiber"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": operator.name,
            "item": `https://www.ladestandorte.de/betreiber/${operator.slug}`
          }
        ]
      },
      {
        "@type": "Organization",
        "name": operator.name,
        "description": operator.description
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
        title={`${operator.name}: Ladenetz, Tarife & ${operator.totalPointsDE.toLocaleString('de-DE')} Ladepunkte in Deutschland 2026`}
        description={`${operator.name} im Faktencheck: ${operator.totalPointsDE.toLocaleString('de-DE')} Ladepunkte, bis zu ${operator.maxKw} kW HPC, ${operator.hpcShare}% HPC-Anteil. Preise, Roaming, Plug & Charge & BNetzA-Daten 2026.`}
        canonicalPath={`/betreiber/${operator.slug}`}
        schema={schema}
      />
      
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link to="/" className="hover:text-purple-700">Startseite</Link>
        <span>/</span>
        <Link to="/betreiber" className="hover:text-purple-700">Betreiber</Link>
        <span>/</span>
        <span className="text-slate-900 font-bold">{operator.name}</span>
      </div>

      {/* Header */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-50 text-purple-800 text-xs font-mono font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
          <span>CHARGE POINT OPERATOR · {operator.headquarters.toUpperCase()}</span>
        </div>
        
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          {operator.name}: Ladenetz, Ladeleistung &amp; Tarife
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {operator.description}
        </p>
      </div>

      {/* Operator Metrics Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Ladepunkte in DE</span>
          <span className="text-3xl font-black text-slate-950 font-mono mt-1 block">
            {operator.totalPointsDE.toLocaleString('de-DE')}
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">BNetzA registriert</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Spitzenleistung (HPC)</span>
          <span className="text-3xl font-black text-purple-600 font-mono mt-1 block">
            bis {operator.maxKw} kW
          </span>
          <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
            {operator.hpcShare} % HPC-Anteil
          </span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">Roaming-Punkte</span>
          <span className="text-2xl font-black text-slate-950 font-mono mt-1 block">
            {operator.roamingPartnersCount.toLocaleString('de-DE')}+
          </span>
          <span className="text-[11px] text-slate-500 mt-1 block">In ganz Europa</span>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-mono text-slate-500 uppercase block">App-Bewertung</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-3xl font-black text-slate-950 font-mono">{operator.appRating}</span>
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">App Store / Play Store</span>
        </div>
      </div>

      {/* Features & Technologie */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <h2 className="text-base font-mono uppercase tracking-wider text-slate-800 font-bold">
          Technologische Merkmale von {operator.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {operator.features.map((feat) => (
            <div key={feat} className="flex items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Flagship Stations Grid for this Operator */}
      {operatorStations.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Verifizierte Schnellladeparks von {operator.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Ausgewählte Flagship-Standorte aus dem amtlichen BNetzA-Register mit Ladeleistung und Ausstattung.
              </p>
            </div>
            <Link
              to={`/suche?q=${encodeURIComponent(operator.name)}`}
              className="text-xs font-bold text-purple-700 hover:text-purple-800 inline-flex items-center gap-1 shrink-0"
            >
              <span>Alle in der Suche filtern</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {operatorStations.map((st) => (
              <div
                key={st.id}
                onClick={() => setSelectedStation(st)}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-300 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-extrabold text-slate-950 group-hover:text-purple-700 transition-colors line-clamp-1">
                      {st.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-purple-50 text-purple-900 border border-purple-200 shrink-0">
                      {st.kwMax} kW HPC
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mb-2">
                    {st.street}, {st.plz} {st.city}
                  </p>
                  
                  {st.motorway && (
                    <div className="text-[11px] font-mono text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded inline-block mb-2">
                      Autobahn: {st.motorway.toUpperCase()}
                    </div>
                  )}

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
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

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                  <span>Standort-Details &amp; Stecker</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Operator FAQ Accordion / Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-700 font-bold">
          <HelpCircle className="w-4 h-4" />
          <span>Häufig gestellte Fragen (FAQ)</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-950">
          Wissenswertes zum Laden bei {operator.name}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="font-bold text-slate-950 text-sm sm:text-base flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-800 font-mono text-xs flex items-center justify-center shrink-0 mt-0.5">
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

      {/* Preishinweis */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 leading-relaxed">
        <strong>Hinweis zu Tarifen:</strong> Alle Preisangaben (AC/DC €/kWh) basieren auf öffentlich zugänglichen Standard-Preisblättern des Betreibers (Ad-hoc ohne Vertrag). Reale Preise können durch Ladekarten-Tarife, Roaming-Partner und dynamische Preismodelle deutlich abweichen. Bitte prüfe die aktuellen Preise direkt beim Betreiber oder in der jeweiligen Lade-App.
      </div>

      {/* Citation Box */}
      <CitationBox
        title={`CPO-Dossier: ${operator.name} Ladeinfrastruktur und technische Spezifikationen`}
        urlPath={`/betreiber/${operator.slug}`}
      />

      {/* EEAT Badge */}
      <EEATBadge topic={`Betreiber-Analyse ${operator.name}`} />

      {/* Modal for Station Detail */}
      <StationDetailModal
        station={selectedStation}
        onClose={() => setSelectedStation(null)}
      />

      <FloatingCTABar
        title={`Günstig bei ${operator.name} laden`}
        subtitle="Die passende Ladekarte im Direktvergleich"
        link="/ladekarten"
        linkLabel="Ladekarten vergleichen"
      />
    </div>
  );
};

export default OperatorPage;
