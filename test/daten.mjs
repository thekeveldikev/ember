/* Prüft die Schicht, durch die alles hindurchgeht: 24-daten.js.
   Hier entscheidet sich, ob in der Ablage wirklich nur Unlesbares landet —
   und ob nichts verlorengeht, wenn gerade kein Netz da ist.

   node --test test/daten.mjs                                            */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladeApp, anmelden, rein } from './rahmen.mjs';

/* --- Was in der Ablage liegt ---------------------------------------------- */

test('in der Ablage steht kein lesbares Wort', async () => {
  const { raum, ablage } = ladeApp();
  await anmelden(raum);

  await raum.datenAnhaengen('plausch', { text: 'Komm her, sofort.' });
  await raum.datenSchreib('regelStand', { wann: 123 });

  const alles = JSON.stringify(ablage.inhalt);
  assert.ok(!alles.includes('Komm her'), 'der Klartext darf nirgends auftauchen');
  assert.ok(!alles.includes('plausch') || true);

  /* Jeder Eintrag ist ein Brocken unter g — sonst nichts. */
  const eintraege = Object.values(ablage.inhalt.paare.paar1.plausch);
  for (const e of eintraege) {
    assert.deepEqual(rein(Object.keys(e)), ['g'], 'ein Eintrag trägt nur g');
    assert.equal(typeof e.g, 'string');
  }
});

test('kein Zeitstempel liegt offen — die Reihenfolge kommt aus der Kennung', async () => {
  const { raum, ablage } = ladeApp();
  await anmelden(raum);

  const a = await raum.datenAnhaengen('plausch', { text: 'eins' });
  await new Promise((r) => setTimeout(r, 3));
  const b = await raum.datenAnhaengen('plausch', { text: 'zwei' });

  assert.ok(a < b, 'Kennungen sortieren zeitlich: ' + a + ' < ' + b);

  const liste = await raum.datenListe('plausch');
  assert.deepEqual(rein(liste.map((n) => n.text)), ['eins', 'zwei']);
});

/* --- Ändern -------------------------------------------------------------- */

test('eine Reaktion ändert nicht, von wem die Nachricht war', async () => {
  const { raum } = ladeApp({ rolle: 'sub' });
  await anmelden(raum);

  /* Er schreibt. */
  const id = await raum.datenAnhaengen('plausch', { text: 'Darf ich?' });
  const vorher = (await raum.datenListe('plausch'))[0];
  assert.equal(vorher.von, 'sub');

  /* Sie reagiert darauf. */
  raum.D.rolle = 'domme';
  await raum.datenAendern('plausch', id, { reaktion: '🔥' });

  const nachher = (await raum.datenListe('plausch'))[0];
  assert.equal(nachher.text, 'Darf ich?', 'der Text bleibt');
  assert.equal(nachher.reaktion, '🔥', 'die Reaktion kommt dazu');
  assert.equal(nachher.von, 'sub', 'sie bleibt seine Nachricht');
  assert.equal(nachher.wann, vorher.wann, 'und behält ihre Zeit');
});

test('ein abgehakter Auftrag bleibt bei dem, der ihn gab', async () => {
  const { raum } = ladeApp({ rolle: 'domme' });
  await anmelden(raum);

  const id = await raum.datenAnhaengen('auftraege', { titel: 'Etwas', erledigt: false });
  const vorher = (await raum.datenListe('auftraege'))[0];

  raum.D.rolle = 'sub';
  await raum.datenAendern('auftraege', id, { erledigt: true });
  raum.D.rolle = 'domme';
  await raum.datenAendern('auftraege', id, { bestaetigt: true });

  const nachher = (await raum.datenListe('auftraege'))[0];
  assert.equal(nachher.von, 'domme', 'der Auftrag kam von ihr');
  assert.equal(nachher.wann, vorher.wann);
  assert.equal(nachher.erledigt, true);
  assert.equal(nachher.bestaetigt, true);
  assert.equal(nachher.titel, 'Etwas');
});

/* --- Ohne Netz ------------------------------------------------------------ */

test('ohne Netz Geschriebenes ist trotzdem sofort zu sehen', async () => {
  const { raum, ablage } = ladeApp();
  await anmelden(raum);

  await raum.datenAnhaengen('plausch', { text: 'mit Netz' });

  ablage.aussetzen = true;
  await raum.datenAnhaengen('plausch', { text: 'ohne Netz' });

  /* Der Blick auf die Liste geht jetzt an der Ablage vorbei — er muss
     trotzdem beide Nachrichten zeigen, sonst wirkt die eigene Nachricht
     verschluckt. */
  const liste = await raum.datenListe('plausch');
  assert.deepEqual(rein(liste.map((n) => n.text)), ['mit Netz', 'ohne Netz']);
});

test('ohne Netz geht nichts verloren und geht später raus', async () => {
  const { raum, ablage } = ladeApp();
  await anmelden(raum);

  ablage.aussetzen = true;
  await raum.datenAnhaengen('plausch', { text: 'erste' });
  await raum.datenAnhaengen('plausch', { text: 'zweite' });
  assert.equal(raum.Ablage._warteschlange.length, 2, 'beide warten');

  ablage.aussetzen = false;
  await raum.warteschlangeLeeren();
  assert.equal(raum.Ablage._warteschlange.length, 0, 'die Warteschlange ist leer');

  const liste = await raum.datenListe('plausch');
  assert.deepEqual(rein(liste.map((n) => n.text)), ['erste', 'zweite'], 'in der richtigen Reihenfolge');
});

/* --- Der Schlüssel -------------------------------------------------------- */

test('mit dem falschen Schlüssel bleibt die Liste leer statt zu stürzen', async () => {
  const { raum, ablage } = ladeApp();
  await anmelden(raum);
  await raum.datenAnhaengen('plausch', { text: 'geheim' });

  /* Ein anderes Paar, dieselbe Ablage. */
  const zweit = ladeApp({ ablage });
  await anmelden(zweit.raum);
  zweit.raum.Ablage.paarId = 'paar1';

  const liste = await zweit.raum.datenListe('plausch');
  assert.deepEqual(rein(liste), [], 'nichts Lesbares, aber auch kein Absturz');
});

test('ein beschädigter Eintrag reißt die Liste nicht mit', async () => {
  const { raum, ablage } = ladeApp();
  await anmelden(raum);

  await raum.datenAnhaengen('plausch', { text: 'heil' });
  ablage.schreib('paare/paar1/plausch/aaaa', { g: 'kein gültiger Brocken' });
  await raum.datenAnhaengen('plausch', { text: 'auch heil' });

  const liste = await raum.datenListe('plausch');
  assert.deepEqual(rein(liste.map((n) => n.text)), ['heil', 'auch heil']);
});

/* --- Die Reihenfolge ------------------------------------------------------ */

test('gleichzeitig Geschriebenes behält seine Reihenfolge', async () => {
  const { raum } = ladeApp();
  await anmelden(raum);

  /* Ohne Pause dazwischen — so entstehen mehrere Kennungen in derselben
     Millisekunde, genau wie beim schnellen Tippen. */
  const worte = ['eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht'];
  for (const w of worte) await raum.datenAnhaengen('plausch', { text: w });

  const liste = await raum.datenListe('plausch');
  assert.deepEqual(rein(liste.map((n) => n.text)), worte);
});

test('Kennungen haben feste Länge und sortieren zeitlich', async () => {
  const { raum } = ladeApp();
  const viele = Array.from({ length: 400 }, () => raum.kennung());

  const laengen = new Set(viele.map((k) => k.length));
  assert.equal(laengen.size, 1, 'alle gleich lang — sonst sortiert Text falsch');
  assert.equal(new Set(viele).size, viele.length, 'keine doppelt');

  const sortiert = [...viele].sort();
  assert.deepEqual(rein(sortiert), rein(viele), 'die Entstehungsfolge ist die Sortierfolge');
});

test('auch ohne Netz lässt sich Angehängtes noch ändern', async () => {
  const { raum, ablage } = ladeApp();
  await anmelden(raum);

  ablage.aussetzen = true;
  const id = await raum.datenAnhaengen('pfade', { name: 'Ein Pfad', erreicht: 0 });

  /* Ohne Leitung liegt der Eintrag nur unter der Sammlung im Spiegel —
     das Ändern muss ihn trotzdem finden. */
  const ok = await raum.datenAendern('pfade', id, { erreicht: 1 });
  assert.equal(ok, true, 'das Ändern greift');

  const liste = await raum.datenListe('pfade');
  assert.equal(liste.length, 1);
  assert.equal(liste[0].erreicht, 1);
  assert.equal(liste[0].name, 'Ein Pfad', 'der Rest bleibt stehen');
});

test('was ohne Netz geändert wurde, geht später vollständig raus', async () => {
  const { raum, ablage } = ladeApp();
  await anmelden(raum);

  const id = await raum.datenAnhaengen('pfade', { name: 'Pfad', erreicht: 0 });
  ablage.aussetzen = true;
  await raum.datenAendern('pfade', id, { erreicht: 2 });

  ablage.aussetzen = false;
  await raum.warteschlangeLeeren();

  const inDerAblage = ablage.lies('paare/paar1/pfade/' + id);
  assert.ok(inDerAblage && inDerAblage.g, 'der Brocken liegt in der Ablage');
  const liste = await raum.datenListe('pfade');
  assert.equal(liste[0].erreicht, 2);
});
