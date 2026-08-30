/* ==========================================================================
   20-core.js — Werkzeug, das alles andere benutzt.
   Ein gemeinsamer globaler Raum, wie bei VANI. Keine Module, keine Imports.
   ========================================================================== */

/* --- Kürzel --------------------------------------------------------------- */

const $ = (w, wo = document) => wo.querySelector(w);
const $$ = (w, wo = document) => [...wo.querySelectorAll(w)];

/* el('div', {class:'karte'}, 'Text', el('span', {}, '!'))
   Merkmale: Zeichenketten werden gesetzt, Funktionen als Ereignis gebunden
   (onclick -> click), true/false schalten leere Merkmale. */
function el(art, merkmale = {}, ...kinder) {
  const k = document.createElement(art);
  for (const [name, wert] of Object.entries(merkmale || {})) {
    if (wert == null || wert === false) continue;
    if (name === 'style' && typeof wert === 'object') Object.assign(k.style, wert);
    else if (name.startsWith('on') && typeof wert === 'function') k.addEventListener(name.slice(2), wert);
    else if (name === 'html') k.innerHTML = wert;
    else if (wert === true) k.setAttribute(name, '');
    else k.setAttribute(name, wert);
  }
  for (const kind of kinder.flat(Infinity)) {
    if (kind == null || kind === false) continue;
    k.append(kind.nodeType ? kind : document.createTextNode(String(kind)));
  }
  return k;
}

/* Wie el(), nur zum Nachrüsten: hängt Kinder an einen bestehenden Knoten
   und übergeht nulls. Das rohe append() würde aus einem null den TEXT
   "null" machen — ein bedingtes Kind wäre dann wörtlich zu lesen. */
function anfuegen(ziel, ...kinder) {
  for (const kind of kinder.flat(Infinity)) {
    if (kind == null || kind === false) continue;
    ziel.append(kind.nodeType ? kind : document.createTextNode(String(kind)));
  }
  return ziel;
}

/* Sinnbilder als schlanke Striche — nichts Gefülltes, nichts Buntes. */
function sinnbild(name, groesse = 23) {
  const wege = {
    heim: '<path d="M4 11.5 12 4l8 7.5"/><path d="M6 10.5V20h12v-9.5"/>',
    plausch: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v7a2.5 2.5 0 0 1-2.5 2.5H9l-5 4z"/>',
    spiel: '<rect x="3.5" y="6" width="11" height="14" rx="2"/><path d="M8.5 3.4 18 5.1a2 2 0 0 1 1.6 2.3L18 17"/>',
    auftrag: '<rect x="4.5" y="3.5" width="15" height="17" rx="2.5"/><path d="M8.5 9h7M8.5 13h7M8.5 17h4"/>',
    ich: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.8 20.2c.8-3.7 3.7-5.7 7.2-5.7s6.4 2 7.2 5.7"/>',
    zurueck: '<path d="M14.5 5 8 12l6.5 7"/>',
    schliessen: '<path d="M6 6l12 12M18 6L6 18"/>',
    mehr: '<circle cx="12" cy="5.5" r="1.3"/><circle cx="12" cy="12" r="1.3"/><circle cx="12" cy="18.5" r="1.3"/>',
    haken: '<path d="M4.5 12.5 9.5 17.5 19.5 6.5"/>',
    kreuz: '<path d="M6.5 6.5l11 11M17.5 6.5l-11 11"/>',
    flamme: '<path d="M12 3.5c3.4 3.2 5.5 6 5.5 9a5.5 5.5 0 1 1-11 0c0-1.6.6-3 1.7-4.4.4 1.3 1.1 2 2.1 2.2-.4-2.6.2-4.9 1.7-6.8z"/>',
    schloss: '<rect x="4.8" y="10.5" width="14.4" height="10" rx="2.4"/><path d="M8.2 10.5V7.6a3.8 3.8 0 0 1 7.6 0v2.9"/>',
    glocke: '<path d="M6.5 16.5v-5a5.5 5.5 0 0 1 11 0v5l1.6 2.4H4.9z"/><path d="M10 21.2a2.3 2.3 0 0 0 4 0"/>',
    auge: '<path d="M2.6 12S6.3 5.8 12 5.8 21.4 12 21.4 12 17.7 18.2 12 18.2 2.6 12 2.6 12z"/><circle cx="12" cy="12" r="2.7"/>',
    mikro: '<rect x="9" y="3.5" width="6" height="11" rx="3"/><path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v3M9 21h6"/>',
    sanduhr: '<path d="M6.5 3.5h11M6.5 20.5h11M7.5 3.5v3.2c0 2.4 3 3.4 3 5.3 0 1.9-3 2.9-3 5.3v3.2M16.5 3.5v3.2c0 2.4-3 3.4-3 5.3 0 1.9 3 2.9 3 5.3v3.2"/>',
    kerze: '<path d="M9.5 11.5h5V20h-5zM12 11.5V9"/><path d="M12 3.5c1.2 1.5 2 2.4 2 3.4a2 2 0 1 1-4 0c0-1 .8-1.9 2-3.4z"/>',
    kette: '<rect x="3.5" y="9.5" width="9" height="5" rx="2.5"/><rect x="11.5" y="9.5" width="9" height="5" rx="2.5"/>',
    mund: '<path d="M3.5 12c2.5-3.2 5-4.4 8.5-4.4s6 1.2 8.5 4.4c-2.5 3.2-5 4.6-8.5 4.6S6 15.2 3.5 12z"/><path d="M3.5 12h17"/>',
    hand: '<path d="M7.5 11.5V6.4a1.4 1.4 0 0 1 2.8 0v4.1M10.3 10.2V4.9a1.4 1.4 0 0 1 2.8 0v5.3M13.1 10.2V6.4a1.4 1.4 0 0 1 2.8 0v6.1"/><path d="M15.9 12.5c0 4-1.6 8-5.4 8-3.2 0-4.7-2.6-5.5-5l-1.2-2.9a1.4 1.4 0 0 1 2.4-1.3l1.3 2.2"/>',
    zauber: '<path d="M4.5 19.5 15 9"/><path d="M17.5 3.5v3.4M15.8 5.2h3.4M19.5 9.2l1.6 1.6M20.3 8.4l-1.6 1.6"/>',
    mond: '<path d="M19.5 14.2A8.2 8.2 0 1 1 9.8 4.5a6.6 6.6 0 0 0 9.7 9.7z"/>',
    waage: '<path d="M12 4.5V19M8.5 19.5h7M12 6.5 6.5 8.2M12 6.5l5.5 1.7"/><path d="M4 13.5a2.5 2.5 0 0 0 5 0L6.5 8.6 4 13.5zM15 13.5a2.5 2.5 0 0 0 5 0l-2.5-4.9-2.5 4.9z"/>',
    geschenk: '<rect x="4.5" y="10" width="15" height="9.5" rx="1.5"/><path d="M12 10v9.5M4.5 13.5h15"/><path d="M12 10C9.5 10 8 9 8 7.5S9.4 5.2 10.4 6c1 .8 1.6 2.5 1.6 4 0-1.5.6-3.2 1.6-4 1-.8 2.4.1 2.4 1.5S14.5 10 12 10z"/>',
    herz: '<path d="M12 19.5s-7.5-4.5-7.5-9.7A4.1 4.1 0 0 1 12 7.2a4.1 4.1 0 0 1 7.5 2.6c0 5.2-7.5 9.7-7.5 9.7z"/>',
    pfeilauf: '<path d="M4 17l5-5 3.5 3.5L20 8"/><path d="M15.5 8H20v4.5"/>',
    brief: '<rect x="3.5" y="6" width="17" height="12.5" rx="2"/><path d="m4.5 7.5 7.5 6 7.5-6"/>',
    feder: '<path d="M6.5 19.5c-.5-7.5 4-13 12-15.5-.7 8-5 13-11 14"/><path d="M6.5 19.5C9 15 12.5 10.5 16 7"/>',
    wuerfel: '<rect x="4.5" y="4.5" width="15" height="15" rx="3.5"/><circle cx="9" cy="9" r="1.1"/><circle cx="15" cy="9" r="1.1"/><circle cx="9" cy="15" r="1.1"/><circle cx="15" cy="15" r="1.1"/>',
    funke: '<path d="M12 3.5c.8 3.9 2.6 5.7 6.5 6.5-3.9.8-5.7 2.6-6.5 6.5-.8-3.9-2.6-5.7-6.5-6.5 3.9-.8 5.7-2.6 6.5-6.5z"/>',
  };
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 24 24');
  s.setAttribute('width', groesse);
  s.setAttribute('height', groesse);
  s.setAttribute('fill', 'none');
  s.setAttribute('stroke', 'currentColor');
  s.setAttribute('stroke-width', '1.5');
  s.setAttribute('stroke-linecap', 'round');
  s.setAttribute('stroke-linejoin', 'round');
  s.innerHTML = wege[name] || wege.flamme;
  return s;
}

/* Intensität als Reihe glimmender Punkte — die App spricht in eigenen
   Zeichen, nicht in Emojis. */
function glutPunkte(n, max = 5) {
  const halter = el('span', {
    style: { display: 'inline-flex', gap: '3px', alignItems: 'center', verticalAlign: 'middle' },
  });
  for (let i = 0; i < Math.min(n || 0, max); i++) {
    halter.append(el('span', {
      style: {
        width: '5px', height: '5px', borderRadius: '50%',
        background: 'var(--glut-hell)', boxShadow: '0 0 5px var(--schein)',
      },
    }));
  }
  return halter;
}

/* --- Zeit ----------------------------------------------------------------- */

const jetzt = () => Date.now();

/* Ein Tagesstempel als 2026-08-29. Wird für die Tagesnachricht, das
   Glückskeks und die Wärmekarte gebraucht — überall dieselbe Regel. */
function tagstempel(zeit = Date.now()) {
  const d = new Date(zeit);
  const p = (n) => String(n).padStart(2, '0');
  return d.getFullYear() + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
}

function uhrzeit(zeit) {
  const d = new Date(zeit);
  return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
}

/* Aus 95 Sekunden wird 1:35 — für alle Countdowns. */
function dauerText(ms) {
  const s = Math.max(0, Math.round(ms / 1000));
  const std = Math.floor(s / 3600);
  const min = Math.floor((s % 3600) / 60);
  const sek = s % 60;
  const p = (n) => String(n).padStart(2, '0');
  return std > 0 ? std + ':' + p(min) + ':' + p(sek) : min + ':' + p(sek);
}

function vorZeit(zeit) {
  /* Ein fehlender Stempel darf nie „Invalid Date" auf den Schirm bringen. */
  if (!zeit || isNaN(zeit)) return 'gerade eben';
  const d = Math.max(0, Date.now() - zeit);
  if (d < 60e3) return 'gerade eben';
  if (d < 3600e3) return Math.floor(d / 60e3) + ' Min';
  if (d < 86400e3) return Math.floor(d / 3600e3) + ' Std';
  if (d < 7 * 86400e3) return Math.floor(d / 86400e3) + ' Tage';
  return new Date(zeit).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' });
}

/* --- Kleinkram ------------------------------------------------------------ */

/* Die Kennung trägt die Zeit voran — und zwar in fester Länge, denn die
   Reihenfolge in der Ablage entsteht allein durch das Sortieren der
   Kennungen. Dort liegt kein Datum, nach dem man sonst sortieren könnte.

   Der Zähler dahinter fängt den Fall ab, dass zwei Dinge in derselben
   Millisekunde entstehen: zwei schnell getippte Nachrichten, zweimal
   dieselbe Schnellreaktion. Ohne ihn entschiede der Zufall, welche zuerst
   steht — und der Plausch käme durcheinander. */

let _letzteKennungszeit = 0;
let _kennungszaehler = 0;

function kennung() {
  const t = Date.now();
  if (t === _letzteKennungszeit) {
    _kennungszaehler++;
  } else {
    _letzteKennungszeit = t;
    _kennungszaehler = 0;
  }
  return t.toString(36).padStart(9, '0') +
    _kennungszaehler.toString(36).padStart(3, '0') +
    Math.random().toString(36).slice(2, 7);
}

function entprellt(fn, ms = 300) {
  let t;
  return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}

const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];

/* Nutzerinhalte wandern grundsätzlich als Text in den Baum, nie als HTML.
   Wo doch einmal HTML nötig ist, geht es hier durch. */
const sicher = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

/* --- Meldungen ------------------------------------------------------------ */

function meldung(text, ms = 3200) {
  const m = el('div', { class: 'meldung' }, text);
  $('#meldungen').append(m);
  setTimeout(() => {
    m.classList.add('geht');
    setTimeout(() => m.remove(), 260);
  }, ms);
  return m;
}

function meldungMitTat(text, tatText, tat, ms = 8000) {
  const m = el('div', { class: 'meldung' },
    el('span', { style: { flex: '1' } }, text),
    el('button', {
      onclick: () => { m.remove(); tat(); },
    }, tatText)
  );
  $('#meldungen').append(m);
  setTimeout(() => {
    if (!m.isConnected) return;
    m.classList.add('geht');
    setTimeout(() => m.remove(), 260);
  }, ms);
  return m;
}

/* --- Blätter (Eingaben von unten) ----------------------------------------- */

/* Als erstes Kind übergeben, macht es ein Blatt unumgehbar: kein
   Wegtippen über den Hintergrund, kein Escape. Für die Momente der
   Einrichtung, in denen ein versehentliches Schließen teuer wäre. */
const BLATT_FEST = { __blattFest: true };

function blatt(...inhalt) {
  let fest = false;
  if (inhalt[0] && inhalt[0].__blattFest) { fest = true; inhalt.shift(); }

  const b = el('div', { class: 'blatt' }, el('div', { class: 'blattgriff' }), ...inhalt);
  const deckel = el('div', {
    class: 'deckel',
    onclick: (e) => { if (e.target === deckel && !fest) schliessen(); },
  }, b);

  function schliessen() {
    /* Das Blatt gleitet nach unten hinaus, der Deckel blendet aus —
       vorher verschwand beides nur über die Deckkraft, und das sah nach
       Abbruch aus, nicht nach Schließen. Doppelt schließen ist erlaubt
       und tut nichts. */
    if (deckel.classList.contains('geht')) return;
    deckel.classList.add('geht');
    b.classList.add('geht');
    setTimeout(() => deckel.remove(), 270);
    document.removeEventListener('keydown', beiTaste);
  }

  const beiTaste = (e) => {
    /* Wurde das Blatt anderweitig abgeräumt — etwa durch einen
       Seitenwechsel —, räumt sich auch der Horcher weg, statt für immer
       an der Tastatur zu hängen. */
    if (!deckel.isConnected) { document.removeEventListener('keydown', beiTaste); return; }
    if (e.key === 'Escape' && !fest) schliessen();
  };
  document.addEventListener('keydown', beiTaste);
  document.body.append(deckel);
  return { deckel, schliessen };
}

/* Eine Rückfrage, die eine Zusage erzwingt statt sie zu unterstellen. */
function frage(titel, text, jaText = 'Ja', warnend = false) {
  return new Promise((fertig) => {
    const b = blatt(
      el('h2', {}, titel),
      text ? el('p', { class: 'leise', style: { marginTop: '8px' } }, text) : null,
      el('div', { class: 'knopfreihe', style: { marginTop: '20px' } },
        el('button', { class: 'knopf leer', onclick: () => { b.schliessen(); fertig(false); } }, 'Abbrechen'),
        el('button', {
          class: 'knopf ' + (warnend ? 'warnend' : 'glut'),
          onclick: () => { b.schliessen(); fertig(true); },
        }, jaText)
      )
    );
  });
}

/* --- Vibration ------------------------------------------------------------ */

/* Muster statt Zufall: jede Art hat ihren eigenen Rhythmus, damit die
   Bedeutung schon in der Tasche ankommt, ohne hinzusehen. */
const PULS = {
  befehl: [140, 70, 140, 70, 300],
  bitte: [60, 40, 60],
  denkAnDich: [40, 60, 40],
  antwortJa: [90, 50, 180],
  antwortNein: [220],
  hinweis: [50],
};

function puls(art = 'hinweis') {
  try {
    if (navigator.vibrate) navigator.vibrate(PULS[art] || PULS.hinweis);
  } catch { /* manche Browser mögen das nicht — dann eben still */ }
}

/* --- Speicher auf dem Gerät ----------------------------------------------- */

/* Alles Örtliche gehört einem Raum. Das Vorzeichen ('r1.' usw.) setzt die
   Raumverwaltung beim Start — vor ihr ist es leer, was dem Zustand vor
   den Räumen entspricht und den Prüfstand unverändert lässt. */
let _raumVorzeichen = '';

function raumVorzeichenSetzen(v) { _raumVorzeichen = v || ''; }
const geraetKey = (s) => 'ember.' + _raumVorzeichen + s;

/* Alles, was nur dieses Gerät angeht: Rolle, PIN-Prüfsumme, Schlüssel.
   Wandert nie ins Netz — und bleibt im eigenen Raum. */
const Gerät = {
  lies(schluessel, ersatz = null) {
    try {
      const roh = localStorage.getItem(geraetKey(schluessel));
      return roh == null ? ersatz : JSON.parse(roh);
    } catch { return ersatz; }
  },
  schreib(schluessel, wert) {
    try { localStorage.setItem(geraetKey(schluessel), JSON.stringify(wert)); return true; }
    catch { return false; }
  },
  loesch(schluessel) {
    try { localStorage.removeItem(geraetKey(schluessel)); } catch {}
  },
  /* Leert den AKTIVEN Raum. Die Raumliste und andere Räume bleiben. */
  alleLoeschen() {
    try {
      const vorzeichen = geraetKey('');
      Object.keys(localStorage)
        .filter((k) => k.startsWith(vorzeichen) && !['ember.raeume', 'ember.aktiverRaum'].includes(k))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
  },
};

/* --- Das Fehlerprotokoll --------------------------------------------------- */

/* Auf dem Handy sieht niemand eine Konsole. Was schiefgeht, landet
   deshalb hier — die letzten fünfundzwanzig Fehler, nachlesbar unter
   Ich → Letzte Fehler. Ohne das bleibt jeder iPhone-Fehler ein Rätsel. */

function fehlerNotieren(text) {
  try {
    const liste = Gerät.lies('fehlerlog', []);
    liste.push({ wann: Date.now(), text: String(text).slice(0, 220) });
    Gerät.schreib('fehlerlog', liste.slice(-25));
  } catch {}
}

function fehlerWacheStarten() {
  window.addEventListener('error', (e) => {
    fehlerNotieren((e.message || 'Fehler') + ' @' + String(e.filename || '').split('/').pop() + ':' + (e.lineno || ''));
  });
  window.addEventListener('unhandledrejection', (e) => {
    fehlerNotieren('Unbehandelt: ' + String(e.reason && e.reason.message || e.reason).slice(0, 180));
  });
}

/* --- Der laufende Zustand ------------------------------------------------- */

/* D hält alles, was die Oberfläche gerade zeigt. Was hier steht, kommt
   entweder vom Gerät oder entschlüsselt aus der Ablage. */
const D = {
  rolle: null,          // 'domme' | 'sub'
  eingerichtet: false,
  offen: false,         // Schloss auf?
  seite: 'heim',
  paar: null,           // { id, namen: {domme, sub} }
  ampel: { domme: 'gruen', sub: 'gruen' },
  ruhe: false,          // nach Rot: alles hält an
  daten: {},            // was aus der Ablage kam, entschlüsselt
  horcher: {},          // laufende Verbindungen zur Ablage
};

const istDomme = () => D.rolle === 'domme';
const andereRolle = () => (D.rolle === 'domme' ? 'sub' : 'domme');

function nameVon(rolle) {
  return (D.paar && D.paar.namen && D.paar.namen[rolle]) || (rolle === 'domme' ? 'Sie' : 'Er');
}

/* --- Stimmung ------------------------------------------------------------- */

/* Spät am Abend wird die App von selbst leiser. Rot überschreibt alles. */
function stimmungSetzen(erzwungen) {
  let s = erzwungen;
  if (!s) {
    if (D.ruhe) s = 'ruhe';
    else {
      const std = new Date().getHours();
      const spaetAb = Gerät.lies('spaetAb', 22);
      s = (std >= spaetAb || std < 6) ? 'spaet' : 'nacht';
    }
  }
  document.documentElement.setAttribute('data-stimmung', s);
  const farbe = getComputedStyle(document.documentElement).getPropertyValue('--statusleiste').trim();
  const marke = document.querySelector('meta[name=theme-color]');
  if (marke && farbe) marke.setAttribute('content', farbe);
}

/* --- Aktualisierung der App ----------------------------------------------- */

/* Wortgleich zum Verfahren in VANI: Der Dienst trägt die Fassung im
   Lagernamen, ein neuer Dienst meldet sich selbst. Dieser Knopf ist nur
   für die Ungeduld da. */

let _dienst = null;

function _warteAufArbeiter(arbeiter, ms = 10000) {
  return new Promise((fertig) => {
    let durch = false;
    const ende = (w) => { if (!durch) { durch = true; fertig(w); } };
    if (arbeiter.state === 'installed' || arbeiter.state === 'activated') return ende(true);
    arbeiter.addEventListener('statechange', () => {
      if (arbeiter.state === 'installed' || arbeiter.state === 'activated') ende(true);
      if (arbeiter.state === 'redundant') ende(false);
    });
    setTimeout(() => ende(false), ms);
  });
}

async function sucheAppUpdate(neuLaden = true) {
  if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) {
    meldung('Hier läuft die Vorschau. Aktualisierungen kommen am Symbol auf dem Startbildschirm an.');
    return false;
  }
  try {
    const alterFuehrer = navigator.serviceWorker.controller;
    const fuehrerWechsel = new Promise((fertig) => {
      let durch = false;
      const ende = (w) => { if (!durch) { durch = true; fertig(w); } };
      navigator.serviceWorker.addEventListener('controllerchange', () => ende(true), { once: true });
      setTimeout(() => ende(false), 8000);
    });

    _dienst = _dienst || await navigator.serviceWorker.getRegistration();
    if (!_dienst) _dienst = await navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' });

    await _dienst.update();
    if (_dienst.installing) await _warteAufArbeiter(_dienst.installing);
    if (_dienst.waiting) _dienst.waiting.postMessage({ typ: 'AKTIVIEREN' });

    const gibtNeues = alterFuehrer !== navigator.serviceWorker.controller || _dienst.waiting || _dienst.installing;
    if (neuLaden && gibtNeues) {
      meldung('Neue Fassung wird geöffnet …');
      await fuehrerWechsel;
      location.reload();
      return true;
    }
    meldung('Du hast die aktuelle Fassung ' + APP_VERSION + '.');
    return true;
  } catch {
    meldung('Gerade konnte ich nicht nachsehen. Die jetzige Fassung läuft trotzdem.');
    return false;
  }
}

/* Beim Start: den Dienst anmelden und auf eine neue Fassung horchen. */
function dienstAnmelden() {
  if (!('serviceWorker' in navigator) || !location.protocol.startsWith('http')) return;
  try {
    let gemeldet = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (gemeldet) return;
      gemeldet = true;
      meldungMitTat('Die neue Fassung ist da.', 'Jetzt öffnen', () => location.reload(), 12000);
    });

    navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then((reg) => {
      _dienst = reg;
      const melden = () => meldungMitTat('Eine neue Fassung liegt bereit.', 'Neu laden', () => location.reload(), 8000);
      reg.addEventListener('updatefound', () => {
        const neu = reg.installing;
        if (!neu) return;
        neu.addEventListener('statechange', () => {
          if (neu.state === 'installed' && navigator.serviceWorker.controller) melden();
        });
      });
      if (reg.waiting) melden();
    }).catch(() => {});

    navigator.serviceWorker.addEventListener('message', (e) => {
      const n = e.data || {};
      if (n.typ === 'PUSH_ERNEUERN' && typeof pushAnmelden === 'function') pushAnmelden(true);
      if (n.typ === 'PUSH_GEOEFFNET' && typeof zeigeSeite === 'function' && D.offen) zeigeSeite('heim');
    });
  } catch { /* ohne Dienst läuft die App auch, nur ohne Offline */ }
}
