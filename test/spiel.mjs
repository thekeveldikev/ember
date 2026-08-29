/* Prüft die Rechenteile der V2-Bereiche: den blinden Abgleich der Wünsche,
   die Serie der Rituale und die Stufenschwellen.

   node --test test/spiel.mjs                                            */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladeApp, rein } from './rahmen.mjs';

const DATEIEN = [
  'src/20-core.js', 'src/21-krypto.js', 'src/22-firebase.js', 'src/24-daten.js',
  'src/48-wachsen.js', 'src/49-wuensche.js', 'src/56-rituale.js',
];

const app = () => ladeApp({ dateien: DATEIEN }).raum;

/* --- Der blinde Abgleich -------------------------------------------------- */

test('unterschiedlich geschriebene Wünsche finden sich', () => {
  const raum = app();
  const paare = [
    ['Die Augenbinde', 'augenbinden'],
    ['Augenbinde benutzen', 'die Augenbinde'],
    ['Handschellen', 'Handschelle'],
    ['im Auto', 'Auto'],
    ['Ein Wochenende weg', 'wochenende'],
  ];
  for (const [a, b] of paare) {
    assert.ok(raum.meinenDasselbe(a, b), `"${a}" und "${b}" sollten sich treffen`);
  }
});

test('verschiedene Wünsche treffen sich nicht', () => {
  const raum = app();
  const paare = [
    ['Nur ich allein', 'Nur du'],
    ['Die Augenbinde', 'Das Halsband'],
    ['im Auto', 'in der Küche'],
    ['Ein Wochenende weg', 'Ein Abend zu Hause'],
  ];
  for (const [a, b] of paare) {
    assert.ok(!raum.meinenDasselbe(a, b), `"${a}" und "${b}" sollten getrennt bleiben`);
  }
});

test('Füllwörter allein stiften keinen Treffer', () => {
  const raum = app();
  assert.ok(!raum.meinenDasselbe('mit der Hand', 'mit dem Mund'));
  assert.deepEqual(rein(raum.woerter('und mit der die das')), []);
});

/* --- Die Serie ------------------------------------------------------------ */

function tageZurueck(...abstaende) {
  const heute = new Date();
  heute.setHours(12, 0, 0, 0);
  return abstaende.map((d) => {
    const x = new Date(heute);
    x.setDate(x.getDate() - d);
    const p = (n) => String(n).padStart(2, '0');
    return x.getFullYear() + '-' + p(x.getMonth() + 1) + '-' + p(x.getDate());
  });
}

test('die Serie zählt zusammenhängende Tage', () => {
  const raum = app();
  assert.equal(raum.serieAus(tageZurueck(0, 1, 2)), 3, 'heute, gestern, vorgestern');
  assert.equal(raum.serieAus(tageZurueck(0, 1, 2, 4)), 3, 'die Lücke bricht ab');
  assert.equal(raum.serieAus(tageZurueck(1, 2)), 2, 'heute noch offen bricht nicht');
  assert.equal(raum.serieAus(tageZurueck(2, 3)), 0, 'gestern gerissen');
  assert.equal(raum.serieAus([]), 0);
});

/* --- Die Stufen ----------------------------------------------------------- */

test('die Stufen wachsen und rechnen sich stimmig', () => {
  const raum = app();
  assert.equal(raum.stufeAus(0).stufe, 1);
  assert.equal(raum.stufeAus(99).stufe, 1);
  assert.equal(raum.stufeAus(100).stufe, 2);
  assert.equal(raum.stufeAus(100).imLevel, 0);

  /* Jede Schwelle liegt über der vorigen. */
  let vorige = 0;
  for (let xp = 0; xp < 20000; xp += 137) {
    const s = raum.stufeAus(xp);
    assert.ok(s.imLevel < s.bisNaechste, 'im Level bleibt unter der Schwelle');
    assert.ok(s.stufe >= vorige, 'die Stufe fällt nie');
    vorige = s.stufe;
  }
});
