/* Zeichnet die Sinnbilder der App.  node werkzeug/icons.mjs

   Ohne Bildbibliothek: ein PNG ist im Kern nur ein zlib-gepackter Strom
   von Bildzeilen mit drei Blöcken drumherum. Das lohnt sich hier, weil
   das Motiv rechnerisch ist — eine Glut auf schwarzem Grund. */

import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
mkdirSync(join(wurzel, 'icons'), { recursive: true });

/* --- PNG ------------------------------------------------------------------ */

const kurbel = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(puffer) {
  let c = 0xffffffff;
  for (const b of puffer) c = kurbel[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function block(art, inhalt) {
  const name = Buffer.from(art, 'ascii');
  const laenge = Buffer.alloc(4);
  laenge.writeUInt32BE(inhalt.length);
  const pruef = Buffer.alloc(4);
  pruef.writeUInt32BE(crc32(Buffer.concat([name, inhalt])));
  return Buffer.concat([laenge, name, inhalt, pruef]);
}

function pngBauen(breite, hoehe, rgba) {
  const kopf = Buffer.alloc(13);
  kopf.writeUInt32BE(breite, 0);
  kopf.writeUInt32BE(hoehe, 4);
  kopf[8] = 8;    // Bit je Kanal
  kopf[9] = 6;    // RGBA
  /* 10..12 bleiben 0: Standardverfahren, kein Verschachteln */

  /* Jede Zeile bekommt ihr Filterbyte 0 vorangestellt. */
  const roh = Buffer.alloc(hoehe * (1 + breite * 4));
  for (let y = 0; y < hoehe; y++) {
    const ziel = y * (1 + breite * 4);
    roh[ziel] = 0;
    rgba.copy(roh, ziel + 1, y * breite * 4, (y + 1) * breite * 4);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    block('IHDR', kopf),
    block('IDAT', deflateSync(roh, { level: 9 })),
    block('IEND', Buffer.alloc(0)),
  ]);
}

/* --- Das Motiv ------------------------------------------------------------ */

/* Eine Glut: außen fast schwarz, innen warm. Zwei weiche Übergänge und ein
   Lichtpunkt, der sie plastisch macht. */

const mische = (a, b, t) => a.map((w, i) => Math.round(w + (b[i] - w) * t));

function glut(groesse) {
  const rgba = Buffer.alloc(groesse * groesse * 4);
  const mitte = (groesse - 1) / 2;
  const rand = groesse * 0.255;
  const kern = groesse * 0.075;
  const rundung = groesse * 0.225;  // Kachelecken wie bei iOS

  const GRUND = [10, 10, 10];
  const TIEF = [92, 43, 26];
  const GLUT = [196, 120, 90];
  const HELL = [255, 226, 196];

  for (let y = 0; y < groesse; y++) {
    for (let x = 0; x < groesse; x++) {
      const i = (y * groesse + x) * 4;

      /* Der Grund mit abgerundeten Ecken. */
      const ex = Math.max(Math.abs(x - mitte) - (mitte - rundung), 0);
      const ey = Math.max(Math.abs(y - mitte) - (mitte - rundung), 0);
      const drin = Math.hypot(ex, ey) <= rundung + 0.5;

      if (!drin) { rgba[i + 3] = 0; continue; }

      /* Der Lichtpunkt sitzt oben links, nicht in der Mitte. */
      const dx = x - mitte + groesse * 0.055;
      const dy = y - mitte + groesse * 0.07;
      const weite = Math.hypot(dx, dy);

      let farbe;
      if (weite <= kern) {
        farbe = mische(HELL, GLUT, weite / kern);
      } else if (weite <= rand) {
        const t = (weite - kern) / (rand - kern);
        farbe = mische(GLUT, TIEF, Math.pow(t, 1.5));
      } else {
        /* Der Schein fällt rasch ab, sonst wird aus der Glut ein Fleck. */
        const t = Math.min((weite - rand) / (groesse * 0.2), 1);
        farbe = mische(TIEF, GRUND, Math.pow(t, 0.62));
      }

      rgba[i] = farbe[0];
      rgba[i + 1] = farbe[1];
      rgba[i + 2] = farbe[2];
      rgba[i + 3] = 255;
    }
  }
  return pngBauen(groesse, groesse, rgba);
}

for (const groesse of [180, 192, 512]) {
  const ziel = join(wurzel, 'icons', 'icon-' + groesse + '.png');
  writeFileSync(ziel, glut(groesse));
  console.log('icons/icon-' + groesse + '.png');
}
