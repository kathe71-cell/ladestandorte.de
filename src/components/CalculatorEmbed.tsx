import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Calculator, Zap, Clock, Euro, Copy, Check, Code, Share2 } from 'lucide-react';

interface Props {
  isEmbed?: boolean;
}

export const CalculatorEmbed: React.FC<Props> = ({ isEmbed = false }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // State defaults or from URL query
  const [batteryCapacity, setBatteryCapacity] = useState<number>(() => {
    const val = Number(searchParams.get('capacity'));
    return val && val > 0 ? val : 77; // Standardz. B. VW ID.4 / Tesla Model 3 Long Range
  });

  const [chargePower, setChargePower] = useState<number>(() => {
    const val = Number(searchParams.get('kw'));
    return val && val > 0 ? val : 150; // Standard 150 kW HPC
  });

  const [startSoc, setStartSoc] = useState<number>(() => {
    const val = Number(searchParams.get('start'));
    return val !== null && !isNaN(val) ? val : 10;
  });

  const [endSoc, setEndSoc] = useState<number>(() => {
    const val = Number(searchParams.get('end'));
    return val && val > 0 ? val : 80;
  });

  const [pricePerKwh, setPricePerKwh] = useState<number>(() => {
    const val = Number(searchParams.get('price'));
    return val && val > 0 ? val : 0.49;
  });

  const [currentLossPercent, setCurrentLossPercent] = useState<number>(() => {
    // DC usually 5-8%, AC usually 10-15%
    return chargePower > 22 ? 6 : 12;
  });

  const [linkCopied, setLinkCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);

  const location = useLocation();
  const isRechnerPage = location.pathname === '/rechner';

  // Only sync to URL state on the dedicated /rechner page, NEVER on the homepage!
  useEffect(() => {
    if (isRechnerPage && !isEmbed) {
      const params = new URLSearchParams();
      params.set('capacity', String(batteryCapacity));
      params.set('kw', String(chargePower));
      params.set('start', String(startSoc));
      params.set('end', String(endSoc));
      params.set('price', String(pricePerKwh));
      setSearchParams(params, { replace: true });
    } else if (location.pathname === '/' && searchParams.has('capacity')) {
      // Clean up homepage URL if params were previously attached
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('capacity');
      newParams.delete('kw');
      newParams.delete('start');
      newParams.delete('end');
      newParams.delete('price');
      setSearchParams(newParams, { replace: true });
    }
  }, [batteryCapacity, chargePower, startSoc, endSoc, pricePerKwh, isEmbed, isRechnerPage, location.pathname, searchParams, setSearchParams]);

  // Adjust loss percentage when switching between AC and HPC
  useEffect(() => {
    if (chargePower > 22) {
      setCurrentLossPercent(6);
    } else {
      setCurrentLossPercent(12);
    }
  }, [chargePower]);

  // Calculations
  const socDeltaPercent = Math.max(0, endSoc - startSoc);
  const netEnergyKwh = (batteryCapacity * socDeltaPercent) / 100;
  const grossEnergyKwh = netEnergyKwh * (1 + currentLossPercent / 100);
  const totalCostEur = grossEnergyKwh * pricePerKwh;

  // Realistic charging speed curve estimation (effective average kW)
  // At >80% speed drops, at peak it might be near max
  const effectiveAverageKw = chargePower > 150 
    ? Math.min(chargePower * 0.78, 220) 
    : chargePower > 22 
    ? chargePower * 0.85 
    : chargePower;

  const durationHours = grossEnergyKwh / effectiveAverageKw;
  const durationMinutes = Math.round(durationHours * 60);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/rechner?capacity=${batteryCapacity}&kw=${chargePower}&start=${startSoc}&end=${endSoc}&price=${pricePerKwh}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleCopyEmbed = () => {
    const iframeCode = `<iframe src="https://ladestandorte.de/rechner-embed?capacity=${batteryCapacity}&kw=${chargePower}&start=${startSoc}&end=${endSoc}&price=${pricePerKwh}" width="100%" height="680" style="border:1px solid #e2e8f0;border-radius:16px;max-width:720px;display:block;margin:auto;" title="Ladezeit- & Ladekostenrechner ladestandorte.de"></iframe><p style="font-size:12px;text-align:center;color:#64748b;margin-top:8px;">Bereitgestellt von <a href="https://ladestandorte.de" target="_blank" style="color:#059669;font-weight:bold;">ladestandorte.de</a></p>`;
    navigator.clipboard.writeText(iframeCode);
    setEmbedCopied(true);
    setTimeout(() => setEmbedCopied(false), 2500);
  };

  return (
    <div className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden ${isEmbed ? 'p-4 sm:p-6' : 'p-6 sm:p-8'}`}>
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Calculator className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
              Ladezeit- &amp; Kostenrechner
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulieren Sie präzise Ladedauer, Ladeverluste und Gesamtkosten für Ihr Elektroauto.
          </p>
        </div>

        {!isEmbed && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors min-h-[40px]"
              aria-label="Link mit Konfiguration kopieren"
            >
              {linkCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{linkCopied ? 'Kopiert!' : 'Konfiguration teilen'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyEmbed}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors min-h-[40px]"
              aria-label="Widget Einbettungscode kopieren"
            >
              {embedCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Code className="w-4 h-4" />}
              <span>{embedCopied ? 'Code kopiert!' : 'Embed Widget'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Interactive Controls & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Battery Capacity */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="capacity-range" className="font-bold text-slate-800">
                Akkukapazität (netto / nutzbar):
              </label>
              <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md text-base">
                {batteryCapacity} kWh
              </span>
            </div>
            <input
              id="capacity-range"
              type="range"
              min="20"
              max="130"
              step="1"
              value={batteryCapacity}
              onChange={(e) => setBatteryCapacity(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>20 kWh (Kleinwagen)</span>
              <span>77 kWh (Mittelklasse)</span>
              <span>130 kWh (Oberklasse)</span>
            </div>
          </div>

          {/* Ladeleistung in kW */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="kw-range" className="font-bold text-slate-800">
                Ladeleistung (Ladesäule / Wallbox):
              </label>
              <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md text-base">
                {chargePower} kW {chargePower > 22 ? '(DC Schnelllader)' : '(AC Normallader)'}
              </span>
            </div>
            <input
              id="kw-range"
              type="range"
              min="3"
              max="400"
              step={chargePower > 50 ? 10 : 1}
              value={chargePower}
              onChange={(e) => setChargePower(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[11, 22, 50, 150, 300, 400].map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => setChargePower(kw)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors ${
                    chargePower === kw
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {kw} kW {kw <= 22 ? 'AC' : 'HPC'}
                </button>
              ))}
            </div>
          </div>

          {/* State of Charge (SoC) Slider Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Start-Ladestand (SoC): <span className="font-mono font-black text-slate-900">{startSoc} %</span>
              </label>
              <input
                type="range"
                min="0"
                max={endSoc - 5}
                step="5"
                value={startSoc}
                onChange={(e) => setStartSoc(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Ziel-Ladestand (SoC): <span className="font-mono font-black text-slate-900">{endSoc} %</span>
              </label>
              <input
                type="range"
                min={startSoc + 5}
                max="100"
                step="5"
                value={endSoc}
                onChange={(e) => setEndSoc(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Strompreis je kWh */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="price-range" className="font-bold text-slate-800">
                Strompreis je Kilowattstunde:
              </label>
              <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md text-base">
                {pricePerKwh.toFixed(2).replace('.', ',')} € / kWh
              </span>
            </div>
            <input
              id="price-range"
              type="range"
              min="0.25"
              max="0.89"
              step="0.01"
              value={pricePerKwh}
              onChange={(e) => setPricePerKwh(Number(e.target.value))}
              className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
            />
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                { label: 'Hausstrom (0,32 €)', p: 0.32 },
                { label: 'AC Öffentlich (0,44 €)', p: 0.44 },
                { label: 'EnBW HPC (0,49 €)', p: 0.49 },
                { label: 'Ionity / Ad-hoc (0,69 €)', p: 0.69 }
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setPricePerKwh(item.p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                    Math.abs(pricePerKwh - item.p) < 0.005
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Results Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6">
          
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
              Berechnungsergebnis
            </span>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
              {totalCostEur.toFixed(2).replace('.', ',')} €
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Gesamtkosten für {grossEnergyKwh.toFixed(1).replace('.', ',')} kWh brutto
            </p>
          </div>

          <div className="space-y-3.5 border-t border-slate-800 pt-4">
            
            {/* Ladedauer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Geschätzte Ladezeit:</span>
              </div>
              <span className="text-lg font-black text-white font-mono">
                {durationMinutes >= 60 ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m` : `${durationMinutes} min`}
              </span>
            </div>

            {/* Geladene Netto-Energie */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Zap className="w-4 h-4 text-emerald-400" />
                <span>Netto im Akku ({socDeltaPercent} %):</span>
              </div>
              <span className="text-sm font-bold text-white font-mono">
                {netEnergyKwh.toFixed(1).replace('.', ',')} kWh
              </span>
            </div>

            {/* Ladeverluste */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Ladeverlust ({currentLossPercent} %):</span>
              </div>
              <span className="text-sm font-bold text-amber-400 font-mono">
                + {(grossEnergyKwh - netEnergyKwh).toFixed(1).replace('.', ',')} kWh
              </span>
            </div>

            {/* Reichweitengewinn */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Euro className="w-4 h-4 text-emerald-400" />
                <span>Ca. Reichweitengewinn:</span>
              </div>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                + {Math.round((netEnergyKwh / 18) * 100)} km (bei 18 kWh/100km)
              </span>
            </div>

          </div>

          {/* Legal Note */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-normal">
            * Modellrechnung. Die tatsächliche Ladezeit und Kosten hängen von Außentemperatur, Batterievorkonditionierung, Fahrzeug-Ladekurve und CPO-Tarifen ab.
          </div>

        </div>

      </div>

    </div>
  );
};

export default CalculatorEmbed;
