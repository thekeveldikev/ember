/* ==========================================================================
   21-krypto.js — Alles Persönliche wird auf dem Gerät verschlüsselt.
   In der Ablage liegen nur unlesbare Brocken. Wer sie stiehlt, hat nichts.

   Der Hauptschlüssel entsteht einmal beim Einrichten und verlässt das Gerät
   nur über den Kopplungscode, den ihr euch von Hand gebt.
   ========================================================================== */

const KRYPTO = crypto.subtle;

/* --- Umwandlungen --------------------------------------------------------- */

const roheZuB64 = (puffer) => {
  const b = new Uint8Array(puffer);
  let s = '';
  for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode(...b.subarray(i, i + 0x8000));
  return btoa(s);
};

const b64ZuRohe = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

const textZuRohe = (s) => new TextEncoder().encode(s);
const roheZuText = (p) => new TextDecoder().decode(p);

/* Für den Kopplungscode: sicher durch Adresszeilen und Nachrichten. */
const b64Url = (s) => s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const ausB64Url = (s) => {
  const g = s.replace(/-/g, '+').replace(/_/g, '/');
  return g + '='.repeat((4 - g.length % 4) % 4);
};

/* --- Der Hauptschlüssel --------------------------------------------------- */

let _schluessel = null;   // CryptoKey, nur im Arbeitsspeicher
let _schluesselRoh = null; // die Rohbytes, für den Kopplungscode

async function schluesselErzeugen() {
  const roh = crypto.getRandomValues(new Uint8Array(32));
  return roh;
}

async function schluesselLaden(roheBytes) {
  _schluesselRoh = new Uint8Array(roheBytes);
  _schluessel = await KRYPTO.importKey('raw', _schluesselRoh, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);
  return _schluessel;
}

function schluesselVergessen() {
  /* Was mit dem alten Schlüssel gelesen wurde, darf den nächsten nicht
     überleben. */
  if (typeof _klarLager !== 'undefined') _klarLager.clear();
  _schluessel = null;
  if (_schluesselRoh) _schluesselRoh.fill(0);
  _schluesselRoh = null;
}

const schluesselDa = () => _schluessel != null;

/* Die Kennung des Paares wird aus dem Schlüssel abgeleitet, nicht gewürfelt.
   Dadurch findet das zweite Gerät denselben Ort in der Ablage, ohne dass
   die Kennung getrennt übertragen werden müsste. Sie verrät nichts über
   den Schlüssel: eine Streuung ist keine Umkehrung. */
async function paarKennung(roheBytes) {
  const streu = await KRYPTO.digest('SHA-256', textZuRohe('ember-paar/' + roheZuB64(roheBytes)));
  return [...new Uint8Array(streu).slice(0, 16)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* --- Verschlüsseln und Entschlüsseln -------------------------------------- */

/* Jeder Brocken bekommt einen eigenen, frischen Zufallsvorsatz. Derselbe
   Vorsatz zweimal würde AES-GCM aufbrechen — deshalb nie wiederverwenden. */
async function verschluessle(wert) {
  if (!_schluessel) throw new Error('kein Schlüssel');
  const vorsatz = crypto.getRandomValues(new Uint8Array(12));
  const klar = textZuRohe(JSON.stringify(wert));
  const geheim = await KRYPTO.encrypt({ name: 'AES-GCM', iv: vorsatz }, _schluessel, klar);
  const zusammen = new Uint8Array(12 + geheim.byteLength);
  zusammen.set(vorsatz, 0);
  zusammen.set(new Uint8Array(geheim), 12);
  return roheZuB64(zusammen);
}

async function entschluessle(brocken) {
  if (!_schluessel || !brocken) return null;
  try {
    const roh = b64ZuRohe(brocken);
    const vorsatz = roh.slice(0, 12);
    const geheim = roh.slice(12);
    const klar = await KRYPTO.decrypt({ name: 'AES-GCM', iv: vorsatz }, _schluessel, geheim);
    return JSON.parse(roheZuText(klar));
  } catch {
    /* Falscher Schlüssel oder beschädigt. Beides heißt: nicht lesbar. */
    return null;
  }
}

/* --- Die PIN -------------------------------------------------------------- */

/* Die PIN ersetzt den Schlüssel nicht, sie schließt ihn ein. Ohne PIN liegt
   nur ein verschlossener Schlüssel auf dem Gerät — ein gestohlenes Handy
   gibt nichts her. Vier Ziffern sind wenig, deshalb viele Runden. */

const PIN_RUNDEN = 260000;

async function ausPin(pin, salz) {
  const grund = await KRYPTO.importKey('raw', textZuRohe(String(pin)), 'PBKDF2', false, ['deriveKey']);
  return KRYPTO.deriveKey(
    { name: 'PBKDF2', salt: salz, iterations: PIN_RUNDEN, hash: 'SHA-256' },
    grund,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function schluesselEinschliessen(roheBytes, pin) {
  const salz = crypto.getRandomValues(new Uint8Array(16));
  const vorsatz = crypto.getRandomValues(new Uint8Array(12));
  const huelle = await ausPin(pin, salz);
  const geheim = await KRYPTO.encrypt({ name: 'AES-GCM', iv: vorsatz }, huelle, roheBytes);
  return { salz: roheZuB64(salz), vorsatz: roheZuB64(vorsatz), gut: roheZuB64(geheim) };
}

async function schluesselAufschliessen(schrank, pin) {
  try {
    const huelle = await ausPin(pin, b64ZuRohe(schrank.salz));
    const roh = await KRYPTO.decrypt(
      { name: 'AES-GCM', iv: b64ZuRohe(schrank.vorsatz) },
      huelle,
      b64ZuRohe(schrank.gut)
    );
    return new Uint8Array(roh);
  } catch {
    return null; /* falsche PIN */
  }
}

/* --- Das Startpaket -------------------------------------------------------- */

/* Ein Startpaket trägt die technischen Angaben der Einrichtung — Ablage
   und Bote —, aber KEINEN Schlüssel und keine Namen. Es macht aus acht
   Feldern zwei: Wer einrichtet, fügt das Paket ein und tippt nur noch die
   Namen. Es darf deshalb auch bequemer reisen als ein Kopplungscode. */

function startpaketLesen(code) {
  try {
    const putz = String(code).trim().replace(/\s+/g, '');
    if (!putz.startsWith('EMBERSTART.')) return null;
    const inhalt = JSON.parse(decodeURIComponent(escape(atob(ausB64Url(putz.slice(11))))));
    if (!inhalt.a || !inhalt.a.projekt || !inhalt.a.schluessel || !inhalt.a.datenbank) return null;
    return { zugang: inhalt.a, bote: inhalt.b || null };
  } catch {
    return null;
  }
}

/* --- Der Kopplungscode ---------------------------------------------------- */

/* Er trägt alles, was das zweite Gerät braucht: den Schlüssel, die Namen und
   die Zugangsdaten der Ablage. Damit steht nichts davon im öffentlichen
   Quelltext — wer das Repository liest, findet keinen Weg zu euch.

   Der Code ist der Hausschlüssel. Nur von Hand aufs eigene Gerät. */

async function kopplungscodeBauen(roheBytes, ablage, namen) {
  const inhalt = {
    f: 1,
    s: roheZuB64(roheBytes),
    a: ablage,
    n: namen,
  };
  return 'EMBER1.' + b64Url(btoa(unescape(encodeURIComponent(JSON.stringify(inhalt)))));
}

function kopplungscodeLesen(code) {
  try {
    const putz = String(code).trim().replace(/\s+/g, '');
    if (!putz.startsWith('EMBER1.')) return null;
    const inhalt = JSON.parse(decodeURIComponent(escape(atob(ausB64Url(putz.slice(7))))));
    if (!inhalt.s || !inhalt.a || !inhalt.a.projekt) return null;
    return { roh: b64ZuRohe(inhalt.s), ablage: inhalt.a, namen: inhalt.n || {} };
  } catch {
    return null;
  }
}
