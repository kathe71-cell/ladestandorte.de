import React, { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ShieldCheck, Zap, CheckCircle2, ArrowRight, CreditCard, HelpCircle, MapPin, Database } from 'lucide-react';
import { OPERATORS_DATA } from '../data/operators';
import { STATIONS_DATA, StationData, getStationUrl } from '../data/stations';
import cpoDataset from '../data/generated/cpo-monitor.generated.json';
import { CitationBox } from '../components/CitationBox';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { StationDetailModal } from '../components/StationDetailModal';
import { PageHero } from '../components/PageHero';
import { OperatorStationDirectory } from '../components/OperatorStationDirectory';

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
  const verifiedCpo = cpoDataset.operators.find(c => 
    c.slug === operator.slug || 
    c.id === operator.slug ||
    (operator.slug === 'tesla-supercharger' && (c.id === 'tesla' || c.slug === 'tesla')) ||
    (operator.slug === 'enbw' && (c.id === 'enbw' || c.slug === 'enbw-mobility-plus'))
  );

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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#C7F000] text-[#171917] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#171917]"></span>
            <span>OPERATOR DATA · {operator.headquarters.toUpperCase()}</span>
          </div>
        }
        title={operator.name}
        description={operator.description}
      />

      {/* Operator Metrics KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Ladepunkte in DE</span>
          <span className="text-3xl font-black text-[#171917] font-mono mt-1 block tabular-nums">
            {operator.totalPointsDE.toLocaleString('de-DE')}
          </span>
          <span className="text-[11px] text-[#6C716B] mt-1 block font-medium">
            {verifiedCpo ? 'BNetzA-Registerbestand' : 'Betreiberangabe'}
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] border-t-4 border-t-[#C7F000] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Spitzenleistung (HPC)</span>
          <span className="text-3xl font-black text-[#171917] font-mono mt-1 block tabular-nums">
            bis {operator.maxKw} kW
          </span>
          <span className="text-[11px] text-[#2F5E73] font-mono font-semibold mt-1 block">
            {operator.hpcShare} % HPC-Anteil
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Roaming-Punkte</span>
          <span className="text-2xl sm:text-3xl font-black text-[#171917] font-mono mt-1 block tabular-nums">
            {operator.roamingPartnersCount.toLocaleString('de-DE')}+
          </span>
          <span className="text-[11px] text-[#6C716B] mt-1 block">In ganz Europa</span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Authentifizierung</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xl font-black text-[#171917] font-mono">
              {operator.plugAndCharge ? 'ISO 15118' : (operator.autocharge ? 'AutoCharge' : 'RFID / App')}
            </span>
          </div>
          <span className="text-[11px] text-[#6C716B] mt-1 block">
            {operator.plugAndCharge ? 'Plug & Charge aktiv' : (operator.autocharge ? 'AutoCharge unterstützt' : 'RFID- & App-Autorisierung')}
          </span>
        </div>
      </div>

      {/* Quellenkontext & Transparenz-Hinweis */}
      <div className="p-3.5 bg-white rounded-xl border border-[#DFE3DC] text-xs text-[#6C716B] flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#2F5E73] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-[#171917] font-semibold">Quellenkontext:</strong> Die Kennzahlen zum Ladenetz von {operator.name} basieren auf Betreiberangaben sowie amtlichen Registerdaten. Sie bilden statische Netzkapazitäten ab und stellen keine Echtzeit-Verfügbarkeitsdaten dar. Details in der <Link to="/methodik" className="text-[#2F5E73] hover:underline font-semibold">Methodik</Link>.
        </p>
      </div>

      {/* Verified CPO Register Data Card (from BNetzA Pipeline) */}
      {verifiedCpo && (
        <div className="p-6 bg-white rounded-xl border border-[#DFE3DC] shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DFE3DC] pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-[#171917] font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#2F5E73]"></span>
              <span>Amtlicher BNetzA-Registerauszug (Stand {cpoDataset.snapshotDate})</span>
            </span>
            <Link
              to="/cpo-monitor"
              className="text-xs font-bold text-[#2F5E73] hover:text-[#171917] underline inline-flex items-center gap-1"
            >
              <span>Im CPO Monitor ansehen</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-[#F7F7F2] rounded-lg border border-[#DFE3DC]">
              <span className="text-[#6C716B] block uppercase font-mono text-[10px]">Dokumentierte Ladestationen</span>
              <strong className="text-[#171917] text-base font-mono block mt-0.5 tabular-nums">{verifiedCpo.stationsTotal.toLocaleString('de-DE')}</strong>
            </div>
            <div className="p-3.5 bg-[#F7F7F2] rounded-lg border border-[#DFE3DC]">
              <span className="text-[#6C716B] block uppercase font-mono text-[10px]">Ladepunkte ≥150 kW</span>
              <strong className="text-[#171917] text-base font-mono block mt-0.5 tabular-nums">{verifiedCpo.chargingPoints150PlusKw.toLocaleString('de-DE')}</strong>
            </div>
            <div className="p-3.5 bg-[#F7F7F2] rounded-lg border border-[#DFE3DC]">
              <span className="text-[#6C716B] block uppercase font-mono text-[10px]">HPC-Quote im Bestand</span>
              <strong className="text-[#2F5E73] text-base font-mono block mt-0.5 tabular-nums">{verifiedCpo.share150PlusKwPercent.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %</strong>
            </div>
            <div className="p-3.5 bg-[#F7F7F2] rounded-lg border border-[#DFE3DC]">
              <span className="text-[#6C716B] block uppercase font-mono text-[10px]">Anteil an BNetzA-HPC *</span>
              <strong className="text-[#171917] text-base font-mono block mt-0.5 tabular-nums">{verifiedCpo.shareOfRegisterHpcPercent.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %</strong>
            </div>
          </div>
          <p className="text-[11px] text-[#6C716B] leading-normal">
            * <strong>Hinweis:</strong> Anteil an den im amtlichen BNetzA-Snapshot erfassten HPC-Ladepunkten bundesweit ({cpoDataset.totalRegisterHpcPointsDE.toLocaleString('de-DE')} Ladepunkte).
          </p>
        </div>
      )}

      {/* Features & Technologie */}
      <div className="bg-white rounded-xl p-6 border border-[#DFE3DC] space-y-4">
        <h2 className="text-xs font-mono uppercase tracking-wider text-[#6C716B] font-bold">
          Technologische Merkmale von {operator.name}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {operator.features.map((feat) => (
            <div key={feat} className="flex items-center gap-2.5 bg-[#F7F7F2] p-3 rounded-lg border border-[#DFE3DC] text-xs font-medium text-[#171917]">
              <CheckCircle2 className="w-4 h-4 text-[#2F5E73] shrink-0" />
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
              className="text-xs font-bold text-[#2F5E73] hover:text-[#171917] inline-flex items-center gap-1 shrink-0"
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
                className="p-5 bg-white rounded-xl border border-[#DFE3DC] hover:border-[#171917] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-extrabold text-[#171917] group-hover:text-[#2F5E73] transition-colors line-clamp-1">
                      {st.name}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC] shrink-0">
                      {st.kwMax} kW HPC
                    </span>
                  </div>
                  <p className="text-xs text-[#6C716B] mb-2">
                    {st.street}, {st.plz} {st.city}
                  </p>
                  
                  {st.motorway && (
                    <div className="text-[11px] font-mono text-[#171917] font-bold bg-[#F7F7F2] border border-[#DFE3DC] px-2 py-0.5 rounded inline-block mb-2">
                      Autobahn: {st.motorway.toUpperCase()}
                    </div>
                  )}

                  {st.exitDistance && (
                    <span className="text-[10px] font-mono text-[#6C716B] block w-full mt-1">
                      📍 {st.exitDistance}
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-[#DFE3DC] flex items-center justify-between text-xs font-bold text-[#171917] group-hover:text-[#2F5E73]">
                  <span>Standort ansehen</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Ebene B: Vollständiges BNetzA-Registerverzeichnis des Betreibers */}
      {verifiedCpo ? (
        <OperatorStationDirectory
          operatorSlug={operator.slug}
          operatorName={operator.name}
          totalRegisterCount={verifiedCpo.stationsTotal}
        />
      ) : (
        <div className="p-6 bg-white rounded-xl border border-[#DFE3DC] space-y-2">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#6C716B] uppercase">
            <Database className="w-3.5 h-3.5" />
            <span>Kein isolierter BNetzA-Registerbestand</span>
          </div>
          <p className="text-xs text-[#6C716B] leading-relaxed">
            Für diesen Anbieter ({operator.name}) liegt kein eigener, eindeutig abgrenzbarer BNetzA-CPO-Registerbestand vor (z. B. E-Mobility Provider, Roaming-Aggregator oder markenübergreifender Verbund). Die genannten Ladedaten spiegeln die partnerschaftliche Netzabdeckung wider.
          </p>
        </div>
      )}

      {/* Operator FAQ Accordion / Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#2F5E73] font-bold">
          <HelpCircle className="w-4 h-4" />
          <span>Häufig gestellte Fragen (FAQ)</span>
        </div>
        <h2 className="text-2xl font-bold text-[#171917]">
          Wissenswertes zum Laden bei {operator.name}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, i) => (
            <div key={i} className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs space-y-2">
              <h3 className="font-bold text-[#171917] text-sm sm:text-base flex items-start gap-2">
                <span className="w-5 h-5 rounded-md bg-[#F7F7F2] border border-[#DFE3DC] text-[#171917] font-mono text-xs flex items-center justify-center shrink-0 mt-0.5 font-bold">
                  {i + 1}
                </span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-xs sm:text-sm text-[#6C716B] leading-relaxed pl-7">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Preishinweis */}
      <div className="p-4 rounded-xl bg-white border border-[#DFE3DC] text-xs text-[#6C716B] leading-relaxed">
        <strong className="text-[#171917]">Hinweis zu Tarifen:</strong> Alle Preisangaben (AC/DC €/kWh) basieren auf öffentlich zugänglichen Standard-Preisblättern des Betreibers (Ad-hoc ohne Vertrag). Reale Preise können durch Ladekarten-Tarife, Roaming-Partner und dynamische Preismodelle deutlich abweichen. Bitte prüfe die aktuellen Preise direkt beim Betreiber oder in der jeweiligen Lade-App.
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
