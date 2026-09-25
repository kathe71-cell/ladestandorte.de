import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, Clock, Calendar, ShieldCheck, Zap, BookOpen, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';

const getArticleSchema = (headline: string, description: string, slug: string) => ({
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
    }
  ]
});

export const RatgeberArticlePage: React.FC = () => {
  const { articleSlug } = useParams<{ articleSlug: string }>();

  if (articleSlug === 'ladekarten-dschungel') {
    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
        <SEO
          title="Ladekarten-Dschungel: Roaming-Preise & Grundgebühren"
          description="Welche Ladekarte lohnt sich für wen? CPO vs. EMP, Roaming-Preise, monatliche Grundgebühren und Spartipps für Autobahn & Stadt im Detail erklärt."
          canonicalPath="/ratgeber/ladekarten-dschungel"
          schema={getArticleSchema(
            "Ladekarten-Dschungel: Roaming-Preise, monatliche Grundgebühren & wer wirklich spart",
            "Welche Ladekarte lohnt sich für welches Fahrprofil? Detaillierte Analyse zu CPO-Roaming, Grundgebühren-Modellen und den günstigsten Kombinationen.",
            "ladekarten-dschungel"
          )}
        />
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link to="/ratgeber" className="hover:text-emerald-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Zurück zu allen Ratgebern</span>
          </Link>
        </div>

        <header className="space-y-4 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
            <span className="px-2.5 py-1 rounded bg-emerald-100 text-emerald-900 font-bold uppercase">Marktanalyse</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Stand: Redaktionell geprüft</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 7 Minuten Lesezeit</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            Ladekarten-Dschungel: Roaming-Preise, monatliche Grundgebühren &amp; wer wirklich spart
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-serif">
            Mit der rasanten Expansion von Schnellladeparks ist auch der Tarif- und Roaming-Markt komplexer geworden. Dieser Leitfaden entschlüsselt das Zusammenspiel von CPOs, EMPs und zeigt auf, welche Tarifkombination für Ihr individuelles Fahrprofil die günstigste ist.
          </p>
        </header>

        <div className="prose prose-slate max-w-none text-slate-800 text-base sm:text-lg leading-relaxed space-y-6">
          <h2 className="text-2xl font-bold text-slate-950 mt-8 mb-4">1. Die Trennung von CPO und EMP verstehen</h2>
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

          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-sm text-amber-950 my-6">
            <strong className="block font-bold mb-1 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Achtung vor intransparenten Roaming-Preisen
            </strong>
            Prüfen Sie vor jedem Ladevorgang in der App Ihres Ladekartenanbieters den tagesaktuellen Tarif für den ausgewählten Standort. An manchen Roaming-Stationen können Kilowattstundenpreise bis zu 0,89 €/kWh betragen, wenn keine Preisdeckelung vereinbart ist.
          </div>

          <h2 className="text-2xl font-bold text-slate-950 mt-8 mb-4">2. Die 3 Fahrerprofile: Welcher Tarif passt zu Ihnen?</h2>
          
          <div className="space-y-4 not-prose my-6">
            <div className="p-5 bg-white rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-950">Profil A: Der Heimlader (Gelegenheitsnutzer öffentlich)</h3>
              <p className="text-sm text-slate-600 mt-1">
                Lädt zu 90 % an der eigenen Wallbox für ca. 0,30–0,33 €/kWh. Öffentliche Ladesäulen werden nur 1- bis 2-mal monatlich auf Ausflügen genutzt.
              </p>
              <div className="mt-3 text-xs font-mono font-bold text-emerald-700">
                Empfehlung: MAINGAU Autostrom oder DKV Card (0,00 € Grundgebühr, kein Kostenrisiko).
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-950">Profil B: Der Laternenparker (Keine eigene Wallbox)</h3>
              <p className="text-sm text-slate-600 mt-1">
                Ist auf innerstädtische AC-Säulen und gelegentliche Schnelllader beim Wocheneinkauf angewiesen (Monatsbedarf: ca. 150–250 kWh).
              </p>
              <div className="mt-3 text-xs font-mono font-bold text-emerald-700">
                Empfehlung: Lokale Stadtwerke-Ladekarte für AC kombiniert mit EnBW mobility+ Tarif M für DC.
              </div>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-slate-200">
              <h3 className="text-lg font-bold text-slate-950">Profil C: Der Langstrecken-Pendler &amp; Vielfahrer</h3>
              <p className="text-sm text-slate-600 mt-1">
                Fährt über 25.000 km pro Jahr und lädt wöchentlich mehrfach an Autobahn-HPC-Stationen.
              </p>
              <div className="mt-3 text-xs font-mono font-bold text-emerald-700">
                Empfehlung: IONITY Passport Power (11,99 €/Mo.) oder EnBW mobility+ Tarif L mit rabattierten kWh-Preisen ab 0,39 €/kWh. Die monatliche Grundgebühr amortisiert sich bereits ab der zweiten Ladung.
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-950 mt-8 mb-4">3. Der Einfluss der AFIR-Verordnung (EU 2023/1804)</h2>
          <p>
            Seit April 2024 müssen alle neu errichteten Schnellladepunkte in der EU mit kontaktlosen Kartenterminals (NFC für Girocard und Kreditkarten) ausgerüstet sein. Dies bedeutet das Ende der zwingenden Ladekartenpflicht: Jeder Fahrer kann ohne Voranmeldung spontan via Ad-hoc-Zahlung laden. Allerdings liegen die Ad-hoc-Preise meist über den konditionierten Ladekarten-Tarifen.
          </p>
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
        <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
          <Link to="/ratgeber" className="hover:text-emerald-700 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Zurück zu allen Ratgebern</span>
          </Link>
        </div>

        <header className="space-y-4 border-b border-slate-200 pb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
            <span className="px-2.5 py-1 rounded bg-blue-100 text-blue-900 font-bold uppercase">Elektrotechnik</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Stand: Redaktionell geprüft</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 9 Minuten Lesezeit</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            AC vs. DC Ladeverluste im Praxis-Vergleich: Technische Wirkungsgrade &amp; Sparpotenziale
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-serif">
            Nicht jede Kilowattstunde, die der Stromzähler misst, kommt auch in den Batteriezellen an. In diesem Leitfaden analysieren wir die physikalischen Ursachen von Ladeverlusten beim AC- und DC-Laden anhand von ADAC-Messungen und Laborwerten.
          </p>
        </header>

        <div className="prose prose-slate max-w-none text-slate-800 text-base sm:text-lg leading-relaxed space-y-6">
          <h2 className="text-2xl font-bold text-slate-950 mt-8 mb-4">1. Physikalische Ursachen: Wo bleibt der Strom?</h2>
          <p>
            Beim Laden eines Elektrofahrzeugs treten Verluste an verschiedenen Stellen der Kette auf:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li><strong>Leitungswiderstände (Joulesche Wärme):</strong> Jeder stromdurchflossene Leiter besitzt einen Ohmschen Widerstand \( R \). Die Verlustleistung \( P_v = I^2 \cdot R \) steigt quadratisch mit der Stromstärke.</li>
            <li><strong>AC/DC-Gleichrichtung im Fahrzeug (Onboard-Charger):</strong> Beim Wechselstromladen (AC) muss der Strom im Fahrzeug durch Siliziumkarbid- (SiC) oder Galliumnitrid-Halbleiter in Gleichstrom (DC) gewandelt werden. Der Wirkungsgrad moderner Onboard-Charger liegt bei ca. 88 % bis 93 %.</li>
            <li><strong>Bordnetz-Grundverbrauch während des Ladens:</strong> Während des Ladevorgangs sind Steuergeräte, Batteriemanagement (BMS) und Kühlwasserpumpen aktiv. Dieser Standby-Verbrauch von 200 bis 400 Watt fällt bei langsamen Ladevorgängen (z.B. an der Schuko-Steckdose mit 2,3 kW) zeitlich extrem stark ins Gewicht.</li>
          </ul>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 not-prose my-6">
            <h3 className="text-sm font-mono uppercase tracking-wider text-slate-600 font-bold mb-3">
              Typische Verlustquoten nach Ladeart (Messwerte)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-mono block">SCHUKO (2,3 kW)</span>
                <span className="text-2xl font-black text-rose-600 font-mono">15 % – 22 %</span>
                <span className="text-[11px] text-slate-500 block mt-1">Sehr ineffizient durch lange Laufzeit</span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-mono block">WALLBOX (11 kW)</span>
                <span className="text-2xl font-black text-emerald-600 font-mono">6 % – 10 %</span>
                <span className="text-[11px] text-slate-500 block mt-1">Optimaler Bereich für Heimlader</span>
              </div>
              <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500 font-mono block">HPC DC (150–300 kW)</span>
                <span className="text-2xl font-black text-blue-600 font-mono">4 % – 8 %</span>
                <span className="text-[11px] text-slate-500 block mt-1">Wandlung erfolgt in der Säule</span>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-950 mt-8 mb-4">2. Warum 11 kW an der Wallbox das Optimum darstellt</h2>
          <p>
            Viele Besitzer fragen sich, ob sich die Anschaffung einer 22-kW-Wallbox lohnt. Aus Effizienzgründen ist für über 90 % der Fahrzeuge eine 11-kW-Wallbox die beste Wahl:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-base">
            <li>Fast alle gängigen Elektroautos (u. a. VW ID-Familie, Tesla Model 3/Y, Hyundai/Kia, BMW i4) besitzen ab Werk einen 11-kW-Onboard-Charger. An einer 22-kW-Säule laden sie dennoch mit maximal 11 kW.</li>
            <li>Bei 11 kW Ladeleistung (3 Phasen à 16 Ampere) arbeitet der fahrzeugeigene Inverter in seinem optimalen Wirkungsgradfenster, während die thermische Belastung von Hausanschluss und Kabel moderat bleibt.</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-950 mt-8 mb-4">3. Drei Praxis-Tipps zur Minimierung von Ladeverlusten</h2>
          <div className="space-y-3 not-prose my-6">
            <div className="flex items-start gap-3 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Niemals dauerhaft über Schuko-Steckdosen laden:</strong> Neben dem Sicherheitsrisiko von Überhitzungen zahlen Sie durch die 15–20 % Ladeverluste bei 5.000 kWh Jahresbedarf über 250 € zusätzlich an ungenutzter Abwärme.
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Direkt nach der Fahrt laden:</strong> Wenn die Batterie vom Fahren noch betriebswarm ist (20–30 °C), muss vor dem Laden keine Energie für die Batterieheizung aufgewendet werden.
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Ladekabel-Querschnitt beachten:</strong> Nutzen Sie für Typ-2-Ladevorgänge hochwertige Kabel mit mindestens 6 mm² Aderquerschnitt, um Spannungsabfälle über 5 bis 7 Meter Leitungslänge zu minimieren.
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
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <SEO
        title="Blockiergebühren an Ladesäulen vermeiden · Karenzzeiten & Tarife"
        description="Standzeitgebühren ab 240 Min. AC / 60 Min. DC vermeiden. Karenzzeiten, Kostenfallen, Nacht-Regelungen und Betreibervergleich verständlich aufbereitet."
        canonicalPath="/ratgeber/blockiergebuehren-vermeiden"
        schema={getArticleSchema(
          "Blockiergebühren an Ladesäulen vermeiden: Karenzzeiten, Kostenfallen ab 240 Min. & CPO-Übersicht",
          "Ab wann greift die Standzeitgebühr? Wir vergleichen Karenzzeiten (240 Min. AC vs. 60 Min. DC), Nacht-Regelungen und maximale Kostendeckel aller großen Betreiber.",
          "blockiergebuehren-vermeiden"
        )}
      />
      <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
        <Link to="/ratgeber" className="hover:text-emerald-700 flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Zurück zu allen Ratgebern</span>
        </Link>
      </div>

      <header className="space-y-4 border-b border-slate-200 pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-slate-500">
          <span className="px-2.5 py-1 rounded bg-amber-100 text-amber-900 font-bold uppercase">Verbraucherrecht</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Stand: Redaktionell geprüft</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 6 Minuten Lesezeit</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
          Blockiergebühren an Ladesäulen vermeiden: Karenzzeiten, Kostenfallen ab 240 Min. &amp; CPO-Übersicht
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed font-serif">
          Wer sein Elektroauto nach Abschluss des Ladevorgangs an der Säule stehen lässt, riskiert empfindliche Standzeitgebühren. Dieser Leitfaden klärt über Karenzzeiten, Minutenpreise und Nachtregelungen bei allen relevanten Betreibern auf.
        </p>
      </header>

      <div className="prose prose-slate max-w-none text-slate-800 text-base sm:text-lg leading-relaxed space-y-6">
        <h2 className="text-2xl font-bold text-slate-950 mt-8 mb-4">1. Was ist die Blockiergebühr und warum gibt es sie?</h2>
        <p>
          Die Blockiergebühr (offiziell Standzeitgebühr genannt) ist ein Zeittarif, der nach Überschreitung einer vertraglich vereinbarten Höchststandzeit (Karenzzeit) pro Minute berechnet wird. Ziel ist es, Ladesäulen als Umschlagplätze für Energie und nicht als Dauerparkplätze zu nutzen, damit andere Fahrer Zugang zur Ladeinfrastruktur erhalten.
        </p>

        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 not-prose my-6">
          <h3 className="text-sm font-mono uppercase tracking-wider text-slate-600 font-bold mb-3">
            Übersicht der Blockiergebühren bei führenden Anbietern
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400">
                  <th className="pb-2">ANBIETER</th>
                  <th className="pb-2">AC-KARENZZEIT</th>
                  <th className="pb-2">DC-KARENZZEIT</th>
                  <th className="pb-2">KOSTEN / MIN.</th>
                  <th className="pb-2">MAX. DECKEL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
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
    </article>
  );
};

export default RatgeberArticlePage;
