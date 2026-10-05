#!/usr/bin/env node
// Erzeugt die Daten aus den BNetzA-Rohdaten. Die Rohdaten (data/raw/) liegen nur lokal und nicht im Repo.
// Fehlen sie (z. B. beim Build auf Vercel), werden die bereits eingecheckten Dateien in
// src/data/generated/ und public/data/ unverändert verwendet.
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync('data/raw/bnetza/latest.json')) {
  run('node scripts/generate-city-registries.mjs');
  run('node scripts/generate-hpc-monitor-data.js');
  run('node scripts/generate-hpc-history-data.mjs');
  run('node scripts/generate-cpo-monitor-data.mjs');
} else {
  console.log('Keine Rohdaten (data/raw/bnetza/latest.json) – verwende eingecheckte Daten aus src/data/generated und public/data.');
  run('node scripts/generate-hpc-monitor-data.js');
}
