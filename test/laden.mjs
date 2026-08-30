/* Der Laden unter Beschuss: der pure Rechenkern (Schulden, Zinsen,
   Glutverlust, Preise, Sperrfristen) und der Buchungsfluss mit seinen
   Deckeln, der Verdopplung und der Rot-Sicherung.

   node --test test/laden.mjs                                            */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladeApp, anmelden, rein } from './rahmen.mjs';

const DATEIEN = [
  'src/15-vorrat.js', 'src/16-toene.js', 'src/17-vorrathilfen.js',
  'src/20-core.js', 'src/21-krypto.js', 'src/22-firebase.js', 'src/23-push.js', 'src/24-daten.js', 'src/26-modus.js',
  'src/66-laden.js',
];

const app = () => ladeApp({ dateien: DATEIEN });

/* --- Der Rechenkern --------------------------------------------------------- */

test('die Schuldenstufen greifen an den richtigen Grenzen', () => {
  const { raum } = app();
  assert.equal(raum.schuldenStufe(0), null);
  assert.equal(raum.schuldenStufe(3), null);
  assert.equal(raum.schuldenStufe(-1).nurGnade, true);
  assert.equal(raum.schuldenStufe(-10).nurGnade, true);
  assert.equal(raum.schuldenStufe(-11).keineKaeufe, true);
  assert.equal(raum.schuldenStufe(-21).gehaltTilgt, true);
  assert.equal(raum.schuldenStufe(-31).sieEntscheidet, true);
});

test('Zinsen treffen nur Schulden, der Glutverlust nur freies Guthaben ab 20', () => {
  const { raum } = app();
  assert.equal(raum.zinsenAuf(10), 0);
  assert.equal(raum.zinsenAuf(0), 0);
  assert.equal(raum.zinsenAuf(-20), -2);
  assert.equal(raum.zinsenAuf(-25), -3, 'gerundet, nicht abgeschnitten');

  assert.equal(raum.inflationAuf(19), 0, 'Kleines bleibt unangetastet');
  assert.equal(raum.inflationAuf(20), -1);
  assert.equal(raum.inflationAuf(100), -5);
  assert.equal(raum.inflationAuf(100, 90), 0, 'Erspartes verliert nicht');
  assert.equal(raum.inflationAuf(-10), 0, 'Schulden verlieren erst recht nicht');
});

test('Preise: Ihre Zahl schlägt den Katalog, ein Angebot drückt, nie unter eins', () => {
  const { raum } = app();
  const artikel = { id: 'x', preis: 20 };
  assert.equal(raum.ladenPreisVon(artikel), 20);
  assert.equal(raum.ladenPreisVon(artikel, { x: 35 }), 35);
  assert.equal(raum.ladenPreisVon(artikel, {}, { artikelId: 'x', rabatt: 50, bis: Date.now() + 9e5 }), 10);
  assert.equal(raum.ladenPreisVon(artikel, {}, { artikelId: 'x', rabatt: 99, bis: Date.now() + 9e5 }), 1);
  assert.equal(raum.ladenPreisVon(artikel, {}, { artikelId: 'x', rabatt: 50, bis: Date.now() - 1 }), 20,
    'ein abgelaufenes Angebot ist keins');
  assert.equal(raum.ladenPreisVon(artikel, {}, { artikelId: 'y', rabatt: 50, bis: Date.now() + 9e5 }), 20,
    'das Angebot gilt nur seinem Artikel');
});

test('die Sperrfrist rechnet ab dem letzten Kauf', () => {
  const { raum } = app();
  const artikel = { cooldown_h: 2 };
  assert.equal(raum.ladenCooldownRest(artikel, 0), 0, 'nie gekauft, nie gesperrt');
  assert.equal(raum.ladenCooldownRest({ cooldown_h: 0 }, Date.now()), 0);
  const rest = raum.ladenCooldownRest(artikel, Date.now() - 3600000);
  assert.ok(rest > 3590000 && rest <= 3600000, String(rest));
});

/* --- Der Buchungsfluss ------------------------------------------------------- */

async function kontoAuf(raum, karma = 0, mehr = {}) {
  await raum.datenSchreib('konto', { an: true, karma, siegel: 0, gehalt: 10, ...mehr });
  await raum.kontoLaden();
}

test('jede Buchung landet mit Saldo im Buch — der Stand lügt nie', async () => {
  const { raum } = app();
  await anmelden(raum);
  await kontoAuf(raum, 10);

  await raum.kontoBuchen(5, 'karma', 'Probe eins', true);
  await raum.kontoBuchen(-8, 'karma', 'Probe zwei', true);
  await raum.kontoBuchen(1, 'siegel', 'Meilenstein', true);

  const konto = await raum.datenLies('konto');
  assert.equal(konto.karma, 7);
  assert.equal(konto.siegel, 1);

  const buch = await raum.datenListe('kontobuch');
  assert.deepEqual(rein(buch.map((b) => [b.betrag, b.saldo])), [[5, 15], [-8, 7], [1, 1]]);
});

test('Siegel fallen nie unter null', async () => {
  const { raum } = app();
  await anmelden(raum);
  await kontoAuf(raum, 0);
  await raum.kontoBuchen(-3, 'siegel', 'Unmögliches', true);
  assert.equal((await raum.datenLies('konto')).siegel, 0);
});

test('der Tagesdeckel hält: dreimal zählt, das vierte Mal verpufft', async () => {
  const { raum } = app();
  await anmelden(raum);
  await kontoAuf(raum, 0);

  for (let i = 0; i < 5; i++) {
    await raum.kontoVerdienst('auftrag', 1, 'karma', 3, 'Auftrag');
  }
  assert.equal((await raum.datenLies('konto')).karma, 3);
  assert.equal((await raum.datenListe('kontobuch')).length, 3);
});

test('bei geschlossenem Laden verdient niemand', async () => {
  const { raum } = app();
  await anmelden(raum);
  await raum.datenSchreib('konto', { an: false, karma: 0, siegel: 0 });
  await raum.kontoLaden();
  await raum.kontoVerdienst('aufgabe', 2, 'karma', 1, 'Aufgabe');
  assert.equal((await raum.datenLies('konto')).karma, 0);
});

test('dasselbe Vergehen binnen sieben Tagen kostet doppelt', async () => {
  const { raum } = app();
  await anmelden(raum);
  await kontoAuf(raum, 20);
  raum.D.ampel = { domme: 'gruen', sub: 'gruen' };

  await raum.kontoBussgeld('Falsche Anrede', -1);
  await raum.kontoBussgeld('Falsche Anrede', -1);

  const buch = await raum.datenListe('kontobuch');
  assert.deepEqual(rein(buch.map((b) => b.betrag)), [-1, -2], 'die Wiederholung zahlt doppelt');
  assert.equal((await raum.datenLies('konto')).karma, 17);
});

test('bei Rot wird kein Bußgeld berechnet — fest verdrahtet', async () => {
  const { raum } = app();
  await anmelden(raum);
  await kontoAuf(raum, 20);
  raum.D.ampel = { domme: 'gruen', sub: 'rot' };

  await raum.kontoBussgeld('Gelogen', -20);
  assert.equal((await raum.datenLies('konto')).karma, 20, 'unberührt');
  assert.equal((await raum.datenListe('kontobuch')).length, 0);
});

/* --- Die Automatik ------------------------------------------------------------ */

test('der letzte fällige Sonntag ist ein Sonntag um 20 Uhr in der Vergangenheit', () => {
  const { raum } = app();
  const s = raum._letzterFaelligerSonntag();
  const d = new Date(s);
  assert.equal(d.getDay(), 0, 'ein Sonntag');
  assert.equal(d.getHours(), 20, 'um 20 Uhr');
  assert.ok(s <= Date.now(), 'nie in der Zukunft');
  assert.ok(Date.now() - s < 8 * 86400000, 'höchstens eine Woche her');
});

test('Zahltag zahlt einmal, verzinst Schulden — und läuft nie doppelt', async () => {
  const { raum } = app();
  await anmelden(raum);
  raum.D.ampel = { domme: 'gruen', sub: 'gruen' };

  await raum.datenSchreib('konto', {
    an: true, karma: -20, siegel: 0, gehalt: 10,
    gehaltZuletzt: Date.now() - 9 * 86400000,
    glutMonat: new Date().toISOString().slice(0, 7),
  });
  await raum.kontoLaden();

  await raum.ladenPflegen();
  let konto = await raum.datenLies('konto');
  /* -20 + 10 Gehalt = -10, darauf 10 % Zins = -1 → -11. */
  assert.equal(konto.karma, -11);

  const buch = await raum.datenListe('kontobuch');
  assert.deepEqual(rein(buch.map((b) => b.quelle)), ['Wochengehalt', 'Zinsen auf Schulden']);

  /* Der zweite Lauf desselben Tages rührt nichts an. */
  await raum.ladenPflegen();
  konto = await raum.datenLies('konto');
  assert.equal(konto.karma, -11, 'kein Doppel-Zahltag');
  assert.equal((await raum.datenListe('kontobuch')).length, 2);
});

test('der Monatswechsel nimmt den Glutverlust und bucht Abos ab — oder kündigt sie', async () => {
  const { raum } = app();
  await anmelden(raum);
  raum.D.ampel = { domme: 'gruen', sub: 'gruen' };

  await raum.datenSchreib('konto', {
    an: true, karma: 100, siegel: 0, gehalt: 0,
    gehaltZuletzt: Date.now(),
    glutMonat: 'vor-langer-zeit',
    abos: [{ name: 'Kleiderwahl', kosten: 5 }, { name: 'Unbezahlbar', kosten: 9000 }],
  });
  await raum.kontoLaden();

  await raum.ladenPflegen();
  const konto = await raum.datenLies('konto');
  /* 100 − 5 Verlust − 5 Abo = 90; das Unbezahlbare fliegt raus. */
  assert.equal(konto.karma, 90);
  assert.deepEqual(rein(konto.abos.map((a) => a.name)), ['Kleiderwahl'],
    'wer nicht zahlen kann, verliert das Privileg');
});

test('bei Rot zahlt der Zahltag aus, aber verzinst nicht', async () => {
  const { raum } = app();
  await anmelden(raum);
  raum.D.ampel = { domme: 'gruen', sub: 'rot' };

  await raum.datenSchreib('konto', {
    an: true, karma: -20, siegel: 0, gehalt: 10,
    gehaltZuletzt: Date.now() - 9 * 86400000,
    glutMonat: new Date().toISOString().slice(0, 7),
  });
  await raum.kontoLaden();
  await raum.ladenPflegen();

  assert.equal((await raum.datenLies('konto')).karma, -10, 'Gehalt ja, Zins nein');
});

/* --- Das Sortiment ----------------------------------------------------------- */

test('das Sortiment ist vollständig und sauber', () => {
  const { raum } = app();
  const laden = raum.VORRAT.laden;
  assert.ok(laden.length >= 45, laden.length + ' Artikel');

  const abteilungen = new Set(['kleinigkeiten', 'koerper', 'privilegien', 'erlass', 'gross', 'gluecksspiel']);
  for (const a of laden) {
    assert.ok(abteilungen.has(a.kategorie), a.id + ' in unbekannter Abteilung');
    assert.ok(a.preis >= 1, a.id + ' ohne Preis');
    assert.ok(['karma', 'siegel'].includes(a.waehrung), a.id);
  }
  assert.ok(laden.filter((a) => a.waehrung === 'siegel').length >= 5, 'das Große kostet Siegel');
  assert.ok(raum.VORRAT.bussgelder.length >= 12, 'der Katalog hängt');
  assert.ok(raum.VORRAT.abos.length >= 4);
});
