import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight,
  ExternalLink,
  FileText,
  HelpCircle,
  Car,
  Info,
  ChevronDown,
  Scale,
  Euro,
  FileCheck,
  Shield,
  CheckSquare,
  Eye
} from 'lucide-react';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';
import { EEATBadge } from '../components/EEATBadge';
import { CitationBox } from '../components/CitationBox';
import { THG_CONFIG, THG_LEGAL_SOURCES, THG_FAQS } from '../data/thg';

export const ThgPraemiePage: React.FC = () => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Startseite',
            item: 'https://www.ladestandorte.de/'
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Ratgeber',
            item: 'https://www.ladestandorte.de/ratgeber'
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'THG-Prämie für Elektroautos',
            item: THG_CONFIG.canonicalUrl
          }
        ]
      },
      {
        '@type': 'Article',
        headline: 'THG-Prämie für Elektroautos: Antrag & Voraussetzungen',
        description: 'THG-Prämie für Elektroautos: Voraussetzungen, Antragsfristen und Auszahlung für 2026 und 2027 im Faktencheck. So funktioniert die Beantragung.',
        mainEntityOfPage: THG_CONFIG.canonicalUrl,
        inLanguage: 'de-DE',
        datePublished: '2026-10-13',
        dateModified: THG_CONFIG.editorialCheckDate,
        publisher: {
          '@type': 'Organization',
          name: 'ladestandorte.de',
          url: 'https://www.ladestandorte.de/'
        }
      },
      {
        '@type': 'FAQPage',
        mainEntity: THG_FAQS.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.a
          }
        }))
      }
    ]
  };

  const cfg2026 = THG_CONFIG.years[2026];
  const cfg2027 = THG_CONFIG.years[2027];
  const linkInfo = THG_CONFIG.affiliateLinks.info;
  const link2026 = THG_CONFIG.affiliateLinks.year2026;
  const link2027 = THG_CONFIG.affiliateLinks.year2027;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="THG-Prämie für Elektroautos: Antrag & Voraussetzungen | ladestandorte.de"
        description="THG-Prämie für Elektroautos: Voraussetzungen, Antragsfristen und Auszahlung für 2026 und 2027 im Faktencheck. So funktioniert die Beantragung."
        canonicalPath={THG_CONFIG.canonicalPath}
        schema={schema}
      />

      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Ratgeber', href: '/ratgeber' },
          { label: 'THG-Prämie', isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#C7F000] text-[#171917] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#171917]"></span>
            <span>RATGEBER · TREIBHAUSGASMINDERUNGSQUOTE</span>
          </div>
        }
        title="THG-Prämie für Elektroautos"
        description="Rechtliche Grundlagen, Antragsfristen für 2026 und Ausblick auf 2027 sachlich erklärt. Wie Fahrzeughalter ihre THG-Quote geltend machen und worauf bei der Beantragung zu achten ist."
      />

      {/* Redaktionelle Status-Box */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#DFE3DC] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#2F5E73] shrink-0 mt-0.5" />
          <div className="text-sm">
            <div className="font-bold text-[#171917]">
              Redaktioneller Prüfstand: {THG_CONFIG.lastVerified}
            </div>
            <p className="text-[#6C716B] mt-0.5">
              Anträge für das Quotenjahr 2026 können noch bis zur gesetzlichen UBA-Frist am 15. November 2026 eingereicht werden. Für das Quotenjahr 2027 liegen marktweit noch keine finalen Quotenpreise vor.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC] font-mono text-xs font-bold text-[#171917]">
            38. BImSchV konform
          </span>
        </div>
      </div>

      {/* Hauptteil: 2-Spalten-Layout (Inhalt + Sticky Nav / Infobox) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
        <div className="lg:col-span-8 space-y-10 text-[#171917] leading-relaxed">

          {/* 1. Was ist die THG-Quote? */}
          <section id="was-ist-die-thg-quote" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171917]">
              1. Was ist die THG-Prämie und was bedeutet THG-Quote?
            </h2>
            <p className="text-base sm:text-lg text-[#171917]">
              Die Abkürzung <strong>THG</strong> steht für <em>Treibhausgas</em>. Die <strong>THG-Quote</strong> (Treibhausgasminderungsquote) ist ein durch das Bundes-Immissionsschutzgesetz (<strong>§ 37a BImSchG</strong>) etabliertes Klimaschutzinstrument. Es verpflichtet Mineralölkonzerne, die fossile Kraftstoffe wie Benzin und Diesel in Deutschland vertreiben, die dabei entstehenden Treibhausgasemissionen schrittweise um einen gesetzlich festgeschriebenen Prozentsatz zu senken.
            </p>
            <p className="text-base text-[#171917]">
              Erreichen die Kraftstoffhersteller ihre Minderungsziele nicht aus eigener Kraft (z. B. durch das Beimischen von Biokraftstoffen), drohen empfindliche staatliche Strafzahlungen. Als Ausgleich dürfen die Konzerne CO2-Minderungen von Dritten zukaufen.
            </p>
            <div className="p-4 sm:p-5 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] text-sm text-[#171917] space-y-2">
              <strong className="text-[#2F5E73] font-bold block flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#2F5E73]" />
                Warum Elektroautohalter davon profitieren:
              </strong>
              <p>
                Reine Elektrofahrzeuge stoßen im Fahrbetrieb lokal keine Treibhausgase aus. Gemäß der <strong>38. BImSchV</strong> wird der Ladestrom von Elektrofahrzeugen pauschal als Beitrag zur CO2-Vermeidung im Straßenverkehr anerkannt. Fahrzeughalter können diese pauschale Strommenge zertifizieren lassen und als THG-Quote an die Mineralölwirtschaft verkaufen. Der Erlös aus diesem Handel ist die sogenannte <strong>THG-Prämie</strong>.
              </p>
            </div>
          </section>

          {/* 2. Voraussetzungen & Förderfähigkeit */}
          <section id="wer-ist-anspruchsberechtigt" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171917]">
              2. Wer ist anspruchsberechtigt und welche Fahrzeuge zählen?
            </h2>
            <p className="text-base text-[#171917]">
              Die gesetzlichen Kriterien für die Förderfähigkeit sind in der 38. BImSchV präzise definiert:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose">
              <div className="p-5 bg-white rounded-2xl border border-[#DFE3DC] space-y-2">
                <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Förderfähig (Berechtigt)</span>
                </div>
                <ul className="text-xs text-[#6C716B] space-y-1.5 list-disc pl-4">
                  <li><strong>Reine Batterie-Elektrofahrzeuge (BEV):</strong> Nur Autos mit reinem Elektroantrieb (Feld P.3: Elektro).</li>
                  <li><strong>Pkw (Klasse M1):</strong> Privat- und Firmenwagen.</li>
                  <li><strong>Nutzfahrzeuge (N1, N2, N3):</strong> E-Transporter und schwere E-Lkw.</li>
                  <li><strong>E-Busse (Klasse M3)</strong> sowie amtlich zugelassene E-Krafträder.</li>
                  <li><strong>Leasing- &amp; Finanzierungsfahrzeuge:</strong> Maßgeblich ist stets der eingetragene Halter.</li>
                </ul>
              </div>

              <div className="p-5 bg-white rounded-2xl border border-[#DFE3DC] space-y-2">
                <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Nicht förderfähig (Ausgeschlossen)</span>
                </div>
                <ul className="text-xs text-[#6C716B] space-y-1.5 list-disc pl-4">
                  <li><strong>Plug-in-Hybride (PHEV):</strong> Auch bei großer Batterie gesetzlich ausgeschlossen.</li>
                  <li><strong>Voll- &amp; Mild-Hybride:</strong> Fahrzeuge mit Verbrennungsmotor.</li>
                  <li><strong>Zulassungsfreie Fahrzeuge:</strong> E-Scooter, Pedelecs und zulassungsfreie Kleinkrafträder mit Versicherungskennzeichen.</li>
                  <li><strong>Fahrzeuge ohne deutsche Zulassung:</strong> Eine amtliche deutsche Zulassung ist Voraussetzung.</li>
                </ul>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#6C716B]">
              <strong className="text-[#171917]">Halter vs. Eigentümer:</strong> Anspruchsberechtigt ist ausschließlich die Person oder das Unternehmen, die bzw. das in der <strong>Zulassungsbescheinigung Teil I (Fahrzeugschein)</strong> als Halter eingetragen ist. Wem das Auto rechtlich gehört (z. B. der Leasingbank oder dem Fuhrparkmanagement), spielt für den THG-Antrag keine Rolle.
            </div>
          </section>

          {/* 3. Antragsjahre 2026 vs. 2027 im Faktencheck */}
          <section id="antragsjahre-vergleich" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171917]">
              3. Quotenjahre 2026 und 2027 im direkten Vergleich
            </h2>
            <p className="text-base text-[#171917]">
              Der THG-Anspruch entsteht jeweils für ein konkretes Kalenderjahr. Da Marktpreise und behördliche Fristen jahrgangsbezogen verwaltet werden, müssen 2026 und 2027 getrennt betrachtet werden:
            </p>

            {/* Vergleichstabelle */}
            <div className="overflow-x-auto not-prose rounded-2xl border border-[#DFE3DC] bg-white shadow-xs">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F7F7F2] border-b border-[#DFE3DC] text-xs font-mono uppercase text-[#6C716B]">
                    <th className="p-4 font-bold text-[#171917]">Kriterium</th>
                    <th className="p-4 font-bold text-[#2F5E73]">Quotenjahr 2026 (Aktiv)</th>
                    <th className="p-4 font-bold text-slate-700">Quotenjahr 2027 (Ausblick)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DFE3DC] text-xs sm:text-sm">
                  <tr>
                    <td className="p-4 font-semibold text-[#171917]">Status der Antragsannahme</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 font-bold text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        {cfg2026.statusLabel}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold text-xs">
                        <Clock className="w-3.5 h-3.5 text-amber-700" />
                        {cfg2027.statusLabel}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#171917]">Gesetzliche UBA-Meldefrist</td>
                    <td className="p-4 text-[#171917] font-medium">{cfg2026.deadlineGov}</td>
                    <td className="p-4 text-[#6C716B]">{cfg2027.deadlineGov}</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#171917]">Anbieter-Annahmeschluss</td>
                    <td className="p-4 text-[#171917] font-medium">Je nach Dienstleister ca. Ende Oktober bis Anfang November 2026 (zur fristgerechten Bündelung)</td>
                    <td className="p-4 text-[#6C716B]">Folgt mit Bekanntgabe der Referenzwerte für das Antragsjahr 2027</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#171917]">Pauschale Strommenge (Pkw M1)</td>
                    <td className="p-4 text-[#171917] font-mono font-bold">2.000 kWh (Bundesanzeiger)</td>
                    <td className="p-4 text-[#6C716B] font-mono">Wird im Bundesanzeiger bekannt gemacht</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-semibold text-[#171917]">Auszahlungsbeträge</td>
                    <td className="p-4 text-[#171917]">
                      Marktabhängig (beobachtete Angebote bis zu 350 € für Pkw)
                    </td>
                    <td className="p-4 text-[#6C716B]">
                      Noch offen (Markterlöse für 2027 stehen noch nicht fest)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-[#6C716B]">
              * Hinweis zu Fristen: Die gesetzliche Meldefrist gemäß § 8 der 38. BImSchV verpflichtet Dienstleister, gebündelte Quotenanträge bis spätestens 15. November des jeweiligen Kalenderjahres beim Umweltbundesamt einzureichen. Einzelne Vermittler setzen ihren internen Annahmeschluss bereits auf Ende Oktober oder Anfang November fest, um Unterlagen zu prüfen und fristgerecht zu übertragen. Wer sein Fahrzeug für 2026 nicht rechtzeitig einreicht, verliert den Anspruch für dieses Kalenderjahr.
            </p>
          </section>

          {/* 4. Was bedeutet THG-Quote verkaufen und wie funktioniert die Beantragung? */}
          <section id="beantragung-und-unterlagen" className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171917]">
                4. Was bedeutet „THG-Quote verkaufen“ und wie läuft die Beantragung ab?
              </h2>
              <p className="text-base text-[#171917] mt-2">
                Halter berechtigter reiner Elektrofahrzeuge können unter den gesetzlichen Voraussetzungen der 38. BImSchV die pauschalierte Strommenge ihres Fahrzeugs bescheinigen lassen. Diese Bescheinigung kann anschließend wirtschaftlich vermarktet werden.
              </p>
            </div>

            {/* Differenzierung: Zertifizierung vs. Vermarktung */}
            <div className="p-5 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] text-sm text-[#171917] space-y-3">
              <strong className="text-[#2F5E73] font-bold block flex items-center gap-2">
                <Scale className="w-4 h-4 text-[#2F5E73]" />
                Wichtig: Unterschied zwischen behördlicher Zertifizierung und wirtschaftlicher Auszahlung
              </strong>
              <p>
                Das <strong>Umweltbundesamt (UBA)</strong> zahlt selbst <em>keine</em> Prämie aus. Die Behörde prüft ausschließlich die amtliche Zulassung anhand der Fahrzeug-Identifizierungsnummer (FIN) und stellt bei Erfüllung der Voraussetzungen eine rechtsgültige Bescheinigung über die pauschale Strommenge aus.
              </p>
              <p>
                Um aus dieser Bescheinigung eine finanzielle Prämie zu erzielen, muss die Quote an quotenpflichtige Mineralölunternehmen verkauft werden. Fahrzeughalter können die Anrechnung der Strommenge grundsätzlich auch selbst beim Umweltbundesamt (UBA) beantragen. Da der bilaterale Quotenverkauf an Großkonzerne jedoch mit bürokratischem Aufwand und Vermarktungshürden verbunden ist, übernehmen <strong>spezialisierte THG-Dienstleister</strong> die organisatorische Bündelung und Vermarktung und zahlen dafür eine vertraglich vereinbarte Prämie aus.
              </p>
            </div>

            {/* Redaktionelle Box mit Partnerlink 1: Allgemeine Information */}
            <div className="p-5 rounded-2xl bg-white border border-[#DFE3DC] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#2F5E73] flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5" />
                  <span>EXTERNES INFORMATIONSANGEBOT · PARTNER-PORTAL</span>
                </span>
                <div className="text-sm font-bold text-[#171917]">
                  Ablauf des THG-Quotenverkaufs im Detail
                </div>
                <p className="text-xs text-[#6C716B]">
                  Detaillierte Erläuterungen zu Bündelung, Abwicklungsfristen und Registrierungsschritten bei unserem Partner thgverkauf.de.
                </p>
              </div>
              <a
                href={linkInfo.url}
                target="_blank"
                rel={linkInfo.rel}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F7F7F2] hover:bg-[#EAECE6] text-[#171917] border border-[#DFE3DC] font-bold text-xs shrink-0 transition-colors"
              >
                <span>{linkInfo.ctaText}</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#2F5E73]" />
              </a>
            </div>

            <h3 className="text-lg font-bold text-[#171917]">Benötigte Unterlagen:</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-3 not-prose">
              <li className="p-4 bg-white rounded-xl border border-[#DFE3DC] space-y-1">
                <FileCheck className="w-5 h-5 text-[#2F5E73]" />
                <strong className="block text-sm font-bold text-[#171917]">Fahrzeugschein</strong>
                <span className="text-xs text-[#6C716B] block">Vorder- und Rückseite der Zulassungsbescheinigung Teil I (gut lesbares Foto oder Scan).</span>
              </li>
              <li className="p-4 bg-white rounded-xl border border-[#DFE3DC] space-y-1">
                <Car className="w-5 h-5 text-[#2F5E73]" />
                <strong className="block text-sm font-bold text-[#171917]">Halterdaten</strong>
                <span className="text-xs text-[#6C716B] block">Vor- und Nachname bzw. Firmenname exakt wie im amtlichen Fahrzeugschein vermerkt.</span>
              </li>
              <li className="p-4 bg-white rounded-xl border border-[#DFE3DC] space-y-1">
                <Euro className="w-5 h-5 text-[#2F5E73]" />
                <strong className="block text-sm font-bold text-[#171917]">Bankverbindung</strong>
                <span className="text-xs text-[#6C716B] block">Gültige IBAN eines europäischen SEPA-Kontos für die Auszahlung.</span>
              </li>
            </ul>

            <h3 className="text-lg font-bold text-[#171917] mt-6">Der Antrags- und Vermarktungsprozess in 7 Schritten:</h3>
            <ol className="space-y-3 not-prose">
              <li className="p-4 bg-white rounded-xl border border-[#DFE3DC] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#171917] text-[#C7F000] font-mono font-bold text-xs flex items-center justify-center shrink-0">1</span>
                <div>
                  <strong className="text-sm font-bold text-[#171917] block">Grundsätzliche Berechtigung prüfen</strong>
                  <p className="text-xs text-[#6C716B] mt-0.5">Sicherstellen, dass es sich um ein reines Batterie-Elektrofahrzeug (BEV) handelt und Sie in Teil I als Halter eingetragen sind.</p>
                </div>
              </li>
              <li className="p-4 bg-white rounded-xl border border-[#DFE3DC] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#171917] text-[#C7F000] font-mono font-bold text-xs flex items-center justify-center shrink-0">2</span>
                <div>
                  <strong className="text-sm font-bold text-[#171917] block">Quotenjahr und Frist prüfen</strong>
                  <p className="text-xs text-[#6C716B] mt-0.5">Aktuell ist das Verpflichtungsjahr 2026 aktiv (UBA-Stichtag: 15.11.2026). Dienstleister schließen die Annahme häufig bereits Ende Oktober.</p>
                </div>
              </li>
              <li className="p-4 bg-white rounded-xl border border-[#DFE3DC] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#171917] text-[#C7F000] font-mono font-bold text-xs flex items-center justify-center shrink-0">3</span>
                <div>
                  <strong className="text-sm font-bold text-[#171917] block">Anbieter bzw. Abwicklungsweg auswählen</strong>
                  <p className="text-xs text-[#6C716B] mt-0.5">Entscheidung zwischen Festpreis-Garantie oder marktabhängiger Flex-Prämie sowie Prüfung von Vertragslaufzeit und Bedingungen.</p>
                </div>
              </li>
              <li className="p-4 bg-white rounded-xl border border-[#DFE3DC] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#171917] text-[#C7F000] font-mono font-bold text-xs flex items-center justify-center shrink-0">4</span>
                <div>
                  <strong className="text-sm font-bold text-[#171917] block">Registrierung beim Anbieter</strong>
                  <p className="text-xs text-[#6C716B] mt-0.5">Nutzerkonto beim gewählten Partner anlegen und Kontakt- sowie Auszahlungsdaten hinterlegen.</p>
                </div>
              </li>
              <li className="p-4 bg-white rounded-xl border border-[#DFE3DC] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#171917] text-[#C7F000] font-mono font-bold text-xs flex items-center justify-center shrink-0">5</span>
                <div>
                  <strong className="text-sm font-bold text-[#171917] block">Fahrzeugschein übermitteln &amp; Vorprüfung</strong>
                  <p className="text-xs text-[#6C716B] mt-0.5">Foto oder Scan der Zulassungsbescheinigung Teil I hochladen. Der Anbieter prüft Lesbarkeit und formale Gültigkeit.</p>
                </div>
              </li>
              <li className="p-4 bg-white rounded-xl border border-[#DFE3DC] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#171917] text-[#C7F000] font-mono font-bold text-xs flex items-center justify-center shrink-0">6</span>
                <div>
                  <strong className="text-sm font-bold text-[#171917] block">UBA-Prüfung &amp; Zertifizierung abwarten</strong>
                  <p className="text-xs text-[#6C716B] mt-0.5">Das Umweltbundesamt gleicht die Fahrgestellnummer (FIN) ab, schließt Doppeleinreichungen aus und erteilt das offizielle Zertifikat (Dauer meist mehrere Wochen).</p>
                </div>
              </li>
              <li className="p-4 bg-white rounded-xl border border-[#DFE3DC] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#171917] text-[#C7F000] font-mono font-bold text-xs flex items-center justify-center shrink-0">7</span>
                <div>
                  <strong className="text-sm font-bold text-[#171917] block">Vermarktung &amp; Auszahlung gemäß gewähltem Modell</strong>
                  <p className="text-xs text-[#6C716B] mt-0.5">Nach Veräußerung der Quote an quotenpflichtige Unternehmen überweist der Dienstleister den Erlös auf das hinterlegte Bankkonto.</p>
                </div>
              </li>
            </ol>
          </section>

          {/* 5. Sonderfälle */}
          <section id="sonderfaelle-fahrzeugwechsel" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171917]">
              5. Sonderfälle: Fahrzeugwechsel, Verkauf und unterjährige Zulassung
            </h2>
            <div className="space-y-3 text-base text-[#171917]">
              <p>
                <strong>Einmaligkeitsprinzip:</strong> Eine THG-Prämie kann für jedes Fahrzeug (eindeutig identifiziert über die Fahrzeug-Identifizierungsnummer FIN) im jeweiligen Kalenderjahr <strong>nur genau einmal</strong> beantragt werden.
              </p>
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                <strong className="block font-bold">Wichtig beim Kauf eines gebrauchten E-Autos:</strong>
                <p>
                  Erkundigen Sie sich beim Vorbesitzer oder Händler vor dem Kauf, ob die THG-Quote für das laufende Kalenderjahr bereits beantragt wurde. Hat der Vorbesitzer den Antrag bereits eingereicht, wird ein erneuter Antrag für dasselbe Kalenderjahr vom Umweltbundesamt ausnahmslos abgelehnt – auch wenn das Fahrzeug inzwischen auf Sie umgemeldet ist. Eine anteilige Aufteilung nach Monaten existiert gesetzlich nicht.
                </p>
              </div>
              <p>
                <strong>Verkauf im laufenden Jahr:</strong> Wenn Sie Ihr Fahrzeug im Laufe des Jahres verkaufen oder abmelden, bleibt Ihr Anspruch auf die THG-Prämie für das betreffende Jahr bestehen, sofern das Fahrzeug zum Zeitpunkt der Antragstellung auf Sie zugelassen war und der Antrag ordnungsgemäß eingereicht wurde.
              </p>
            </div>
          </section>

          {/* 6. Finanzen, Markt & Steuern */}
          <section id="finanzen-und-steuern" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171917]">
              6. Auszahlungshöhe, Marktschwankungen &amp; steuerliche Einordnung
            </h2>
            <p className="text-base text-[#171917]">
              Die THG-Prämie ist keine staatlich subventionierte Festprämie mit Garantieanspruch. Die Vergütung basiert auf den Preisen am freien Quotenmarkt:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-[#171917]">
              <li>
                <strong>Marktmechanismus:</strong> Wenn Mineralölkonzerne hohe Mengen an THG-Quoten nachfragen (z. B. durch gestiegene gesetzliche Minderungsquoten), steigen die Erlöse pro Tonne CO2. Bei hohem Angebot oder alternativen Erfüllungsoptionen sinkt der Preis.
              </li>
              <li>
                <strong>Vergütungsmodelle:</strong>
                <ul className="list-circle pl-6 mt-1 space-y-1 text-xs text-[#6C716B]">
                  <li><em>Fix-Prämie:</em> Der Dienstleister garantiert einen festen Euro-Betrag unabhängig vom späteren Verkaufspreis. Das Risiko fallender Quotenpreise trägt der Anbieter.</li>
                  <li><em>Flex-Prämie:</em> Der Halter erhält einen prozentualen Anteil (z. B. 80–90 %) des tatsächlichen Verkaufserlöses. Bei steigenden Quotenpreisen winkt mehr Ertrag, bei fallenden weniger.</li>
                </ul>
              </li>
              <li>
                <strong>Steuerliche Behandlung:</strong>
                <ul className="list-circle pl-6 mt-1 space-y-1 text-xs text-[#6C716B]">
                  <li><em>Privatvermögen:</em> Nach Abstimmung der obersten Finanzbehörden der Länder unterliegt die THG-Prämie bei Privatpersonen, die ihr E-Auto im Privatvermögen halten, in der Regel nicht der Einkommensteuer (keine sonstige Leistung nach § 22 Nr. 3 EStG).</li>
                  <li><em>Betriebsvermögen:</em> Bei Firmenwagen und gewerblich genutzten Fahrzeugen stellt die Auszahlung eine steuerpflichtige Betriebseinnahme dar.</li>
                </ul>
              </li>
            </ul>
          </section>

          {/* 7. Worauf bei Anbietern achten */}
          <section id="anbieter-auswahl" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171917]">
              7. Worauf sollte man bei der Anbieterwahl achten? (Verbraucher-Checkliste)
            </h2>
            <p className="text-sm text-[#171917]">
              Vor Abschluss eines Abtretungsvertrags sollten Fahrzeughalter das Kleingedruckte des Anbieters sorgfältig prüfen:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 not-prose">
              <div className="p-4 bg-white rounded-xl border border-[#DFE3DC] space-y-1.5">
                <div className="flex items-center gap-2 text-[#2F5E73] font-bold text-xs uppercase font-mono">
                  <CheckSquare className="w-4 h-4 text-[#2F5E73]" />
                  <span>1. Vergütungsmodell</span>
                </div>
                <strong className="text-sm font-bold text-[#171917] block">Garantie vs. Flex-Prämie</strong>
                <p className="text-xs text-[#6C716B]">Prüfen Sie, ob ein fester Mindestbetrag zugesichert wird oder ob das Erlösrisiko sinkender Quotenpreise vollständig beim Halter verbleibt.</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#DFE3DC] space-y-1.5">
                <div className="flex items-center gap-2 text-[#2F5E73] font-bold text-xs uppercase font-mono">
                  <CheckSquare className="w-4 h-4 text-[#2F5E73]" />
                  <span>2. Gebührentransparenz</span>
                </div>
                <strong className="text-sm font-bold text-[#171917] block">Einbehaltene Abzüge</strong>
                <p className="text-xs text-[#6C716B]">Achten Sie darauf, ob Provisionen, Bearbeitungsgebühren oder UBA-Zertifizierungskosten vom Auszahlungsbetrag abgezogen werden.</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#DFE3DC] space-y-1.5">
                <div className="flex items-center gap-2 text-[#2F5E73] font-bold text-xs uppercase font-mono">
                  <CheckSquare className="w-4 h-4 text-[#2F5E73]" />
                  <span>3. Auszahlungszeitpunkt</span>
                </div>
                <strong className="text-sm font-bold text-[#171917] block">Auszahlungsmodelle</strong>
                <p className="text-xs text-[#6C716B]">Einige Anbieter bieten Express-Auszahlungen in wenigen Tagen an (häufig mit Sicherheitsabschlag). Reguläre Modelle zahlen erst nach amtlicher UBA-Freigabe und Quotenvermarktung aus, was je nach behördlichem Prüfaufkommen variieren kann.</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#DFE3DC] space-y-1.5">
                <div className="flex items-center gap-2 text-[#2F5E73] font-bold text-xs uppercase font-mono">
                  <CheckSquare className="w-4 h-4 text-[#2F5E73]" />
                  <span>4. Vertragslaufzeit</span>
                </div>
                <strong className="text-sm font-bold text-[#171917] block">Keine automatische Bindung</strong>
                <p className="text-xs text-[#6C716B]">Vermeiden Sie Klauseln, die die Quote automatisch für Folgejahre übertragen. Verträge sollten auf das konkrete Kalenderjahr befristet sein.</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#DFE3DC] space-y-1.5">
                <div className="flex items-center gap-2 text-[#2F5E73] font-bold text-xs uppercase font-mono">
                  <CheckSquare className="w-4 h-4 text-[#2F5E73]" />
                  <span>5. Kündigungsrechte</span>
                </div>
                <strong className="text-sm font-bold text-[#171917] block">Fristen &amp; Widerruf</strong>
                <p className="text-xs text-[#6C716B]">Prüfen Sie gesetzliche Widerrufsfristen und klare Regelungen für den Fall eines Fahrzeugwechsels oder vorzeitigen Halterwechsels.</p>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#DFE3DC] space-y-1.5">
                <div className="flex items-center gap-2 text-[#2F5E73] font-bold text-xs uppercase font-mono">
                  <CheckSquare className="w-4 h-4 text-[#2F5E73]" />
                  <span>6. Datenschutz &amp; Dokumente</span>
                </div>
                <strong className="text-sm font-bold text-[#171917] block">Verarbeitung von Teil I</strong>
                <p className="text-xs text-[#6C716B]">Der Fahrzeugschein enthält sensible Halter- und Fahrgestelldaten. Seriöse Anbieter verarbeiten Dokumente DSGVO-konform auf EU-Servern.</p>
              </div>
            </div>
          </section>

          {/* 8. Diskreter Affiliate-Bereich */}
          <section id="beantragen" className="space-y-6 pt-6 border-t border-[#DFE3DC]">
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#DFE3DC] shadow-xs space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-mono font-bold text-[#171917] mb-2">
                  <span>PARTNER-ZUGANG</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-[#171917]">
                  THG-Prämie für dein Elektroauto beantragen
                </h3>
                <p className="text-sm text-[#6C716B] mt-1.5 leading-relaxed">
                  Halter berechtigter Elektrofahrzeuge können ihre THG-Quote über einen spezialisierten Dienstleister vermarkten lassen. Über unseren Partner kannst du die Voraussetzungen prüfen und die Beantragung online starten.
                </p>
              </div>

              {/* Status Karten für 2026 und 2027 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 2026: Aktiv */}
                <div className="p-5 rounded-2xl bg-[#F7F7F2] border-2 border-[#171917] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-[#171917]">QUOTENJAHR 2026</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                        Aktiv
                      </span>
                    </div>
                    <div className="text-base font-bold text-[#171917]">
                      Antrag für 2026 möglich
                    </div>
                    <p className="text-xs text-[#6C716B] mt-1">
                      Einreichung beim Umweltbundesamt bis 15.11.2026. Gültig für alle reinen E-Autos mit amtlicher Zulassung im Kalenderjahr 2026.
                    </p>
                  </div>

                  <a
                    href={link2026.url}
                    target="_blank"
                    rel={link2026.rel}
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-[#171917] hover:bg-[#2F5E73] text-[#C7F000] font-bold text-sm shadow-xs transition-colors"
                  >
                    <span>{link2026.ctaText}</span>
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>
                </div>

                {/* 2027: Vorschau mit Informationslink */}
                <div className="p-5 rounded-2xl bg-white border border-[#DFE3DC] space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-mono text-xs font-bold text-[#6C716B]">QUOTENJAHR 2027</span>
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        Vorschau
                      </span>
                    </div>
                    <div className="text-base font-bold text-[#171917]">
                      Beträge noch offen
                    </div>
                    <p className="text-xs text-[#6C716B] mt-1">
                      Verbindliche Quotenwerte und Anbieterangebote für 2027 stehen marktweit noch nicht fest. Eine Antragstellung ist noch nicht geöffnet.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <button
                      type="button"
                      disabled
                      className="inline-flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl bg-slate-100 text-slate-500 font-bold text-xs cursor-not-allowed border border-slate-200"
                    >
                      <span>Antrag 2027 noch nicht freigeschaltet</span>
                    </button>
                    <a
                      href={link2027.url}
                      target="_blank"
                      rel={link2027.rel}
                      className="inline-flex items-center justify-center gap-1.5 w-full text-[11px] text-[#2F5E73] hover:text-[#171917] font-semibold py-1 text-center transition-colors"
                    >
                      <span>{link2027.ctaText}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

              </div>

              {/* Rechtliche Werbekennzeichnung */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-[#6C716B] leading-relaxed">
                <strong className="text-[#171917] font-semibold block mb-0.5">
                  * Werbelink / Partnerlink:
                </strong>
                Einige Links auf dieser Seite führen zu einem externen Partner. Wenn Sie dort einen Antrag stellen oder einen Vertrag abschließen, kann ladestandorte.de eine Provision erhalten. ladestandorte.de ist ein unabhängiges Informationsportal und steht in keinem gesellschaftsrechtlichen Verhältnis zum Anbieter.
              </div>
            </div>
          </section>

          {/* 9. Häufig gestellte Fragen (FAQ) */}
          <section id="faq" className="space-y-6 pt-6 border-t border-[#DFE3DC]">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#171917]">
                Häufige Fragen zur THG-Prämie
              </h2>
              <p className="text-sm text-[#6C716B] mt-1">
                Alle wesentlichen Fragen zu Berechtigung, Fristen, Auszahlung und Fahrzeugwechsel auf einen Blick.
              </p>
            </div>

            <div className="space-y-3 not-prose">
              {THG_FAQS.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="p-5 bg-white rounded-2xl border border-[#DFE3DC] transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex items-center justify-between text-left gap-4 font-bold text-base text-[#171917] focus:outline-none"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-5 h-5 text-[#6C716B] transition-transform duration-200 shrink-0 ${
                          isOpen ? 'rotate-180 text-[#171917]' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-3 pt-3 border-t border-slate-100 text-sm text-[#171917] leading-relaxed">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* 10. Primärquellenverzeichnis */}
          <section id="quellen" className="space-y-4 pt-6 border-t border-[#DFE3DC]">
            <h3 className="text-lg font-bold text-[#171917]">
              Dokumentierte Primärquellen &amp; Gesetzesgrundlagen
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose">
              {THG_LEGAL_SOURCES.map((src, i) => (
                <div key={i} className="p-4 bg-white rounded-xl border border-[#DFE3DC] text-xs space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#2F5E73]">
                    <span>{src.type}</span>
                    <span>VERIFIZIERT</span>
                  </div>
                  <strong className="block text-sm text-[#171917] font-semibold">{src.title}</strong>
                  <p className="text-[#6C716B]">{src.citation}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 11. Zitation und EEAT */}
          <CitationBox
            title="THG-Prämie für Elektroautos: Antrag &amp; Voraussetzungen"
            urlPath={THG_CONFIG.canonicalPath}
            dateStr={THG_CONFIG.lastVerified}
          />

          <EEATBadge
            topic="Treibhausgasminderungsquote &amp; E-Mobilität"
            source1Title="38. BImSchV &amp; BImSchG"
            source1Text="Gesetzliche Verordnung zur Festlegung weiterer Bestimmungen zur Treibhausgasminderung bei Kraftstoffen."
            source2Title="Umweltbundesamt (UBA)"
            source2Text="Vollzugsbehörde für die Zertifizierung von Strommengen und amtliche Schätzwerte nach Bekanntmachung im Bundesanzeiger."
            dateText={`Stand: ${THG_CONFIG.lastVerified}`}
          />

        </div>

        {/* Rechte Spalte: Sidebar mit Inhaltsverzeichnis & Schnell-Check */}
        <div className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">

            {/* Inhaltsverzeichnis */}
            <div className="p-6 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs space-y-3">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6C716B] font-bold block">
                Inhaltsverzeichnis
              </span>
              <nav className="space-y-2 text-xs">
                <a href="#was-ist-die-thg-quote" className="block text-[#171917] hover:text-[#2F5E73] transition-colors">
                  1. Was ist die THG-Quote?
                </a>
                <a href="#wer-ist-anspruchsberechtigt" className="block text-[#171917] hover:text-[#2F5E73] transition-colors">
                  2. Voraussetzungen &amp; Fahrzeuge
                </a>
                <a href="#antragsjahre-vergleich" className="block text-[#171917] hover:text-[#2F5E73] transition-colors">
                  3. Quotenjahre 2026 vs. 2027
                </a>
                <a href="#beantragung-und-unterlagen" className="block text-[#171917] hover:text-[#2F5E73] transition-colors">
                  4. Ablauf &amp; Unterlagen
                </a>
                <a href="#sonderfaelle-fahrzeugwechsel" className="block text-[#171917] hover:text-[#2F5E73] transition-colors">
                  5. Sonderfälle &amp; Halterwechsel
                </a>
                <a href="#finanzen-und-steuern" className="block text-[#171917] hover:text-[#2F5E73] transition-colors">
                  6. Auszahlung &amp; Steuern
                </a>
                <a href="#anbieter-auswahl" className="block text-[#171917] hover:text-[#2F5E73] transition-colors">
                  7. Dienstleister-Auswahl
                </a>
                <a href="#beantragen" className="block font-bold text-[#2F5E73] hover:underline">
                  → Partner-Zugang 2026 *
                </a>
                <a href="#faq" className="block text-[#171917] hover:text-[#2F5E73] transition-colors">
                  8. Häufige Fragen (FAQ)
                </a>
              </nav>
            </div>

            {/* Quick-Facts Box */}
            <div className="p-6 bg-[#F7F7F2] rounded-2xl border border-[#DFE3DC] space-y-4 text-xs">
              <span className="font-mono uppercase tracking-wider text-[#171917] font-bold block">
                Fakten auf einen Blick
              </span>
              <div className="space-y-2.5">
                <div className="flex justify-between pb-2 border-b border-[#DFE3DC]">
                  <span className="text-[#6C716B]">Rechtsgrundlage:</span>
                  <span className="font-semibold text-[#171917]">§ 37a BImSchG</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#DFE3DC]">
                  <span className="text-[#6C716B]">Zuständige Behörde:</span>
                  <span className="font-semibold text-[#171917]">Umweltbundesamt</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#DFE3DC]">
                  <span className="text-[#6C716B]">Antragsfrist 2026:</span>
                  <span className="font-semibold text-[#171917]">15.11.2026 (UBA)</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#DFE3DC]">
                  <span className="text-[#6C716B]">Pkw-Strommenge:</span>
                  <span className="font-semibold text-[#171917]">2.000 kWh (M1)</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-[#DFE3DC]">
                  <span className="text-[#6C716B]">Plug-in-Hybride:</span>
                  <span className="font-semibold text-rose-700">Ausgeschlossen</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C716B]">Häufigkeit:</span>
                  <span className="font-semibold text-[#171917]">1x pro Kalenderjahr</span>
                </div>
              </div>
            </div>

            {/* Mini CTA Sidebar */}
            <div className="p-6 bg-white rounded-2xl border border-[#DFE3DC] space-y-3">
              <span className="text-xs font-mono font-bold text-[#2F5E73] block uppercase">
                Jetzt Prämie sichern
              </span>
              <p className="text-xs text-[#6C716B] leading-relaxed">
                Anträge für das Quotenjahr 2026 werden aktuell angenommen. Prüfe deinen Anspruch in wenigen Minuten.
              </p>
              <a
                href={link2026.url}
                target="_blank"
                rel={link2026.rel}
                className="inline-flex items-center justify-center gap-1.5 w-full px-3.5 py-2.5 rounded-xl bg-[#171917] hover:bg-[#2F5E73] text-[#C7F000] font-bold text-xs transition-colors"
              >
                <span>Zum THG-Partner 2026 *</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
              <span className="text-[10px] text-[#6C716B] block text-center">
                * Werbelink / Partnerlink
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ThgPraemiePage;
