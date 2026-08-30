/* Räume, Gerätespeicher und die letzten Zustands-Fallen: die Migration
   der Vor-Räume-Zeit, das Entfernen einzelner Räume, der Lösch-Geist
   nach dem Wiederverbinden und die ablaufenden Nachrichten.

   node --test test/raum.mjs                                            */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladeApp, anmelden, rein } from './rahmen.mjs';

const RAUM_DATEIEN = ['src/20-core.js', 'src/21-krypto.js', 'src/22-firebase.js', 'src/24-daten.js', 'src/25-raeume.js'];

/* --- Die Migration ---------------------------------------------------------- */

test('ein Gerät aus der Zeit vor den Räumen zieht heil in Raum 1 um', () => {
  const { raum, lager } = ladeApp({ dateien: RAUM_DATEIEN });

  lager.setItem('ember.rolle', '"sub"');
  lager.setItem('ember.paarId', '"abc"');
  lager.setItem('ember.spiegel.plausch', '{"x":{"g":"y"}}');

  raum.raumMigration();

  assert.deepEqual(rein(raum.raeumeLies()), [{ id: '1', name: 'Raum 1' }]);
  assert.equal(lager.getItem('ember.aktiverRaum'), '1');
  assert.equal(lager.getItem('ember.r1.rolle'), '"sub"');
  assert.equal(lager.getItem('ember.r1.spiegel.plausch'), '{"x":{"g":"y"}}');
  assert.equal(lager.getItem('ember.rolle'), null, 'der flache Schlüssel ist umgezogen');

  /* Ein zweiter Lauf richtet keinen Schaden an. */
  raum.raumMigration();
  assert.equal(raum.raeumeLies().length, 1, 'kein zweiter Raum aus dem Nichts');
  assert.equal(raum.Gerät.lies('rolle'), 'sub', 'und die App liest ihren Wert');
});

test('einen Raum entfernen trifft nur diesen Raum', () => {
  const { raum, lager } = ladeApp({ dateien: RAUM_DATEIEN });

  raum.raumMigration();
  raum.Gerät.schreib('geheimnis', 'raum1');
  const id2 = raum.raumAnlegen('Probe');
  lager.setItem('ember.r' + id2 + '.geheimnis', '"raum2"');

  raum.raumEntfernen(id2);

  assert.equal(raum.raeumeLies().length, 1, 'nur ein Raum bleibt');
  assert.equal(lager.getItem('ember.r' + id2 + '.geheimnis'), null, 'Raum 2 ist restlos weg');
  assert.equal(raum.Gerät.lies('geheimnis'), 'raum1', 'Raum 1 bleibt unberührt');
});

test('alleLoeschen leert nur den aktiven Raum — die Raumliste überlebt', () => {
  const { raum, lager } = ladeApp({ dateien: RAUM_DATEIEN });
  raum.raumMigration();
  raum.Gerät.schreib('schluessel', 'sehr geheim');

  raum.Gerät.alleLoeschen();

  assert.equal(raum.Gerät.lies('schluessel'), null);
  assert.ok(lager.getItem('ember.raeume'), 'die Raumliste bleibt');
  assert.equal(lager.getItem('ember.aktiverRaum'), '1');
});

/* --- Der Lösch-Geist -------------------------------------------------------- */

test('offline Gelöschtes bleibt auch nach dem Wiederverbinden verschwunden', async () => {
  const { raum, ablage } = ladeApp();
  await anmelden(raum);

  const id = await raum.datenAnhaengen('plausch', { text: 'kurzlebig' });
  await raum.datenAnhaengen('plausch', { text: 'bleibt' });

  ablage.aussetzen = true;
  await raum.datenEintragLoeschen('plausch', id);
  assert.deepEqual(rein((await raum.datenListe('plausch')).map((n) => n.text)), ['bleibt'],
    'offline sofort weg');

  /* Netz zurück, Schlange noch NICHT geleert: Der Server kennt den
     Eintrag noch — die Mischung muss den wartenden DELETE anwenden. */
  ablage.aussetzen = false;
  assert.deepEqual(rein((await raum.datenListe('plausch')).map((n) => n.text)), ['bleibt'],
    'kein Geist zwischen Wiederverbinden und Schlangenleerung');

  await raum.warteschlangeLeeren();
  assert.equal(ablage.lies('paare/paar1/plausch/' + id), null, 'und der Server zieht nach');
});

test('offline angelegt und gleich wieder gelöscht hinterlässt nirgends Spuren', async () => {
  const { raum, ablage } = ladeApp();
  await anmelden(raum);

  ablage.aussetzen = true;
  const id = await raum.datenAnhaengen('lose', { text: 'Versehen' });
  await raum.datenEintragLoeschen('lose', id);
  assert.deepEqual(rein(await raum.datenListe('lose')), []);

  ablage.aussetzen = false;
  await raum.warteschlangeLeeren();
  assert.equal(ablage.lies('paare/paar1/lose/' + id), null);
  assert.deepEqual(rein(await raum.datenListe('lose')), []);
});

/* --- Ablaufende Nachrichten ------------------------------------------------- */

test('istAbgelaufen kennt alle drei Leben einer Nachricht', () => {
  const { raum } = ladeApp({ dateien: [...RAUM_DATEIEN, 'src/40-huelle.js', 'src/43b-stimme.js'] });
  const nun = Date.now();

  assert.equal(raum.istAbgelaufen({ text: 'x', wann: nun - 9e9 }), false, 'ohne Ablauf lebt sie ewig');
  assert.equal(raum.istAbgelaufen({ ablauf: 60000, wann: nun - 30000 }), false, 'noch in der Frist');
  assert.equal(raum.istAbgelaufen({ ablauf: 60000, wann: nun - 61000 }), true, 'Frist vorbei');
  assert.equal(raum.istAbgelaufen({ ablauf: 0, wann: nun - 9e9 }), false, 'einmalig, aber ungelesen: bleibt');
  assert.equal(raum.istAbgelaufen({ ablauf: 0, gelesen: nun - 5000 }), false, 'gerade gelesen: Gnadenfrist');
  assert.equal(raum.istAbgelaufen({ ablauf: 0, gelesen: nun - 13000 }), true, 'gelesen und Frist um');
});

/* --- Die Tagesaufgaben-Wegweiser -------------------------------------------- */

test('_aufgabeZiel erkennt App-Bezüge und schweigt sonst', () => {
  const { raum } = ladeApp({
    dateien: [...RAUM_DATEIEN, 'src/15-vorrat.js', 'src/17-vorrathilfen.js', 'src/62-tagesaufgabe.js'],
  });

  assert.equal(raum._aufgabeZiel({ text: 'Plane einen geheimen Auftrag mit Countdown.' }).seite, 'spannung');
  assert.equal(raum._aufgabeZiel({ text: 'Setz heute eine neue Regel.' }).seite, 'auftrag');
  assert.equal(raum._aufgabeZiel({ text: 'Schick ihr ein Foto von dir.' }).seite, 'plausch');
  assert.equal(raum._aufgabeZiel({ text: 'Dreh heute dreimal am Rad.' }).seite, 'rad');
  assert.equal(raum._aufgabeZiel({ text: 'Küss sie fünfmal.' }), null, 'Küssen braucht keine App-Seite');
});

/* --- Die Tarnwand ------------------------------------------------------------ */

test('in der Tarnung dringt nichts durch: kein Blatt, keine Meldung, kein Puls, keine Seite', () => {
  const { raum } = ladeApp({
    dateien: ['src/20-core.js', 'src/21-krypto.js', 'src/22-firebase.js', 'src/24-daten.js',
      'src/25-raeume.js', 'src/40-huelle.js', 'src/52-tarnung.js'],
  });

  let vibriert = 0;
  raum.navigator.vibrate = () => { vibriert++; return true; };
  let blattAngehaengt = 0;
  raum.document.body.append = () => { blattAngehaengt++; };
  let seiteGemalt = 0;
  raum.SEITEN.heim = () => { seiteGemalt++; };
  raum.D.seite = 'plausch';

  raum.__tarnung(true);
  assert.equal(raum.istGetarnt(), true);

  const m = raum.meldung('Sie hat geantwortet.');
  assert.ok(m && !m.kinder?.length, 'die Meldung ist eine leere Hülse');
  raum.meldungMitTat('Er fragt.', 'Ansehen', () => {});
  raum.puls('befehl');
  const b = raum.blatt('geheim');
  b.schliessen();
  raum.zeigeSeite('heim');

  assert.equal(vibriert, 0, 'keine Vibration verrät die App');
  assert.equal(blattAngehaengt, 0, 'kein Blatt legt sich über die Notizen');
  assert.equal(seiteGemalt, 0, 'keine Seite malt in die Tarnung');

  /* Und danach geht alles wieder — mit einer echten Bühne im Mini-DOM. */
  const buehne = raum.document.createElement('main');
  raum.document.querySelector = (w) => (w === '#buehne' ? buehne : null);
  raum.__tarnung(false);
  raum.zeigeSeite('heim');
  assert.equal(seiteGemalt, 1);
});

/* --- Ehrliches Mischen -------------------------------------------------------- */

test('mischen() ist unverzerrt genug und verliert nie ein Element', () => {
  const { raum } = ladeApp();

  const zaehlung = [0, 0, 0];
  for (let i = 0; i < 3000; i++) {
    const raus = raum.mischen(['a', 'b', 'c']);
    assert.equal(raus.length, 3);
    assert.deepEqual(rein([...raus].sort()), ['a', 'b', 'c']);
    zaehlung[raus.indexOf('a')]++;
  }
  /* Bei sort(random) läge „a" zu ~50 % auf Platz 1 — Fisher-Yates
     bleibt für jede Position nahe einem Drittel. */
  for (const n of zaehlung) {
    assert.ok(n > 800 && n < 1200, 'Position ' + zaehlung.indexOf(n) + ': ' + n + '/3000');
  }
});

/* --- Volumen ----------------------------------------------------------------- */

test('zweihundert Nachrichten bleiben vollständig und in Ordnung', async () => {
  const { raum } = ladeApp();
  await anmelden(raum);

  for (let i = 0; i < 200; i++) await raum.datenAnhaengen('plausch', { text: 'n' + i });
  const liste = await raum.datenListe('plausch');
  assert.equal(liste.length, 200);
  assert.equal(liste[0].text, 'n0');
  assert.equal(liste[199].text, 'n199');

  /* Der zweite Blick nutzt das Klar-Lager — und liefert exakt dasselbe. */
  const nochmal = await raum.datenListe('plausch');
  assert.deepEqual(rein(nochmal.map((n) => n.text)), rein(liste.map((n) => n.text)));
});
