/* ==========================================================================
   40-huelle.js — Fußleiste und Seitenwechsel.

   Jede Seite meldet sich in SEITEN mit einer Funktion an, die ihren Inhalt
   in die Bühne hängt. Der Rest — Reiter, Übergang, Aufräumen — passiert hier.
   ========================================================================== */

const SEITEN = {};

/* Was beim Verlassen einer Seite abgeräumt werden muss (Uhren, Horcher). */
let _aufraeumen = [];
const beimVerlassen = (fn) => _aufraeumen.push(fn);

const REITER = [
  { id: 'heim', sinnbild: 'heim', marke: 'Heim' },
  { id: 'plausch', sinnbild: 'plausch', marke: 'Wir' },
  { id: 'spiel', sinnbild: 'spiel', marke: 'Spiel' },
  { id: 'auftrag', sinnbild: 'auftrag', marke: 'Auftrag' },
  { id: 'ich', sinnbild: 'ich', marke: 'Ich' },
];

function baueFussleiste() {
  const leiste = $('#fussleiste');
  leiste.innerHTML = '';
  leiste.hidden = false;

  REITER.forEach((r) => {
    const knopf = el('button', {
      class: 'reiter',
      'data-reiter': r.id,
      'aria-selected': String(D.seite === r.id),
      onclick: () => zeigeSeite(r.id),
    }, sinnbild(r.sinnbild), el('span', { class: 'marke' }, r.marke));

    /* Ein langer Druck aufs eigene Sinnbild öffnet die Verwaltung. */
    if (r.id === 'ich') langerDruck(knopf, () => { if (istDomme()) zeigeSeite('verwaltung'); });

    leiste.append(knopf);
  });
  leisteAuffrischen();
}

/* Die kleinen Punkte: die Ampel des anderen und was ungesehen wartet. */
function leisteAuffrischen() {
  $$('.reiter').forEach((k) => {
    k.setAttribute('aria-selected', String(k.dataset.reiter === D.seite));
    const alt = k.querySelector('.punkt');
    if (alt) alt.remove();
  });

  const wir = $('.reiter[data-reiter=plausch]');
  const farbe = D.ampel[andereRolle()];
  if (wir && farbe) wir.append(el('span', { class: 'punkt ' + farbe }));
}

function zeigeSeite(id) {
  if (!SEITEN[id]) id = 'heim';

  /* Offene Blätter gehören zur alten Seite. Bleiben sie stehen, liegen
     sie über der neuen — mit Knöpfen, deren Umfeld es nicht mehr gibt. */
  $$('.deckel').forEach((d) => d.remove());

  _aufraeumen.forEach((f) => { try { f(); } catch {} });
  _aufraeumen = [];

  D.seite = id;
  const b = $('#buehne');
  b.innerHTML = '';
  b.scrollTop = 0;

  const seite = el('div', { class: 'seite' });
  b.append(seite);
  SEITEN[id](seite);

  leisteAuffrischen();
  Gerät.schreib('letzteSeite', id);
}

/* --- Langer Druck --------------------------------------------------------- */

/* Absichtlich ohne Kontextmenü und ohne Textauswahl: Der lange Druck ist
   ein Weg zu etwas Verstecktem, kein Versehen. */
function langerDruck(knoten, tat, ms = 620) {
  let uhr = null;
  let ausgeloest = false;

  const start = () => {
    ausgeloest = false;
    uhr = setTimeout(() => { ausgeloest = true; puls('hinweis'); tat(); }, ms);
  };
  const stopp = () => { clearTimeout(uhr); uhr = null; };

  knoten.addEventListener('pointerdown', start);
  knoten.addEventListener('pointerup', stopp);
  knoten.addEventListener('pointerleave', stopp);
  knoten.addEventListener('pointercancel', stopp);
  knoten.addEventListener('contextmenu', (e) => e.preventDefault());
  knoten.addEventListener('click', (e) => { if (ausgeloest) { e.preventDefault(); e.stopPropagation(); } }, true);
}

/* --- Bausteine, die überall gebraucht werden ------------------------------ */

function kopfzeile(titel, ...rechts) {
  return el('div', { class: 'abschnitt-kopf' },
    el('h2', {}, titel),
    rechts.length ? el('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } }, ...rechts) : null
  );
}

function leerlauf(zier, text) {
  return el('div', { class: 'leerlauf' },
    el('div', { class: 'zier' }, zier),
    el('p', { class: 'klein' }, text)
  );
}

/* Ein Textfeld in einem Blatt — für alles, was schnell erfasst wird. */
function eingabeBlatt({ titel, hinweis, platzhalter, mehrzeilig, wert, jaText = 'Sichern' }, fertig) {
  const feld = mehrzeilig
    ? el('textarea', { class: 'feld', rows: 4, placeholder: platzhalter || '' }, wert || '')
    : el('input', { class: 'feld', placeholder: platzhalter || '', value: wert || '' });

  const b = blatt(
    el('h2', {}, titel),
    hinweis ? el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } }, hinweis) : el('div', { style: { height: '12px' } }),
    feld,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: () => {
          const text = feld.value.trim();
          if (!text) return meldung('Da steht noch nichts.');
          b.schliessen();
          fertig(text);
        },
      }, jaText)
    )
  );

  setTimeout(() => feld.focus(), 260);
  return b;
}
