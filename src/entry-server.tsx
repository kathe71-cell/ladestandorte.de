import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { SiteProvider } from '@plattform/core';
import { AppContent } from './App';
import { siteConfig } from './site.config';
import { products } from './products';
export { CITIES_DATA } from './data/cities';
export { MOTORWAYS_DATA } from './data/motorways';
export { OPERATORS_DATA } from './data/operators';
export { STATIONS_DATA, getStationUrl, isIndexableLocation, isIndexableMcsLocation, getMcsStations } from './data/stations';
export { GLOSSARY_DATA } from './data/glossary';
export { CHARGING_CARDS } from './data/cards';
export { WALLBOXES_DATA } from './data/wallboxes';

export function render(url: string) {
  const html = renderToString(
    <StaticRouter location={url}>
      <SiteProvider config={siteConfig} products={products}>
        <AppContent />
      </SiteProvider>
    </StaticRouter>
  );
  return { html };
}
