import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Zap,
  Search,
  Menu,
  X,
  ChevronDown,
  MapPin,
  Navigation,
  ShieldCheck,
  Calculator,
  CreditCard,
  Home as HomeIcon,
  BookOpen,
  HelpCircle,
  Truck,
  Activity
} from 'lucide-react';
import { GlobalSearchModal } from './GlobalSearchModal';
import { BrandLogo } from './BrandLogo';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [monitoreOpen, setMonitoreOpen] = useState(false);
  const [standorteOpen, setStandorteOpen] = useState(false);
  const [mcsOpen, setMcsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [wissenOpen, setWissenOpen] = useState(false);
  const location = useLocation();

  const monitoreRef = useRef<HTMLDivElement>(null);
  const standorteRef = useRef<HTMLDivElement>(null);
  const mcsRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const wissenRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setMonitoreOpen(false);
    setStandorteOpen(false);
    setMcsOpen(false);
    setToolsOpen(false);
    setWissenOpen(false);
  }, [location.pathname]);

  // Click outside to close desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monitoreRef.current && !monitoreRef.current.contains(event.target as Node)) {
        setMonitoreOpen(false);
      }
      if (standorteRef.current && !standorteRef.current.contains(event.target as Node)) {
        setStandorteOpen(false);
      }
      if (mcsRef.current && !mcsRef.current.contains(event.target as Node)) {
        setMcsOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
      if (wissenRef.current && !wissenRef.current.contains(event.target as Node)) {
        setWissenOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isMonitoreActive = location.pathname.startsWith('/hpc-city-monitor') || location.pathname.startsWith('/cpo-monitor');
  const isStandorteActive = location.pathname.startsWith('/staedte') || location.pathname.startsWith('/autobahnen') || location.pathname.startsWith('/ladestation') || location.pathname === '/suche';
  const isAutobahnenActive = location.pathname.startsWith('/autobahnen');
  const isBetreiberActive = location.pathname.startsWith('/betreiber');
  const isMcsActive = location.pathname.startsWith('/mcs');
  const isToolsActive = location.pathname.startsWith('/rechner');
  const isRechnerActive = location.pathname.startsWith('/rechner');
  const isWissenActive = location.pathname.startsWith('/ratgeber') || location.pathname.startsWith('/ladekarten') || location.pathname.startsWith('/glossar') || location.pathname.startsWith('/wallbox-vergleich') || location.pathname.startsWith('/methodik');

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#DFE3DC] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Global Central Brand Logo */}
          <BrandLogo onClick={() => setMobileMenuOpen(false)} />

          {/* Desktop Navigation (>= 1200px / xl) */}
          <nav className="hidden xl:flex items-center flex-nowrap gap-1 2xl:gap-1.5 shrink-0" aria-label="Hauptnavigation">
            
            {/* 1. Monitore */}
            <div className="relative" ref={monitoreRef}>
              <button
                type="button"
                onClick={() => {
                  setMonitoreOpen(!monitoreOpen);
                  setStandorteOpen(false);
                  setMcsOpen(false);
                  setToolsOpen(false);
                  setWissenOpen(false);
                }}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isMonitoreActive
                    ? 'bg-[#C7F000] text-[#171917]'
                    : 'text-[#171917] hover:bg-[#F7F7F2]'
                }`}
                aria-expanded={monitoreOpen}
              >
                <span>Monitore</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${monitoreOpen ? 'rotate-180' : ''}`} />
              </button>

              {monitoreOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-64 bg-white rounded-xl shadow-lg border border-[#DFE3DC] p-1.5 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#6C716B] font-bold">
                    Marktmonitore
                  </div>
                  <Link
                    to="/hpc-city-monitor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-semibold"
                  >
                    <span className="w-5 h-5 rounded bg-[#C7F000] text-[#171917] font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                      01
                    </span>
                    <div>
                      <div className="leading-tight">HPC City Monitor</div>
                      <div className="text-[11px] text-[#6C716B] font-normal">≥150 kW in 50 Städten</div>
                    </div>
                  </Link>
                  <Link
                    to="/cpo-monitor"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-semibold"
                  >
                    <span className="w-5 h-5 rounded bg-[#171917] text-[#C7F000] font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                      02
                    </span>
                    <div>
                      <div className="leading-tight">CPO Monitor</div>
                      <div className="text-[11px] text-[#6C716B] font-normal">Betreiber &amp; Registeranteile</div>
                    </div>
                  </Link>
                  <Link
                    to="/mcs"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-semibold"
                  >
                    <span className="w-5 h-5 rounded bg-[#2F5E73] text-white font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                      03
                    </span>
                    <div>
                      <div className="leading-tight">MCS Monitor</div>
                      <div className="text-[11px] text-[#6C716B] font-normal">Megawatt Charging System</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Standorte */}
            <div className="relative" ref={standorteRef}>
              <button
                type="button"
                onClick={() => {
                  setStandorteOpen(!standorteOpen);
                  setMonitoreOpen(false);
                  setMcsOpen(false);
                  setToolsOpen(false);
                  setWissenOpen(false);
                }}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isStandorteActive
                    ? 'bg-[#C7F000] text-[#171917]'
                    : 'text-[#171917] hover:bg-[#F7F7F2]'
                }`}
                aria-expanded={standorteOpen}
              >
                <span>Standorte</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${standorteOpen ? 'rotate-180' : ''}`} />
              </button>

              {standorteOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-[#DFE3DC] p-1.5 z-50">
                  <Link
                    to="/staedte"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-semibold"
                  >
                    <MapPin className="w-4 h-4 text-[#2F5E73] shrink-0" />
                    <span>Top 50 Städte</span>
                  </Link>
                  <Link
                    to="/autobahnen"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-semibold"
                  >
                    <Navigation className="w-4 h-4 text-[#2F5E73] shrink-0" />
                    <span>Autobahnen (A1–A99)</span>
                  </Link>
                  <Link
                    to="/suche"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <Search className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>Standort-Finder</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Betreiber (Direktlink mit CPO-Fokus) */}
            <Link
              to="/betreiber"
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
                isBetreiberActive
                  ? 'bg-[#C7F000] text-[#171917]'
                  : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              Betreiber
            </Link>

            {/* 4. MCS */}
            <div className="relative" ref={mcsRef}>
              <button
                type="button"
                onClick={() => {
                  setMcsOpen(!mcsOpen);
                  setMonitoreOpen(false);
                  setStandorteOpen(false);
                  setToolsOpen(false);
                  setWissenOpen(false);
                }}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isMcsActive
                    ? 'bg-[#C7F000] text-[#171917]'
                    : 'text-[#171917] hover:bg-[#F7F7F2]'
                }`}
                aria-expanded={mcsOpen}
              >
                <span>MCS</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${mcsOpen ? 'rotate-180' : ''}`} />
              </button>

              {mcsOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-[#DFE3DC] p-1.5 z-50">
                  <Link
                    to="/mcs"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-semibold"
                  >
                    <Truck className="w-4 h-4 text-[#2F5E73] shrink-0" />
                    <span>MCS Hub Übersicht</span>
                  </Link>
                  <Link
                    to="/mcs/ladestationen"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <MapPin className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>MCS Standorte</span>
                  </Link>
                  <Link
                    to="/mcs/was-ist-mcs"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <BookOpen className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>Was ist MCS?</span>
                  </Link>
                  <Link
                    to="/mcs/mcs-vs-ccs"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <Activity className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>MCS vs. CCS</span>
                  </Link>
                  <Link
                    to="/mcs/lkw-laden"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <Truck className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>E-Lkw Laden</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 5. Tools */}
            <div className="relative" ref={toolsRef}>
              <button
                type="button"
                onClick={() => {
                  setToolsOpen(!toolsOpen);
                  setMonitoreOpen(false);
                  setStandorteOpen(false);
                  setMcsOpen(false);
                  setWissenOpen(false);
                }}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isToolsActive
                    ? 'bg-[#C7F000] text-[#171917]'
                    : 'text-[#171917] hover:bg-[#F7F7F2]'
                }`}
                aria-expanded={toolsOpen}
              >
                <span>Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${toolsOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-[#DFE3DC] p-1.5 z-50">
                  <Link
                    to="/rechner"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-semibold"
                  >
                    <Calculator className="w-4 h-4 text-[#2F5E73] shrink-0" />
                    <span>Ladekosten- &amp; Zeitrechner</span>
                  </Link>
                  <Link
                    to="/ladekarten"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <CreditCard className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>Ladekarten-Vergleich</span>
                  </Link>
                  <Link
                    to="/wallbox-vergleich"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <HomeIcon className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>Wallbox-Vergleich</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 6. Wissen */}
            <div className="relative" ref={wissenRef}>
              <button
                type="button"
                onClick={() => {
                  setWissenOpen(!wissenOpen);
                  setMonitoreOpen(false);
                  setStandorteOpen(false);
                  setMcsOpen(false);
                  setToolsOpen(false);
                }}
                className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  isWissenActive
                    ? 'bg-[#C7F000] text-[#171917]'
                    : 'text-[#171917] hover:bg-[#F7F7F2]'
                }`}
                aria-expanded={wissenOpen}
              >
                <span>Wissen</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${wissenOpen ? 'rotate-180' : ''}`} />
              </button>

              {wissenOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-[#DFE3DC] p-1.5 z-50">
                  <Link
                    to="/ratgeber"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-semibold"
                  >
                    <BookOpen className="w-4 h-4 text-[#2F5E73] shrink-0" />
                    <span>Ratgeber &amp; Leitfäden</span>
                  </Link>
                  <Link
                    to="/glossar"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <HelpCircle className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>E-Mobilität Glossar</span>
                  </Link>
                  <Link
                    to="/methodik"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <Activity className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>Datenbasis &amp; Methodik</span>
                  </Link>
                </div>
              )}
            </div>

          </nav>

          {/* Action Area: DATA Status Badge & Compact Search Button (Mockup-Style) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Status indicator badge (Mockup: DATA / 01.10.2026) */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC] text-[11px] font-mono font-bold text-[#171917]">
              <span className="w-2 h-2 rounded-full bg-[#C7F000] border border-[#171917]/20"></span>
              <span>DATA / 01.10.2026</span>
            </div>

            {/* Desktop / Tablet Search Trigger Button (Mockup: Square rounded button with search icon) */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#F7F7F2] hover:bg-[#EAECE6] text-[#171917] transition-all border border-[#DFE3DC] cursor-pointer"
              aria-label="Globale Suche öffnen"
            >
              <Search className="w-4 h-4 text-[#171917]" />
            </button>

            {/* Mobile menu trigger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-[#171917] hover:bg-[#F7F7F2] cursor-pointer border border-[#DFE3DC]"
              aria-label={mobileMenuOpen ? 'Menü schließen' : 'Hauptmenü öffnen'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Global Search Modal Overlay */}
      <GlobalSearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-[#DFE3DC] px-4 pt-3 pb-6 space-y-4 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          
          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-[#171917] hover:bg-black text-white font-bold py-3 px-3 rounded-xl text-sm min-h-[48px] cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-300" />
              <span>Volltext-Suche</span>
            </button>

            <Link
              to="/suche"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-[#C7F000] text-[#171917] border border-[#171917] font-bold py-3 px-3 rounded-xl text-sm min-h-[48px]"
            >
              <Zap className="w-4 h-4 fill-current stroke-current" />
              <span>Finder Filter</span>
            </Link>
          </div>

          {/* Infrastructure Intelligence Monitore & Trassen */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6C716B] font-bold px-3">
              Marktmonitore &amp; Verzeichnisse
            </span>

            <Link
              to="/hpc-city-monitor"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold min-h-[48px] ${
                location.pathname === '/hpc-city-monitor' ? 'bg-[#171917] text-white' : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              <span className="w-5 h-5 rounded bg-[#C7F000] text-[#171917] font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                01
              </span>
              <span>HPC City Monitor (≥150 kW)</span>
            </Link>

            <Link
              to="/cpo-monitor"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold min-h-[48px] ${
                location.pathname === '/cpo-monitor' ? 'bg-[#171917] text-white' : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              <span className="w-5 h-5 rounded bg-[#2F5E73] text-white font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                02
              </span>
              <span>CPO Monitor (BNetzA)</span>
            </Link>

            <Link
              to="/staedte"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold min-h-[48px] ${
                location.pathname === '/staedte' ? 'bg-[#171917] text-white' : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              <MapPin className="w-5 h-5 text-[#6C716B]" />
              <span>Top 50 Städte</span>
            </Link>

            <Link
              to="/autobahnen"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold min-h-[48px] ${
                isAutobahnenActive ? 'bg-[#171917] text-white' : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              <Navigation className="w-5 h-5 text-[#6C716B]" />
              <span>Autobahnen (A1 bis A99)</span>
            </Link>

            <Link
              to="/mcs"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold min-h-[48px] ${
                isMcsActive ? 'bg-[#171917] text-white' : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              <Truck className="w-5 h-5 text-[#6C716B]" />
              <span>MCS &amp; E-Lkw Megawatt-Hubs</span>
            </Link>

            <Link
              to="/betreiber"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold min-h-[48px] ${
                location.pathname === '/betreiber' ? 'bg-[#171917] text-white' : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-[#6C716B]" />
              <span>Betreiber (CPOs)</span>
            </Link>
          </div>

          {/* Tools & Wissen */}
          <div className="space-y-1 pt-2 border-t border-[#DFE3DC]">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#6C716B] font-bold px-3">
              Tools &amp; Methodik
            </span>
            <Link
              to="/methodik"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold min-h-[48px] ${
                location.pathname === '/methodik' ? 'bg-[#171917] text-white' : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              <Activity className="w-5 h-5 text-[#2F5E73]" />
              <span>Datenbasis &amp; Methodik</span>
            </Link>

            <Link
              to="/rechner"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold min-h-[48px] ${
                isRechnerActive ? 'bg-[#171917] text-white' : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              <Calculator className="w-5 h-5 text-[#6C716B]" />
              <span>Ladekosten- &amp; Zeitrechner</span>
            </Link>

            <Link
              to="/ladekarten"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold min-h-[48px] ${
                location.pathname.startsWith('/ladekarten') ? 'bg-[#171917] text-white' : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              <CreditCard className="w-5 h-5 text-[#6C716B]" />
              <span>Ladekarten-Vergleich</span>
            </Link>

            <Link
              to="/ratgeber"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold min-h-[48px] ${
                location.pathname.startsWith('/ratgeber') ? 'bg-[#171917] text-white' : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              <BookOpen className="w-5 h-5 text-[#6C716B]" />
              <span>Ratgeber &amp; Leitfäden</span>
            </Link>

            <Link
              to="/wallbox-vergleich"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium min-h-[44px] text-[#171917] hover:bg-[#F7F7F2]`}
            >
              <HomeIcon className="w-4 h-4 text-[#6C716B]" />
              <span>Wallboxen für Zuhause</span>
            </Link>

            <Link
              to="/glossar"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium min-h-[44px] text-[#171917] hover:bg-[#F7F7F2]`}
            >
              <HelpCircle className="w-4 h-4 text-[#6C716B]" />
              <span>E-Mobilität Glossar</span>
            </Link>
          </div>

          {/* Footer im Drawer */}
          <div className="pt-4 border-t border-[#DFE3DC] flex items-center justify-between text-xs text-[#6C716B] px-3">
            <Link to="/impressum" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#171917] py-2">
              Impressum (§ 5 DDG)
            </Link>
            <span>·</span>
            <Link to="/datenschutz" onClick={() => setMobileMenuOpen(false)} className="hover:text-[#171917] py-2">
              Datenschutzerklärung
            </Link>
            <span>·</span>
            <span className="font-mono text-[10px] text-[#171917] font-bold">BNetzA 01.10.2026</span>
          </div>

        </div>
      )}
    </header>
  );
};

export default Header;
