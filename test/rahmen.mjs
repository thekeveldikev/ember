/* Ein Prüfstand für die Bereiche, die sonst nur im Browser laufen.

   Die App ist absichtlich ein gemeinsamer globaler Skriptraum ohne Module.
   Genau das macht sie hier prüfbar: Die Quelldateien werden in einen
   eigenen Kontext gelegt, ein paar Browser-Dinge werden nachgebaut — und
   danach lässt sich jede Funktion so aufrufen, wie sie auch im Browser
   aufgerufen wird. Kein Nachbau, kein zweiter Wahrheitsstand.            */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createContext, runInContext } from 'node:vm';

const wurzel = join(dirname(fileURLToPath(import.meta.url)), '..');

/* --- Eine Ablage, die nur im Arbeitsspeicher lebt ------------------------- */

/* Sie verhält sich wie die Echtzeit-Datenbank: Pfade, Teilbäume, PUT,
   PATCH, DELETE. Damit lassen sich auch Aussetzer nachstellen. */
export function baueAblage() {
  const inhalt = {};
  const ablage = {
    inhalt,
    aussetzen: false,
    schreibZaehler: 0,

    _zerlege(pfad) {
      return String(pfad).replace(/^\/+|\/+$/g, '').split('/').filter(Boolean);
    },
    lies(pfad) {
      let k = inhalt;
      for (const t of this._zerlege(pfad)) {
        if (k == null || typeof k !== 'object') return null;
        k = k[t];
      }
      return k === undefined ? null : k;
    },
    schreib(pfad, wert) {
      this.schreibZaehler++;
      const teile = this._zerlege(pfad);
      const letzt = teile.pop();
      let k = inhalt;
      for (const t of teile) k = (k[t] = k[t] || {});
      if (wert === null) delete k[letzt];
      else k[letzt] = wert;
    },
    loesch(pfad) { this.schreib(pfad, null); },
  };
  return ablage;
}

/* Werte aus dem Skriptraum tragen dessen eigene Urbilder — ein Array von
   dort ist kein Array von hier, und die strenge Prüfung stolpert darüber.
   Hier werden sie eingebürgert. */
export const rein = (wert) => JSON.parse(JSON.stringify(wert));

/* --- Den Skriptraum aufbauen ---------------------------------------------- */

export function ladeApp({ rolle = 'domme', dateien, ablage = baueAblage() } = {}) {
  const lager = new Map();

  const raum = {
    console,
    crypto,
    setTimeout, clearTimeout, clearInterval,
    /* Dauertakte der App (der Leitungs-Wachhund) dürfen den Testlauf
       nicht am Leben halten — sonst endet node --test nie. unref lässt
       Node trotz laufendem Takt beenden. */
    setInterval: (fn, ms) => { const t = setInterval(fn, ms); if (t.unref) t.unref(); return t; },
    TextEncoder, TextDecoder,
    btoa: (s) => Buffer.from(s, 'binary').toString('base64'),
    atob: (s) => Buffer.from(s, 'base64').toString('binary'),
    Date, Math, JSON, Promise, Error, Object, Array, String, Number, Boolean,
    Uint8Array, ArrayBuffer, DataView, Map, Set, AbortController,
    URL, isNaN, parseInt, parseFloat, encodeURIComponent, decodeURIComponent,
    escape: globalThis.escape, unescape: globalThis.unescape,

    APP_VERSION: 'prüfstand',

    localStorage: {
      getItem: (k) => (lager.has(k) ? lager.get(k) : null),
      setItem: (k, v) => lager.set(k, String(v)),
      removeItem: (k) => lager.delete(k),
      get length() { return lager.size; },
      key: (i) => [...lager.keys()][i],
    },

    navigator: { onLine: true, vibrate: () => true, userAgent: 'Prüfstand' },
    location: { protocol: 'https:', search: '', reload: () => {} },

    /* Die Oberfläche wird hier nicht gebraucht — was sie anfassen würde,
       ist harmlos abgefangen. */
    document: {
      querySelector: () => null,
      querySelectorAll: () => [],
      addEventListener: () => {},
      createElement: () => ({ style: {}, append: () => {}, addEventListener: () => {} }),
      documentElement: { setAttribute: () => {}, getAttribute: () => null, style: { setProperty: () => {} } },
      body: { append: () => {} },
      visibilityState: 'visible',
    },
    window: { addEventListener: () => {}, matchMedia: () => ({ matches: false }) },
    EventSource: class { constructor() { this.readyState = 0; } close() { this.readyState = 2; } addEventListener() {} },
    Notification: { permission: 'default' },
    SEITEN: {},
  };

  raum.globalThis = raum;
  raum.self = raum;
  createContext(raum);

  /* Alles, was ins Netz ginge, landet in der Ablage im Arbeitsspeicher. */
  raum.fetch = async (adresse, einst = {}) => {
    if (ablage.aussetzen) throw Object.assign(new Error('kein Netz'), { name: 'TypeError' });

    const u = new URL(adresse);
    const pfad = u.pathname.replace(/\.json$/, '');
    const art = (einst.method || 'GET').toUpperCase();
    const last = einst.body ? JSON.parse(einst.body) : undefined;

    if (art === 'GET') return antwort(ablage.lies(pfad));
    if (art === 'PUT') { ablage.schreib(pfad, last); return antwort(last); }
    if (art === 'PATCH') {
      const alt = ablage.lies(pfad) || {};
      ablage.schreib(pfad, { ...alt, ...last });
      return antwort(last);
    }
    if (art === 'DELETE') { ablage.loesch(pfad); return antwort(null); }
    return antwort(null);

    function antwort(wert) {
      return {
        ok: true, status: 200,
        json: async () => wert,
        text: async () => JSON.stringify(wert),
      };
    }
  };

  const reihe = dateien || [
    'src/20-core.js', 'src/21-krypto.js', 'src/22-firebase.js', 'src/24-daten.js',
  ];

  /* In einem Rutsch, nicht Datei für Datei: Die App ist ein einziger
     Skriptraum, und `const` bleibt darin lexikalisch — es wird nie zur
     Eigenschaft des globalen Objekts, im Browser so wenig wie hier.
     Genauso baut auch werkzeug/build-web.mjs. */
  const quelle = reihe
    .map((d) => readFileSync(join(wurzel, d), 'utf8'))
    .join('\n');

  /* Der Nachsatz reicht heraus, was die Prüfungen anfassen wollen. */
  const nachsatz = `
    globalThis.__raum = {
      D, Gerät, Ablage,
      el, kennung, tagstempel, jetzt, dauerText, vorZeit, sicher, zufall,
      verschluessle, entschluessle, schluesselLaden, schluesselVergessen,
      schluesselDa, paarKennung, roheZuB64, b64ZuRohe,
      schluesselEinschliessen, schluesselAufschliessen,
      kopplungscodeBauen, kopplungscodeLesen,
      ablageLies, ablageSchreib, ablageAendere, ablageLoesch, ablageAnhaengen,
      warteschlangeLeeren,
      datenSchreib, datenLies, datenLoesch, datenAnhaengen, datenListe,
      datenAendern, sammlungOeffnen,
      spiegelSetzen, spiegelHolen, spiegelLeeren,
      istDomme, andereRolle,
      ...(typeof normalform === 'function' ? { normalform, woerter, stamm, meinenDasselbe } : {}),
      ...(typeof serieAus === 'function' ? { serieAus } : {}),
      ...(typeof stufeAus === 'function' ? { stufeAus } : {}),
    };
  `;

  try {
    runInContext(quelle + nachsatz, raum, { filename: 'ember' });
  } catch (f) {
    throw new Error('Die App ließ sich nicht laden: ' + f.message);
  }

  /* Was der Nachsatz herausgereicht hat, wandert nach oben, damit die
     Prüfungen es wie gewohnt über `raum.…` erreichen. */
  Object.assign(raum, raum.__raum);

  raum.D.rolle = rolle;
  return { raum, ablage };
}

/* Bringt die Ablage in einen Zustand, in dem geschrieben werden darf. */
export async function anmelden(raum, roheBytes) {
  const roh = roheBytes || raum.crypto.getRandomValues(new Uint8Array(32));
  await raum.schluesselLaden(roh);
  raum.Ablage.zugang = { projekt: 'p', schluessel: 'k', datenbank: 'https://prüfstand.test' };
  raum.Ablage.paarId = 'paar1';
  raum.Ablage.ich = 'geraet1';
  raum.Ablage._marke = 'marke';
  raum.Ablage._marke_bis = Date.now() + 9e6;
  raum.Ablage.bereit = true;
  return roh;
}
