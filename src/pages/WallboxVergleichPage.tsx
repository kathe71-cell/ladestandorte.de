import React, { useState, useMemo } from 'react';
import { Zap, CheckCircle2, Sun, Smartphone, Info, Shield, Network, SlidersHorizontal, ArrowUpDown, X } from 'lucide-react';
import { WALLBOXES_DATA } from '../data/wallboxes';
import { ProductLinks, AdPageNotice } from '@plattform/core';
import { EEATBadge } from '../components/EEATBadge';
import { CitationBox } from '../components/CitationBox';
import { SEO } from '../components/SEO';

// IDs for ProductLinks affiliate section (products available on Amazon.de)
const WALLBOX_PRODUCT_IDS = [
  'go-e-gemini-flex',
  'go-e-home-fix-11',
  'heidelberg-energy-control',
  'webasto-next',
  'easee-charge',
  'abl-emh1',
  'keba-p30-x-11',
  'mennekes-amtron-compact-11',
  'juice-charger-me3-22',
  'fronius-wattpilot-11',
  'wallbox-pulsar-plus-11',
  'schneider-evlink-home-11',
  'alfen-eve-single-pro-22',
];

type SortKey = 'priceAsc' | 'priceDesc' | 'kwAsc' | 'kwDesc';

interface Filters {
  kw: 0 | 11 | 22;
  pv: boolean;
  app: boolean;
  rfid: boolean;
  load: boolean;
  brand: string;
}

const BRANDS = Array.from(new Set(WALLBOXES_DATA.map((w) => w.brand))).sort();

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'priceAsc', label: 'Preis aufsteigend' },
  { value: 'priceDesc', label: 'Preis absteigend' },
  { value: 'kwAsc', label: 'Leistung aufsteigend' },
  { value: 'kwDesc', label: 'Leistung absteigend' },
];

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://www.ladestandorte.de/" },
        { "@type": "ListItem", "position": 2, "name": "Wallbox-Vergleich", "item": "https://www.ladestandorte.de/wallbox-vergleich" },
      ],
    },
  ],
};

export const WallboxVergleichPage: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    kw: 0, pv: false, app: false, rfid: false, load: false, brand: '',
  });
  const [sort, setSort] = useState<SortKey>('priceAsc');

  const toggle = (key: keyof Pick<Filters, 'pv' | 'app' | 'rfid' | 'load'>) =>
    setFilters((f) => ({ ...f, [key]: !f[key] }));

  const resetFilters = () =>
    setFilters({ kw: 0, pv: false, app: false, rfid: false, load: false, brand: '' });

  const activeFilterCount =
    (filters.kw !== 0 ? 1 : 0) +
    (filters.pv ? 1 : 0) +
    (filters.app ? 1 : 0) +
    (filters.rfid ? 1 : 0) +
    (filters.load ? 1 : 0) +
    (filters.brand !== '' ? 1 : 0);

  const filtered = useMemo(() => {
    let data = [...WALLBOXES_DATA];
    if (filters.kw !== 0) data = data.filter((w) => w.maxKw === filters.kw);
    if (filters.pv) data = data.filter((w) => w.hasSolarCharging);
    if (filters.app) data = data.filter((w) => w.hasApp);
    if (filters.rfid) data = data.filter((w) => w.hasRfid);
    if (filters.load) data = data.filter((w) => w.hasLoadManagement);
    if (filters.brand) data = data.filter((w) => w.brand === filters.brand);

    data.sort((a, b) => {
      if (sort === 'priceAsc') return a.priceEst - b.priceEst;
      if (sort === 'priceDesc') return b.priceEst - a.priceEst;
      if (sort === 'kwAsc') return a.maxKw - b.maxKw;
      if (sort === 'kwDesc') return b.maxKw - a.maxKw;
      return 0;
    });
    return data;
  }, [filters, sort]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Wallbox-Vergleich 2026: 20+ Heimladestationen im Überblick"
        description="Über 20 Wallboxen im herstellerunabhängigen Vergleich – filterbar nach Leistung, PV-Überschussladen, App, RFID und Marke. 11 kW vs. 22 kW, Förderstatus und Preise."
        canonicalPath="/wallbox-vergleich"
        schema={schema}
      />

      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-emerald-700 font-bold">
          <Zap className="w-4 h-4" />
          <span>Heimladestationen &amp; Photovoltaik</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight">
          Wallbox-Vergleich: 11-kW- &amp; 22-kW-Heimladestationen im Überblick
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Über 20 Wallboxen im redaktionell unabhängigen Vergleich – filterbar nach Leistung, PV-Überschussladen, App-Steuerung, RFID und Marke. Alle Preise sind unverbindliche Richtwerte.
        </p>
      </div>

      {/* Förderhinweis */}
      <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 leading-relaxed space-y-1.5">
        <div className="font-bold flex items-center gap-1.5 text-sm text-amber-900">
          <Info className="w-4 h-4 text-amber-700 shrink-0" />
          <span>Aktueller Hinweis zum Förderstatus (KfW &amp; Regionale Förderprogramme):</span>
        </div>
        <p className="text-slate-700">
          Die früheren bundesweiten KfW-Zuschussprogramme (440, 441, 442) sind beendet. Förderung ist aktuell primär über <strong>regionale Programme einzelner Bundesländer, Kommunen oder lokaler Stadtwerke</strong> möglich – bitte beim zuständigen Energieversorger anfragen.
        </p>
      </div>

      {/* ── Filter & Sort Bar ─────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
          <span>Filter &amp; Sortierung</span>
          {activeFilterCount > 0 && (
            <button
              onClick={resetFilters}
              className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 font-medium"
            >
              <X className="w-3.5 h-3.5" />
              Filter zurücksetzen ({activeFilterCount})
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Leistung */}
          {([0, 11, 22] as const).map((kw) => (
            <button
              key={kw}
              onClick={() => setFilters((f) => ({ ...f, kw }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                filters.kw === kw
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500'
              }`}
            >
              {kw === 0 ? 'Alle Leistungen' : `${kw} kW`}
            </button>
          ))}

          <span className="text-slate-200 hidden sm:block self-center">|</span>

          {/* Feature-Chips */}
          {(
            [
              { key: 'pv', label: 'PV-Überschuss', icon: <Sun className="w-3 h-3" /> },
              { key: 'app', label: 'App-Steuerung', icon: <Smartphone className="w-3 h-3" /> },
              { key: 'rfid', label: 'RFID', icon: <Shield className="w-3 h-3" /> },
              { key: 'load', label: 'Lastmanagement', icon: <Network className="w-3 h-3" /> },
            ] as { key: keyof Pick<Filters, 'pv' | 'app' | 'rfid' | 'load'>; label: string; icon: React.ReactNode }[]
          ).map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                filters[key]
                  ? 'bg-emerald-700 text-white border-emerald-700'
                  : 'bg-white text-slate-700 border-slate-300 hover:border-emerald-500'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 items-center pt-1 border-t border-slate-200">
          {/* Marke */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Marke:</label>
            <select
              value={filters.brand}
              onChange={(e) => setFilters((f) => ({ ...f, brand: e.target.value }))}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              <option value="">Alle Marken</option>
              {BRANDS.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Sortierung */}
          <div className="flex items-center gap-2 ml-auto">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">Sortierung:</label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="text-xs border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 focus:outline-none focus:border-emerald-500"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ergebnis-Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-mono">
          {filtered.length} von {WALLBOXES_DATA.length} Wallboxen angezeigt
        </p>
      </div>

      {/* Unabhängigkeitshinweis */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
        <strong>Redaktionell unabhängiger Marktüberblick:</strong> Alle Preisangaben sind unverbindliche Richtwerte (UVP bzw. durchschnittlicher Marktpreis). ladestandorte.de bietet diesen Vergleich rein informatorisch und unabhängig von Händlern oder Herstellern an.
      </div>

      {/* ── Wallboxen Grid ───────────────────────────────── */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 text-sm">
          <SlidersHorizontal className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p>Keine Wallboxen für diese Filterkombi gefunden.</p>
          <button onClick={resetFilters} className="mt-3 text-emerald-700 font-semibold underline text-xs">
            Alle Filter zurücksetzen
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((wb) => (
            <div
              key={wb.id}
              className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    {wb.maxKw} kW
                  </span>
                  <span className="text-lg font-black text-slate-950 font-mono">
                    ~ {wb.priceEst} €
                  </span>
                </div>

                <div>
                  <span className="text-xs font-mono text-slate-400 uppercase font-semibold">{wb.brand}</span>
                  <h2 className="text-xl font-black text-slate-950 tracking-tight mt-0.5">
                    {wb.name}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-1.5 text-xs">
                  {wb.hasSolarCharging && (
                    <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-medium">
                      <Sun className="w-3 h-3 text-amber-600" />
                      PV-Überschuss
                    </span>
                  )}
                  {wb.hasApp && (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded-md font-medium">
                      <Smartphone className="w-3 h-3 text-blue-600" />
                      App
                    </span>
                  )}
                  {wb.hasRfid && (
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-900 border border-purple-200 px-2 py-0.5 rounded-md font-medium">
                      <Shield className="w-3 h-3 text-purple-600" />
                      RFID
                    </span>
                  )}
                  {wb.hasLoadManagement && (
                    <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-200 px-2 py-0.5 rounded-md font-medium">
                      <Network className="w-3 h-3 text-slate-600" />
                      Lastmgmt.
                    </span>
                  )}
                  {wb.fundingEligible && (
                    <span className="inline-flex items-center gap-1 bg-green-50 text-green-900 border border-green-200 px-2 py-0.5 rounded-md font-medium" title={wb.fundingNote}>
                      Förderung mögl.
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  {wb.features.map((f) => (
                    <div key={f} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {wb.cableLengthM > 0 && (
                  <p className="text-[11px] text-slate-500 font-mono">
                    Kabel: {wb.cableLengthM} m (fest angeschlagen)
                  </p>
                )}
                {wb.cableLengthM === 0 && (
                  <p className="text-[11px] text-slate-500 font-mono">
                    Typ-2-Buchse (eigenes Kabel erforderlich)
                  </p>
                )}
              </div>

              <div className="pt-5 border-t border-slate-100 mt-4">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                  <span>Richtwert UVP:</span>
                  <span className="font-bold text-slate-900">ca. {wb.priceEst} €</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Affiliate Affiliate Section ───────────────────── */}
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50/40 p-6 sm:p-8 space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-950 tracking-tight">
            Wallboxen auf Amazon.de kaufen
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Eine Auswahl der oben verglichenen Wallboxen ist direkt auf Amazon.de erhältlich. Die nachfolgenden Links sind Affiliate-Links – beim Kauf über diese Links erhalten wir eine Provision ohne Mehrkosten für Sie.
          </p>
        </div>
        <AdPageNotice />
        <ProductLinks ids={WALLBOX_PRODUCT_IDS} title="Wallboxen" />
      </div>

      {/* PV-Dimensionierungshinweis */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 leading-relaxed space-y-2">
        <h3 className="font-extrabold text-slate-900 text-base">
          Wie viel Solarenergie wird für das Laden zu Hause benötigt?
        </h3>
        <p>
          Um ein Elektroauto an sonnigen Tagen ganz oder teilweise mit eigenem Dachstrom zu versorgen, wird in der Praxis meist eine Photovoltaikanlage ab etwa 6–10 kWp in Kombination mit einer steuerbaren Wallbox empfohlen. Den voraussichtlichen Jahresertrag für verschiedene Dachausrichtungen können Sie mit dem herstellerneutralen <a href="https://www.wattpeak.de/ertragsrechner" target="_blank" rel="noopener" className="font-bold text-emerald-800 underline hover:text-emerald-600">PV-Ertragsrechner auf wattpeak.de</a> berechnen.
        </p>
      </div>

      <CitationBox
        title="Wallbox-Vergleich: Heimladestationen mit PV-Überschussladen"
        urlPath="/wallbox-vergleich"
      />

      <EEATBadge
        topic="Heimladeinfrastruktur &amp; Wallbox-Installation"
        source1Title="Herstellerangaben &amp; Datenblätter"
        source1Text="Technische Spezifikationen laut offiziellen Herstellerdatenblättern (go-e, Heidelberg, Webasto, Easee, ABL, Keba, Mennekes, Fronius u. a.)."
        source2Title="Normen &amp; Installationsvorgaben"
        source2Text="Vorgaben nach DIN EN 61851-1, VDE-AR-N 4100 und Steuerbarkeit nach § 14a EnWG. Fachgerechte Installation durch eingetragene Elektrofachbetriebe erforderlich."
        dateText="Stand: Herstellerdaten 2026"
      />
    </div>
  );
};

export default WallboxVergleichPage;
