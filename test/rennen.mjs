/* Das Doppel-Render-Rennen: Zwei async Renderer auf demselben Platz —
   „Timos Aufgabe" stand manchmal zweimal auf dem Heim, bis ein Reload
   aufräumte. Die Rennwache lässt nur den jüngsten Lauf anbauen.

   node --test test/rennen.mjs                                           */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ladeApp, anmelden } from './rahmen.mjs';

const DATEIEN = [
  'src/15-vorrat.js', 'src/16-toene.js', 'src/17-vorrathilfen.js',
  'src/20-core.js', 'src/21-krypto.js', 'src/22-firebase.js', 'src/23-push.js', 'src/24-daten.js', 'src/26-modus.js',
  'src/41-heim.js', 'src/62-tagesaufgabe.js',
];

test('die Rennwache lässt nur den jüngsten Lauf gewinnen', () => {
  const { raum } = ladeApp({ dateien: DATEIEN });
  const platz = raum.document.createElement('div');

  const erster = raum.rennwache(platz);
  const zweiter = raum.rennwache(platz);

  assert.equal(erster(), false, 'der überholte Lauf ist raus');
  assert.equal(zweiter(), true, 'der jüngste darf anbauen');
});

test('zwei gleichzeitige Tagesaufgaben-Renderer bauen genau EINE Karte', async () => {
  const { raum } = ladeApp({ dateien: DATEIEN, rolle: 'domme' });
  await anmelden(raum);

  /* Die heutige Aufgabe liegt schon da — kein Sichern nötig. */
  await raum.datenSchreib('tag/' + raum.tagstempel() + '/aufgabe_domme', {
    id: 'probe', text: 'Eine Probeaufgabe', intensitaet: 1, beweis: false, status: 'offen',
  });

  const platz = raum.document.createElement('div');

  /* Genau das Rennen vom Heim: Seitenaufbau und Horcher starten beide. */
  await Promise.all([
    raum.tagesaufgabeKarte(platz, true),
    raum.tagesaufgabeKarte(platz, true),
  ]);

  assert.equal(platz.kinder.length, 1,
    platz.kinder.length + ' Karten — die Aufgabe stünde doppelt da');
});
