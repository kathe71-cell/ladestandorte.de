import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ShieldCheck, Zap, CheckCircle2, ArrowRight, CreditCard, HelpCircle, MapPin } from 'lucide-react';
import { OPERATORS_DATA } from '../data/operators';
import { STATIONS_DATA, StationData, getStationUrl } from '../data/stations';
import cpoDataset from '../data/generated/cpo-monitor.generated.json';
import { CitationBox } from '../components/CitationBox';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { StationDetailModal } from '../components/StationDetailModal';
import { PageHero } from '../components/PageHero';

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

  // Lookup verified BNetzA CPO entry
  const verifiedCpo = cpoDataset.operators.find(c => c.slug === operator.slug || c.id === operator.slug);

  // Match stations strictly by operator slug
  const operatorStations = STATIONS_DATA.filter(s => 
    s.operatorSlug === operator.slug ||
    (operator.slug === 'enbw' && s.operatorSlug === 'enbw-mobility-plus')
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
      
      <PageHero
        level={3}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Betreiber', href: '/betreiber' },
          { label: operator.name, isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-purple-50 text-purple-800 text-xs font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
            <span>CHARGE POINT OPERATOR · {operator.headquarters.toUpperCase()}</span>
          </div>
        }
        title={`${operator.name}: Ladenetz, Ladeleistung & Tarife`}
        description={operator.description}
      />

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
          <span className="text-xs font-mono text-slate-500 uppercase block">Authentifizierung</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xl font-black text-slate-950 font-mono">
              {operator.plugAndCharge ? 'ISO 15118' : (operator.autocharge ? 'AutoCharge' : 'RFID / App')}
            </span>
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {operator.plugAndCharge ? 'Plug & Charge aktiv' : (operator.autocharge ? 'AutoCharge unterstützt' : 'RFID- & App-Autorisierung')}
          </span>
        </div>
      </div>

      {/* Quellenkontext & Transparenz-Hinweis */}
      <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-slate-900 font-semibold">Quellenkontext:</strong> Die Kennzahlen zum Ladenetz von {operator.name} basieren auf Betreiberangaben sowie amtlichen Registerdaten. Sie bilden statische Netzkapazitäten ab und stellen keine Echtzeit-Verfügbarkeitsdaten dar. Details in der <Link to="/methodik" className="text-purple-800 hover:text-purple-950 font-semibold underline">Methodik</Link>.
        </p>
      </div>

      {/* Verified CPO Register Data Card (from BNetzA Pipeline) */}
      {verifiedCpo && (
        <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-200/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-900 font-bold flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-purple-700" />
              <span>Amtlicher BNetzA-Registerauszug (Stand {cpoDataset.snapshotDate})</span>
            </span>
            <Link
              to="/cpo-monitor"
              className="text-xs font-bold text-purple-800 hover:text-purple-950 underline inline-flex items-center gap-1"
            >
              <span>Im CPO Monitor ansehen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-purple-100">
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Dokumentierte Ladestationen</span>
              <strong className="text-slate-950 text-base font-mono block mt-0.5">{verifiedCpo.stationsTotal.toLocaleString('de-DE')}</strong>
            </div>
            <div className="p-3 bg-white rounded-xl border border-purple-100">
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Ladepunkte ≥150 kW</span>
              <strong className="text-purple-900 text-base font-mono block mt-0.5">{verifiedCpo.chargingPoints150PlusKw.toLocaleString('de-DE')}</strong>
            </div>
            <div className="p-3 bg-white rounded-xl border border-purple-100">
              <span className="text-slate-500 block uppercase font-mono text-[10px]">HPC-Quote im Bestand</span>
              <strong className="text-slate-950 text-base font-mono block mt-0.5">{verifiedCpo.share150PlusKwPercent.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %</strong>
            </div>
            <div className="p-3 bg-white rounded-xl border border-purple-100">
              <span className="text-slate-500 block uppercase font-mono text-[10px]">Anteil an BNetzA-HPC *</span>
              <strong className="text-slate-950 text-base font-mono block mt-0.5">{verifiedCpo.shareOfRegisterHpcPercent.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %</strong>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            * <strong>Hinweis:</strong> Anteil an den im amtlichen BNetzA-Snapshot erfassten HPC-Ladepunkten bundesweit ({cpoDataset.totalRegisterHpcPointsDE.toLocaleString('de-DE')} Ladepunkte).
          </p>
        </div>
      )}

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

      {/* Verifizierte Schnellladeparks des Betreibers */}
      {operatorStations.length > 0 && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                Verifizierte Schnellladeparks von {operator.name}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Verifizierte Standorte aus dem BNetzA-Register mit Ladeleistung und Ausstattung.
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
              <Link
                key={st.id}
                to={getStationUrl(st)}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-purple-300 transition-all flex flex-col justify-between group"
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

                  {st.exitDistance && (
                    <span className="text-[10px] font-mono text-slate-600 block w-full mt-1">
                      📍 {st.exitDistance}
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                  <span>Standort ansehen</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
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
