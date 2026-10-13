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
          description={`Welche Ladekarte lohnt sich für welches Fahrprofil? ${CHARGING_CARDS.length} Tarife im Faktencheck: ADAC, EnBW, Tesla, Maingau & Co. – Roaming-Netze, Grundgebühren, AC/DC-Preise & Sparstrategie.`}
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
            <h3 className="font-bold text-[#171917] text-base">Tarifrechner &amp; Ladekarten-Vergleich</h3>
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
        q: "Was ist ein Ladebordstein und wie unterscheidet er sich von klassischen Ladesäulen?",
        a: "Ein Ladebordstein integriert Ladeelektronik und Typ-2-Steckanschluss direkt in die Kante des Randsteins. Dadurch wird kein freistehendes Säulengehäuse auf dem Gehweg benötigt. Die nutzbare Gehwegbreite bleibt erhalten, was insbesondere auf schmalen Bürgersteigen die Durchgangsbreite für Fußgänger schont."
      },
      {
        q: "Wie funktioniert ein Bordsteinlader technisch im Alltag?",
        a: "Der Bordsteinlader wird an das Niederspannungsnetz angebunden. Fahrer öffnen die Schutzklappe an der Bordsteinkante, stecken ihr Standard-Typ-2-Ladekabel ein und starten den Ladevorgang per RFID-Ladekarte, Betreiber-App oder Ad-hoc-Zugang. Ein Verriegelungsmechanismus arretiert den Stecker während des Ladevorgangs."
      },
      {
        q: "Welche Ladeleistung stellt ein Ladebordstein bereit?",
        a: "Ladebordstein-Konzepte sind in der Regel für AC-Normalladung mit bis zu 22 kW (dreiphasig 400 V, 32 A) oder 11 kW ausgelegt. Die effektiv erzielte Ladeleistung hängt maßgeblich vom fahrzeugeigenen Onboard-Charger (bei den meisten E-Autos auf 11 kW limitiert) und dem dynamischen Lastmanagement des Netzbetreibers ab."
      },
      {
        q: "Welche Kostenfaktoren bestimmen die Errichtung von Ladebordsteinen?",
        a: "Wesentliche Faktoren sind die Hardware des Ladesystems, Tiefbauarbeiten (Kabelgraben oder Schlitzfräsung, Wiederherstellung der Oberfläche), der Netzanschluss an die Niederspannung sowie der laufende Betrieb. Kommunen und Betreiber nutzen vorbereitende Leerrohrtrassen und Leergehäuse ('Dummy-Bordsteine'), um Tiefbaukosten bei anstehenden Straßensanierungen zu bündeln und Elektronikmodule erst bei konkretem Bedarf nachzurüsten."
      },
      {
        q: "Wie unterscheidet sich der Ladebordstein vom Laternenladen?",
        a: "Laternenladen nutzt bestehende Lichtmasten und liefert typischerweise einphasig 3,7 kW AC (16 A), was lange Standzeiten erfordert. Ladebordsteine erlauben mit dreiphasig bis zu 22 kW höhere Ladeleistungen, bedingen jedoch eine dedizierte Leitungsverlegung und Erdarbeiten bis an die Bordsteinkante."
      },
      {
        q: "Kann jedes Elektroauto an einem Ladebordstein laden?",
        a: "Ja, sofern das System über eine standardisierte Typ-2-Steckdose (nach IEC 62196-2) verfügt. Alle serienmäßigen Elektrofahrzeuge in Europa mit Typ-2-Ladekabel können angeschlossen werden. Die Abrechnung im öffentlichen Raum erfolgt eichrechtskonform."
      }
    ];

    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        <SEO
          title="Ladebordstein: Funktion, Kosten & Bordsteinlader"
          description="Wie funktioniert ein Ladebordstein? Technik, Ladeleistung, Kostenfaktoren & Praxiserfahrungen mit Bordsteinladern. Rheinmetall & Laternenladen im Vergleich."
          canonicalPath="/ratgeber/bordsteinladen"
          schema={getArticleSchema(
            "Ladebordstein: So funktionieren Bordsteinlader für E-Autos im Straßenraum",
            "Umfassender Ratgeber zu Ladebordsteinen und Bordsteinladern: Technische Funktionsweise, Ladeleistung bis 22 kW, Kostenfaktoren, Rheinmetall-Pilotprojekte sowie Vergleich mit Laternenladen und AC-Ladesäulen.",
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
          description="Für Laternenparker in dicht bebauten Städten fehlt oft der Raum für klassische Ladesäulen auf Gehwegen. Ladebordsteine integrieren die Ladetechnik direkt in den Randstein. Dieser Fachratgeber ordnet Funktionsweise, Ladeleistung, Kostenfaktoren, das Rheinmetall-Pilotprojekt in Köln sowie praktische Herausforderungen sachlich ein."
        />

        {/* Quick Facts Matrix */}
        <div className="p-6 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs space-y-4 not-prose">
          <span className="text-xs font-mono uppercase tracking-wider text-[#2F5E73] font-bold block">
            Ladebordstein &amp; Bordsteinlader im Überblick
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className="p-3 bg-[#F7F7F2] rounded-xl border border-[#DFE3DC]">
              <span className="text-[#6C716B] block mb-1">LADELEISTUNG</span>
              <strong className="text-base text-[#171917] font-black block">bis 22 kW AC</strong>
              <span className="text-[11px] text-[#6C716B]">Dreiphasig (oft 11 kW fahrzeugbegrenzt)</span>
            </div>
            <div className="p-3 bg-[#F7F7F2] rounded-xl border border-[#DFE3DC]">
              <span className="text-[#6C716B] block mb-1">STECKVERBINDUNG</span>
              <strong className="text-base text-[#171917] font-black block">Typ 2 Buchse</strong>
              <span className="text-[11px] text-[#6C716B]">IEC 62196-2 Standard</span>
            </div>
            <div className="p-3 bg-[#F7F7F2] rounded-xl border border-[#DFE3DC]">
              <span className="text-[#6C716B] block mb-1">SCHUTZKLASSE</span>
              <strong className="text-base text-[#171917] font-black block">Modul IP68</strong>
              <span className="text-[11px] text-[#6C716B]">Gesamtsystem IP54 / IK10 (Herstellerangabe)</span>
            </div>
            <div className="p-3 bg-[#F7F7F2] rounded-xl border border-[#DFE3DC]">
              <span className="text-[#6C716B] block mb-1">EINSATZBEREICH</span>
              <strong className="text-base text-[#171917] font-black block">Laternenparker</strong>
              <span className="text-[11px] text-[#6C716B]">Urbane Quartiere am Straßenrand</span>
            </div>
          </div>
        </div>

        <div className="prose prose-slate max-w-none text-[#171917] text-base sm:text-lg leading-relaxed space-y-6">

          {/* A. Einstieg */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            1. Was ist ein Ladebordstein und welche Aufgabe erfüllt er?
          </h2>
          <p>
            Ein <strong>Ladebordstein</strong> (im internationalen Sprachgebrauch auch <em>Curb Charger</em> oder <strong>Bordsteinlader</strong> genannt) ist eine baulich integrierte Ladeeinrichtung für Elektrofahrzeuge, bei der Steckdose, Steuerung und Abrechnungselektronik direkt in die Bordsteinkante des Gehwegs eingelassen sind.
          </p>
          <p>
            In dicht besiedelten Innenstädten und Wohnquartieren verfügen viele Fahrzeughalter weder über eine Garage noch über einen privaten Stellplatz mit eigener Wallbox. Wer am Straßenrand parkt (sogenannte Laternenparker), ist auf das Laden im öffentlichen Straßenraum angewiesen. Freistehende AC-Ladesäulen beanspruchen jedoch oberirdische Gehwegfläche. Insbesondere auf schmalen Bürgersteigen kann dies zu Nutzungskonflikten mit Fußgängern, Kinderwagen und Personen im Rollstuhl führen.
          </p>
          <p>
            Das Konzept <strong>Bordsteinladen</strong> verlegt die Schnittstelle an den Fahrbahnrand: Statt einer vertikalen Säule wird der baulich ohnehin notwendige Randstein als Träger genutzt. Der Gehweg bleibt in seiner lichten Durchgangsbreite frei von zusätzlichen Masten oder Gehäusen.
          </p>

          {/* B. Funktionsweise */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            2. Funktionsweise: Wie ist ein Bordsteinlader aufgebaut?
          </h2>
          <p>
            Ladebordsteinsysteme basieren auf modularen Komponenten, die in die Straßen- und Tiefbauinfrastruktur eingepasst werden:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>
              <strong>Bordstein-Grundkörper:</strong> Ein statischer Hohlkörper (je nach System aus Beton oder Gusseisen), der an gängige Bordsteinprofile (wie DIN-Bordsteine T15/25) angepasst ist und in die bestehende Bordsteinflucht gesetzt wird.
            </li>
            <li>
              <strong>Elektronikmodul:</strong> Das austauschbare Kernmodul beinhaltet Steuerungselektronik, Schutzschalttechnik, Kommunikationsschnittstellen und die Messeinrichtung zur eichrechtskonformen Abrechnung.
            </li>
            <li>
              <strong>Kabel- und Netzanbindung:</strong> Zuleitungen werden im Gehwegbereich verlegt und an einen lokalen Niederspannungsverteiler oder eine Zähleranschlusssäule (ZAS) angebunden.
            </li>
            <li>
              <strong>Schutz- und Dichtungskonzept:</strong> Da die Rinnsteinzone am Straßenrand durch Schmutz, stehendes Niederschlagswasser, Streusalz und mechanische Belastungen beansprucht wird, kapseln Hersteller die sensible Elektronik hermetisch ab (beim Rheinmetall-System IP68 für das Elektronikmodul, IP54 für das Gesamtsystem). Klappen- und Dichtsysteme sowie Heizelemente schützen vor eindringendem Schmutz und Frost.
            </li>
            <li>
              <strong>Wartungskonzept (Modultausch):</strong> Um Tiefbauaufwand im Servicefall zu vermeiden, setzen modulare Konzepte wie das „CurbSwap“-Prinzip auf entriegelbare Elektronikeinheiten, die bei Wartungsarbeiten oder Eichfristen ohne Straßenaufbruch ausgetauscht werden können.
            </li>
          </ul>

          <div className="p-5 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] text-sm text-[#171917] my-6 not-prose">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#2F5E73] shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold text-[#171917] mb-1">
                  Mechanische Belastbarkeit &amp; Herstellerangaben
                </strong>
                <p className="text-[#6C716B] leading-relaxed">
                  Ladebordsteine müssen mechanischen Einwirkungen im Straßenraum standhalten. Für das marktführend erprobte System von Rheinmetall gibt der Hersteller eine Auslegung für Rad- bzw. Achslasten von bis zu <strong>10 Tonnen</strong> sowie eine Stoßfestigkeit nach Schutzklasse <strong>IK10</strong> an. Diese Werte beziehen sich auf das geprüfte Herstellermodell und dürfen nicht ungeprüft auf beliebige Bordsteinlösungen verallgemeinert werden.
                </p>
              </div>
            </div>
          </div>

          {/* C. Ladeleistung */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            3. Ladeleistung: Wie schnell lädt ein E-Auto am Ladebordstein?
          </h2>
          <p>
            Ladebordsteine sind für das <strong>AC-Normalladen (Wechselstrom)</strong> nach DIN EN 61851-1 ausgelegt. Herstellerseitig wird in der Regel eine Anschlussleistung von <strong>bis zu 22 kW</strong> (dreiphasig 400 V bei 32 A) bzw. 11 kW (16 A) spezifiziert.
          </p>
          <p>
            Die tatsächliche Ladegeschwindigkeit in der Praxis wird durch mehrere Faktoren limitiert:
          </p>
          <ol className="list-decimal pl-6 space-y-2 text-base">
            <li>
              <strong>Fahrzeugseitiger Onboard-Charger:</strong> Die Mehrheit der in Deutschland zugelassenen Elektro-Pkw verfügt über einen bordeigenen AC-Lader mit maximal <strong>11 kW</strong> Ladeleistung. An einem 22-kW-Ladepunkt lädt ein solches Fahrzeug physikalisch bedingt dennoch nur mit maximal 11 kW. Volle 22 kW AC nutzen nur ausgewählte Fahrzeugmodelle (z. B. Renault Zoe oder Fahrzeuge mit optionalem 22-kW-Doppellader).
            </li>
            <li>
              <strong>Netzanschluss &amp; dynamisches Lastmanagement:</strong> Werden mehrere Ladepunkte entlang einer Straße errichtet, begrenzt der Verteilnetzbetreiber die gleichzeitige Leistungsaufnahme. Ein intelligentes Lastmanagement drosselt den Ladestrom bei hoher Netzlast temporär ab.
            </li>
            <li>
              <strong>Nutzungsverhalten:</strong> Bordsteinlader sind primär für Standzeiten über Nacht (6 bis 10 Stunden) oder während der Arbeitszeit konzipiert, sodass auch mit 11 kW eine vollständige Ladung typischer Batteriegrößen problemlos erreicht wird.
            </li>
          </ol>

          {/* Modellrechnung Box */}
          <div className="p-5 rounded-2xl bg-white border border-[#DFE3DC] shadow-xs my-6 not-prose">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6C716B] font-bold block mb-2">
              Modellrechnung: Beispielhafte Ladedauern am Ladebordstein *
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
                    <td className="py-2.5 font-bold">Kompaktklasse (ca. 50 kWh)</td>
                    <td>11 kW AC</td>
                    <td>ca. 10,2 kW netto</td>
                    <td>ca. 3,0 Stunden</td>
                    <td>ca. 180 – 210 km</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Mittelklasse (ca. 77 kWh)</td>
                    <td>11 kW AC</td>
                    <td>ca. 10,2 kW netto</td>
                    <td>ca. 4,5 Stunden</td>
                    <td>ca. 240 – 290 km</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Modell mit 22-kW-Lader (ca. 60 kWh)</td>
                    <td>22 kW AC</td>
                    <td>ca. 20,4 kW netto</td>
                    <td>ca. 1,8 Stunden</td>
                    <td>ca. 200 – 240 km</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-[#6C716B] mt-3 font-mono">
              * Modellrechnung unter Annahme von ca. 8 % durchschnittlichen AC-Wandlungsverlusten im Fahrzeug-Gleichrichter. Die tatsächliche Ladedauer hängt vom individuellen Fahrzeugmodell, der Batterietemperatur sowie etwaigen Drosselungen durch das kommunale Lastmanagement ab.
            </p>
          </div>

          {/* D. Rheinmetall-Ladebordstein */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            4. Der Rheinmetall-Ladebordstein: Herstellerdaten und Erprobung
          </h2>
          <p>
            Der Technologiekonzern Rheinmetall (über seinen zivilen Bereich Power Systems / Pierburg) treibt die Entwicklung integrierter Bordsteinlösungen voran. Das System wurde in Kooperation mit Betonherstellern und Energieversorgern entwickelt, um herkömmliche Ladesäulen im Straßenraum zu ersetzen.
          </p>
          
          <h3 className="text-lg font-bold text-[#171917] mt-6 mb-2">
            Technische Kenndaten laut Herstellerdokumentation:
          </h3>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>
              <strong>Abmessungen:</strong> Standard-Bordsteinelement mit ca. 1.000 mm Länge, 250 mm Höhe und 120/150 mm Breite – angelehnt an gängige Bordsteinmaße (z. B. T15/25).
            </li>
            <li>
              <strong>Materialien:</strong> Bordstein-Grundkörper aus Beton oder Gusseisen; gekapseltes Elektronikmodul aus Aluminium und Edelstahl.
            </li>
            <li>
              <strong>Ladeleistung:</strong> Bis zu 22 kW AC (dreiphasig 400 V, 32 A, 50 Hz, Mode 3 nach IEC 61851-1).
            </li>
            <li>
              <strong>Schutzart:</strong> IP68 für das gekapselte Elektronikmodul; IP54 für das Gesamtsystem im geschlossenen Zustand; Stoßfestigkeitsgrad IK10.
            </li>
            <li>
              <strong>Klimabereich:</strong> Ausgelegt für −25 °C bis +60 °C; integriertes Heizkonzept gegen Vereisung der mechanischen Klappe.
            </li>
            <li>
              <strong>Kommunikation &amp; Backend:</strong> OCPP 1.6J (vorbereitet für OCPP 2.0.1), integriertes 4G-Mobilfunkmodem, Ethernet-Option, Freigabe via RFID, App oder QR-Code.
            </li>
          </ul>

          <h3 className="text-lg font-bold text-[#171917] mt-6 mb-2">
            Dokumentiertes Pilotprojekt in Köln (Herbert-Lewin-Straße):
          </h3>
          <p>
            Im April 2024 startete die Stadt Köln in Kooperation mit Rheinmetall und dem regionalen Betreiber <em>TankE GmbH</em> (Tochter der RheinEnergie AG) einen Praxistest in Köln-Lindenthal (u. a. an der Herbert-Lewin-Straße).
          </p>
          <p>
            Nach Abschluss der einjährigen Pilotphase zogen die Projektpartner eine offizielle Bilanz: Über <strong>2.800 Ladevorgänge</strong> wurden dokumentiert, rund <strong>50 Megawattstunden</strong> elektrische Energie abgegeben und eine technische Systemverfügbarkeit von über <strong>99 Prozent</strong> verzeichnet. Im Sommer 2025 wurden im Testfeld optimierte Grauguss-Körper sowie modulare Kabelschutzelemente erprobt. Die installierten Ladepunkte wurden nach Abschluss des wissenschaftlichen Feldversuchs in den regulären Betrieb übernommen.
          </p>

          {/* E. Kosten */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            5. Kostenstruktur: Investitionsfaktoren und Wirtschaftlichkeit
          </h2>
          <p>
            Die Gesamtkosten für Ladebordsteine lassen sich nicht auf einen pauschalen Einheitspreis reduzieren, da bauliche und netztechnische Voraussetzungen je nach Straßenzug stark variieren. Eine fundierte Wirtschaftlichkeitsbetrachtung unterscheidet zwischen fünf Kostenkomponenten:
          </p>
          <div className="space-y-4 not-prose my-6">
            <div className="p-4 bg-white rounded-xl border border-[#DFE3DC]">
              <strong className="block text-sm font-bold text-[#171917] mb-1">
                1. Hardware-Kosten:
              </strong>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Hersteller beziffern die Hardwarekosten für serienreife Bordsteinlader im unteren bis mittleren vierstelligen Euro-Bereich je Ladepunkt (in Fachmedien werden Richtwerte um ca. 4.000 bis 6.000 € genannt, abhängig von Stückzahl, Gehäusematerial und Ausstattung). Die Kosten liegen damit in einer ähnlichen Größenordnung wie hochwertige, eichrechtskonforme AC-Ladesäulen.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#DFE3DC]">
              <strong className="block text-sm font-bold text-[#171917] mb-1">
                2. Tiefbau und Bürgersteig-Installation:
              </strong>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Der Tiefbauaufwand hängt maßgeblich davon ab, ob Ladebordsteine im Zuge einer ohnehin geplanten Straßensanierung oder nachträglich im Bestand eingesetzt werden. Bei vorbereiteten Maßnahmen entfällt das Gießen massiver Säulenfundamente; stattdessen werden Kabeltrassen direkt im Rinnen- bzw. Gehwegbereich verlegt.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#DFE3DC]">
              <strong className="block text-sm font-bold text-[#171917] mb-1">
                3. Bündelungsvorteil durch Leergehäuse („Dummy-Bordsteine“):
              </strong>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Ein wesentlicher Hebel für Kommunen ist das modulare Ausbaukonzept: Bei Straßenbauarbeiten können Leerrohre zusammen mit günstigen Leergehäusen („Dummy-Bordsteine“ ohne Elektronik) durchgehend verlegt werden. Die teureren Elektronikmodule werden erst dann per Schnellkupplung eingesetzt, wenn die Nachfrage im Quartier steigt.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#DFE3DC]">
              <strong className="block text-sm font-bold text-[#171917] mb-1">
                4. Netzanschluss &amp; Verteilnetz-Kosten:
              </strong>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Die Anschlusskosten an das Niederspannungsnetz des zuständigen Verteilnetzbetreibers richten sich nach Entfernung zur nächsten Zähleranschlusssäule (ZAS) und verfügbarer Transformatorleistung. Ein intelligentes Lastmanagement begrenzt Lastspitzen und reduziert teure Netzausbauten.
              </p>
            </div>
            <div className="p-4 bg-white rounded-xl border border-[#DFE3DC]">
              <strong className="block text-sm font-bold text-[#171917] mb-1">
                5. Ladetarife für Nutzer:
              </strong>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Endkunden zahlen nicht an den Bordsteinhersteller, sondern nach dem Tarif des betreibenden Stadtwerks bzw. ihres Mobilitätsdienstleisters (MSP). Die Kilowattstundenpreise entsprechen den üblichen Konditionen für öffentliches AC-Laden im jeweiligen Stadtgebiet.
              </p>
            </div>
          </div>

          {/* F. Vergleich der Ladekonzepte */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            6. Vergleich der AC-Ladekonzepte im Straßenraum
          </h2>
          <p>
            Für das Laden am Straßenrand konkurrieren im urbanen Raum drei technische Bauformen:
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
                    <td className="text-emerald-700 font-semibold">Kein Gehäuse auf Gehwegfläche</td>
                    <td className="text-amber-800">Gehäuse beansprucht Gehweg (0,2–0,5 m²)</td>
                    <td className="text-emerald-700 font-semibold">Bestehender Lichtmast genutzt</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Lichte Gehwegbreite</td>
                    <td className="text-emerald-700 font-semibold">Vollständig erhalten</td>
                    <td className="text-amber-800">Verengung auf schmalen Bürgersteigen</td>
                    <td className="text-emerald-700 font-semibold">Keine zusätzliche Einengung</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Maximale AC-Ladeleistung</td>
                    <td className="font-bold">bis zu 22 kW (dreiphasig)</td>
                    <td className="font-bold">bis zu 22 kW (dreiphasig)</td>
                    <td className="text-rose-700 font-bold">typisch 3,7 kW (einphasig)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Typische Ladedauer (20–80 %)</td>
                    <td>ca. 3,5 – 4,5 h (bei 11 kW)</td>
                    <td>ca. 3,5 – 4,5 h (bei 11 kW)</td>
                    <td className="text-rose-700">ca. 10 – 14 h (bei 3,7 kW)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Tiefbauaufwand</td>
                    <td>Mittel (Bordsteinschlitze / Trassen)</td>
                    <td>Hoch (Fundament &amp; Zuleitungen)</td>
                    <td className="text-emerald-700 font-semibold">Gering (sofern Mastnetz tragfähig)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Exposition gegenüber Schmutz &amp; Nässe</td>
                    <td>Hoch (Boden-/Rinnsteinnähe, IP68 nötig)</td>
                    <td>Gering (Gehäuse erhöht montiert)</td>
                    <td>Gering (Montagehöhe am Mast)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold">Wartungszugang</td>
                    <td>Modular via Schnellkupplung</td>
                    <td>Revisionsklappe an Säule</td>
                    <td>Wartung am Lichtmast</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* G. Vor- und Nachteile & Barrierefreiheit */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            7. Barrierefreiheit, Chancen und planerische Herausforderungen
          </h2>
          <p>
            In der verkehrsplanerischen Diskussion wird der Ladebordstein häufig im Zusammenhang mit <strong>Barrierefreiheit im Straßenraum</strong> (DIN 18040-3) diskutiert. Hierbei ist eine sachliche Differenzierung erforderlich:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>
              <strong>Erhalt der lichten Gehwegbreite:</strong> Der wesentliche Vorteil besteht darin, dass keine zusätzlichen Barrieren auf Gehwegen aufgestellt werden. Fußgänger, Menschen mit Sehbehinderung, Rollstuhlnutzer und Personen mit Kinderwagen behalten die volle Durchgangsbreite.
            </li>
            <li>
              <strong>Bodennahe Bedienung:</strong> Die Steckdose und Entriegelung befinden sich in Bordsteinhöhe. Während eine aufrecht stehende Ladesäule Bedienelemente in genormter Greifhöhe (85 bis 105 cm nach DIN 18040-3) anbringen kann, erfordert der Ladebordstein ein Bücken bis an die Bordsteinkante. Dies kann für mobilitätseingeschränkte Personen eine Hürde darstellen.
            </li>
            <li>
              <strong>Kabelverlauf &amp; Stolperstellen:</strong> Wenn ein Fahrzeug geladen wird, verläuft das Ladekabel von der Bordsteinkante zum Fahrzeug. Je nach Parkposition und Ladeanschluss des Pkw kann das Kabel über den Gehweg oder die Parkbucht verlaufen, was umsichtige Verkehrsplanung erfordert.
            </li>
          </ul>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 not-prose my-6">
            <div className="p-5 bg-white rounded-2xl border border-emerald-200 space-y-2">
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider block">
                Vorteile &amp; Potenziale
              </span>
              <ul className="space-y-1.5 text-xs text-[#171917]">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Gehwege bleiben frei:</strong> Kein zusätzlicher Masten- oder Säulenwald auf schmalen Fußwegen.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Stadtbildschonend:</strong> Optisch unauffällige Einbindung in das Straßenbild denkmalgeschützter Quartiere.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Normalladeleistung:</strong> Dreiphasiges Laden mit 11 bis 22 kW deckt Tag- und Nachtbedarfe ab.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Vorbereitung bei Sanierungen:</strong> Dummy-Bordsteine ermöglichen stufenweisen Infrastrukturausbau.</span>
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
                  <span><strong>Exponierte Einbaulage:</strong> Schmutzwasser, Laub und Streusalz im Rinnenbereich verlangen dichte Kapselung.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Winterdienst &amp; Schneeräumung:</strong> Aufgeschobene Schneemengen an Bordsteinkanten können den Zugang erschweren.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Bodennahes Einstecken:</strong> Tiefe Handhabungshöhe erfordert Bücken beim Ein- und Ausstecken.</span>
                </li>
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Wirtschaftlichkeit bei Einzelnachrüstung:</strong> Isoliertes Nachrüsten ohne anstehenden Straßenbau mit hohen Tiefbaukosten verbunden.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* H. Reale Pilotprojekte & Praxis */}
          <h2 className="text-2xl font-bold text-[#171917] mt-8 mb-4">
            8. Kommunale Praxis und dokumentierte Erprobung
          </h2>
          <p>
            Der Einsatz von Ladebordsteinen befindet sich im Übergang von geförderten Pilotvorhaben in erste erweiterte Erprobungen im urbanen Raum:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>
              <strong>Köln (Stadt Köln &amp; TankE / RheinEnergie):</strong> Seit April 2024 erprobten die Projektpartner in Köln-Lindenthal (Herbert-Lewin-Straße) Rheinmetall-Ladebordsteine im öffentlichen Anwohnerparkraum. Mit über 2.800 Ladevorgängen und über 99 % Verfügbarkeit demonstrierte das Projekt die Funktionsfähigkeit unter realen Umweltbedingungen und ging nach Testabschluss in den regulären Dauerbetrieb über.
            </li>
            <li>
              <strong>Dortmund (Stadt Dortmund &amp; DEW21):</strong> In der Dortmunder Innenstadt (Betenstraße) wurden im Spätsommer 2025 Ladebordsteine im öffentlichen Verkehrsraum installiert, um platzsparende Ladeinfrastruktur in engen Straßenprofilen zu evaluieren.
            </li>
            <li>
              <strong>Vergleichsfeld Laternenladen (z. B. Berlin):</strong> Als alternatives Konzept für Laternenparker nutzt das Berliner Ladenetz (über 1.000 Punkte via ubitricity) bestehende Straßenlaternen. Während Laternenladen ohne zusätzlichen Tiefbau auskommt, limitiert der einphasige Anschluss (3,7 kW) die Nachladegeschwindigkeit gegenüber Ladebordsteinen (11–22 kW).
            </li>
          </ul>

          {/* Primärquellen & Dokumente */}
          <div className="p-5 rounded-2xl bg-white border border-[#DFE3DC] shadow-xs my-6 not-prose">
            <span className="text-xs font-mono uppercase tracking-wider text-[#2F5E73] font-bold block mb-3">
              Verifizierte Primärquellen &amp; Dokumentation
            </span>
            <ul className="space-y-2 text-xs text-[#171917]">
              <li className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 text-[#2F5E73] shrink-0 mt-0.5" />
                <div>
                  <strong>Rheinmetall AG:</strong> Offizielle Projektberichte und Pressemitteilungen zum Ladebordstein und zum Kölner Pilotprojekt.{' '}
                  <a
                    href="https://www.rheinmetall.com/de/media/stories/2024/ladebordstein-pilotprojekt-in-koeln-erfolgreich"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2F5E73] underline hover:text-[#171917]"
                  >
                    Projektbericht Köln auf rheinmetall.com
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 text-[#2F5E73] shrink-0 mt-0.5" />
                <div>
                  <strong>Stadt Köln / TankE GmbH:</strong> Dokumentation des Pilotbetriebs in Köln-Lindenthal (Herbert-Lewin-Straße) mit TankE GmbH.{' '}
                  <a
                    href="https://www.tanke.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#2F5E73] underline hover:text-[#171917]"
                  >
                    Offizielle Informationen des Betreibers TankE
                  </a>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <ExternalLink className="w-4 h-4 text-[#2F5E73] shrink-0 mt-0.5" />
                <div>
                  <strong>Technische Richtlinien &amp; Normen:</strong> DIN EN 61851-1 (Konduktive Ladesysteme), DIN EN 60529 (IP-Schutzarten), DIN EN 62262 (IK-Stoßfestigkeitsgrade), DIN 18040-3 (Barrierefreies Bauen im öffentlichen Verkehrsraum).
                </div>
              </li>
            </ul>
          </div>

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
          title="Ladebordstein: Funktion, Kosten &amp; Bordsteinlader"
          urlPath="/ratgeber/bordsteinladen"
        />

        {/* EEAT Badge */}
        <EEATBadge
          topic="Ladeinfrastruktur &amp; Bordsteinlader"
          source1Title="Herstellerdokumentation &amp; Technische Daten"
          source1Text="Technische Spezifikationen des Rheinmetall-Ladebordsteins (IP68/IP54, IK10, Mode 3 nach IEC 61851-1, DIN 18040-3 Barrierefreiheit, MessEG)."
          source2Title="Pilotprojektdaten &amp; Kommunalpraxis"
          source2Text="Dokumentierte Ergebnisse der Kölner Pilotstudie (Stadt Köln / TankE GmbH, 2.800 Ladevorgänge, >99 % Verfügbarkeit) sowie Praxiseinordnung im Vergleich zum Laternenladen."
          dateText="Stand: Redaktionell geprüft"
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

