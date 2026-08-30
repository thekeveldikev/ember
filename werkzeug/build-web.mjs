/* EMBER Bau — macht aus src/ eine einzige index.html.
   Gleiches Prinzip wie VANI: ein gemeinsamer globaler Skriptraum, keine
   Module, keine Imports. esbuild schrumpft nur Syntax und Leerraum; die
   Namen bleiben erhalten, damit die Quelldateien die Wahrheit bleiben.

   Anders als bei VANI gibt es hier genau EINE Stelle für die Fassung:
   package.json. Von dort wandert sie in den Dienst (sw.js) und in die App
   (APP_VERSION). So kann keine der drei Stellen mehr auseinanderlaufen. */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const lies = (p) => readFileSync(join(wurzel, p), 'utf8').replace(/\r\n/g, '\n');
const schreib = (p, inhalt) => writeFileSync(join(wurzel, p), inhalt);

/* Reihenfolge zählt: alles liegt im selben Namensraum, also müssen
   Grundlagen vor ihren Benutzern stehen. Neue Bereiche kommen ans Ende,
   kurz vor 90-start.js. */
const jsDateien = [
  'src/15-vorrat.js',
  'src/16-toene.js',
  'src/17-vorrathilfen.js',
  'src/20-core.js',
  'src/21-krypto.js',
  'src/22-firebase.js',
  'src/23-push.js',
  'src/24-daten.js',
  'src/25-raeume.js',
  'src/30-setup.js',
  'src/31-schloss.js',
  'src/40-huelle.js',
  'src/41-heim.js',
  'src/42-knopf.js',
  'src/43-plausch.js',
  'src/43b-stimme.js',
  'src/44-spiel.js',
  'src/44b-rad.js',
  'src/44c-szenario.js',
  'src/44d-wahrheit.js',
  'src/44e-rubbeln.js',
  'src/45-auftraege.js',
  'src/45b-foto.js',
  'src/46-buch.js',
  'src/47-ich.js',
  'src/48-wachsen.js',
  'src/48b-pfade.js',
  'src/49-wuensche.js',
  'src/49b-grenzen.js',
  'src/50-ampel.js',
  'src/51-notaus.js',
  'src/52-tarnung.js',
  'src/53-spannung.js',
  'src/54-tresor.js',
  'src/55-vertrag.js',
  'src/56-rituale.js',
  'src/57-sperre.js',
  'src/58-boss.js',
  'src/59-quiz.js',
  'src/60-funken.js',
  'src/61-keks.js',
  'src/62-tagesaufgabe.js',
  'src/63-regie.js',
  'src/64-maschine.js',
  'src/65-kleinigkeiten.js',
  'src/66-laden.js',
  'src/90-start.js',
];

const paket = JSON.parse(lies('package.json'));
const fassung = paket.version;
const debug = process.env.EMBER_DEBUG_BAU === '1';

const fehlend = jsDateien.filter((p) => !existsSync(join(wurzel, p)));
if (fehlend.length) {
  console.error('Diese Quelldateien fehlen noch:\n  ' + fehlend.join('\n  '));
  process.exit(1);
}

/* Die Fassung wird vorangestellt, nicht in eine Quelldatei geschrieben. */
const kopfJs = `const APP_VERSION=${JSON.stringify(fassung)};\n`;
const rohJs = kopfJs + jsDateien.map(lies).join('\n');
const rohStil = lies('src/10-style.css');

const js = (debug ? rohJs : transformSync(rohJs, {
  loader: 'js',
  target: ['es2022', 'safari16'],
  minifyWhitespace: true,
  minifySyntax: true,
  minifyIdentifiers: false,
  legalComments: 'none',
}).code).replace(/<\/script/gi, '<\\/script');

const stil = debug ? rohStil : transformSync(rohStil, {
  loader: 'css',
  target: ['safari16'],
  minify: true,
  legalComments: 'none',
}).code;

const index = [
  lies('src/00-head.html'),
  '<style>', stil, '</style>',
  '</head>',
  '<body>',
  lies('src/05-shell.html'),
  '<script>', js, '</script>',
  '</body>',
  '</html>',
  '',
].join('\n');

schreib('index.html', index);

/* Der Dienst bekommt dieselbe Fassung. Sein Zwischenlager trägt sie im
   Namen — dadurch räumt ein neuer Dienst den alten Bestand selbst weg. */
/* Global ersetzen, nicht nur den ersten Treffer: Der Platzhalter stand
   auch im Kommentar der Vorlage, und replace mit Zeichenkette nimmt nur
   das erste Vorkommen — der Kommentar bekam die Nummer, der Code behielt
   den Platzhalter. Der Lagername war dadurch in jeder Fassung derselbe,
   und der ganze Aktualisierungsweg lief ins Leere. */
const dienst = lies('src/sw-vorlage.js').replace(/__FASSUNG__/g, fassung);
schreib('sw.js', dienst);

/* Auch das Anzeigeblatt kennt die Fassung, damit installierte Symbole
   nach einem Namenswechsel nicht auseinanderfallen. */
const blatt = JSON.parse(lies('src/manifest-vorlage.json'));
blatt.version = fassung;
schreib('manifest.json', JSON.stringify(blatt, null, 2) + '\n');

const kb = (n) => (n / 1024).toFixed(1) + ' KB';
console.log(`EMBER ${fassung}`);
console.log('  index.html    ' + kb(Buffer.byteLength(index)));
console.log('  sw.js         ' + kb(Buffer.byteLength(dienst)));
console.log('  manifest.json geschrieben');
