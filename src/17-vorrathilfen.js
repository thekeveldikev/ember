/* ==========================================================================
   17-vorrathilfen.js — Der Zugriff auf den Vorrat.

   Der Vorrat (15-vorrat.js) füllt die App mit Inhalt, ohne dass jemand
   erst hunderte Karten tippen muss. Er ist Beigabe, nicht Gesetz:

     - Sie schaltet ihn unter Verwaltung → Der Vorrat an oder aus.
     - Sie setzt eine Obergrenze der Intensität (1–5). Alles darüber
       existiert für die App schlicht nicht.
     - Die Ampel greift überall durch: Bei Rot bleibt nur das Ruhige,
       bei Gelb fällt das Härteste weg.

   Eigene Einträge der beiden liegen daneben in der Ablage und werden
   überall dazugemischt — der Vorrat ersetzt nichts, er füllt nur auf.
   ========================================================================== */

let _vorratEinst = { an: true, stufe: 5, getrennt: false };

async function vorratLaden() {
  try {
    const einst = await datenLies('einst/vorrat');
    if (einst) _vorratEinst = { ..._vorratEinst, ...einst };
  } catch { /* dann eben die Vorgabe */ }
  ablageHorch('einst/vorrat', async () => {
    const einst = await datenLies('einst/vorrat').catch(() => null);
    if (einst) _vorratEinst = { ..._vorratEinst, ...einst };
  }).catch(() => {});
}

const vorratAn = () => !!_vorratEinst.an;
const vorratStufe = () => _vorratEinst.stufe || 5;
const vorratGetrennt = () => !!_vorratEinst.getrennt;

async function vorratSetzen(teile) {
  _vorratEinst = { ..._vorratEinst, ...teile };
  await datenSchreib('einst/vorrat', _vorratEinst);
}

/* Die Ampel drückt die Obergrenze zusätzlich: Gelb deckelt bei 3, Rot
   bei 1. Gerechnet wird mit der schlechteren der beiden Ampeln — es
   reicht, wenn es EINEM von beiden nicht gut geht. */
function vorratWirksameStufe() {
  const farben = [D.ampel.domme, D.ampel.sub];
  if (farben.includes('rot')) return Math.min(vorratStufe(), 1);
  if (farben.includes('gelb')) return Math.min(vorratStufe(), 3);
  return vorratStufe();
}

const _bisStufe = (liste, max) => liste.filter((x) => (x.intensitaet || 1) <= max);

/* --- Decks ----------------------------------------------------------------- */

function vorratDares(deckKey) {
  if (!vorratAn()) return [];
  const max = vorratWirksameStufe();
  return _bisStufe(VORRAT.dares.filter((d) => d.deck === deckKey), max);
}

function vorratDeckListe() {
  if (!vorratAn()) return [];
  return VORRAT.deckMeta
    /* Das Toys-Deck gibt es nur, wenn im Regal (Ich → Das Regal) auch
       etwas steht — Karten über Spielzeug, das es nicht gibt, ärgern nur. */
    .filter((m) => m.key !== 'toys' || D.toysVorhanden)
    .map((m) => ({ ...m, karten: vorratDares(m.key) }))
    .filter((m) => m.karten.length);
}

/* --- Räder ----------------------------------------------------------------- */

function vorratRaeder() {
  if (!vorratAn()) return [];
  const max = vorratWirksameStufe();
  return VORRAT.raeder
    .map((r) => ({ ...r, segmente: _bisStufe(r.segmente, max) }))
    .filter((r) => r.segmente.length >= 2);
}

function vorratRadKombis() {
  if (!vorratAn()) return [];
  const da = new Set(vorratRaeder().map((r) => r.key));
  return VORRAT.radKombis
    .map((k) => ({ ...k, raeder: k.raeder.filter((key) => da.has(key)) }))
    .filter((k) => k.raeder.length);
}

/* --- Der Szenario-Baukasten ------------------------------------------------ */

/* Zieht ein Template, füllt seine Slots aus dem Vorrat und glättet die
   Nähte. Bei Konflikt-Tags (gefesselt UND zuschauen …) wird bis zu
   dreimal neu gezogen — danach gilt: Chaos ist auch eine Antwort. */

const _SZENARIO_KONFLIKTE = [
  ['bondage', 'zuschauen'],
  ['augenbinde', 'spiegel'],
  ['stille', 'dirtytalk'],
];

function vorratSzenario() {
  if (!vorratAn()) return null;
  const max = vorratWirksameStufe();

  const passende = VORRAT.szenarioTemplates.filter((t) =>
    (!t.max_intensitaet || t.max_intensitaet >= 1) &&
    t.benoetigt.every((slot) => _bisStufe(VORRAT.szenarioSlots[slot] || [], max).length));
  if (!passende.length) return null;

  for (let versuch = 0; versuch < 3; versuch++) {
    const tpl = zufall(passende);
    const deckel = Math.min(max, tpl.max_intensitaet || 5);
    const teile = {};
    const tags = [];

    let ok = true;
    for (const slot of tpl.benoetigt) {
      const topf = _bisStufe(VORRAT.szenarioSlots[slot] || [], deckel);
      if (!topf.length) { ok = false; break; }
      const stein = zufall(topf);
      teile[slot] = stein;
      tags.push(...(stein.tags || []));
    }
    if (!ok) continue;

    const beisst = _SZENARIO_KONFLIKTE.some(([a, b]) => tags.includes(a) && tags.includes(b));
    if (beisst && versuch < 2) continue;

    let text = tpl.muster.replace(/\{(\w+)\}/g, (_, slot) => (teile[slot] ? teile[slot].text : ''));
    /* Die Glättung: doppelte Leerzeichen, verwaiste Punkte, Großschreibung. */
    text = text
      .replace(/\s+/g, ' ')
      .replace(/\s+\./g, '.')
      .replace(/\.\s*—/g, ' —')
      .replace(/\.\s*\./g, '.')
      .trim();
    text = text.charAt(0).toUpperCase() + text.slice(1);

    return { text, template: tpl.name };
  }
  return null;
}

/* --- Tagesaufgaben --------------------------------------------------------- */

/* Für ihn: gestaffelt nach seiner Stufe, gefiltert nach Ampel, Kontext
   und Tageszeit. Für sie: der eigene Topf — sonst wäre die App für sie
   nur Verwaltung. */

function _stufenFenster(level) {
  if (level <= 5) return [1, 1];
  if (level <= 12) return [1, 2];
  if (level <= 20) return [2, 3];
  if (level <= 30) return [2, 4];
  return [3, 5];
}

function _tageszeitJetzt() {
  const std = new Date().getHours();
  if (std < 11) return 'morgen';
  if (std < 18) return 'tag';
  if (std < 23) return 'abend';
  return 'nacht';
}

function vorratTagesaufgabe(rolle, level, zuletztIds = []) {
  if (!vorratAn()) return null;
  const rot = [D.ampel.domme, D.ampel.sub].includes('rot');
  const gelb = [D.ampel.domme, D.ampel.sub].includes('gelb');

  let topf;
  if (rolle === 'domme') {
    topf = VORRAT.challengePools.domme.slice();
  } else if (rot) {
    topf = VORRAT.challengePools.ruhig.slice();
  } else {
    const [von, bis] = _stufenFenster(level || 1);
    topf = VORRAT.challenges.filter((c) => c.stufe >= von && c.stufe <= bis);
    const tag = new Date().getDay();
    if ((tag === 0 || tag === 6) && Math.random() < 0.4) {
      const we = VORRAT.challengePools.wochenende.filter((c) => c.stufe <= bis);
      if (we.length) topf = we;
    }
    if (vorratGetrennt()) {
      const fern = VORRAT.challengePools.getrennt.filter((c) => c.stufe <= bis);
      topf = fern.length ? fern : topf.filter((c) => c.kontext !== 'zusammen');
    } else {
      topf = topf.filter((c) => c.kontext !== 'getrennt');
    }
  }

  const max = rot ? 1 : gelb ? 3 : vorratStufe();
  topf = _bisStufe(topf, max);

  /* Tageszeit passend oder egal; Wiederholungen der letzten Tage raus. */
  const zeit = _tageszeitJetzt();
  const frisch = topf.filter((c) => !zuletztIds.includes(c.id));
  const basis = frisch.length ? frisch : topf;
  const passend = basis.filter((c) => c.tageszeit === 'egal' || c.tageszeit === zeit);
  const wahl = passend.length ? passend : basis;
  return wahl.length ? zufall(wahl) : null;
}

/* --- Wahrheit oder Pflicht ------------------------------------------------- */

/* Gefiltert nach Spielstufe (1–3), Intensitäts-Obergrenze und danach, wer
   gerade dran ist: Eine Frage „an sie" landet nie bei ihm. */
function vorratWup(art, spielstufe, dran) {
  if (!vorratAn()) return [];
  const max = vorratWirksameStufe();
  return VORRAT.wup.filter((w) =>
    w.typ === art &&
    (w.stufe || 1) <= spielstufe &&
    (w.intensitaet || 1) <= max &&
    (w.an === 'beide' || w.an === dran));
}

/* --- Lose ------------------------------------------------------------------ */

/* Die Seltenheit würfelt das Schicksal: 40/30/18/10/2. Ein Boost schiebt
   die Gewichte nach oben — Boost 3 garantiert mindestens Silber. */
const _SELTENHEIT_GEWICHTE = [
  [40, 30, 18, 10, 2],
  [25, 30, 25, 15, 5],
  [10, 25, 30, 25, 10],
  [0, 0, 45, 40, 15],
];

function _seltenheitWuerfeln(boost = 0) {
  const gewichte = _SELTENHEIT_GEWICHTE[Math.max(0, Math.min(3, boost))];
  const summe = gewichte.reduce((a, b) => a + b, 0);
  let wurf = Math.random() * summe;
  for (let i = 0; i < 5; i++) {
    wurf -= gewichte[i];
    if (wurf <= 0) return i + 1;
  }
  return 1;
}

function _losSeriePool(serie) {
  const alle = VORRAT.lose;
  if (serie === 'belohnung') return alle.filter((l) => l.typ !== 'falle' && l.typ !== 'niete');
  if (serie === 'grausam') {
    const boese = alle.filter((l) => l.typ === 'falle' || l.typ === 'niete');
    return alle.concat(boese, boese);   // doppeltes Gewicht fürs Gemeine
  }
  if (serie === 'sanft') return alle.filter((l) => l.typ !== 'falle' && (l.seltenheit || 1) <= 3);
  return alle;
}

function vorratLosZiehen(boost = 0, serie = 'basis') {
  if (!vorratAn()) return null;
  const pool = _losSeriePool(serie);
  if (!pool.length) return null;
  const ziel = _seltenheitWuerfeln(boost);
  /* Erst die gewürfelte Stufe, dann die nächstniedrigere, dann irgendwas. */
  for (let s = ziel; s >= 1; s--) {
    const passend = pool.filter((l) => (l.seltenheit || 1) === s);
    if (passend.length) return zufall(passend);
  }
  return zufall(pool);
}

const LOS_SELTENHEIT = [
  { name: 'Standard', farbe: 'rgba(155,144,134,.5)' },
  { name: 'Gut', farbe: 'rgba(196,140,90,.6)' },
  { name: 'Selten', farbe: 'rgba(200,200,215,.65)' },
  { name: 'Sehr selten', farbe: 'rgba(224,180,90,.85)' },
  { name: 'Jackpot', farbe: 'var(--glut-hell)' },
];

/* --- Kekse ----------------------------------------------------------------- */

function vorratKekse(rolle, eigene = []) {
  const rot = [D.ampel.domme, D.ampel.sub].includes('rot');
  const gelb = [D.ampel.domme, D.ampel.sub].includes('gelb');

  let topf = vorratAn()
    ? VORRAT.kekse.filter((k) => k.fuer === 'beide' || k.fuer === rolle)
    : [];
  if (rot) topf = topf.filter((k) => ['warm', 'nachdenklich'].includes(k.kategorie) && (k.intensitaet || 1) <= 1);
  else if (gelb) topf = topf.filter((k) => k.kategorie !== 'dreckig' && (k.intensitaet || 1) <= 3);
  else topf = _bisStufe(topf, vorratStufe());

  /* Tageszeit bevorzugen (3:1), eigene Sprüche zählen doppelt. */
  const zeit = _tageszeitJetzt() === 'morgen' ? 'morgen' : _tageszeitJetzt() === 'nacht' ? 'abend' : _tageszeitJetzt();
  const gewichtet = [];
  for (const k of topf) {
    gewichtet.push(k);
    if (k.tageszeit === zeit) gewichtet.push(k, k);
  }
  for (const e of eigene) {
    const k = { id: 'eigen-' + e.id, text: e.text, kategorie: 'eigen', von: e.von };
    gewichtet.push(k, k);
  }
  return gewichtet;
}

/* --- Verwaltung ------------------------------------------------------------ */

function vorratBlatt() {
  let an = vorratAn();
  let stufe = vorratStufe();
  let getrennt = vorratGetrennt();

  const NAMEN = ['', 'Ganz sanft', 'Angedeutet', 'Deutlich', 'Intensiv', 'Alles'];

  const anKnopf = el('button', { class: 'knopf breit' });
  const getrenntKnopf = el('button', { class: 'knopf breit', style: { marginTop: '9px' } });
  const stufenreihe = el('div', { style: { display: 'flex', gap: '6px', marginTop: '8px' } });
  const stufenwort = el('p', { class: 'still klein mitte', style: { marginTop: '8px' } });

  const zeichne = () => {
    anKnopf.textContent = an ? 'Der Vorrat spielt mit' : 'Der Vorrat ist aus';
    anKnopf.className = 'knopf breit' + (an ? ' glut' : ' leer');
    getrenntKnopf.textContent = getrennt ? 'Wir sind gerade getrennt' : 'Wir sind zusammen';
    getrenntKnopf.className = 'knopf breit leer';
    stufenreihe.innerHTML = '';
    for (let s = 1; s <= 5; s++) {
      stufenreihe.append(el('button', {
        class: 'knopf' + (s <= stufe ? ' glut' : ' leer'),
        style: { flex: '1', minHeight: '42px', padding: '8px 0', opacity: an ? '1' : '.35' },
        onclick: () => { stufe = s; zeichne(); },
      }, String(s)));
    }
    stufenwort.textContent = an ? 'Bis Stufe ' + stufe + ' — ' + NAMEN[stufe] + '. Alles darüber existiert nicht.' : '';
  };
  zeichne();

  anKnopf.addEventListener('click', () => { an = !an; zeichne(); });
  getrenntKnopf.addEventListener('click', () => { getrennt = !getrennt; zeichne(); });

  const b = blatt(
    el('h2', {}, 'Der Vorrat'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px', lineHeight: '1.5' } },
      'Hunderte Karten, Räder, Aufgaben und Sprüche, die die App mitbringt. ' +
      'Eure eigenen Einträge bleiben davon unberührt — der Vorrat füllt nur auf.'),
    anKnopf,
    el('p', { class: 'winzig still', style: { margin: '16px 0 0' } }, 'Obergrenze der Intensität'),
    stufenreihe, stufenwort,
    el('p', { class: 'winzig still', style: { margin: '16px 0 0' } }, 'Lage'),
    getrenntKnopf,
    el('p', { class: 'still klein', style: { marginTop: '6px' } },
      'Getrennt heißt: Tagesaufgaben, die Nähe brauchen, bleiben im Schrank.'),
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '18px' },
      onclick: async () => {
        b.schliessen();
        await vorratSetzen({ an, stufe, getrennt });
        meldung('Übernommen.');
        if (D.seite === 'verwaltung') zeigeSeite('verwaltung');
      },
    }, 'Übernehmen')
  );
}
