/* Die Leitung unter Beschuss: der Verteiler der einen Stammverbindung,
   das Wettrennen beim Leitungsbau, die alternde Warteschlange und die
   Boten-Adresse. Jede Prüfung hier ist die Grabplatte eines echten
   Fehlers aus dem Live-Betrieb.

   node --test test/leitung.mjs                                          */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladeApp, anmelden, rein } from './rahmen.mjs';

const DATEIEN = [
  'src/20-core.js', 'src/21-krypto.js', 'src/22-firebase.js', 'src/23-push.js', 'src/24-daten.js',
];

const app = (einst = {}) => ladeApp({ dateien: DATEIEN, ...einst });

/* --- Der Verteiler --------------------------------------------------------- */

test('der Verteiler übersetzt jeden Ereignis-Pfad in die Sicht des Horchers', async () => {
  const { raum } = app();
  await anmelden(raum);

  const rufe = [];
  await raum.ablageHorch('plausch', (weg, wert) => rufe.push([weg, wert]));

  /* Genau unter dem Anliegen. */
  raum._verteilen('/plausch/abc', { g: 'x' });
  /* Tiefer im Baum. */
  raum._verteilen('/plausch/abc/g', 'y');
  /* Das Anliegen selbst. */
  raum._verteilen('/plausch', { abc: 1 });
  /* Die Wurzel mit dem ganzen Baum: der eigene Teil wird herausgelöst. */
  raum._verteilen('/', { plausch: { tief: 2 }, ampel: { rot: 1 } });
  /* Etwas völlig anderes: geht diesen Horcher nichts an. */
  raum._verteilen('/ampel/sub', 'gruen');
  /* Löschen über der Wurzel: kommt als null an. */
  raum._verteilen('/', null);

  assert.deepEqual(rein(rufe), [
    ['/abc', { g: 'x' }],
    ['/abc/g', 'y'],
    ['/', { abc: 1 }],
    ['/', { tief: 2 }],
    ['/', null],
  ]);
});

test('ein werfender Horcher reißt die anderen nicht mit', async () => {
  const { raum } = app();
  await anmelden(raum);

  const rufe = [];
  await raum.ablageHorch('sperre', () => { throw new Error('kaputt'); });
  await raum.ablageHorch('sperre', (weg, wert) => rufe.push(wert));

  raum._verteilen('/sperre', 'wichtig');
  assert.deepEqual(rein(rufe), ['wichtig'], 'der zweite hört trotzdem');
});

test('abmelden entfernt genau einen Interessenten, nicht alle', async () => {
  const { raum } = app();
  await anmelden(raum);

  const a = [];
  const b = [];
  const wegA = await raum.ablageHorch('knopf/aktuell', (w, v) => a.push(v));
  await raum.ablageHorch('knopf/aktuell', (w, v) => b.push(v));

  wegA();
  raum._verteilen('/knopf/aktuell', 1);
  assert.deepEqual(rein(a), []);
  assert.deepEqual(rein(b), [1]);
});

/* --- Das Wettrennen beim Leitungsbau --------------------------------------- */

test('sechs gleichzeitige Horcher bauen EINE Leitung — nie wieder sechs Waisen', async () => {
  const { raum } = app();
  await anmelden(raum);

  raum.EventSource.gebaut = 0;
  await Promise.all([
    raum.ablageHorch('knopf/aktuell', () => {}),
    raum.ablageHorch('puls/domme', () => {}),
    raum.ablageHorch('ampel', () => {}),
    raum.ablageHorch('sperrebitte', () => {}),
    raum.ablageHorch('sperre', () => {}),
    raum.ablageHorch('fotoauftrag', () => {}),
  ]);

  assert.equal(raum.EventSource.gebaut, 1,
    'jede weitere Leitung würde das 6-Verbindungen-Limit wieder sprengen');
});

/* --- Die alternde Warteschlange -------------------------------------------- */

test('tagealte Warteschlangen-Aufträge werden verworfen statt Gelöschtes wiederzubeleben', async () => {
  const { raum, ablage } = app();
  await anmelden(raum);

  /* Ein frischer und ein vergammelter Auftrag warten. (Die Pfade in der
     Schlange sind relativ — _adresse setzt den Paar-Vorbau selbst.) */
  raum.Ablage._warteschlange = [
    { pfad: 'zombie', art: 'PUT', wert: { g: 'alt' }, wann: Date.now() - 25 * 3600000 },
    { pfad: 'frisch', art: 'PUT', wert: { g: 'neu' }, wann: Date.now() - 60000 },
  ];

  await raum.warteschlangeLeeren();

  assert.equal(ablage.lies('paare/paar1/zombie'), null, 'der Zombie bleibt tot');
  assert.deepEqual(rein(ablage.lies('paare/paar1/frisch')), { g: 'neu' }, 'das Frische geht raus');
  assert.equal(raum.Ablage._warteschlange.length, 0);
});

test('auch die Listen-Mischung übergeht Vergammeltes', async () => {
  const { raum } = app();
  await anmelden(raum);

  await raum.datenAnhaengen('plausch', { text: 'echt' });
  raum.Ablage._warteschlange.push({
    pfad: 'plausch/000zombie', art: 'PUT',
    wert: { g: 'nicht entschlüsselbar' }, wann: Date.now() - 26 * 3600000,
  });

  const liste = await raum.datenListe('plausch');
  assert.deepEqual(rein(liste.map((n) => n.text)), ['echt']);
});

/* --- Der Geister-Plausch (Horcher liest einmal frisch) ---------------------- */

test('ein spät gestarteter Horcher sieht den Server-Stand, nicht den alten Spiegel', async () => {
  const { raum, ablage } = app();
  await anmelden(raum);

  /* Zwei Nachrichten schreiben — beide liegen jetzt auch im Spiegel. */
  const geist = await raum.datenAnhaengen('plausch', { text: 'Geist' });
  await raum.datenAnhaengen('plausch', { text: 'bleibt' });

  /* Auf dem Server wird eine gelöscht — der Spiegel weiß nichts davon. */
  ablage.loesch('paare/paar1/plausch/' + geist);

  const staende = [];
  raum.datenHorch('plausch', (liste) => staende.push(liste.map((n) => n.text)));
  await new Promise((r) => setTimeout(r, 30));

  const letzter = staende[staende.length - 1];
  assert.deepEqual(rein(letzter), ['bleibt'],
    'die frische Lesung räumt den Geist ab — Veras Chat-Spuk');
});

/* --- Die Boten-Adresse ------------------------------------------------------ */

test('boteAdresse zieht jede krumme Eingabe gerade — der 405-Fehler', () => {
  const { raum } = app();
  const faelle = [
    ['ember-bote.k.workers.dev', 'https://ember-bote.k.workers.dev'],
    ['https://ember-bote.k.workers.dev/', 'https://ember-bote.k.workers.dev'],
    ['https://ember-bote.k.workers.dev/senden', 'https://ember-bote.k.workers.dev'],
    ['  http://x.test//  ', 'http://x.test'],
    ['', ''],
    [null, ''],
  ];
  for (const [rein_, raus] of faelle) {
    assert.equal(raum.boteAdresse(rein_), raus, JSON.stringify(rein_));
  }
});

/* --- Pfad-Härte ------------------------------------------------------------- */

test('Werte, die wie Pfade aussehen, bleiben Werte', async () => {
  const { raum } = app();
  await anmelden(raum);

  await raum.datenSchreib('probe', { text: '../andere/paare?x=1' });
  const zurueck = await raum.datenLies('probe');
  assert.equal(zurueck.text, '../andere/paare?x=1');
});

test('datenLies mit Ersatzwert greift bei Fehlendem und bei Netzausfall', async () => {
  const { raum, ablage } = app();
  await anmelden(raum);

  assert.deepEqual(rein(await raum.datenLies('gibtsNicht', { leer: true })), { leer: true });

  ablage.aussetzen = true;
  assert.deepEqual(rein(await raum.datenLies('gibtsAuchNicht', 'ersatz')), 'ersatz');
});
