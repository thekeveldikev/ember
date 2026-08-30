/* Statische Invarianten über den ganzen Quellbaum: tote Seiten-Links,
   unbekannte Push-Arten, Vibrationsmuster ohne Definition, Töne ohne
   Klang, Emojis außerhalb der erlaubten Inseln. Diese Prüfungen lesen
   den Quelltext selbst — sie fangen die Fehler, die erst beim dritten
   Klick auffallen würden.

   node --test test/statik.mjs                                          */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');

const codeDateien = readdirSync(join(wurzel, 'src'))
  .filter((d) => d.endsWith('.js') && d !== '15-vorrat.js' && d !== 'sw-vorlage.js');

const quellen = codeDateien.map((d) => ({
  name: d,
  text: readFileSync(join(wurzel, 'src', d), 'utf8'),
}));
const alles = quellen.map((q) => q.text).join('\n');

const sammle = (muster, text = alles) => {
  const raus = [];
  for (const treffer of text.matchAll(muster)) raus.push(treffer[1]);
  return raus;
};

/* --- Seiten: jeder Link führt irgendwohin ---------------------------------- */

test('jede wörtlich verlinkte Seite ist auch definiert — und keine doppelt', () => {
  const alle = sammle(/SEITEN\.(\w+)\s*=/g);
  const definiert = new Set(alle);
  assert.equal(alle.length, definiert.size,
    'doppelt definierte Seite: ' + alle.filter((s, i) => alle.indexOf(s) !== i).join(','));
  assert.ok(definiert.size >= 25, definiert.size + ' Seiten definiert');

  for (const ziel of sammle(/zeigeSeite\('([\w-]+)'\)/g)) {
    assert.ok(definiert.has(ziel), `zeigeSeite('${ziel}') zeigt ins Leere`);
  }
  for (const ziel of sammle(/spielKachel\('[^']*',\s*'[^']*',\s*'(\w+)'\)/g)) {
    assert.ok(definiert.has(ziel), `Spiel-Kachel '${ziel}' zeigt ins Leere`);
  }
});

test('die Wisch-zurück-Karte kennt nur echte Seiten', () => {
  const definiert = new Set(sammle(/SEITEN\.(\w+)\s*=/g));
  const kartentext = alles.match(/const ZURUECK_ZIEL = \{([\s\S]*?)\};/)[1];

  for (const [, von, nach] of kartentext.matchAll(/(\w+):\s*'(\w+)'/g)) {
    assert.ok(definiert.has(von), `Wisch-Start '${von}' gibt es nicht`);
    assert.ok(definiert.has(nach), `Wisch-Ziel '${nach}' gibt es nicht`);
  }
});

/* --- Push, Puls, Töne: nichts Unbekanntes wird gerufen ---------------------- */

test('jede gesendete Push-Art hat eine Hülle', () => {
  const huellen = new Set(sammle(/^\s*(\w+):\s*\{\s*titel:/gm));
  for (const art of sammle(/pushSenden\([^,()]+,\s*'(\w+)'/g)) {
    assert.ok(huellen.has(art), `pushSenden mit unbekannter Art '${art}'`);
  }
});

test('jedes gerufene Vibrationsmuster ist definiert', () => {
  const block = alles.match(/const PULS = \{([\s\S]*?)\};/)[1];
  const definiert = new Set([
    ...sammle(/(\w+):\s*\[/g, block),
    ...sammle(/PULS\.(\w+)\s*=/g),
  ]);
  for (const art of sammle(/puls\('(\w+)'\)/g)) {
    assert.ok(definiert.has(art), `puls('${art}') hat kein Muster`);
  }
});

test('jeder gerufene Ton hat einen Klang', () => {
  const toene = readFileSync(join(wurzel, 'src', '16-toene.js'), 'utf8');
  const definiert = new Set(sammle(/art === '(\w+)'/g, toene));
  for (const art of sammle(/tonSpielen\('(\w+)'\)/g)) {
    assert.ok(definiert.has(art), `tonSpielen('${art}') klingt nach nichts`);
  }
});

/* --- Die Emoji-Polizei ------------------------------------------------------ */

test('Emojis leben nur auf den zwei erlaubten Inseln', () => {
  const emoji = /[\u{1F000}-\u{1FAFF}]/u;
  const erlaubteZeichen = /[❤✦✓✗⚠❚·›∞]/u;

  for (const { name, text } of quellen) {
    text.split('\n').forEach((zeile, i) => {
      if (zeile.includes('REAKTIONEN_FEST')) return;   // die Zeichen-Auswahl im Chat
      if (!emoji.test(zeile.replace(erlaubteZeichen, ''))) return;
      const rest = [...zeile].filter((z) => emoji.test(z) && z !== '❤️').join('');
      assert.ok(!rest || zeile.includes("'❤️'"),
        `${name}:${i + 1} trägt Emoji im Code: ${zeile.trim().slice(0, 90)}`);
    });
  }
});

/* --- Bausteine, die zusammenpassen müssen ----------------------------------- */

test('die Deck-Sinnbild-Karte deckt jedes Vorrat-Deck ab', () => {
  const vorrat = JSON.parse(
    readFileSync(join(wurzel, 'src', '15-vorrat.js'), 'utf8')
      .replace(/^[\s\S]*?const VORRAT = /, '').replace(/;\s*$/, ''));
  const karte = alles.match(/const DECK_SINNBILDER = \{([\s\S]*?)\};/)[1];
  const abgedeckt = new Set(sammle(/(\w+):\s*'/g, karte));

  for (const deck of vorrat.deckMeta) {
    assert.ok(abgedeckt.has(deck.key), `Deck '${deck.key}' hat kein Sinnbild`);
  }

  /* Und jedes benutzte Sinnbild existiert im Zeichensatz. */
  const wege = new Set(sammle(/^\s{4}(\w+):\s*'<\w/gm));
  for (const bild of sammle(/:\s*'(\w+)'/g, karte)) {
    assert.ok(wege.has(bild), `Sinnbild '${bild}' ist nicht gezeichnet`);
  }
});

test('jeder gelesene Ablage-Pfad hat irgendwo einen Schreiber — Tippfehler-Wache', () => {
  const schreiber = new Set([
    ...sammle(/datenSchreib\('([\w/]+)'/g),
    ...sammle(/datenAnhaengen\('([\w/]+)'/g),
    ...sammle(/datenAendern\('([\w/]+)'/g),
  ]);
  const leser = [
    ...sammle(/datenLies\('([\w/]+)'/g),
    ...sammle(/datenListe\('([\w/]+)'/g),
    ...sammle(/datenHorch\('([\w/]+)'/g),
    ...sammle(/ablageHorch\('([\w/]+)'/g),
  ];

  const passt = (r) => [...schreiber].some((w) =>
    w === r || w.startsWith(r + '/') || r.startsWith(w + '/'));

  for (const r of new Set(leser)) {
    assert.ok(passt(r), `'${r}' wird gelesen, aber nirgends geschrieben — Tippfehler?`);
  }
});

test('der Kopf der Seite trägt seine Schutzschichten', () => {
  const kopf = readFileSync(join(wurzel, 'src', '00-head.html'), 'utf8');
  assert.ok(kopf.includes('Content-Security-Policy'), 'die CSP-Haustür steht');
  assert.ok(kopf.includes('noindex'), 'Suchmaschinen bleiben draußen');
  assert.ok(kopf.includes('no-referrer'), 'kein Verweis verrät die Herkunft');
  assert.ok(kopf.includes("frame-src 'none'"), 'keine fremden Rahmen');
  assert.ok(!kopf.includes('http://'), 'nichts Unverschlüsseltes im Kopf');
});

test('jedes gerufene Sinnbild ist gezeichnet', () => {
  const kern = readFileSync(join(wurzel, 'src', '20-core.js'), 'utf8');
  const block = kern.match(/const wege = \{([\s\S]*?)\n  \};/)[1];
  const gezeichnet = new Set(sammle(/(\w+):\s*'</g, block));
  for (const name of sammle(/sinnbild\('(\w+)'/g)) {
    assert.ok(gezeichnet.has(name), `sinnbild('${name}') gibt es nicht im Zeichensatz`);
  }
});

test('kein console.log, kein debugger, kein TODO im Ausgelieferten', () => {
  for (const { name, text } of quellen) {
    assert.ok(!/console\.log\(/.test(text), name + ': console.log vergessen');
    assert.ok(!/\bdebugger\b/.test(text), name + ': debugger vergessen');
    assert.ok(!/\b(TODO|FIXME|XXX)\b/.test(text), name + ': offene Baustelle im Code');
  }
});

test('alle versprochenen Dateien liegen wirklich da', () => {
  for (const pfad of ['schrift/inter.woff2', 'schrift/playfair.woff2',
    'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png', 'manifest.json', 'sw.js']) {
    assert.ok(readFileSync(join(wurzel, pfad)).length > 100, pfad + ' fehlt oder ist leer');
  }
});

test('kein nacktes append mit bedingtem null-Kind', () => {
  /* Das rohe append(null) schreibt den TEXT „null" auf den Schirm —
     genau so stand er einmal unter „Hinweise einschalten". */
  for (const { name, text } of quellen) {
    for (const treffer of text.matchAll(/\.append\(\s*$[\s\S]{0,600}?\);/gm)) {
      const block = treffer[0];
      if (/^\s*\w+ \? .*: null,?\s*$/m.test(block) && !block.includes('el(')) {
        assert.fail(name + ': append mit nacktem Ternär-null — anfuegen() benutzen');
      }
    }
    assert.ok(!/\.append\([^)]*\?\s*[^):]*:\s*null\s*\)/.test(text),
      name + ': einzeiliges append(x ? y : null)');
  }
});
