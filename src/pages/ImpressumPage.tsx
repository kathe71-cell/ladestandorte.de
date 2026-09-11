import React from 'react';
import { ShieldCheck, Mail, Phone, MapPin, AlertCircle } from 'lucide-react';
import { SEO } from '../components/SEO';

export const ImpressumPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <SEO
        title="Impressum (§ 5 DDG) · ladestandorte.de"
        description="Impressum und Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG) für das Informationsportal ladestandorte.de."
        canonicalPath="/impressum"
      />
      
      <header className="space-y-3 border-b border-slate-200 pb-6">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">
          Rechtliche Pflichtangaben
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight">
          Impressum (§ 5 DDG)
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 Medienstaatsvertrag (MStV).
        </p>
      </header>

      {/* Betreiberdaten – AUSSCHLIESSLICH hier auf /impressum */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div>
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
            Diensteanbieter &amp; Medieninhaber
          </h2>
          <p className="text-lg font-bold text-slate-950">Jens Kathe</p>
          <p className="text-sm text-slate-700">Hansastraße 6</p>
          <p className="text-sm text-slate-700">34119 Kassel</p>
          <p className="text-sm text-slate-700">Deutschland</p>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
            Kontaktmöglichkeiten
          </h2>
          <div className="flex items-center gap-3 text-sm text-slate-800">
            <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>E-Mail: </span>
            <a href="mailto:jens@kathe.org" className="text-emerald-700 hover:text-emerald-800 font-bold underline">
              jens@kathe.org
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-800">
            <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Telefon: </span>
            <a href="tel:+491786652623" className="text-emerald-700 hover:text-emerald-800 font-bold underline">
              +49 178 6652623
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
            Umsatzsteuer-Status
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Als Kleinunternehmer im Sinne von <strong>§ 19 Abs. 1 UStG</strong> wird keine Umsatzsteuer berechnet und ausgewiesen.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
            Inhaltlich Verantwortlicher gemäß § 18 Abs. 2 MStV
          </h2>
          <p className="text-sm text-slate-700">
            Jens Kathe, Hansastraße 6, 34119 Kassel, Deutschland
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
            Unabhängigkeitshinweis &amp; Datenherkunft
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            ladestandorte.de ist ein unabhängiges Verbraucher- und Datenportal. Es besteht kein gesellschaftsrechtliches oder wirtschaftliches Abhängigkeitsverhältnis zur Bundesnetzagentur (BNetzA) oder den auf dieser Plattform aufgeführten Ladesäulenbetreibern (CPOs) und Mobilitätsanbietern (EMPs). Alle Angaben und Daten des Ladesäulenregisters beruhen auf amtlichen Open-Data-Veröffentlichungen der Bundesnetzagentur gemäß Creative Commons Namensnennung 4.0 International Lizenz (CC BY 4.0).
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-2">
          <h2 className="text-sm font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
            Verbraucherstreitbeilegung
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="nofollow noopener noreferrer" className="text-emerald-700 underline">https://ec.europa.eu/consumers/odr</a>. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ImpressumPage;
