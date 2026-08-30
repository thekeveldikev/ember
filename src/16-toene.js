/* ==========================================================================
   16-toene.js — Töne.

   Kein einziges Audio-File: alles wird im Moment des Abspielens aus
   Oszillatoren und Rauschen gebaut. Das hält die App klein und die Töne
   überall gleich. Sie sind bewusst leise und kurz — ein Hauch, kein Jingle.

   Unter Ich → Die App lassen sie sich abschalten (nur dieses Gerät).
   ========================================================================== */

let _klangRaum = null;

function _klang() {
  if (!_klangRaum) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    _klangRaum = new AC();
  }
  /* iOS legt den Klangraum schlafen, bis eine Geste ihn weckt. */
  if (_klangRaum.state === 'suspended') _klangRaum.resume().catch(() => {});
  return _klangRaum;
}

function toeneAn() { return Gerät.lies('toene', true); }

/* Ein kurzer Rauschstoß — Grundlage für Knacken und Papier. */
function _rauschen(raum, dauer) {
  const rate = raum.sampleRate;
  const puffer = raum.createBuffer(1, Math.ceil(rate * dauer), rate);
  const daten = puffer.getChannelData(0);
  for (let i = 0; i < daten.length; i++) daten[i] = Math.random() * 2 - 1;
  const quelle = raum.createBufferSource();
  quelle.buffer = puffer;
  return quelle;
}

function tonSpielen(art) {
  if (!toeneAn()) return;
  const raum = _klang();
  if (!raum) return;
  const t = raum.currentTime;

  try {
    if (art === 'knack') {
      /* Zwei harte, kurze Brüche kurz nacheinander — wie ein Keks. */
      [0, 0.07].forEach((versatz, i) => {
        const r = _rauschen(raum, 0.05);
        const filter = raum.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = i ? 1800 : 2600;
        filter.Q.value = 0.9;
        const laut = raum.createGain();
        laut.gain.setValueAtTime(0.5, t + versatz);
        laut.gain.exponentialRampToValueAtTime(0.001, t + versatz + 0.05);
        r.connect(filter).connect(laut).connect(raum.destination);
        r.start(t + versatz);
      });
    } else if (art === 'papier') {
      /* Ein weiches Rascheln, das sich öffnet. */
      const r = _rauschen(raum, 0.35);
      const filter = raum.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, t);
      filter.frequency.exponentialRampToValueAtTime(4200, t + 0.3);
      const laut = raum.createGain();
      laut.gain.setValueAtTime(0.0001, t);
      laut.gain.exponentialRampToValueAtTime(0.12, t + 0.09);
      laut.gain.exponentialRampToValueAtTime(0.001, t + 0.34);
      r.connect(filter).connect(laut).connect(raum.destination);
      r.start(t);
    } else if (art === 'weich') {
      /* Ein warmer Zweiklang — Ankommen, Gelingen. */
      [523.25, 784].forEach((freq, i) => {
        const o = raum.createOscillator();
        o.type = 'sine';
        o.frequency.value = freq;
        const laut = raum.createGain();
        const start = t + i * 0.09;
        laut.gain.setValueAtTime(0.0001, start);
        laut.gain.exponentialRampToValueAtTime(0.09, start + 0.02);
        laut.gain.exponentialRampToValueAtTime(0.001, start + 0.7);
        o.connect(laut).connect(raum.destination);
        o.start(start);
        o.stop(start + 0.75);
      });
    } else if (art === 'tief') {
      /* Ein dunkler Puls — für den Moment, in dem der Knopf durchgeht. */
      const o = raum.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(220, t);
      o.frequency.exponentialRampToValueAtTime(70, t + 0.4);
      const laut = raum.createGain();
      laut.gain.setValueAtTime(0.0001, t);
      laut.gain.exponentialRampToValueAtTime(0.22, t + 0.02);
      laut.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      o.connect(laut).connect(raum.destination);
      o.start(t);
      o.stop(t + 0.5);
    } else if (art === 'tick') {
      /* Ein einzelner heller Tick — das Rad, ein Zähler. */
      const o = raum.createOscillator();
      o.type = 'triangle';
      o.frequency.value = 2100;
      const laut = raum.createGain();
      laut.gain.setValueAtTime(0.06, t);
      laut.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      o.connect(laut).connect(raum.destination);
      o.start(t);
      o.stop(t + 0.06);
    }
  } catch { /* Ein stummer Ton ist kein Fehler. */ }
}
