import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Zap,
  Search,
  Menu,
  X,
  MapPin,
  Navigation,
  ShieldCheck,
  Calculator,
  CreditCard,
  Home as HomeIcon,
  BookOpen,
  HelpCircle
} from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  // Direct, clean navigation items without duplicates or asterisks
  const navLinks = [
    { to: '/staedte', label: 'Städte', icon: MapPin },
    { to: '/autobahnen', label: 'Autobahnen', icon: Navigation },
    { to: '/betreiber', label: 'Betreiber', icon: ShieldCheck },
    { to: '/rechner', label: 'Rechner', icon: Calculator },
    { to: '/ladekarten', label: 'Ladekarten', icon: CreditCard },
    { to: '/wallbox-vergleich', label: 'Wallboxen', icon: HomeIcon },
    { to: '/ratgeber', label: 'Ratgeber', icon: BookOpen },
    { to: '/glossar', label: 'Glossar', icon: HelpCircle }
  ];

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

          {/* Desktop Navigation - Direct, clean links without nested dropdowns */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5" aria-label="Hauptnavigation">
            {navLinks.map((item) => {
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`px-2.5 xl:px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    active
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Single Search / Finder Button */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <Link
              to="/suche"
              className={`inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl shadow-xs transition-all active:scale-95 ${
                location.pathname === '/suche'
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-400 ring-offset-2'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-md'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Finder starten</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2.5 rounded-xl text-slate-700 hover:text-slate-950 hover:bg-slate-100 min-w-[48px] min-h-[48px]"
            aria-label={mobileMenuOpen ? 'Menü schließen' : 'Hauptmenü öffnen'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-2xl max-h-[calc(100vh-5rem)] overflow-y-auto">
          
          {/* Prominenter Finder-Button */}
          <div>
            <Link
              to="/suche"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md text-base min-h-[48px]"
            >
              <Search className="w-5 h-5 text-emerald-100" />
              <span>Ladesäulen-Finder starten</span>
            </Link>
          </div>

          {/* Saubere Linkliste */}
          <div className="grid grid-cols-1 gap-1">
            {navLinks.map((item) => {
              const active = isActive(item.to);
              const Icon = item.icon;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold min-h-[44px] ${
                    active
                      ? 'bg-emerald-50 text-emerald-900 font-bold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-emerald-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Footer im Drawer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3">
            <Link to="/impressum" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900">
              Impressum
            </Link>
            <span>·</span>
            <Link to="/datenschutz" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900">
              Datenschutz
            </Link>
            <span>·</span>
            <span className="font-mono">BNetzA Open Data</span>
          </div>

        </div>
      )}
    </header>
  );
};

export default Header;
