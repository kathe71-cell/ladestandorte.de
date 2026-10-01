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

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [standorteOpen, setStandorteOpen] = useState(false);
  const [wissenOpen, setWissenOpen] = useState(false);
  const location = useLocation();

  const standorteRef = useRef<HTMLDivElement>(null);
  const wissenRef = useRef<HTMLDivElement>(null);

  // Close mobile drawer and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setStandorteOpen(false);
    setWissenOpen(false);
  }, [location.pathname]);

  // Click outside to close desktop dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (standorteRef.current && !standorteRef.current.contains(event.target as Node)) {
        setStandorteOpen(false);
      }
      if (wissenRef.current && !wissenRef.current.contains(event.target as Node)) {
        setWissenOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isStandorteActive = location.pathname.startsWith('/staedte') || location.pathname.startsWith('/betreiber') || location.pathname.startsWith('/ladestation');
  const isAutobahnenActive = location.pathname.startsWith('/autobahnen');
  const isMcsActive = location.pathname.startsWith('/mcs');
  const isRechnerActive = location.pathname.startsWith('/rechner');
  const isWissenActive = location.pathname.startsWith('/ratgeber') || location.pathname.startsWith('/ladekarten') || location.pathname.startsWith('/glossar') || location.pathname.startsWith('/wallbox-vergleich');

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#DFE3DC] sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Category Sub-label */}
          <Link to="/" className="flex items-center gap-3 group shrink-0" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-9 h-9 rounded-lg bg-[#171917] flex items-center justify-center border border-[#171917] group-hover:border-[#C7F000] transition-colors relative overflow-hidden">
              {/* Minimalist L-Mark with Signal Lime Data Node */}
              <svg viewBox="0 0 32 32" className="w-5 h-5" fill="none">
                <path d="M9 7V23H21" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="23" cy="9" r="3" fill="#C7F000" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#171917] flex items-center leading-none">
                ladestandorte<span className="text-[#6C716B] font-semibold">.de</span>
              </span>
              <span className="hidden sm:block text-[9px] font-mono uppercase tracking-widest text-[#6C716B] font-bold mt-1">
                Infrastructure Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Hauptnavigation">
            
            {/* 1. Standorte & Monitore Dropdown */}
            <div className="relative" ref={standorteRef}>
              <button
                type="button"
                onClick={() => { setStandorteOpen(!standorteOpen); setWissenOpen(false); }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isStandorteActive || location.pathname === '/hpc-city-monitor' || location.pathname === '/cpo-monitor'
                    ? 'bg-[#171917] text-white'
                    : 'text-[#171917] hover:bg-[#F7F7F2]'
                }`}
                aria-expanded={standorteOpen}
              >
                <span>Monitore &amp; Standorte</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${standorteOpen ? 'rotate-180' : ''}`} />
              </button>

              {standorteOpen && (
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
                    <span className="w-5 h-5 rounded bg-[#2F5E73] text-white font-mono text-[10px] font-black flex items-center justify-center shrink-0">
                      02
                    </span>
                    <div>
                      <div className="leading-tight">CPO Monitor</div>
                      <div className="text-[11px] text-[#6C716B] font-normal">Betreiber &amp; Registeranteile</div>
                    </div>
                  </Link>

                  <div className="my-1 border-t border-[#DFE3DC]"></div>
                  <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-[#6C716B] font-bold">
                    Verzeichnisse
                  </div>
                  <Link
                    to="/staedte"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <MapPin className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>Top 50 Städte</span>
                  </Link>
                  <Link
                    to="/betreiber"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>Betreiber-Dossiers (CPOs)</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Autobahnen (Direktlink) */}
            <Link
              to="/autobahnen"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isAutobahnenActive
                  ? 'bg-[#171917] text-white'
                  : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              Autobahnen
            </Link>

            {/* 3. MCS & Lkw (Direktlink) */}
            <Link
              to="/mcs"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isMcsActive
                  ? 'bg-[#171917] text-white'
                  : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              <Truck className="w-4 h-4 text-[#6C716B]" />
              <span>MCS &amp; Lkw</span>
            </Link>

            {/* 4. Rechner (Direktlink) */}
            <Link
              to="/rechner"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isRechnerActive
                  ? 'bg-[#171917] text-white'
                  : 'text-[#171917] hover:bg-[#F7F7F2]'
              }`}
            >
              Rechner
            </Link>

            {/* 5. Wissen & Methodik Dropdown */}
            <div className="relative" ref={wissenRef}>
              <button
                type="button"
                onClick={() => { setWissenOpen(!wissenOpen); setStandorteOpen(false); }}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isWissenActive || location.pathname === '/methodik'
                    ? 'bg-[#171917] text-white'
                    : 'text-[#171917] hover:bg-[#F7F7F2]'
                }`}
                aria-expanded={wissenOpen}
              >
                <span>Wissen &amp; Methodik</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${wissenOpen ? 'rotate-180' : ''}`} />
              </button>

              {wissenOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-60 bg-white rounded-xl shadow-lg border border-[#DFE3DC] p-1.5 z-50">
                  <Link
                    to="/methodik"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-semibold"
                  >
                    <Activity className="w-4 h-4 text-[#2F5E73] shrink-0" />
                    <span>Datenbasis &amp; Methodik</span>
                  </Link>
                  <Link
                    to="/ratgeber"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <BookOpen className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>Ratgeber &amp; Leitfäden</span>
                  </Link>
                  <Link
                    to="/ladekarten"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <CreditCard className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>Ladekarten-Vergleich</span>
                  </Link>
                  <Link
                    to="/glossar"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#171917] hover:bg-[#F7F7F2] font-medium"
                  >
                    <HelpCircle className="w-4 h-4 text-[#6C716B] shrink-0" />
                    <span>E-Mobilität Glossar</span>
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

          </nav>

          {/* Action Buttons: Data Status Tag, Search Trigger & Finder */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Status indicator badge (Infrastructure Intelligence Data Badge) */}
            <div className="hidden xl:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F7F7F2] border border-[#DFE3DC] text-[11px] font-mono font-bold text-[#171917]">
              <span className="w-2 h-2 rounded-full bg-[#C7F000] border border-[#171917]/20"></span>
              <span>DATA / 01.10.2026</span>
            </div>

            {/* Desktop Search Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-medium px-3.5 py-2 rounded-lg bg-[#F7F7F2] hover:bg-[#EAECE6] text-[#171917] transition-all border border-[#DFE3DC] cursor-pointer min-h-[40px]"
              aria-label="Globale Suche öffnen"
            >
              <Search className="w-4 h-4 text-[#6C716B]" />
              <span>Suche...</span>
              <kbd className="hidden md:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-[#6C716B] border border-[#DFE3DC]">
                ⌘K
              </kbd>
            </button>

            {/* Desktop Direct Finder Link */}
            <div className="hidden sm:flex items-center">
              <Link
                to="/suche"
                className={`inline-flex items-center gap-1.5 text-sm font-bold px-3.5 py-2 rounded-lg transition-all active:scale-95 ${
                  location.pathname === '/suche'
                    ? 'bg-[#171917] text-[#C7F000]'
                    : 'bg-[#C7F000] text-[#171917] hover:bg-[#d4fa00] border border-[#171917]'
                }`}
              >
                <Zap className="w-4 h-4 fill-current stroke-current" />
                <span>Finder</span>
              </Link>
            </div>

            {/* Mobile Search Button */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-[#171917] hover:bg-[#F7F7F2] min-w-[44px] min-h-[44px] cursor-pointer border border-[#DFE3DC]"
              aria-label="Suche öffnen"
            >
              <Search className="w-5 h-5 text-[#171917]" />
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-lg text-[#171917] hover:bg-[#F7F7F2] min-w-[44px] min-h-[44px] cursor-pointer border border-[#DFE3DC]"
              aria-label={mobileMenuOpen ? 'Menü schließen' : 'Hauptmenü öffnen'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
        <div className="lg:hidden bg-white border-b border-[#DFE3DC] px-4 pt-3 pb-6 space-y-4 shadow-xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          
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
