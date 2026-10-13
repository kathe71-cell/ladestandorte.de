import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Clock, Calendar, ShieldCheck, Zap, BookOpen, AlertTriangle, 
  CheckCircle2, Check, HelpCircle, Info, ChevronDown, ExternalLink, Shield, Layers, 
  Wrench, BatteryCharging 
} from 'lucide-react';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { PageHero } from '../components/PageHero';
import { CHARGING_CARDS } from '../data/cards';

const getArticleSchema = (headline: string, description: string, slug: string, faqs?: { q: string; a: string }[]) => ({
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
          "name": "Ratgeber",
          "item": "https://www.ladestandorte.de/ratgeber"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": headline,
          "item": `https://www.ladestandorte.de/ratgeber/${slug}`
        }
      ]
    },
    {
      "@type": "Article",
      "headline": headline,
      "description": description,
      "mainEntityOfPage": `https://www.ladestandorte.de/ratgeber/${slug}`,
      "inLanguage": "de-DE",
      "publisher": {
        "@type": "Organization",
        "name": "ladestandorte.de",
        "url": "https://www.ladestandorte.de/"
      }
    },
    ...(faqs && faqs.length > 0 ? [{
      "@type": "FAQPage",
      "mainEntity": faqs.map(f => ({
        "@type": "Question",
        "name": f.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": f.a
        }
      }))
    }] : [])
  ]
});

export const RatgeberArticlePage: React.FC = () => {
  const { articleSlug } = useParams<{ articleSlug: string }>();

  if (articleSlug === 'ladekarten-dschungel') {
    const ladekartenFaqs = [
      {
        q: "Welche Ladekarte lohnt sich für Wenignutzer und Heimlader?",
        a: "Für Fahrer, die primär an der eigenen Wallbox laden und öffentliche Säulen nur gelegentlich nutzen, empfehlen sich Tarife ohne monatliche Grundgebühr (z.B. MAINGAU Autostrom oder DKV Card), um feste Fixkosten zu vermeiden."
      },
      {
        q: "Was ist der Unterschied zwischen CPO und EMP beim Laden?",
        a: "Der CPO (Charge Point Operator, z.B. IONITY, Fastned, Aral pulse) betreibt die physische Ladesäule. Der EMP (E-Mobility Provider, z.B. EnBW mobility+, ADAC, Maingau) gibt die Ladekarte/App an den Endkunden aus und rechnet den Ladevorgang ab."
      },
      {
        q: "Muss man heute noch zwingend eine Ladekarte besitzen?",
        a: "Nein. Gemäß Art. 5 Abs. 1 der EU-Verordnung AFIR müssen alle seit dem 13. April 2024 neu in Betrieb genommenen öffentlich zugänglichen Schnellladepunkte ab 50 kW kontaktlose Kartenzahlung mit Debit- oder Kreditkarte direkt an der Station akzeptieren (ein QR-Code allein reicht hier nicht aus). Zudem gilt für bestehende Ladepunkte am TEN-V-Netz eine Nachrüstpflicht zum 1. Januar 2027. Eine Ladekarte oder App bietet im Vergleich zum Ad-hoc-Direktbezug jedoch häufig günstigere Kilowattstundenpreise."
      }
    ];

    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        <SEO
          title={`${CHARGING_CARDS.length} Ladekarten im Vergleich: Roaming, Tarife & wer wirklich spart`}
          description={`Welche Ladekarte lohnt sich 2026? ${CHARGING_CARDS.length} Tarife im Faktencheck: ADAC, EnBW, Tesla, Maingau & Co. – Roaming-Netze, Grundgebühren, AC/DC-Preise & Sparstrategie.`}
          canonicalPath="/ratgeber/ladekarten-dschungel"
          schema={getArticleSchema(
            "Ladekarten-Dschungel: Roaming-Preise, monatliche Grundgebühren & wer wirklich spart",
            "Welche Ladekarte lohnt sich für welches Fahrprofil? Detaillierte Analyse zu CPO-Roaming, Grundgebühren-Modellen und den günstigsten Kombinationen.",
            "ladekarten-dschungel",
            ladekartenFaqs
          )}
        />
        <PageHero
          level={3}
          breadcrumbs={[
            { label: 'Startseite', href: '/' },
            { label: 'Ratgeber', href: '/ratgeber' },
            { label: 'Ladekarten-Dschungel', isCurrent: true }
          ]}
          eyebrow="GUIDE · MARKTANALYSE"
          title="Ladekarten-Dschungel: Roaming-Preise, monatliche Grundgebühren & wer wirklich spart"
          description="Mit der rasanten Expansion von Schnellladeparks ist auch der Tarif- und Roaming-Markt komplexer geworden. Dieser Leitfaden entschlüsselt das Zusammenspiel von CPOs, EMPs und zeigt auf, welche Tarifkombination für Ihr individuelles Fahrprofil die günstigste ist."
        />

        <div className="prose prose-slate max-w-none text-[#171917] text-base sm:text-lg leading-relaxed space-y-6">
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">1. Die Trennung von CPO und EMP verstehen</h2>
          <p>
            Um günstige Ladekosten zu erzielen, ist das Verständnis der Rollenteilung im Elektromobilitätsmarkt elementar:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li><strong>CPO (Charge Point Operator):</strong> Betreibt die physische Ladesäule (z. B. Ionity, Aral pulse, Fastned). Er legt die Großhandelspreise fest.</li>
            <li><strong>EMP (E-Mobility Provider):</strong> Gibt die Ladekarte oder App an den Endverbraucher aus (z. B. EnBW mobility+, DKV, Maingau) und berechnet den Kundentarif.</li>
          </ul>
          <p>
            Wenn Sie mit der Ladekarte von Anbieter A an einer Säule von Anbieter B laden, spricht man von <em>Roaming</em>. Hierfür verlangen viele EMPs erhebliche Aufschläge von 10 bis 30 Cent pro Kilowattstunde gegenüber dem Laden an eigenen Säulen.
          </p>

          <div className="p-5 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] text-sm text-[#171917] my-6">
            <strong className="block font-bold mb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#2F5E73]" />
              Achtung vor intransparenten Roaming-Preisen
            </strong>
            Prüfen Sie vor jedem Ladevorgang in der App Ihres Ladekartenanbieters den tagesaktuellen Tarif für den ausgewählten Standort. An manchen Roaming-Stationen können Kilowattstundenpreise bis zu 0,89 €/kWh betragen, wenn keine Preisdeckelung vereinbart ist.
          </div>

          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">2. Die 3 Fahrerprofile: Welcher Tarif passt zu Ihnen?</h2>
          
          <div className="space-y-4 not-prose my-6">
            <div className="p-5 bg-white rounded-2xl border border-[#DFE3DC]">
              <h3 className="text-lg font-bold text-[#171917]">Profil A: Der Heimlader (Gelegenheitsnutzer öffentlich)</h3>
              <p className="text-sm text-[#6C716B] mt-1">
                Lädt zu 90 % an der eigenen Wallbox für ca. 0,30–0,33 €/kWh. Öffentliche Ladesäulen werden nur 1- bis 2-mal monatlich auf Ausflügen genutzt.
              </p>
              <div className="mt-3 text-xs font-mono font-bold text-[#2F5E73]">
                Empfehlung: MAINGAU Autostrom oder DKV Card (0,00 € Grundgebühr, kein Kostenrisiko).
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#DFE3DC]">
              <h3 className="text-lg font-bold text-[#171917]">Profil B: Der Laternenparker (Keine eigene Wallbox)</h3>
              <p className="text-sm text-[#6C716B] mt-1">
                Ist auf innerstädtische AC-Säulen und gelegentliche Schnelllader beim Wocheneinkauf angewiesen (Monatsbedarf: ca. 150–250 kWh).
              </p>
              <div className="mt-3 text-xs font-mono font-bold text-[#2F5E73]">
                Empfehlung: Lokale Stadtwerke-Ladekarte für AC kombiniert mit EnBW mobility+ Tarif M für DC.
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#DFE3DC]">
              <h3 className="text-lg font-bold text-[#171917]">Profil C: Der Langstrecken-Pendler &amp; Vielfahrer</h3>
              <p className="text-sm text-[#6C716B] mt-1">
                Fährt über 25.000 km pro Jahr und lädt wöchentlich mehrfach an Autobahn-HPC-Stationen.
              </p>
              <div className="mt-3 text-xs font-mono font-bold text-[#2F5E73]">
                Empfehlung: IONITY Passport Power (11,99 €/Mo.) oder EnBW mobility+ Tarif L mit rabattierten kWh-Preisen ab 0,39 €/kWh. Die monatliche Grundgebühr amortisiert sich bereits ab der zweiten Ladung.
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">3. Der Einfluss der AFIR-Verordnung (EU 2023/1804)</h2>
          <p>
            Gemäß Art. 5 Abs. 1 der europäischen AFIR-Verordnung müssen alle seit dem 13. April 2024 neu in Betrieb genommenen öffentlich zugänglichen Schnellladepunkte ab 50 kW verpflichtend mit kontaktlosen Kartenterminals (NFC für Debit- und Kreditkarten) direkt an der Station ausgestattet sein. Ein QR-Code allein erfüllt an diesen neuen Schnellladepunkten nicht die vorgeschriebenen Zahlungsanforderungen – zusätzliche QR-basierte Bezahloptionen sind dadurch jedoch nicht verboten. Für bestehende Schnellladepunkte entlang des transeuropäischen Verkehrsnetzes (TEN-V) greift eine gesetzliche Nachrüstpflicht zum 1. Januar 2027. An Ladepunkten unter 50 kW sowie an sonstigen Altanlagen kann die Ad-hoc-Zahlung weiterhin über QR-Codes abgewickelt werden. Zu beachten ist, dass spontane Ad-hoc-Preise in der Regel über den konditionierten Tarifen vertragsgebundener Ladekarten liegen.
          </p>
        </div>

        {/* Direktlink zum interaktiven Ladekarten-Vergleich */}
        <div className="p-6 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-8">
          <div>
            <h3 className="font-bold text-[#171917] text-base">Tarifrechner &amp; Ladekarten-Vergleich 2026</h3>
            <p className="text-sm text-[#6C716B] mt-1">Vergleichen Sie {CHARGING_CARDS.length} aktuelle Ladekarten und berechnen Sie Ihre monatlichen Ladekosten für Ihr Fahrprofil.</p>
          </div>
          <Link
            to="/ladekarten"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#171917] hover:bg-[#2F5E73] text-[#C7F000] font-bold text-xs shrink-0 transition-colors"
          >
            <span>Zum Ladekarten-Vergleich</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <CitationBox
          title="Ladekarten-Dschungel: Roaming-Preise, monatliche Grundgebühren & wer wirklich spart"
          urlPath="/ratgeber/ladekarten-dschungel"
        />

        <EEATBadge
          topic="Ladekarten-Analyse &amp; Tarifstrukturen"
          source1Title="Tarifblätter der Betreiber (EMP)"
          source1Text="Erhebung anhand der aktuellen Preis- und Konditionsblätter der Betreiber (EnBW, Ionity, EWE Go u. a.)."
          source2Title="Redaktionelle Einordnung"
          source2Text="Unabhängige Wirtschaftlichkeitsanalyse für Laternenparker und Vielfahrer ohne Affiliate-Bevorzugung."
          dateText="Stand: September 2026"
        />

        <FloatingCTABar
          title={`${CHARGING_CARDS.length} Ladekarten im Direktvergleich`}
          subtitle="Monatliche Kosten nach Fahrprofil berechnen"
          link="/ladekarten"
          linkLabel="Tarife vergleichen"
        />
      </article>
    );
  }

  if (articleSlug === 'ac-vs-dc-ladeverluste') {
    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        <SEO
          title="AC vs. DC Ladeverluste: Wirkungsgrade im Vergleich"
          description="Warum gehen beim Laden an Schuko bis zu 20 % verloren? Wirkungsgrade von Onboard-Ladern, DC-HPC-Effizienz & Praxistipps verständlich erklärt."
          canonicalPath="/ratgeber/ac-vs-dc-ladeverluste"
          schema={getArticleSchema(
            "AC vs. DC Ladeverluste im Praxis-Vergleich: Technische Wirkungsgrade & Sparpotenziale",
            "Warum gehen beim Laden an der Steckdose bis zu 20 % der Energie verloren? Wie arbeitet der Onboard-Gleichrichter und warum ist DC-HPC-Laden effizienter?",
            "ac-vs-dc-ladeverluste"
          )}
        />
        <PageHero
          level={3}
          breadcrumbs={[
            { label: 'Startseite', href: '/' },
            { label: 'Ratgeber', href: '/ratgeber' },
            { label: 'AC vs. DC Ladeverluste', isCurrent: true }
          ]}
          eyebrow="GUIDE · ELEKTROTECHNIK"
          title="AC vs. DC Ladeverluste im Praxis-Vergleich: Technische Wirkungsgrade & Sparpotenziale"
          description="Nicht jede Kilowattstunde, die der Stromzähler misst, kommt auch in den Batteriezellen an. In diesem Leitfaden analysieren wir die physikalischen Ursachen von Ladeverlusten beim AC- und DC-Laden anhand von ADAC-Messungen und Laborwerten."
        />

        <div className="prose prose-slate max-w-none text-[#171917] text-base sm:text-lg leading-relaxed space-y-6">
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">1. Physikalische Ursachen: Wo bleibt der Strom?</h2>
          <p>
            Beim Laden eines Elektrofahrzeugs treten Verluste an verschiedenen Stellen der Kette auf:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li><strong>Leitungswiderstände (Joulesche Wärme):</strong> Jeder stromdurchflossene Leiter besitzt einen Ohmschen Widerstand \( R \). Die Verlustleistung \( P_v = I^2 \cdot R \) steigt quadratisch mit der Stromstärke.</li>
            <li><strong>AC/DC-Gleichrichtung im Fahrzeug (Onboard-Charger):</strong> Beim Wechselstromladen (AC) muss der Strom im Fahrzeug durch Siliziumkarbid- (SiC) oder Galliumnitrid-Halbleiter in Gleichstrom (DC) gewandelt werden. Der Wirkungsgrad moderner Onboard-Charger liegt bei ca. 88 % bis 93 %.</li>
            <li><strong>Bordnetz-Grundverbrauch während des Ladens:</strong> Während des Ladevorgangs sind Steuergeräte, Batteriemanagement (BMS) und Kühlwasserpumpen aktiv. Dieser Standby-Verbrauch von 200 bis 400 Watt fällt bei langsamen Ladevorgängen (z.B. an der Schuko-Steckdose mit 2,3 kW) zeitlich extrem stark ins Gewicht.</li>
          </ul>

          <div className="p-5 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] not-prose my-6">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#6C716B] font-bold mb-3">
              Typische Verlustquoten nach Ladeart (Messwerte)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-white rounded-xl border border-[#DFE3DC]">
                <span className="text-xs text-[#6C716B] font-mono block">SCHUKO (2,3 kW)</span>
                <span className="text-2xl font-black text-[#171917] font-mono">15 % – 22 %</span>
                <span className="text-[11px] text-[#6C716B] block mt-1">Sehr ineffizient durch lange Laufzeit</span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-[#DFE3DC]">
                <span className="text-xs text-[#6C716B] font-mono block">WALLBOX (11 kW)</span>
                <span className="text-2xl font-black text-[#2F5E73] font-mono">6 % – 10 %</span>
                <span className="text-[11px] text-[#6C716B] block mt-1">Optimaler Bereich für Heimlader</span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-[#DFE3DC]">
                <span className="text-xs text-[#6C716B] font-mono block">HPC DC (150–300 kW)</span>
                <span className="text-2xl font-black text-[#171917] font-mono">4 % – 8 %</span>
                <span className="text-[11px] text-[#6C716B] block mt-1">Wandlung erfolgt in der Säule</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">2. Warum 11 kW an der Wallbox das Optimum darstellt</h2>
          <p>
            Viele Besitzer fragen sich, ob sich die Anschaffung einer 22-kW-Wallbox lohnt. Aus Effizienzgründen ist für über 90 % der Fahrzeuge eine 11-kW-Wallbox die beste Wahl:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>Fast alle gängigen Elektroautos (u. a. VW ID-Familie, Tesla Model 3/Y, Hyundai/Kia, BMW i4) besitzen ab Werk einen 11-kW-Onboard-Charger. An einer 22-kW-Säule laden sie dennoch mit maximal 11 kW.</li>
            <li>Bei 11 kW Ladeleistung (3 Phasen à 16 Ampere) arbeitet der fahrzeugeigene Inverter in seinem optimalen Wirkungsgradfenster, während die thermische Belastung von Hausanschluss und Kabel moderat bleibt.</li>
          </ul>

          <div className="p-5 rounded-2xl bg-white border border-[#DFE3DC] not-prose my-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2F5E73]">
                PRODUKTVERGLEICH · 11 KW &amp; PV-ÜBERSCHUSS
              </span>
              <div className="text-base font-bold text-[#171917]">
                Wallboxen für Zuhause vergleichen
              </div>
              <p className="text-xs text-[#6C716B]">
                33 Modelle im technischen Direktvergleich mit Filter nach Ladeleistung, KfW-Fähigkeit, Solarladen und MID-Zähler.
              </p>
            </div>
            <Link
              to="/wallbox-vergleich"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#171917] hover:bg-[#2F5E73] text-white font-bold text-xs shrink-0 transition-colors"
            >
              <span>Zum Wallbox-Vergleich</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">3. Drei Praxis-Tipps zur Minimierung von Ladeverlusten</h2>
          <div className="space-y-3 not-prose my-6">
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#DFE3DC] text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#2F5E73] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#171917]">Niemals dauerhaft über Schuko-Steckdosen laden:</strong> Neben dem Sicherheitsrisiko von Überhitzungen zahlen Sie durch die 15–20 % Ladeverluste bei 5.000 kWh Jahresbedarf über 250 € zusätzlich an ungenutzter Abwärme.
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#DFE3DC] text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#2F5E73] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#171917]">Direkt nach der Fahrt laden:</strong> Wenn die Batterie vom Fahren noch betriebswarm ist (20–30 °C), muss vor dem Laden keine Energie für die Batterieheizung aufgewendet werden.
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-white rounded-xl border border-[#DFE3DC] text-sm">
              <CheckCircle2 className="w-5 h-5 text-[#2F5E73] shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#171917]">Ladekabel-Querschnitt beachten:</strong> Nutzen Sie für Typ-2-Ladevorgänge hochwertige Kabel mit mindestens 6 mm² Aderquerschnitt, um Spannungsabfälle über 5 bis 7 Meter Leitungslänge zu minimieren.
              </div>
            </div>
          </div>
        </div>

        <CitationBox
          title="AC vs. DC Ladeverluste im Praxis-Vergleich: Technische Wirkungsgrade & Sparpotenziale"
          urlPath="/ratgeber/ac-vs-dc-ladeverluste"
        />

        <EEATBadge
          topic="Elektrotechnik &amp; Ladeverlust-Messungen"
          source1Title="Messtechnische Grundlagen"
          source1Text="Wirkungsgrad- und Verlustkurven von Onboard-Ladern (AC) und HPC-Leistungselektronik (DC) basierend auf Fachstudien und ADAC-Messreihen."
          source2Title="Physikalische Erläuterung"
          source2Text="Modellannahmen zur Wandlung von Drehstrom in Gleichstrom sowie thermischer Verlustleistung in Traktionsbatterien."
          dateText="Stand: Redaktionell geprüft 2026"
        />
      </article>
    );
  }

  // Article 3: blockiergebuehren-vermeiden
  if (articleSlug === 'blockiergebuehren-vermeiden') {
    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        <SEO
          title="Blockiergebühren vermeiden: Karenzzeiten, Kostenfallen & CPO-Vergleich"
          description="Standzeitgebühren ab 240 Min. AC / 60 Min. DC vermeiden. Karenzzeiten, Kostenfallen, Nacht-Regelungen und Betreibervergleich verständlich aufbereitet."
          canonicalPath="/ratgeber/blockiergebuehren-vermeiden"
          schema={getArticleSchema(
            "Blockiergebühren an Ladesäulen vermeiden: Karenzzeiten, Kostenfallen ab 240 Min. & CPO-Übersicht",
            "Ab wann greift die Standzeitgebühr? Wir vergleichen Karenzzeiten (240 Min. AC vs. 60 Min. DC), Nacht-Regelungen und maximale Kostendeckel aller großen Betreiber.",
            "blockiergebuehren-vermeiden"
          )}
        />
        <PageHero
          level={3}
          breadcrumbs={[
            { label: 'Startseite', href: '/' },
            { label: 'Ratgeber', href: '/ratgeber' },
            { label: 'Blockiergebühren vermeiden', isCurrent: true }
          ]}
          eyebrow="GUIDE · VERBRAUCHERRECHT"
          title="Blockiergebühren an Ladesäulen vermeiden: Karenzzeiten, Kostenfallen ab 240 Min. & CPO-Übersicht"
          description="Wer sein Elektroauto nach Abschluss des Ladevorgangs an der Säule stehen lässt, riskiert empfindliche Standzeitgebühren. Dieser Leitfaden klärt über Karenzzeiten, Minutenpreise und Nachtregelungen bei allen relevanten Betreibern auf."
        />

        <div className="prose prose-slate max-w-none text-[#171917] text-base sm:text-lg leading-relaxed space-y-6">
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">1. Was ist die Blockiergebühr und warum gibt es sie?</h2>
          <p>
            Die Blockiergebühr (offiziell Standzeitgebühr genannt) ist ein Zeittarif, der nach Überschreitung einer vertraglich vereinbarten Höchststandzeit (Karenzzeit) pro Minute berechnet wird. Ziel ist es, Ladesäulen als Umschlagplätze für Energie und nicht als Dauerparkplätze zu nutzen, damit andere Fahrer Zugang zur Ladeinfrastruktur erhalten.
          </p>

          <div className="p-5 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] not-prose my-6">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#6C716B] font-bold mb-3">
              Übersicht der Blockiergebühren bei führenden Anbietern
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#DFE3DC] text-[#6C716B]">
                    <th className="pb-2">ANBIETER</th>
                    <th className="pb-2">AC-KARENZZEIT</th>
                    <th className="pb-2">DC-KARENZZEIT</th>
                    <th className="pb-2">KOSTEN / MIN.</th>
                    <th className="pb-2">MAX. DECKEL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFE3DC] text-[#171917]">
                  <tr>
                    <td className="py-2.5 font-bold">EnBW mobility+</td>
                    <td>240 Minuten</td>
                    <td>240 Minuten</td>
                    <td>0,10 € / Min.</td>
                    <td>max. 12,00 € pro Vorgang</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">MAINGAU Autostrom</td>
                    <td>240 Minuten</td>
                    <td>60 Minuten</td>
                    <td>0,10 € / Min.</td>
                    <td>max. 12,00 € pro Vorgang</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Tesla Supercharger</td>
                    <td>0 Min. nach Ladeende</td>
                    <td>0 Min. nach Ladeende</td>
                    <td>0,50 € / 1,00 € / Min.</td>
                    <td>Kein Kostendeckel</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">DKV Mobility</td>
                    <td>240 Minuten</td>
                    <td>120 Minuten</td>
                    <td>0,12 € / Min.</td>
                    <td>Betreiberabhängig</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-950 mt-8 mb-4">2. Die Nacht-Regelung: Schutz beim Schlafen</h2>
          <p>
            Für Laternenparker, die ihr Fahrzeug abends an einer städtischen AC-Säule anstecken, gilt bei vielen kundenfreundlichen Anbietern eine Nachtruhe-Klausel. Bei Anbietern wie EnBW oder vielen Stadtwerken wird die Zeitmessung zwischen <strong>21:00 Uhr abends und 08:00 Uhr morgens pausiert</strong>.
          </p>
          <p>
            <strong>Vorsicht:</strong> Nicht jeder EMP unterstützt diese Nachtpause! Bei Anbietern ohne Nachtregelung läuft der Zeitzähler ab Minute 241 gnadenlos weiter, sodass am nächsten Morgen bis zu 12,00 € Zusatzgebühren anfallen.
          </p>

          <h2 className="text-2xl font-bold text-slate-950 mt-8 mb-4">3. Sonderfall Tesla Supercharger</h2>
          <p>
            Tesla verfolgt an seinen Superchargern die strengste Blockiergebühr-Politik der gesamten Branche: Sobald der Ladevorgang 100 % (oder das im Auto eingestellte Ladelimit) erreicht hat, bleiben dem Fahrer genau <strong>5 Minuten Karenzzeit</strong>, um das Fahrzeug wegzufahren.
          </p>
          <p>
            Ist die Station zu mehr als 50 % belegt, fallen <strong>0,50 € pro Minute</strong> an. Ist der Supercharger zu 100 % voll belegt, verdoppelt sich die Gebühr auf <strong>1,00 € pro Minute</strong>. Da es bei Tesla keinen Kostendeckel gibt, kann ein vergessenes Fahrzeug über Nacht mehrere hundert Euro Standzeitgebühr verursachen.
          </p>
        </div>

        <CitationBox
          title="Blockiergebühren an Ladesäulen vermeiden: Karenzzeiten, Kostenfallen ab 240 Min. & CPO-Vergleich"
          urlPath="/ratgeber/blockiergebuehren-vermeiden"
        />

        <EEATBadge
          topic="Verbraucherschutz &amp; Standzeitgebühren"
          source1Title="AGB &amp; Tarifwerke der Betreiber"
          source1Text="Auswertung der Blockiergebühren-Regelungen, Karenzzeiten und Deckelungen führender EMPs und CPOs (EnBW, EWE Go, Ionity, Tesla u. a.)."
          source2Title="Praxishinweise für Verbraucher"
          source2Text="Hinweise zur Vermeidung unbemerkter Mehrkosten bei Nachtladungen und automatischen Ladezeitbegrenzungen."
          dateText="Stand: September 2026"
        />

        <FloatingCTABar
          title="Die richtige Ladekarte finden"
          subtitle="Tarife & Roaming im Direktvergleich"
          link="/ladekarten"
          linkLabel="Ladekarten vergleichen"
        />
      </article>
    );
  }

  // Article 4: bordsteinladen (Ladebordstein & Bordsteinlader)
  if (articleSlug === 'bordsteinladen') {
    const bordsteinFaqs = [
      {
        q: "Was ist ein Ladebordstein und wie unterscheidet er sich von normalen Ladesäulen?",
        a: "Ein Ladebordstein integriert die gesamte Ladeelektronik und den Typ-2-Steckanschluss direkt in die Kante des Randsteins bzw. in den Gehweg. Dadurch wird kein freistehendes Säulengehäuse benötigt, der Gehweg bleibt für Fußgänger, Rollstühle und Kinderwagen barrierefrei passierbar und das Stadtbild wird geschont."
      },
      {
        q: "Wie funktioniert ein Bordsteinlader technisch im Alltag?",
        a: "Der Bordsteinlader wird an das städtische Niederspannungsnetz angebunden. Fahrer parken am Straßenrand, öffnen die Schutzklappe des Bordsteins, stecken ihr Standard-Typ-2-Ladekabel ein und autorisieren den Vorgang per RFID-Ladekarte, App oder QR-Code. Ein Verriegelungsmechanismus schützt das Kabel während der Ladung vor Diebstahl."
      },
      {
        q: "Welche Ladeleistung liefert ein Ladebordstein?",
        a: "Ladebordsteine stellen in der Regel AC-Normalladung mit bis zu 22 kW bereit (3 Phasen, 400 V, 32 A). Die tatsächliche Ladeleistung richtet sich nach dem Onboard-Lader des Elektroautos (bei vielen Pkw 11 kW) sowie dem lokalen Lastmanagement des Energieversorgers."
      },
      {
        q: "Was kostet die Errichtung eines Ladebordsteins?",
        a: "Die Hardwarekosten liegen im mittleren bis oberen vierstelligen Bereich pro Ladepunkt. Hinzu kommen Kosten für Tiefbau (Aufbrechen, Verlegung, Gehweg-Wiederherstellung) von ca. 80 bis 150 € netto pro laufendem Meter sowie Netzanschlussgebühren. Wirtschaftlich ist das Konzept vor allem, wenn Kommunen im Rahmen geplanter Straßensanierungen Leerrohre und günstige Dummy-Bordsteine vorverlegen."
      },
      {
        q: "Wie unterscheidet sich der Ladebordstein vom Laternenladen?",
        a: "Laternenladen nutzt bestehende Lichtmasten und liefert meist 3,7 kW AC (einphasig, 16 A), was lange Ladezeiten von 10 bis 15 Stunden für eine Vollladung bedeutet. Ladebordsteine bieten mit bis zu 22 kW deutlich höhere Ladeleistungen, erfordern jedoch eigenen Tiefbau zur Bordsteinkante."
      },
      {
        q: "Kann jedes Elektroauto an einem Ladebordstein laden?",
        a: "Ja. Jeder Ladebordstein in Deutschland nutzt die europäisch genormte Typ-2-Buchse (IEC 62196-2). Jedes serienmäßige Elektroauto mit Typ-2-Kabel kann dort laden. Die Abrechnung erfolgt eichrechtskonform nach Kilowattstunden."
      }
    ];

    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        <SEO
          title="Ladebordstein: Funktion, Kosten & Bordsteinlader 2026"
          description="Wie funktioniert ein Ladebordstein? Technik, 22 kW Ladeleistung, Kosten & Erfahrungen mit Bordsteinladern. Rheinmetall & Laternenladen im Praxisvergleich."
          canonicalPath="/ratgeber/bordsteinladen"
          schema={getArticleSchema(
            "Ladebordstein: So funktionieren Bordsteinlader für E-Autos im Straßenraum",
            "Umfassender Ratgeber zu Ladebordsteinen und Bordsteinladern: Technische Funktionsweise, Ladeleistung bis 22 kW, Tiefbau- und Anschaffungskosten, Rheinmetall-Pilotprojekt in Köln sowie Vergleich mit Laternenladen und AC-Ladesäulen.",
            "bordsteinladen",
            bordsteinFaqs
          )}
        />
        <PageHero
          level={3}
          breadcrumbs={[
            { label: 'Startseite', href: '/' },
            { label: 'Ratgeber', href: '/ratgeber' },
            { label: 'Ladebordstein & Bordsteinlader', isCurrent: true }
          ]}
          eyebrow="GUIDE · HARDWARE & INFRASTRUKTUR"
          title="Ladebordstein: So funktionieren Bordsteinlader für E-Autos"
          description="Für Millionen Laternenparker in dicht bebauten Städten fehlt oft der Platz für klassische Ladesäulen auf Gehwegen. Ladebordsteine integrieren die Ladetechnik unsichtbar in den Randstein. Dieser Fachratgeber erklärt Funktionsweise, 22-kW-Ladeleistung, Kostenstrukturen, das Rheinmetall-Pilotprojekt in Köln und den direkten Vergleich zum Laternenladen."
        />

        {/* Quick Facts Matrix */}
        <div className="p-6 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs space-y-4 not-prose">
          <span className="text-xs font-mono uppercase tracking-wider text-[#2F5E73] font-bold block">
            Ladebordstein &amp; Bordsteinlader auf einen Blick (Stand: 2026)
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#F7F7F2] rounded-xl border border-[#DFE3DC]">
              <span className="text-[#6C716B] block mb-1">LADELEISTUNG</span>
              <strong className="text-base text-[#171917] font-black block">bis 22 kW AC</strong>
              <span className="text-[11px] text-[#6C716B]">Dreiphasig 400 V / 32 A</span>
            </div>
            <div className="p-3 bg-[#F7F7F2] rounded-xl border border-[#DFE3DC]">
              <span className="text-[#6C716B] block mb-1">STECKVERBINDUNG</span>
              <strong className="text-base text-[#171917] font-black block">Typ 2 Buchse</strong>
              <span className="text-[11px] text-[#6C716B]">IEC 62196-2 Standard</span>
            </div>
            <div className="p-3 bg-[#F7F7F2] rounded-xl border border-[#DFE3DC]">
              <span className="text-[#6C716B] block mb-1">SCHUTZKLASSE</span>
              <strong className="text-base text-[#171917] font-black block">IP68 gekapselt</strong>
              <span className="text-[11px] text-[#6C716B]">Überfahrbar bis 10 t</span>
            </div>
            <div className="p-3 bg-[#F7F7F2] rounded-xl border border-[#DFE3DC]">
              <span className="text-[#6C716B] block mb-1">ZIELGRUPPE</span>
              <strong className="text-base text-[#171917] font-black block">Laternenparker</strong>
              <span className="text-[11px] text-[#6C716B]">Kommunen &amp; Quartiere</span>
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-[#171917] text-base sm:text-lg leading-relaxed space-y-6">

          {/* A. Einstieg */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            1. Was ist ein Ladebordstein und welche Aufgabe erfüllt er?
          </h2>
          <p>
            Ein <strong>Ladebordstein</strong> (im internationalen Sprachgebrauch auch <em>Curb Charger</em> oder <strong>Bordsteinlader</strong> genannt) ist eine baulich integrierte Ladeeinrichtung für Elektrofahrzeuge, bei der Steckdose, Steuerung und Eichrechtszähler direkt in die Bordsteinkante des Gehwegs eingelassen sind.
          </p>
          <p>
            In dicht besiedelten Innenstädten und Wohnquartieren stehen Kommunen vor einem Dilemma: Über 40 bis 60 Prozent aller Pkw-Halter verfügen weder über eine private Garage noch über einen festen Stellplatz mit eigener Wallbox. Wer am Straßenrand parkt (sogenannte Laternenparker), ist auf das Laden im öffentlichen Verkehrsraum angewiesen. Herkömmliche freistehende Ladesäulen beanspruchen jedoch wertvollen Gehwegraum. Insbesondere auf schmalen Bürgersteigen führen sie zu Nutzungskonflikten mit Fußgängern, Kinderwagen und Rollstuhlfahrern.
          </p>
          <p>
            Hier setzt das Konzept <strong>Bordsteinladen</strong> an: Statt oberirdischer Säulenkästen nutzt die Technologie den ohnehin vorhandenen Randstein als Montageort. Der Gehweg bleibt über seine gesamte Breite hindernisfrei passierbar, während parkende Autos direkt an der Fahrbahnkante mit sauberem Wechselstrom versorgt werden können.
          </p>

          {/* B. Funktionsweise */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            2. Funktionsweise: Wie ist ein Bordsteinlader aufgebaut?
          </h2>
          <p>
            Technisch besteht ein modernes Ladebordsteinsystem aus mehreren modularen Komponenten, die nahtlos in die Tiefbauinfrastruktur der Straße integriert werden:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>
              <strong>Bordstein-Grundkörper:</strong> Ein formstabiles Element aus speziellem Hochleistungsbeton oder Gusseisen (z. B. Grauguss), das den standardisierten Abmessungen kommunaler Randsteine (z. B. 1 Meter Länge, 15 cm Breite, 25 cm Höhe) entspricht und nahtlos in bestehende Bordsteinfluchten eingesetzt werden kann.
            </li>
            <li>
              <strong>Elektronikmodul:</strong> Das Herzstück des Bordsteinladers enthält die Ladeelektronik, Kommunikationscontroller (OCPP-Schnittstelle), Schutzschaltgeräte (DC-Fehlerstromerkennung) und einen geeichten Energiezähler nach deutschem MessEG.
            </li>
            <li>
              <strong>Kabel- und Netzanbindung:</strong> Die Stromzuleitung verläuft unterirdisch in einem flachen Schutzkanal unterhalb der Gehwegplatten. Von dort führt die Anbindung zu einer Zähleranschlusssäule (ZAS) oder einem lokalen Niederspannungsverteiler.
            </li>
            <li>
              <strong>Witterungs- und Schmutzschutz (IP68):</strong> Da die Rinne am Straßenrand stark durch Regenwasser, Straßenschmutz, Streusalz und Kehrmaschinen beansprucht wird, ist die Elektronik hermetisch abgedichtet. Intelligente Klapp- und Dichtungsmechanismen verhindern das Eindringen von Schmutzwasser in die Typ-2-Buchse. Ein integriertes Heizkonzept verhindert das Einfrieren der Mechanik im Winter.
            </li>
            <li>
              <strong>Wartung und Austausch („CurbSwap“):</strong> Führende Systeme arbeiten mit Schnellkupplungen. Im Falle eines Defekts oder für turnusmäßige Eichfristen muss nicht der Bürgersteig aufgerissen werden: Das Elektronikmodul lässt sich mit Spezialwerkzeug in wenigen Minuten entriegeln, herausheben und austauschen.
            </li>
          </ul>

          <div className="p-5 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] text-sm text-[#171917] my-6 not-prose">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#2F5E73] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-[#171917] mb-1">
                  Mechanische Belastbarkeit &amp; Überrollsicherheit
                </strong>
                <p className="text-[#6C716B] leading-relaxed">
                  Ladebordsteine müssen für den rauen Alltagsbetrieb im Straßenverkehr zugelassen sein. Serienreife Modelle wie das von Rheinmetall sind für Achslasten von bis zu <strong>10 Tonnen</strong> zertifiziert. Sie überstehen das versehentliche Überfahren durch schwere Müllfahrzeuge, Schneepflüge oder Lieferwagen unbeschadet.
                </p>
              </div>
            </div>
          </div>

          {/* C. Ladeleistung */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            3. Ladeleistung: Wie schnell lädt ein E-Auto am Ladebordstein?
          </h2>
          <p>
            Ladebordsteine sind für das sogenannte <strong>AC-Normalladen (Wechselstrom)</strong> nach DIN EN 61851-1 ausgelegt. Sie stellen typischerweise eine maximale elektrische Anschlussleistung von <strong>bis zu 22 kW</strong> (dreiphasig 400 V mit 32 A) bereit.
          </p>
          <p>
            In der Praxis bestimmt jedoch nicht allein der Bordstein die Ladedauer, sondern das Zusammenspiel aus drei Faktoren:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-base">
            <li>
              <strong>Onboard-Charger des Fahrzeugs:</strong> Die meisten auf dem deutschen Markt verfügbaren Elektro-Pkw (wie VW ID.4, Tesla Model Y, BMW i4) besitzen einen internen Wechselstromlader mit <strong>11 kW</strong>. Nur wenige Modelle (z. B. Renault Zoe, Porsche Taycan mit Aufpreis-Option) können die vollen 22 kW AC aufnehmen.
            </li>
            <li>
              <strong>Netzanschluss &amp; dynamisches Lastmanagement:</strong> Wenn mehrere Bordsteinladepunkte entlang eines Straßenzugs installiert sind, begrenzt der Verteilnetzbetreiber oft die gleichzeitige Summenleistung, um das Quartiersnetz vor Überlastung zu schützen. Über intelligentes Lastmanagement wird der Ladestrom pro Fahrzeug bedarfsgerecht gesteuert.
            </li>
            <li>
              <strong>Batteriekapazität:</strong> Ein Pkw mit einer 60-kWh-Batterie lädt an einem 11-kW-Anschluss in ca. 5 bis 6 Stunden von 10 auf 100 Prozent – ideal für die typische Standzeit über Nacht oder während eines Arbeitstags.
            </li>
          </ol>

          {/* Modellrechnung Box */}
          <div className="p-5 rounded-2xl bg-white border border-[#DFE3DC] shadow-xs my-6 not-prose">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6C716B] font-bold block mb-2">
              Beispielhafte Modellrechnung: Typische Ladedauer am Ladebordstein *
            </span>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#DFE3DC] text-[#6C716B]">
                    <th className="pb-2">FAHRZEUGKLASSE (AKKU)</th>
                    <th className="pb-2">ONBOARD-LADER</th>
                    <th className="pb-2">NETTO-LADELEISTUNG</th>
                    <th className="pb-2">LADEDAUER (20–80 %)</th>
                    <th className="pb-2">GEWONNENE REICHWEITE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFE3DC] text-[#171917]">
                  <tr>
                    <td className="py-2.5 font-bold">Kompakt (50 kWh Akku)</td>
                    <td>11 kW AC</td>
                    <td>ca. 10,2 kW netto</td>
                    <td>ca. 3,0 Stunden</td>
                    <td>ca. 180 – 210 km</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Mittelklasse (77 kWh Akku)</td>
                    <td>11 kW AC</td>
                    <td>ca. 10,2 kW netto</td>
                    <td>ca. 4,5 Stunden</td>
                    <td>ca. 240 – 290 km</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">22-kW-Pkw (60 kWh Akku)</td>
                    <td>22 kW AC</td>
                    <td>ca. 20,4 kW netto</td>
                    <td>ca. 1,8 Stunden</td>
                    <td>ca. 200 – 240 km</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-[#6C716B] mt-3 font-mono">
              * Modellrechnung unter Annahme von ca. 8 % typischen AC-Wandlungsverlusten im fahrzeugeigenen Onboard-Charger. Die tatsächliche Ladedauer variiert abhängig von Fahrzeugmodell, Batterietemperatur und Freigabe durch das kommunale Lastmanagement.
            </p>
          </div>

          {/* D. Rheinmetall-Ladebordstein */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            4. Der Rheinmetall-Ladebordstein: Technik und Pilotprojekte
          </h2>
          <p>
            Der Technologie- und Rüstungskonzern Rheinmetall (über seinen zivilen Geschäftsbereich Power Systems / Pierburg) gehört zu den bekanntesten Entwicklern serienreifer Bordsteinladepunkte in Deutschland. Der <strong>Rheinmetall Ladebordstein</strong> wurde speziell für den kommunalen Einsatz im öffentlichen Straßenraum konzipiert.
          </p>
          
          <h3 className="text-lg font-bold text-[#171917] mt-6 mb-2">
            Technische Eckdaten laut Herstellerangaben:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>
              <strong>Abmessungen:</strong> Ca. 990 mm Länge, 150 mm Breite, 250 mm Tiefe – passend zum gängigen DIN-Bordsteinmaß T15/25.
            </li>
            <li>
              <strong>Gewicht:</strong> Beton- bzw. Gusseisengrundkörper ca. 53 kg, austauschbares Elektronikmodul ca. 17 kg.
            </li>
            <li>
              <strong>Ladeleistung:</strong> Bis zu 22 kW AC (3 Phasen, 400 V, 32 A).
            </li>
            <li>
              <strong>Schutzart &amp; Umwelt:</strong> IP68-Zertifizierung des Elektronikgehäuses, temperaturbeständig von −25 °C bis +50 °C mit integrierter Heizung (ca. 60 W Spitzenheizleistung gegen Vereisung).
            </li>
            <li>
              <strong>Bedienung &amp; Authentifizierung:</strong> Einhand-Klappmechanismus, Freigabe via RFID-Karte, Smartphone-App oder dynamischem QR-Code.
            </li>
            <li>
              <strong>Vernetzung:</strong> Integriertes 4G-Mobilfunkmodem (LTE) und Ethernet-Schnittstelle mit OCPP 1.6J / OCPP 2.0.1 Unterstützung.
            </li>
          </ul>

          <h3 className="text-lg font-bold text-[#171917] mt-6 mb-2">
            Pilotprojekt Köln (Köln-Lindenthal mit TankE &amp; Stadt Köln):
          </h3>
          <p>
            Im April 2024 startete in Köln-Lindenthal (u. a. Herbert-Lewin-Straße) ein groß angelegter Praxistest in Kooperation zwischen der Stadt Köln, Rheinmetall und dem Ladeinfrastrukturbetreiber <em>TankE GmbH</em> (Tochter der RheinEnergie AG).
          </p>
          <p>
            Nach einem einjährigen Testzeitraum bis Frühjahr 2025 zogen die Projektpartner eine positive Bilanz: Über <strong>2.800 Ladevorgänge</strong> und rund <strong>50 Megawattstunden</strong> Strom wurden über die Testbordsteine verlässlich geladen. Im Schnitt flossen ca. 19 kWh pro Ladevorgang. Die gemessene technische Verfügbarkeit lag bei über <strong>99 Prozent</strong>. Nach Abschluss der wissenschaftlichen Begleitphase wurden die Bordsteine in den regulären Dauerbetrieb übernommen.
          </p>

          {/* E. Kosten */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            5. Kosten: Was kostet ein Ladebordstein im Vergleich zur Ladesäule?
          </h2>
          <p>
            Bei der wirtschaftlichen Betrachtung von Ladebordsteinen müssen Kommunen, Energieversorger und Flottenbetreiber zwischen fünf getrennten Kostenblöcken unterscheiden:
          </p>
          <div className="space-y-4 not-prose my-6">
            <div className="p-4 bg-white rounded-xl border border-[#DFE3DC]">
              <strong className="block text-sm font-bold text-[#171917] mb-1">
                1. Hardware-Anschaffungskosten:
              </strong>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Der Ladebordstein inklusive Elektronikmodul, MID-/Eichrechtszähler und Kommunikationsgateway liegt im mittleren bis oberen vierstelligen Bereich pro Ladepunkt (typischerweise ca. 4.000 bis 7.500 € netto, abhängig von Stückzahl und Ausführung). Dies liegt auf einem vergleichbaren Niveau wie hochwertige, eichrechtskonforme Doppel-AC-Ladesäulen.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#DFE3DC]">
              <strong className="block text-sm font-bold text-[#171917] mb-1">
                2. Tiefbau und Bürgersteig-Installation:
              </strong>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Tiefbauarbeiten im innerstädtischen Gehwegbereich kosten im Schnitt <strong>80 bis 150 € netto pro laufendem Meter</strong>. Hinzu kommt das Ausheben alter Bordsteine und das Einpassen der neuen Randsteinelemente. Während bei einer Ladesäule ein tiefes Blockfundament gegossen werden muss, erfordert der Ladebordstein flachere Schlitze direkt entlang der Bordkante.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#DFE3DC]">
              <strong className="block text-sm font-bold text-[#171917] mb-1">
                3. Der Skalierungsvorteil durch „Dummy-Bordsteine“:
              </strong>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Ein entscheidender wirtschaftlicher Hebel ist das sogenannte <em>Pay-as-you-grow</em>-Prinzip: Wenn eine Kommune eine Straße ohnehin saniert, werden Leerrohre und günstige Dummy-Bordsteine (reine Betonkörper ohne Elektronik für wenige hundert Euro) durchgehend verlegt. Erst wenn der tatsächliche Ladebedarf im Quartier wächst, werden die teuren Elektronikmodule sekundenschnell eingeschoben.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#DFE3DC]">
              <strong className="block text-sm font-bold text-[#171917] mb-1">
                4. Netzanschluss &amp; Transformator-Kapazität:
              </strong>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Die Anschlussgebühren an das Niederspannungsnetz des lokalen Verteilnetzbetreibers (VNB) richten sich nach der benötigten Leistung und der Entfernung zur nächsten Zähleranschlusssäule. Intelligentes Lastmanagement hält diese Kosten niedrig, da nicht jeder Punkt mit vollen 22 kW gleichzeitig versorgt werden muss.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#DFE3DC]">
              <strong className="block text-sm font-bold text-[#171917] mb-1">
                5. Strompreis für Endkunden:
              </strong>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Für E-Autofahrer richtet sich der Ladepreis am Bordstein nach dem Tarif des betreibenden Stadtwerks bzw. des genutzten Mobility Providers (MSP). Typische Preise für öffentliches AC-Laden bewegen sich 2026 bei ca. <strong>0,45 bis 0,60 € pro kWh</strong>.
              </p>
            </div>
          </div>

          {/* F. Vergleich der Ladekonzepte */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            6. Vergleich der AC-Ladekonzepte im Straßenraum
          </h2>
          <p>
            Um das Laden am Straßenrand zu ermöglichen, existieren im urbanen Raum drei konkurrierende bzw. sich ergänzende Konzepte. Keines ist für jeden Standort ideal:
          </p>

          <div className="p-5 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] not-prose my-6">
            <h3 className="text-sm font-mono uppercase tracking-wider text-[#6C716B] font-bold mb-3">
              Gegenüberstellung: Ladebordstein vs. Ladesäule vs. Laternenladen
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#DFE3DC] text-[#6C716B]">
                    <th className="pb-2">KRITERIUM</th>
                    <th className="pb-2">LADEBORDSTEIN</th>
                    <th className="pb-2">KLASSISCHE AC-SÄULE</th>
                    <th className="pb-2">LATERNENLADEN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFE3DC] text-[#171917]">
                  <tr>
                    <td className="py-2.5 font-bold">Oberirdischer Platzbedarf</td>
                    <td className="text-emerald-700 font-semibold">0 m² (im Randstein integriert)</td>
                    <td className="text-amber-800">Mittel (0,2–0,5 m² auf Gehweg)</td>
                    <td className="text-emerald-700 font-semibold">0 m² (am Masten montiert)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Barrierefreiheit Gehweg</td>
                    <td className="text-emerald-700 font-semibold">100 % frei (DIN 18040-3 konform)</td>
                    <td className="text-amber-800">Hindernis auf schmalen Wegen</td>
                    <td className="text-emerald-700 font-semibold">Bestehender Mast genutzt</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Maximale AC-Ladeleistung</td>
                    <td className="font-bold">bis zu 22 kW</td>
                    <td className="font-bold">bis zu 22 kW</td>
                    <td className="text-rose-700 font-bold">3,7 kW (selten bis 7,4 kW)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Ladedauer (20–80 % bei 60 kWh)</td>
                    <td>ca. 3,5 – 4,5 Stunden (11 kW)</td>
                    <td>ca. 3,5 – 4,5 Stunden (11 kW)</td>
                    <td className="text-rose-700">ca. 10 – 12 Stunden (3,7 kW)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Tiefbauaufwand</td>
                    <td>Mittel (Bordsteinschlitze)</td>
                    <td>Hoch (Fundament &amp; Zuleitung)</td>
                    <td className="text-emerald-700 font-semibold">Gering (sofern Mastnetz reicht)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Witterungseinfluss &amp; Schmutz</td>
                    <td>Hoch (Regenrinne, IP68 nötig)</td>
                    <td>Gering (Säulengehäuse trocken)</td>
                    <td>Gering (in 1 m Höhe am Mast)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Wartungszugang</td>
                    <td>Modular via Schnellkupplung</td>
                    <td>Revisionsklappe an Säule</td>
                    <td>Mastklappe</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* G. Vor- und Nachteile */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            7. Chancen und Herausforderungen in der kommunalen Praxis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
            <div className="p-5 bg-white rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider block">
                Vorteile &amp; Potenziale
              </span>
              <ul className="space-y-1.5 text-xs text-[#171917]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Gehwege bleiben barrierefrei:</strong> Volle Breite für Rollstühle und Fußgänger erhalten (DIN 18040-3).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Schonung des Stadtbilds:</strong> Kein Schilder- und Säulenwald in historischen Quartieren.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Hohe Ladeleistung:</strong> 11 bis 22 kW ermöglichen flexibles Laden tagsüber und nachts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Vorbereitung auf Vorrat:</strong> Günstige Dummy-Bordsteine bei Sanierungen vorverlegbar.</span>
                </li>
              </ul>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-amber-200 space-y-2">
              <span className="text-xs font-mono font-bold text-amber-800 uppercase tracking-wider block">
                Herausforderungen &amp; Grenzen
              </span>
              <ul className="space-y-1.5 text-xs text-[#171917]">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Witterungsanfällige Einbauzone:</strong> Starke Schmutz-, Wasser- und Streusalzbelastung im Rinnenbereich.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Winterbetrieb:</strong> Schneeaufhäufungen durch Schneepflüge können Zugänglichkeit behindern.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Kabelverlauf:</strong> Das Ladekabel liegt auf der Bordsteinkante oder im Gehweganschnitt (Stolperschutz).</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Tiefbau bei Bestandsstraßen:</strong> Nachträglicher Einbau ohne ohnehin geplante Sanierung teuer.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* H. Reale Pilotprojekte */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            8. Kommunale Praxis: Dokumentierte Einsätze in Deutschland
          </h2>
          <p>
            Ladebordsteine befinden sich aktuell am Übergang von geförderten Forschungsprojekten in erste standardisierte Rollout-Programme. Zu den wichtigsten dokumentierten Praxiseinsätzen zählen:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>
              <strong>Köln (Stadt Köln &amp; TankE / RheinEnergie):</strong> Seit April 2024 wurden in Köln-Lindenthal (Herbert-Lewin-Straße) Rheinmetall-Ladebordsteine unter realen Verkehrsbedingungen im Anwohnerbereich betrieben. Das Projekt bewies über 2.800 erfolgreiche Ladevorgänge mit 99 % Verfügbarkeit und ging nach wissenschaftlicher Auswertung in den Regelbetrieb über.
            </li>
            <li>
              <strong>Schwerte / Nordrhein-Westfalen:</strong> Im Rahmen von Demonstrationsvorhaben für kommunale Verkehrsbetriebe wurden Ladebordsteine auf Betriebshöfen und in Parkbuchten getestet, um Parkplätze ohne Stolperkanten für Mitarbeiter zu elektrifizieren.
            </li>
            <li>
              <strong>Laternenlade-Netzwerk Berlin (ubitricity / ElMobileBerlin):</strong> Als technologischer Vergleichspunkt betreibt ubitricity in Berlin über 1.000 Laternenladepunkte (Modell „Heinz“ mit bis zu 3,7 kW). Berlin zeigt, wie das Laternenladen flächendeckend für Laternenparker funktioniert, stößt bei steigendem Fahrzeugbestand jedoch an die Grenzen der einphasigen 3,7-kW-Ladeleistung.
            </li>
          </ul>

          {/* I. Häufige Fragen FAQ */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            9. Häufig gestellte Fragen (FAQ) zu Ladebordsteinen
          </h2>
          <div className="space-y-3 not-prose my-6">
            {bordsteinFaqs.map((faq, idx) => (
              <div key={idx} className="p-4 sm:p-5 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs space-y-2">
                <strong className="text-base font-bold text-[#171917] block flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-[#2F5E73] shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </strong>
                <p className="text-sm text-[#6C716B] leading-relaxed pl-7">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

        </div>

        {/* Citation Box */}
        <CitationBox
          title="Ladebordstein: Funktion, Kosten &amp; Bordsteinlader 2026"
          urlPath="/ratgeber/bordsteinladen"
        />

        {/* EEAT Badge */}
        <EEATBadge
          topic="Ladeinfrastruktur &amp; Bordsteinlader"
          source1Title="Herstellerdokumentation &amp; Normen"
          source1Text="Technische Spezifikationen des Rheinmetall-Ladebordsteins (IP68, DIN EN 61851-1, DIN 18040-3 Barrierefreiheit, Eichrecht nach MessEG)."
          source2Title="Pilotprojektdaten &amp; Kommunalpraxis"
          source2Text="Auswertung der Kölner Pilotstudie (Stadt Köln / TankE GmbH, 2.800 Ladevorgänge, >99 % Verfügbarkeit) sowie Vergleich mit dem Berliner Laternenladen (ubitricity)."
          dateText="Stand: Redaktionell geprüft 2026"
        />

        {/* Floating CTA Bar */}
        <FloatingCTABar
          title="Ladezeit am Ladebordstein berechnen"
          subtitle="Vergleichen Sie AC-Ladezeiten für Ihr Fahrzeugmodell"
          link="/rechner"
          linkLabel="Zum Ladezeitrechner"
        />
      </article>
    );
  }

  // Fallback for unknown slugs
  return <Navigate to="/404" replace />;
};

export default RatgeberArticlePage;

