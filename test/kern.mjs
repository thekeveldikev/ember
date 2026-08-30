/* Böswillige Eingaben für das Fundament: Zeit, Bausteine, Krypto,
   Kopplungscode. Alles hier hat schon einmal wehgetan oder würde es —
   jede Prüfung steht für einen Weg, auf dem die App kaputtgehen könnte.

   node --test test/kern.mjs                                            */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladeApp, rein } from './rahmen.mjs';

const app = () => ladeApp().raum;

/* --- Zeit: kaputte und krumme Stempel ------------------------------------- */

test('vorZeit stürzt an keinem kaputten Stempel — nie wieder „Invalid Date"', () => {
  const raum = app();
  for (const kaputt of [undefined, null, 0, NaN, 'quatsch']) {
    const raus = raum.vorZeit(kaputt);
    assert.equal(raus, 'gerade eben', String(kaputt) + ' -> ' + raus);
  }
  /* Ein Stempel aus der Zukunft (Uhr des anderen Geräts geht vor). */
  assert.equal(raum.vorZeit(Date.now() + 999999), 'gerade eben');
  /* Und die normalen Fälle bleiben normal. */
  assert.equal(raum.vorZeit(Date.now() - 5 * 60000), '5 Min');
  assert.equal(raum.vorZeit(Date.now() - 3 * 3600000), '3 Std');
});

test('dauerText an den Rändern', () => {
  const raum = app();
  assert.equal(raum.dauerText(0), '0:00');
  assert.equal(raum.dauerText(-5000), '0:00', 'Negatives wird nicht zu Unsinn');
  assert.equal(raum.dauerText(59499), '0:59', 'runden, nicht springen');
  assert.equal(raum.dauerText(3599000), '59:59');
  assert.equal(raum.dauerText(3600000), '1:00:00', 'ab einer Stunde mit Stundenteil');
  assert.equal(raum.dauerText(36061000), '10:01:01');
});

test('tagstempel füllt einstellige Monate und Tage auf', () => {
  const raum = app();
  const raus = raum.tagstempel(new Date(2026, 0, 5).getTime());
  assert.equal(raus, '2026-01-05');
});

/* --- anfuegen: die null-Falle ---------------------------------------------- */

test('anfuegen übergeht null, false und verschachtelte Löcher', () => {
  const raum = app();
  const ziel = { kinder: [], append(...k) { this.kinder.push(...k); } };
  raum.anfuegen(ziel, null, 'a', false, [null, 'b', [undefined, 'c']]);
  const texte = ziel.kinder.map((k) => k.text || k);
  assert.deepEqual(rein(texte), ['a', 'b', 'c']);
  assert.ok(!texte.includes('null'), 'niemals der TEXT null');
});

test('sicher() entschärft jedes HTML-Zeichen', () => {
  const raum = app();
  assert.equal(raum.sicher('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');
  assert.equal(raum.sicher('a & "b" & \'c\''), 'a &amp; &quot;b&quot; &amp; &#39;c&#39;');
  assert.equal(raum.sicher(null), '', 'null wird leer, nicht "null"');
});

/* --- Krypto: Rundreise und Sabotage ---------------------------------------- */

test('verschlüsseln und entschlüsseln überstehen Umlaute, Emoji und Länge', async () => {
  const raum = app();
  await raum.schluesselLaden(raum.crypto.getRandomValues(new Uint8Array(32)));

  const proben = [
    'Öl aufs Füßchen — spät?',
    '❤️🔥 …',
    'x'.repeat(4000),
    '',
    { tief: { verschachtelt: ['ja', 2, null] } },
  ];
  for (const p of proben) {
    const brocken = await raum.verschluessle({ w: p, von: 'domme', wann: 1 });
    const klar = await raum.entschluessle(brocken);
    assert.deepEqual(rein(klar.w), rein(p));
  }
});

test('entschlüsseln von Müll liefert null statt eines Absturzes', async () => {
  const raum = app();
  await raum.schluesselLaden(raum.crypto.getRandomValues(new Uint8Array(32)));

  for (const muell of ['', 'kein base64 !!', 'QUJD', 'a'.repeat(11)]) {
    assert.equal(await raum.entschluessle(muell), null, JSON.stringify(muell));
  }
});

test('ein gekipptes Bit macht den Brocken wertlos — Manipulation fällt auf', async () => {
  const raum = app();
  await raum.schluesselLaden(raum.crypto.getRandomValues(new Uint8Array(32)));

  const brocken = await raum.verschluessle({ w: 'unantastbar', von: 'domme', wann: 1 });
  const bytes = raum.b64ZuRohe(brocken);
  bytes[bytes.length - 4] ^= 0x40;
  const kaputt = raum.roheZuB64(bytes);
  assert.equal(await raum.entschluessle(kaputt), null, 'GCM lehnt Verändertes ab');
});

test('die PIN-Truhe öffnet sich nur mit der richtigen PIN', async () => {
  const raum = app();
  const roh = raum.crypto.getRandomValues(new Uint8Array(32));

  const schrank = await raum.schluesselEinschliessen(roh, '4711');
  const wieder = await raum.schluesselAufschliessen(schrank, '4711');
  assert.deepEqual(rein([...wieder]), rein([...roh]));

  assert.equal(await raum.schluesselAufschliessen(schrank, '4712'), null);
  assert.equal(await raum.schluesselAufschliessen(schrank, ''), null);
});

test('paarKennung ist deterministisch, 32 Hex-Zeichen, und hängt am Schlüssel', async () => {
  const raum = app();
  const a = new Uint8Array(32).fill(7);
  const b = new Uint8Array(32).fill(8);
  const ka = await raum.paarKennung(a);
  assert.equal(ka, await raum.paarKennung(a), 'gleicher Schlüssel, gleiche Kennung');
  assert.match(ka, /^[0-9a-f]{32}$/);
  assert.notEqual(ka, await raum.paarKennung(b));
});

/* --- Kopplungscode und Startpaket ------------------------------------------ */

test('der Kopplungscode reist verlustfrei — mit Namen und Bote', async () => {
  const raum = app();
  const roh = raum.crypto.getRandomValues(new Uint8Array(32));
  const zugang = { projekt: 'p1', schluessel: 'k1', datenbank: 'https://x.test' };
  const namen = { domme: 'Gioia', sub: 'Kevin' };
  const bote = { url: 'https://b.workers.dev', oeffentlich: 'OEFF', geheim: 'GEH' };

  const code = await raum.kopplungscodeBauen(roh, zugang, namen, bote);
  assert.ok(code.startsWith('EMBER1.'));

  const gelesen = raum.kopplungscodeLesen('  ' + code + '\n');
  assert.deepEqual(rein([...gelesen.roh]), rein([...roh]), 'der Schlüssel kommt heil an');
  assert.deepEqual(rein(gelesen.ablage), zugang);
  assert.deepEqual(rein(gelesen.namen), namen);
  assert.deepEqual(rein(gelesen.bote), bote);
});

test('kaputte Kopplungscodes werden abgewiesen, nicht geraten', () => {
  const raum = app();
  for (const muell of ['', 'EMBER1.', 'EMBER1.%%%', 'EMBER2.abc', 'hallo welt',
    'EMBER1.' + Buffer.from('{"f":1}').toString('base64')]) {
    assert.equal(raum.kopplungscodeLesen(muell), null, JSON.stringify(muell.slice(0, 24)));
  }
});

test('das Startpaket verlangt alle drei Ablage-Angaben', () => {
  const raum = app();
  const bau = (inhalt) => 'EMBERSTART.' + Buffer.from(JSON.stringify(inhalt), 'utf8')
    .toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const gut = raum.startpaketLesen(bau({ a: { projekt: 'p', schluessel: 'k', datenbank: 'd' }, b: null }));
  assert.equal(gut.zugang.projekt, 'p');
  assert.equal(gut.bote, null);

  assert.equal(raum.startpaketLesen(bau({ a: { projekt: 'p' } })), null, 'unvollständig');
  assert.equal(raum.startpaketLesen('EMBERSTART.###'), null);
  assert.equal(raum.startpaketLesen('EMBER1.xyz'), null, 'falscher Vorspann');
});
