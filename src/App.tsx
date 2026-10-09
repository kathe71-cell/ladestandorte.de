import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { SiteProvider } from '@plattform/core';
import Header from './components/Header';
import Footer from './components/Footer';
import VercelAnalytics from './components/VercelAnalytics';

// Pages
import Home from './pages/Home';
import SearchPage from './pages/SearchPage';
import CitiesIndexPage from './pages/CitiesIndexPage';
import CityPage from './pages/CityPage';
import MotorwaysIndexPage from './pages/MotorwaysIndexPage';
import MotorwayPage from './pages/MotorwayPage';
import OperatorsIndexPage from './pages/OperatorsIndexPage';
import OperatorPage from './pages/OperatorPage';
import RechnerPage from './pages/RechnerPage';
import RechnerEmbedPage from './pages/RechnerEmbedPage';
import LadekartenVergleichPage from './pages/LadekartenVergleichPage';
import WallboxVergleichPage from './pages/WallboxVergleichPage';
import RatgeberIndexPage from './pages/RatgeberIndexPage';
import RatgeberArticlePage from './pages/RatgeberArticlePage';
import GlossarPage from './pages/GlossarPage';
import MethodikPage from './pages/MethodikPage';
import ImpressumPage from './pages/ImpressumPage';
import DatenschutzPage from './pages/DatenschutzPage';
import StationDetailPage from './pages/StationDetailPage';
import RegisterStationDetailPage from './pages/RegisterStationDetailPage';
import NationwideDirectoryPage from './pages/NationwideDirectoryPage';
import McsHubPage from './pages/McsHubPage';
import McsStationsPage from './pages/McsStationsPage';
import McsHubDetailPage from './pages/McsHubDetailPage';
import McsWhatIsPage from './pages/McsWhatIsPage';
import McsVsCcsPage from './pages/McsVsCcsPage';
import McsTruckChargingPage from './pages/McsTruckChargingPage';
import HpcCityMonitorPage from './pages/HpcCityMonitorPage';
import CpoMonitorPage from './pages/CpoMonitorPage';
import NotFoundPage from './pages/NotFoundPage';
import ProjektuebernahmePage from './pages/ProjektuebernahmePage';

import ScrollToTop from './components/ScrollToTop';
import { siteConfig } from './site.config';
import { products } from './products';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isEmbed = location.pathname === '/rechner-embed';

  if (isEmbed) {
    return <main>{children}</main>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F7F2] text-[#171917] selection:bg-[#C7F000] selection:text-[#171917]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export function AppContent() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suche" element={<SearchPage />} />
        <Route path="/staedte" element={<CitiesIndexPage />} />
        <Route path="/staedte/:citySlug" element={<CityPage />} />
        <Route path="/hpc-city-monitor" element={<HpcCityMonitorPage />} />
        <Route path="/autobahnen" element={<MotorwaysIndexPage />} />
        <Route path="/autobahnen/:autobahnSlug" element={<MotorwayPage />} />
        <Route path="/betreiber" element={<OperatorsIndexPage />} />
        <Route path="/betreiber/:operatorSlug" element={<OperatorPage />} />
        <Route path="/cpo-monitor" element={<CpoMonitorPage />} />
        <Route path="/rechner" element={<RechnerPage />} />
        <Route path="/rechner-embed" element={<RechnerEmbedPage />} />
        <Route path="/ladekarten" element={<LadekartenVergleichPage />} />
        <Route path="/wallbox-vergleich" element={<WallboxVergleichPage />} />
        <Route path="/ratgeber" element={<RatgeberIndexPage />} />
        <Route path="/ratgeber/:articleSlug" element={<RatgeberArticlePage />} />
        <Route path="/glossar" element={<GlossarPage />} />
        <Route path="/methodik" element={<MethodikPage />} />
        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/datenschutz" element={<DatenschutzPage />} />
        <Route path="/projektuebernahme" element={<ProjektuebernahmePage />} />
        <Route path="/mcs" element={<McsHubPage />} />
        <Route path="/mcs/ladestationen" element={<McsStationsPage />} />
        <Route path="/mcs/hub/:slug" element={<McsHubDetailPage />} />
        <Route path="/mcs/was-ist-mcs" element={<McsWhatIsPage />} />
        <Route path="/mcs/mcs-vs-ccs" element={<McsVsCcsPage />} />
        <Route path="/mcs/lkw-laden" element={<McsTruckChargingPage />} />
        <Route path="/ladestationen" element={<NationwideDirectoryPage />} />
        <Route path="/ladestation/:citySlug/:stationSlug" element={<StationDetailPage />} />
        <Route path="/ladestation-register/:citySlug/:stationId" element={<RegisterStationDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  );
}

export function App() {
  return (
    <Router>
      <VercelAnalytics />
      <SiteProvider config={siteConfig} products={products}>
        <AppContent />
      </SiteProvider>
    </Router>
  );
}

export default App;
