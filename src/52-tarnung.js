/* ==========================================================================
   52-tarnung.js — Wenn jemand mitschaut.

   Ein Griff, und aus EMBER wird eine Notizliste. Nichts Echtes bleibt auf
   dem Bildschirm, nichts Echtes liegt darunter — die Tarnung ersetzt den
   Inhalt, sie legt sich nicht darüber.

   Hinein:  dreimal auf den Schriftzug tippen, oder über den Notausgang.
   Hinaus:  dreimal auf die Überschrift der Notizliste tippen.

   Die Notizen sind erfunden und liegen nur auf diesem Gerät. Wer sie liest,
   liest nichts.
   ========================================================================== */

let _getarnt = false;
let _echteBuehne = null;

/* Vorgefüllte, völlig banale Notizen — Startbestand, bis eigene entstehen. */
const TARN_NOTIZEN_START = [
  'Einkauf\nMilch, Kaffee, Zwiebeln, Spülmaschinentabs',
  'Anruf Werkstatt\nwegen Termin nächste Woche',
  'Passwörter ändern\nRouter, Mailkonto',
  'Geburtstag Mama\nBlumen bestellen, nicht vergessen',
];

const TARN_GELB = '#c99700';
const TARN_SCHRIFTART = '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

/* Notizen sind {text, wann} — die erste Zeile ist der Titel, genau wie
   im Vorbild. Ältere Bestände {titel, text} werden einmalig überführt. */
function tarnNotizenLies() {
  let liste = Gerät.lies('tarnNotizen', null);
  if (!liste) {
    liste = TARN_NOTIZEN_START.map((text, i) => ({
      text, wann: jetzt() - (i + 2) * 86400000 - i * 7130000,
    }));
    Gerät.schreib('tarnNotizen', liste);
  }
  if (liste.length && liste[0].titel !== undefined) {
    liste = liste.map((n, i) => ({
      text: (n.titel ? n.titel + '\n' : '') + (n.text || ''),
      wann: n.wann || jetzt() - (i + 2) * 86400000,
    }));
    Gerät.schreib('tarnNotizen', liste);
  }
  return liste;
}

function tarnungAn() {
  if (_getarnt) return;
  _getarnt = true;
  /* Die Tarnung übersteht auch ein Neuladen — wer die Seite auffrischt,
     sieht wieder Notizen, nicht plötzlich EMBER. */
  Gerät.schreib('getarnt', true);

  /* Die echte Bühne wird beiseitegelegt, nicht versteckt. Ein neugieriger
     Blick in die Entwicklerwerkzeuge fände sonst alles noch vor. */
  const huelle = $('#huelle');
  _echteBuehne = huelle.innerHTML;
  huelle.innerHTML = '';

  befehlSchliessen();
  const ruhe = $('#ruheschirm'); if (ruhe) ruhe.remove();
  const notaus = $('#notaus'); if (notaus) notaus.style.display = 'none';
  $('#meldungen').innerHTML = '';

  document.title = 'Notizen';
  document.documentElement.setAttribute('data-stimmung', 'tarnung');
  tarnStilAnbringen();

  const wurzel = el('div', {
    style: {
      position: 'fixed', inset: '0', overflow: 'hidden',
      background: '#f2f2f7', color: '#1c1c1e', fontFamily: TARN_SCHRIFTART,
      fontSize: '17px', WebkitFontSmoothing: 'antialiased',
    },
  });
  huelle.append(wurzel);

  /* Dreimal schnell tippen — irgendwo auf der Liste, nur nicht mitten
     ins Schreiben — holt EMBER zurück. */
  tippenDreimal(wurzel, tarnungAus, 650, (ziel) =>
    !(ziel.closest && ziel.closest('textarea, input')));

  tarnListeZeigen(wurzel);
}

/* --- Die Notizliste (das Herz der Maske) ----------------------------------- */

function tarnDatum(wann) {
  const d = new Date(wann);
  const heute = new Date(); heute.setHours(0, 0, 0, 0);
  if (wann >= heute.getTime()) {
    return d.getHours().toString().padStart(2, '0') + ':' + d.getMinutes().toString().padStart(2, '0');
  }
  if (wann >= heute.getTime() - 86400000) return 'Gestern';
  return d.getDate().toString().padStart(2, '0') + '.' + (d.getMonth() + 1).toString().padStart(2, '0') + '.' +
    String(d.getFullYear()).slice(2);
}

function tarnListeZeigen(wurzel, suchwort = '') {
  wurzel.innerHTML = '';

  const alle = tarnNotizenLies().slice().sort((a, b) => b.wann - a.wann);
  const passende = suchwort
    ? alle.filter((n) => n.text.toLowerCase().includes(suchwort.toLowerCase()))
    : alle;

  const suche = el('input', {
    type: 'search', placeholder: 'Suchen', value: suchwort,
    autocapitalize: 'off', autocorrect: 'off',
    style: {
      width: '100%', border: 'none', borderRadius: '10px', padding: '8px 12px',
      background: '#e3e3e8', color: '#1c1c1e', fontSize: '16px', fontFamily: 'inherit',
      outline: 'none', WebkitAppearance: 'none', marginBottom: '16px',
    },
    oninput: (e) => {
      const wert = e.target.value;
      const merkFokus = true;
      tarnListeZeigen(wurzel, wert);
      if (merkFokus) {
        const neu = wurzel.querySelector('input[type=search]');
        if (neu) { neu.focus(); neu.setSelectionRange(wert.length, wert.length); }
      }
    },
  });

  const gruppe = el('div', {
    style: { background: '#ffffff', borderRadius: '12px', overflow: 'hidden' },
  });
  passende.forEach((n, i) => {
    const zeilen = n.text.split('\n');
    const titel = (zeilen[0] || '').trim() || 'Neue Notiz';
    const rest = zeilen.slice(1).find((z) => z.trim()) || 'Kein weiterer Text';
    gruppe.append(el('button', {
      style: {
        display: 'block', width: '100%', textAlign: 'left', padding: '11px 16px',
        border: 'none', background: 'transparent', color: 'inherit',
        fontFamily: 'inherit', fontSize: 'inherit', cursor: 'pointer',
        borderBottom: i < passende.length - 1 ? '1px solid #e5e5ea' : 'none',
      },
      onclick: () => tarnNotizOeffnen(wurzel, alle.indexOf(n)),
    },
      el('div', { style: { fontWeight: '600', fontSize: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, titel),
      el('div', { style: { display: 'flex', gap: '8px', marginTop: '2px', fontSize: '14px', color: '#8e8e93' } },
        el('span', { style: { flex: 'none' } }, tarnDatum(n.wann)),
        el('span', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, rest)
      )
    ));
  });
  if (!passende.length) {
    gruppe.append(el('div', { style: { padding: '18px 16px', color: '#8e8e93', fontSize: '15px' } }, 'Keine Ergebnisse'));
  }

  wurzel.append(
    el('div', {
      style: {
        position: 'absolute', inset: '0', overflowY: 'auto',
        padding: 'calc(env(safe-area-inset-top) + 14px) 16px 90px',
      },
    },
      /* fontFamily ausdrücklich erben — die App-Regel für h1 (Zierschrift)
         gewönne sonst und verriete die Maske auf den ersten Blick. */
      el('h1', { style: { fontFamily: 'inherit', fontSize: '32px', fontWeight: '700', padding: '2px 0 12px', letterSpacing: '.2px' } }, 'Notizen'),
      suche,
      gruppe
    ),
    /* Die Fußzeile: Anzahl mittig, Verfassen rechts — wie im Vorbild. */
    el('div', {
      style: {
        position: 'absolute', left: '0', right: '0', bottom: '0',
        padding: '10px 16px calc(env(safe-area-inset-bottom) + 10px)',
        display: 'flex', alignItems: 'center',
        background: 'rgba(242,242,247,.92)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
        borderTop: '1px solid #d1d1d6',
      },
    },
      el('span', { style: { flex: '1' } }),
      el('span', { style: { fontSize: '12px', color: '#6c6c70' } },
        alle.length + (alle.length === 1 ? ' Notiz' : ' Notizen')),
      el('span', { style: { flex: '1', textAlign: 'right' } },
        el('button', {
          'aria-label': 'Neue Notiz',
          style: { border: 'none', background: 'transparent', color: TARN_GELB, padding: '4px', cursor: 'pointer' },
          onclick: () => {
            const liste = tarnNotizenLies();
            liste.push({ text: '', wann: jetzt() });
            Gerät.schreib('tarnNotizen', liste);
            tarnNotizOeffnen(wurzel, liste.length - 1, true);
          },
        }, tarnVerfassenBild())
      )
    )
  );
}

function tarnVerfassenBild() {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('width', '24'); s.setAttribute('height', '24');
  s.setAttribute('fill', 'none'); s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '1.7'); s.setAttribute('stroke-linecap', 'round'); s.setAttribute('stroke-linejoin', 'round');
  s.innerHTML = '<path d="M19.5 12.5v6a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2v-12a2 2 0 0 1 2-2h6"/><path d="M17.8 3.7a1.9 1.9 0 0 1 2.7 2.7L12 15l-3.6.9.9-3.6z"/>';
  return s;
}

/* --- Eine Notiz, wirklich beschreibbar -------------------------------------- */

function tarnNotizOeffnen(wurzel, index, frisch = false) {
  wurzel.innerHTML = '';
  const liste = tarnNotizenLies();
  const notiz = liste[index];
  if (!notiz) return tarnListeZeigen(wurzel);

  let sichern = null;
  const feld = el('textarea', {
    value: notiz.text,
    autocapitalize: 'sentences',
    style: {
      width: '100%', height: '100%', border: 'none', outline: 'none', resize: 'none',
      background: 'transparent', color: '#1c1c1e', fontFamily: 'inherit',
      fontSize: '17px', lineHeight: '1.45', padding: '0',
    },
    oninput: () => {
      clearTimeout(sichern);
      sichern = setTimeout(() => {
        const frischeListe = tarnNotizenLies();
        if (!frischeListe[index]) return;
        frischeListe[index] = { text: feld.value, wann: jetzt() };
        Gerät.schreib('tarnNotizen', frischeListe);
      }, 350);
    },
  });
  feld.textContent = notiz.text;

  const zurueck = () => {
    clearTimeout(sichern);
    const frischeListe = tarnNotizenLies();
    if (frischeListe[index]) {
      if (feld.value.trim()) {
        frischeListe[index] = { text: feld.value, wann: frischeListe[index].wann };
      } else {
        frischeListe.splice(index, 1);   /* Leere Notizen verschwinden — wie im Vorbild. */
      }
      Gerät.schreib('tarnNotizen', frischeListe);
    }
    tarnListeZeigen(wurzel);
  };

  wurzel.append(
    el('div', {
      style: {
        position: 'absolute', inset: '0', display: 'flex', flexDirection: 'column',
        padding: 'calc(env(safe-area-inset-top) + 8px) 0 0',
      },
    },
      el('div', { style: { display: 'flex', alignItems: 'center', padding: '4px 8px 10px' } },
        el('button', {
          style: {
            border: 'none', background: 'transparent', color: TARN_GELB,
            fontSize: '17px', fontFamily: 'inherit', padding: '6px 8px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '2px',
          },
          onclick: zurueck,
        }, el('span', { style: { fontSize: '24px', lineHeight: '1', marginTop: '-2px' } }, '‹'), 'Notizen'),
        el('span', { style: { flex: '1' } }),
        el('button', {
          style: { border: 'none', background: 'transparent', color: TARN_GELB, fontSize: '16px', fontFamily: 'inherit', padding: '6px 12px', cursor: 'pointer' },
          onclick: () => {
            const frischeListe = tarnNotizenLies();
            frischeListe.splice(index, 1);
            Gerät.schreib('tarnNotizen', frischeListe);
            tarnListeZeigen(wurzel);
          },
        }, 'Löschen')
      ),
      el('div', { style: { flex: '1', padding: '0 20px calc(env(safe-area-inset-bottom) + 16px)' } },
        el('div', { style: { fontSize: '12px', color: '#8e8e93', textAlign: 'center', paddingBottom: '12px' } },
          new Date(notiz.wann).toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }) +
          ' um ' + new Date(notiz.wann).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })),
        feld
      )
    )
  );
  if (frisch) setTimeout(() => feld.focus(), 200);
}

function tarnungAus() {
  if (!_getarnt) return;
  _getarnt = false;
  Gerät.loesch('getarnt');

  const stil = $('#tarnstil'); if (stil) stil.remove();
  $('#huelle').innerHTML = _echteBuehne || '';
  _echteBuehne = null;

  document.title = 'Ember';
  stimmungSetzen();
  const notaus = $('#notaus'); if (notaus) notaus.style.display = '';

  /* Die Oberfläche wird neu gezeichnet, weil die alten Knöpfe mit dem
     ersetzten HTML ihre Ereignisse verloren haben.

     Ist die App verschlossen — die Tarnung ist auch vom Schloss aus
     erreichbar —, dann gibt es keine Seiten, die man zeichnen könnte.
     Dann führt der Weg zurück ans Schloss. */
  if (D.offen) {
    baueFussleiste();
    zeigeSeite(D.seite || 'heim');
    /* Was während der Tarnung still liegen blieb, kommt jetzt hoch —
       allen voran ein unquittierter Befehl. */
    setTimeout(async () => {
      const aktuell = await datenLies('knopf/aktuell').catch(() => null);
      if (aktuell && aktuell.art === 'befehl' && !aktuell.quittiert && !istDomme()) {
        befehlZeigen(aktuell);
      }
    }, 400);
  } else if (istEingerichtet()) {
    zeigeSchloss();
  } else {
    zeigeEinrichtung();
  }
}

/* Das Korn und die dunklen Grundfarben müssen weg, sonst sieht die
   Notizliste aus wie eine getarnte App. */
function tarnStilAnbringen() {
  if ($('#tarnstil')) return;
  document.head.append(el('style', { id: 'tarnstil' }, `
    body::after { display: none !important; }
    html[data-stimmung='tarnung'], html[data-stimmung='tarnung'] body { background: #f2f2f7 !important; }
    #meldungen { display: none !important; }
    .hilfeknopf { display: none !important; }
    #vorhang { background: #f2f2f7 !important; }
    #vorhang .funke, #vorhang .wortmarke, #vorhang .vorhangzitat { display: none !important; }
  `));
  const marke = document.querySelector('meta[name=theme-color]');
  if (marke) marke.setAttribute('content', '#f2f2f7');
}

/* --- Die Geste ------------------------------------------------------------ */

function tippenDreimal(knoten, tat, fenster = 900, zulassen = null) {
  let zaehler = 0;
  let uhr = null;
  knoten.addEventListener('click', (e) => {
    if (zulassen && !zulassen(e.target)) { zaehler = 0; return; }
    zaehler++;
    clearTimeout(uhr);
    if (zaehler >= 3) { zaehler = 0; tat(); return; }
    uhr = setTimeout(() => { zaehler = 0; }, fenster);
  });
}

/* --- Von überall hinein -----------------------------------------------------
   Drei schnelle Tipps an ungefähr derselben Stelle — auf freier Fläche,
   nicht auf einem Knopf oder in einem Feld — tarnen die App. Egal, auf
   welcher Seite man gerade steht, auch am Schloss. Knöpfe sind
   ausgenommen, sonst tarnt sich die App mitten im schnellen Bedienen. */
let _tarnTipp = { zaehler: 0, uhr: null, x: 0, y: 0 };
document.addEventListener('pointerdown', (e) => {
  if (_getarnt) return;
  const ziel = e.target;
  if (ziel && ziel.closest &&
    ziel.closest('button, input, textarea, select, a, label, [contenteditable], .blatt, .deckel, .befehl')) {
    _tarnTipp.zaehler = 0;
    return;
  }
  const nah = Math.abs(e.clientX - _tarnTipp.x) < 52 && Math.abs(e.clientY - _tarnTipp.y) < 52;
  _tarnTipp.x = e.clientX;
  _tarnTipp.y = e.clientY;
  _tarnTipp.zaehler = (_tarnTipp.zaehler && nah) ? _tarnTipp.zaehler + 1 : 1;
  clearTimeout(_tarnTipp.uhr);
  if (_tarnTipp.zaehler >= 3) {
    _tarnTipp.zaehler = 0;
    tarnungAn();
    return;
  }
  _tarnTipp.uhr = setTimeout(() => { _tarnTipp.zaehler = 0; }, 650);
}, true);

/* Auch das Schütteln bringt die Tarnung — dafür braucht es auf dem iPhone
   allerdings eine ausdrückliche Erlaubnis, die nur auf ein Tippen hin
   erfragt werden darf. */
function schuettelnAnbieten() {
  if (typeof DeviceMotionEvent === 'undefined' || !DeviceMotionEvent.requestPermission) {
    schuettelnHorchen();
    return;
  }
  DeviceMotionEvent.requestPermission()
    .then((antwort) => { if (antwort === 'granted') { Gerät.schreib('schuetteln', true); schuettelnHorchen(); } })
    .catch(() => {});
}

function schuettelnHorchen() {
  let letzte = 0;
  window.addEventListener('devicemotion', (e) => {
    const b = e.accelerationIncludingGravity;
    if (!b) return;
    const staerke = Math.abs(b.x || 0) + Math.abs(b.y || 0) + Math.abs(b.z || 0);
    if (staerke < 34) return;
    if (Date.now() - letzte < 1200) return;
    letzte = Date.now();
    if (_getarnt) tarnungAus(); else tarnungAn();
  });
}
