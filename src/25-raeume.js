/* ==========================================================================
   25-raeume.js — Räume.

   Ein Raum ist eine eigene Welt: eigener Schlüssel, eigener Bereich in
   der Ablage, eigene PIN, eigener Bestand auf dem Gerät. Ein Gerät kann
   mehrere Räume tragen und zwischen ihnen wechseln — ein Proberaum zum
   Ausprobieren neben dem Raum, der zählt.

   Alles Örtliche liegt unter einem Vorzeichen je Raum (ember.r1.…);
   nur die Raumliste selbst und der Zeiger auf den aktiven Raum sind
   geräteweit. Dadurch können sich zwei Räume nicht einmal aus Versehen
   berühren — auch der Offline-Spiegel ist getrennt.
   ========================================================================== */

const RAUM_GLOBAL = ['ember.raeume', 'ember.aktiverRaum'];

function raeumeLies() {
  try { return JSON.parse(localStorage.getItem('ember.raeume')) || []; }
  catch { return []; }
}

function raeumeSchreib(liste) {
  try { localStorage.setItem('ember.raeume', JSON.stringify(liste)); } catch {}
}

function aktiverRaumId() {
  try { return localStorage.getItem('ember.aktiverRaum') || ''; } catch { return ''; }
}

function raumName() {
  const r = raeumeLies().find((x) => x.id === aktiverRaumId());
  return r ? r.name : '';
}

/* Läuft als Allererstes beim Start. Ein Gerät aus der Zeit vor den Räumen
   trägt seinen Bestand flach unter ember.* — der wird einmalig in den
   ersten Raum umgezogen. Danach ist jedes Gerät ein Räume-Gerät. */
function raumMigration() {
  const raeume = raeumeLies();
  if (raeume.length) {
    let id = aktiverRaumId();
    if (!raeume.some((r) => r.id === id)) {
      id = raeume[0].id;
      try { localStorage.setItem('ember.aktiverRaum', id); } catch {}
    }
    raumVorzeichenSetzen('r' + id + '.');
    return;
  }

  const alteSchluessel = [];
  try {
    for (const k of Object.keys(localStorage)) {
      if (k.startsWith('ember.') && !RAUM_GLOBAL.includes(k)) alteSchluessel.push(k);
    }
  } catch {}

  raeumeSchreib([{ id: '1', name: 'Raum 1' }]);
  try { localStorage.setItem('ember.aktiverRaum', '1'); } catch {}

  for (const k of alteSchluessel) {
    try {
      localStorage.setItem('ember.r1.' + k.slice('ember.'.length), localStorage.getItem(k));
      localStorage.removeItem(k);
    } catch {}
  }

  raumVorzeichenSetzen('r1.');
}

function raumAnlegen(name) {
  const liste = raeumeLies();
  const id = Date.now().toString(36);
  liste.push({ id, name: name || 'Raum ' + (liste.length + 1) });
  raeumeSchreib(liste);
  return id;
}

/* Wechseln heißt neu starten: Schlüssel, Horcher, Spiegel — alles gehört
   dem alten Raum und wird am saubersten losgelassen, indem die App frisch
   in den neuen hineinkommt. */
function raumAktivieren(id) {
  try { localStorage.setItem('ember.aktiverRaum', id); } catch {}
  location.reload();
}

function raumUmbenennen(id, name) {
  const liste = raeumeLies();
  const r = liste.find((x) => x.id === id);
  if (r) { r.name = name; raeumeSchreib(liste); }
}

/* Nimmt einen Raum von DIESEM Gerät — der gemeinsame Bestand in der
   Ablage bleibt unberührt und kommt mit dem Kopplungscode wieder. */
function raumEntfernen(id) {
  const vorzeichen = 'ember.r' + id + '.';
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(vorzeichen))
      .forEach((k) => localStorage.removeItem(k));
  } catch {}

  const rest = raeumeLies().filter((x) => x.id !== id);
  raeumeSchreib(rest);

  if (aktiverRaumId() === id) {
    if (rest.length) raumAktivieren(rest[0].id);
    else { try { localStorage.removeItem('ember.aktiverRaum'); } catch {} location.reload(); }
  }
}

/* --- Der Wechsler ---------------------------------------------------------- */

function raumWechslerBlatt() {
  const liste = raeumeLies();
  const aktiv = aktiverRaumId();

  const b = blatt(
    el('h2', {}, 'Räume'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 4px' } },
      'Jeder Raum ist eine eigene Welt — eigener Schlüssel, eigene Ablage, eigene PIN.'),

    ...liste.map((r) => el('button', {
      class: 'karte',
      style: {
        width: '100%', textAlign: 'left', marginTop: '9px',
        display: 'flex', alignItems: 'center', gap: '13px',
        borderColor: r.id === aktiv ? 'var(--glut)' : 'var(--kante)',
        background: r.id === aktiv ? 'var(--flaeche-hoch)' : 'var(--flaeche)',
      },
      onclick: () => { if (r.id !== aktiv) { b.schliessen(); raumAktivieren(r.id); } },
    },
      el('span', {
        style: {
          width: '11px', height: '11px', borderRadius: '50%', flex: 'none',
          background: r.id === aktiv ? 'var(--verlauf)' : 'var(--grund2)',
          boxShadow: r.id === aktiv ? '0 0 9px var(--schein)' : 'inset 0 0 0 1px var(--kante)',
        },
      }),
      el('div', {},
        el('div', { style: { fontWeight: '500' } }, r.name),
        r.id === aktiv ? el('div', { class: 'still klein' }, 'gerade offen') : null
      )
    )),

    el('button', {
      class: 'knopf leer breit', style: { marginTop: '14px' },
      onclick: () => {
        b.schliessen();
        eingabeBlatt({
          titel: 'Neuer Raum',
          hinweis: 'Er beginnt leer — mit eigener Einrichtung oder einem Kopplungscode.',
          platzhalter: 'z. B. Probe',
          jaText: 'Anlegen',
        }, (name) => {
          const id = raumAnlegen(name);
          raumAktivieren(id);
        });
      },
    }, '+ Neuer Raum')
  );
}
