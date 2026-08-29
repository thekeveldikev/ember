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

async function warteschlangeLeeren() {
  if (!Ablage._warteschlange.length || !navigator.onLine || !Ablage.bereit) return;
  const offen = Ablage._warteschlange.slice();
  Ablage._warteschlange = [];
  Gerät.schreib('warteschlange', []);
  for (const auftrag of offen) {
    try { await _senden(auftrag.pfad, auftrag.art, auftrag.wert); }
    catch { _merken(auftrag.pfad, auftrag.art, auftrag.wert); }
  }
}

/* --- Zuhören -------------------------------------------------------------- */

/* EventSource statt eigener Strom-Auswertung: der Browser kümmert sich um
   Wiederverbindung und Zeilenzerlegung. Der Ausweis reist als Abfrage mit,
   weil EventSource keine Kopfzeilen setzen kann. */

async function ablageHorch(pfad, beiAenderung) {
  const marke = await _marke();
  const quelle = new EventSource(_adresse(pfad) + '?auth=' + marke);

  const beiNachricht = (e) => {
    try {
      const d = JSON.parse(e.data);
      if (d && d.path !== undefined) beiAenderung(d.path, d.data);
    } catch { /* Herzschläge und leere Zeilen einfach übergehen */ }
  };

  quelle.addEventListener('put', beiNachricht);
  quelle.addEventListener('patch', beiNachricht);
  quelle.addEventListener('auth_revoked', () => { quelle.close(); _marke(); });

  /* EventSource verbindet nach einem Fehler von selbst neu — und zwar
     unbegrenzt und im Sekundentakt. Ist die Ablage dauerhaft nicht
     erreichbar, wird daraus eine Schleife, die nur Akku kostet. Nach ein
     paar Fehlversuchen wird deshalb aufgelegt; das Zurückkommen aus dem
     Hintergrund und das online-Ereignis legen die Leitung wieder neu. */
  let fehlversuche = 0;
  quelle.addEventListener('open', () => { fehlversuche = 0; });
  quelle.addEventListener('error', () => {
    if (quelle.readyState === EventSource.CLOSED) return;
    if (++fehlversuche >= 4) quelle.close();
  });

  /* Auf denselben Pfad zweimal zu horchen, ohne die alte Leitung zu
     schließen, hinterlässt bei jedem Seitenwechsel eine offene Verbindung
     mehr. Nach ein paar Minuten Hin und Her wären es Dutzende. */
  const vorige = Ablage._horcher.get(pfad);
  if (vorige) vorige.quelle.close();

  const eintrag = { quelle, pfad, beiAenderung };
  Ablage._horcher.set(pfad, eintrag);

  return () => {
    quelle.close();
    Ablage._horcher.delete(pfad);
  };
}

/* Nach einem neuen Ausweis müssen alle Leitungen frisch gelegt werden —
   die alten tragen den abgelaufenen mit sich. */
function _horcherNeuAufbauen() {
  const alte = [...Ablage._horcher.values()];
  Ablage._horcher.clear();
  alte.forEach((h) => h.quelle.close());
  alte.forEach((h) => ablageHorch(h.pfad, h.beiAenderung).catch(() => {}));
}

function ablageStill() {
  Ablage._horcher.forEach((h) => h.quelle.close());
  Ablage._horcher.clear();
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
