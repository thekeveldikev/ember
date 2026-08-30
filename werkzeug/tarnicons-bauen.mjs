/* Zeichnet die harmlosen Tarn-Symbole als PNG — ohne Browser, ohne
   Abhängigkeiten. Ein winziger PNG-Schreiber (zlib liefert Node) plus
   ein Software-Rasterizer für Rechtecke und Kreise reichen völlig:
   Die Symbole sind bewusst schlichte, eigene Zeichnungen, die nur wie
   irgendeine Notiz-, Rechner- oder Wetter-App AUSSEHEN.

   node werkzeug/tarnicons-bauen.mjs                                     */

import { deflateSync } from 'node:zlib';
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const G = 180;

/* --- PNG schreiben --------------------------------------------------------- */

const CRC_TAB = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = (c & 1) ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TAB[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const stueck = (typ, daten) => {
  const kopf = Buffer.alloc(4);
  kopf.writeUInt32BE(daten.length);
  const koerper = Buffer.concat([Buffer.from(typ), daten]);
  const pruefe = Buffer.alloc(4);
  pruefe.writeUInt32BE(crc32(koerper));
  return Buffer.concat([kopf, koerper, pruefe]);
};

function pngSchreiben(pfad, pixel) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(G, 0);
  ihdr.writeUInt32BE(G, 4);
  ihdr[8] = 8; ihdr[9] = 2;              /* 8 Bit, RGB */
  const zeilen = [];
  for (let y = 0; y < G; y++) {
    zeilen.push(Buffer.from([0]), pixel.subarray(y * G * 3, (y + 1) * G * 3));
  }
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    stueck('IHDR', ihdr),
    stueck('IDAT', deflateSync(Buffer.concat(zeilen), { level: 9 })),
    stueck('IEND', Buffer.alloc(0)),
  ]);
  writeFileSync(join(wurzel, pfad), png);
  console.log('  ' + pfad + '  ' + (png.length / 1024).toFixed(1) + ' KB');
}

/* --- Der Mini-Rasterizer ---------------------------------------------------- */

function leinwand() { return Buffer.alloc(G * G * 3); }
const setz = (p, x, y, [r, g, b]) => {
  if (x < 0 || y < 0 || x >= G || y >= G) return;
  const i = (y * G + x) * 3;
  p[i] = r; p[i + 1] = g; p[i + 2] = b;
};
function rechteck(p, x0, y0, br, ho, farbe) {
  for (let y = y0; y < y0 + ho; y++) for (let x = x0; x < x0 + br; x++) setz(p, x, y, farbe);
}
function kreis(p, cx, cy, rad, farbe) {
  for (let y = Math.floor(cy - rad); y <= cy + rad; y++)
    for (let x = Math.floor(cx - rad); x <= cx + rad; x++)
      if ((x - cx) ** 2 + (y - cy) ** 2 <= rad * rad) setz(p, x, y, farbe);
}
/* Senkrechter Verlauf über die ganze Fläche. */
function verlauf(p, oben, unten) {
  for (let y = 0; y < G; y++) {
    const t = y / (G - 1);
    const f = oben.map((o, i) => Math.round(o + (unten[i] - o) * t));
    for (let x = 0; x < G; x++) setz(p, x, y, f);
  }
}

/* --- Die drei Zeichnungen --------------------------------------------------- */

/* Notiz: Papier, gelber Kopf, graue Linien. */
{
  const p = leinwand();
  verlauf(p, [251, 248, 242], [241, 237, 227]);
  rechteck(p, 0, 0, G, 52, [247, 214, 75]);
  rechteck(p, 0, 49, G, 3, [230, 195, 55]);
  for (let y = 84; y <= 150; y += 22) rechteck(p, 22, y, 136, 3, [172, 162, 142]);
  pngSchreiben('icons/tarn-notiz-180.png', p);
}

/* Rechner: dunkel, runde Tasten, eine orangene Spalte. */
{
  const p = leinwand();
  rechteck(p, 0, 0, G, G, [28, 28, 30]);
  const xs = [34, 82, 130], ys = [38, 86, 134];
  ys.forEach((y, zi) => xs.forEach((x, si) => {
    kreis(p, x, y, 19, si === 2 ? [245, 166, 35] : zi === 0 ? [90, 90, 94] : [58, 58, 60]);
  }));
  pngSchreiben('icons/tarn-rechner-180.png', p);
}

/* Wetter: Himmel, Sonne, Wolke. */
{
  const p = leinwand();
  verlauf(p, [61, 143, 224], [108, 182, 240]);
  kreis(p, 118, 64, 34, [255, 211, 71]);
  const w = [255, 255, 255];
  kreis(p, 66, 112, 30, w);
  kreis(p, 102, 104, 24, w);
  kreis(p, 128, 118, 20, w);
  rechteck(p, 46, 112, 102, 28, w);
  kreis(p, 46, 126, 14, w);
  kreis(p, 148, 126, 14, w);
  pngSchreiben('icons/tarn-wetter-180.png', p);
}
