/* Der Vorrat und seine Maschinenräume unter Last: Inhalts-Invarianten,
   Seltenheits-Würfel, Filterketten, der Regie-Taktgeber und die
   Übersetzung der Regel-Bibliothek.

   node --test test/vorrat.mjs                                           */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladeApp, rein } from './rahmen.mjs';

const DATEIEN = [
  'src/15-vorrat.js', 'src/16-toene.js', 'src/17-vorrathilfen.js',
  'src/20-core.js', 'src/21-krypto.js', 'src/22-firebase.js', 'src/24-daten.js', 'src/26-modus.js',
  'src/63-regie.js', 'src/64-maschine.js',
];

const app = () => ladeApp({ dateien: DATEIEN }).raum;

/* --- Inhalts-Invarianten ---------------------------------------------------- */

test('jeder Vorrats-Text ist da, und jedes Deck hat sein Zuhause', () => {
  const raum = app();
  const V = raum.VORRAT;

  assert.ok(V.dares.length >= 200, V.dares.length + ' Karten');
  const deckKeys = new Set(V.deckMeta.map((d) => d.key));
  for (const karte of V.dares) {
    assert.ok(karte.text && karte.text.trim(), 'Karte ohne Text: ' + karte.id);
    assert.ok(deckKeys.has(karte.deck), 'Karte in unbekanntem Deck: ' + karte.id);
    assert.ok(karte.intensitaet >= 1 && karte.intensitaet <= 5, karte.id);
  }
  for (const keks of V.kekse) {
    assert.ok(['sub', 'domme', 'beide'].includes(keks.fuer), keks.id);
  }
});

test('die Dritt-App-Stimme und die verbannte Karte bleiben draußen', () => {
  const raum = app();
  const alles = JSON.stringify(raum.VORRAT);
  assert.ok(!alles.includes('Schokolade'), 'oral-012 wurde entfernt');
  assert.ok(!/\bihr beide\b/.test(alles), 'wir beide, nicht ihr beide');
  assert.ok(!/\bIhr habt\b/.test(alles), 'Wir haben, nicht Ihr habt');
  assert.ok(!alles.includes('Zwischen euch'), 'Zwischen uns');
});

/* --- Der Seltenheits-Würfel ------------------------------------------------- */

test('der Seltenheits-Würfel bleibt in seinen Grenzen, Boost 3 garantiert Silber', () => {
  const raum = app();
  for (let i = 0; i < 400; i++) {
    const s = raum._seltenheitWuerfeln(0);
    assert.ok(s >= 1 && s <= 5, String(s));
    const hoch = raum._seltenheitWuerfeln(3);
    assert.ok(hoch >= 3, 'Boost 3 fällt nie unter Silber: ' + hoch);
  }
});

test('die Belohnungs-Serie zieht niemals Fallen oder Nieten', () => {
  const raum = app();
  for (let i = 0; i < 300; i++) {
    const los = raum.vorratLosZiehen(0, 'belohnung');
    assert.ok(los && los.typ !== 'falle' && los.typ !== 'niete', los && los.typ);
  }
});

/* --- Filterketten ----------------------------------------------------------- */

test('Wahrheit-oder-Pflicht-Filter: nichts an ihn, was für sie bestimmt ist', () => {
  const raum = app();
  const fuerIhn = raum.vorratWup('wahrheit', 3, 'sub');
  assert.ok(fuerIhn.length > 50);
  assert.ok(fuerIhn.every((w) => w.an !== 'domme'), 'an_domme bleibt bei ihr');

  const nurWarm = raum.vorratWup('pflicht', 1, 'sub');
  assert.ok(nurWarm.every((w) => (w.stufe || 1) === 1), 'Stufe 1 heißt Stufe 1');
});

test('die Ampel drückt die Obergrenze: Gelb deckelt bei drei', () => {
  const raum = app();
  raum.D.ampel = { domme: 'gruen', sub: 'gelb' };
  assert.equal(raum.vorratWirksameStufe(), 3);
  const karten = raum.vorratWup('pflicht', 3, 'sub');
  assert.ok(karten.every((w) => (w.intensitaet || 1) <= 3), 'nichts über der Ampel');

  raum.D.ampel = { domme: 'rot', sub: 'gruen' };
  assert.equal(raum.vorratWirksameStufe(), 1, 'Rot eines Einzelnen genügt');
});

test('bei Rot bleiben nur die warmen Kekse', () => {
  const raum = app();
  raum.D.ampel = { domme: 'gruen', sub: 'rot' };
  const topf = raum.vorratKekse('sub', []);
  assert.ok(topf.length > 0, 'auch bei Rot bleibt etwas');
  assert.ok(topf.every((k) => ['warm', 'nachdenklich'].includes(k.kategorie)));
});

test('Tagesaufgaben kennen ihre Empfänger und die Ruhe', () => {
  const raum = app();
  raum.D.ampel = { domme: 'gruen', sub: 'gruen' };

  for (let i = 0; i < 40; i++) {
    const ihre = raum.vorratTagesaufgabe('domme', 1, []);
    assert.match(ihre.id, /^dom-/, 'ihr Topf ist der Domme-Pool');
    const seine = raum.vorratTagesaufgabe('sub', 1, []);
    assert.ok(!/^dom-/.test(seine.id), 'sein Topf ist es nicht');
    assert.ok(seine.kontext !== 'getrennt', 'zusammen heißt: nichts für die Ferne');
  }

  raum.D.ampel = { domme: 'gruen', sub: 'rot' };
  for (let i = 0; i < 20; i++) {
    const ruhig = raum.vorratTagesaufgabe('sub', 30, []);
    assert.match(ruhig.id, /^ru-/, 'bei Rot nur der Ruhe-Pool');
  }
});

test('die Wiederholungssperre wird respektiert, solange etwas übrig ist', () => {
  const raum = app();
  raum.D.ampel = { domme: 'gruen', sub: 'gruen' };
  const erste = raum.vorratTagesaufgabe('domme', 1, []);
  for (let i = 0; i < 30; i++) {
    const naechste = raum.vorratTagesaufgabe('domme', 1, [erste.id]);
    assert.notEqual(naechste.id, erste.id);
  }
});

/* --- Der Szenario-Generator ------------------------------------------------- */

test('dreihundert Szenarien ohne Platzhalter-Reste und ohne Doppel-Leerzeichen', () => {
  const raum = app();
  raum.D.ampel = { domme: 'gruen', sub: 'gruen' };
  for (let i = 0; i < 300; i++) {
    const s = raum.vorratSzenario();
    assert.ok(s && s.text.length > 20);
    assert.ok(!s.text.includes('{') && !s.text.includes('}'), s.text);
    assert.ok(!s.text.includes('  '), 'Glättung: ' + s.text);
    assert.match(s.text[0], /[A-ZÄÖÜ„"]/, 'beginnt groß: ' + s.text.slice(0, 30));
  }
});

/* --- Der Regie-Taktgeber ----------------------------------------------------- */

test('_regieStand findet Schritt, Rest und Ende — und friert bei Pause ein', () => {
  const raum = app();
  const skript = { schritte: [{ dauer_sek: 60 }, { dauer_sek: 90 }, { dauer_sek: 30 }] };
  const nun = Date.now();

  const frisch = raum._regieStand({ skript, start: nun, versatz: 0, pausiertAb: null });
  assert.equal(frisch.i, 0);
  assert.ok(frisch.uebrig > 59 && frisch.uebrig <= 60);

  const mitten = raum._regieStand({ skript, start: nun - 70000, versatz: 0, pausiertAb: null });
  assert.equal(mitten.i, 1);
  assert.ok(Math.abs(mitten.uebrig - 80) < 1.5);

  const vorbei = raum._regieStand({ skript, start: nun - 181000, versatz: 0, pausiertAb: null });
  assert.equal(vorbei.fertig, true);

  /* Pause: Der Stand hängt an pausiertAb, nicht an der Uhr. */
  const pausiert = raum._regieStand({ skript, start: nun - 100000, versatz: 0, pausiertAb: nun - 35000 });
  assert.equal(pausiert.i, 1);
  assert.ok(Math.abs(pausiert.uebrig - 85) < 1.5, String(pausiert.uebrig));

  /* Verlängern schiebt alles nach hinten. */
  const verlaengert = raum._regieStand({ skript, start: nun - 70000, versatz: 30000, pausiertAb: null });
  assert.equal(verlaengert.i, 0, '+30 s heißt: noch im ersten Schritt');
});

/* --- Die Regel-Bibliothek ---------------------------------------------------- */

test('die Übersetzung nimmt nur, was die App wirklich kann', () => {
  const raum = app();

  const geo = raum._bibliothekUebersetzen({
    name: 'x', ausloeser: { typ: 'standort', ort: 'zuhause' },
    aktionen: [{ typ: 'nachricht', text: 'hi' }],
  });
  assert.equal(geo, null, 'Geofencing gibt es nicht — also auch nicht halb');

  const krumm = raum._bibliothekUebersetzen({
    name: 'x', ausloeser: { typ: 'uhrzeit', zeit: '07:00' },
    aktionen: [{ typ: 'timer_starten', dauer: '72h' }],
  });
  assert.equal(krumm.aktionen[0].minuten, 72, 'krumme Dauer wird Zahl, nicht NaN');

  const fremd = raum._bibliothekUebersetzen({
    name: 'x', ausloeser: { typ: 'uhrzeit', zeit: '07:00' },
    aktionen: [{ typ: 'foto_freischalten' }],
  });
  assert.equal(fremd, null, 'eine unbekannte Aktion macht die ganze Regel unbrauchbar');

  const echteBrauchbare = raum.VORRAT.regeln
    .map((r) => raum._bibliothekUebersetzen(r))
    .filter((r) => r && r.aktionen.length);
  assert.ok(echteBrauchbare.length >= 10, echteBrauchbare.length + ' übernehmbare Regeln');
});

/* --- Die Sicherungen der Maschine -------------------------------------------- */

test('die Maschine respektiert Rot, den Hauptschalter und die Tagesgrenze', async (t) => {
  const { ladeApp: lade, anmelden } = await import('./rahmen.mjs');
  const { raum } = lade({ dateien: DATEIEN });
  await anmelden(raum);

  const stunde = new Date().getHours();
  if (stunde >= 23 || stunde < 7) {
    /* Nachts feuert grundsätzlich nichts — dann ist genau DAS der Test. */
    await raum.datenSchreib('maschine/an', true);
    raum.D.ampel = { domme: 'gruen', sub: 'gruen' };
    await raum.maschineFeuern({ name: 'nachts', bedingung: 'keine', aktionen: [] });
    const protokoll = await raum.datenListe('maschine/protokoll');
    assert.equal(protokoll.length, 0, 'Nachtruhe ist Nachtruhe');
    return;
  }

  raum.D.ampel = { domme: 'gruen', sub: 'gruen' };

  /* Ohne Hauptschalter: still. */
  await raum.maschineFeuern({ name: 'aus', bedingung: 'keine', aktionen: [] });
  assert.equal((await raum.datenListe('maschine/protokoll')).length, 0, 'aus heißt aus');

  await raum.datenSchreib('maschine/an', true);

  /* Bei Rot: still, fest verdrahtet. */
  raum.D.ampel = { domme: 'gruen', sub: 'rot' };
  await raum.maschineFeuern({ name: 'rot', bedingung: 'keine', aktionen: [] });
  assert.equal((await raum.datenListe('maschine/protokoll')).length, 0, 'Rot stoppt alles');

  /* Bei Grün: höchstens fünf am Tag. */
  raum.D.ampel = { domme: 'gruen', sub: 'gruen' };
  for (let i = 0; i < 7; i++) {
    await raum.maschineFeuern({ name: 'r' + i, bedingung: 'keine', aktionen: [] });
  }
  const protokoll = await raum.datenListe('maschine/protokoll');
  assert.equal(protokoll.length, 5, 'die sechste und siebte verpuffen');
});

test('Regie-Schritte mit Dauer null werden übersprungen statt zu klemmen', () => {
  const raum = app();
  const skript = { schritte: [{ dauer_sek: 0 }, { dauer_sek: 60 }, { dauer_sek: 0 }, { dauer_sek: 30 }] };
  const stand = raum._regieStand({ skript, start: Date.now(), versatz: 0, pausiertAb: null });
  assert.equal(stand.i, 1, 'der Lauf beginnt im ersten echten Schritt');
  const ende = raum._regieStand({ skript, start: Date.now() - 91000, versatz: 0, pausiertAb: null });
  assert.equal(ende.fertig, true);
});

/* --- Töne stürzen nie ------------------------------------------------------- */

test('tonSpielen ohne Klangraum und in der Ruhe bleibt einfach still', () => {
  const raum = app();
  for (const art of ['knack', 'papier', 'weich', 'schimmer', 'tief', 'tick', 'ratsche', 'plopp', 'wusch', 'gong', 'gibtsNicht']) {
    raum.tonSpielen(art);
  }
  raum.D.ruhe = true;
  raum.tonSpielen('weich');
  assert.ok(true, 'kein Wurf, kein Laut, kein Drama');
});

/* --- Glutpunkte -------------------------------------------------------------- */

test('glutPunkte zeichnet n Punkte und deckelt bei fünf', () => {
  const raum = app();
  assert.equal(raum.glutPunkte(3).kinder.length, 3);
  assert.equal(raum.glutPunkte(99).kinder.length, 5);
  assert.equal(raum.glutPunkte(0).kinder.length, 0);
  assert.equal(raum.glutPunkte(undefined).kinder.length, 0);
});
