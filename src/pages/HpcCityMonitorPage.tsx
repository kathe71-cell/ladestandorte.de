import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ArrowUpDown,
  Database,
  Download,
  ExternalLink,
  Filter,
  HelpCircle,
  Info,
  MapPin,
  Search,
  Zap,
  BarChart2,
  FileSpreadsheet,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import { CITIES_DATA } from '../data/cities';
import { getHpcCityRows, getHpcCityMonitorSummary, HpcCityRow } from '../lib/hpcCityMetrics';
import { PageHero } from '../components/PageHero';
import { SEO } from '../components/SEO';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';

type SortField = 'name' | 'hpcLadepunkte' | 'hpcPer1000Pop' | 'hpcSharePercent' | 'ladepunkteGesamt' | 'einwohner';
type SortDirection = 'asc' | 'desc';
type ChartMode = 'absolute' | 'density';

export const HpcCityMonitorPage: React.FC = () => {
  const summary = useMemo(() => getHpcCityMonitorSummary(CITIES_DATA), []);
  const allRows = useMemo(() => getHpcCityRows(CITIES_DATA), []);

  const [sortField, setSortField] = useState<SortField>('hpcLadepunkte');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedBundesland, setSelectedBundesland] = useState<string>('Alle');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [chartMode, setChartMode] = useState<ChartMode>('absolute');
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  const bundeslaender = useMemo(() => {
    return ['Alle', ...Array.from(new Set(allRows.map((r) => r.bundesland))).sort()];
  }, [allRows]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  };

  const filteredAndSortedRows = useMemo(() => {
    const filtered = allRows.filter((r) => {
      const matchesQuery = r.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLand = selectedBundesland === 'Alle' || r.bundesland === selectedBundesland;
      return matchesQuery && matchesLand;
    });

    return filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name, 'de');
          break;
        case 'hpcLadepunkte':
          comparison = a.hpcLadepunkte - b.hpcLadepunkte;
          break;
        case 'hpcPer1000Pop':
          comparison = a.hpcPer1000Pop - b.hpcPer1000Pop;
          break;
        case 'hpcSharePercent':
          comparison = a.hpcSharePercent - b.hpcSharePercent;
          break;
        case 'ladepunkteGesamt':
          comparison = a.ladepunkteGesamt - b.ladepunkteGesamt;
          break;
        case 'einwohner':
          comparison = a.einwohner - b.einwohner;
          break;
      }
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [allRows, searchQuery, selectedBundesland, sortField, sortDirection]);

  // Chart data: Top 10 cities according to active chartMode
  const chartData = useMemo(() => {
    const sorted = [...allRows].sort((a, b) => {
      return chartMode === 'absolute'
        ? b.hpcLadepunkte - a.hpcLadepunkte
        : b.hpcPer1000Pop - a.hpcPer1000Pop;
    }).slice(0, 10);

    const maxVal = chartMode === 'absolute'
      ? Math.max(...sorted.map((s) => s.hpcLadepunkte), 1)
      : Math.max(...sorted.map((s) => s.hpcPer1000Pop), 0.1);

    return { sorted, maxVal };
  }, [allRows, chartMode]);

  const citationText = `ladestandorte.de: „HPC City Monitor – ≥150-kW-Ladepunkte in 50 deutschen Städten“, BNetzA-Registersnapshot: ${summary.bnetzaSnapshotDate}, Destatis-Bevölkerungsstand: ${summary.destatisReferenceDate}, https://www.ladestandorte.de/hpc-city-monitor`;

  const handleCopyCitation = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(citationText);
      setCopiedCitation(true);
      setTimeout(() => setCopiedCitation(false), 2500);
    }
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
            name: 'HPC City Monitor',
            item: 'https://www.ladestandorte.de/hpc-city-monitor'
          }
        ]
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.ladestandorte.de/hpc-city-monitor#webpage',
        url: 'https://www.ladestandorte.de/hpc-city-monitor',
        name: 'HPC City Monitor: ≥150-kW-Ladepunkte in 50 Städten',
        description: 'Eigene Auswertung von ladestandorte.de auf Basis veröffentlichter Registerdaten der Bundesnetzagentur und amtlicher Einwohnerzahlen von Destatis.',
        inLanguage: 'de-DE',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://www.ladestandorte.de/#website',
          name: 'ladestandorte.de',
          url: 'https://www.ladestandorte.de/'
        }
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="HPC City Monitor: ≥150-kW-Ladepunkte in 50 Städten | ladestandorte.de"
        description="Auswertung von Ladepunkten mit ≥150 kW Nennleistung in 50 deutschen Städten auf Basis veröffentlichter BNetzA-Registerdaten und amtlicher Destatis-Bevölkerung."
        canonicalPath="/hpc-city-monitor"
        schema={schema}
      />

      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'HPC City Monitor', isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC] text-[#171917] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#C7F000] border border-[#171917]/20"></span>
            <span>MONITOR / 01 · HPC CITY MONITOR</span>
          </div>
        }
        title="HPC City Monitor: ≥150-kW-Ladepunkte in 50 deutschen Städten"
        description="Eigene Auswertung von ladestandorte.de auf Basis veröffentlichter Registerdaten der Bundesnetzagentur und amtlicher Einwohnerzahlen von Destatis."
      />

      {/* DATA STATUS BAR */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#171917] border border-[#171917] text-slate-300 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[#C7F000] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F000]"></span>
            {summary.cityCount} Städte ausgewertet
          </span>
          <span className="text-slate-400">·</span>
          <span>BNetzA API-Snapshot: <strong className="text-white font-mono">{summary.bnetzaSnapshotDate}</strong></span>
          <span className="text-slate-400">·</span>
          <span>Bevölkerung: <strong className="text-white font-mono">Destatis {summary.destatisReferenceDate}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400">Eigene Auswertung: ladestandorte.de</span>
          <span className="text-slate-600">|</span>
          <Link
            to="/methodik"
            className="text-[#C7F000] hover:underline font-medium flex items-center gap-1"
          >
            <span>Methodik</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* TOP KPI ROW (Maximal 4 zentrale KPIs) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Ausgewertete Städte</span>
          <span className="text-2xl sm:text-4xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">
            {summary.cityCount}
          </span>
          <span className="text-[11px] text-[#6C716B] mt-1 block font-mono">
            {summary.totalPopulation.toLocaleString('de-DE')} Einwohner gesamt
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Ladepunkte ≥150 kW</span>
          <span className="text-2xl sm:text-4xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">
            {summary.totalHpc.toLocaleString('de-DE')}
          </span>
          <span className="text-[11px] text-[#2F5E73] mt-1 block font-mono">
            von {summary.totalLadepunkte.toLocaleString('de-DE')} Ladepunkten gesamt
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Anteil ≥150 kW</span>
          <span className="text-2xl sm:text-4xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">
            {summary.overallHpcSharePercent.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %
          </span>
          <span className="text-[11px] text-[#6C716B] mt-1 block">
            am ausgewerteten Registerbestand
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">≥150 kW / 100.000 Einw.</span>
          <span className="text-2xl sm:text-4xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">
            {summary.overallHpcPer100kPop.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
          </span>
          <span className="text-[11px] text-[#6C716B] mt-1 block">
            Aggregierte Bevölkerungsdichte
          </span>
        </div>
      </div>

      {/* KEY FINDINGS (Was die Daten zeigen) */}
      <section className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold">
          <Info className="w-4 h-4" />
          <span>Analytische Einordnung · Was die Daten zeigen</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
          Zentrale Befunde im 50-Städte-Registerbestand
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase block">Höchste absolute Zahl</span>
            <div className="text-lg font-bold text-slate-900">
              <Link to={`/staedte/${summary.topAbsoluteCity.slug}`} className="hover:text-emerald-700 underline">
                {summary.topAbsoluteCity.name}
              </Link>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Unter den 50 ausgewerteten Städten weist {summary.topAbsoluteCity.name} mit {summary.topAbsoluteCity.value.toLocaleString('de-DE')} Ladepunkten den höchsten absoluten Bestand in der Leistungsklasse ≥150 kW auf.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase block">Höchste relative Dichte</span>
            <div className="text-lg font-bold text-slate-900">
              <Link to={`/staedte/${summary.topDensityCity.slug}`} className="hover:text-emerald-700 underline">
                {summary.topDensityCity.name}
              </Link>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Bezogen auf die amtliche Destatis-Bevölkerung verzeichnet {summary.topDensityCity.name} unter den 50 Städten rechnerisch mit {summary.topDensityCity.value.toLocaleString('de-DE', { minimumFractionDigits: 2 })} Ladepunkten ≥150 kW je 1.000 Einwohner die höchste Dichte.
            </p>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-2">
            <span className="text-xs font-mono text-slate-500 uppercase block">Höchster Register-Anteil</span>
            <div className="text-lg font-bold text-slate-900">
              <Link to={`/staedte/${summary.topShareCity.slug}`} className="hover:text-emerald-700 underline">
                {summary.topShareCity.name}
              </Link>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              In {summary.topShareCity.name} entfällt unter den 50 Städten mit {summary.topShareCity.value.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} % der höchste Anteil des erfassten Registerbestands auf Ladepunkte mit mindestens 150 kW Nennleistung.
            </p>
          </div>
        </div>

        {/* Median Callout */}
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <strong>Medianwerte der 50 Städte:</strong> Der Median liegt bei <strong>{summary.medianHpc} Ladepunkten ≥150 kW</strong> pro Stadt, einer Dichte von <strong>{summary.medianHpcPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2 })} je 1.000 Einwohner</strong> und einem Anteil von <strong>{summary.medianHpcSharePercent.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %</strong>.
          </div>
          <div className="shrink-0 text-slate-600 font-mono text-[11px]">
            Robuste Lagemaße (ausreißerunempfindlich)
          </div>
        </div>
      </section>

      {/* THREE DIFFERENT QUESTIONS EXPLAINER */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xl font-bold text-slate-950">
          Drei unterschiedliche analytische Fragestellungen
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Um Fehlinterpretationen zu vermeiden, differenziert ladestandorte.de strikt zwischen drei unabhängigen Kennzahlen. Es wird kein künstlicher „Gesamtscore“ oder zusammenfassender Index gebildet:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <strong className="text-slate-950 block font-mono text-sm">1. Absolute Anzahl</strong>
            <p className="text-slate-600">
              <em>„Wo sind im ausgewerteten Registerbestand die meisten ≥150-kW-Ladepunkte erfasst?“</em> — Beantwortet das absolute Angebotsvolumen, bevorzugt naturgemäß Millionenstädte wie Berlin oder Hamburg.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <strong className="text-slate-950 block font-mono text-sm">2. Bevölkerungsbezogene Dichte</strong>
            <p className="text-slate-600">
              <em>„Wo gibt es relativ zur Einwohnerzahl besonders viele ≥150-kW-Ladepunkte?“</em> — Normalisiert nach Destatis-Einwohnerzahl (je 1.000 bzw. 100.000 Einwohner), ermöglicht einen bevölkerungsbezogenen Vergleich zwischen unterschiedlich großen Städten.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <strong className="text-slate-950 block font-mono text-sm">3. Anteil am Registerbestand</strong>
            <p className="text-slate-600">
              <em>„Welcher Anteil des lokalen Bestands entfällt auf Ladepunkte ≥150 kW?“</em> — Zeigt den technologischen Schwerpunkt der erfassten Ladeinfrastruktur vor Ort im Verhältnis zu Normalladepunkten.
            </p>
          </div>
        </div>
      </section>

      {/* SIMPLE VISUALIZATION (Horizontales Balkendiagramm mit Toggle) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold mb-1">
              <BarChart2 className="w-4 h-4" />
              <span>Datenvisualisierung</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
              Top 10 Städte nach {chartMode === 'absolute' ? 'absoluten ≥150-kW-Ladepunkten' : '≥150-kW-Dichte je 1.000 Einwohner'}
            </h2>
          </div>

          {/* Toggle Button */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setChartMode('absolute')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMode === 'absolute'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Absolut (Ladepunkte)
            </button>
            <button
              onClick={() => setChartMode('density')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                chartMode === 'density'
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              Je 1.000 Einwohner
            </button>
          </div>
        </div>

        {/* Accessible Bar Chart */}
        <div className="space-y-3" role="region" aria-label="Balkendiagramm der führenden Städte">
          {chartData.sorted.map((item, idx) => {
            const rawValue = chartMode === 'absolute' ? item.hpcLadepunkte : item.hpcPer1000Pop;
            const displayValue = chartMode === 'absolute'
              ? `${item.hpcLadepunkte.toLocaleString('de-DE')} Ladepunkte`
              : `${item.hpcPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / 1k EW`;
            const widthPct = Math.max(5, (rawValue / chartData.maxVal) * 100);

            return (
              <div key={item.slug} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 w-5 text-right">{idx + 1}.</span>
                    <Link
                      to={`/staedte/${item.slug}`}
                      className="font-bold text-slate-900 hover:text-emerald-700 underline"
                    >
                      {item.name}
                    </Link>
                    <span className="text-[11px] text-slate-400 font-mono">({item.bundesland})</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">{displayValue}</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${widthPct}%` }}
                    aria-hidden="true"
                  />
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-500 font-mono">
          Quelle: BNetzA API-Snapshot ({summary.bnetzaSnapshotDate}), Destatis ({summary.destatisReferenceDate}). Eigene Auswertung: ladestandorte.de.
        </p>
      </section>

      {/* MAIN DATA TABLE SECTION */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-950">
              Vollständige Datentabelle (50 Städte)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Sortiert nach: <strong className="text-slate-800">{
                sortField === 'hpcLadepunkte' ? 'Ladepunkte ≥150 kW' :
                sortField === 'hpcPer1000Pop' ? '≥150 kW / 1.000 Einw.' :
                sortField === 'hpcSharePercent' ? 'Anteil ≥150 kW' :
                sortField === 'ladepunkteGesamt' ? 'Ladepunkte gesamt' :
                sortField === 'einwohner' ? 'Einwohnerzahl' : 'Stadt'
              }</strong> ({sortDirection === 'desc' ? 'absteigend' : 'aufsteigend'}).
            </p>
          </div>

          {/* Machine data links */}
          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/data/hpc-city-monitor.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-semibold transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>JSON</span>
            </a>
            <a
              href="/data/hpc-city-monitor.csv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV</span>
            </a>
            <a
              href="/data/hpc-history.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-semibold transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Historie</span>
            </a>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Stadt suchen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedBundesland}
              onChange={(e) => setSelectedBundesland(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 transition-all font-mono"
            >
              {bundeslaender.map((land) => (
                <option key={land} value={land}>
                  {land === 'Alle' ? 'Alle Bundesländer' : land}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase font-mono tracking-wider">
                <th scope="col" className="py-3 px-3">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1 font-bold hover:text-slate-900">
                    <span>Stadt</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-3 text-right">
                  <button onClick={() => handleSort('einwohner')} className="inline-flex items-center gap-1 font-bold hover:text-slate-900 justify-end">
                    <span>Einwohner</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-3 text-right">
                  <button onClick={() => handleSort('ladepunkteGesamt')} className="inline-flex items-center gap-1 font-bold hover:text-slate-900 justify-end">
                    <span>Ladepunkte</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-3 text-right bg-emerald-50/50">
                  <button onClick={() => handleSort('hpcLadepunkte')} className="inline-flex items-center gap-1 font-bold text-emerald-900 hover:text-emerald-950 justify-end">
                    <span>≥150 kW</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-3 text-right">
                  <button onClick={() => handleSort('hpcSharePercent')} className="inline-flex items-center gap-1 font-bold hover:text-slate-900 justify-end">
                    <span>Anteil ≥150 kW</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-3 text-right">
                  <button onClick={() => handleSort('hpcPer1000Pop')} className="inline-flex items-center gap-1 font-bold hover:text-slate-900 justify-end">
                    <span>≥150 kW / 1k EW</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th scope="col" className="py-3 px-3 text-right">
                  <span className="font-bold">Dossier</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono">
              {filteredAndSortedRows.map((r, i) => (
                <tr key={r.slug} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-sans">
                    <div className="font-bold text-slate-950">
                      <Link to={`/staedte/${r.slug}`} className="hover:text-emerald-700 underline">
                        {r.name}
                      </Link>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{r.bundesland}</div>
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600">
                    {r.einwohner.toLocaleString('de-DE')}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-600">
                    {r.ladepunkteGesamt.toLocaleString('de-DE')}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-700 bg-emerald-50/30">
                    {r.hpcLadepunkte.toLocaleString('de-DE')}
                  </td>
                  <td className="py-3 px-3 text-right text-slate-900 font-semibold">
                    {r.hpcSharePercent.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-slate-950">
                    {r.hpcPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 px-3 text-right font-sans">
                    <Link
                      to={`/staedte/${r.slug}`}
                      className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1"
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

        {/* Mobile Responsive Cards */}
        <div className="block md:hidden space-y-3">
          {filteredAndSortedRows.map((r) => (
            <div key={r.slug} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-950 text-base">{r.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">{r.bundesland} · {r.einwohner.toLocaleString('de-DE')} Einw.</span>
                </div>
                <Link
                  to={`/staedte/${r.slug}`}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs inline-flex items-center gap-1"
                >
                  <span>Dossier</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center font-mono pt-1 border-t border-slate-200 text-xs">
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">≥150 kW</span>
                  <strong className="text-emerald-700 text-sm block mt-0.5">{r.hpcLadepunkte.toLocaleString('de-DE')}</strong>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">Anteil</span>
                  <strong className="text-slate-900 text-sm block mt-0.5">{r.hpcSharePercent.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %</strong>
                </div>
                <div className="p-2 rounded bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-500 block uppercase font-sans">/ 1k EW</span>
                  <strong className="text-slate-900 text-sm block mt-0.5">{r.hpcPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HISTORICAL TRENDS & SNAPSHOT TRACKING */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold">
          <Activity className="w-4 h-4" />
          <span>Zeitreihen &amp; Monatsvergleiche</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
          Entwicklung &amp; Historische Monatsvergleiche
        </h2>
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            <strong>Aktueller Status: Initialer amtlicher Referenz-Snapshot ({summary.bnetzaSnapshotDate}).</strong>
          </p>
          <p>
            ladestandorte.de speichert jeden monatlichen BNetzA-Snapshot unveränderlich als Rohdatei (unter <code>data/raw/bnetza/YYYY-MM-DD/</code>). Sobald der nächste monatliche Registerabruf erfolgt, berechnet die Datenpipeline automatisch die Netto-Zubauzahlen und prozentualen Veränderungen auf Stadtebene.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Aktiver Snapshot: {summary.bnetzaSnapshotDate}
            </span>
            <a
              href="/data/hpc-history.json"
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span>Maschinenlesbare Zeitreihendaten (/data/hpc-history.json)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* GEO & ANSWERABILITY SECTION (Semantische Zwischenüberschriften) */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold">
          <HelpCircle className="w-4 h-4" />
          <span>Häufige Fragen &amp; Auswertungskriterien</span>
        </div>
        <h2 className="text-2xl font-bold text-slate-950">
          Zentrale Fragen zum HPC City Monitor
        </h2>

        <div className="space-y-4 text-xs sm:text-sm text-slate-700">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-950 text-sm sm:text-base">
              Wie viele ≥150-kW-Ladepunkte sind in den 50 Städten erfasst?
            </h3>
            <p className="leading-relaxed">
              Im ausgewerteten BNetzA-Registersnapshot (Stand {summary.bnetzaSnapshotDate}) sind über alle 50 untersuchten deutschen Städte zusammen {summary.totalHpc.toLocaleString('de-DE')} Ladepunkte mit einer Nennleistung von mindestens 150 kW registriert. Dies entspricht einem Anteil von {summary.overallHpcSharePercent.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} % an den {summary.totalLadepunkte.toLocaleString('de-DE')} in diesen Städten registrierten öffentlichen Ladepunkten.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-950 text-sm sm:text-base">
              Welche Städte weisen absolut viele ≥150-kW-Ladepunkte auf?
            </h3>
            <p className="leading-relaxed">
              Bei der absoluten Erfassung führen die großen Ballungsräume: Unter den 50 ausgewerteten Städten liegt {summary.topAbsoluteCity.name} mit {summary.topAbsoluteCity.value.toLocaleString('de-DE')} Ladepunkten ≥150 kW an der Spitze, gefolgt von weiteren Großstädten wie Hamburg und Köln. Absolute Zahlen spiegeln vor allem die städtische Gesamtgröße wider.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-950 text-sm sm:text-base">
              Wie unterscheidet sich die ≥150-kW-Dichte je Einwohner?
            </h3>
            <p className="leading-relaxed">
              Wird das Angebot auf die Destatis-Einwohnerzahl umgerechnet, ergibt sich ein differenziertes Bild: Unter den 50 untersuchten Städten führt {summary.topDensityCity.name} mit rechnerisch {summary.topDensityCity.value.toLocaleString('de-DE', { minimumFractionDigits: 2 })} Ladepunkten ≥150 kW je 1.000 Einwohner. Der Median aller 50 Städte liegt bei {summary.medianHpcPer1000Pop.toLocaleString('de-DE', { minimumFractionDigits: 2 })} je 1.000 Einwohner.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-950 text-sm sm:text-base">
              Wie hoch ist der ≥150-kW-Anteil am jeweiligen Registerbestand?
            </h3>
            <p className="leading-relaxed">
              Der Anteil von Ladepunkten mit mindestens 150 kW am lokalen Registerbestand variiert stark: In {summary.topShareCity.name} entfallen {summary.topShareCity.value.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} % auf diese Leistungsklasse, während Städte mit großflächigem kommunalen Normalladenetz (z. B. Laternenladen in Wohngebieten) naturgemäß einen geringeren prozentualen HPC-Anteil aufweisen.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-950 text-sm sm:text-base">
              Wie wird der HPC City Monitor berechnet?
            </h3>
            <p className="leading-relaxed">
              Der Monitor nutzt die offizielle Open-Data-Pipeline von ladestandorte.de. Ladepunktdaten stammen aus dem Ladesäulenregister der Bundesnetzagentur (API-Snapshot {summary.bnetzaSnapshotDate}). Die Bevölkerungsdaten basieren auf den amtlichen Fortschreibungen des Statistischen Bundesamtes (Destatis, Stand {summary.destatisReferenceDate}). Sämtliche Kennzahlen werden deterministisch ohne manuelle Gewichtung berechnet. Details zur Zuordnungsmethodik finden sich in der <Link to="/methodik" className="text-emerald-700 underline font-semibold">Methodikdokumentation</Link>.
            </p>
          </div>
        </div>
      </section>

      {/* METHODOLOGY BOX */}
      <section className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold">
          <Database className="w-4 h-4" />
          <span>Methodik &amp; Abgrenzung</span>
        </div>
        <h2 className="text-xl font-bold text-slate-950">
          Methodische Grundlagen des Monitors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs leading-relaxed text-slate-700">
          <div className="space-y-1 p-3 rounded-lg bg-white border border-slate-200">
            <strong className="text-slate-950 block font-mono">50-Städte-Scope</strong>
            <span>Untersucht werden die 50 einwohnerstärksten deutschen Städte des vorliegenden ladestandorte.de-Datensatzes. Keine bundesweite Vollerhebung aller Kommunen.</span>
          </div>
          <div className="space-y-1 p-3 rounded-lg bg-white border border-slate-200">
            <strong className="text-slate-950 block font-mono">≥150-kW-Klassifikation</strong>
            <span>Für diesen Monitor bezeichnet ladestandorte.de Ladepunkte mit einer dokumentierten Nennleistung von mindestens 150 kW als HPC-Klasse. Es erfolgt keine Ableitung der Stromart (AC/DC).</span>
          </div>
          <div className="space-y-1 p-3 rounded-lg bg-white border border-slate-200">
            <strong className="text-slate-950 block font-mono">Stichtagstrennung</strong>
            <span>Infrastrukturdaten stammen aus dem BNetzA-Snapshot vom {summary.bnetzaSnapshotDate}. Bevölkerungsdaten basieren auf Destatis mit Stichtag {summary.destatisReferenceDate}.</span>
          </div>
        </div>
        <p className="text-[11px] text-slate-500 pt-2 border-t border-slate-200 leading-normal">
          <strong>Vollständigkeitshinweis:</strong> {CITIES_DATA[0]?.bnetza?.provenance?.completenessDisclaimer}
        </p>
      </section>

      {/* CITATION BOX */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <span>Daten zitieren</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">CC BY 4.0 / dl-de/by-2-0</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Für Berichterstattung, wissenschaftliche Analysen oder Branchenvergleiche kann der HPC City Monitor wie folgt zitiert werden:
        </p>
        <div className="p-3.5 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs flex items-center justify-between gap-3">
          <span className="truncate">{citationText}</span>
          <button
            onClick={handleCopyCitation}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shrink-0 inline-flex items-center gap-1.5 transition-colors"
          >
            {copiedCitation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Kopiert</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Zitiertext kopieren</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* PROVENANCE BOX */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold">
          <Database className="w-4 h-4" />
          <span>Datengrundlage &amp; Transparenz</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs leading-relaxed">
          <div className="space-y-1">
            <div className="font-bold text-slate-950 uppercase font-mono">Ladeinfrastruktur</div>
            <div className="text-slate-700">Bundesnetzagentur (Ladesäulenregister)</div>
            <div className="text-slate-500">API-Snapshot: {summary.bnetzaSnapshotDate}</div>
            <div className="text-slate-500">Lizenz: {summary.bnetzaLicense}</div>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-slate-950 uppercase font-mono">Bevölkerung</div>
            <div className="text-slate-700">Statistisches Bundesamt (Destatis)</div>
            <div className="text-slate-500">Stand: {summary.destatisReferenceDate} (GV-ISys)</div>
            <div className="text-slate-500">Lizenz: {summary.destatisLicense}</div>
          </div>

          <div className="space-y-1">
            <div className="font-bold text-slate-950 uppercase font-mono">Auswertung</div>
            <div className="text-slate-700">ladestandorte.de</div>
            <div className="text-slate-500">Eigene deterministische Berechnung</div>
            <div>
              <Link to="/methodik" className="text-emerald-700 hover:text-emerald-800 font-bold underline inline-flex items-center gap-1">
                <span>Methodik ansehen</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* EEAT Badge */}
      <EEATBadge topic="HPC City Monitor" />
    </div>
  );
};

export default HpcCityMonitorPage;
