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
  { id: 'plausch', sinnbild: 'plausch', marke: 'Chat' },
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

  /* Offene Aufträge glimmen am Reiter — er soll sie nicht suchen müssen. */
  const auftragReiter = $('.reiter[data-reiter=auftrag]');
  if (auftragReiter && D.offeneAuftraege > 0) {
    auftragReiter.append(el('span', { class: 'punkt glut-punkt' }));
  }
}

function zeigeSeite(id) {
  if (!SEITEN[id]) id = 'heim';

  /* Offene Blätter gehören zur alten Seite. Bleiben sie stehen, liegen
     sie über der neuen — mit Knöpfen, deren Umfeld es nicht mehr gibt. */
  $$('.deckel').forEach((d) => d.remove());

  _aufraeumen.forEach((f) => { try { f(); } catch {} });
  _aufraeumen = [];

  /* Dieselbe Seite noch einmal ist ein Auffrischen, kein Umzug: kein
     Hereinschieben, kein Sprung nach oben — die Stelle bleibt, wo sie
     war. Nur ein echter Seitenwechsel bekommt den Auftritt. */
  const gleiche = id === D.seite && $('#buehne .seite');
  const b = $('#buehne');
  const merkScroll = gleiche ? b.scrollTop : 0;

  D.seite = id;
  b.innerHTML = '';

  const seite = el('div', { class: 'seite' + (gleiche ? ' still-wechsel' : '') });
  b.append(seite);
  SEITEN[id](seite);
  b.scrollTop = merkScroll;

  leisteAuffrischen();
  Gerät.schreib('letzteSeite', id);
}

/* --- Wisch zurück ---------------------------------------------------------
   Von der linken Kante nach rechts ziehen heißt „Zurück" — die Seite
   folgt dem Finger und gleitet dann ganz hinaus. Wohin zurück führt,
   weiß die Karte unten; die fünf Hauptseiten haben kein Zurück. */

const ZURUECK_ZIEL = {
  rad: 'spiel', szenario: 'spiel', wahrheit: 'spiel', rubbeln: 'spiel',
  quiz: 'spiel', regie: 'spiel', timer: 'spiel',
  wachsen: 'ich', pfade: 'ich', spannung: 'ich', signale: 'ich',
  wuensche: 'ich', grenzen: 'ich', koerper: 'ich', tresor: 'ich',
  rituale: 'ich', vertrag: 'ich', nachher: 'ich', reparatur: 'ich',
  glossar: 'ich', toys: 'ich', maschine: 'ich', eigenes: 'ich',
  buch: 'ich', verwaltung: 'ich',
};

function wischZurueckAnbringen() {
  const b = $('#buehne');
  if (!b || b._wischt) return;
  b._wischt = true;
  let start = null;

  b.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    start = (t.clientX <= 30 && ZURUECK_ZIEL[D.seite]) ? { x: t.clientX, y: t.clientY } : null;
  }, { passive: true });

  b.addEventListener('touchmove', (e) => {
    if (!start) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x;
    const dy = Math.abs(t.clientY - start.y);
    const seite = $('#buehne .seite');
    if (!seite) { start = null; return; }
    if (dy > 70 && dy > dx) {
      start = null;
      seite.style.transition = 'transform .2s ease';
      seite.style.transform = '';
      seite.style.opacity = '';
      return;
    }
    if (dx > 0) {
      seite.style.transition = 'none';
      seite.style.transform = 'translateX(' + dx + 'px)';
      seite.style.opacity = String(Math.max(.35, 1 - dx / window.innerWidth * 0.7));
    }
  }, { passive: true });

  b.addEventListener('touchend', (e) => {
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const ziel = ZURUECK_ZIEL[D.seite];
    start = null;
    const seite = $('#buehne .seite');
    if (!seite) return;
    if (ziel && dx > Math.min(110, window.innerWidth * 0.28)) {
      seite.style.transition = 'transform .22s ease-out, opacity .22s ease-out';
      seite.style.transform = 'translateX(105%)';
      seite.style.opacity = '0';
      tonSpielen('tick');
      setTimeout(() => zeigeSeite(ziel), 190);
    } else {
      seite.style.transition = 'transform .28s cubic-bezier(.2,.7,.3,1), opacity .2s ease';
      seite.style.transform = '';
      seite.style.opacity = '';
    }
  });
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
function eingabeBlatt({ titel, hinweis, platzhalter, mehrzeilig, wert, jaText = 'Sichern', leerErlaubt = false }, fertig) {
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
          /* „Freiwillig" muss auch leer heißen dürfen — sonst lügt der
             Platzhalter. */
          if (!text && !leerErlaubt) return meldung('Da steht noch nichts.');
          b.schliessen();
          fertig(text);
        },
      }, jaText)
    )
  );

  setTimeout(() => feld.focus(), 260);
  return b;
}
