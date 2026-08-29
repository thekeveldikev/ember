/* ==========================================================================
   24-daten.js — Zwischen Oberfläche und Ablage.

   Regel des Hauses: Was durch diese Schicht geht, ist verschlüsselt, bevor
   es das Gerät verlässt. In der Ablage liegen nur Brocken wie
   { g: "k7Fx…" } — kein Text, kein Name, kein Datum.

   Die einzigen Ausnahmen, weil sie es sein müssen:
     push/<rolle>    der Bote muss die Zustelladresse lesen können
     mitglieder/     die Regeln der Ablage müssen Kennungen vergleichen
   Beide enthalten nichts über euch.
   ========================================================================== */

/* --- Einzelne Werte ------------------------------------------------------- */

/* Jeder Brocken trägt drei Dinge: den Wert, den Absender und die Zeit.
   Die beiden letzten gehören dem ersten Schreiben — wer später etwas
   ergänzt, übernimmt sie unverändert (siehe `huelle`). Sonst würde eine
   Reaktion die fremde Nachricht zur eigenen machen. */
async function datenSchreib(pfad, wert, huelle) {
  const brocken = await verschluessle({
    w: wert,
    von: (huelle && huelle.von) || D.rolle,
    wann: (huelle && huelle.wann) || jetzt(),
  });
  spiegelSetzen(pfad, brocken);
  return ablageSchreib(pfad, { g: brocken });
}

/* Der volle Brocken mit Hülle. Wird zum Ändern gebraucht. */
async function _vollLesen(pfad) {
  let roh = null;
  try {
    roh = await ablageLies(pfad);
  } catch {
    const gespiegelt = spiegelHolen(pfad);
    roh = typeof gespiegelt === 'string' ? { g: gespiegelt } : null;
  }
  if (!roh || typeof roh.g !== 'string') return null;
  spiegelSetzen(pfad, roh.g);
  return entschluessle(roh.g);
}

async function datenLies(pfad, ersatz = null) {
  const klar = await _vollLesen(pfad);
  return klar ? klar.w : ersatz;
}

async function datenLoesch(pfad) {
  spiegelLoeschen(pfad);
  return ablageLoesch(pfad);
}

/* --- Sammlungen ----------------------------------------------------------- */

/* Die Kennung eines Eintrags beginnt mit der Zeit in Basis 36. Dadurch
   ergibt die einfache Sortierung nach Kennung bereits die richtige
   Reihenfolge — ohne dass ein Datum unverschlüsselt danebenliegen muss. */

async function datenAnhaengen(pfad, wert) {
  const k = kennung();
  const brocken = await verschluessle({ w: wert, von: D.rolle, wann: jetzt() });
  /* Erst in den Spiegel, dann ins Netz: Geht der zweite Schritt gerade
     nicht, steht das Geschriebene trotzdem sofort auf dem Bildschirm,
     statt bis zur nächsten Verbindung zu verschwinden. */
  spiegelEintragSetzen(pfad, k, brocken);
  await ablageSchreib(pfad + '/' + k, { g: brocken });
  return k;
}

async function datenListe(pfad) {
  let roh = null;
  try {
    roh = await ablageLies(pfad);
    roh = spiegelSammlungSetzen(pfad, roh);
  } catch {
    roh = spiegelHolen(pfad);
  }
  return sammlungOeffnen(roh);
}

/* Der Stand aus der Ablage, ergänzt um das, was noch aussteht.

   Ohne diesen Schritt verschwände eine ohne Netz geschriebene Nachricht in
   dem Moment wieder vom Bildschirm, in dem die Verbindung zurückkommt —
   denn der Server weiß noch nichts von ihr, und sein Stand überschriebe
   den Spiegel. Sie käme erst mit dem Leeren der Warteschlange zurück. */
function spiegelSammlungSetzen(pfad, serverStand) {
  const wartend = {};
  const vorsatz = pfad + '/';

  for (const auftrag of Ablage._warteschlange) {
    if (auftrag.art !== 'PUT' || !auftrag.pfad.startsWith(vorsatz)) continue;
    const id = auftrag.pfad.slice(vorsatz.length);
    if (!id || id.includes('/')) continue;
    if (auftrag.wert && auftrag.wert.g) wartend[id] = auftrag.wert;
  }

  const zusammen = { ...(serverStand || {}), ...wartend };
  spiegelSetzen(pfad, zusammen);
  return zusammen;
}

/* Aus dem rohen Bündel wird eine sortierte Liste offener Einträge. Was sich
   nicht entschlüsseln lässt, fällt still heraus — ein falscher Schlüssel
   soll die Liste nicht sprengen, sondern leer lassen. */
async function sammlungOeffnen(roh) {
  if (!roh || typeof roh !== 'object') return [];
  const kennungen = Object.keys(roh).sort();
  const raus = [];
  for (const k of kennungen) {
    const eintrag = roh[k];
    if (!eintrag || !eintrag.g) continue;
    const klar = await entschluessle(eintrag.g);
    if (!klar) continue;
    raus.push({ id: k, von: klar.von, wann: klar.wann, ...klar.w });
  }
  return raus;
}

/* Ergänzt einen Eintrag, ohne ihn zu enteignen: Absender und Zeit bleiben
   bei dem, der ihn angelegt hat. Sie hakt seinen Auftrag ab, er bleibt
   ihr Auftrag; sie reagiert auf seine Nachricht, sie bleibt seine. */
async function datenAendern(pfad, id, teile) {
  let voll = await _vollLesen(pfad + '/' + id);

  /* Ohne Leitung findet der Blick auf den Einzelpfad nichts: Angehängtes
     liegt im Spiegel unter der Sammlung, nicht unter seinem eigenen Weg.
     Also dort nachsehen, statt das Ändern scheitern zu lassen. */
  if (!voll) {
    const sammlung = spiegelHolen(pfad);
    const eintrag = sammlung && typeof sammlung === 'object' ? sammlung[id] : null;
    if (eintrag && typeof eintrag.g === 'string') voll = await entschluessle(eintrag.g);
  }

  if (!voll) return false;

  const neu = { ...voll.w, ...teile };
  const brocken = await verschluessle({ w: neu, von: voll.von, wann: voll.wann });

  spiegelSetzen(pfad + '/' + id, brocken);
  spiegelEintragSetzen(pfad, id, brocken);
  await ablageSchreib(pfad + '/' + id, { g: brocken });
  return true;
}

/* Nimmt einen Eintrag aus einer Sammlung — und aus beiden Spiegeln. */
async function datenEintragLoeschen(pfad, id) {
  spiegelLoeschen(pfad + '/' + id);
  spiegelEintragLoeschen(pfad, id);
  return ablageLoesch(pfad + '/' + id);
}

/* --- Zuhören -------------------------------------------------------------- */

/* Der erste Ruf bringt das ganze Bündel, danach nur noch Änderungen.
   Beides landet als fertige Liste beim Aufrufer — er muss den Unterschied
   nicht kennen. */

function datenHorch(pfad, beiListe) {
  let bestand = spiegelHolen(pfad) || {};

  const senden = async () => {
    /* Auch hier gilt: Was noch aussteht, bleibt sichtbar. */
    bestand = spiegelSammlungSetzen(pfad, bestand);
    beiListe(await sammlungOeffnen(bestand));
  };

  /* Immer einmal sofort zeichnen, auch wenn der Spiegel leer ist: sonst
     bliebe die Seite ohne Netz einfach blank, statt zu sagen, dass hier
     noch nichts ist. */
  senden();

  const stopp = ablageHorch(pfad, (weg, wert) => {
    if (weg === '/') {
      bestand = wert || {};
    } else {
      const teile = weg.replace(/^\/+/, '').split('/');
      const k = teile[0];
      if (wert === null) delete bestand[k];
      else if (teile.length === 1) bestand[k] = wert;
      else bestand[k] = { ...(bestand[k] || {}), ...wert };
    }
    senden();
  }).catch(() => null);   /* Ohne Leitung bleibt es beim Spiegel. */

  D.horcher[pfad] = stopp;
  return () => { stopp.then((f) => f && f()).catch(() => {}); delete D.horcher[pfad]; };
}

function alleHorcherStoppen() {
  Object.values(D.horcher).forEach((s) => {
    if (s && typeof s.then === 'function') s.then((f) => f && f()).catch(() => {});
  });
  D.horcher = {};
  ablageStill();
}

/* --- Der Spiegel ---------------------------------------------------------- */

/* Eine Kopie der verschlüsselten Brocken auf dem Gerät, damit die App auch
   ohne Netz sofort etwas zeigt. Sie ist genauso unlesbar wie die Ablage
   selbst — ohne Schlüssel steht auch hier nichts. Bilder bleiben draußen,
   sie würden den kleinen Platz sprengen. */

const SPIEGEL_GRENZE = 400000; // Zeichen je Bereich

function spiegelPfadOk(pfad) {
  return !pfad.startsWith('tresor') && !pfad.startsWith('push');
}

function spiegelSetzen(pfad, wert) {
  if (!spiegelPfadOk(pfad)) return;
  try {
    const text = JSON.stringify(wert);
    if (text.length > SPIEGEL_GRENZE) return;
    localStorage.setItem('ember.spiegel.' + pfad, text);
  } catch { /* voll oder gesperrt — der Spiegel ist Beiwerk, kein Muss */ }
}

function spiegelHolen(pfad) {
  try {
    const roh = localStorage.getItem('ember.spiegel.' + pfad);
    return roh ? JSON.parse(roh) : null;
  } catch { return null; }
}

/* Ein einzelner Eintrag innerhalb einer gespiegelten Sammlung. Damit
   bleiben Sammlung und Einzelwert im Spiegel beieinander, statt
   auseinanderzulaufen. */
function spiegelEintragSetzen(pfad, id, brocken) {
  if (!spiegelPfadOk(pfad)) return;
  const bestand = spiegelHolen(pfad);
  const sammlung = (bestand && typeof bestand === 'object') ? bestand : {};
  sammlung[id] = { g: brocken };
  spiegelSetzen(pfad, sammlung);
}

function spiegelEintragLoeschen(pfad, id) {
  const bestand = spiegelHolen(pfad);
  if (!bestand || typeof bestand !== 'object') return;
  delete bestand[id];
  spiegelSetzen(pfad, bestand);
}

function spiegelLoeschen(pfad) {
  try { localStorage.removeItem('ember.spiegel.' + pfad); } catch {}
}

function spiegelLeeren() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('ember.spiegel.'))
      .forEach((k) => localStorage.removeItem(k));
  } catch {}
}

/* --- Bilder --------------------------------------------------------------- */

/* Fotos gehen als Text in die Ablage, also müssen sie klein werden. 1400
   Pixel an der langen Kante reichen für jeden Handybildschirm und lassen
   aus 4 MB rund 200 KB werden. Die Herkunftsdaten — Ort, Uhrzeit, Gerät —
   fallen dabei von selbst weg, weil neu gezeichnet wird. */

function bildVerkleinern(datei, maxKante = 1400, guete = 0.78) {
  return new Promise((fertig, scheitern) => {
    const leser = new FileReader();
    leser.onerror = () => scheitern(new Error('Datei nicht lesbar'));
    leser.onload = () => {
      const bild = new Image();
      bild.onerror = () => scheitern(new Error('Kein Bild'));
      bild.onload = () => {
        let { width: b, height: h } = bild;
        if (Math.max(b, h) > maxKante) {
          const f = maxKante / Math.max(b, h);
          b = Math.round(b * f);
          h = Math.round(h * f);
        }
        const tafel = document.createElement('canvas');
        tafel.width = b;
        tafel.height = h;
        const stift = tafel.getContext('2d');
        stift.imageSmoothingQuality = 'high';
        stift.drawImage(bild, 0, 0, b, h);
        fertig(tafel.toDataURL('image/jpeg', guete));
      };
      bild.src = leser.result;
    };
    leser.readAsDataURL(datei);
  });
}
