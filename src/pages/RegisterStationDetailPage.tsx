import React, { useEffect, useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Zap, MapPin, Navigation, ShieldCheck, Database, ArrowLeft, ArrowRight, 
  ExternalLink, Info, CheckCircle2, AlertCircle 
} from 'lucide-react';
import { CITIES_DATA } from '../data/cities';
import { STATIONS_DATA, getStationUrl } from '../data/stations';
import { SEO } from '../components/SEO';
import { PageHero } from '../components/PageHero';
import { CitationBox } from '../components/CitationBox';
import { EEATBadge } from '../components/EEATBadge';
import { FloatingCTABar } from '../components/FloatingCTABar';
import { getSnapshotDateFormatted } from '../lib/datasetDate';

export interface BnetzaRegistryStation {
  id: string;
  citySlug: string;
  cpo: string;
  cpoRaw: string;
  street: string;
  houseNumber: string;
  plz: string;
  city: string;
  state: string;
  lon: number | null;
  lat: number | null;
  ratedKw: number;
  installedKw: number;
  reportedPoints: number;
  commissioningDate: string;
  useCase: string;
  pointsCount: number;
  hpcPointsCount: number;
  maxKw: number;
  powerLevels: number[];
  dossierId: string | null;
}

export const RegisterStationDetailPage: React.FC = () => {
  const { citySlug, stationId } = useParams<{ citySlug: string; stationId: string }>();
  const [station, setStation] = useState<BnetzaRegistryStation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const city = CITIES_DATA.find(c => c.slug === citySlug);

  useEffect(() => {
    let isCancelled = false;
    if (!citySlug || !stationId) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);
    fetch(`/data/registry/${citySlug}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Registry data not found');
        return res.json();
      })
      .then((data: BnetzaRegistryStation[]) => {
        if (isCancelled) return;
        const found = data.find(s => s.id === stationId);
        if (found) {
          setStation(found);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        if (!isCancelled) {
          setError(true);
          setLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [citySlug, stationId]);

  if (!city && !loading) {
    return <Navigate to="/staedte" replace />;
  }

  if (error && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#171917]">Ladestation im Register nicht gefunden</h1>
        <p className="text-sm text-[#6C716B]">
          Der angeforderte Registerdatensatz ({stationId}) konnte im aktuellen amtlichen Snapshot für {city?.name || 'die Stadt'} nicht ermittelt werden.
        </p>
        <Link
          to={city ? `/staedte/${city.slug}` : '/staedte'}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#171917] text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Zurück zur Übersicht</span>
        </Link>
      </div>
    );
  }

  const linkedDossier = station?.dossierId ? STATIONS_DATA.find(d => d.id === station.dossierId) : null;
  const isHpc = (station?.maxKw || 0) >= 150;
  const addressLine = station ? `${station.street} ${station.houseNumber}`.trim() : '';
  const fullAddress = station ? `${addressLine}, ${station.plz} ${station.city}` : '';
  const googleMapsUrl = station?.lat && station?.lon 
    ? `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lon}` 
    : null;

  const schema = station ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://www.ladestandorte.de/" },
          { "@type": "ListItem", "position": 2, "name": "Städte", "item": "https://www.ladestandorte.de/staedte" },
          { "@type": "ListItem", "position": 3, "name": station.city, "item": `https://www.ladestandorte.de/staedte/${station.citySlug}` },
          { "@type": "ListItem", "position": 4, "name": `Station ${station.id}`, "item": `https://www.ladestandorte.de/ladestation-register/${station.citySlug}/${station.id}` }
        ]
      },
      {
        "@type": "CivicStructure",
        "name": `Öffentliche Ladestation ${station.id} (${station.cpo})`,
        "description": `BNetzA-Ladesäulenregistereintrag ${station.id} in ${station.city} (${addressLine}) betrieben von ${station.cpo}.`,
        "address": {
          "@type": "PostalAddress",
          "streetAddress": addressLine,
          "postalCode": station.plz,
          "addressLocality": station.city,
          "addressCountry": "DE"
        },
        ...(station.lat && station.lon ? {
          "geo": {
            "@type": "GeoCoordinates",
            "latitude": station.lat,
            "longitude": station.lon
          }
        } : {})
      }
    ]
  } : undefined;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      <SEO
        title={station ? `${station.cpo} Ladestation ${station.id}: ${station.city} (${addressLine})` : 'Ladestation BNetzA-Register'}
        description={station ? `BNetzA-Registerdaten für Ladestation ${station.id} in ${station.city} (${addressLine}): ${station.pointsCount} Ladepunkte, bis ${station.maxKw} kW (${station.hpcPointsCount > 0 ? 'HPC-Schnelllader' : 'Normallader'}), Betreiber: ${station.cpo}.` : ''}
        canonicalPath={station ? `/ladestation-register/${station.citySlug}/${station.id}` : undefined}
        schema={schema}
      />

      <PageHero
        level={3}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: 'Städte', href: '/staedte' },
          { label: city?.name || 'Stadt', href: `/staedte/${citySlug}` },
          { label: `Register-Station ${stationId}`, isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#C7F000] text-[#171917] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#171917]" />
            <span>BNETZA-REGISTERDATENSATZ</span>
          </div>
        }
        title={station ? `${station.cpo} · ${addressLine}` : `Ladestation ${stationId}`}
        subtitle={station ? `${station.plz} ${station.city} · BNetzA-ID: ${station.id}` : 'Wird geladen...'}
      />

      {/* Distinction Banner: BNetzA Register vs Editorial Dossier */}
      <div className="p-4 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-[#2F5E73] shrink-0 mt-0.5" />
          <div className="text-xs text-[#6C716B] leading-relaxed">
            <strong className="text-[#171917] font-semibold block">Amtlicher BNetzA-Registereintrag (Kein redaktionelles Standort-Dossier)</strong>
            Dieser Datensatz stammt direkt aus dem amtlichen Ladesäulenregister der Bundesnetzagentur (Stand {getSnapshotDateFormatted()}) und wird ohne redaktionelle Vor-Ort-Verifizierung maschinell aggregiert.
          </div>
        </div>
        {linkedDossier && (
          <Link
            to={getStationUrl(linkedDossier)}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-[#171917] hover:bg-black text-[#C7F000] text-xs font-mono font-bold transition-colors inline-flex items-center gap-2"
          >
            <span>Zum redaktionellen Dossier</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm font-mono text-[#6C716B]">
          Lade Registereintrag aus dem BNetzA-Datenbestand...
        </div>
      ) : station ? (
        <div className="space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs">
              <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Max. Ladeleistung</span>
              <span className="text-3xl font-black text-[#171917] font-mono mt-1 block tabular-nums">
                {station.maxKw} kW
              </span>
              <span className="text-[11px] text-[#2F5E73] font-mono font-semibold mt-1 block">
                {isHpc ? 'High Power Charging (HPC)' : 'Normalladung (AC)'}
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs">
              <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Ladepunkte</span>
              <span className="text-3xl font-black text-[#171917] font-mono mt-1 block tabular-nums">
                {station.pointsCount}
              </span>
              <span className="text-[11px] text-[#6C716B] mt-1 block">
                {station.hpcPointsCount > 0 ? `${station.hpcPointsCount} HPC (≥150 kW)` : 'Normalladepunkte'}
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs">
              <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Betreiber</span>
              <span className="text-lg font-bold text-[#171917] line-clamp-1 mt-1 block">
                {station.cpo}
              </span>
              <span className="text-[11px] text-[#6C716B] mt-1 block truncate">
                {station.cpoRaw}
              </span>
            </div>

            <div className="p-5 bg-white rounded-2xl border border-[#DFE3DC] shadow-xs">
              <span className="text-xs font-mono text-[#6C716B] uppercase font-bold block">Nennleistung</span>
              <span className="text-3xl font-black text-[#171917] font-mono mt-1 block tabular-nums">
                {station.ratedKw} kW
              </span>
              <span className="text-[11px] text-[#6C716B] mt-1 block font-mono">
                Installiert: {station.installedKw} kW
              </span>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-2xl p-6 border border-[#DFE3DC] shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-[#171917]">
              Technische Spezifikationen &amp; Registerangaben
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6C716B]">BNetzA Stations-ID:</span>
                  <strong className="font-mono text-[#171917]">{station.id}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C716B]">Standort-Adresse:</span>
                  <strong className="text-[#171917] text-right">{fullAddress}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C716B]">Bundesland:</span>
                  <strong className="text-[#171917]">{station.state}</strong>
                </div>
                {station.useCase && (
                  <div className="flex justify-between">
                    <span className="text-[#6C716B]">Nutzungsbereich / Use-Case:</span>
                    <strong className="text-[#171917]">{station.useCase}</strong>
                  </div>
                )}
                {station.commissioningDate && (
                  <div className="flex justify-between">
                    <span className="text-[#6C716B]">Inbetriebnahme:</span>
                    <strong className="font-mono text-[#171917]">
                      {station.commissioningDate.split(' ')[0]}
                    </strong>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[#F7F7F2] border border-[#DFE3DC] space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#6C716B]">Vorhandene Leistungsstufen:</span>
                  <strong className="font-mono text-[#171917]">
                    {station.powerLevels.length > 0 ? station.powerLevels.map(kw => `${kw} kW`).join(', ') : `${station.maxKw} kW`}
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C716B]">HPC-Ladepunkte (≥150 kW):</span>
                  <strong className="font-mono text-[#171917]">{station.hpcPointsCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6C716B]">Normalladepunkte (&lt;150 kW):</span>
                  <strong className="font-mono text-[#171917]">{station.pointsCount - station.hpcPointsCount}</strong>
                </div>
                {station.lat && station.lon && (
                  <div className="flex justify-between">
                    <span className="text-[#6C716B]">Koordinaten:</span>
                    <strong className="font-mono text-[#171917]">{station.lat.toFixed(5)}, {station.lon.toFixed(5)}</strong>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#6C716B]">Datenherkunft:</span>
                  <strong className="text-[#171917]">BNetzA Ladesäulenregister (CC BY 4.0)</strong>
                </div>
              </div>
            </div>

            {/* Navigation & Maps */}
            {googleMapsUrl && (
              <div className="pt-4 border-t border-[#DFE3DC] flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs text-[#6C716B]">
                  Navigation zum Standort starten:
                </span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-[#171917] hover:bg-black text-[#C7F000] rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Google Maps Navigation öffnen</span>
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <CitationBox
        title={station ? `BNetzA-Registerdatensatz ${station.id} (${station.cpo})` : 'BNetzA-Register'}
        urlPath={station ? `/ladestation-register/${station.citySlug}/${station.id}` : `/staedte/${citySlug}`}
      />

      <EEATBadge topic="BNetzA Ladesäulenregister" />

      <FloatingCTABar
        title="Günstig laden an allen Stationen"
        subtitle="Unabhängiger Ladekarten-Vergleich 2026"
        link="/ladekarten"
        linkLabel="Ladekarten vergleichen"
      />
    </div>
  );
};

export default RegisterStationDetailPage;
