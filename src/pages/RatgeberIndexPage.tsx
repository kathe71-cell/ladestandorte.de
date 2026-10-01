import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Clock } from 'lucide-react';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { PageHero } from '../components/PageHero';

export const RatgeberIndexPage: React.FC = () => {
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
            "name": "Ratgeber",
            "item": "https://www.ladestandorte.de/ratgeber"
          }
        ]
      }
    ]
  };

  const articles = [
    {
      slug: 'ladekarten-dschungel',
      title: 'Ladekarten-Dschungel: Roaming-Preise, monatliche Grundgebühren & wer wirklich spart',
      category: 'Tarif-Analyse',
      readTime: '7 Min. Lesezeit',
      date: 'Redaktionell geprüft',
      excerpt: 'Welche Ladekarte lohnt sich für welches Fahrprofil? Detaillierte Analyse zu CPO-Roaming, Grundgebühren-Modellen und den günstigsten Kombinationen für Autobahn- und Stadtlader.'
    },
    {
      slug: 'ac-vs-dc-ladeverluste',
      title: 'AC vs. DC Ladeverluste im Praxis-Vergleich: Technische Wirkungsgrade & Sparpotenziale',
      category: 'Elektrotechnik & Physik',
      readTime: '9 Min. Lesezeit',
      date: 'Redaktionell geprüft',
      excerpt: 'Warum gehen beim Laden an der Steckdose bis zu 20 % der Energie verloren? Wie arbeitet der Onboard-Gleichrichter und warum ist DC-HPC-Laden im Sommer physikalisch effizienter?'
    },
    {
      slug: 'blockiergebuehren-vermeiden',
      title: 'Blockiergebühren an Ladesäulen vermeiden: Karenzzeiten, Kostenfallen ab 240 Min. & CPO-Vergleich',
      category: 'Verbraucherrecht & Praxis',
      readTime: '6 Min. Lesezeit',
      date: 'Redaktionell geprüft',
      excerpt: 'Ab wann greift die Standzeitgebühr? Wir vergleichen Karenzzeiten (240 Min. AC vs. 60 Min. DC), Nacht-Regelungen und maximale Kostendeckel aller großen Betreiber.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Ratgeber & Marktanalysen zur E-Mobilität · ladestandorte.de"
        description="Fundierte Fachbeiträge & Analysen zu Ladetarifen, Roaming, technischen Wirkungsgraden und rechtlichen Vorgaben im deutschen Ladesäulenmarkt."
        canonicalPath="/ratgeber"
        schema={schema}
      />
      
      <PageHero
        level={2}
        eyebrow={
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
            <BookOpen className="w-4 h-4" />
            <span>Wissen &amp; Verbraucherleitfäden</span>
          </div>
        }
        title="Ratgeber & Marktanalysen zur E-Mobilität"
        description="Fundierte Fachbeiträge der Redaktion ladestandorte.de zu Ladetarifen, technischen Wirkungsgraden und rechtlichen Vorgaben im deutschen Ladesäulenmarkt."
      />

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map((art) => (
          <article
            key={art.slug}
            className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-3">
                <span className="font-bold text-emerald-700 uppercase">{art.category}</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{art.readTime}</span>
                </span>
              </div>

              <h2 className="text-xl font-black text-slate-950 group-hover:text-emerald-700 transition-colors leading-snug mb-3">
                <Link to={`/ratgeber/${art.slug}`}>
                  {art.title}
                </Link>
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {art.excerpt}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Vollständigen Artikel lesen</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </article>
        ))}
      </div>

      {/* EEAT Badge */}
      <EEATBadge
        topic="Redaktionelle Leitfäden"
        source1Title="Fachliche Primärquellen"
        source1Text="Recherche und Auswertung einschlägiger Normen (DIN VDE), Bundesgesetze (LSV, GEIG, EnWG) und Veröffentlichungen der Bundesnetzagentur."
        source2Title="Redaktionelle Unabhängigkeit"
        source2Text="Unabhängige redaktionelle Ratgeberbeiträge ohne bezahlte Produktplatzierungen oder Herstellerkooperationen."
        dateText="Stand: Redaktionell geprüft 2026"
      />

    </div>
  );
};

export default RatgeberIndexPage;
