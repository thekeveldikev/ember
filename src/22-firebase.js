/* ==========================================================================
   22-firebase.js — Die Ablage.

   Bewusst ohne Firebase-SDK: die Echtzeit-Datenbank hat eine schlichte
   REST-Schnittstelle, und für das Zuhören genügt EventSource. Das spart
   ein halbes Megabyte fremden Code und passt zur Bauart der App.

   Diese Schicht kennt keine Bedeutungen. Sie befördert nur Brocken. Was
   verschlüsselt wird und was nicht, entscheidet 24-daten.js.
   ========================================================================== */

const Ablage = {
  bereit: false,
  zugang: null,       // { projekt, schluessel, datenbank }
  paarId: null,
  ich: null,          // die anonyme Kennung dieses Geräts
  _marke: null,       // gültiger Ausweis
  _marke_bis: 0,
  _erneuerung: null,
  _horcher: new Map(),
  _warteschlange: [],
  _netz: navigator.onLine,
};

/* --- Netzanfragen mit Geduldsgrenze --------------------------------------- */

/* Ein hängender Anruf ist schlimmer als ein abgelehnter: Ohne Grenze
   wartet die App unbegrenzt auf eine Antwort, die nie kommt — im Zug,
   im Keller, bei einem stummen Zugangspunkt. */
function hole(adresse, einstellungen = {}, ms = 12000) {
  const abbruch = new AbortController();
  const uhr = setTimeout(() => abbruch.abort(), ms);
  return fetch(adresse, { ...einstellungen, signal: abbruch.signal })
    .finally(() => clearTimeout(uhr));
}

/* --- Anmelden ------------------------------------------------------------- */

/* Anonyme Anmeldung: Firebase vergibt eine Kennung ohne Mailadresse und ohne
   Passwort. Sie dient allein dazu, dass die Regeln in der Ablage jemanden
   erkennen können — sie sagt nichts darüber, wer ihr seid. */

async function ablageAnmelden(zugang, paarId) {
  Ablage.zugang = zugang;
  Ablage.paarId = paarId;

  const alt = Gerät.lies('ablageMarke');
  if (alt && alt.erneuerung && alt.projekt === zugang.projekt) {
    Ablage.ich = alt.ich;
    const ok = await _markeErneuern(alt.erneuerung);
    if (ok) { Ablage.bereit = true; return true; }
  }

  const antwort = await hole(
    'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + encodeURIComponent(zugang.schluessel),
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ returnSecureToken: true }),
    }
  );
  if (!antwort.ok) {
    const fehler = await antwort.text().catch(() => '');
    throw new Error('Anmeldung abgelehnt: ' + fehler.slice(0, 200));
  }
  const d = await antwort.json();
  Ablage.ich = d.localId;
  Ablage._marke = d.idToken;
  Ablage._marke_bis = Date.now() + (Number(d.expiresIn || 3600) - 300) * 1000;
  Gerät.schreib('ablageMarke', { ich: d.localId, erneuerung: d.refreshToken, projekt: zugang.projekt });
  Ablage.bereit = true;
  return true;
}

async function _markeErneuern(erneuerung) {
  try {
    const antwort = await hole(
      'https://securetoken.googleapis.com/v1/token?key=' + encodeURIComponent(Ablage.zugang.schluessel),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'grant_type=refresh_token&refresh_token=' + encodeURIComponent(erneuerung),
      }
    );
    if (!antwort.ok) return false;
    const d = await antwort.json();
    Ablage._marke = d.id_token || d.access_token;
    Ablage._marke_bis = Date.now() + (Number(d.expires_in || 3600) - 300) * 1000;
    Ablage.ich = d.user_id || Ablage.ich;
    Gerät.schreib('ablageMarke', {
      ich: Ablage.ich,
      erneuerung: d.refresh_token || erneuerung,
      projekt: Ablage.zugang.projekt,
    });
    return true;
  } catch { return false; }
}

/* Ein gültiger Ausweis, notfalls frisch geholt. Mehrere gleichzeitige
   Anfragen teilen sich dieselbe Erneuerung, statt sie zu vervielfachen. */
async function _marke() {
  if (Ablage._marke && Date.now() < Ablage._marke_bis) return Ablage._marke;
  if (!Ablage._erneuerung) {
    const gespeichert = Gerät.lies('ablageMarke');
    Ablage._erneuerung = _markeErneuern(gespeichert && gespeichert.erneuerung)
      .then((ok) => {
        Ablage._erneuerung = null;
        /* Ein erneuerter Ausweis heißt: die offenen Leitungen sind tot. */
        if (ok) _horcherNeuAufbauen();
        return ok;
      });
  }
  await Ablage._erneuerung;
  return Ablage._marke;
}

/* --- Wege ----------------------------------------------------------------- */

function _adresse(pfad) {
  const wurzel = Ablage.zugang.datenbank.replace(/\/+$/, '');
  const sauber = String(pfad).replace(/^\/+/, '');
  /* Ein leerer Pfad meint den ganzen Bereich des Paares. Ohne diese
     Weiche entstünde '…/.json' mit leerem Kindnamen — den lehnt die
     Ablage ab. Gebraucht wird das nur von „Alles auf Anfang". */
  if (!sauber) return wurzel + '/paare/' + Ablage.paarId + '.json';
  return wurzel + '/paare/' + Ablage.paarId + '/' + sauber + '.json';
}

/* --- Lesen und Schreiben -------------------------------------------------- */

async function ablageLies(pfad) {
  const marke = await _marke();
  const antwort = await hole(_adresse(pfad) + '?auth=' + marke);
  if (!antwort.ok) throw new Error('Lesen fehlgeschlagen (' + antwort.status + ')');
  return antwort.json();
}

async function _senden(pfad, art, wert) {
  const marke = await _marke();
  const antwort = await hole(_adresse(pfad) + '?auth=' + marke, {
    method: art,
    headers: { 'Content-Type': 'application/json' },
    body: wert === undefined ? undefined : JSON.stringify(wert),
  });
  if (!antwort.ok) {
    const text = await antwort.text().catch(() => '');
    throw new Error('Schreiben abgelehnt (' + antwort.status + ') ' + text.slice(0, 160));
  }
  return antwort.status === 204 ? null : antwort.json().catch(() => null);
}

/* Ein abgelaufener Anruf zählt wie kein Netz: Der Browser meldet oft noch
   "online", während in Wahrheit nichts durchgeht. */
function _nurNetzfehler(f) {
  return !navigator.onLine || (f && (f.name === 'AbortError' || f.name === 'TypeError'));
}

/* Ohne Netz geht nichts verloren: der Auftrag wartet und geht später raus.
   Die Reihenfolge bleibt dabei erhalten. */
function _merken(pfad, art, wert) {
  Ablage._warteschlange.push({ pfad, art, wert, wann: Date.now() });
  Gerät.schreib('warteschlange', Ablage._warteschlange.slice(-200));
}

async function ablageSchreib(pfad, wert) {
  try { return await _senden(pfad, 'PUT', wert); }
  catch (f) { if (_nurNetzfehler(f)) { _merken(pfad, 'PUT', wert); return null; } throw f; }
}

async function ablageAendere(pfad, teile) {
  try { return await _senden(pfad, 'PATCH', teile); }
  catch (f) { if (_nurNetzfehler(f)) { _merken(pfad, 'PATCH', teile); return null; } throw f; }
}

async function ablageLoesch(pfad) {
  try { return await _senden(pfad, 'DELETE'); }
  catch (f) { if (_nurNetzfehler(f)) { _merken(pfad, 'DELETE', undefined); return null; } throw f; }
}

/* Ein neuer Eintrag mit eigener Kennung. Die Kennung wird hier vergeben und
   nicht von der Ablage — so kennt der Absender sie sofort. */
async function ablageAnhaengen(pfad, wert) {
  const k = kennung();
  await ablageSchreib(pfad + '/' + k, wert);
  return k;
}

/* Wie lange ein liegengebliebener Auftrag noch gelten darf. Danach ist
   die Welt weitergezogen: Ein tagealter PUT würde längst Gelöschtes
   wieder auferstehen lassen — genau so kam ein abgeräumter Testauftrag
   zurück von den Toten. Lieber ehrlich verwerfen und notieren. */
const WARTESCHLANGE_HALTBARKEIT = 24 * 3600000;

function _auftragVergammelt(auftrag) {
  return auftrag.wann && Date.now() - auftrag.wann > WARTESCHLANGE_HALTBARKEIT;
}

async function warteschlangeLeeren() {
  if (!Ablage._warteschlange.length || !navigator.onLine || !Ablage.bereit) return;
  const offen = Ablage._warteschlange.slice();
  Ablage._warteschlange = [];
  Gerät.schreib('warteschlange', []);
  for (const auftrag of offen) {
    if (_auftragVergammelt(auftrag)) {
      if (typeof fehlerNotieren === 'function') fehlerNotieren('Warteschlange: zu alt, verworfen: ' + auftrag.art + ' ' + auftrag.pfad);
      continue;
    }
    try { await _senden(auftrag.pfad, auftrag.art, auftrag.wert); }
    catch { _merken(auftrag.pfad, auftrag.art, auftrag.wert); }
  }
}

/* --- Zuhören -------------------------------------------------------------- */

/* EINE Leitung für alles.

   Der Echtzeit-Server der Ablage spricht kein HTTP/2, und der Browser
   erlaubt nur sechs gleichzeitige Verbindungen je Gegenstelle. Mit einer
   Leitung je Pfad war die siebte dauerhaft am Verhungern — »verbindet…«
   für immer, und nichts auf der Seite wurde je wieder frisch. Das war
   die Wurzel des zähen ersten Testtags.

   Deshalb horcht genau EINE Verbindung auf die Wurzel des Paares, und
   ein Verteiler reicht jedes Ereignis an die angemeldeten Interessenten
   weiter — mit Pfaden relativ zu ihrem Anliegen, sodass sich für die
   Aufrufer nichts ändert. */

Ablage._interessen = new Map();   // pfad -> Set von Rückrufen
Ablage._stamm = null;             // { quelle, zuletzt }

function _verteilen(vollPfad, wert) {
  for (const [pfad, rueckrufe] of Ablage._interessen) {
    const wurzelAnker = '/' + pfad;

    let relativ = null;
    let nutzwert;

    if (vollPfad === '/' || wurzelAnker === vollPfad || wurzelAnker.startsWith(vollPfad + '/')) {
      /* Das Ereignis liegt ÜBER dem Anliegen (oder ist die Wurzel):
         den passenden Teil herausziehen. */
      const rest = wurzelAnker.slice(vollPfad === '/' ? 1 : vollPfad.length + 1);
      let zeiger = wert;
      if (rest) {
        for (const teil of rest.split('/')) {
          zeiger = zeiger && typeof zeiger === 'object' ? zeiger[teil] : undefined;
        }
      }
      relativ = '/';
      nutzwert = zeiger === undefined ? null : zeiger;
    } else if (vollPfad.startsWith(wurzelAnker + '/')) {
      /* Das Ereignis liegt UNTER dem Anliegen: relativen Pfad reichen. */
      relativ = vollPfad.slice(wurzelAnker.length);
      nutzwert = wert;
    }

    if (relativ !== null) {
      for (const fn of rueckrufe) {
        try { fn(relativ, nutzwert); } catch { /* ein Zeichenfehler darf den Strom nicht reißen */ }
      }
    }
  }
}

/* Der Bau der Leitung ist asynchron (erst der Ausweis, dann die Quelle).
   Ohne Wächter riefen die sechs Horcher beim Start je einmal hier an,
   sahen alle noch keinen Stamm — und öffneten SECHS Leitungen. Fünf
   Waisen, das Verbindungslimit voll, und jeder weitere Anruf zur Ablage
   verhungerte. Deshalb: Es baut immer nur einer, alle anderen warten
   auf denselben Bau. */
let _stammImBau = null;

function _stammStarten() {
  if (Ablage._stamm) return Promise.resolve();
  if (_stammImBau) return _stammImBau;

  _stammImBau = (async () => {
    try {
      const marke = await _marke();
      if (Ablage._stamm) return;   // inzwischen von anderer Seite gebaut

      const quelle = new EventSource(_adresse('') + '?auth=' + marke);
      const eintrag = { quelle, zuletzt: Date.now() };
      Ablage._stamm = eintrag;

      const lebt = () => { eintrag.zuletzt = Date.now(); };
      quelle.addEventListener('open', lebt);
      quelle.addEventListener('keep-alive', lebt);
      quelle.addEventListener('auth_revoked', () => { quelle.close(); _marke(); });

      const beiNachricht = (e) => {
        lebt();
        try {
          const d = JSON.parse(e.data);
          if (d && d.path !== undefined) _verteilen(d.path, d.data);
        } catch { /* Herzschläge und leere Zeilen übergehen */ }
      };
      quelle.addEventListener('put', beiNachricht);
      quelle.addEventListener('patch', beiNachricht);
    } finally {
      _stammImBau = null;
    }
  })();
  return _stammImBau;
}

async function ablageHorch(pfad, beiAenderung) {
  const sauber = String(pfad).replace(/^\/+|\/+$/g, '');
  if (!Ablage._interessen.has(sauber)) Ablage._interessen.set(sauber, new Set());
  Ablage._interessen.get(sauber).add(beiAenderung);

  if (!Ablage._stamm) await _stammStarten();

  return () => {
    const menge = Ablage._interessen.get(sauber);
    if (menge) {
      menge.delete(beiAenderung);
      if (!menge.size) Ablage._interessen.delete(sauber);
    }
  };
}

/* Nach einem neuen Ausweis oder einem erkannten Riss: die eine Leitung
   frisch legen. Die Interessen bleiben, wo sie sind. */
function _horcherNeuAufbauen() {
  if (Ablage._stamm) Ablage._stamm.quelle.close();
  Ablage._stamm = null;
  if (Ablage._interessen.size) _stammStarten().catch(() => {});
}

/* Der Wachhund: Die Ablage schickt alle dreißig Sekunden ein
   Lebenszeichen über die Leitung. Bleibt es fünfzig Sekunden aus, ist
   die Verbindung nur noch dem Browser bekannt — zu und neu. Genau diese
   stillen Leichen gab es nach Standby und Netzwechsel. */
setInterval(() => {
  if (!Ablage.bereit || !Ablage._stamm) return;
  const s = Ablage._stamm;
  if (Date.now() - s.zuletzt > 50000 || s.quelle.readyState === 2) {
    _horcherNeuAufbauen();
  }
}, 15000);

function ablageStill() {
  if (Ablage._stamm) Ablage._stamm.quelle.close();
  Ablage._stamm = null;
}

/* --- Netz ----------------------------------------------------------------- */

window.addEventListener('online', () => {
  Ablage._netz = true;
  warteschlangeLeeren();
  if (Ablage.bereit) _horcherNeuAufbauen();
});

window.addEventListener('offline', () => { Ablage._netz = false; });

/* Kommt die App aus dem Hintergrund zurück, sind die Leitungen oft tot,
   ohne dass ein Ereignis das gemeldet hätte. Also nachfassen. */
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState !== 'visible' || !Ablage.bereit) return;
  warteschlangeLeeren();
  _marke().then(() => _horcherNeuAufbauen()).catch(() => {});
});
