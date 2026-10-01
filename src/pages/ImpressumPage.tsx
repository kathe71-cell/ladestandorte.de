import React from 'react';
import { ShieldCheck, Mail, Phone } from 'lucide-react';
import { SEO } from '../components/SEO';
import { AmazonPartnerSentence } from '@plattform/core';
import { PageHero } from '../components/PageHero';

export const ImpressumPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8">
      <SEO
        title="Impressum (§ 5 DDG) · ladestandorte.de"
        description="Impressum und Anbieterkennzeichnung gemäß § 5 Digitale-Dienste-Gesetz (DDG) für das Informationsportal ladestandorte.de."
        canonicalPath="/impressum"
      />

      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Impressum', isCurrent: true }
        ]}
        eyebrow="LEGAL · PFLICHTANGABEN"
        eyebrowVariant="slate"
        title="Impressum (§ 5 DDG)"
        description="Angaben gemäß § 5 Digitale-Dienste-Gesetz (DDG) und § 18 Abs. 2 Medienstaatsvertrag (MStV)."
      />

      {/* Betreiberdaten */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#DFE3DC] shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#6C716B] font-bold mb-2">
            Diensteanbieter &amp; Medieninhaber
          </h2>
          <p className="text-lg font-bold text-[#171917]">Jens Kathe</p>
          <p className="text-sm text-[#171917]">Hansastraße 6</p>
          <p className="text-sm text-[#171917]">34119 Kassel</p>
          <p className="text-sm text-[#171917]">Deutschland</p>
        </div>

        <div className="pt-4 border-t border-[#DFE3DC] space-y-2">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#6C716B] font-bold mb-2">
            Kontaktmöglichkeiten
          </h2>
          <div className="flex items-center gap-3 text-sm text-[#171917]">
            <Mail className="w-4 h-4 text-[#2F5E73] shrink-0" />
            <span>E-Mail: </span>
            <a href="mailto:jens@kathe.org" className="text-[#2F5E73] hover:underline font-bold">
              jens@kathe.org
            </a>
          </div>
          <div className="flex items-center gap-3 text-sm text-[#171917]">
            <Phone className="w-4 h-4 text-[#2F5E73] shrink-0" />
            <span>Telefon: </span>
            <a href="tel:+491786652623" className="text-[#2F5E73] hover:underline font-bold">
              +49 178 6652623
            </a>
          </div>
        </div>

        <div className="pt-4 border-t border-[#DFE3DC] space-y-2">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#6C716B] font-bold mb-2">
            Inhaltlich Verantwortlicher gemäß § 18 Abs. 2 MStV
          </h2>
          <p className="text-sm text-[#171917]">
            Jens Kathe, Hansastraße 6, 34119 Kassel, Deutschland
          </p>
        </div>

        <div className="pt-4 border-t border-[#DFE3DC] space-y-2">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#6C716B] font-bold mb-2">
            Unabhängigkeitshinweis &amp; Datenherkunft
          </h2>
          <p className="text-xs text-[#6C716B] leading-relaxed">
            ladestandorte.de ist ein redaktionell unabhängiges Verbraucher- und Datenportal – finanziert über gekennzeichnete Partnerlinks. Es besteht kein gesellschaftsrechtliches oder wirtschaftliches Abhängigkeitsverhältnis zur Bundesnetzagentur (BNetzA) oder den auf dieser Plattform aufgeführten Ladesäulenbetreibern (CPOs) und Mobilitätsanbietern (EMPs). Alle Angaben und Daten des Ladesäulenregisters beruhen auf amtlichen Open-Data-Veröffentlichungen der Bundesnetzagentur gemäß Creative Commons Namensnennung 4.0 International Lizenz (CC BY 4.0).
          </p>
        </div>

        <div className="pt-4 border-t border-[#DFE3DC] space-y-2">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#6C716B] font-bold mb-2">
            Amazon-Partnerprogramm
          </h2>
          <p className="text-xs text-[#6C716B] leading-relaxed">
            <AmazonPartnerSentence />
          </p>
        </div>

        <div className="pt-4 border-t border-[#DFE3DC] space-y-2">
          <h2 className="text-sm font-mono uppercase tracking-wider text-[#6C716B] font-bold mb-2">
            Verbraucherstreitbeilegung (§ 36 VSBG)
          </h2>
          <p className="text-xs text-[#6C716B] leading-relaxed">
            Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen (§ 36 Verbraucherstreitbeilegungsgesetz – VSBG).
          </p>
        </div>
      </div>

    </div>
  );
};

export default ImpressumPage;
