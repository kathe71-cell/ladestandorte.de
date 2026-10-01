import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Server } from 'lucide-react';
import { SEO } from '../components/SEO';
import { PrivacyAmazonSection } from '@plattform/core';
import { PageHero } from '../components/PageHero';

export const DatenschutzPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <SEO
        title="Datenschutzerklärung · DSGVO-konform · ladestandorte.de"
        description="Datenschutzerklärung nach DSGVO und TDDDG. Informationen über die Datenverarbeitung ohne Tracking-Cookies und ohne Drittstaaten-Transfer."
        canonicalPath="/datenschutz"
      />

      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Datenschutz', isCurrent: true }
        ]}
        eyebrow="LEGAL · DATENSCHUTZ (DSGVO)"
        eyebrowVariant="slate"
        title="Datenschutzerklärung"
        description="Informationen über die Art, den Umfang und den Zweck der Verarbeitung personenbezogener Daten auf ladestandorte.de."
      />

      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#DFE3DC] shadow-xs space-y-6 text-sm text-[#171917] leading-relaxed">

        <div>
          <h2 className="text-lg font-bold text-[#171917] mb-2">1. Verantwortlicher</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist der Diensteanbieter. Vollständige Kontaktdaten entnehmen Sie bitte unserem <Link to="/impressum" className="text-[#2F5E73] font-bold underline">Impressum</Link>.
          </p>
        </div>

        <div className="pt-4 border-t border-[#DFE3DC]">
          <h2 className="text-lg font-bold text-slate-950 mb-2">2. Webhosting &amp; Server-Logfiles (Vercel Inc.)</h2>
          <p>
            Diese Website wird gehostet bei <strong>Vercel Inc.</strong>, 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
          </p>
          <p className="mt-2">
            Beim Aufruf unserer Seiten verarbeitet der Webserver von Vercel technisch erforderliche Verbindungsdaten in sogenannten Server-Logfiles. Zu diesen Daten gehören die IP-Adresse des anfragenden Geräts, Datum und Uhrzeit des Zugriffs, die abgerufene Seite bzw. Ressource, HTTP-Statuscode, die übertragene Datenmenge sowie Informationen über den verwendeten Browser und das Betriebssystem (User-Agent).
          </p>
          <p className="mt-2">
            Die Erfassung und temporäre Speicherung dieser Daten erfolgt auf Grundlage von <strong>Art. 6 Abs. 1 lit. f DSGVO</strong> (unser berechtigtes Interesse an der sicheren Auslieferung, der Stabilität und der Abwehr von Cyber-Angriffen auf unsere Web-Infrastruktur). Die Daten werden gelöscht, sobald sie für den Zweck ihrer Erhebung nicht mehr erforderlich sind. Mit Vercel Inc. besteht eine datenschutzrechtliche Vereinbarung zur Auftragsverarbeitung (Data Processing Agreement – DPA) einschließlich der EU-Standardvertragsklauseln (SCCs).
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-950 mb-2">3. Keine externen Schriften-CDNs (Lokaler System-Font-Stack)</h2>
          <p>
            Zum Schutz Ihrer Privatsphäre und zur Vermeidung unnötiger Drittstaaten-Transfers bindet ladestandorte.de <strong>keine externen Schriftarten (wie Google Fonts oder Adobe Fonts)</strong> über externe Server ein. Es werden ausschließlich die auf Ihrem Betriebssystem lokal installierten Systemschriften (System Font Stack) verwendet. Beim Laden der Typografie werden daher zu keinem Zeitpunkt personenbezogene Daten an externe Schrift-Provider übertragen.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-950 mb-2">4. Vercel Web Analytics (Cookielose, datensparsame Reichweitenmessung)</h2>
          <p>
            Diese Website nutzt <strong>Vercel Web Analytics</strong> zur anonymisierten statistischen Auswertung der Nutzung unseres Webangebots.
          </p>
          <p className="mt-2">
            Vercel Web Analytics arbeitet <strong>vollständig ohne Cookies</strong> und ohne Erstellung persistenter Nutzerprofile. Zur Unterscheidung einzelner Besuche wird aus IP-Adresse, User-Agent und Domain ein flüchtiger, kryptografischer Einweg-Hash erzeugt. Die IP-Adresse selbst wird zu keinem Zeitpunkt unverschlüsselt dauerhaft gespeichert und kann nicht rekonstruiert werden. Rechtsgrundlage ist unser berechtigtes Interesse an der bedarfsgerechten Gestaltung und technischen Optimierung unseres Webangebots (Art. 6 Abs. 1 lit. f DSGVO).
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-950 mb-2">5. TLS-/SSL-Verschlüsselung</h2>
          <p>
            Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte eine durchgehende TLS-/HTTPS-Verschlüsselung mit aktuellen Sicherheitszertifikaten. Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
          </p>
        </div>

        {/* Amazon-Partnerprogramm Datenschutz */}
        <div className="pt-4 border-t border-slate-100">
          <PrivacyAmazonSection number="6." />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-950 mb-2">7. Ihre Rechte als betroffene Person</h2>
          <p>
            Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung (Art. 15 DSGVO), das Recht auf Berichtigung unrichtiger Daten (Art. 16 DSGVO), das Recht auf Löschung (Art. 17 DSGVO), das Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO) sowie das Recht auf Datenübertragbarkeit (Art. 20 DSGVO). Zudem steht Ihnen ein Beschwerderecht bei der zuständigen Datenschutz-Aufsichtsbehörde zu (Art. 77 DSGVO). Wenden Sie sich bei datenschutzrechtlichen Anfragen an die im Impressum hinterlegten Kontaktdaten.
          </p>
        </div>

      </div>

    </div>
  );
};

export default DatenschutzPage;
