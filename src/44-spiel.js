/* ==========================================================================
   44-spiel.js — Das Spiel.

   Die Decks sind leer, bis ihr sie füllt. Absicht: Fremde Vorschläge treffen
   nie euren Ton. Was hier steht, habt ihr geschrieben.
   ========================================================================== */

/* Nur Vorschläge für den Namen eines neuen Fachs — kein Inhalt. */
const FACH_VORSCHLAEGE = ['Sanft', 'Scharf', 'Hart', 'Draußen', 'Strafe', 'Verwöhnen', 'Romantik'];

/* Jedes Vorrat-Deck bekommt sein eigenes Strich-Sinnbild — Emojis
   wirken hier billig, und die App hat eine eigene Handschrift. */
const DECK_SINNBILDER = {
  soft: 'kerze', spicy: 'flamme', hardcore: 'kette', oral: 'mund',
  haende: 'hand', toys: 'zauber', public: 'mond', bestrafung: 'waage',
  verwoehnen: 'geschenk', romantik: 'herz', training: 'pfeilauf',
  distanz: 'brief', kontrolle: 'schloss', sinne: 'feder', worte: 'plausch',
};

SEITEN.spiel = function (seite) {
  seite.append(kopfzeile('Spiel'));

  /* Die Wege zu den einzelnen Spielen. Sie stehen oben, weil die Decks
     darunter beliebig lang werden können. */
  seite.append(
    el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '9px', marginBottom: '14px' } },
      spielKachel('Rad', 'Drehen lassen', 'rad'),
      spielKachel('Baukasten', 'Würfeln', 'szenario'),
      spielKachel('Wahrheit', 'oder Pflicht', 'wahrheit'),
      spielKachel('Lose', 'Freirubbeln', 'rubbeln'),
      spielKachel('Quiz', 'Kennst du mich?', 'quiz'),
      spielKachel('Regie', 'Die App dirigiert', 'regie'),
      spielKachel('Timer', 'Auch mit Zufall', 'timer'),
      spielKachel('Der Laden', 'Glut verdienen, Glut ausgeben', 'laden')
    )
  );

  const bossplatz = el('div', { style: { marginBottom: '22px' } });
  seite.append(bossplatz);
  const bossStopp = datenHorch('bosse', (bosse) => bossZeichnen(bossplatz, bosse));
  beimVerlassen(bossStopp);

  seite.append(kopfzeile('Decks',
    istDomme() ? el('button', { class: 'winzig still', onclick: () => dareAnlegen() }, '+ Karte') : null
  ));

  const deckplatz = el('div');
  seite.append(deckplatz);

  seite.append(
    el('div', { class: 'trenner' }),
    el('div', { class: 'knopfreihe' },
      el('button', { class: 'knopf leer', onclick: muenzwurf }, 'Münze'),
      el('button', { class: 'knopf glut', onclick: ueberraschMich }, 'Überrasch mich')
    )
  );

  const stopp = datenHorch('dares', (karten) => deckZeichnen(deckplatz, karten));
  beimVerlassen(stopp);
};

function spielKachel(titel, unter, ziel) {
  return el('button', {
    class: 'karte',
    style: { textAlign: 'left', padding: '15px 16px' },
    onclick: () => zeigeSeite(ziel),
  },
    el('div', { class: 'zier', style: { fontSize: '17px' } }, titel),
    el('div', { class: 'still klein', style: { marginTop: '1px' } }, unter)
  );
}

/* --- Die Decks ------------------------------------------------------------ */

function deckZeichnen(platz, karten) {
  platz.innerHTML = '';

  const vorratDecks = vorratDeckListe();

  if (!karten.length && !vorratDecks.length) {
    platz.append(leerlauf('Leere Decks',
      istDomme() ? 'Leg die erste Karte an — dann gibt es etwas zu ziehen.'
        : 'Noch nichts drin. Das entscheidet sie.'));
    return;
  }

  /* Die eigenen Fächer entstehen aus den Karten selbst, nicht aus einer Liste. */
  const faecher = {};
  karten.forEach((k) => {
    const f = k.fach || 'Ohne Fach';
    (faecher[f] = faecher[f] || []).push(k);
  });

  Object.entries(faecher).sort().forEach(([name, drin]) => {
    const stapel = el('button', {
      class: 'karte glimmt',
      style: {
        width: '100%', textAlign: 'left', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between', gap: '12px',
      },
      onclick: () => karteZiehen(name, drin),
    },
      el('div', {},
        el('div', { class: 'zier', style: { fontSize: '19px' } }, name),
        el('div', { class: 'still klein', style: { marginTop: '2px' } },
          drin.length + (drin.length === 1 ? ' Karte' : ' Karten'))
      ),
      el('div', { class: 'zier glutschrift', style: { fontSize: '26px' } }, '▸')
    );

    if (istDomme()) langerDruck(stapel, () => fachVerwalten(name, drin));
    platz.append(stapel);
  });

  /* Der Vorrat: fertig gefüllte Decks, gefiltert nach ihrer Obergrenze.
     Sie stehen unter den eigenen — das Eigene hat immer den Vortritt. */
  if (vorratDecks.length) {
    if (karten.length) {
      platz.append(el('p', { class: 'winzig still', style: { margin: '18px 0 8px 2px' } }, 'Aus dem Vorrat'));
    }
    const gitter = el('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } });
    vorratDecks.forEach((deck) => {
      gitter.append(el('button', {
        class: 'karte',
        style: { textAlign: 'left', padding: '13px 14px' },
        onclick: () => karteZiehen(deck.name, deck.karten.map((k) => ({
          titel: null, text: k.text, stufe: k.intensitaet, dauer: k.dauer_min, vorrat: true,
        }))),
      },
        el('div', { style: { marginBottom: '5px', color: 'var(--glut-hell)' } },
          sinnbild(DECK_SINNBILDER[deck.key] || 'flamme', 21)),
        el('div', { class: 'zier', style: { fontSize: '16px' } }, deck.name),
        el('div', { class: 'still klein', style: { marginTop: '1px' } },
          deck.karten.length + ' · ' + deck.beschreibung)
      ));
    });
    platz.append(gitter);
  }
}

/* --- Ziehen --------------------------------------------------------------- */

function karteZiehen(fach, karten) {
  const karte = zufall(karten);
  puls('hinweis');

  const ruecken = el('div', {
    style: {
      display: 'grid', placeItems: 'center', minHeight: '210px',
      borderRadius: '18px', background: 'var(--verlauf-tief)',
      boxShadow: '0 8px 34px -10px var(--schein)',
      transition: 'transform .5s cubic-bezier(.4,0,.2,1), opacity .3s ease',
      transformStyle: 'preserve-3d',
    },
  }, el('div', { class: 'zier', style: { fontSize: '30px', color: '#1b0f09', letterSpacing: '.1em' } }, fach));

  const vorne = el('div', {
    style: {
      display: 'none', minHeight: '210px', padding: '24px 22px',
      borderRadius: '18px', background: 'var(--flaeche-hoch)',
      border: '1px solid rgba(196,120,90,.35)',
      boxShadow: '0 8px 34px -12px var(--schein)',
      animation: 'einblenden .34s ease',
    },
  },
    el('p', { class: 'winzig still', style: { marginBottom: '11px', display: 'flex', alignItems: 'center', gap: '8px' } },
      fach,
      karte.stufe ? glutPunkte(karte.stufe) : null,
      karte.dauer ? '~' + karte.dauer + ' Min' : null),
    karte.titel
      ? el('div', { class: 'zier', style: { fontSize: '23px', lineHeight: '1.3', marginBottom: '10px' } }, karte.titel)
      : null,
    karte.text ? el('p', {
      class: karte.titel ? 'leise' : 'zier',
      style: {
        whiteSpace: 'pre-wrap',
        fontSize: karte.titel ? '' : '20px',
        lineHeight: karte.titel ? '' : '1.35',
      },
    }, karte.text) : null
  );

  const b = blatt(ruecken, vorne, el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
    el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Weglegen'),
    el('button', {
      class: 'knopf glut',
      onclick: async () => {
        b.schliessen();
        await datenAnhaengen('auftraege', {
          titel: karte.titel || karte.text, text: karte.titel ? karte.text : '',
          fach, art: 'dare', erledigt: false, bestaetigt: false,
        });
        pushSenden(istDomme() ? 'sub' : 'domme', 'auftrag');
        meldung('Liegt bei den Aufträgen.');
      },
    }, istDomme() ? 'Ihm geben' : 'Annehmen')
  ));

  /* Erst umdrehen, dann lesen. Der Moment dazwischen ist der halbe Spaß. */
  setTimeout(() => {
    ruecken.style.transform = 'rotateY(90deg)';
    ruecken.style.opacity = '0';
    setTimeout(() => {
      ruecken.style.display = 'none';
      vorne.style.display = 'block';
      tonSpielen('papier');
    }, 320);
  }, 480);
}

/* --- Karten pflegen ------------------------------------------------------- */

function dareAnlegen(vorbelegtesFach) {
  const titel = el('input', { class: 'feld', placeholder: 'Worum geht es?' });
  const text = el('textarea', { class: 'feld', rows: 3, placeholder: 'Genauer, wenn nötig.', style: { marginTop: '9px' } });
  const fach = el('input', { class: 'feld', placeholder: 'Fach', value: vorbelegtesFach || '', list: 'fachliste', style: { marginTop: '9px' } });
  const stufe = el('input', { class: 'feld', type: 'number', min: '1', max: '5', placeholder: 'Stufe 1–5', style: { marginTop: '9px' } });

  const liste = el('datalist', { id: 'fachliste' }, ...FACH_VORSCHLAEGE.map((f) => el('option', { value: f })));

  const b = blatt(
    el('h2', {}, 'Neue Karte'),
    el('div', { style: { height: '12px' } }),
    titel, text, fach, stufe, liste,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!titel.value.trim()) return meldung('Ein Titel fehlt.');
          b.schliessen();
          await datenAnhaengen('dares', {
            titel: titel.value.trim(),
            text: text.value.trim(),
            fach: fach.value.trim() || 'Ohne Fach',
            stufe: parseInt(stufe.value, 10) || null,
          });
          meldung('Im Deck.');
        },
      }, 'Anlegen')
    )
  );
  setTimeout(() => titel.focus(), 260);
}

function fachVerwalten(name, karten) {
  const b = blatt(
    el('h2', {}, name),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } }, karten.length + ' Karten'),
    ...karten.map((k) => el('div', {
      class: 'karte',
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', padding: '12px 14px' },
    },
      el('div', { style: { flex: '1', minWidth: '0' } },
        el('div', { style: { fontWeight: '500' } }, k.titel),
        k.text ? el('div', { class: 'still klein', style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, k.text) : null
      ),
      el('button', {
        class: 'winzig', style: { color: 'var(--rot)', padding: '8px' },
        onclick: async () => {
          await datenEintragLoeschen('dares', k.id);
          b.schliessen();
        },
      }, 'Weg')
    )),
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '14px' },
      onclick: () => { b.schliessen(); dareAnlegen(name); },
    }, '+ Karte in dieses Fach')
  );
}

/* --- Überrasch mich -------------------------------------------------------- */

/* Die App entscheidet selbst, was jetzt dran ist. Der halbe Reiz liegt
   darin, den Daumen einmal NICHT entscheiden zu lassen. */
function ueberraschMich() {
  const wege = [];

  const decks = vorratDeckListe();
  if (decks.length) wege.push(() => {
    const deck = zufall(decks);
    karteZiehen(deck.name, deck.karten.map((k) => ({
      titel: null, text: k.text, stufe: k.intensitaet, dauer: k.dauer_min, vorrat: true,
    })));
  });

  const raeder = vorratRaeder();
  if (raeder.length) wege.push(() => radDrehen([_vorratRadFuerDrehung(zufall(raeder))]));

  if (vorratAn() && vorratSzenario()) wege.push(() => szenarioGenerieren());

  wege.push(() => timerLaufen((3 + Math.random() * 17) * 60000, null));
  wege.push(muenzwurf);

  puls('hinweis');
  tonSpielen('tick');
  zufall(wege)();
}

/* --- Die Münze ------------------------------------------------------------ */

function muenzwurf() {
  const seiten = ['Ja', 'Nein'];
  const muenze = el('div', {
    class: 'zier',
    style: {
      display: 'grid', placeItems: 'center', width: '128px', height: '128px', margin: '10px auto 0',
      borderRadius: '50%', background: 'var(--verlauf)', color: '#1b0f09', fontSize: '25px',
      boxShadow: '0 8px 30px -10px var(--schein)', transition: 'transform .12s linear',
    },
  }, '…');

  const b = blatt(el('h2', { class: 'mitte' }, 'Münze'), muenze,
    el('button', { class: 'knopf leer breit', style: { marginTop: '20px' }, onclick: () => b.schliessen() }, 'Schließen'));

  let drehung = 0;
  let runden = 0;
  const takt = setInterval(() => {
    drehung += 180;
    runden++;
    muenze.style.transform = 'rotateX(' + drehung + 'deg)';
    muenze.textContent = seiten[runden % 2];
    if (runden > 11) {
      clearInterval(takt);
      muenze.textContent = zufall(seiten);
      muenze.style.transform = 'none';
      puls('hinweis');
    }
  }, 105);
}
