/* ==========================================================================
   66-laden.js — Der Laden. Glut und Siegel.

   Karma (●) ist die fließende Währung: täglich verdient, sonntags kommt
   Gehalt, am Monatsersten glimmt ungenutztes Guthaben ein Stück herunter.
   Siegel (✦) sind die seltene: Es gibt sie nur für Meilensteine — eine
   Stufe, ein besiegter Boss, dreißig Tage Serie — und sie verfallen nie.
   Ein Siegel lässt sich zu 50 Karma einschmelzen, niemals umgekehrt.

   Der Reiz liegt nicht im Kaufen. Er liegt darin, dass SIE die ganze
   kleine Welt steuert: Gehalt, Preise, Angebote, Abgaben, Gnade. Er
   arbeitet in einem System, dessen Regeln sich ändern können, während
   er spart — und die Bilanz zeigt ihm jede Zahl, aber keinen Grund.

   FEST VERDRAHTET: Bei Rot oder im Ruhezustand gibt es keine Bußgelder
   und keine Zinsen. Schulden erzwingen nie automatisch etwas — die App
   sperrt höchstens den Laden, nie den Menschen. Das ganze Modul ist
   abschaltbar, ohne dass der Rest der App etwas merkt.
   ========================================================================== */

const LADEN_ABTEILUNGEN = [
  { key: 'kleinigkeiten', name: 'Kleine Gesten', wort: 'Kleine Belohnungen für wenige Münzen — für zwischendurch.' },
  { key: 'koerper', name: 'Haut & Hände', wort: 'Berührung, Massage, Nähe — alles zum Anfassen.' },
  { key: 'privilegien', name: 'Freiheiten', wort: 'Erlaubnisse auf Zeit — für eine Weile mehr Leine.' },
  { key: 'erlass', name: 'Gnade', wort: 'Löst Schulden, Strafen und Ausstehendes ab.' },
  { key: 'gross', name: 'Das Große', wort: 'Die großen Wünsche. Nur für Siegel — und die muss man sich verdienen.' },
  { key: 'gluecksspiel', name: 'Das Risiko', wort: 'Lose, Münzwurf, Rad: Münzen einsetzen und gewinnen — oder verlieren.' },
];

const SIEGEL_KURS = 50;

/* Die Münze als gezeichnetes Zeichen — zwei Ringe im Strich-Stil des
   Hauses. In laufenden Sätzen bleibt das schlichte ●; überall, wo eine
   ZAHL steht, sitzt daneben die gezeichnete Münze in Textfarbe. */
function muenzSinn(groesse = 13) {
  const s = sinnbild('muenze', groesse);
  s.style.verticalAlign = '-2px';
  return s;
}

/* Zu jedem Artikel ein Satz in einfacher Sprache: was das konkret ist
   und was nach dem Kauf passiert. Die Namen verkaufen — diese Zeilen
   erklären. Die Statik-Wache prüft, dass KEIN Artikel ohne Satz bleibt. */
const LADEN_WAS = {
  'shop-k01': 'Einlösen — und sie küsst dich. Sofort, wo immer ihr seid.',
  'shop-k02': 'Eine Umarmung ohne Zeitlimit. Du entscheidest, wann sie endet.',
  'shop-k03': 'Zehn Minuten Kuscheln, eingelöst wann sie es erlaubt.',
  'shop-k04': 'Stell eine Frage — sie antwortet ehrlich, ohne Ausweichen.',
  'shop-k05': 'Du nennst das Thema, sie sagt dir etwas Schönes darüber.',
  'shop-k06': 'Sie schickt dir ein Foto. Welches, entscheidet sie.',
  'shop-k07': 'Eine Sprachnachricht von ihr — nur für dich aufgenommen.',
  'shop-k08': 'Sie sagt dir unzensiert, was ihr gerade durch den Kopf geht.',
  'shop-k09': 'Kopf in ihren Schoß, sie streichelt. So lange sie mag.',
  'shop-k10': 'Einen Abend lang darfst du ihr ungefragt in die Augen sehen.',
  'shop-b01': 'Zwanzig Minuten Massage von ihr. Termin bestimmt sie.',
  'shop-b02': 'Die große Ausgabe: 45 Minuten, ganzer Körper, mit Öl.',
  'shop-b03': 'Zehn Minuten lang sind ihre Grenzen offen für deine Hände.',
  'shop-b04': 'Du wünschst dir, was sie trägt — sie zieht es an.',
  'shop-b05': 'Sie lässt dir ein Bad ein und kümmert sich, solange du drin liegst.',
  'shop-b06': 'Haare waschen, von ihr. Langsam.',
  'shop-b07': 'Eine Nacht ohne Regeln: einfach neben ihr einschlafen.',
  'shop-b08': 'Sie verwöhnt dich oral — und du schuldest ihr dafür nichts.',
  'shop-p01': 'Beim nächsten Mal ist ein Wunsch von dir fest eingeplant.',
  'shop-p02': 'Beim nächsten Mal wählst du die Position.',
  'shop-p03': 'Einmal kommen ohne zu fragen. Gilt genau einmal.',
  'shop-p04': 'Du wählst eine Regel — sie schweigt 24 Stunden lang.',
  'shop-p05': 'Ein ganzer Abend, an dem nichts gilt: keine Anrede, kein Protokoll.',
  'shop-p06': 'Eine Bitte, direkt gestellt — ohne das übliche Drumherum.',
  'shop-p07': 'Ein Extra-Veto: einmal mehr Nein sagen dürfen diesen Monat.',
  'shop-p08': 'Beim nächsten Kartenziehen suchst du das Deck aus.',
  'shop-p09': 'Die Rollen ruhen: einen Abend lang führst du.',
  'shop-p10': 'Ein aufgespartes Nein — einsetzbar ohne jede Folge.',
  'shop-e01': 'Ein Bußgeld deiner Wahl wird zurückgebucht, als wäre nichts gewesen.',
  'shop-e02': 'Eine wartende Strafe verschwindet — du wählst nicht, welche.',
  'shop-e03': 'Der große Freikauf: ALLE wartenden Strafen verfallen.',
  'shop-e04': 'Eine verpasste Aufgabe darf nachgeholt werden und zählt dann voll.',
  'shop-e05': 'Deine Serie überlebt einen ausgefallenen Tag.',
  'shop-e06': 'Ein Tag weniger warten — die laufende Frist schrumpft.',
  'shop-g01': 'Zwei Tage lang gelten deine Regeln. Sie spielt mit.',
  'shop-g02': 'Ihr setzt eine Fantasie von deiner Wunschliste wirklich um.',
  'shop-g03': 'Ein Punkt von deiner Löffelliste — eingelöst binnen 30 Tagen.',
  'shop-g04': 'Volle 24 Stunden Rollentausch. Alles dreht sich um.',
  'shop-g05': 'Zwei Nächte weg, nur ihr zwei. Planung übernimmt sie.',
  'shop-g06': 'Du schreibst eine Regel, die einen Monat lang für sie gilt.',
  'shop-g07': 'Eine bestehende Regel wird ersatzlos gestrichen — für immer.',
  'shop-x01': 'Ein Los landet bei deinen Losen — freirubbeln und sehen.',
  'shop-x02': 'Wie das normale Los, aber mindestens Silber ist sicher.',
  'shop-x03': 'Du zahlst — sie entscheidet, was du dafür bekommst.',
  'shop-x04': 'Blindkauf mit mehr Einsatz. Was kommt, weiß nur sie.',
  'shop-x05': 'Der große Blindkauf. Mutig — oder sehr mutig.',
  'shop-x06': 'Münzwurf sofort: Kopf verdoppelt auf 40, Zahl nimmt alles.',
  'shop-x07': 'Das Rad dreht sofort: Gewinn, Verlust, ein Los — oder gar nichts.',
};

/* --- Der Rechenkern (pur, prüfbar) ----------------------------------------- */

function schuldenStufe(karma) {
  if (karma >= 0) return null;
  if (karma >= -10) return { name: 'Leicht im Minus', nurGnade: true };
  if (karma >= -20) return { name: 'Verschuldet', keineKaeufe: true };
  if (karma >= -30) return { name: 'Tief im Minus', keineKaeufe: true, gehaltTilgt: true };
  return { name: 'Zahlungsunfähig', keineKaeufe: true, gehaltTilgt: true, sieEntscheidet: true };
}

function zinsenAuf(karma) {
  if (karma >= 0) return 0;
  return -Math.round(Math.abs(karma) * 0.10);
}

function inflationAuf(karma, gespart = 0) {
  const frei = karma - (gespart || 0);
  if (frei < 20) return 0;
  return -Math.round(frei * 0.05);
}

function ladenPreisVon(artikel, preise = {}, angebot = null) {
  let preis = preise[artikel.id] != null ? preise[artikel.id] : artikel.preis;
  if (angebot && angebot.artikelId === artikel.id && angebot.bis > Date.now()) {
    preis = Math.max(1, Math.round(preis * (1 - angebot.rabatt / 100)));
  }
  return preis;
}

function ladenCooldownRest(artikel, letzterKauf) {
  if (!artikel.cooldown_h || !letzterKauf) return 0;
  return Math.max(0, letzterKauf + artikel.cooldown_h * 3600000 - Date.now());
}

/* --- Das Konto -------------------------------------------------------------- */

let _konto = null;
let _kontoHorcherLaeuft = false;

async function kontoLaden() {
  _konto = await datenLies('konto').catch(() => null);
  if (!_kontoHorcherLaeuft) {
    _kontoHorcherLaeuft = true;
    ablageHorch('konto', async () => {
      const alt = _konto ? _konto.karma : null;
      _konto = await datenLies('konto').catch(() => _konto);
      if (D.seite === 'heim' && _heim) heimKontoZeile();
      if (alt !== null && _konto && _konto.karma !== alt && !istDomme()) {
        const diff = _konto.karma - alt;
        kontoFunkeln(diff);
      }
    }).catch(() => {});
  }
  return _konto;
}

const ladenAn = () => !!(_konto && _konto.an);

/* Jede Bewegung ist eine Buchung: erst der neue Stand, dann die Zeile im
   Buch. Der Stand wird nie „einfach so" angefasst — sonst lügt die Bilanz. */
async function kontoBuchen(betrag, waehrung, quelle, still = false) {
  const konto = await datenLies('konto').catch(() => null);
  if (!konto) return null;

  const neu = { ...konto };
  if (waehrung === 'siegel') {
    neu.siegel = Math.max(0, (konto.siegel || 0) + betrag);
  } else {
    neu.karma = (konto.karma || 0) + betrag;
  }
  await datenSchreib('konto', neu);
  await datenAnhaengen('kontobuch', {
    betrag, waehrung: waehrung || 'karma', quelle: String(quelle || '').slice(0, 90),
    saldo: waehrung === 'siegel' ? neu.siegel : neu.karma,
  });
  _konto = neu;

  if (!still) {
    if (betrag > 0) tonSpielen(waehrung === 'siegel' ? 'schimmer' : 'muenze');
    else if (betrag < 0) tonSpielen('tief');
  }
  return neu;
}

/* Verdienste mit Tagesdeckel: dreimal Auftrag, einmal Aufgabe — mehr
   zählt der Tag nicht, egal wie fleißig er ist. */
async function kontoVerdienst(schluessel, betrag, waehrung, deckelProTag, quelle) {
  const konto = await datenLies('konto').catch(() => null);
  if (!konto || !konto.an) return;

  const heute = tagstempel();
  const tage = konto.tage && konto.tage.tag === heute ? konto.tage : { tag: heute, zaehler: {} };
  const bisher = tage.zaehler[schluessel] || 0;
  if (deckelProTag && bisher >= deckelProTag) return;

  tage.zaehler = { ...tage.zaehler, [schluessel]: bisher + 1 };
  await datenSchreib('konto', { ...konto, tage });
  _konto = { ...konto, tage };
  await kontoBuchen(betrag, waehrung, quelle);
}

/* Ein Bußgeld — niemals bei Rot, niemals in der Ruhe. Dasselbe Vergehen
   binnen sieben Tagen kostet doppelt. */
async function kontoBussgeld(vergehen, betrag) {
  if (D.ruhe || [D.ampel.domme, D.ampel.sub].includes('rot')) {
    return meldung('Bei Rot wird nichts berechnet. Fest verdrahtet.');
  }
  const buch = await datenListe('kontobuch').catch(() => []);
  const woche = Date.now() - 7 * 86400000;
  const schonMal = buch.some((b) => b.quelle === vergehen && b.betrag < 0 && b.wann > woche);
  const wirksam = schonMal ? betrag * 2 : betrag;

  await kontoBuchen(wirksam, 'karma', vergehen);
  pushSenden('sub', 'hinweis', 'Das kostet.');
  puls('strafe');
  meldung(schonMal ? 'Verhängt — zum zweiten Mal binnen sieben Tagen: doppelt.' : 'Verhängt.');
}

/* --- Die Automatiken --------------------------------------------------------
   Gehalt, Zinsen, Glutverlust, Abos. Es rechnet nur IHR Gerät — sonst
   zahlte jedes Gerät einmal aus. */

function _letzterFaelligerSonntag() {
  const d = new Date();
  d.setHours(20, 0, 0, 0);
  while (d.getDay() !== 0 || d.getTime() > Date.now()) d.setTime(d.getTime() - 86400000 * (d.getDay() === 0 ? 7 : 1));
  return d.getTime();
}

async function ladenPflegen() {
  /* Nur EIN Gerät rechnet — immer dasselbe, ganz gleich, wer gerade
     führt. Sonst liefe der Zahltag im Modus „gleich" doppelt. */
  if (!istWaechter()) return;
  let konto = await datenLies('konto').catch(() => null);
  if (!konto || !konto.an) return;

  const rot = D.ruhe || [D.ampel.domme, D.ampel.sub].includes('rot');

  /* Sonntag, 20 Uhr: Gehalt — und auf Schulden die Zinsen. */
  const faellig = _letzterFaelligerSonntag();
  if ((konto.gehaltZuletzt || 0) < faellig) {
    await datenSchreib('konto', { ...konto, gehaltZuletzt: faellig });
    const gehalt = konto.gehalt != null ? konto.gehalt : 10;
    if (gehalt > 0) await kontoBuchen(gehalt, 'karma', 'Wochengehalt', true);
    konto = await datenLies('konto');
    if (!rot && konto.karma < 0) {
      const zins = zinsenAuf(konto.karma);
      if (zins) await kontoBuchen(zins, 'karma', 'Zinsen auf Schulden', true);
    }
    pushSenden('sub', 'hinweis', 'Zahltag.');
  }

  /* Monatserster: die Glut verliert, was zu lange liegt — und die Abos
     buchen ab. Wer nicht zahlen kann, verliert das Privileg. */
  const monat = tagstempel().slice(0, 7);
  if (konto.glutMonat !== monat) {
    await datenSchreib('konto', { ...(await datenLies('konto')), glutMonat: monat });
    konto = await datenLies('konto');
    const verlust = inflationAuf(konto.karma || 0, konto.gespart || 0);
    if (verlust) await kontoBuchen(verlust, 'karma', 'Monatsschwund', true);

    for (const abo of (konto.abos || [])) {
      konto = await datenLies('konto');
      if ((konto.karma || 0) >= abo.kosten) {
        await kontoBuchen(-abo.kosten, 'karma', 'Abo: ' + abo.name, true);
      } else {
        await datenSchreib('konto', { ...konto, abos: (konto.abos || []).filter((a) => a.name !== abo.name) });
        pushSenden('sub', 'hinweis', 'Ein Privileg ist erloschen.');
      }
    }
  }
}

/* --- Der Funke am Kontostand ------------------------------------------------ */

function kontoFunkeln(diff) {
  if (istGetarnt() || !diff) return;
  const zeile = $('#kontozeile');
  if (!zeile) return;
  const flug = el('span', {
    style: {
      position: 'fixed', zIndex: '920', pointerEvents: 'none',
      left: (zeile.getBoundingClientRect().right - 60) + 'px',
      top: zeile.getBoundingClientRect().top + 'px',
      fontWeight: '600', fontSize: '15px',
      color: diff > 0 ? 'var(--glut-hell)' : 'var(--rot)',
      animation: (diff > 0 ? 'kontoRauf' : 'kontoRunter') + ' 1.1s ease-out forwards',
    },
  }, (diff > 0 ? '+' : '') + diff + ' ', muenzSinn(13));
  document.body.append(flug);
  setTimeout(() => flug.remove(), 1150);
}

/* --- Die Zeile auf dem Heim ------------------------------------------------- */

async function heimKontoZeile(platz) {
  const ziel = platz || ($('#kontozeile') && $('#kontozeile').parentNode);
  if (!ziel) return;
  const aktuell = rennwache(ziel);
  ziel.innerHTML = '';
  const konto = _konto || await kontoLaden();
  if (!aktuell()) return;
  ziel.innerHTML = '';
  if (!konto || !konto.an) return;

  const sparRoh = konto.spar ? VORRAT.laden.find((a) => a.id === konto.spar) : null;
  const spar = sparRoh && sparRoh.waehrung !== 'siegel' ? sparRoh : null;
  const sparPreis = spar ? ladenPreisVon(spar, konto.preise || {}) : 0;

  const zeile = el('button', {
    id: 'kontozeile', class: 'aufgabenzeile',
    onclick: () => zeigeSeite('laden'),
  },
    el('span', { class: 'lichtpunkt' }),
    el('span', { class: 'klein', style: { flex: '1', textAlign: 'left' } },
      /* Das Konto ist SEINS — bei ihr darf die Zeile nicht „Deine" sagen. */
      istDomme() ? 'Seine Münzen' : 'Deine Münzen'),
    el('span', { class: 'klein', style: { flex: 'none', color: 'var(--glut-hell)', fontVariantNumeric: 'tabular-nums' } },
      (konto.karma || 0) + ' ', muenzSinn(12),
      (konto.siegel || 0) > 0 ? '  ·  ' + konto.siegel + ' ✦' : ''),
    el('span', { class: 'still', style: { flex: 'none', fontSize: '15px' } }, '›')
  );
  ziel.append(zeile);

  if (spar) {
    const anteil = Math.min(1, Math.max(0, (konto.karma || 0) / sparPreis));
    ziel.append(el('div', { style: { padding: '0 13px', marginTop: '-2px', marginBottom: '6px' } },
      el('div', { style: { height: '3px', borderRadius: '2px', background: 'var(--grund2)', overflow: 'hidden' } },
        el('div', { style: { height: '100%', width: (anteil * 100) + '%', background: 'var(--verlauf)', borderRadius: '2px', transition: 'width .6s ease' } })),
      el('p', { class: 'winzig still', style: { marginTop: '3px' } },
        (istDomme() ? 'Er spart auf: ' : 'Du sparst auf: ') + spar.artikel + ' (' + sparPreis + ' ', muenzSinn(10), ')')
    ));
  }
}

/* --- Die Seite -------------------------------------------------------------- */

SEITEN.laden = function (seite) {
  seite.append(kopfzeile('Der Laden',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('spiel') }, 'Zurück')
  ));

  const platz = el('div');
  seite.append(platz);

  const zeichnen = async () => {
    platz.innerHTML = '';
    const konto = await kontoLaden();

    if (!konto || !konto.an) {
      platz.append(leerlauf('Der Laden ist zu',
        istDomme() ? 'Öffne ihn — ab dann verdient er Münzen mit Aufgaben und gibt sie hier aus.'
          : 'Hier könnte er sein: verdienen, sparen, kaufen. Ob er öffnet, entscheidet sie.'));
      platz.append(el('button', {
        class: 'winzig still', style: { display: 'block', margin: '10px auto 0' },
        onclick: () => ladenErklaerung(),
      }, 'Wie es funktioniert'));
      if (istDomme()) {
        platz.append(el('button', {
          class: 'knopf glut breit', style: { marginTop: '12px' },
          onclick: async () => {
            await datenSchreib('konto', {
              an: true, karma: konto ? (konto.karma || 0) : 15, siegel: konto ? (konto.siegel || 0) : 0,
              gehalt: 10, abos: [], preise: {}, aus: {},
              /* Frisch eröffnet heißt: Der erste Zahltag ist der NÄCHSTE
                 Sonntag, nicht rückwirkend der letzte. */
              gehaltZuletzt: jetzt(), glutMonat: tagstempel().slice(0, 7),
            });
            if (!konto) await datenAnhaengen('kontobuch', { betrag: 15, waehrung: 'karma', quelle: 'Startguthaben', saldo: 15 });
            meldung('Der Laden hat geöffnet.');
            pushSenden('sub', 'hinweis', 'Etwas hat geöffnet.');
            zeichnen();
          },
        }, 'Den Laden eröffnen'));
      }
      return;
    }

    const kaeufe = await datenListe('kaeufe').catch(() => []);
    const stufe = schuldenStufe(konto.karma || 0);

    /* Der Kopf: der Stand, groß und warm — keine Tabelle, eine Glut. */
    platz.append(el('div', { class: 'karte glimmt', style: { textAlign: 'center', padding: '20px 16px' } },
      el('div', { style: { display: 'flex', justifyContent: 'center', gap: '34px', alignItems: 'baseline' } },
        el('div', {},
          el('div', { class: 'zier glutschrift', style: { fontSize: '42px', fontVariantNumeric: 'tabular-nums' } },
            String(konto.karma || 0)),
          el('div', { class: 'winzig still' }, muenzSinn(11), ' Münzen')
        ),
        el('div', {},
          el('div', { class: 'zier', style: { fontSize: '30px', color: 'var(--glut-hell)', fontVariantNumeric: 'tabular-nums' } },
            String(konto.siegel || 0)),
          el('div', { class: 'winzig still' }, '✦ Siegel')
        )
      ),
      /* Konkret statt abstrakt: WANN kommt das nächste Geld, und wie viel.
         Das eine Zeile beantwortet die häufigste Frage von selbst. */
      el('p', { class: 'winzig still', style: { marginTop: '9px' } },
        'Zahltag: Sonntag 20 Uhr — in ' + dauerText(_letzterFaelligerSonntag() + 7 * 86400000 - jetzt()) +
        ' kommen +' + (konto.gehalt != null ? konto.gehalt : 10) + ' ', muenzSinn(10)),
      stufe ? el('p', { class: 'winzig', style: { marginTop: '10px', color: 'var(--rot)', letterSpacing: '.14em' } },
        stufe.name.toUpperCase()) : null,
      /* Die Stufe darf kein Rätsel sein: Was sie konkret bedeutet, steht
         direkt darunter — je Rolle in eigenen Worten. */
      stufe ? el('p', { class: 'still klein', style: { marginTop: '5px' } },
        stufe.sieEntscheidet
          ? (istDomme() ? 'Ab hier entscheidest du, wie es weitergeht — die App tut von selbst nichts mehr.'
            : 'Ab hier entscheidet sie, wie es weitergeht.')
          : stufe.gehaltTilgt
            ? (istDomme() ? 'Sein Gehalt tilgt jetzt zuerst die Schulden. Kaufen kann er nichts.'
              : 'Dein Gehalt tilgt zuerst die Schulden. Der Laden wartet, bis du wieder im Licht bist.')
            : stufe.keineKaeufe
              ? (istDomme() ? 'Er kann gerade nichts kaufen — erst müssen die Schulden kleiner werden.'
                : 'Kaufen geht gerade nicht — erst müssen die Schulden kleiner werden.')
              : (istDomme() ? 'Im leichten Minus kann er nur noch Gnade kaufen.'
                : 'Im Minus bleibt dir nur die Abteilung Gnade — sie löst Schulden.')) : null,
      (konto.sperr || 0) > 0 ? el('p', { class: 'still klein', style: { marginTop: '8px' } },
        (konto.sperr) + ' ● liegen versiegelt — wann sie zurückkommen, entscheidet sie.') : null,
      (konto.siegel || 0) > 0 && !istDomme() ? el('button', {
        class: 'winzig still', style: { marginTop: '10px' },
        onclick: () => siegelSchmelzen(zeichnen),
      }, 'Ein Siegel einschmelzen (' + SIEGEL_KURS + ' ●)') : null
    ));

    /* Ungelöste Käufe: sein kleiner Stapel an Einlösbarem. */
    const offene = kaeufe.filter((k) => !k.eingeloest);
    if (offene.length) {
      platz.append(el('p', { class: 'winzig still', style: { margin: '16px 0 7px 2px' } }, 'Gekauft und noch offen'));
      offene.slice(-6).reverse().forEach((k) => platz.append(kaufKarte(k, zeichnen)));
    }

    /* Die Abteilungen. */
    for (const abt of LADEN_ABTEILUNGEN) {
      const artikel = VORRAT.laden.filter((a) => a.kategorie === abt.key);
      if (!artikel.length) continue;
      platz.append(ladenAbteilung(abt, artikel, konto, kaeufe, stufe, zeichnen));
    }

    /* Der Rand: Bußgeldkatalog (für beide sichtbar — Berechenbarkeit
       ist der halbe Reiz), Bilanz, Abos, Schwarzmarkt-Tür. */
    platz.append(el('div', { class: 'trenner' }));
    platz.append(el('div', { style: { display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' } },
      el('button', { class: 'winzig still', onclick: () => katalogZeigen() }, 'Der Katalog'),
      el('button', { class: 'winzig still', onclick: () => bilanzZeigen(konto) }, 'Die Bilanz'),
      el('button', { class: 'winzig still', onclick: () => aboBlatt(konto, zeichnen) }, 'Abos'),
      !istDomme() ? el('button', { class: 'winzig still', onclick: () => schwarzmarktFragen() }, 'Leise fragen') : null,
      el('button', { class: 'winzig still', onclick: () => ladenErklaerung() }, 'Wie es funktioniert')
    ));

    if (istDomme()) {
      platz.append(el('div', { class: 'trenner' }));
      platz.append(ladenVerwaltung(konto, zeichnen));
    }
  };
  zeichnen();

  const stopp = datenHorch('kaeufe', () => { if (D.seite === 'laden') zeichnen(); });
  beimVerlassen(stopp);
};

/* --- Eine Abteilung --------------------------------------------------------- */

function ladenAbteilung(abt, artikel, konto, kaeufe, stufe, zeichnen) {
  const offenStand = Gerät.lies('ladenKlappen', {});
  let offen = !!offenStand[abt.key];

  const pfeil = el('span', { class: 'still', style: { fontSize: '15px', transition: 'transform .25s ease', transform: offen ? 'rotate(90deg)' : 'none' } }, '›');
  const inhalt = el('div', { class: 'aufklapp' + (offen ? ' offen' : '') },
    el('div', { style: { minHeight: '0', paddingLeft: '4px' } },
      ...artikel.map((a) => artikelKarte(a, konto, kaeufe, stufe, zeichnen))));

  const kopf = el('button', {
    class: 'karte',
    style: { width: '100%', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '9px', padding: '13px 15px' },
    onclick: () => {
      offen = !offen;
      const frisch = Gerät.lies('ladenKlappen', {});
      frisch[abt.key] = offen;
      Gerät.schreib('ladenKlappen', frisch);
      inhalt.classList.toggle('offen', offen);
      pfeil.style.transform = offen ? 'rotate(90deg)' : 'none';
      tonSpielen('tick');
    },
  },
    el('div', {},
      el('div', { class: 'zier', style: { fontSize: '16.5px' } },
        abt.name + (abt.key === 'gross' ? '  ✦' : '')),
      el('div', { class: 'still klein' }, abt.wort)
    ),
    pfeil
  );

  return el('div', {}, kopf, inhalt);
}

function artikelKarte(a, konto, kaeufe, stufe, zeichnen) {
  const preise = konto.preise || {};
  const angebot = konto.angebot || null;
  const preis = ladenPreisVon(a, preise, angebot);
  const rabattiert = angebot && angebot.artikelId === a.id && angebot.bis > Date.now();
  const ausverkauft = (konto.aus || {})[a.id];

  const meine = kaeufe.filter((k) => k.artikelId === a.id);
  const letzter = meine.length ? Math.max(...meine.map((k) => k.wann)) : 0;
  const rest = ladenCooldownRest(a, letzter);

  const siegelWare = a.waehrung === 'siegel';
  const gesperrtDurchSchulden = stufe && (stufe.keineKaeufe || (stufe.nurGnade && a.kategorie !== 'erlass'));
  const zuTeuer = siegelWare ? (konto.siegel || 0) < preis : (konto.karma || 0) - preis < -30;
  const kaufbar = !istDomme() && !ausverkauft && !rest && !gesperrtDurchSchulden && !zuTeuer;

  const karte = el('div', {
    class: 'karte',
    style: { marginTop: '8px', padding: '12px 14px', opacity: ausverkauft ? '.5' : '1' },
  },
    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' } },
      el('div', { style: { flex: '1', minWidth: '0' } },
        el('div', { style: { fontSize: '14.5px' } }, a.artikel),
        LADEN_WAS[a.id] ? el('div', { class: 'still klein', style: { marginTop: '2px', lineHeight: '1.4' } }, LADEN_WAS[a.id]) : null
      ),
      el('div', { style: { flex: 'none', textAlign: 'right' } },
        rabattiert ? el('span', { class: 'winzig', style: { color: 'var(--gelb)', marginRight: '7px' } },
          'nur ' + Math.ceil((angebot.bis - Date.now()) / 3600000) + ' Std') : null,
        el('span', {
          class: 'zier',
          style: { fontSize: '15.5px', color: siegelWare ? 'var(--glut-hell)' : 'var(--gelb)', fontVariantNumeric: 'tabular-nums' },
        }, preis + ' ', siegelWare ? '✦' : muenzSinn(13))
      )
    ),
    ausverkauft ? el('p', { class: 'winzig still', style: { marginTop: '4px' } }, 'Gerade nicht zu haben. Vielleicht wieder — vielleicht nicht.') : null,
    rest ? el('p', { class: 'winzig still', style: { marginTop: '4px' } }, 'Wieder in ' + dauerText(rest)) : null,
    /* Zu teuer ist kein stummer Zustand — er soll wissen, WARUM nichts
       passiert, wenn er tippt. Und worauf es sich zu sparen lohnt. */
    !istDomme() && !ausverkauft && !rest && !gesperrtDurchSchulden && zuTeuer
      ? el('p', { class: 'winzig still', style: { marginTop: '4px' } },
          siegelWare ? 'Dafür fehlen dir Siegel.' : 'Noch nicht genug Münzen. Halt gedrückt, um darauf zu sparen.')
      : null
  );

  if (kaufbar) {
    karte.style.cursor = 'pointer';
    karte.addEventListener('click', () => kaufBlatt(a, preis, zeichnen));
  }
  /* Sparen ergibt nur bei Glut-Ware Sinn — Siegel kann man nicht ansparen. */
  if (!istDomme() && !ausverkauft && !siegelWare) {
    langerDruck(karte, async () => {
      const will = await frage('Darauf sparen?', a.artikel + ' — ' + preis + ' ●', 'Sparen');
      if (will) {
        await datenSchreib('konto', { ...(await datenLies('konto')), spar: a.id });
        meldung('Der Balken auf dem Heim gehört jetzt diesem Ziel.');
      }
    });
  }
  if (istDomme()) langerDruck(karte, () => artikelVerwalten(a, konto, zeichnen));

  return karte;
}

/* --- Kaufen ----------------------------------------------------------------- */

function kaufBlatt(a, preis, zeichnen) {
  const siegelWare = a.waehrung === 'siegel';
  const b = blatt(
    el('p', { class: 'winzig still mitte' }, 'Kaufen'),
    el('p', { class: 'zier mitte', style: { fontSize: '21px', lineHeight: '1.35', padding: '12px 4px 6px' } }, a.artikel),
    el('p', { class: 'mitte', style: { color: siegelWare ? 'var(--glut-hell)' : 'var(--gelb)', fontSize: '18px', marginBottom: '10px' } },
      preis + ' ', siegelWare ? '✦' : muenzSinn(15)),
    /* Vor dem Kauf steht, was er auslöst — kein Kleingedrucktes danach. */
    el('p', { class: 'still klein mitte', style: { marginBottom: '14px', lineHeight: '1.5' } },
      a.kategorie === 'gluecksspiel' ? 'Wirkt sofort — was dabei herauskommt, siehst du gleich.'
        : 'Liegt danach als offener Kauf bei dir. Einlösen legst du ihr vor — den Moment wählt sie.'),
    el('div', { class: 'knopfreihe' },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Doch nicht'),
      el('button', {
        class: 'knopf glut',
        onclick: async (e) => {
          e.target.disabled = true;
          b.schliessen();
          /* Ein Kauf klingt nach Münzen, nicht nach Strafe — deshalb
             still buchen und selbst klimpern. */
          await kontoBuchen(-preis, a.waehrung, 'Gekauft: ' + a.artikel, true);
          tonSpielen('muenze');
          await datenAnhaengen('kaeufe', { artikelId: a.id, artikel: a.artikel, preis, waehrung: a.waehrung, eingeloest: false });
          if (_konto && _konto.spar === a.id) {
            await datenSchreib('konto', { ...(await datenLies('konto')), spar: null });
          }
          pushSenden('domme', 'hinweis', 'Er hat sich etwas gegönnt.');
          puls('belohnung');
          await gluecksWirkung(a);
          meldung('Gekauft. ' + (a.kategorie === 'gluecksspiel' ? '' : 'Sie weiß Bescheid.'));
          zeichnen();
        },
      }, 'Kaufen')
    )
  );
}

/* Das Risiko wirkt sofort — der Rest wartet als offener Kauf auf sie. */
async function gluecksWirkung(a) {
  if (a.kategorie !== 'gluecksspiel') return;

  if (a.id === 'shop-x01' || a.id === 'shop-x02') {
    const los = vorratLosZiehen(a.id === 'shop-x02' ? 3 : 0, 'basis');
    if (los) {
      await datenAnhaengen('lose', { titel: 'Gekauftes Los', text: los.text, typ: los.typ, seltenheit: los.seltenheit, aufgedeckt: false });
      meldung('Das Los liegt bei den Losen. Rubbel es frei.');
    }
  } else if (a.id === 'shop-x06') {
    const kopf = Math.random() < 0.5;
    setTimeout(async () => {
      if (kopf) { await kontoBuchen(40, 'karma', 'Verdopplung gewonnen'); tonSpielen('schimmer'); if (typeof konfetti === 'function') konfetti(); meldung('Kopf. 40 zurück.'); }
      else { tonSpielen('tief'); meldung('Zahl. Weg ist es.'); }
    }, 900);
  } else if (a.id === 'shop-x07') {
    const wirkungen = [
      async () => { await kontoBuchen(30, 'karma', 'Das Rad meinte es gut'); meldung('Das Rad meinte es gut: +30 ●.'); },
      async () => { await kontoBuchen(5, 'karma', 'Das Rad gab ein wenig'); meldung('Ein wenig Glück: +5 ●.'); },
      async () => { meldung('Das Rad dreht sich — und nichts geschieht.'); },
      async () => { await kontoBuchen(-5, 'karma', 'Das Rad nahm ein wenig'); meldung('Das Rad nahm sich 5 ●.'); },
      async () => {
        const los = vorratLosZiehen(2, 'basis');
        if (los) await datenAnhaengen('lose', { titel: 'Vom Rad des Schicksals', text: los.text, typ: los.typ, seltenheit: los.seltenheit, aufgedeckt: false });
        meldung('Das Rad wirft ein Los ab.');
      },
    ];
    setTimeout(() => zufall(wirkungen)(), 900);
  } else if (a.id === 'shop-x03' || a.id === 'shop-x04' || a.id === 'shop-x05') {
    pushSenden('domme', 'bitte', 'Ein Blindkauf. Du entscheidest, was er bekommt.');
  }
}

function kaufKarte(k, zeichnen) {
  const karte = el('div', { class: 'karte', style: { marginTop: '8px', padding: '11px 14px', borderLeft: '3px solid var(--gelb)' } },
    el('div', { style: { fontSize: '14.5px' } }, k.artikel),
    el('p', { class: 'winzig still', style: { marginTop: '4px' } },
      k.preis + ' ', k.waehrung === 'siegel' ? '✦' : muenzSinn(10),
      ' · ' + vorZeit(k.wann) + (k.einloeseWunsch ? ' · zum Einlösen vorgelegt' : ''))
  );

  if (!istDomme() && !k.einloeseWunsch) {
    anfuegen(karte, el('button', {
      class: 'knopf leer breit', style: { marginTop: '9px', minHeight: '36px', fontSize: '13px' },
      onclick: async () => {
        await datenAendern('kaeufe', k.id, { einloeseWunsch: true });
        pushSenden('domme', 'bitte', 'Er löst etwas ein.');
        meldung('Vorgelegt. Sie entscheidet den Moment.');
        zeichnen();
      },
    }, 'Einlösen'));
  }
  if (istDomme() && k.einloeseWunsch) {
    anfuegen(karte, el('button', {
      class: 'knopf glut breit', style: { marginTop: '9px', minHeight: '36px', fontSize: '13px' },
      onclick: async () => {
        await datenAendern('kaeufe', k.id, { eingeloest: true, eingeloestWann: jetzt() });
        pushSenden('sub', 'antwort', 'Eingelöst. Jetzt gilt es.');
        meldung('Eingelöst.');
        zeichnen();
      },
    }, 'Jetzt einlösen'));
  }
  return karte;
}

/* --- Siegel einschmelzen ----------------------------------------------------- */

function siegelSchmelzen(zeichnen) {
  const b = blatt(
    el('p', { class: 'zier mitte', style: { fontSize: '19px', padding: '10px 4px 6px', lineHeight: '1.4' } },
      'Ein Siegel einschmelzen?'),
    el('p', { class: 'leise klein mitte', style: { marginBottom: '14px' } },
      'Aus ✦ wird ' + SIEGEL_KURS + ' ●. Der Weg zurück existiert nicht — Siegel kann man sich nur verdienen.'),
    el('div', { class: 'knopfreihe' },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Behalten'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          b.schliessen();
          await kontoBuchen(-1, 'siegel', 'Siegel eingeschmolzen', true);
          await kontoBuchen(SIEGEL_KURS, 'karma', 'Aus einem Siegel');
          meldung('Geschmolzen. ' + SIEGEL_KURS + ' ● mehr im Beutel.');
          zeichnen();
        },
      }, 'Einschmelzen')
    )
  );
}

/* --- Wie das hier funktioniert ----------------------------------------------- */

/* Jede Rolle bekommt ihre eigene Erklärung — in einfachen Sätzen.
   Er liest, wie er verdient und was Kaufen bedeutet. Sie liest, welche
   Hebel sie hat. Nichts davon steht zwischen den Zeilen. */
function ladenErklaerung() {
  const absatz = (kopf, text) => el('div', { style: { marginTop: '13px' } },
    el('div', { style: { fontWeight: '600', fontSize: '14px', marginBottom: '3px' } }, kopf),
    el('p', { class: 'leise klein', style: { lineHeight: '1.55' } }, text)
  );

  const seine = [
    absatz('● Münzen — dein Geld hier',
      'Du verdienst Münzen, indem du Dinge erledigst: Tagesaufgaben, Aufträge, Serien. ' +
      'Jeden Sonntag um 20 Uhr kommt dein Gehalt dazu. Mit Münzen kaufst du im Laden ein.'),
    absatz('✦ Siegel — die seltene Währung',
      'Siegel gibt es nur für Meilensteine: eine neue Stufe, ein besiegter Boss, dreißig Tage Serie. ' +
      'Sie verfallen nie. Ein Siegel lässt sich in ' + SIEGEL_KURS + ' Münzen einschmelzen — der Weg zurück existiert nicht. ' +
      'Nur „Das Große" kostet Siegel.'),
    absatz('Kaufen — und dann?',
      'Ein Kauf verschwindet nicht: Er liegt als offener Kauf in deinem Stapel. ' +
      'Wenn du ihn haben willst, tippst du „Einlösen" — dann liegt er bei ihr, und sie wählt den Moment. ' +
      'Nur das Risiko wirkt sofort.'),
    absatz('Sparen',
      'Halt einen Artikel gedrückt und wähl „Sparen" — auf dem Heim zeigt dir dann ein Balken, wie nah du dran bist. ' +
      'Ersparte Münzen sind außerdem vor dem Monatsschwund sicher.'),
    absatz('Was deine Münzen von selbst tun',
      'Am Monatsersten schrumpfen ungenutzte Münzen ein wenig (ab 20 freien Münzen, fünf Prozent) — ausgeben oder sparen schützt. ' +
      'Schulden kosten jeden Sonntag zehn Prozent Zinsen. Und je tiefer im Minus, desto enger wird der Laden: ' +
      'erst gibt es nur noch Gnade, dann gar nichts mehr.'),
    absatz('Abos und Katalog',
      'Abos sind Dauer-Freiheiten, die monatlich Münzen kosten — kannst du sie nicht zahlen, erlöschen sie sofort. ' +
      'Der Katalog zeigt dir jeden Bußgeld-Preis im Voraus: Du weißt immer, was dich was kostet. ' +
      'Dasselbe Vergehen binnen sieben Tagen kostet doppelt.'),
    absatz('Fest versprochen',
      'Bei Rot wird nichts berechnet — keine Bußgelder, keine Zinsen. ' +
      'Und Schulden sperren höchstens den Laden, nie dich.'),
  ];

  const ihre = [
    absatz('Worum es geht',
      'Er verdient Münzen (●) mit Aufgaben und Aufträgen und gibt sie hier aus. ' +
      'Siegel (✦) gibt es nur für Meilensteine. Der Reiz liegt nicht im Kaufen — ' +
      'er liegt darin, dass DU die Regeln dieser kleinen Welt bestimmst.'),
    absatz('Deine Hebel, kurz erklärt',
      'Geben oder nehmen: frei buchen, mit oder ohne Grund. ' +
      'Bußgeld: fester Katalogpreis, Wiederholung binnen sieben Tagen kostet von selbst doppelt. ' +
      'Sonderabgabe: ein Betrag deiner Wahl, er sieht nur die Zahl. ' +
      'Gehalt: was jeden Sonntag um 20 Uhr automatisch kommt. ' +
      'Versiegeln: Münzen hinter Glas — er sieht sie, erreicht sie nicht.'),
    absatz('Je Artikel',
      'Halt einen Artikel gedrückt: Preis ändern, ausverkauft stellen oder ein 24-Stunden-Angebot starten. ' +
      'Er sieht immer nur das Ergebnis, nie den Grund.'),
    absatz('Was von selbst läuft',
      'Sonntags 20 Uhr: Gehalt, und auf Schulden zehn Prozent Zinsen. ' +
      'Am Monatsersten: fünf Prozent Schwund auf ungenutzte Münzen ab 20 (Erspartes ist sicher) und die Abo-Abbuchung — ' +
      'was er nicht zahlen kann, wird wortlos gekündigt.'),
    absatz('Kauf und Einlösung',
      'Ein Kauf liegt erst als offener Kauf bei ihm. Zum Einlösen legt er ihn dir vor — ' +
      'den Moment wählst du. Blindkäufe landen direkt bei dir: Du entscheidest, was er bekommt.'),
    absatz('Fest verdrahtet',
      'Bei Rot berechnet die App nichts — keine Bußgelder, keine Zinsen. ' +
      'Schulden sperren höchstens den Laden, nie den Menschen. Das bleibt so, egal was eingestellt ist.'),
  ];

  blatt(
    el('h2', {}, 'Wie der Laden funktioniert'),
    ...(istDomme() ? ihre : seine),
    el('p', { class: 'still klein', style: { marginTop: '14px' } },
      istDomme() ? 'Abschalten geht jederzeit: Verwaltung → Bausteine. Alles bleibt gespeichert.'
        : 'Alle Zahlen findest du in der Bilanz — jede Buchung, chronologisch.')
  );
}

/* --- Katalog, Bilanz, Abos, Schwarzmarkt ------------------------------------- */

function katalogZeigen() {
  blatt(
    el('h2', {}, 'Der Katalog'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 12px' } },
      'Feste Preise für Vergehen. Er weiß immer, was ihn was kostet — die Berechenbarkeit im Kleinen macht die Freiheit im Großen erst spürbar.'),
    el('div', { style: { maxHeight: '52vh', overflowY: 'auto' } },
      ...VORRAT.bussgelder.map((bg) => el('div', {
        style: { display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '9px 2px', borderBottom: '1px solid var(--kante)' },
      },
        el('span', { class: 'klein' }, bg.vergehen),
        el('span', { class: 'klein', style: { color: 'var(--rot)', flex: 'none', fontVariantNumeric: 'tabular-nums' } }, bg.betrag + ' ', muenzSinn(11))
      ))
    ),
    el('p', { class: 'still klein', style: { marginTop: '10px' } },
      'Dasselbe Vergehen binnen sieben Tagen kostet doppelt. Bei Rot wird nichts berechnet — nie.')
  );
}

async function bilanzZeigen(konto) {
  const buch = await datenListe('kontobuch').catch(() => []);
  blatt(
    el('h2', {}, 'Die Bilanz'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 12px' } },
      'Jede Buchung mit Betrag und neuem Stand (→). Das Neueste steht oben.'),
    el('div', { style: { maxHeight: '54vh', overflowY: 'auto' } },
      ...buch.slice(-30).reverse().map((z) => el('div', {
        style: { display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '8px 2px', borderBottom: '1px solid var(--kante)' },
      },
        el('div', { style: { minWidth: '0' } },
          el('div', { class: 'klein', style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, z.quelle),
          el('div', { class: 'winzig still' }, vorZeit(z.wann))
        ),
        el('div', { style: { flex: 'none', textAlign: 'right' } },
          el('div', { class: 'klein', style: { color: z.betrag >= 0 ? 'var(--gruen)' : 'var(--rot)', fontVariantNumeric: 'tabular-nums' } },
            (z.betrag > 0 ? '+' : '') + z.betrag + ' ', z.waehrung === 'siegel' ? '✦' : muenzSinn(11)),
          el('div', { class: 'winzig still' }, '→ ' + z.saldo)
        )
      ))
    ),
    (konto.abos || []).length ? el('p', { class: 'still klein', style: { marginTop: '10px' } },
      'Laufend: ' + konto.abos.map((a) => a.name + ' (' + a.kosten + ' ●/Monat)').join(' · ')) : null
  );
}

function aboBlatt(konto, zeichnen) {
  const aktive = new Set((konto.abos || []).map((a) => a.name));
  blatt(
    el('h2', {}, 'Abos'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 12px' } },
      'Dauerhafte Freiheiten, monatlich mit Münzen bezahlt. Wer nicht zahlen kann, verliert sie — sofort und wortlos. ' +
      (istDomme() ? 'Du schaltest frei und kündigst — jederzeit, ohne Grund.' : 'Fang mit höchstens zwei an.')),
    ...VORRAT.abos.map((abo) => {
      const an = aktive.has(abo.name);
      return el('div', { class: 'karte', style: { marginTop: '8px', padding: '11px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' } },
        el('div', { style: { minWidth: '0' } },
          el('div', { style: { fontSize: '14.5px', fontWeight: an ? '600' : '400' } }, abo.name),
          el('div', { class: 'still klein' }, abo.beschreibung + ' · ' + abo.kosten_monat + ' ●/Monat')
        ),
        istDomme() ? el('button', {
          class: 'knopf ' + (an ? 'leer warnend' : 'leer'), style: { minHeight: '34px', padding: '6px 12px', fontSize: '12px', flex: 'none' },
          onclick: async () => {
            const frisch = await datenLies('konto');
            const neu = an
              ? (frisch.abos || []).filter((x) => x.name !== abo.name)
              : [...(frisch.abos || []), { name: abo.name, kosten: abo.kosten_monat }];
            await datenSchreib('konto', { ...frisch, abos: neu });
            pushSenden('sub', 'hinweis', an ? 'Ein Privileg ist erloschen.' : 'Ein Privileg läuft jetzt.');
            meldung(an ? 'Gekündigt.' : 'Freigeschaltet.');
            if (typeof zeichnen === 'function') zeichnen();
          },
        }, an ? 'Kündigen' : 'Freischalten')
          : (an ? el('span', { class: 'winzig', style: { color: 'var(--gruen)', flex: 'none' } }, 'läuft') : null)
      );
    })
  );
}

function schwarzmarktFragen() {
  eingabeBlatt({
    titel: 'Leise fragen',
    hinweis: 'Was es im Laden nicht gibt, gibt es vielleicht trotzdem. Nenn es beim Namen — sie nennt einen Preis. Oder nicht.',
    platzhalter: 'Kann ich … kaufen?',
    mehrzeilig: true,
    jaText: 'Fragen',
  }, async (text) => {
    await datenAnhaengen('plausch', { text: '● Anfrage: ' + text, art: 'text' });
    pushSenden('domme', 'bitte', 'Eine leise Anfrage.');
    meldung('Gefragt. Der Rest liegt bei ihr.');
  });
}

/* --- Ihre Verwaltung --------------------------------------------------------- */

function ladenVerwaltung(konto, zeichnen) {
  const halter = el('div');
  halter.append(el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Deine Hebel'));

  const reihe = (titel, unter, tat) => el('button', {
    class: 'karte',
    style: { width: '100%', textAlign: 'left', marginTop: '8px', padding: '12px 15px' },
    onclick: tat,
  },
    el('div', { style: { fontWeight: '500', fontSize: '14.5px' } }, titel),
    el('div', { class: 'still klein', style: { marginTop: '1px' } }, unter)
  );

  halter.append(
    reihe('Geben oder nehmen', 'Münzen und Siegel, frei — mit oder ohne Grund', () => gebenBlatt(zeichnen)),
    reihe('Ein Bußgeld verhängen', 'Aus dem Katalog, zum festen Preis', () => bussgeldBlatt(zeichnen)),
    reihe('Sonderabgabe', 'Ein Betrag deiner Wahl, ohne Begründung', () => {
      eingabeBlatt({ titel: 'Sonderabgabe', hinweis: 'Er sieht nur die Zahl.', platzhalter: 'z. B. 5' }, async (text) => {
        const betrag = Math.abs(parseInt(text, 10) || 0);
        if (!betrag) return meldung('Eine Zahl.');
        await kontoBuchen(-betrag, 'karma', 'Sonderabgabe');
        pushSenden('sub', 'hinweis', 'Eine Abgabe wurde fällig.');
        meldung('Erhoben.');
        zeichnen();
      });
    }),
    reihe('Gehalt einstellen', 'Zurzeit ' + (konto.gehalt != null ? konto.gehalt : 10) + ' ● je Sonntag', () => {
      eingabeBlatt({ titel: 'Das Wochengehalt', hinweis: 'Kürzen geht wortlos — er sieht nur den Betrag.', wert: String(konto.gehalt != null ? konto.gehalt : 10) }, async (text) => {
        const g = Math.max(0, parseInt(text, 10) || 0);
        await datenSchreib('konto', { ...(await datenLies('konto')), gehalt: g });
        meldung('Ab Sonntag: ' + g + ' ●.');
        zeichnen();
      });
    }),
    reihe('Versiegeln / freigeben', (konto.sperr || 0) + ' ● liegen versiegelt', () => sperrBlatt(zeichnen)),
    reihe('Den Laden schließen', 'Alles bleibt gespeichert — es ruht nur', async () => {
      const sicher = await frage('Den Laden schließen?', 'Stände und Buch bleiben. Er sieht nur: zu.', 'Schließen', true);
      if (sicher) {
        await datenSchreib('konto', { ...(await datenLies('konto')), an: false });
        zeichnen();
      }
    })
  );

  return halter;
}

function gebenBlatt(zeichnen) {
  const betrag = el('input', { class: 'feld', type: 'number', placeholder: 'z. B. 5 oder -3' });
  const grund = el('input', { class: 'feld', placeholder: 'Grund (darf leer bleiben)', style: { marginTop: '9px' } });
  let waehrung = 'karma';
  const wahl = el('div', { class: 'knopfreihe', style: { marginTop: '9px' } });
  const zeichneWahl = () => {
    wahl.innerHTML = '';
    [['karma', 'Münzen'], ['siegel', '✦ Siegel']].forEach(([w, marke]) => {
      wahl.append(el('button', {
        class: 'knopf ' + (waehrung === w ? 'glut' : 'leer'), style: { minHeight: '40px', fontSize: '13px' },
        onclick: () => { waehrung = w; zeichneWahl(); },
      }, w === 'karma' ? muenzSinn(13) : null, (w === 'karma' ? ' ' : '') + marke));
    });
  };
  zeichneWahl();

  const b = blatt(
    el('h2', {}, 'Geben oder nehmen'),
    el('div', { style: { height: '10px' } }),
    betrag, wahl, grund,
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '14px' },
      onclick: async () => {
        const z = parseInt(betrag.value, 10);
        if (!z) return meldung('Eine Zahl — positiv oder negativ.');
        b.schliessen();
        await kontoBuchen(z, waehrung, grund.value.trim() || (z > 0 ? 'Von ihr' : 'Von ihr genommen'));
        pushSenden('sub', 'hinweis', z > 0 ? 'Deine Münzen sind mehr geworden.' : 'Deine Münzen sind weniger geworden.');
        meldung('Gebucht.');
        zeichnen();
      },
    }, 'Buchen')
  );
  setTimeout(() => betrag.focus(), 260);
}

function bussgeldBlatt(zeichnen) {
  blatt(
    el('h2', {}, 'Ein Bußgeld'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 10px' } },
      'Zum Katalogpreis. Wiederholung binnen sieben Tagen kostet von selbst doppelt.'),
    el('div', { style: { maxHeight: '52vh', overflowY: 'auto' } },
      ...VORRAT.bussgelder.map((bg) => el('button', {
        class: 'karte',
        style: { width: '100%', textAlign: 'left', marginTop: '7px', padding: '10px 13px', display: 'flex', justifyContent: 'space-between', gap: '10px' },
        onclick: async (e) => {
          e.target.disabled = true;
          await kontoBussgeld(bg.vergehen, bg.betrag);
          zeichnen();
        },
      },
        el('span', { class: 'klein' }, bg.vergehen),
        el('span', { class: 'klein', style: { color: 'var(--rot)', flex: 'none' } }, bg.betrag + ' ', muenzSinn(11))
      ))
    )
  );
}

function sperrBlatt(zeichnen) {
  eingabeBlatt({
    titel: 'Versiegeln oder freigeben',
    hinweis: 'Positiv versiegelt Münzen (er sieht sie, erreicht sie nicht). Negativ gibt sie zurück.',
    platzhalter: 'z. B. 10 oder -10',
  }, async (text) => {
    const z = parseInt(text, 10);
    if (!z) return meldung('Eine Zahl.');
    const konto = await datenLies('konto');
    const menge = Math.min(Math.abs(z), z > 0 ? Math.max(0, konto.karma || 0) : (konto.sperr || 0));
    if (!menge) return meldung('So viel liegt da nicht.');
    await datenSchreib('konto', {
      ...konto,
      karma: (konto.karma || 0) + (z > 0 ? -menge : menge),
      sperr: (konto.sperr || 0) + (z > 0 ? menge : -menge),
    });
    await datenAnhaengen('kontobuch', {
      betrag: z > 0 ? -menge : menge, waehrung: 'karma',
      quelle: z > 0 ? 'Versiegelt' : 'Entsiegelt',
      saldo: (konto.karma || 0) + (z > 0 ? -menge : menge),
    });
    pushSenden('sub', 'hinweis', z > 0 ? 'Ein Teil deiner Münzen liegt jetzt hinter Glas.' : 'Etwas ist zurück.');
    meldung('Erledigt.');
    zeichnen();
  });
}

function artikelVerwalten(a, konto, zeichnen) {
  const preisFeld = el('input', {
    class: 'feld', type: 'number',
    value: String(ladenPreisVon(a, konto.preise || {})),
  });
  const aus = (konto.aus || {})[a.id];

  const b = blatt(
    el('p', { class: 'winzig still' }, 'Artikel'),
    el('p', { class: 'zier', style: { fontSize: '17px', margin: '4px 0 12px' } }, a.artikel),
    el('label', { class: 'feldmarke' }, 'Preis (' + (a.waehrung === 'siegel' ? '✦' : '●') + ') — er sieht nur den neuen Wert'),
    preisFeld,
    el('div', { class: 'knopfreihe', style: { marginTop: '12px' } },
      el('button', {
        class: 'knopf leer',
        onclick: async () => {
          b.schliessen();
          const frisch = await datenLies('konto');
          await datenSchreib('konto', { ...frisch, aus: { ...(frisch.aus || {}), [a.id]: !aus } });
          meldung(aus ? 'Wieder zu haben.' : 'Aus dem Regal genommen.');
          zeichnen();
        },
      }, aus ? 'Wieder anbieten' : 'Ausverkauft'),
      el('button', {
        class: 'knopf leer',
        onclick: () => {
          b.schliessen();
          eingabeBlatt({ titel: 'Angebot', hinweis: 'Rabatt in Prozent, gilt 24 Stunden — mit sichtbarem Countdown.', platzhalter: 'z. B. 30' }, async (text) => {
            const rabatt = Math.min(90, Math.max(5, parseInt(text, 10) || 0));
            if (!rabatt) return meldung('Eine Zahl zwischen 5 und 90.');
            const frisch = await datenLies('konto');
            await datenSchreib('konto', { ...frisch, angebot: { artikelId: a.id, rabatt, bis: jetzt() + 24 * 3600000 } });
            pushSenden('sub', 'hinweis', 'Im Laden glimmt ein Angebot.');
            meldung('Läuft 24 Stunden.');
            zeichnen();
          });
        },
      }, 'Angebot')
    ),
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '9px' },
      onclick: async () => {
        const p = Math.max(1, parseInt(preisFeld.value, 10) || a.preis);
        b.schliessen();
        const frisch = await datenLies('konto');
        await datenSchreib('konto', { ...frisch, preise: { ...(frisch.preise || {}), [a.id]: p } });
        meldung('Der Preis steht. Grund? Deiner.');
        zeichnen();
      },
    }, 'Preis setzen')
  );
}
