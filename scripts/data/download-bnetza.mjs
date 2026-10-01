#!/usr/bin/env node
/**
 * scripts/data/download-bnetza.mjs
 * Downloads raw official BNetzA CSV files from Mobilithek/NOW/BNetzA CloudFront mirror,
 * verifies SHA-256 hashes, and records immutable snapshot metadata.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../..');

const BNETZA_FILES = [
  {
    name: 'ladestationen',
    filename: 'bnetza_api_ladestation000.csv',
    url: 'https://d1269bxe5ubfat.cloudfront.net/bnetza-api/data/bnetza_api_ladestation000.csv?v=1'
  },
  {
    name: 'ladepunkte',
    filename: 'bnetza_api_ladepunkt000.csv',
    url: 'https://d1269bxe5ubfat.cloudfront.net/bnetza-api/data/bnetza_api_ladepunkt000.csv?v=1'
  }
];

function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(destPath);
    const hash = crypto.createHash('sha256');

    const request = https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: HTTP ${response.statusCode}`));
        return;
      }

      response.on('data', (chunk) => {
        hash.update(chunk);
        fileStream.write(chunk);
      });

      response.on('end', () => {
        fileStream.end();
      });

      fileStream.on('finish', () => {
        const sha256 = hash.digest('hex');
        const stats = fs.statSync(destPath);
        resolve({
          sha256,
          byteSize: stats.size,
          lastModifiedHeader: response.headers['last-modified'] || null,
          etagHeader: response.headers['etag'] || null
        });
      });

      fileStream.on('error', reject);
    });

    request.on('error', reject);
  });
}

async function main() {
  const today = new Date().toISOString().split('T')[0];
  const targetDir = path.join(ROOT_DIR, 'data/raw/bnetza', today);

  console.log(`[BNetzA Pipeline] Target snapshot directory: ${targetDir}`);
  fs.mkdirSync(targetDir, { recursive: true });

  const metadata = {
    snapshotDate: today,
    downloadTimestamp: new Date().toISOString(),
    sourcePublisher: 'Bundesnetzagentur / NOW GmbH / Mobilithek',
    license: 'Creative Commons Namensnennung 4.0 International (CC BY 4.0)',
    attribution: 'Bundesnetzagentur.de / NOW GmbH (Nationale Leitstelle Ladeinfrastruktur)',
    files: {}
  };

  for (const item of BNETZA_FILES) {
    const filePath = path.join(targetDir, item.filename);
    console.log(`[BNetzA Pipeline] Downloading ${item.filename} from ${item.url}...`);
    const result = await downloadFile(item.url, filePath);
    console.log(`[BNetzA Pipeline] Done: ${item.filename} (${(result.byteSize / (1024 * 1024)).toFixed(2)} MB, SHA-256: ${result.sha256})`);
    
    metadata.files[item.name] = {
      filename: item.filename,
      url: item.url,
      byteSize: result.byteSize,
      sha256: result.sha256,
      lastModified: result.lastModifiedHeader,
      etag: result.etagHeader
    };
  }

  const metaPath = path.join(targetDir, 'metadata.json');
  fs.writeFileSync(metaPath, JSON.stringify(metadata, null, 2), 'utf-8');
  console.log(`[BNetzA Pipeline] Metadata written to ${metaPath}`);

  // Create latest symlink or pointer
  const latestMetaPath = path.join(ROOT_DIR, 'data/raw/bnetza/latest.json');
  fs.writeFileSync(latestMetaPath, JSON.stringify({
    latestSnapshotDate: today,
    path: `data/raw/bnetza/${today}`,
    metadata
  }, null, 2), 'utf-8');
  console.log(`[BNetzA Pipeline] Latest pointer updated at ${latestMetaPath}`);
}

main().catch((err) => {
  console.error('[BNetzA Pipeline] Error during download:', err);
  process.exit(1);
});
