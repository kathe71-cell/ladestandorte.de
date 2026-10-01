import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Truck,
  Zap,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  BatteryCharging,
  Compass
} from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { SEO } from '../components/SEO';

export const McsTruckChargingPage: React.FC = () => {
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
            "name": "MCS & E-Lkw",
            "item": "https://www.ladestandorte.de/mcs"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": "Lkw-Laden & Lenkzeiten",
            "item": "https://www.ladestandorte.de/mcs/lkw-laden"
          }
        ]
      },
      {
        "@type": "Article",
        "@id": "https://www.ladestandorte.de/mcs/lkw-laden#article",
        "headline": "Lkw-Laden im Fernverkehr: Die 45-Minuten-Pause optimal nutzen",
        "description": "Logistische und verkehrsrechtliche Analyse: Wie E-Lkw-Laden mit den gesetzlichen Lenk- und Ruhezeiten nach EG 561/2006 harmoniert. Nachlademengen und Drive-Through-Infrastruktur.",
        "url": "https://www.ladestandorte.de/mcs/lkw-laden",
        "inLanguage": "de-DE",
        "publisher": {
          "@type": "Organization",
          "@id": "https://www.ladestandorte.de/#org",
          "name": "ladestandorte.de",
          "url": "https://www.ladestandorte.de/"
        },
        "mainEntityOfPage": "https://www.ladestandorte.de/mcs/lkw-laden"
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title="Lkw-Laden & 45-Minuten-Pause: Logistik im Fernverkehr"
        description="Wie E-Lkw-Laden mit den gesetzlichen Lenk- und Ruhezeiten nach EG 561/2006 harmoniert. Nachlademengen, Drive-Through-Buchten und Depot vs. Highway."
        canonicalPath="/mcs/lkw-laden"
        schema={schema}
      />
      <PageHero
        level={3}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'MCS & E-Lkw', href: '/mcs' },
          { label: 'Lkw-Laden & Lenkzeiten', isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs font-mono font-bold">
            <Clock className="w-4 h-4 text-emerald-800" />
            <span>Logistik &amp; Verkehrsrecht</span>
          </div>
        }
        title="Lkw-Laden im Fernverkehr: Die 45-Minuten-Pause optimal nutzen"
        description="Wie die Umstellung von Diesel auf E-Lkw mit den gesetzlichen Lenk- und Ruhezeiten harmoniert. Ladekurven, Nachlademengen und die Rolle von Drive-Through-Ladestationen für 40-Tonnen-Sattelzüge."
      />

      {/* Main Content */}
      <div className="space-y-12">
        
        {/* Lenkzeit-Harmonie Highlight */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-950 text-white p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs uppercase font-bold">
            <Clock className="w-4 h-4" />
            <span>EU-Verordnung (EG) Nr. 561/2006</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            4,5 Stunden Lenkzeit = 45 Minuten Pflichtpause
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Ein Berufskraftfahrer legt bei einer Durchschnittsgeschwindigkeit von 80 bis 85 km/h in 4,5 Stunden rund 360 bis 380 Kilometer zurück. Genau nach dieser Distanz ist gesetzlich eine ununterbrochene Pause von mindestens 45 Minuten (oder 15 + 30 Minuten) vorgeschrieben.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block">Fahrstrecke Turn 1</span>
              <span className="text-lg font-bold text-white block mt-0.5">~370 km</span>
              <span className="text-[11px] text-slate-400">Verbrauch ca. 420 kWh</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-emerald-400 block font-semibold">Pause &amp; MCS-Ladung</span>
              <span className="text-lg font-bold text-emerald-300 block mt-0.5">45 Minuten</span>
              <span className="text-[11px] text-emerald-400">+400 bis 500 kWh nachgeladen</span>
            </div>
            <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
              <span className="text-slate-400 block">Fahrstrecke Turn 2</span>
              <span className="text-lg font-bold text-white block mt-0.5">~370 km</span>
              <span className="text-[11px] text-slate-400">Tagespensum erreicht</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 font-mono">
            * Beispielhafte Modellrechnung für einen voll beladenen 40-t-Fernverkehrszug mit 550–600 kWh Batterie bei typischem Autobahnverbrauch von 110–120 kWh/100 km.
          </p>
        </section>

        {/* Die 3 Ladeszenarien */}
        <section className="space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-950">
            Die drei Säulen des Lkw-Ladeökosystems
          </h2>
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">1. Depot-Laden (Betriebshof)</span>
              <h3 className="font-bold text-slate-950 text-base">Übernacht-Laden mit 50 bis 150 kW</h3>
              <p className="text-xs text-slate-600">
                Kostengünstigster Strom, ideal für planbare Touren und regionale Verteilerverkehre. Batterien starten morgens mit 100 % State of Charge (SoC).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-1.5">
              <span className="text-xs font-mono font-bold text-emerald-800 uppercase">2. Schnellladen an Fernstraßen (MCS)</span>
              <h3 className="font-bold text-slate-950 text-base">Megawatt-Laden während der 45-Minuten-Fahrerpause</h3>
              <p className="text-xs text-slate-600">
                Ziel des Megawatt-Ladestandards ist es, hohe Energiemengen innerhalb der gesetzlich vorgeschriebenen 45-Minuten-Fahrpause nachzuladen (Modellrechnung des HoLa-Forschungsprojekts: ca. 300 bis 400 km Weiterfahrt bei einem angenommenen Durchschnittsverbrauch von ca. 120 kWh/100 km).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase">3. Destination-Laden (Logistikzentrum / Rampe)</span>
              <h3 className="font-bold text-slate-950 text-base">Laden während Be- und Entladung (150 bis 300 kW)</h3>
              <p className="text-xs text-slate-600">
                Nutzung der Rampen-Standzeiten beim Kunden oder Warenumschlagzentrum zur Zwischenladung mit CCS.
              </p>
            </div>
          </div>
        </section>

        {/* Infrastruktur-Anforderung: Durchfahrtsspuren (Drive-Through) */}
        <section className="space-y-4 text-slate-700 leading-relaxed">
          <h2 className="text-2xl font-bold text-slate-950">
            Warum Durchfahrts-Ladebuchten für Lkw erforderlich sind
          </h2>
          <p>
            Ein 40-Tonnen-Sattelzug hat eine Gesamtlänge von bis zu 16,50 Metern (bzw. 18,75 Meter für Gliederzüge oder 25,25 Meter für Lang-Lkw). Viele für Pkw ausgelegte Ladeplätze sind für solche Fahrzeugdimensionen baulich und geometrisch nicht geeignet.
          </p>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-sm">
            <h3 className="font-bold text-slate-900">Anforderungen an moderne Schwerlast-Hubs:</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Durchfahrtsspur (Drive-Through):</strong> Das Gespann fährt vorwärts an die Ladesäule heran und verlässt die Bucht ebenfalls vorwärts, ohne rückwärts rangieren zu müssen.</li>
              <li><strong>Laden ohne Absatteln:</strong> Ein Abkuppeln des Aufliegers ist zeitaufwendig und würde den praktischen Ablauf im Fernverkehr erheblich behindern.</li>
              <li><strong>Schwerlast-Asphaltierung:</strong> Tragfähige Untergründe für Achslasten bis 11,5 Tonnen.</li>
            </ul>
          </div>
        </section>

        {/* Links */}
        <section className="border-t border-slate-200 pt-8 flex flex-wrap gap-4">
          <Link
            to="/mcs/ladestationen"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all"
          >
            <span>Verifizierte MCS-Ladeparks finden</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/mcs/was-ist-mcs"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-all"
          >
            <span>MCS-Technik im Detail</span>
          </Link>
        </section>

      </div>
    </div>
  );
};

export default McsTruckChargingPage;
