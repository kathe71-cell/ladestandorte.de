import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  prefix?: string;
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
  isTop50?: boolean;
}

export const RegisterStationDetailPage: React.FC = () => {
  const { citySlug, stationId } = useParams<{ citySlug: string; stationId: string }>();
  const [station, setStation] = useState<BnetzaRegistryStation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const matchedCity = CITIES_DATA.find(c => c.slug === citySlug);

  useEffect(() => {
    let isCancelled = false;
    if (!stationId) {
      setLoading(false);
      setError(true);
      return;
    }

    setLoading(true);

    async function loadStation() {
      try {
        // Strategy 1: If citySlug matches one of the 50 top cities, load direct city file
        if (citySlug && matchedCity) {
          const res = await fetch(`/data/registry/${citySlug}.json`);
          if (res.ok) {
            const data: BnetzaRegistryStation[] = await res.json();
            const found = data.find(s => s.id === stationId);
            if (found && !isCancelled) {
              setStation(found);
              setLoading(false);
              return;
            }
          }
        }

        // Strategy 2: Look up shard prefix in id-map.json (~316 KB gz) for ANY station in Germany
        const idMapRes = await fetch('/data/registry/id-map.json');
        if (idMapRes.ok) {
          const idMap: Record<string, string> = await idMapRes.json();
          const targetId = stationId as string;
          const prefix = idMap[targetId];
          if (prefix) {
            const shardRes = await fetch(`/data/registry/shards/${prefix}.json`);
            if (shardRes.ok) {
              const shardData: BnetzaRegistryStation[] = await shardRes.json();
              const found = shardData.find(s => s.id === stationId);
              if (found && !isCancelled) {
                setStation(found);
                setLoading(false);
                return;
              }
            }
          }
        }

        if (!isCancelled) {
          setError(true);
          setLoading(false);
        }
      } catch (err) {
        if (!isCancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    loadStation();

    return () => {
      isCancelled = true;
    };
  }, [citySlug, stationId, matchedCity]);

  if (error && !loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-[#171917]">Ladestation im Register nicht gefunden</h1>
        <p className="text-sm text-[#6C716B]">
          Der angeforderte Registerdatensatz ({stationId}) konnte im aktuellen amtlichen Bundesnetzagentur-Snapshot nicht ermittelt werden.
        </p>
        <Link
          to={matchedCity ? `/staedte/${matchedCity.slug}` : '/ladestationen'}
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

  const cityName = station?.city || matchedCity?.name || 'Gemeinde';
  const effectiveCitySlug = station?.citySlug || citySlug || 'deutschland';

  const schema = station ? {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Startseite", "item": "https://www.ladestandorte.de/" },
          { "@type": "ListItem", "position": 2, "name": "Ladestationen", "item": "https://www.ladestandorte.de/ladestationen" },
          { "@type": "ListItem", "position": 3, "name": cityName, "item": `https://www.ladestandorte.de/ladestation-register/${effectiveCitySlug}/${station.id}` },
          { "@type": "ListItem", "position": 4, "name": `Station ${station.id}`, "item": `https://www.ladestandorte.de/ladestation-register/${effectiveCitySlug}/${station.id}` }
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
          "addressRegion": station.state,
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
        canonicalPath={station ? `/ladestation-register/${effectiveCitySlug}/${station.id}` : undefined}
        schema={schema}
        noIndex={true}
      />

      <PageHero
        level={3}
        breadcrumbs={[
          { label: 'Startseite', href: '/' },
          { label: matchedCity ? matchedCity.name : 'Ladestationen', href: matchedCity ? `/staedte/${matchedCity.slug}` : '/ladestationen' },
          { label: cityName, href: `/ladestation-register/${effectiveCitySlug}/${stationId}` },
          { label: `Register-Station ${stationId}`, isCurrent: true }
        ]}
        eyebrow={
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-[#C7F000] text-[#171917] text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-[#171917]" />
            <span>BNETZA-REGISTERDATENSATZ</span>
          </div>
        }
        title={station ? `${station.cpo} · ${addressLine || station.city}` : `Ladestation ${stationId}`}
        subtitle={station ? `${station.plz} ${station.city} (${station.state}) · BNetzA-ID: ${station.id}` : 'Wird geladen...'}
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
          {/* Key Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#DFE3DC] shadow-xs space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6C716B]">Maximale Ladeleistung</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#171917]">{station.maxKw}</span>
                <span className="text-xs font-bold text-[#6C716B]">kW</span>
              </div>
              <div className="text-xs font-medium text-[#2F5E73]">
                {isHpc ? 'High-Power Charging (HPC)' : 'Normalladung (AC/DC)'}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#DFE3DC] shadow-xs space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6C716B]">Ladepunkte</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#171917]">{station.pointsCount}</span>
                <span className="text-xs font-bold text-[#6C716B]">Punkte</span>
              </div>
              <div className="text-xs text-[#6C716B]">
                {station.hpcPointsCount > 0 ? `${station.hpcPointsCount}x HPC ≥150 kW` : 'Ausschließlich Normallader'}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#DFE3DC] shadow-xs space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6C716B]">Anschlussleistung</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-[#171917]">{station.ratedKw || station.installedKw || '-'}</span>
                <span className="text-xs font-bold text-[#6C716B]">kVA/kW</span>
              </div>
              <div className="text-xs text-[#6C716B]">
                Installiert: {station.installedKw ? `${station.installedKw} kW` : 'n.a.'}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#DFE3DC] shadow-xs space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-[#6C716B]">Inbetriebnahme</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-extrabold text-[#171917]">
                  {station.commissioningDate ? station.commissioningDate.split(' ')[0] : 'k.A.'}
                </span>
              </div>
              <div className="text-xs text-[#6C716B]">
                Art: {station.useCase || 'Öffentlich'}
              </div>
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="bg-white rounded-2xl border border-[#DFE3DC] shadow-xs overflow-hidden">
            <div className="p-6 border-b border-[#DFE3DC] flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-[#171917]">Amtliche Registerdaten & Spezifikation</h2>
                <p className="text-xs text-[#6C716B] mt-0.5">Stammdaten laut Bundesnetzagentur-Meldung</p>
              </div>
              <Database className="w-5 h-5 text-[#2F5E73]" />
            </div>

            <div className="divide-y divide-[#DFE3DC] text-sm">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#6C716B] font-medium">BNetzA Ladestation-ID</span>
                <span className="font-mono font-bold text-[#171917]">{station.id}</span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#6C716B] font-medium">Betreiber (CPO)</span>
                <span className="font-semibold text-[#171917]">{station.cpo} {station.cpoRaw !== station.cpo && `(${station.cpoRaw})`}</span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#6C716B] font-medium">Adresse</span>
                <span className="font-medium text-[#171917]">{fullAddress}</span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#6C716B] font-medium">Bundesland</span>
                <span className="font-medium text-[#171917]">{station.state}</span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#6C716B] font-medium">Geokoordinaten</span>
                <span className="font-mono text-xs text-[#171917]">
                  {station.lat && station.lon ? `${station.lat.toFixed(5)}, ${station.lon.toFixed(5)}` : 'Keine Koordinaten im Register'}
                </span>
              </div>
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#6C716B] font-medium">Vorhandene Leistungsstufen</span>
                <div className="flex flex-wrap gap-1.5 mt-1 sm:mt-0">
                  {station.powerLevels.length > 0 ? (
                    station.powerLevels.map((kw, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-[#F7F7F2] border border-[#DFE3DC] text-xs font-mono font-bold text-[#171917]">
                        {kw} kW
                      </span>
                    ))
                  ) : (
                    <span className="text-[#6C716B] text-xs">Keine Einzelstufen erfasst</span>
                  )}
                </div>
              </div>
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-[#6C716B] font-medium">Anwendungsbereich / Lage</span>
                <span className="font-medium text-[#171917]">{station.useCase || 'Nicht spezifiziert'}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
            <Link
              to={matchedCity ? `/staedte/${matchedCity.slug}` : '/ladestationen'}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#DFE3DC] hover:border-[#171917] text-xs font-bold text-[#171917] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{matchedCity ? `Alle Ladestationen in ${matchedCity.name}` : 'Zum bundesweiten Verzeichnis'}</span>
            </Link>

            {googleMapsUrl && (
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#171917] hover:bg-black text-white text-xs font-bold transition-colors shadow-xs"
              >
                <Navigation className="w-4 h-4 text-[#C7F000]" />
                <span>Route mit Google Maps planen</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </a>
            )}
          </div>
        </div>
      ) : null}

      <CitationBox
        title={station ? `BNetzA-Registerdatensatz ${station.id} (${station.cpo})` : 'BNetzA-Register'}
        urlPath={station ? `/ladestation-register/${effectiveCitySlug}/${station.id}` : `/staedte/${citySlug}`}
      />

      <EEATBadge topic="BNetzA Ladesäulenregister" />

      <FloatingCTABar
        title="Günstig laden an allen Stationen"
        subtitle="Unabhängiger Ladekarten-Vergleich 2026"
        link="/ladekarten"
      />
    </div>
  );
};

export default RegisterStationDetailPage;
