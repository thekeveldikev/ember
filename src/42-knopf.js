/* ==========================================================================
   42-knopf.js — Der Knopf.

   Zwei Richtungen, die absichtlich nicht dasselbe sind:

   Sie drückt  -> ein Befehl. Sein Bildschirm gehört ihr, sofort, ganz.
   Er drückt   -> eine Bitte. Kleiner, leiser, mit der Möglichkeit zu warten.

   Der Horcher läuft, solange die App offen ist — nicht nur auf der
   Heim-Seite. Ein Befehl erreicht ihn auch mitten im Plausch.
   ========================================================================== */

let _knopfHorcherLaeuft = false;
let _befehlOffen = null;
let _letzterKnopf = null;

/* --- Die Bühne auf der Heim-Seite ----------------------------------------- */

function knopfBuehneBauen(platz) {
  platz.innerHTML = '';
  const buehne = el('div', { class: 'knopfbuehne' });
  platz.append(buehne);

  if (istDomme()) {
    /* Tippen öffnet das Blatt (Worte, Zeitraum). Halten schickt sofort —
       ohne ein einziges Wort, dafür mit dem Ring, der sich schließt. */
    const ring = el('div', { class: 'haltering', html:
      '<svg viewBox="0 0 100 100"><circle class="spur" cx="50" cy="50" r="47.5"/>' +
      '<circle class="lauf" cx="50" cy="50" r="47.5"/></svg>' });
    const knopf = el('button', { class: 'derknopf' }, ring, el('span', {}, 'SEX'));
    knopfHaltenBinden(knopf, ring,
      () => befehlBlatt(),
      () => befehlSofort());
    buehne.append(knopf);
    buehne.append(el('p', { class: 'still klein mitte', style: { marginTop: '14px' } },
      'Tippen für Worte und Zeit · Halten schickt sofort'));
    offeneBitteZeigen(platz);
  } else {
    const knopf = el('button', { class: 'derknopf bitte', onclick: () => bitteBlatt() }, 'Bitte');
    buehne.append(knopf);
    eigeneBitteZeigen(platz, knopf);
  }
}

/* --- Sie: der Befehl ------------------------------------------------------ */

/* Halten mit sichtbarem Fortschritt: Der Ring füllt sich, solange der
   Finger liegt. Voll heißt gesendet. Loslassen vorher heißt: nur getippt. */
function knopfHaltenBinden(knopf, ring, beiTipp, beiVoll, ms = 850) {
  let uhr = null;
  let ausgeloest = false;

  const anfangen = () => {
    ausgeloest = false;
    ring.classList.add('laeuft');
    uhr = setTimeout(() => {
      ausgeloest = true;
      ring.classList.remove('laeuft');
      knopf.classList.add('gezuendet');
      setTimeout(() => knopf.classList.remove('gezuendet'), 500);
      beiVoll();
    }, ms);
  };
  const abbrechen = () => {
    clearTimeout(uhr);
    ring.classList.remove('laeuft');
  };

  knopf.addEventListener('pointerdown', anfangen);
  knopf.addEventListener('pointerup', abbrechen);
  knopf.addEventListener('pointerleave', abbrechen);
  knopf.addEventListener('pointercancel', abbrechen);
  knopf.addEventListener('contextmenu', (e) => e.preventDefault());
  knopf.addEventListener('click', (e) => {
    if (ausgeloest) { e.preventDefault(); e.stopPropagation(); return; }
    beiTipp();
  });
}

/* Der Sofort-Weg: kein Blatt, kein Text — der Knopf selbst ist die Nachricht. */
async function befehlSofort() {
  tonSpielen('tief');
  puls('befehl');
  await datenSchreib('knopf/aktuell', {
    art: 'befehl', text: '', bis: null, wann: jetzt(), quittiert: false,
  });
  pushSenden('sub', 'befehl');
  meldung('Er weiß Bescheid.');
}

function befehlBlatt() {
  const feld = el('textarea', { class: 'feld', rows: 2, placeholder: 'Ohne Worte, oder mit.' });
  const minuten = el('input', {
    class: 'feld', type: 'number', inputmode: 'numeric', min: '1', max: '720',
    placeholder: 'Minuten', style: { marginTop: '9px' },
  });

  const b = blatt(
    el('h2', {}, 'SEX'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Sein Bildschirm gehört dir, sobald du drückst.'),
    feld,
    el('div', {},
      el('p', { class: 'winzig still', style: { marginTop: '15px' } }, 'Er hat … (leer = keine Frist)'),
      minuten
    ),
    el('div', { class: 'knopfreihe', style: { marginTop: '18px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Doch nicht'),
      el('button', { class: 'knopf glut', onclick: (e) => senden(e.target) }, 'Senden')
    )
  );

  async function senden(knopf) {
    if (knopf) knopf.disabled = true;
    const text = feld.value.trim();
    const frist = parseInt(minuten.value, 10) || 0;
    b.schliessen();

    await datenSchreib('knopf/aktuell', {
      art: 'befehl',
      text,
      bis: frist > 0 ? jetzt() + frist * 60000 : null,
      wann: jetzt(),
      quittiert: false,
    });

    pushSenden('sub', 'befehl');
    puls('befehl');
    meldung('Angekommen.');
  }

  setTimeout(() => feld.focus(), 260);
}

/* Was er gebeten hat — mit den beiden Antworten, die zählen. */
async function offeneBitteZeigen(platz) {
  const aktuell = await datenLies('knopf/aktuell');
  if (!aktuell || aktuell.art !== 'bitte' || aktuell.antwort) return;

  platz.append(
    el('div', { class: 'karte glimmt', style: { marginTop: '4px' } },
      el('p', { class: 'winzig still', style: { marginBottom: '8px' } },
        nameVon('sub') + ' bittet · ' + vorZeit(aktuell.wann)),
      aktuell.text ? el('p', { class: 'zier', style: { fontSize: '18px', marginBottom: '14px' } }, aktuell.text) : null,
      el('div', { class: 'knopfreihe' },
        el('button', { class: 'knopf leer warnend', onclick: () => antworten(false) }, 'Nein'),
        el('button', { class: 'knopf glut', onclick: () => antworten(true) }, 'Ja')
      ),
      el('button', {
        class: 'winzig still', style: { marginTop: '13px' },
        onclick: () => antwortMitBedingung(),
      }, 'Ja, aber …')
    )
  );

  async function antworten(ok, bedingung) {
    await datenSchreib('knopf/aktuell', { ...aktuell, antwort: { ok, text: bedingung || '', wann: jetzt() } });
    pushSenden('sub', 'antwort');
    puls(ok ? 'antwortJa' : 'antwortNein');
    meldung(ok ? 'Ja.' : 'Nein.');
    heimAuffrischen('knopf');
  }

  function antwortMitBedingung() {
    eingabeBlatt({
      titel: 'Ja, aber',
      hinweis: 'Die Bedingung sieht nur er.',
      platzhalter: 'Erst wenn …',
      mehrzeilig: true,
      jaText: 'Senden',
    }, (text) => antworten(true, text));
  }
}

/* --- Er: die Bitte -------------------------------------------------------- */

function bitteBlatt() {
  eingabeBlatt({
    titel: 'Bitte',
    hinweis: 'Sie sieht, dass du gefragt hast. Wann sie antwortet, entscheidet sie.',
    platzhalter: 'Etwas dazu? Muss nicht.',
    mehrzeilig: true,
    leerErlaubt: true,
    jaText: 'Fragen',
  }, async (text) => {
    await datenSchreib('knopf/aktuell', {
      art: 'bitte', text, wann: jetzt(), antwort: null, gesehen: false,
    });
    pushSenden('domme', 'bitte');
    puls('bitte');
    meldung('Gefragt.');
    if (typeof maschineEreignis === 'function') maschineEreignis('knopf');
    heimAuffrischen('knopf');
  });
}

/* Was aus seiner Bitte wurde. Im Zögern-Modus sagt die App bewusst nichts
   darüber, ob sie schon hingesehen hat. Das Warten ist der Punkt. */
async function eigeneBitteZeigen(platz, knopf) {
  const aktuell = await datenLies('knopf/aktuell');
  if (!aktuell || aktuell.art !== 'bitte') return;

  const zoegern = await datenLies('einst/zoegern', false);

  if (aktuell.antwort) {
    const ja = aktuell.antwort.ok;
    platz.append(
      el('div', { class: 'karte' + (ja ? ' glimmt' : ''), style: { marginTop: '4px' } },
        el('p', { class: 'winzig still', style: { marginBottom: '7px' } }, 'Ihre Antwort'),
        el('p', { class: 'zier', style: { fontSize: '24px', color: ja ? 'var(--glut-hell)' : 'var(--rot)' } },
          ja ? 'Ja' : 'Nein'),
        aktuell.antwort.text ? el('p', { class: 'leise', style: { marginTop: '9px' } }, aktuell.antwort.text) : null,
        el('button', {
          class: 'winzig still', style: { marginTop: '13px' },
          onclick: async () => { await datenLoesch('knopf/aktuell'); heimAuffrischen('knopf'); },
        }, 'Wegräumen')
      )
    );
    return;
  }

  knopf.classList.add('wartet');
  platz.append(
    el('p', { class: 'still klein mitte', style: { marginTop: '-8px' } },
      zoegern ? 'Gefragt.' : 'Gefragt · ' + vorZeit(aktuell.wann))
  );
}

/* --- Der Empfang ---------------------------------------------------------- */

/* Läuft ab dem Start durchgehend. Ein Befehl darf nicht darauf warten,
   dass er zufällig auf der richtigen Seite steht. */

function knopfHorcherStarten() {
  if (_knopfHorcherLaeuft) return;
  _knopfHorcherLaeuft = true;

  ablageHorch('knopf/aktuell', async () => {
    const aktuell = await datenLies('knopf/aktuell');
    /* Der Stempel muss jede Wendung enthalten, auf die jemand wartet —
       sonst übergeht der Horcher sie stillschweigend. Das Quittieren
       gehörte anfangs nicht dazu, und sie erfuhr nie davon. */
    const stempel = aktuell
      ? [aktuell.wann, aktuell.antwort ? 'a' : '-', aktuell.quittiert ? 'q' : '-'].join(':')
      : 'leer';
    if (stempel === _letzterKnopf) return;
    const ersterDurchlauf = _letzterKnopf === null;
    _letzterKnopf = stempel;

    /* Die Zahl am App-Symbol: Ein unquittierter Befehl zählt eins, sonst
       null. iOS kann das ab 16.4 für installierte Apps — wo nicht, tut
       der Versuch einfach nichts. */
    try {
      const offenerBefehl = aktuell && aktuell.art === 'befehl' && !aktuell.quittiert && !istDomme();
      if (navigator.setAppBadge && offenerBefehl) navigator.setAppBadge(1);
      else if (navigator.clearAppBadge) navigator.clearAppBadge();
    } catch { /* dann eben ohne Zahl */ }

    if (!aktuell) {
      if (_befehlOffen) befehlSchliessen();
      return;
    }

    /* Beim Start nicht rückwirkend übernehmen — nur was frisch ist. */
    const frisch = jetzt() - aktuell.wann < 5 * 60000;

    if (aktuell.art === 'befehl' && !istDomme() && !aktuell.quittiert) {
      if (!ersterDurchlauf || frisch) befehlZeigen(aktuell);
      return;
    }

    if (aktuell.art === 'befehl' && istDomme() && aktuell.quittiert && !ersterDurchlauf) {
      puls('antwortJa');
      meldung(nameVon('sub') + ': Jawohl.');
      heimAuffrischen('knopf');
      return;
    }

    if (aktuell.art === 'bitte' && istDomme() && !aktuell.antwort && !ersterDurchlauf) {
      puls('bitte');
      meldungMitTat(nameVon('sub') + ' fragt.', 'Ansehen', () => zeigeSeite('heim'), 10000);
    }

    if (aktuell.art === 'bitte' && !istDomme() && aktuell.antwort && !ersterDurchlauf) {
      puls(aktuell.antwort.ok ? 'antwortJa' : 'antwortNein');
      meldungMitTat('Sie hat geantwortet.', 'Ansehen', () => zeigeSeite('heim'), 10000);
    }

    if (!_befehlOffen) heimAuffrischen('knopf');
  });

  /* Der stille Impuls: kein Wort, nur Anwesenheit. */
  ablageHorch('puls/' + D.rolle, async (weg, wert) => {
    if (!wert) return;
    const letzter = Gerät.lies('pulsGesehen', 0);
    const klar = await datenLies('puls/' + D.rolle);
    if (!klar || klar.wann <= letzter) return;
    Gerät.schreib('pulsGesehen', klar.wann);
    if (jetzt() - klar.wann > 120000) return;
    puls('denkAnDich');
    denkAnDichZeigen();
  });
}

/* --- Der Befehl auf seinem Bildschirm ------------------------------------- */

function befehlZeigen(befehl) {
  /* Rot heißt: nichts geht weiter. Auch kein neuer Befehl — er bleibt
     liegen und kommt hoch, wenn die Ruhe vorbei ist und der Horcher das
     nächste Mal hinsieht. */
  if (D.ruhe) return;

  if (_befehlOffen) _befehlOffen.remove();
  puls('befehl');

  const uhr = el('div', { class: 'uhr' });
  const schirm = el('div', { class: 'befehl' },
    el('div', { class: 'wort' }, nameVon('domme')),
    el('div', { class: 'text' }, befehl.text || 'SEX.'),
    befehl.bis ? uhr : null,
    el('button', {
      class: 'knopf glut',
      style: { minWidth: '190px', marginTop: '10px' },
      onclick: async () => {
        befehlSchliessen();
        await datenSchreib('knopf/aktuell', { ...befehl, quittiert: true, quittiertWann: jetzt() });
        pushSenden('domme', 'antwort', 'Quittiert.');
      },
    }, 'Jawohl')
  );

  /* Es gibt keinen Weg hinaus außer der Zusage. Das ist gewollt — der
     Notausgang bleibt trotzdem offen, er liegt in 51-notaus.js. */
  document.body.append(schirm);
  _befehlOffen = schirm;

  if (befehl.bis) {
    const ticken = () => {
      const uebrig = befehl.bis - jetzt();
      if (uebrig <= 0) {
        uhr.textContent = '00:00';
        uhr.style.color = 'var(--rot)';
        clearInterval(takt);
        puls('befehl');
        return;
      }
      uhr.textContent = dauerText(uebrig);
    };
    ticken();
    const takt = setInterval(ticken, 1000);
    schirm._takt = takt;
  }
}

function befehlSchliessen() {
  if (!_befehlOffen) return;
  if (_befehlOffen._takt) clearInterval(_befehlOffen._takt);
  _befehlOffen.style.animation = 'befehlAn .26s ease reverse';
  const weg = _befehlOffen;
  setTimeout(() => weg.remove(), 240);
  _befehlOffen = null;
}

/* --- Denk an dich --------------------------------------------------------- */

function denkAnDichZeigen() {
  const funke = el('div', {
    style: {
      position: 'fixed', inset: '0', zIndex: '760', display: 'grid', placeItems: 'center',
      pointerEvents: 'none', background: 'radial-gradient(circle, rgba(196,120,90,.16), transparent 62%)',
      animation: 'deckelAn .3s ease',
    },
  }, el('div', { class: 'funke', style: { width: '18px', height: '18px' } }));

  document.body.append(funke);
  setTimeout(() => {
    funke.style.transition = 'opacity .6s ease';
    funke.style.opacity = '0';
    setTimeout(() => funke.remove(), 620);
  }, 1500);
}
