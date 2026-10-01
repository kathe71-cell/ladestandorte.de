import React, { useState } from 'react';
import { BookOpen, Search, ShieldCheck, Tag, Info, ArrowRight } from 'lucide-react';
import { GLOSSARY_DATA, GlossaryEntry } from '../data/glossary';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { PageHero } from '../components/PageHero';

export const GlossarPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');

  const categories = ['Alle', 'Stecker & Hardware', 'Normen & Gesetze', 'Abrechnung & Roaming', 'Elektrotechnik'];

  const filtered = GLOSSARY_DATA.filter((item) => {
    const matchesQuery = item.term.toLowerCase().includes(query.toLowerCase()) ||
                         item.shortDef.toLowerCase().includes(query.toLowerCase()) ||
                         item.fullExplanation.toLowerCase().includes(query.toLowerCase());
    const matchesCat = selectedCategory === 'Alle' || item.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

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
            "name": "Glossar",
            "item": "https://www.ladestandorte.de/glossar"
          }
        ]
      },
      {
        "@type": "DefinedTermSet",
        "name": "E-Mobilitäts- & Ladeinfrastruktur Glossar",
        "description": "Definitionen aller maßgeblichen Fachbegriffe der Ladeinfrastruktur wie CCS, Type 2, AFIR, CPO, EMP und Eichrecht.",
        "url": "https://www.ladestandorte.de/glossar"
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Glossar zur E-Mobilität & Ladeinfrastruktur · Fachbegriffe von A bis Z"
        description="Das umfassende Glossar zu Ladeinfrastruktur & E-Mobilität. CCS, Type 2, AFIR, Roaming, Eichrecht, CPO & EMP verständlich und sachlich erklärt."
        canonicalPath="/glossar"
        schema={schema}
      />
      
      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Glossar', isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#C7F000] text-[#171917] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#171917]"></span>
            <span>REFERENCE · TERMINOLOGIE &amp; NORMEN</span>
          </div>
        }
        title="E-Mobilitäts- & Ladeinfrastruktur Glossar"
        description="Von CCS Combo 2 über die AFIR-Verordnung bis zu Roaming und Eichrecht: Alle maßgeblichen Fachbegriffe, physikalischen Formeln und gesetzlichen Normen verständlich und rechtssicher erklärt."
      />

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#DFE3DC] shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-[#6C716B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Fachbegriff oder Norm suchen (z. B. CCS, AFIR, kW vs. kWh)..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#F7F7F2] border border-[#DFE3DC] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#171917] font-medium"
          />
        </div>

        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#C7F000] text-[#171917] border border-[#171917] shadow-xs'
                  : 'bg-[#F7F7F2] hover:bg-[#DFE3DC] text-[#171917] border border-[#DFE3DC]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Glossary Items List */}
      <div className="space-y-6">
        {filtered.map((entry) => (
          <div
            key={entry.slug}
            id={entry.slug}
            className="p-6 sm:p-8 bg-white rounded-3xl border border-[#DFE3DC] shadow-xs space-y-4 scroll-mt-24"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#DFE3DC] pb-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#F7F7F2] text-[#171917] border border-[#DFE3DC] uppercase">
                  {entry.category}
                </span>
                {entry.standardNorm && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#171917] text-[#C7F000]">
                    {entry.standardNorm}
                  </span>
                )}
              </div>
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#171917] tracking-tight">
                {entry.term}
              </h2>
              <p className="text-sm font-bold text-[#2F5E73] mt-1">
                {entry.shortDef}
              </p>
            </div>

            <p className="text-sm text-[#6C716B] leading-relaxed">
              {entry.fullExplanation}
            </p>

            {entry.practicalTip && (
              <div className="p-4 rounded-2xl bg-[#F7F7F2] border border-[#DFE3DC] text-xs text-[#171917] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#2F5E73] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#171917]">Praxis-Tipp für Fahrer:</strong> {entry.practicalTip}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Citation Box */}
      <CitationBox
        title="Fachglossar zur Ladeinfrastruktur und Elektromobilität in Deutschland"
        urlPath="/glossar"
      />

      {/* EEAT Badge */}
      <EEATBadge
        topic="Normen- &amp; Begriffslexikon"
        source1Title="Normative Fachgrundlagen"
        source1Text="Definitionen und Begriffsbestimmungen orientiert an DIN EN 62196, IEC 61851, EU-AFIR (2023/1804) und Ladesäulenverordnung (LSV)."
        source2Title="Redaktionelle Aufbereitung"
        source2Text="Allgemeinverständliche Erläuterungen und Praxistipps für Elektroautofahrer durch die Redaktion ladestandorte.de."
        dateText="Stand: Normenlexikon 2026"
      />

    </div>
  );
};

export default GlossarPage;
