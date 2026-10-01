import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, ArrowRight, ArrowUpDown, Database, ExternalLink, Activity } from 'lucide-react';
import { CITIES_DATA, CityData } from '../data/cities';
import { EEATBadge } from '../components/EEATBadge';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';

type SortField = 'name' | 'ladepunkte' | 'hpc' | 'pointsPer1k' | 'hpcPer1k' | 'population';
type SortDirection = 'asc' | 'desc';

export const CitiesIndexPage: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [selectedBundesland, setSelectedBundesland] = useState('Alle');
  const [sortField, setSortField] = useState<SortField>('ladepunkte');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Metadata from first city (all share the same pipeline snapshot)
  const sampleCity = CITIES_DATA[0];
  const bnetzaSnapshotDate = sampleCity?.bnetza?.provenance?.retrievedAt
    ? new Date(sampleCity.bnetza.provenance.retrievedAt).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '01.10.2026';
  const destatisDate = sampleCity?.population?.referenceDate
    ? new Date(sampleCity.population.referenceDate).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
    : '31.12.2024';

  const bundeslaender = useMemo(() => {
    return ['Alle', ...Array.from(new Set(CITIES_DATA.map(c => c.bundesland))).sort()];
  }, []);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  };

  const filteredAndSortedCities = useMemo(() => {
    const list = CITIES_DATA.filter(city => {
      const matchesQuery = city.name.toLowerCase().includes(filter.toLowerCase()) ||
                           city.plzs.some(p => p.includes(filter));
      const matchesLand = selectedBundesland === 'Alle' || city.bundesland === selectedBundesland;
      return matchesQuery && matchesLand;
    });

    return list.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'de');
          break;
        case 'ladepunkte':
          comparison = a.ladepunkteGesamt - b.ladepunkteGesamt;
          break;
        case 'hpc':
          comparison = a.hpcLadepunkte - b.hpcLadepunkte;
          break;
        case 'pointsPer1k':
          comparison = a.pointsPer1000Pop - b.pointsPer1000Pop;
          break;
        case 'hpcPer1k':
          comparison = a.hpcPer1000Pop - b.hpcPer1000Pop;
          break;
        case 'population':
          comparison = a.einwohner - b.einwohner;
          break;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [filter, selectedBundesland, sortField, sortDirection]);

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
            "name": "Städte",
            "item": "https://www.ladestandorte.de/staedte"
          }
        ]
      },
      {
        "@type": "CollectionPage",
        "name": "Ladeinfrastruktur in deutschen Städten",
        "description": "Auswertung von 50 deutschen Städten auf Basis veröffentlichter Registerdaten der Bundesnetzagentur und amtlicher Einwohnerzahlen von Destatis.",
        "url": "https://www.ladestandorte.de/staedte"
      }
    ]
  };

  const sortLabel = useMemo(() => {
    switch (sortField) {
      case 'name': return 'Stadtname';
      case 'ladepunkte': return 'Ladepunkte gesamt';
      case 'hpc': return 'Ladepunkte ≥150 kW';
      case 'pointsPer1k': return 'Ladepunkte / 1.000 Einw.';
      case 'hpcPer1k': return '≥150 kW / 1.000 Einw.';
      case 'population': return 'Einwohnerzahl';
    }
  }, [sortField]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      <SEO
        title="Ladeinfrastruktur in deutschen Städten: BNetzA-Daten & Kennzahlen | ladestandorte.de"
        description="Auswertung veröffentlichter Registerdaten der Bundesnetzagentur für 50 deutsche Städte: Ladepunkte, ≥150-kW-Ladepunkte und amtliche Einwohner-Dichtewerte."
        canonicalPath="/staedte"
        schema={schema}
      />

      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Städte', isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-mono font-bold">
            <Activity className="w-4 h-4 text-emerald-800" />
            <span>Kommunale Auswertung · BNetzA &amp; Destatis</span>
          </div>
        }
        title="Ladeinfrastruktur in deutschen Städten"
        description="Auswertung von 50 Städten auf Basis veröffentlichter Registerdaten der Bundesnetzagentur und amtlicher Einwohnerzahlen von Destatis."
      />

      {/* DATA STATUS BAR */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            50 Städte ausgewertet
          </span>
          <span className="text-slate-400">·</span>
          <span>BNetzA API-Snapshot: <strong className="text-white font-mono">{bnetzaSnapshotDate}</strong></span>
          <span className="text-slate-400">·</span>
          <span>Bevölkerung: <strong className="text-white">Destatis, Stand {destatisDate}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Eigene Auswertung: ladestandorte.de</span>
          <span className="text-slate-600">|</span>
          <Link
            to="/methodik"
            className="text-emerald-400 hover:text-emerald-300 underline font-medium flex items-center gap-1"
          >
            <span>Methodik</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Search, Filter & Sort Info Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Stadt filtern..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
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

        <div className="text-xs text-slate-500 font-mono self-end sm:self-center">
          Sortiert nach: <strong className="text-slate-900">{sortLabel}</strong> ({sortDirection === 'desc' ? 'absteigend' : 'aufsteigend'})
        </div>
      </div>

      {/* Responsive Data Table (Desktop View) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-mono uppercase text-slate-700">
              <tr>
                <th className="py-3.5 px-4 font-bold">
                  <button
                    type="button"
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-1 hover:text-emerald-700 transition-colors"
                  >
                    <span>Stadt</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3.5 px-3 font-bold">Bundesland</th>
                <th className="py-3.5 px-3 font-bold text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('population')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors"
                  >
                    <span>Einwohner</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3.5 px-3 font-bold text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('ladepunkte')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors"
                  >
                    <span>Ladepunkte</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3.5 px-3 font-bold text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('hpc')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors"
                  >
                    <span>≥150 kW</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3.5 px-3 font-bold text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('pointsPer1k')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors"
                  >
                    <span>LP / 1.000 Einw.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3.5 px-3 font-bold text-right">
                  <button
                    type="button"
                    onClick={() => handleSort('hpcPer1k')}
                    className="inline-flex items-center gap-1 hover:text-emerald-700 transition-colors"
                  >
                    <span>≥150 kW / 1.000 Einw.</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </button>
                </th>
                <th className="py-3.5 px-4 text-right font-bold">Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAndSortedCities.map((city) => (
                <tr key={city.slug} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-950">
                    <Link to={`/staedte/${city.slug}`} className="hover:text-emerald-700 transition-colors">
                      {city.name}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-xs">
                    {city.bundesland}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700">
                    {city.einwohner.toLocaleString('de-DE')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-slate-950">
                    {city.ladepunkteGesamt.toLocaleString('de-DE')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800">
                    {city.hpcLadepunkte.toLocaleString('de-DE')}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-800">
                    {city.pointsPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-800">
                    {city.hpcPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/staedte/${city.slug}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-100 text-slate-900 hover:text-emerald-950 text-xs font-bold transition-colors font-mono"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Responsive Cards View (Mobile unter md) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
        {filteredAndSortedCities.map((city) => (
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

              <div className="space-y-1.5 text-xs text-slate-600 mt-3 font-mono">
                <div className="flex justify-between">
                  <span className="font-sans text-slate-500">Einwohner (Destatis):</span>
                  <strong className="text-slate-900">{city.einwohner.toLocaleString('de-DE')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-slate-500">Ladepunkte gesamt:</span>
                  <strong className="text-slate-950">{city.ladepunkteGesamt.toLocaleString('de-DE')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-slate-500">Ladepunkte ≥150 kW:</span>
                  <strong className="text-emerald-700">{city.hpcLadepunkte.toLocaleString('de-DE')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-slate-500">LP / 1.000 Einw.:</span>
                  <span className="text-slate-800 font-bold">{city.pointsPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-sans text-slate-500">≥150 kW / 1.000 Einw.:</span>
                  <span className="text-slate-800 font-bold">{city.hpcPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700">
              <span>Stadt-Dossier öffnen</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Completeness Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <strong>Vollständigkeitshinweis:</strong> Die Auswertung basiert auf den im verwendeten Register/API-Datenbestand veröffentlichten Ladeeinrichtungen. Der Datenbestand stellt keine zwingend vollständige Erfassung der gesamten öffentlich zugänglichen Ladeinfrastruktur dar.
      </div>

      {/* Trust & E-E-A-T */}
      <EEATBadge topic="Städtische Ladeinfrastruktur Registerdaten" />
    </div>
  );
};

export default CitiesIndexPage;
