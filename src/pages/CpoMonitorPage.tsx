import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ArrowUpDown,
  Building2,
  Database,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  Filter,
  HelpCircle,
  Info,
  Search,
  ShieldCheck,
  Zap,
  Check,
  Copy
} from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { SEO } from '../components/SEO';
import { EEATBadge } from '../components/EEATBadge';
import cpoDataset from '../data/generated/cpo-monitor.generated.json';
import { CpoAggregateRecord } from '../lib/cpoMetrics';

type SortField = 'chargingPoints150PlusKw' | 'chargingPointsTotal' | 'share150PlusKwPercent' | 'shareOfRegisterHpcPercent' | 'name' | 'stationsTotal';
type SortDirection = 'asc' | 'desc';

export const CpoMonitorPage: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>('chargingPoints150PlusKw');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [onlyHpcFocused, setOnlyHpcFocused] = useState<boolean>(false);
  const [copiedCitation, setCopiedCitation] = useState<boolean>(false);

  const operators: CpoAggregateRecord[] = (cpoDataset.operators as unknown as CpoAggregateRecord[]) || [];

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection(field === 'name' ? 'asc' : 'desc');
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = operators.filter(op => {
      const matchesSearch =
        op.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        op.parentCompany.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesHpcFocus = onlyHpcFocused ? op.share150PlusKwPercent >= 50 : true;
      return matchesSearch && matchesHpcFocus;
    });

    result.sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (typeof valA === 'string') {
        return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [operators, searchQuery, onlyHpcFocused, sortField, sortDirection]);

  // Aggregate Top Metrics
  const totalHpcAcrossOperators = useMemo(() => {
    return operators.reduce((sum, op) => sum + op.chargingPoints150PlusKw, 0);
  }, [operators]);

  const topHpcOperator = operators[0];

  const citationText = `ladestandorte.de (2026): CPO Monitor Deutschland – Auswertung von Betreiber-Registerdaten der Bundesnetzagentur (Snapshot ${cpoDataset.snapshotDate}). URL: https://www.ladestandorte.de/cpo-monitor`;

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2500);
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
            name: 'CPO Monitor',
            item: 'https://www.ladestandorte.de/cpo-monitor'
          }
        ]
      },
      {
        '@type': 'WebPage',
        '@id': 'https://www.ladestandorte.de/cpo-monitor#webpage',
        url: 'https://www.ladestandorte.de/cpo-monitor',
        name: 'CPO Monitor: Betreiber-Registerdaten der Bundesnetzagentur im Vergleich',
        description:
          'Verifizierte Betreiber-Auswertung auf Basis amtlicher BNetzA-Registerdaten. Ladepunkte ≥150 kW, Ausbauquoten und Registeranteile der führenden CPOs in Deutschland.',
        inLanguage: 'de-DE'
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="CPO Monitor: Betreiber im BNetzA-Registervergleich | ladestandorte.de"
        description="Verifizierte Betreiber-Auswertung auf Basis amtlicher BNetzA-Registerdaten. Ladepunkte ≥150 kW, Ausbauquoten und Registeranteile der führenden CPOs in Deutschland."
        canonicalPath="/cpo-monitor"
        schema={schema}
      />

      <PageHero
        level={2}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'CPO Monitor', isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC] text-[#171917] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#2F5E73]"></span>
            <span>MONITOR / 02 · INFRASTRUCTURE INTELLIGENCE</span>
          </div>
        }
        title="CPO Monitor: Betreiber-Registerdaten der Bundesnetzagentur im Vergleich"
        description="Deterministische Auswertung der im amtlichen BNetzA-Ladesäulenregister dokumentierten Betreiberunternehmen mit Schwerpunkt auf High-Power-Charging (≥150 kW)."
      />

      {/* DATA STATUS BAR */}
      <div className="p-3.5 sm:p-4 rounded-xl bg-[#171917] border border-[#171917] text-slate-300 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[#C7F000] font-mono font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C7F000]"></span>
            {cpoDataset.cposCount} verifizierte CPO-Entities
          </span>
          <span className="text-slate-400">·</span>
          <span>BNetzA-Snapshot: <strong className="text-white font-mono">{cpoDataset.snapshotDate}</strong></span>
          <span className="text-slate-400">·</span>
          <span>Gesamter BNetzA-Bestand: <strong className="text-white font-mono">{cpoDataset.totalRegisterPointsDE.toLocaleString('de-DE')} Ladepunkte</strong> ({cpoDataset.totalRegisterHpcPointsDE.toLocaleString('de-DE')} ≥150 kW)</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/methodik"
            className="text-[#C7F000] hover:underline font-medium flex items-center gap-1"
          >
            <span>Methodik &amp; Entity-Mapping</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* TOP KPI ROW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Ausgewertete CPOs</span>
          <span className="text-2xl sm:text-4xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">
            {cpoDataset.cposCount}
          </span>
          <span className="text-[11px] text-[#6C716B] mt-1 block">
            Verifizierte institutionelle Entities
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Top 1 HPC-Betreiber</span>
          <span className="text-xl sm:text-2xl font-black text-[#171917] font-mono tracking-tight mt-1 block truncate">
            {topHpcOperator?.name || 'EnBW'}
          </span>
          <span className="text-[11px] text-[#2F5E73] mt-1 block font-mono">
            {topHpcOperator?.chargingPoints150PlusKw.toLocaleString('de-DE')} HPC ({topHpcOperator?.shareOfRegisterHpcPercent} % Registeranteil)
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">HPC-Punkte in Top 30</span>
          <span className="text-2xl sm:text-4xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">
            {totalHpcAcrossOperators.toLocaleString('de-DE')}
          </span>
          <span className="text-[11px] text-[#6C716B] mt-1 block font-mono">
            {((totalHpcAcrossOperators / cpoDataset.totalRegisterHpcPointsDE) * 100).toFixed(1)} % des Register-HPC-Bestands
          </span>
        </div>

        <div className="p-5 bg-white rounded-xl border border-[#DFE3DC] shadow-xs">
          <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Amtlicher BNetzA HPC-Bestand</span>
          <span className="text-2xl sm:text-4xl font-black text-[#171917] font-mono tracking-tight mt-1 block tabular-nums">
            {cpoDataset.totalRegisterHpcPointsDE.toLocaleString('de-DE')}
          </span>
          <span className="text-[11px] text-[#6C716B] mt-1 block font-mono">
            Ladepunkte mit Nennleistung ≥150 kW
          </span>
        </div>
      </div>

      {/* FILTER & TABLE SECTION */}
      <section className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-800 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Verifizierte Betreiber-Matrix</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-950">
              Vollständige CPO-Übersicht (BNetzA-Registerbestand)
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a
              href="/data/cpo-monitor.json"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-semibold transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>JSON</span>
            </a>
            <a
              href="/data/cpo-monitor.csv"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-mono font-semibold transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV</span>
            </a>
          </div>
        </div>

        {/* Search and Quick Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Betreiber oder Konzernmutter suchen (z. B. EnBW, Tesla, Aral, EWE, E.ON)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-hidden focus:border-purple-600 focus:bg-white"
            />
          </div>

          <button
            onClick={() => setOnlyHpcFocused(!onlyHpcFocused)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center justify-center gap-2 shrink-0 ${
              onlyHpcFocused
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Nur HPC-Fokus (≥50 % HPC-Anteil)</span>
          </button>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-700 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4 font-bold">
                  <button onClick={() => handleSort('name')} className="flex items-center gap-1 hover:text-slate-950">
                    <span>Betreiber (Entity)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4 font-bold text-right">
                  <button onClick={() => handleSort('chargingPoints150PlusKw')} className="flex items-center gap-1 hover:text-slate-950 ml-auto">
                    <span>HPC (≥150 kW)</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4 font-bold text-right">
                  <button onClick={() => handleSort('chargingPointsTotal')} className="flex items-center gap-1 hover:text-slate-950 ml-auto">
                    <span>Gesamt LP</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4 font-bold text-right">
                  <button onClick={() => handleSort('share150PlusKwPercent')} className="flex items-center gap-1 hover:text-slate-950 ml-auto">
                    <span>HPC-Quote</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4 font-bold text-right">
                  <button onClick={() => handleSort('shareOfRegisterHpcPercent')} className="flex items-center gap-1 hover:text-slate-950 ml-auto">
                    <span>Anteil BNetzA-HPC *</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="py-3.5 px-4 font-bold text-center">
                  <span>Präsenz (50 Städte)</span>
                </th>
                <th className="py-3.5 px-4 font-bold text-right">
                  <span>Details</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredAndSorted.map((op, idx) => (
                <tr key={op.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-600 w-5 text-right">{idx + 1}.</span>
                      <div>
                        <Link to={`/betreiber/${op.slug}`} className="font-bold text-slate-950 hover:text-purple-700 underline">
                          {op.name}
                        </Link>
                        <span className="block text-[11px] text-slate-700">
                          {op.parentCompany} · {op.headquarters}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-purple-900">
                    {op.chargingPoints150PlusKw.toLocaleString('de-DE')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-700">
                    {op.chargingPointsTotal.toLocaleString('de-DE')}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${
                      op.share150PlusKwPercent >= 70 ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' :
                      op.share150PlusKwPercent >= 40 ? 'bg-purple-50 text-purple-800 border border-purple-200' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {op.share150PlusKwPercent.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-900 font-semibold">
                    {op.shareOfRegisterHpcPercent.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %
                  </td>
                  <td className="py-3.5 px-4 text-center font-mono text-xs text-slate-600">
                    {op.citiesWithPresenceCount} / 50
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      to={`/betreiber/${op.slug}`}
                      className="px-2.5 py-1 rounded bg-slate-100 hover:bg-purple-50 hover:text-purple-700 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition-colors"
                    >
                      <span>Profil</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] text-slate-700 leading-relaxed pt-2">
          * <strong>Hinweis zur Kennzahl „Anteil BNetzA-HPC“:</strong> Berechnet als Anteil der dem jeweiligen Betreiber zugeordneten Ladepunkte mit Nennleistung ≥150 kW an der Gesamtzahl aller im amtlichen Registerbestand der Bundesnetzagentur erfassten HPC-Ladepunkte ({cpoDataset.totalRegisterHpcPointsDE.toLocaleString('de-DE')} Ladepunkte). Dies ist kein Marktanteil an Ladevorgängen, Strommengen oder Roaming-Umsätzen.
        </p>
      </section>

      {/* METHODOLOGY & PRIVACY GUARDRAIL SECTION */}
      <section className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-purple-800 font-bold">
          <Database className="w-4 h-4" />
          <span>Methodik, Datenschutz &amp; Entity-Resolution</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
          Wie die Betreiberdaten verarbeitet und geschützt werden
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <strong className="text-slate-950 block font-mono text-xs uppercase">1. Kein unüberwachtes Fuzzy-Matching</strong>
            <p className="text-xs">
              Die BNetzA-Rohdaten enthalten über 11.600 unbereinigte Betreiberstrings. Um falsches Zusammenführen von juristisch getrennten Unternehmen zu verhindern, werden Betreiber ausschließlich über die redaktionell geprüfte Zuordnungsdatei <code>src/data/mappings/operator-mapping.json</code> konsolidiert.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <strong className="text-slate-950 block font-mono text-xs uppercase">2. Strikter DSGVO-Personenschutz</strong>
            <p className="text-xs">
              Im amtlichen Register sind mehrere tausend Ladepunkte von Freiberuflern oder Privatpersonen erfasst. ladestandorte.de filtert natürliche Personen automatisiert heraus. Es werden im Monitor ausschließlich gewerbliche juristische Personen und Institutionen dargestellt.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
            <strong className="text-slate-950 block font-mono text-xs uppercase">3. Klare Register-Semantik</strong>
            <p className="text-xs">
              Die Zahlen spiegeln den amtlichen Meldestand gemäß Ladesäulenverordnung (LSV) wider. Ein Ladesäulenbetreiber im melderechtlichen Sinne ist nicht zwangsläufig der Roaming-Anbieter (EMP). Alle Quoten beziehen sich exakt auf den Datenbestand.
            </p>
          </div>
        </div>
      </section>

      {/* CITATION BOX */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-950 flex items-center gap-2">
            <span>Daten zitieren</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">CC BY 4.0</span>
        </div>
        <div className="p-3.5 bg-slate-900 rounded-xl text-slate-200 font-mono text-xs flex items-center justify-between gap-3">
          <span className="truncate">{citationText}</span>
          <button
            onClick={handleCopyCitation}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-[11px] shrink-0 inline-flex items-center gap-1.5 transition-colors"
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

      {/* EEAT Badge */}
      <EEATBadge topic="CPO Monitor" />
    </div>
  );
};

export default CpoMonitorPage;
