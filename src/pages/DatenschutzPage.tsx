import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock } from 'lucide-react';
import { SEO } from '../components/SEO';

export const DatenschutzPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <SEO
        title="Datenschutzerklärung · DSGVO-konform · ladestandorte.de"
        description="Datenschutzerklärung nach DSGVO und TDDDG. Informationen über die Datenverarbeitung ohne Tracking-Cookies und ohne Drittstaaten-Transfer."
        canonicalPath="/datenschutz"
      />
      
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">
          Datenschutz nach DSGVO &amp; TDDDG
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
          Datenschutzerklärung
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Informationen über die Art, den Umfang und den Zweck der Verarbeitung personenbezogener Daten auf ladestandorte.de.
        </p>
      </header>

      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-700 leading-relaxed">
        
        <div>
          <h2 className="text-lg font-bold text-slate-950 mb-2">1. Verantwortlicher</h2>
          <p>
            Verantwortlich für die Datenverarbeitung auf dieser Website ist der Diensteanbieter. Vollständige Kontaktdaten entnehmen Sie bitte unserem <Link to="/impressum" className="text-emerald-700 font-bold underline">Impressum</Link>.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-950 mb-2">2. Grundsatz: Maximale Datensparsamkeit &amp; Zero-CDN</h2>
          <p>
            Wir nehmen den Schutz Ihrer Privatsphäre sehr ernst. Auf ladestandorte.de werden keinerlei externe Schriftarten von Drittanbieter-Servern (wie z. B. Google Fonts) nachgeladen. Alle Schriften stammen ausschließlich aus dem nativen Schriftarten-Stack Ihres eigenen Betriebssystems (System Fonts). Dadurch wird beim Seitenaufruf keine IP-Adresse an externe Font-Provider übertragen.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-950 mb-2">3. Vercel Web Analytics (Cookielose, DSGVO-konforme Reichweitenmessung)</h2>
          <p>
            Diese Website nutzt <strong>Vercel Web Analytics</strong>, einen Analysedienst der Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.
          </p>
          <p className="mt-2">
            Vercel Web Analytics arbeitet <strong>vollständig ohne Cookies</strong> und ohne Erstellung dauerhafter Nutzerprofile. Zur Erkennung eindeutiger Besucher generiert der Dienst einen temporären, einwegverschlüsselten Hash-Wert aus der IP-Adresse, dem User-Agent und der Domain. Die ursprüngliche IP-Adresse wird nicht gespeichert und lässt sich zu keinem Zeitpunkt rekonstruieren.
          </p>
          <p className="mt-2">
            Rechtsgrundlage ist unser berechtigtes Interesse an der technischen Optimierung und wirtschaftlichen Auswertung unseres Webangebots gemäß <strong>Art. 6 Abs. 1 lit. f DSGVO</strong>.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-950 mb-2">4. Werbefreie Informationsplattform ohne Werbetracking</h2>
          <p>
            ladestandorte.de wird als reines Informations- und Verbraucherportal betrieben. Es werden keine Werbenetzwerke, keine Affiliate-Partnerprogramme, keine Werbe-Cookies und keine Profiling-Dienste von Drittanbietern eingesetzt.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-950 mb-2">6. Ihre Rechte als betroffene Person</h2>
          <p>
            Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung (Art. 15 DSGVO), das Recht auf Berichtigung (Art. 16 DSGVO), Löschung (Art. 17 DSGVO) sowie Einschränkung der Verarbeitung (Art. 18 DSGVO). Wenden Sie sich hierzu an die im Impressum hinterlegte Adresse.
          </p>
        </div>

      </div>

    </div>
  );
};

export default DatenschutzPage;
