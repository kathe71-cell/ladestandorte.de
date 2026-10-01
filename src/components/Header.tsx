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
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0" onClick={() => setMobileMenuOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-white stroke-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950 flex items-center">
                ladestandorte<span className="text-emerald-600">.de</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Exakt 5 primäre Menüpunkte */}
          <nav className="hidden lg:flex items-center gap-1.5 xl:gap-2" aria-label="Hauptnavigation">
            
            {/* 1. Standorte Dropdown */}
            <div className="relative" ref={standorteRef}>
              <button
                type="button"
                onClick={() => { setStandorteOpen(!standorteOpen); setWissenOpen(false); }}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isStandorteActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
                aria-expanded={standorteOpen}
              >
                <span>Standorte</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${standorteOpen ? 'rotate-180' : ''}`} />
              </button>

              {standorteOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                  <Link
                    to="/staedte"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-medium"
                  >
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Top 50 Städte</span>
                  </Link>
                  <Link
                    to="/hpc-city-monitor"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50/70 font-semibold"
                  >
                    <Activity className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>HPC City Monitor</span>
                  </Link>
                  <Link
                    to="/betreiber"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>CPO-Betreiber</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 2. Autobahnen (Direktlink) */}
            <Link
              to="/autobahnen"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isAutobahnenActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Autobahnen
            </Link>

            {/* 3. MCS & Lkw (Direktlink) */}
            <Link
              to="/mcs"
              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isMcsActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>MCS &amp; Lkw</span>
            </Link>

            {/* 4. Rechner (Direktlink) */}
            <Link
              to="/rechner"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isRechnerActive
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Rechner
            </Link>

            {/* 5. Wissen Dropdown */}
            <div className="relative" ref={wissenRef}>
              <button
                type="button"
                onClick={() => { setWissenOpen(!wissenOpen); setStandorteOpen(false); }}
                className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                  isWissenActive
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                }`}
                aria-expanded={wissenOpen}
              >
                <span>Wissen</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${wissenOpen ? 'rotate-180' : ''}`} />
              </button>

              {wissenOpen && (
                <div className="absolute top-full right-0 mt-1.5 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50">
                  <Link
                    to="/ratgeber"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-medium"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ratgeber &amp; Leitfäden</span>
                  </Link>
                  <Link
                    to="/ladekarten"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-medium"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Ladekarten-Vergleich</span>
                  </Link>
                  <Link
                    to="/glossar"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-medium"
                  >
                    <HelpCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>E-Mobilität Glossar</span>
                  </Link>
                  <Link
                    to="/wallbox-vergleich"
                    className="flex items-center gap-2.5 px-3.5 py-2 text-sm text-slate-700 hover:text-slate-950 hover:bg-slate-50 font-medium"
                  >
                    <HomeIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Wallbox-Vergleich</span>
                  </Link>
                </div>
              )}
            </div>

          </nav>

          {/* Action Buttons: Desktop Search Trigger & Mobile Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Desktop Search Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all border border-slate-200/80 cursor-pointer min-h-[40px]"
              aria-label="Globale Suche öffnen"
            >
              <Search className="w-4 h-4 text-slate-500" />
              <span>Suche...</span>
              <kbd className="hidden md:inline-flex text-[10px] font-mono px-1.5 py-0.5 rounded bg-white text-slate-500 border border-slate-200 shadow-2xs">
                ⌘K
              </kbd>
            </button>

            {/* Desktop Direct Finder Link */}
            <div className="hidden sm:flex items-center gap-3">
              <Link
                to="/suche"
                className={`inline-flex items-center gap-1.5 text-sm font-bold px-3.5 py-2 rounded-xl shadow-xs transition-all active:scale-95 ${
                  location.pathname === '/suche'
                    ? 'bg-emerald-700 text-white ring-2 ring-emerald-400 ring-offset-2'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>Finder</span>
              </Link>
            </div>

            {/* Mobile Search Button (Compact Icon in Header: Logo | Suche | Menü) */}
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 min-w-[44px] min-h-[44px] cursor-pointer"
              aria-label="Suche öffnen"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 min-w-[44px] min-h-[44px] cursor-pointer"
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

      {/* Mobile Drawer (Touch-optimiert, klare Gruppierung) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-2xl max-h-[calc(100vh-4rem)] overflow-y-auto">
          
          {/* Prominente Schnellsuche-Aktionen */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setSearchModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-3 rounded-xl shadow-xs text-sm min-h-[48px] cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-200" />
              <span>Volltext-Suche</span>
            </button>

            <Link
              to="/suche"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-3 rounded-xl shadow-xs text-sm min-h-[48px]"
            >
              <Zap className="w-4 h-4 text-emerald-100" />
              <span>Finder Filter</span>
            </Link>
          </div>

          {/* Primäre Hauptlinks */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold px-3">
              Infrastruktur &amp; Trassen
            </span>
            <Link
              to="/autobahnen"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold min-h-[48px] ${
                isAutobahnenActive ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Navigation className="w-5 h-5 text-emerald-600" />
              <span>Autobahnen (A1 bis A99)</span>
            </Link>

            <Link
              to="/mcs"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold min-h-[48px] ${
                isMcsActive ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>MCS &amp; E-Lkw Megawatt-Hubs</span>
            </Link>

            <Link
              to="/staedte"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold min-h-[48px] ${
                location.pathname === '/staedte' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-5 h-5 text-emerald-600" />
              <span>Städte &amp; Ballungsräume</span>
            </Link>

            <Link
              to="/hpc-city-monitor"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold min-h-[48px] ${
                location.pathname === '/hpc-city-monitor' ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Activity className="w-5 h-5 text-emerald-600" />
              <span>HPC City Monitor (≥150 kW)</span>
            </Link>

            <Link
              to="/betreiber"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold min-h-[48px] ${
                location.pathname.startsWith('/betreiber') ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Betreiber (CPOs)</span>
            </Link>
          </div>

          {/* Tools & Wissen */}
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold px-3">
              Tools &amp; Ratgeber
            </span>
            <Link
              to="/rechner"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold min-h-[48px] ${
                isRechnerActive ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>Ladekosten- &amp; Zeitrechner</span>
            </Link>

            <Link
              to="/ladekarten"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold min-h-[48px] ${
                location.pathname.startsWith('/ladekarten') ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <span>Ladekarten-Vergleich</span>
            </Link>

            <Link
              to="/ratgeber"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-base font-semibold min-h-[48px] ${
                location.pathname.startsWith('/ratgeber') ? 'bg-emerald-50 text-emerald-900 font-bold' : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <span>Ratgeber &amp; Leitfäden</span>
            </Link>

            <Link
              to="/wallbox-vergleich"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium min-h-[44px] text-slate-700 hover:bg-slate-100`}
            >
              <HomeIcon className="w-4 h-4 text-slate-400" />
              <span>Wallboxen für Zuhause</span>
            </Link>

            <Link
              to="/glossar"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium min-h-[44px] text-slate-700 hover:bg-slate-100`}
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              <span>E-Mobilität Glossar</span>
            </Link>
          </div>

          {/* Footer im Drawer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3">
            <Link to="/impressum" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900 py-2">
              Impressum (§ 5 DDG)
            </Link>
            <span>·</span>
            <Link to="/datenschutz" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900 py-2">
              Datenschutzerklärung
            </Link>
            <span>·</span>
            <span className="font-mono text-[10px]">BNetzA Data</span>
          </div>

        </div>
      )}
    </header>
  );
};

export default Header;
