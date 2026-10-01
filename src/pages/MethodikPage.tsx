import React from 'react';
import { Database, ShieldCheck, FileText, CheckCircle2, Calculator, Truck, Layers, Info, BookOpen, Quote } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { SEO } from '../components/SEO';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { getDossierCount } from '../data/stations';

export const MethodikPage: React.FC = () => {
  const dossierCount = getDossierCount();

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
            "name": "Methodik",
            "item": "https://www.ladestandorte.de/methodik"
          }
        ]
      },
      {
        "@type": "WebPage",
        "@id": "https://www.ladestandorte.de/methodik#webpage",
        "url": "https://www.ladestandorte.de/methodik",
        "name": "Datenquellen & Methodik · ladestandorte.de",
        "description": "Dokumentation der Datenquellen, Kriterien für Standortdossiers, Klassifikation von Quelldaten und abgeleiteten Kennzahlen sowie Berechnungsmodelle."
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Datenquellen & Methodik · Transparenzportal ladestandorte.de"
        description="Dokumentation der Datenquellen, Kriterien für Standortdossiers, Klassifikation von Quelldaten und abgeleiteten Kennzahlen sowie Berechnungsmodelle."
        canonicalPath="/methodik"
        schema={schema}
      />

      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Methodik', isCurrent: true }
        ]}
        eyebrow={
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
            <BookOpen className="w-4 h-4" />
            <span>Referenz &amp; Transparenz</span>
          </div>
        }
        title="Daten &amp; Methodik"
        description="Wie ladestandorte.de Daten erhebt, einordnet und berechnet – Leitlinien für Transparenz und wissenschaftliche Zitierfähigkeit."
      />

      {/* Intro Overview Box */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-950">
          Grundsatz der Datenarchitektur
        </h2>
        <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-4xl">
          ladestandorte.de ist ein unabhängiges Informations- und Datenportal zur öffentlichen Ladeinfrastruktur in Deutschland. Um Fehlinterpretationen und falsche Generalisierungen auszuschließen, trennt die Plattform strikt zwischen <strong>amtlichen Gesamtregisterdaten</strong>, <strong>redaktionell kuratierten Standortdossiers</strong> und <strong>mathematischen Modellberechnungen</strong>.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-mono text-emerald-800 uppercase font-bold block mb-1">1. Registerdaten</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Makrozahlen (z. B. Ladepunkte in Großstädten) beruhen auf Open-Data-Veröffentlichungen der Bundesnetzagentur (BNetzA).
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-mono text-emerald-800 uppercase font-bold block mb-1">2. Kuratierte Dossiers</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Eigenständige Standortdatenblätter ({dossierCount} Dossiers) mit geprüften Geokoordinaten und technischer Ausstattung.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            <span className="text-xs font-mono text-emerald-800 uppercase font-bold block mb-1">3. Berechnete Modelle</span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ladezeit- und Kostenberechnungen basieren auf offengelegten Formeln und transparenten Modellannahmen.
            </p>
          </div>
        </div>
      </div>

      {/* Abschnitt A: Datenquellen */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-600" />
          <h2 className="text-2xl font-black text-slate-950">
            Abschnitt A: Datenquellen &amp; Primärregister
          </h2>
        </div>
        <p className="text-sm text-slate-600 max-w-3xl">
          Alle veröffentlichten Daten werden auf belegbare Primärquellen zurückgeführt. Es werden keine Schätzwerte als behördliche Fakten ausgewiesen.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-950 text-base">Bundesnetzagentur (BNetzA)</span>
              <span className="text-xs font-mono bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">Amtliches Register</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Öffentliches Ladesäulenregister gemäß § 5 Ladesäulenverordnung (LSV), bereitgestellt als Open Data unter Creative Commons (CC BY 4.0). Dient als Referenz für bundesweite Registerstatistiken, Betreiberanteile und kommunale Ladeinfrastrukturzahlen.
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
              Verwendung: Makrodaten Städteseiten, Basis-Registerangaben
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-950 text-base">Offizielle Betreiberinformationen (CPOs)</span>
              <span className="text-xs font-mono bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">Primärquellen</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Verifizierte Pressemitteilungen, technische Datenblätter und offizielle Inbetriebnahmemeldungen der Ladeinfrastrukturbetreiber (z. B. EnBW mobility+, Aral pulse, IONITY, Milence).
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
              Verwendung: Anschlussleistung (kW), Steckerbelegung, CPO-Spezifikationen
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-950 text-base">Wissenschaftliche Förderprojekte des Bundes</span>
              <span className="text-xs font-mono bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full font-bold">Forschung</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Projektberichte und offizielle Veröffentlichungen öffentlich begleiteter Initiativen (z. B. BMDV-Projekt <em>HoLa – Hochleistungsladen im Lkw-Fernverkehr</em>, wissenschaftlich begleitet durch Fraunhofer ISI und TU Dortmund).
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
              Verwendung: MCS-Pilotstandorte, Schwerlast-Ladeinfrastruktur
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-950 text-base">Normungs- &amp; Branchenorganisationen</span>
              <span className="text-xs font-mono bg-slate-100 text-slate-900 border border-slate-200 px-2.5 py-0.5 rounded-full font-bold">Standards</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Internationale Standardisierungsgremien und Verbände (z. B. CharIN e.V. für Spezifikationen des Megawatt Charging Systems, ISO 15118 für Plug &amp; Charge, EU-Verordnung AFIR für Ad-hoc-Bezahlstandards).
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-100">
              Verwendung: Begriffsdefinitionen, Steckertypen, AFIR-Anforderungen
            </div>
          </div>
        </div>
      </section>

      {/* Abschnitt B: Standortdossiers */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-emerald-600" />
          <h2 className="text-2xl font-black text-slate-950">
            Abschnitt B: Definition eines Standortdossiers
          </h2>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            Ein <strong>Standortdossier</strong> auf ladestandorte.de ist ein eigenständiges, kuratiertes Standortdatenblatt für einen öffentlich zugänglichen Schnellladepark. Jedes Dossier verfügt über eine kanonische URL unter <code>/ladestation/[ort]/[slug]</code>.
          </p>

          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <strong className="block font-bold">Wesentliche Abgrenzung (Denominator):</strong>
            <p className="leading-relaxed">
              Die Standortdossiers stellen eine <strong>redaktionell kuratierte Auswahl von aktuell {dossierCount} Standorten</strong> dar (insbesondere Fernverkehrs- und Leuchtturm-Ladeparks). Sie bilden <strong>keine Vollerhebung</strong> aller über 100.000 öffentlich registrierten Ladepunkte in Deutschland ab. Auf Autobahnseiten genannte Dossierzahlen beziehen sich ausschließlich auf die in dieser Auswahl dokumentierten Standorte.
            </p>
          </div>

          <h3 className="text-base font-bold text-slate-950 pt-2">
            Technische Aufnahmekriterien (<code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">isIndexableLocation</code>)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ein Standort wird nur dann als eigenständiges, indexierbares Dossier geführt, wenn alle folgenden Kriterien im Datenbestand erfüllt sind:
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
            <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Vollständige Geodaten (Straße, PLZ, Ort, Koordinaten lat/lng &ne; 0)</span>
            </li>
            <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Mindestens 50 kW Spitzenleistung (HPC- und Schnellladefokus)</span>
            </li>
            <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Spezifizierte Anschlüsse und Steckertypen (z. B. CCS, CHAdeMO)</span>
            </li>
            <li className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Eindeutig identifizierbarer Betreiber (CPO mit Profilverknüpfung)</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Abschnitt C: Quelldaten vs. Abgeleitete Kennzahlen */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-emerald-600" />
          <h2 className="text-2xl font-black text-slate-950">
            Abschnitt C: Quelldaten vs. Abgeleitete Kennzahlen
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <span>Quelldaten (Source Facts)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Angaben, die unmittelbar aus einer dokumentierten Primärquelle stammen:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li>• Standortadresse, Postleitzahl und Ort</li>
              <li>• Geografische Koordinaten (Breiten- und Längengrad)</li>
              <li>• Maximale Ladeleistung laut Betreiber oder Typenschild (kW)</li>
              <li>• Anschlusstypen und Steckerstandards</li>
              <li>• Betreibergesellschaft (CPO)</li>
            </ul>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-950 text-base flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Abgeleitete Kennzahlen (Derived Facts)</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Von ladestandorte.de reproduzierbar aus Quelldaten berechnete Werte:
            </p>
            <ul className="space-y-1.5 text-xs text-slate-700">
              <li>• <strong>HPC-Quote</strong>: Anteil der Schnellladepunkte (&ge; 150 kW) am Gesamtbestand einer Stadt</li>
              <li>• <strong>Dossier-Zähler</strong>: Dynamische Summierung kuratierter Standorte je Autobahn</li>
              <li>• <strong>Geodistanz</strong>: Berechnung der Luftlinie zu Nachbarstationen via Haversine-Formel (R = 6.371 km)</li>
              <li>• <strong>Autobahnkorridor-Zuordnung</strong>: Trassenseitige Verknüpfung von Rastanlagen</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Abschnitt D: MCS-Methodik */}
      <section id="mcs" className="space-y-6 scroll-mt-24">
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-emerald-600" />
          <h2 className="text-2xl font-black text-slate-950">
            Abschnitt D: MCS- &amp; E-Lkw-Methodik
          </h2>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            Das Verzeichnis für das Megawatt Charging System (MCS) erfasst Standorte, die für das Laden schwerer Nutzfahrzeuge ausgerüstet oder vorbereitet sind.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 text-xs uppercase font-mono block">Status: In Betrieb (Operational)</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Der Standort ist offiziell eröffnet und speist realen Ladestrom in Nutzfahrzeuge ein (entweder über Megawatt-Kupplung oder Hochleistungs-CCS mit Lkw-Durchfahrtsbuchten).
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
              <span className="font-bold text-slate-900 text-xs uppercase font-mono block">Status: Im Bau / Geplant (Planned)</span>
              <p className="text-xs text-slate-600 leading-relaxed">
                Konkrete Ankündigung durch Betreiber oder Förderprojekt mit dokumentiertem Standort, Ladeleistung und Ausbauziel. Keine spekulativen Projekte ohne belastbare Quelle.
              </p>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed pt-2 border-t border-slate-100 space-y-1">
            <p>
              <strong>Hinweis zum Datenbestand:</strong> Aktuell dokumentiert ladestandorte.de 8 Standorte mit E-Lkw-Infrastruktur. Dies stellt die der Redaktion bekannten Pilot- und Förderstandorte dar und keine behördliche Vollerhebung (die Bundesnetzagentur differenziert MCS-Stecker im Register derzeit noch nicht gesondert).
            </p>
            <p>
              <strong>Redaktionelles Prüfdatum:</strong> <code>lastVerifiedAt</code> bezeichnet das Datum der letzten dokumentierten redaktionellen Quellenprüfung durch ladestandorte.de.
            </p>
          </div>
        </div>
      </section>

      {/* Abschnitt E: Laderechner-Methodik */}
      <section id="laderechner" className="space-y-6 scroll-mt-24">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600" />
          <h2 className="text-2xl font-black text-slate-950">
            Abschnitt E: Berechnungsmodell des Laderechners
          </h2>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <p className="text-sm text-slate-700 leading-relaxed">
            Der Ladezeit- und Kostenrechner auf ladestandorte.de stellt eine deterministische Modellrechnung dar. Er unterscheidet strikt zwischen zwei Modi:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-950 text-sm">1. Theoretischer Modus</span>
                <span className="text-[11px] font-mono bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold">Idealwert</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Berechnet die Ladedauer unter der Annahme konstant anliegender Nennleistung ohne Berücksichtigung von Ladekurvenabfall oder Wandlungsverlusten:
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-800 space-y-1">
                <div>Nettoenergie = Kapazität &times; (Ziel-SoC &minus; Start-SoC) / 100</div>
                <div>Ladedauer [h] = Nettoenergie / Ladeleistung</div>
                <div>Kosten = Nettoenergie &times; Strompreis</div>
              </div>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-950 text-sm">2. Praxis-Schätzung</span>
                <span className="text-[11px] font-mono bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold">Standard</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Modelliert den realen Ladevorgang über vereinfachte, transparente Modellannahmen:
              </p>
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-mono text-slate-800 space-y-1">
                <div>Verluste: 6 % bei DC (&gt;22 kW), 12 % bei AC (&le;22 kW)</div>
                <div>Effektive Leistung = Peak &times; Ladekurvenfaktor</div>
                <div>Ladekurvenfaktor: 0,76 (Standard) bzw. 0,82 (800V-Profil)</div>
                <div>Bruttoenergie = Nettoenergie &times; (1 + Verlust)</div>
                <div>Ladedauer [h] = Bruttoenergie / Effektive Leistung</div>
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-amber-50/70 border border-amber-300 rounded-xl text-xs text-amber-950 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p>
              <strong>Rechtlicher Hinweis:</strong> Die Ergebnisse sind beispielhafte Modellrechnungen. Die tatsächliche Ladedauer und Kosten hängen vom individuellen Fahrzeug, der Akkukonditionierung, der Außentemperatur und den Tarifbedingungen des Betreibers ab.
            </p>
          </div>
        </div>
      </section>

      {/* Abschnitt F: Zitierhinweise */}
      <section className="space-y-6">
        <div className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-emerald-600" />
          <h2 className="text-2xl font-black text-slate-950">
            Abschnitt F: Ressourcenbezogene Zitierweise
          </h2>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <p className="text-sm text-slate-700 leading-relaxed">
            Wenn Sie Daten oder Kennzahlen von ladestandorte.de in wissenschaftlichen Publikationen, journalistischen Beiträgen oder Branchenanalysen zitieren, nutzen Sie bitte ressourcenbezogene Zitate:
          </p>

          <div className="space-y-3">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
              <strong className="block text-slate-950 font-mono">Beispiel A: MCS-Standortverzeichnis</strong>
              <blockquote className="italic font-serif text-slate-700">
                „ladestandorte.de: MCS- und E-Lkw-Ladestationen in Deutschland. Online verfügbar unter: https://www.ladestandorte.de/mcs/ladestationen [Abgerufen am: TT.MM.JJJJ].“
              </blockquote>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1">
              <strong className="block text-slate-950 font-mono">Beispiel B: Autobahnkorridor</strong>
              <blockquote className="italic font-serif text-slate-700">
                „ladestandorte.de: Schnellladen und Ladeparks an der Autobahn A3. Online verfügbar unter: https://www.ladestandorte.de/autobahnen/a3 [Abgerufen am: TT.MM.JJJJ].“
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Citation Box & EEAT */}
      <CitationBox
        title="Datenquellen & Methodik zur öffentlichen Ladeinfrastruktur"
        urlPath="/methodik"
      />

      <EEATBadge
        topic="Methodik &amp; Datenherkunft"
        source1Title="Register &amp; Primärquellen"
        source1Text="Ladesäulenregister der Bundesnetzagentur (CC BY 4.0), Betreiberangaben führender CPOs und Förderprojekte (HoLa)."
        source2Title="Redaktionelle Methodik"
        source2Text="Transparente Kriterien für Standortdossiers, deterministische Rechnermodelle und quellengenau belegte MCS-Daten."
        dateText="Stand: Referenzmethodik 2026"
      />

      <FloatingCTABar
        title="Ladekosten transparent berechnen"
        subtitle="Testen Sie unseren Modellrechner für AC- und HPC-Ladevorgänge"
        link="/rechner"
        linkLabel="Zum Laderechner"
      />
    </div>
  );
};

export default MethodikPage;
