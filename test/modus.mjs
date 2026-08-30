/* Wer führt — und wer rechnet. Die drei Weisen zu spielen greifen tief:
   `istDomme()` beantwortet ab dem Modus-Umbau „darf ich führen?", während
   `istWaechter()` unverändert „rechne ich die Automatik?" beantwortet.
   Verwechselt man die beiden, läuft im Modus „gleich" jeder Zahltag
   doppelt — genau davor stehen diese Prüfungen.

   node --test test/modus.mjs                                            */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladeApp, anmelden, rein } from './rahmen.mjs';

const DATEIEN = [
  'src/15-vorrat.js', 'src/16-toene.js', 'src/17-vorrathilfen.js',
  'src/20-core.js', 'src/21-krypto.js', 'src/22-firebase.js', 'src/23-push.js',
  'src/24-daten.js', 'src/25-raeume.js', 'src/26-modus.js',
];

const app = (rolle) => ladeApp({ dateien: DATEIEN, rolle });

test('geführt: sie führt, er folgt — wie eh und je', () => {
  const sie = app('domme').raum;
  const er = app('sub').raum;
  sie.__modus('gefuehrt'); er.__modus('gefuehrt');

  assert.equal(sie.istDomme(), true);
  assert.equal(er.istDomme(), false);
  assert.equal(er.istSub(), true);
  assert.equal(sie.gefaelleAn(), true);
});

test('getauscht: alles dreht sich um', () => {
  const sie = app('domme').raum;
  const er = app('sub').raum;
  sie.__modus('getauscht'); er.__modus('getauscht');

  assert.equal(sie.istDomme(), false, 'sie folgt jetzt');
  assert.equal(er.istDomme(), true, 'er führt jetzt');
  assert.equal(sie.istSub(), true);
  assert.equal(er.gefaelleAn(), true, 'ein Gefälle gibt es weiterhin');
});

test('gleich: beide führen, niemand folgt', () => {
  const sie = app('domme').raum;
  const er = app('sub').raum;
  sie.__modus('gleich'); er.__modus('gleich');

  assert.equal(sie.istDomme(), true);
  assert.equal(er.istDomme(), true, 'auch er hat den Knopf');
  assert.equal(sie.istSub(), false, 'niemand folgt — istSub ist NICHT das Gegenteil');
  assert.equal(er.istSub(), false);
  assert.equal(er.gefaelleAn(), false, 'kein Oben, kein Unten');
});

test('der Wächter bleibt derselbe — in jedem Modus', () => {
  const sie = app('domme').raum;
  const er = app('sub').raum;

  for (const m of ['gefuehrt', 'gleich', 'getauscht']) {
    sie.__modus(m); er.__modus(m);
    assert.equal(sie.istWaechter(), true, m + ': ihr Gerät rechnet');
    assert.equal(er.istWaechter(), false, m + ': seins rechnet nicht');
  }
  /* Sonst liefen Zahltag, versäumte Aufträge und Zeitregeln doppelt. */
});

test('ein unbekannter Modus fällt sauber auf „geführt" zurück', async () => {
  const { raum } = app('domme');
  await anmelden(raum);
  await raum.datenSchreib('einst/modus', 'unfug');
  await raum.modusLaden();
  assert.equal(raum.modusJetzt(), 'gefuehrt');
});

test('der Modus überlebt den Neustart: er liegt auch auf dem Gerät', async () => {
  const ablage = (await import('./rahmen.mjs')).baueAblage();
  const erste = ladeApp({ dateien: DATEIEN, rolle: 'domme', ablage });
  await anmelden(erste.raum);
  await erste.raum.datenSchreib('einst/modus', 'gleich');
  await erste.raum.modusLaden();
  assert.equal(erste.raum.Gerät.lies('modus'), 'gleich', 'auf dem Gerät gemerkt');
});

test('die drei Weisen sind vollständig beschrieben', () => {
  const { raum } = app('domme');
  assert.equal(raum.MODI.length, 3);
  for (const m of rein(raum.MODI)) {
    assert.ok(m.key && m.name && m.kurz && m.lang, m.key + ' ist unvollständig');
    assert.ok(m.lang.length > 60, m.key + ': die lange Erklärung ist zu dünn');
  }
});
