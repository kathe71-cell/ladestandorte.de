import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Calculator, Zap, Clock, Euro, Check, Code, Share2, Car, Sparkles, AlertTriangle, Info } from 'lucide-react';
import { VEHICLES_DATA } from '../data/vehicles';

interface Props {
  isEmbed?: boolean;
}

// Robust query parameter parsing with fallback and bounds checking
function parseNum(val: string | null, fallback: number, min?: number, max?: number): number {
  if (val === null || val === undefined || val === '') return fallback;
  const num = Number(val);
  if (isNaN(num)) return fallback;
  if (min !== undefined && num < min) return min;
  if (max !== undefined && num > max) return max;
  return num;
}

export const CalculatorEmbed: React.FC<Props> = ({ isEmbed = false }) => {
  const [searchParams] = useSearchParams();

  // State defaults or safely parsed from URL query
  const [batteryCapacity, setBatteryCapacity] = useState<number>(() => {
    return parseNum(searchParams.get('capacity'), 75, 20, 130);
  });

  const [chargePower, setChargePower] = useState<number>(() => {
    return parseNum(searchParams.get('kw'), 150, 3, 400);
  });

  const [startSoc, setStartSoc] = useState<number>(() => {
    return parseNum(searchParams.get('start'), 10, 0, 95);
  });

  const [endSoc, setEndSoc] = useState<number>(() => {
    return parseNum(searchParams.get('end'), 80, 5, 100);
  });

  const [pricePerKwh, setPricePerKwh] = useState<number>(() => {
    return parseNum(searchParams.get('price'), 0.49, 0.1, 2.0);
  });

  const [currentLossPercent, setCurrentLossPercent] = useState<number>(() => {
    return chargePower > 22 ? 6 : 12;
  });

  const [linkCopied, setLinkCopied] = useState(false);
  const [embedCopied, setEmbedCopied] = useState(false);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>('tesla-model-y-lr');

  const selectedVehicle = VEHICLES_DATA.find(v => v.id === selectedVehicleId);

  const handleVehicleSelect = (id: string) => {
    setSelectedVehicleId(id);
    const vehicle = VEHICLES_DATA.find(v => v.id === id);
    if (vehicle) {
      setBatteryCapacity(vehicle.batteryNetKwh);
      if (chargePower <= 22) {
        setChargePower(vehicle.maxKwAc);
      } else {
        setChargePower(Math.min(vehicle.maxKwDc, 300));
      }
      setStartSoc(10);
      setEndSoc(80);
    }
  };

  const location = useLocation();
  const isRechnerPage = location.pathname === '/rechner';

  // Smooth URL state synchronization via window.history.replaceState:
  // Updates browser address bar for shareable link WITHOUT triggering React Router re-render cascades
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isRechnerPage && !isEmbed) {
      const params = new URLSearchParams();
      params.set('capacity', String(batteryCapacity));
      params.set('kw', String(chargePower));
      params.set('start', String(startSoc));
      params.set('end', String(endSoc));
      params.set('price', String(pricePerKwh));
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState(null, '', newUrl);
    } else if (location.pathname === '/' && window.location.search.includes('capacity')) {
      window.history.replaceState(null, '', '/');
    }
  }, [batteryCapacity, chargePower, startSoc, endSoc, pricePerKwh, isEmbed, isRechnerPage, location.pathname]);

  // Adjust loss percentage when switching between AC and HPC
  useEffect(() => {
    if (chargePower > 22) {
      setCurrentLossPercent(6);
    } else {
      setCurrentLossPercent(12);
    }
  }, [chargePower]);

  // Detection of manual adjustments
  const isCustomCapacity = selectedVehicle ? batteryCapacity !== selectedVehicle.batteryNetKwh : false;
  const isCustomKw = selectedVehicle ? (
    chargePower <= 22 
      ? chargePower !== selectedVehicle.maxKwAc 
      : chargePower !== Math.min(selectedVehicle.maxKwDc, 300)
  ) : false;

  // Validation: startSoc must be strictly less than endSoc
  const isInvalidSoc = startSoc >= endSoc;

  // Effective charging power calculation
  const vehicleAcLimit = selectedVehicle?.maxKwAc ?? 11;
  const vehicleDcLimit = selectedVehicle?.maxKwDc ?? chargePower;

  let effectiveAverageKw = 11;
  let isAcCapped = false;
  let isDcCapped = false;

  if (chargePower <= 22) {
    // AC charging: strictly capped by vehicle's on-board AC converter
    effectiveAverageKw = Math.min(chargePower, vehicleAcLimit);
    if (chargePower > vehicleAcLimit) {
      isAcCapped = true;
    }
  } else {
    // DC fast charging (HPC): capped by vehicle DC peak & realistic curve factor
    const peakDc = Math.min(chargePower, vehicleDcLimit);
    if (chargePower > vehicleDcLimit) {
      isDcCapped = true;
    }
    // 800V architectures (Taycan, Ioniq 5, EV6) hold higher average charging curve (~82%)
    // 400V architectures drop to ~76% average power over 10-80% SoC
    const curveFactor = selectedVehicle?.systemVoltage === 800 ? 0.82 : (peakDc > 150 ? 0.76 : 0.82);
    effectiveAverageKw = Math.max(1, peakDc * curveFactor);
  }

  // Net and gross energy calculation (Loss definition: markup on net energy stored)
  const socDeltaPercent = isInvalidSoc ? 0 : endSoc - startSoc;
  const netEnergyKwh = isInvalidSoc ? 0 : (batteryCapacity * socDeltaPercent) / 100;
  const grossEnergyKwh = isInvalidSoc ? 0 : netEnergyKwh * (1 + currentLossPercent / 100);
  const lossKwh = isInvalidSoc ? 0 : grossEnergyKwh - netEnergyKwh;
  const totalCostEur = isInvalidSoc ? 0 : grossEnergyKwh * pricePerKwh;

  const durationHours = isInvalidSoc || effectiveAverageKw <= 0 ? 0 : grossEnergyKwh / effectiveAverageKw;
  const durationMinutes = isInvalidSoc ? 0 : Math.round(durationHours * 60);

  const vehicleConsumption = selectedVehicle?.consumptionKwhPer100Km ?? 17.5;
  const rangeGainKm = isInvalidSoc ? 0 : Math.round((netEnergyKwh / vehicleConsumption) * 100);

  const handleCopyLink = () => {
    const url = `${window.location.origin}/rechner?capacity=${batteryCapacity}&kw=${chargePower}&start=${startSoc}&end=${endSoc}&price=${pricePerKwh}`;
    navigator.clipboard.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleCopyEmbed = () => {
    const iframeCode = `<iframe src="https://www.ladestandorte.de/rechner-embed?capacity=${batteryCapacity}&kw=${chargePower}&start=${startSoc}&end=${endSoc}&price=${pricePerKwh}" width="100%" height="680" style="border:1px solid #e2e8f0;border-radius:16px;max-width:720px;display:block;margin:auto;" title="Ladezeit- & Ladekostenrechner ladestandorte.de"></iframe><p style="font-size:12px;text-align:center;color:#64748b;margin-top:8px;">Bereitgestellt von <a href="https://www.ladestandorte.de" target="_blank" style="color:#059669;font-weight:bold;">ladestandorte.de</a></p>`;
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
            Beispielhafte Modellrechnung für Ladedauer, Ladeverluste und Ladekosten für Elektrofahrzeuge.
          </p>
        </div>

        {!isEmbed && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors min-h-[40px] cursor-pointer"
              aria-label="Link mit Konfiguration kopieren"
            >
              {linkCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
              <span>{linkCopied ? 'Kopiert!' : 'Konfiguration teilen'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyEmbed}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors min-h-[40px] cursor-pointer"
              aria-label="Widget Einbettungscode kopieren"
            >
              {embedCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Code className="w-4 h-4" />}
              <span>{embedCopied ? 'Code kopiert!' : 'Embed Widget'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Validation Banner if Start SoC >= End SoC */}
      {isInvalidSoc && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-950 flex items-start gap-3 animate-in fade-in duration-200">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <strong className="font-bold block">Ungültiger Ladebereich:</strong>
            <p>
              Der Start-Ladestand ({startSoc} %) muss kleiner sein als der Ziel-Ladestand ({endSoc} %). Die Berechnung wurde gestoppt. Bitte passen Sie die Regler an.
            </p>
          </div>
        </div>
      )}

      {/* Interactive Controls & Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Controls Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Fahrzeug-Schnellwähler */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-3">
            <div className="flex items-center justify-between">
              <label htmlFor="vehicle-select" className="text-xs font-mono uppercase tracking-wider text-slate-700 font-bold flex items-center gap-1.5">
                <Car className="w-4 h-4 text-emerald-600" />
                <span>Fahrzeug-Schnellwähler:</span>
              </label>
              {selectedVehicle && selectedVehicle.systemVoltage === 800 ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold font-mono bg-purple-100 text-purple-900 border border-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                  <span>800V System (Sehr flache Ladekurve)</span>
                </span>
              ) : selectedVehicle ? (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono bg-slate-200 text-slate-700">
                  400V System
                </span>
              ) : null}
            </div>

            <select
              id="vehicle-select"
              value={selectedVehicleId}
              onChange={(e) => handleVehicleSelect(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-900 shadow-xs cursor-pointer"
            >
              <option value="">-- Individuelles Fahrzeug (Manuell anpassen) --</option>
              {VEHICLES_DATA.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.brand} {v.model} – {v.variant} (Peak {v.maxKwDc} kW DC / {v.maxKwAc} kW AC)
                </option>
              ))}
            </select>

            {selectedVehicle && (
              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-600 pt-1 border-t border-slate-200/60 font-medium">
                <span>Ø Verbrauch: <strong>{selectedVehicle.consumptionKwhPer100Km} kWh/100km</strong></span>
                <span>·</span>
                <span>Max. DC-Peak: <strong>{selectedVehicle.maxKwDc} kW</strong></span>
                <span>·</span>
                <span>Max. AC-Lader: <strong>{selectedVehicle.maxKwAc} kW</strong></span>
                <span>·</span>
                <span>Werksangabe 10–80 %: <strong className="text-emerald-700">~{selectedVehicle.typical10to80Min} Min.</strong></span>
              </div>
            )}
          </div>

          {/* Battery Capacity */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="capacity-range" className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>Akkukapazität (netto nutzbar):</span>
                {isCustomCapacity && (
                  <span className="text-[10px] font-mono text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded font-semibold">
                    (manuell angepasst)
                  </span>
                )}
              </label>
              <span className="font-mono font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md text-base">
                {batteryCapacity} kWh netto
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
              <span>75–77 kWh (Mittelklasse)</span>
              <span>130 kWh (Oberklasse)</span>
            </div>
          </div>

          {/* Ladeleistung in kW */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <label htmlFor="kw-range" className="font-bold text-slate-800 flex items-center gap-1.5">
                <span>Ladesäulen-Nennleistung:</span>
                {isCustomKw && (
                  <span className="text-[10px] font-mono text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded font-semibold">
                    (manuell angepasst)
                  </span>
                )}
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition-colors cursor-pointer ${
                    chargePower === kw
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {kw} kW {kw <= 22 ? 'AC' : 'HPC'}
                </button>
              ))}
            </div>

            {/* Vehicle Limitation Warnings */}
            {isAcCapped && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Fahrzeuglimit AC:</strong> Der bordeigene AC-Lader Ihres Fahrzeugs limitiert auf max. <strong>{vehicleAcLimit} kW</strong> (trotz {chargePower} kW Säule).
                </span>
              </div>
            )}
            {isDcCapped && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Fahrzeuglimit DC:</strong> Die maximale DC-Ladeleistung Ihres Fahrzeugs liegt bei <strong>{vehicleDcLimit} kW</strong> (trotz {chargePower} kW Säule).
                </span>
              </div>
            )}
          </div>

          {/* State of Charge (SoC) Slider Range */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="start-soc" className="text-xs font-bold text-slate-700 block">
                Start-Ladestand (SoC): <span className="font-mono font-black text-slate-900">{startSoc} %</span>
              </label>
              <input
                id="start-soc"
                type="range"
                min="0"
                max="95"
                step="5"
                value={startSoc}
                onChange={(e) => setStartSoc(Number(e.target.value))}
                className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="end-soc" className="text-xs font-bold text-slate-700 block">
                Ziel-Ladestand (SoC): <span className="font-mono font-black text-slate-900">{endSoc} %</span>
              </label>
              <input
                id="end-soc"
                type="range"
                min="5"
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
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    Math.abs(pricePerKwh - item.p) < 0.005
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Modellannahmen (Stand: September 2026). Reale Preise variieren je nach Ladekarte, Roaming-Aufschlag und Blockiergebühren.
            </p>
          </div>

        </div>

        {/* Results Panel (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between space-y-6">
          
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold block mb-1">
              Modellrechnung Ergebnis
            </span>
            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
              {totalCostEur.toFixed(2).replace('.', ',')} €
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Gesamtkosten für {grossEnergyKwh.toFixed(1).replace('.', ',')} kWh brutto (ab Ladesäule)
            </p>
          </div>

          <div className="space-y-3.5 border-t border-slate-800 pt-4">
            
            {/* Ladedauer */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Geschätzte Ladedauer:</span>
              </div>
              <span className="text-lg font-black text-white font-mono">
                {isInvalidSoc ? '0 min' : durationMinutes >= 60 ? `${Math.floor(durationMinutes / 60)}h ${durationMinutes % 60}m` : `${durationMinutes} min`}
              </span>
            </div>

            {/* Effektive Ø Leistung */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Effektive Ø Leistung:</span>
              <span className="font-mono text-slate-200 font-bold">
                {isInvalidSoc ? '0 kW' : `~ ${effectiveAverageKw.toFixed(0)} kW`}
                {isAcCapped && ` (AC-Limit ${vehicleAcLimit} kW)`}
                {isDcCapped && ` (DC-Limit ${vehicleDcLimit} kW)`}
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

            {/* Ladeverluste (Eindeutige Definition als Aufschlag) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Ladeverlust (+{currentLossPercent} %):</span>
              </div>
              <span className="text-sm font-bold text-amber-400 font-mono">
                + {lossKwh.toFixed(1).replace('.', ',')} kWh
              </span>
            </div>

            {/* Reichweitengewinn */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-300 text-sm">
                <Euro className="w-4 h-4 text-emerald-400" />
                <span>Ca. Reichweitengewinn:</span>
              </div>
              <span className="text-sm font-bold text-emerald-400 font-mono">
                + {rangeGainKm} km (bei Ø {vehicleConsumption.toFixed(1).replace('.', ',')} kWh/100km)
              </span>
            </div>

          </div>

          {/* Legal Note & Loss equation definition */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 leading-normal space-y-1.5">
            <p>
              * Unverbindliche Modellrechnung. Die geschätzte Ladezeit und reale Ladeleistung hängen maßgeblich vom individuellen Fahrzeugmodell, der herstellerspezifischen Ladekurve, Akkutemperatur, Vorkonditionierung und der tatsächlich vom Ladepunkt bereitgestellten Leistung ab.
            </p>
            <p className="text-[10px] text-slate-500">
              Modellannahme Ladekurve: Die durchschnittliche Ladeleistung wird im Modell vereinfacht über einen Ladekurvenfaktor geschätzt (ca. 76 % bis 82 % der Spitzenleistung im Bereich 10–80 % SoC).
            </p>
            <p className="text-[10px] text-slate-500">
              Modellannahme Ladeverluste: Rechnerischer Aufschlag auf die Nettoenergie von 6 % (DC-Schnellladen) bzw. 12 % (AC-Normalladen). Reale Verluste können je nach Außentemperatur, Bordlader-Wirkungsgrad und Ladekabelkühlung abweichen.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CalculatorEmbed;
