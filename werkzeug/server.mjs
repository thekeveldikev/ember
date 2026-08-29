/* Ein Server zum Ausprobieren.  npm start  ->  http://localhost:5173

   GitHub Pages liefert später dasselbe aus. Hier gibt es nur zwei
   Zutaten mehr: kein Zwischenlagern, damit jede Änderung sofort da ist. */

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const hafen = Number(process.env.PORT || 5173);

const ARTEN = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.svg': 'image/svg+xml',
};

createServer(async (anfrage, antwort) => {
  try {
    const weg = decodeURIComponent(new URL(anfrage.url, 'http://x').pathname);
    /* Kein Ausbrechen aus dem Ordner. */
    const sauber = normalize(weg).replace(/^(\.\.[/\\])+/, '');
    let datei = join(wurzel, sauber === '/' ? 'index.html' : sauber);

    const info = await stat(datei).catch(() => null);
    if (info && info.isDirectory()) datei = join(datei, 'index.html');

    const inhalt = await readFile(datei);
    antwort.writeHead(200, {
      'Content-Type': ARTEN[extname(datei)] || 'application/octet-stream',
      'Cache-Control': 'no-store',
      /* Der Dienst darf nur gelten, wenn er auch vom Wurzelpfad kommt. */
      'Service-Worker-Allowed': '/',
    });
    antwort.end(inhalt);
  } catch {
    antwort.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    antwort.end('nicht da');
  }
}).listen(hafen, () => console.log('EMBER läuft auf http://localhost:' + hafen));
