import React from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Truck,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Cpu,
  Layers,
  Thermometer,
  Gauge
} from 'lucide-react';
import { PageHero } from '../components/PageHero';

export const McsWhatIsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <PageHero
        level={3}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'MCS & E-Lkw', href: '/mcs' },
          { label: 'Was ist MCS?', isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-mono font-bold">
            <Cpu className="w-4 h-4 text-emerald-800" />
            <span>Technologie-Standard · CharIN &amp; ISO 15118-20</span>
          </div>
        }
        title="Was ist das Megawatt Charging System (MCS)?"
        description="Das Megawatt Charging System (MCS) ist der weltweite Standard von CharIN für schwere Nutzfahrzeuge, Fernverkehr-Lkw, Busse, Fähren und Arbeitsmaschinen. CharIN nennt für MCS bis zu 1.250 V DC und 3.000 A DC; daraus ergibt sich rechnerisch eine theoretische Höchstleistung von bis zu 3,75 MW (3.750 kW). Erste Pilot- und Serien-Stationen in Deutschland stellen heute praxisgerechte 1.000 bis 1.200 kW bereit."
      />

      {/* Content */}
      <div className="space-y-12">
        
        {/* Key Specs Matrix */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-950">
            CharIN-Spezifikation &amp; Grenzwerte im Überblick
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-mono text-slate-500 block uppercase">Max. Normleistung</span>
              <span className="text-2xl font-black text-slate-950 font-mono mt-1 block">bis 3,75 MW</span>
              <span className="text-[11px] text-slate-500">Rechnerische Obergrenze</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-mono text-slate-500 block uppercase">Max. Stromstärke</span>
              <span className="text-2xl font-black text-emerald-800 font-mono mt-1 block">bis 3.000 A</span>
              <span className="text-[11px] text-slate-500">Aktiv flüssigkeitsgekühlt</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-mono text-slate-500 block uppercase">Max. Spannung</span>
              <span className="text-2xl font-black text-slate-950 font-mono mt-1 block">bis 1.250 V</span>
              <span className="text-[11px] text-slate-500">DC Gleichstrom</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-mono text-slate-500 block uppercase">Kommunikation</span>
              <span className="text-2xl font-black text-slate-950 font-mono mt-1 block">Ethernet</span>
              <span className="text-[11px] text-slate-500">ISO 15118-20</span>
            </div>
          </div>
        </section>

        {/* Text Section 1: Warum MCS notwendig ist */}
        <section className="space-y-4 text-slate-700 text-base leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-950">
            Warum Pkw-Schnelllader (CCS) für Fernverkehrs-Lkw nicht ausreichen
          </h2>
          <p>
            Moderne batterieelektrische Fernverkehrs-Lkw (wie der Mercedes-Benz eActros 600, MAN eTruck oder Scania 45 R) besitzen Batteriekapazitäten von 500 bis über 800 Kilowattstunden (kWh). An einer herkömmlichen Pkw-Schnellladesäule mit Combined Charging System (CCS) und 350 bis 400 kW maximaler Ladeleistung dauert ein Nachladevorgang von 20 auf 80 Prozent rund 60 bis 90 Minuten.
          </p>
          <p>
            Nach den gesetzlichen EU-Lenk- und Ruhezeitenvorschriften (Verordnung EG Nr. 561/2006) müssen Lkw-Fahrer nach spätestens 4,5 Stunden reiner Lenkzeit eine ununterbrochene Pause von mindestens 45 Minuten einlegen.
          </p>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-sm space-y-1">
            <p><strong>Das Kernziel von MCS:</strong> Ein vollständiger Ladehub für ca. 350 bis 400 km reale Lkw-Reichweite innerhalb der vorgeschriebenen 45-Minuten-Lenkzeitpause. Dafür sind reale Dauerladeleistungen von 750 bis 1.000+ kW erforderlich.</p>
            <p className="text-[11px] text-emerald-800 font-mono">* Modellrechnung. Die tatsächliche Ladedauer hängt vom individuellen Fahrzeugmodell, der Batteriekapazität, der fahrzeugseitigen Ladekurve, dem Ausgangs-SoC und der Netzanschlussleistung ab.</p>
          </div>
        </section>

        {/* Text Section 2: Stecker und Kühlung */}
        <section className="space-y-4 text-slate-700 text-base leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-950">
            Stecker-Geometrie und Flüssigkeitskühlung
          </h2>
          <p>
            Um Ströme von bis zu 3.000 Ampere sicher übertragen zu können, reicht eine passive Luftkühlung wie bei früheren Pkw-Ladesteckern nicht mehr aus. Das MCS-Ladesystem setzt auf:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Kompakte, dreieckig angeordnete Kontakte:</strong> Die Pins sind mechanisch robust gegen wiederholtes Stecken unter rauen Witterungsbedingungen ausgelegt.
            </li>
            <li>
              <strong>Zweiweg-Flüssigkeitskühlung:</strong> Sowohl das Ladekabel als auch die Steckerkontakte werden im Betrieb aktiv durch ein Kühlmittel (Glykol-Wasser-Gemisch) temperiert, um Überhitzung zu verhindern.
            </li>
            <li>
              <strong>Ergonomisches Kabelmanagement:</strong> Da flüssigkeitsgekühlte Megawatt-Kabel ein Eigengewicht von mehreren Kilogramm besitzen, verfügen MCS-Stationen über Balancer-Ausleger, die das Gewicht beim Einstecken kompensieren.
            </li>
          </ul>
        </section>

        {/* Normierung & Standardisierung */}
        <section className="space-y-4 text-slate-700 text-base leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-950">
            Standardisierung durch CharIN
          </h2>
          <p>
            Das System wurde federführend von der Charging Interface Initiative (CharIN e. V.) in enger Zusammenarbeit mit Fahrzeugherstellern (u. a. Daimler Truck, Traton/MAN/Scania, Volvo Trucks) und Ladesäulenbauern (u. a. Alpitronic, ABB E-mobility, Kempower, Siemens) spezifiziert.
          </p>
          <p>
            Die digitale Kommunikation zwischen Lkw und Ladesäule erfolgt über High-Speed-Ethernet nach ISO 15118-20, wodurch auch automatisierte Authentifizierung (Plug &amp; Charge / AutoCharge) und bidirektionale Energierückspeisung (V2G) standardmäßig unterstützt werden.
          </p>
        </section>

        {/* Weiterführende Links */}
        <section className="border-t border-slate-200 pt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            to="/mcs/mcs-vs-ccs"
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-white transition-all group"
          >
            <span className="text-xs font-mono uppercase text-slate-500 font-bold block mb-1">Direkter Vergleich</span>
            <span className="text-base font-bold text-slate-950 group-hover:text-emerald-800 transition-colors block">
              MCS vs. CCS im Detailvergleich →
            </span>
            <span className="text-xs text-slate-600 mt-1 block">
              Technische Daten, Steckermaße und Ladezeiten gegenübergestellt.
            </span>
          </Link>

          <Link
            to="/mcs/ladestationen"
            className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 hover:bg-white transition-all group"
          >
            <span className="text-xs font-mono uppercase text-slate-500 font-bold block mb-1">Standorte in Deutschland</span>
            <span className="text-base font-bold text-slate-950 group-hover:text-emerald-800 transition-colors block">
              MCS-Ladeparks Verzeichnis →
            </span>
            <span className="text-xs text-slate-600 mt-1 block">
              Alle aktiven und im Bau befindlichen Megawatt-Hubs an den Autobahnen.
            </span>
          </Link>
        </section>

      </div>
    </div>
  );
};

export default McsWhatIsPage;
