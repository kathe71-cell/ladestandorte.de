import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { AppContent } from './App';
export { CITIES_DATA } from './data/cities';
export { MOTORWAYS_DATA } from './data/motorways';
export { OPERATORS_DATA } from './data/operators';

export function render(url: string) {
  const html = renderToString(
    <StaticRouter location={url}>
      <AppContent />
    </StaticRouter>
  );
  return { html };
}
