
import fs from 'node:fs';
import path from 'node:path';

const VALID_SLUGS = new Set([
  'aral-pulse-lkw-megawatt-hub-schwarmstedt',
  'aral-pulse-lkw-megawatt-hub-schnaittach',
  'aral-pulse-lkw-megawatt-hub-rastow',
  'aral-pulse-lkw-megawatt-hub-koenigs-wusterhausen',
  'hola-forschungskorridor-raststaette-lipperland-sued',
  'hola-forschungskorridor-lehre-wendhausen',
  'milence-lkw-ladehub-hermsdorfer-kreuz',
  'milence-lkw-ladehub-kassel-lohfelden'
]);

export default function handler(req, res) {
  const url = new URL(req.url, 'https://www.ladestandorte.de');
  const slug = url.searchParams.get('slug') || '';

  if (VALID_SLUGS.has(slug)) {
    const filePath = path.join(process.cwd(), 'dist/mcs/hub', slug, 'index.html');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(200).send(fs.readFileSync(filePath, 'utf8'));
      return;
    }
  }

  // Not valid or not found: Return genuine HTTP 404
  const notFoundPath = path.join(process.cwd(), 'dist/404/index.html');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  if (fs.existsSync(notFoundPath)) {
    res.status(404).send(fs.readFileSync(notFoundPath, 'utf8'));
  } else {
    res.status(404).send('<!doctype html><html><head><title>404</title></head><body><h1>404 – Seite nicht gefunden</h1></body></html>');
  }
}
