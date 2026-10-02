import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import { MOTORWAYS_DATA } from '../data/motorways';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { PageHero } from '../components/PageHero';

export const MotorwaysIndexPage: React.FC = () => {
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
            "name": "Autobahnen",
            "item": "https://www.ladestandorte.de/autobahnen"
          }
        ]
      },
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Wie viele Schnellladepunkte gibt es an deutschen Autobahnen?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "An deutschen Bundesautobahnen gibt es laut BNetzA-Register (Stand 2026) über 1.000 öffentliche HPC-Schnellladepunkte an mehr als 250 Rastsätten. Die Leistung reicht von 50 kW bis zu 400 kW."
            }
          },
          {
            "@type": "Question",
            "name": "Welche Ladenetzwerke sind an Autobahnen verfügbar?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Hauptsächlich IONITY, EnBW mobility+, Tesla Supercharger, Aral pulse und Fastned. IONITY betreibt exklusiv HPC-Lader an Tank & Rast Standorten, EnBW setzt auf überdachte HyperNetz-Hubs mit bis zu 400 kW."
            }
          },
          {
            "@type": "Question",
            "name": "Muss ich zum Schnellladen an der Autobahn eine App haben?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Nein. Seit April 2024 (AFIR-Verordnung) müssen alle HPC-Ladesäulen über 50 kW kontaktlose Kartenzahlung anbieten. Eine Ladekarte ermöglicht aber oft günstigere Tarife."
            }
          }
        ]
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Ladesäulen Autobahn Deutschland: Schnellladeparks A1–A99 (2026)"
        description="Alle HPC-Schnellladeparks an Autobahnen A1–A99: 59 Strecken, über 1.000 Ladepunkte an Tank & Rast. Bis zu 400 kW – IONITY, EnBW, Tesla, Aral pulse. BNetzA Open Data."
        canonicalPath="/autobahnen"
        schema={schema}
      />
      
      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Autobahnen', isCurrent: true }
        ]}
        eyebrow="CORRIDOR DATA · AUTOBAHNEN"
        title="Schnellladen auf Bundesautobahnen (A1 bis A99)"
        description="Reisen ohne Reichweitenangst: Übersicht aller Raststätten, Autohöfe und High-Power-Charging-Parks (bis zu 400 kW) entlang des deutschen Autobahnnetzes."
      />

      {/* Grid of Motorways */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOTORWAYS_DATA.map((mw) => (
          <Link
            key={mw.slug}
            to={`/autobahnen/${mw.slug}`}
            className="group p-6 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs hover:border-[#2F5E73] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-9 rounded-xl bg-[#171917] text-[#C7F000] font-black font-mono flex items-center justify-center text-base shadow-xs">
                  {mw.name}
                </div>
                <span className="text-xs font-mono font-bold bg-[#171917] text-[#C7F000] border border-[#171917] px-2.5 py-1 rounded-lg">
                  {mw.maxKw ? `bis ${mw.maxKw} kW HPC` : 'Korridor'}
                </span>
              </div>

              <h2 className="text-lg font-bold text-[#171917] group-hover:text-[#2F5E73] transition-colors mb-2 line-clamp-2 leading-snug">
                {mw.route}
              </h2>

              <p className="text-xs text-[#6C716B] leading-relaxed line-clamp-2 mb-4">
                {mw.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#F7F7F2] p-2.5 rounded-xl border border-[#DFE3DC]">
                <div>
                  <span className="text-[#6C716B] block text-[10px]">STRECKENLÄNGE</span>
                  <strong className="text-[#171917]">{mw.lengthKm} km</strong>
                </div>
                <div>
                  <span className="text-[#6C716B] block text-[10px]">MAX. LEISTUNG</span>
                  <strong className="text-[#2F5E73]">{mw.maxKw ? `${mw.maxKw} kW HPC` : 'In Erhebung'}</strong>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-[#DFE3DC] flex items-center justify-between text-xs font-bold text-[#2F5E73]">
              <span>Ladekorridor analysieren</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Trust & E-E-A-T */}
      <EEATBadge topic="Bundesautobahnen Ladeinfrastruktur" />

    </div>
  );
};

export default MotorwaysIndexPage;
