/* Bringt den Gesprächsverlauf auf ein anderes Gerät.

     node werkzeug/umzug.mjs packen              -> ember-umzug.json
     node werkzeug/umzug.mjs einlesen <datei>    -> auf dem anderen Gerät

   Der Code reist über Git. Das hier ist für das andere: den Verlauf mit
   Claude, damit drüben nicht bei null angefangen werden muss.

   ACHTUNG: Das Bündel enthält das vollständige Gespräch — jedes Wort, jeden
   Entwurf. Es gehört nicht in ein öffentliches Repository und nicht in einen
   Chat, den jemand mitliest. USB-Stick, oder ein Ordner, den nur du siehst. */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, basename } from 'node:path';
import { homedir } from 'node:os';

const befehl = (process.argv[2] || '').toLowerCase();
const heim = homedir();

/* Claude Code legt jedes Projekt unter einem Namen ab, der aus seinem Pfad
   entsteht: Laufwerksdoppelpunkt und Trenner werden zu Bindestrichen. */
function ordnerName(pfad) {
  return pfad.replace(/:/g, '-').replace(/[\\/]/g, '-');
}

const hierPfad = process.cwd();
const hierOrdner = join(heim, '.claude', 'projects', ordnerName(hierPfad));

/* --- Packen --------------------------------------------------------------- */

if (befehl === 'packen') {
  if (!existsSync(hierOrdner)) {
    console.error('Kein Verlauf gefunden unter:\n  ' + hierOrdner);
    process.exit(1);
  }

  const sitzungen = readdirSync(hierOrdner)
    .filter((n) => n.endsWith('.jsonl'))
    .map((n) => ({
      name: n,
      inhalt: readFileSync(join(hierOrdner, n), 'utf8'),
      wann: statSync(join(hierOrdner, n)).mtimeMs,
    }))
    .sort((a, b) => b.wann - a.wann);

  const merkOrdner = join(hierOrdner, 'memory');
  const merkzettel = existsSync(merkOrdner)
    ? readdirSync(merkOrdner)
        .filter((n) => n.endsWith('.md'))
        .map((n) => ({ name: n, inhalt: readFileSync(join(merkOrdner, n), 'utf8') }))
    : [];

  const buendel = {
    art: 'ember-umzug',
    fassung: 1,
    herkunftPfad: hierPfad,
    gepacktAm: new Date().toISOString(),
    sitzungen,
    merkzettel,
  };

  const ziel = join(hierPfad, 'ember-umzug.json');
  writeFileSync(ziel, JSON.stringify(buendel));

  const mb = (statSync(ziel).size / 1048576).toFixed(1);
  console.log(`
Gepackt: ${basename(ziel)}  (${mb} MB)
  ${sitzungen.length} Gespräch(e), ${merkzettel.length} Merkzettel
  Herkunft: ${hierPfad}

So geht es weiter:
  1. Die Datei auf den Laptop bringen — USB, oder ein Ordner nur für dich.
     NICHT über das öffentliche Repository. Da steht alles drin.
  2. Dort im Projektordner:  node werkzeug/umzug.mjs einlesen ember-umzug.json
  3. Danach:                 claude --resume
  4. Die Datei auf beiden Geräten wieder löschen.
`);
  process.exit(0);
}

/* --- Einlesen ------------------------------------------------------------- */

if (befehl === 'einlesen') {
  const quelle = process.argv[3];
  if (!quelle || !existsSync(quelle)) {
    console.error('Welche Datei?  node werkzeug/umzug.mjs einlesen ember-umzug.json');
    process.exit(1);
  }

  const buendel = JSON.parse(readFileSync(quelle, 'utf8'));
  if (buendel.art !== 'ember-umzug') {
    console.error('Das ist kein Umzugsbündel.');
    process.exit(1);
  }

  mkdirSync(hierOrdner, { recursive: true });

  /* Liegt das Projekt hier woanders — anderer Benutzername, anderes
     Laufwerk —, dann zeigen die Pfade im Verlauf noch aufs alte Gerät.
     Sie werden mitgezogen, sonst sucht Claude drüben in der Leere. */
  const alt = buendel.herkunftPfad;
  const neu = hierPfad;
  const anpassen = alt !== neu;

  const ersetze = (text) => {
    if (!anpassen) return text;
    /* Im JSONL stehen die Pfade mit verdoppelten Rückstrichen. */
    const altJson = JSON.stringify(alt).slice(1, -1);
    const neuJson = JSON.stringify(neu).slice(1, -1);
    return text.split(altJson).join(neuJson).split(alt).join(neu);
  };

  for (const s of buendel.sitzungen) {
    writeFileSync(join(hierOrdner, s.name), ersetze(s.inhalt));
  }

  if (buendel.merkzettel.length) {
    const merkOrdner = join(hierOrdner, 'memory');
    mkdirSync(merkOrdner, { recursive: true });
    for (const m of buendel.merkzettel) {
      writeFileSync(join(merkOrdner, m.name), m.inhalt);
    }
  }

  console.log(`
Eingelesen nach:
  ${hierOrdner}

  ${buendel.sitzungen.length} Gespräch(e), ${buendel.merkzettel.length} Merkzettel
  ${anpassen ? `Pfade angepasst:\n    ${alt}\n    -> ${neu}` : 'Pfade unverändert — gleicher Ort wie vorher.'}

Jetzt:  claude --resume
        und das jüngste Gespräch wählen.

Falls es dort nicht auftaucht: Claude Code einmal ganz schließen und neu
öffnen. Danach die Umzugsdatei auf beiden Geräten löschen.
`);
  process.exit(0);
}

console.log(`
EMBER — Umzugshelfer für den Gesprächsverlauf

  node werkzeug/umzug.mjs packen             hier packen
  node werkzeug/umzug.mjs einlesen <datei>   drüben einlesen

Der Code selbst reist über Git — dafür ist das hier nicht nötig.
`);
