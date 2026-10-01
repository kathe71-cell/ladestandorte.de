import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ArrowRight, TrendingUp } from 'lucide-react';
import { CITIES_DATA } from '../data/cities';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { PageHero } from '../components/PageHero';

export const CitiesIndexPage: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [selectedBundesland, setSelectedBundesland] = useState('Alle');

  const bundeslaender = ['Alle', ...Array.from(new Set(CITIES_DATA.map(c => c.bundesland))).sort()];

  const filteredCities = CITIES_DATA.filter(city => {
    const matchesQuery = city.name.toLowerCase().includes(filter.toLowerCase()) ||
                         city.plzs.some(p => p.includes(filter));
    const matchesLand = selectedBundesland === 'Alle' || city.bundesland === selectedBundesland;
    return matchesQuery && matchesLand;
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
            "name": "Großstädte",
            "item": "https://www.ladestandorte.de/staedte"
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "name": "Ladesäulen in deutschen Großstädten",
        "description": "Ladeinfrastruktur-Kennzahlen der 50 größten Städte Deutschlands basierend auf dem BNetzA-Ladesäulenregister.",
        "url": "https://www.ladestandorte.de/staedte"
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Ladesäulen in den 50 Großstädten Deutschlands · Übersicht"
        description="Übersicht aller Ladesäulen & Schnellladeparks in den 50 größten deutschen Städten. Ladepunktdichte, HPC-Quote & Betreiber laut BNetzA."
        canonicalPath="/staedte"
        schema={schema}
      />
      
      <PageHero
        level={2}
        eyebrow={
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
            <MapPin className="w-4 h-4" />
            <span>Kommunale Ladeinfrastruktur</span>
          </div>
        }
        title="Ladesäulen in den Top 50 Großstädten Deutschlands"
        description="Offizielle Daten des Ladesäulenregisters der Bundesnetzagentur (BNetzA). Vergleichen Sie Ladepunktdichte, High-Power-Charging-Quote (HPC) und führende Betreiber in allen 50 größten Städten."
      />

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Stadt oder PLZ filtern..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <select
          value={selectedBundesland}
          onChange={(e) => setSelectedBundesland(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {bundeslaender.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Grid of Cities */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCities.map((city) => (
          <Link
            key={city.slug}
            to={`/staedte/${city.slug}`}
            className="group p-5 bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="font-extrabold text-slate-950 group-hover:text-emerald-700 text-lg transition-colors">
                  {city.name}
                </span>
                <span className="text-xs font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                  {city.bundesland}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 mt-3">
                <div className="flex justify-between">
                  <span>Ladepunkte gesamt:</span>
                  <strong className="text-slate-900 font-mono">{city.ladepunkteGesamt.toLocaleString('de-DE')}</strong>
                </div>
                <div className="flex justify-between">
                  <span>HPC-Schnelllader (≥150 kW):</span>
                  <strong className="text-emerald-700 font-mono">{city.hpcLadepunkte}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Durchschnittsleistung:</span>
                  <span className="font-mono text-slate-800">{city.avgKw} kW</span>
                </div>
                <div className="flex justify-between">
                  <span>Einwohner:</span>
                  <span className="font-mono text-slate-800">{(city.einwohner / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Lade-Dossier öffnen</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Trust & E-E-A-T */}
      <EEATBadge topic="Top-50 Großstädte Datenregister" />

    </div>
  );
};

export default CitiesIndexPage;
