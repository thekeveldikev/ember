/* ==========================================================================
   16-toene.js — Töne.

   Kein einziges Audio-File: alles wird im Moment des Abspielens aus
   Oszillatoren und Rauschen gebaut. Das hält die App klein und die Töne
   überall gleich. Sie sind bewusst leise und kurz — ein Hauch, kein
   Jingle. Alles läuft durch einen gemeinsamen Begrenzer, damit auch
   drei Töne übereinander nie ins Kratzen kommen.

   Unter Ich → Die App lassen sie sich abschalten (nur dieses Gerät).
   ========================================================================== */

let _klangRaum = null;
let _klangSumme = null;   // Master mit sanftem Begrenzer

function _klang() {
  if (!_klangRaum) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _klangRaum = new AC();
    const presser = _klangRaum.createDynamicsCompressor();
    presser.threshold.value = -18;
    presser.knee.value = 24;
    presser.ratio.value = 6;
    presser.attack.value = 0.002;
    presser.release.value = 0.18;
    _klangSumme = _klangRaum.createGain();
    _klangSumme.gain.value = 0.9;
    _klangSumme.connect(presser).connect(_klangRaum.destination);

    /* Ein Hauch Raum: dieselbe Summe läuft zusätzlich durch eine kurze
       Echoschleife (160 ms, gedämpft, leise beigemischt). Dadurch klingen
       die Töne nach einem Zimmer statt nach einem Piezo-Piepser. */
    try {
      const echo = _klangRaum.createDelay(0.5);
      echo.delayTime.value = 0.16;
      const rueck = _klangRaum.createGain();
      rueck.gain.value = 0.32;
      const daempfer = _klangRaum.createBiquadFilter();
      daempfer.type = 'lowpass';
      daempfer.frequency.value = 2400;
      const nass = _klangRaum.createGain();
      nass.gain.value = 0.13;
      _klangSumme.connect(echo);
      echo.connect(daempfer).connect(rueck).connect(echo);
      daempfer.connect(nass).connect(presser);
    } catch { /* dann eben trocken */ }
  }
  /* iOS legt den Klangraum schlafen, bis eine Geste ihn weckt. */
  if (_klangRaum.state === 'suspended') _klangRaum.resume().catch(() => {});
  return _klangRaum;
}

/* Drei Stellungen statt eines Schalters: an, leise, aus. Und nachts —
   wenn die App ohnehin dunkler wird — nimmt sie sich auch im Klang
   zurück. */
function tonPegel() {
  const p = Gerät.lies('tonPegel', null);
  if (p !== null) return p;
  return Gerät.lies('toene', true) ? 1 : 0;   // Altbestand übernehmen
}

function toeneAn() { return tonPegel() > 0; }

function _pegelJetzt() {
  const spaet = document.documentElement.getAttribute('data-stimmung') === 'spaet';
  return 0.9 * tonPegel() * (spaet ? 0.6 : 1);
}

/* iOS gibt WebAudio erst nach einer Berührung frei — der allererste
   Tipp in der App entsperrt den Klangraum, damit schon der erste Keks
   knackt und nicht erst der zweite. (Steht der Klingelschalter des
   iPhones auf lautlos, bleibt Web-Audio dort trotzdem stumm — das ist
   Apples Regel, keine Einstellung der App.) */
document.addEventListener('pointerdown', () => {
  try { if (toeneAn()) _klang(); } catch { /* still */ }
}, { once: true, capture: true });

/* Ein Rauschpuffer, einmal gebaut und wiederverwendet. */
let _rauschPuffer = null;
function _rauschQuelle(raum, schleife = false) {
  if (!_rauschPuffer || _rauschPuffer.sampleRate !== raum.sampleRate) {
    const rate = raum.sampleRate;
    _rauschPuffer = raum.createBuffer(1, rate, rate);
    const daten = _rauschPuffer.getChannelData(0);
    for (let i = 0; i < daten.length; i++) daten[i] = Math.random() * 2 - 1;
  }
  const quelle = raum.createBufferSource();
  quelle.buffer = _rauschPuffer;
  quelle.loop = schleife;
  return quelle;
}

function tonSpielen(art) {
  if (!toeneAn()) return;
  /* Nach Rot ist Ruhe — dann schweigt auch die App. Und eine getarnte
     Notizliste hat erst recht keinen Klang. */
  if (typeof D !== 'undefined' && D.ruhe) return;
  if (typeof istGetarnt === 'function' && istGetarnt()) return;
  const raum = _klang();
  if (!raum) return;
  const t = raum.currentTime;
  try { _klangSumme.gain.setTargetAtTime(_pegelJetzt(), t, 0.02); } catch { /* egal */ }

  try {
    if (art === 'gong') {
      /* Ein kleiner Bronzeschlag: Grundton mit zwei Teiltönen, die
         unterschiedlich schnell verklingen. Für Regie-Wechsel und
         Timer-Enden — hörbar, aber nie schrill. */
      [[392, 0.16, 1.4], [392 * 2.02, 0.07, 0.9], [392 * 2.94, 0.04, 0.55]].forEach(([freq, staerke, dauer]) => {
        const o = raum.createOscillator();
        o.type = 'sine';
        o.frequency.value = freq;
        const laut = raum.createGain();
        laut.gain.setValueAtTime(0.0001, t);
        laut.gain.exponentialRampToValueAtTime(staerke, t + 0.015);
        laut.gain.exponentialRampToValueAtTime(0.001, t + dauer);
        o.connect(laut).connect(_klangSumme);
        o.start(t); o.stop(t + dauer + 0.05);
      });
    } else if (art === 'knack') {
      /* Ein dunkler Körper unter zwei harten Brüchen — mehr Keks, weniger Klick. */
      const o = raum.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(120, t);
      o.frequency.exponentialRampToValueAtTime(55, t + 0.12);
      const tiefLaut = raum.createGain();
      tiefLaut.gain.setValueAtTime(0.28, t);
      tiefLaut.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      o.connect(tiefLaut).connect(_klangSumme);
      o.start(t); o.stop(t + 0.16);

      [0, 0.07].forEach((versatz, i) => {
        const r = _rauschQuelle(raum);
        const filter = raum.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = i ? 1700 : 2700;
        filter.Q.value = 0.8;
        const laut = raum.createGain();
        laut.gain.setValueAtTime(0.55, t + versatz);
        laut.gain.exponentialRampToValueAtTime(0.001, t + versatz + 0.055);
        r.connect(filter).connect(laut).connect(_klangSumme);
        r.start(t + versatz); r.stop(t + versatz + 0.07);
      });
    } else if (art === 'papier') {
      /* Zweistufiges Rascheln: erst greifen, dann entfalten. */
      [[0, 0.12, 1400, 3200, 0.1], [0.1, 0.3, 1800, 5200, 0.13]].forEach(([ab, dauer, von, bis, staerke]) => {
        const r = _rauschQuelle(raum);
        const filter = raum.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(von, t + ab);
        filter.frequency.exponentialRampToValueAtTime(bis, t + ab + dauer);
        const laut = raum.createGain();
        laut.gain.setValueAtTime(0.0001, t + ab);
        laut.gain.exponentialRampToValueAtTime(staerke, t + ab + dauer * 0.3);
        laut.gain.exponentialRampToValueAtTime(0.001, t + ab + dauer);
        r.connect(filter).connect(laut).connect(_klangSumme);
        r.start(t + ab); r.stop(t + ab + dauer + 0.02);
      });
    } else if (art === 'weich') {
      /* Ein warmer Dreiklang mit Obertonhauch — Ankommen, Gelingen. */
      [523.25, 659.25, 784].forEach((freq, i) => {
        const o = raum.createOscillator();
        o.type = 'sine';
        o.frequency.value = freq;
        const laut = raum.createGain();
        const start = t + i * 0.07;
        laut.gain.setValueAtTime(0.0001, start);
        laut.gain.exponentialRampToValueAtTime(0.085, start + 0.02);
        laut.gain.exponentialRampToValueAtTime(0.001, start + 0.85);
        o.connect(laut).connect(_klangSumme);
        o.start(start); o.stop(start + 0.9);
      });
    } else if (art === 'schimmer') {
      /* Aufsteigendes Glitzern — für Jackpots und große Momente. */
      [660, 880, 1174.66, 1567.98, 2093].forEach((freq, i) => {
        const o = raum.createOscillator();
        o.type = 'triangle';
        o.frequency.value = freq;
        const laut = raum.createGain();
        const start = t + i * 0.06;
        laut.gain.setValueAtTime(0.0001, start);
        laut.gain.exponentialRampToValueAtTime(0.07, start + 0.015);
        laut.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
        o.connect(laut).connect(_klangSumme);
        o.start(start); o.stop(start + 0.55);
      });
    } else if (art === 'tief') {
      const o = raum.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(220, t);
      o.frequency.exponentialRampToValueAtTime(70, t + 0.4);
      const laut = raum.createGain();
      laut.gain.setValueAtTime(0.0001, t);
      laut.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
      laut.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      o.connect(laut).connect(_klangSumme);
      o.start(t); o.stop(t + 0.5);
    } else if (art === 'tick') {
      const o = raum.createOscillator();
      o.type = 'triangle';
      o.frequency.value = 2100;
      const laut = raum.createGain();
      laut.gain.setValueAtTime(0.06, t);
      laut.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      o.connect(laut).connect(_klangSumme);
      o.start(t); o.stop(t + 0.06);
    } else if (art === 'plopp' || art === 'ploppRein') {
      /* Ein weicher Tropfen: abwärts heißt gesendet, aufwärts heißt
         angekommen — nach zwei Tagen unterscheidet das Ohr von selbst. */
      const rein = art === 'ploppRein';
      const o = raum.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(rein ? 310 : 640, t);
      o.frequency.exponentialRampToValueAtTime(rein ? 640 : 310, t + 0.09);
      const laut = raum.createGain();
      laut.gain.setValueAtTime(0.0001, t);
      laut.gain.exponentialRampToValueAtTime(0.11, t + 0.012);
      laut.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
      o.connect(laut).connect(_klangSumme);
      o.start(t); o.stop(t + 0.16);
    } else if (art === 'wusch') {
      /* Ein Blatt gleitet herauf: kaum mehr als ein Luftzug. */
      const r = _rauschQuelle(raum);
      const filter = raum.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(700, t);
      filter.frequency.exponentialRampToValueAtTime(2100, t + 0.16);
      filter.Q.value = 0.7;
      const laut = raum.createGain();
      laut.gain.setValueAtTime(0.0001, t);
      laut.gain.exponentialRampToValueAtTime(0.05, t + 0.05);
      laut.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      r.connect(filter).connect(laut).connect(_klangSumme);
      r.start(t); r.stop(t + 0.22);
    } else if (art === 'ratsche') {
      /* Der Zeiger schnappt über einen Stift — hölzern, mit leichtem
         Zufall in der Höhe, damit zwanzig davon lebendig klingen. */
      const o = raum.createOscillator();
      o.type = 'square';
      o.frequency.value = 480 + Math.random() * 160;
      const filter = raum.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 2400;
      const laut = raum.createGain();
      laut.gain.setValueAtTime(0.055, t);
      laut.gain.exponentialRampToValueAtTime(0.001, t + 0.035);
      o.connect(filter).connect(laut).connect(_klangSumme);
      o.start(t); o.stop(t + 0.04);
    }
  } catch { /* Ein stummer Ton ist kein Fehler. */ }
}

/* --- Die Kratz-Spur --------------------------------------------------------
   Für die Rubbellose: ein durchgehendes, gefiltertes Rauschen, dessen
   Lautstärke am Finger hängt. Bewegt er sich, raschelt es; hält er an,
   verstummt es — wie echtes Kratzen auf Metallfarbe. */

let _kratzen = null;

function kratzenStart() {
  if (!toeneAn()) return;
  const raum = _klang();
  if (!raum || _kratzen) return;
  try {
    const quelle = _rauschQuelle(raum, true);
    const filter = raum.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3400;
    filter.Q.value = 0.6;
    const laut = raum.createGain();
    laut.gain.value = 0.0001;
    quelle.connect(filter).connect(laut).connect(_klangSumme);
    quelle.start();
    _kratzen = { quelle, laut, filter };
  } catch { _kratzen = null; }
}

function kratzenPegel(staerke) {
  if (!_kratzen) return;
  try {
    const raum = _klangRaum;
    const ziel = Math.min(0.16, Math.max(0.0001, staerke));
    _kratzen.laut.gain.setTargetAtTime(ziel, raum.currentTime, 0.03);
    _kratzen.filter.frequency.setTargetAtTime(2600 + Math.random() * 1800, raum.currentTime, 0.05);
  } catch { /* still */ }
}

function kratzenStopp() {
  if (!_kratzen) return;
  try {
    const raum = _klangRaum;
    _kratzen.laut.gain.setTargetAtTime(0.0001, raum.currentTime, 0.05);
    const alt = _kratzen;
    setTimeout(() => { try { alt.quelle.stop(); } catch {} }, 300);
  } catch { /* still */ }
  _kratzen = null;
}
