/* Baut src/15-vorrat.js aus den Content-Dateien in inhalt/.

   Die fünf Markdown-Dateien tragen JSON-Blöcke in Code-Zäunen. Dieses
   Skript zieht sie heraus, ordnet sie nach ihrer Gestalt ein und schreibt
   eine einzige Quelldatei, die als VORRAT im gemeinsamen Skriptraum liegt.

   Aufruf:  node werkzeug/vorrat-bauen.mjs
   Danach:  npm run build  (der Vorrat wandert mit in die index.html)      */

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');
const ordner = join(wurzel, 'inhalt');

const vorrat = {
  deckMeta: [],        // [{key,name,farbe,icon,beschreibung}]
  dares: [],           // [{id,text,deck,intensitaet,richtung,dauer_min,tags,braucht_timer}]
  raeder: [],          // [{key,name,icon,farbe,kombinierbar_mit,segmente:[{text,intensitaet,tags}]}]
  radKombis: [],       // [{key,name,beschreibung,raeder:[keys]}]
  szenarioSlots: {},   // slot -> [{id,text,slot,intensitaet,tags}]
  szenarioTemplates: [], // [{id,name,muster,benoetigt,max_intensitaet?}]
  challenges: [],      // Stufen 1–5 (id ch…)
  challengePools: { wochenende: [], getrennt: [], ruhig: [], domme: [] },
  kekse: [],           // [{id,text,kategorie,fuer,intensitaet,tageszeit}]
};

const dateien = readdirSync(ordner).filter((d) => d.endsWith('.md')).sort();
let bloecke = 0;

for (const datei of dateien) {
  const text = readFileSync(join(ordner, datei), 'utf8');
  const zaeune = [...text.matchAll(/```json\s*\n([\s\S]*?)\n```/g)];

  for (const [, roh] of zaeune) {
    let wert;
    try { wert = JSON.parse(roh); }
    catch (f) { console.error(`JSON kaputt in ${datei}: ${f.message}`); process.exit(1); }
    bloecke++;

    if (Array.isArray(wert)) {
      const erst = wert[0] || {};
      if (erst.deck) { vorrat.dares.push(...wert); continue; }
      if (erst.slot) {
        for (const b of wert) (vorrat.szenarioSlots[b.slot] = vorrat.szenarioSlots[b.slot] || []).push(b);
        continue;
      }
      if (erst.kategorie) { vorrat.kekse.push(...wert); continue; }
      if (erst.stufe !== undefined && erst.kontext !== undefined) {
        const vorsatz = String(erst.id || '').split('-')[0];
        if (vorsatz === 'we') vorrat.challengePools.wochenende.push(...wert);
        else if (vorsatz === 'tr') vorrat.challengePools.getrennt.push(...wert);
        else if (vorsatz === 'ru') vorrat.challengePools.ruhig.push(...wert);
        else if (vorsatz === 'dom') vorrat.challengePools.domme.push(...wert);
        else vorrat.challenges.push(...wert);
        continue;
      }
      console.error(`Unbekannte Liste in ${datei} (erstes Feld: ${Object.keys(erst).join(',')})`);
      process.exit(1);
    }

    if (wert.segmente) { vorrat.raeder.push(wert); continue; }
    if (wert.kombinationen) { vorrat.radKombis.push(...wert.kombinationen); continue; }
    if (wert.decks) { vorrat.deckMeta.push(...wert.decks); continue; }
    if (wert.templates) { vorrat.szenarioTemplates.push(...wert.templates); continue; }
    if (wert.auswahl_regeln || wert.auswahl) continue; // Regeln stehen im Code, nicht in Daten
    console.error(`Unbekannter Block in ${datei} (Felder: ${Object.keys(wert).join(',')})`);
    process.exit(1);
  }
}

const zaehlung = {
  dares: vorrat.dares.length,
  raeder: vorrat.raeder.length,
  segmente: vorrat.raeder.reduce((s, r) => s + r.segmente.length, 0),
  slots: Object.keys(vorrat.szenarioSlots).length,
  bausteine: Object.values(vorrat.szenarioSlots).reduce((s, l) => s + l.length, 0),
  challenges: vorrat.challenges.length,
  pools: Object.values(vorrat.challengePools).reduce((s, l) => s + l.length, 0),
  kekse: vorrat.kekse.length,
};

const kopf = `/* ==========================================================================
   15-vorrat.js — Der Vorrat. GEBAUT aus inhalt/*.md — NICHT von Hand ändern.
   Neu erzeugen mit:  node werkzeug/vorrat-bauen.mjs

   ${zaehlung.dares} Karten in ${vorrat.deckMeta.length} Decks · ${zaehlung.raeder} Räder mit ${zaehlung.segmente} Segmenten
   ${zaehlung.bausteine} Szenario-Bausteine in ${zaehlung.slots} Slots · ${zaehlung.challenges + zaehlung.pools} Challenges · ${zaehlung.kekse} Kekssprüche

   Eigene Einträge der beiden leben daneben in der Ablage und werden überall
   dazugemischt. Ob der Vorrat überhaupt mitspielt und bis zu welcher
   Intensität, entscheidet sie unter Verwaltung → Der Vorrat.
   ========================================================================== */

const VORRAT = `;

writeFileSync(join(wurzel, 'src', '15-vorrat.js'), kopf + JSON.stringify(vorrat) + ';\n');
console.log('src/15-vorrat.js geschrieben —', JSON.stringify(zaehlung));
