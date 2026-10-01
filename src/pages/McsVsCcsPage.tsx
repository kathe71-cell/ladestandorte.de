import React from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Zap,
  CheckCircle2,
  XCircle,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Scale
} from 'lucide-react';

export const McsVsCcsPage: React.FC = () => {
  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <nav className="border-b border-slate-200 bg-slate-50 py-3" aria-label="Breadcrumb">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-emerald-700 transition-colors">Startseite</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/mcs" className="hover:text-emerald-700 transition-colors">MCS &amp; E-Lkw</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">MCS vs. CCS</span>
        </div>
      </nav>

      {/* Header */}
      <header className="bg-slate-50 border-b border-slate-200 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-mono font-bold">
            <Scale className="w-4 h-4 text-emerald-800" />
            <span>Technologie-Vergleich</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-950 tracking-tight leading-tight">
            MCS vs. CCS: Unterschiede, Leistung &amp; Einsatzzwecke
          </h1>

          <p className="text-lg text-slate-700 leading-relaxed font-normal">
            Combined Charging System (CCS Combo 2) und Megawatt Charging System (MCS) im direkten Vergleich. Warum beide Systeme in der E-Mobilität koexistieren und welche Ladegeschwindigkeiten in der Praxis erreicht werden.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Vergleichstabelle */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-950">
            Direkter Kennzahlen-Vergleich
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-100 text-slate-900 font-mono text-xs uppercase border-b border-slate-200">
                <tr>
                  <th className="p-4 font-bold">Merkmal</th>
                  <th className="p-4 font-bold text-slate-700 bg-slate-50">CCS Combo 2</th>
                  <th className="p-4 font-bold text-emerald-800 bg-emerald-50/50">MCS (Megawatt Charging)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Hauptzielgruppe</td>
                  <td className="p-4 text-slate-700 bg-slate-50">Pkw, Vans, leichte Lkw</td>
                  <td className="p-4 font-semibold text-emerald-800 bg-emerald-50/50">Schwere Fernverkehr-Lkw (Klasse N3), Busse, Fähren</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Max. Ladeleistung</td>
                  <td className="p-4 font-mono text-slate-700 bg-slate-50">350 – 400 kW</td>
                  <td className="p-4 font-mono font-bold text-emerald-800 bg-emerald-50/50">bis 3.750 kW (3,75 MW)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Max. Dauerstrom</td>
                  <td className="p-4 font-mono text-slate-700 bg-slate-50">500 A (mit Kühlung)</td>
                  <td className="p-4 font-mono font-bold text-emerald-800 bg-emerald-50/50">bis 3.000 A</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Max. Spannungsebene</td>
                  <td className="p-4 font-mono text-slate-700 bg-slate-50">1.000 V DC</td>
                  <td className="p-4 font-mono font-bold text-emerald-800 bg-emerald-50/50">1.250 V DC</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Stecker-Geometrie</td>
                  <td className="p-4 text-slate-700 bg-slate-50">Typ 2 Oberteil + 2 DC-Pins</td>
                  <td className="p-4 text-slate-900 bg-emerald-50/50">Kompakte Dreiecksanordnung, verriegelbar</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Kühlung</td>
                  <td className="p-4 text-slate-700 bg-slate-50">Kabelgekühlt (ab 200 A)</td>
                  <td className="p-4 font-semibold text-slate-900 bg-emerald-50/50">Zweiweg (Kabel + Pin-Kühlung)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-900">Kommunikationsprotokoll</td>
                  <td className="p-4 font-mono text-slate-700 bg-slate-50">DIN 70121 / ISO 15118-2</td>
                  <td className="p-4 font-mono font-bold text-slate-900 bg-emerald-50/50">ISO 15118-20 (Ethernet-basiert)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-slate-950">
                    Beispiel-Ladedauer 600-kWh-Batterie (20–80 %)*
                    <span className="block text-[10px] text-slate-500 font-normal mt-0.5">Modellrechnung basierend auf durchschnittlicher Nettoleistung</span>
                  </td>
                  <td className="p-4 font-mono text-slate-700 bg-slate-50">ca. 70 – 90 Minuten</td>
                  <td className="p-4 font-mono font-bold text-emerald-800 bg-emerald-50/50">ca. 25 – 35 Minuten</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-slate-500 font-mono">
            * Modellrechnung. Die tatsächliche Ladezeit variiert abhängig von Fahrzeugmodell, Batterietemperatur, Ladekurve und Netzanschlusskapazität vor Ort.
          </p>
        </section>

        {/* Detailanalyse: Koexistenz */}
        <section className="space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-950">
            Koexistenz statt Verdrängung: Zwei Standards im Fernverkehr
          </h2>
          <p>
            MCS ersetzt das Combined Charging System nicht, sondern ergänzt es. Für schwere Nutzfahrzeuge im Fernverkehr sind je nach Einsatzbereich unterschiedliche Ladesysteme vorgesehen:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block">CCS am Lkw</span>
              <h3 className="font-bold text-slate-950 text-base">Depot- &amp; Übernachtladen</h3>
              <p className="text-xs text-slate-600">
                Im Betriebshof (Depot) oder bei nächtlichen 9- bis 11-Stunden-Pausen reicht CCS mit 50 bis 150 kW vollkommen aus, um den Akku schonend und netzfreundlich zu füllen.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-2">
              <span className="text-xs font-mono uppercase tracking-wider text-emerald-800 font-bold block">MCS am Lkw</span>
              <h3 className="font-bold text-slate-950 text-base">Unterwegs-Schnellladen (Opportunity)</h3>
              <p className="text-xs text-slate-600">
                Auf der Autobahnraststätte während der 45-minütigen Fahrerpause. Hier zählt jede Minute, um die Einsatzzeit des Lkw zu maximieren.
              </p>
            </div>
          </div>
          <p>
            Daher besitzen Pilot-Hubs wie Milence oder Aral pulse heute oft eine Kombination aus leistungsstarken 400-kW-CCS-Buchsen und neuen 1.000-kW-MCS-Ladeplätzen.
          </p>
        </section>

        {/* Warum kein MCS für Pkw? */}
        <section className="space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-950">
            Warum Pkw kein MCS benötigen
          </h2>
          <p>
            Pkw-Batterien haben eine Kapazität von typischerweise 50 bis 100 kWh. Selbst bei modernsten 800-Volt-Systemen (z. B. Porsche Taycan, Hyundai Ioniq 5) liegt die maximale Ladeleistung bei 250 bis 320 kW. Bei diesen Ladeleistungen dauert ein 10-auf-80-Prozent-Ladevorgang bereits nur 18 Minuten.
          </p>
          <p>
            Ein MCS-Anschluss an einem Pkw würde unnötiges Gewicht, teurere Schütze und aufwändigere Kühlsysteme im Fahrzeug erfordern, ohne einen spürbaren Zeitgewinn zu bieten.
          </p>
        </section>

        {/* Links */}
        <section className="border-t border-slate-200 pt-8 flex flex-wrap gap-4">
          <Link
            to="/mcs/lkw-laden"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all"
          >
            <span>Lkw-Laden &amp; Lenkzeiten verstehen</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/mcs/ladestationen"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all"
          >
            <span>Zu den MCS-Standorten</span>
          </Link>
        </section>

      </main>
    </div>
  );
};

export default McsVsCcsPage;
