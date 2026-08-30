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
  wup: [],             // Wahrheit oder Pflicht: [{id,text,typ,stufe,intensitaet,an,kategorie,dauer_min,tags}]
  lose: [],            // [{id,text,typ,seltenheit,einloesbar_bis,bedingung,verweis,tags}]
  loseQuellen: [],     // [{key,name,beschreibung,seltenheits_boost}]
  loseSerien: [],      // [{key,name,beschreibung,...}]
  regien: [],          // Session-Skripte: [{id,name,beschreibung,gesamtdauer_min,intensitaet,anzeige,schritte:[…]}]
  regieBausteine: [],  // [{key,text,dauer_sek,typ}]
  regeln: [],          // Wenn-Dann-Bibliothek: [{id,name,aktiv,ausloeser,bedingungen,aktionen}]
  toysMeta: null,      // {felder,kategorien,material_warnungen}
  laden: [],           // Artikel: [{id,artikel,preis,waehrung,kategorie,vorrat,cooldown_h}]
  bussgelder: [],      // [{vergehen,betrag,kategorie}]
  einnahmen: [],       // Verdienstquellen als Nachschlagewerk für sie
  abos: [],            // [{name,kosten_monat,beschreibung}]
  gehalt: null,        // {betrag,...}
};

/* Die Stimme geraderücken: Texte, die BEI den beiden ankommen, dürfen
   nicht über sie reden wie eine dritte App von außen. Aus „ihr beide"
   wird „wir beide" — nur dort, wo die Grammatik es sauber hergibt. */
function wirStimme(s) {
  if (typeof s !== 'string') return s;
  return s
    /* Erst die Sätze, bei denen auch das Verb mitmuss — dann das Generische. */
    .replace(/ihr beide es wollt/g, 'wir beide es wollen')
    .replace(/Was ihr macht\b/g, 'Was wir machen')
    .replace(/solange ihr auch außerhalb davon redet/g, 'solange wir auch außerhalb davon reden')
    .replace(/Ihr habt euch das ausgesucht/g, 'Wir haben uns das ausgesucht')
    .replace(/ihr könnt es\b/g, 'wir können es')
    .replace(/sagt es euch\b/g, 'sagen wir es')
    .replace(/Ihr müsst\b/g, 'Wir müssen')
    .replace(/seid ihr zwei\b/g, 'sind wir zwei')
    .replace(/Schaut euch heute an, was ihr vor einem Jahr gemacht habt\. Und macht es nochmal\./g,
      'Schauen wir uns heute an, was wir vor einem Jahr gemacht haben. Und dann: nochmal.')
    .replace(/während ihr einen Film schaut/g, 'während wir einen Film schauen')
    .replace(/Auch wenn ihr nur auf dem Sofa sitzt/g, 'Auch wenn wir nur auf dem Sofa sitzen')
    .replace(/Egal wo ihr seid/g, 'Egal wo wir sind')
    .replace(/Der erste von euch\b/g, 'Der erste von uns')
    .replace(/über euch als eure Freunde/g, 'über uns als unsere Freunde')
    .replace(/Wenn ihr getrennt seid/g, 'Wenn wir getrennt sind')
    .replace(/\bIhr beide\b/g, 'Wir beide')
    .replace(/\bihr beide\b/g, 'wir beide')
    .replace(/\bIhr zwei\b/g, 'Wir zwei')
    .replace(/\bihr zwei\b/g, 'wir zwei')
    .replace(/\bIhr habt\b/g, 'Wir haben')
    .replace(/\bihr habt\b/g, 'wir haben')
    .replace(/\bhabt ihr\b/g, 'haben wir')
    .replace(/\bZwischen euch\b/g, 'Zwischen uns')
    .replace(/\bnur ihr zwei\b/g, 'nur wir zwei');
}

function wirStimmeTief(wert) {
  if (typeof wert === 'string') return wirStimme(wert);
  if (Array.isArray(wert)) return wert.map(wirStimmeTief);
  if (wert && typeof wert === 'object') {
    const raus = {};
    for (const [k, v] of Object.entries(wert)) {
      raus[k] = (k === 'text' || k === 'text_domme' || k === 'text_sub' || k === 'beschreibung')
        ? wirStimme(v) : wirStimmeTief(v);
    }
    return raus;
  }
  return wert;
}

const dateien = readdirSync(ordner).filter((d) => d.endsWith('.md')).sort();
let bloecke = 0;

for (const datei of dateien) {
  const text = readFileSync(join(ordner, datei), 'utf8');
  const zaeune = [...text.matchAll(/```json\s*\n([\s\S]*?)\n```/g)];

  for (const [, roh] of zaeune) {
    let wert;
    try { wert = JSON.parse(roh); }
    catch (f) { console.error(`JSON kaputt in ${datei}: ${f.message}`); process.exit(1); }
    wert = wirStimmeTief(wert);
    bloecke++;

    if (Array.isArray(wert)) {
      const erst = wert[0] || {};
      if (erst.typ === 'wahrheit' || erst.typ === 'pflicht') { vorrat.wup.push(...wert); continue; }
      if (erst.artikel && erst.preis !== undefined) { vorrat.laden.push(...wert); continue; }
      if (erst.seltenheit !== undefined) { vorrat.lose.push(...wert); continue; }
      if (erst.ausloeser && erst.aktionen) { vorrat.regeln.push(...wert); continue; }
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
    if (wert.schritte) { vorrat.regien.push(wert); continue; }
    if (wert.kombinationen) { vorrat.radKombis.push(...wert.kombinationen); continue; }
    if (wert.decks) { vorrat.deckMeta.push(...wert.decks); continue; }
    if (wert.templates) { vorrat.szenarioTemplates.push(...wert.templates); continue; }
    if (wert.quellen) { vorrat.loseQuellen.push(...wert.quellen); continue; }
    if (wert.serien) { vorrat.loseSerien.push(...wert.serien); continue; }
    if (wert.bausteine) { vorrat.regieBausteine.push(...wert.bausteine); continue; }
    if (wert.felder && wert.material_warnungen) { vorrat.toysMeta = wert; continue; }
    if (wert.bussgelder) { vorrat.bussgelder.push(...wert.bussgelder.filter((b) => typeof b.betrag === 'number')); continue; }
    if (wert.einnahmen) { vorrat.einnahmen.push(...wert.einnahmen); continue; }
    if (wert.abos) { vorrat.abos.push(...wert.abos); continue; }
    if (wert.grundgehalt) { vorrat.gehalt = wert.grundgehalt; continue; }
    if (wert.waehrungen || wert.preismechaniken || wert.sparziel || wert.geldwertverfall
      || wert.kredit || wert.kautionen || wert.auktion || wert.schwarzmarkt
      || wert.investition || wert.sperrkonto || wert.geschenk || wert.bilanz_ansicht) continue;
    if (wert.muster) continue;            // Haptik: die Muster leben als PULS im Code
    if (wert.ausloeser || wert.bedingungen || wert.aktionen) continue; // Katalog: der Code kennt nur, was er kann
    if (wert.mechanik || wert.sicherungen || wert.beispiel_kette || wert.beispiel_eintraege) continue;
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
  wup: vorrat.wup.length,
  lose: vorrat.lose.length,
  regien: vorrat.regien.length,
  regeln: vorrat.regeln.length,
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
