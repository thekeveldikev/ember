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

const TARN_NOTIZEN = [
  { titel: 'Einkauf', text: 'Milch, Kaffee, Zwiebeln, Spülmaschinentabs' },
  { titel: 'Anruf Werkstatt', text: 'wegen Termin nächste Woche' },
  { titel: 'Passwörter ändern', text: 'Router, Mailkonto' },
  { titel: 'Geburtstag Mama', text: 'Blumen bestellen, nicht vergessen' },
];

function tarnungAn() {
  if (_getarnt) return;
  _getarnt = true;

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

  const eigene = Gerät.lies('tarnNotizen', TARN_NOTIZEN);

  const kopf = el('h1', {
    style: { fontFamily: 'inherit', fontSize: '30px', fontWeight: '600', padding: '4px 0 16px' },
  }, 'Notizen');
  tippenDreimal(kopf, tarnungAus);

  const liste = el('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } });
  eigene.forEach((n) => {
    liste.append(el('div', {
      style: {
        padding: '14px 16px', borderRadius: '12px',
        background: '#ffffff', border: '1px solid #e5e5e5',
      },
    },
      el('div', { style: { fontWeight: '600', marginBottom: '3px' } }, n.titel),
      el('div', { style: { color: '#6b6b6b', fontSize: '14px' } }, n.text)
    ));
  });

  huelle.append(el('div', {
    style: {
      position: 'fixed', inset: '0', overflowY: 'auto', background: '#f7f7f7', color: '#1c1c1c',
      padding: 'calc(env(safe-area-inset-top) + 18px) 18px calc(env(safe-area-inset-bottom) + 30px)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif',
    },
  }, kopf, liste));
}

function tarnungAus() {
  if (!_getarnt) return;
  _getarnt = false;

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
    html[data-stimmung='tarnung'], html[data-stimmung='tarnung'] body { background: #f7f7f7 !important; }
    #meldungen { display: none !important; }
  `));
  const marke = document.querySelector('meta[name=theme-color]');
  if (marke) marke.setAttribute('content', '#f7f7f7');
}

/* --- Die Geste ------------------------------------------------------------ */

function tippenDreimal(knoten, tat, fenster = 900) {
  let zaehler = 0;
  let uhr = null;
  knoten.addEventListener('click', () => {
    zaehler++;
    clearTimeout(uhr);
    if (zaehler >= 3) { zaehler = 0; tat(); return; }
    uhr = setTimeout(() => { zaehler = 0; }, fenster);
  });
}

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
