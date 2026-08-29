/* ==========================================================================
   48-wachsen.js — Werte, Stufen, Karma, Auszeichnungen.

   Ein Rollenspiel-System, das sich nicht wie eine Schrittzähler-App anfühlt.
   Der Unterschied liegt darin, wer vergibt: Punkte kommen nicht aus einer
   Formel, sondern von ihr. Die App rechnet nur zusammen.

   Was er sieht:  seinen Stand, seinen Rang, die nächste Schwelle.
   Was er nicht sieht:  was hinter der Schwelle liegt.
   ========================================================================== */

const WERTE = [
  { id: 'gehorsam', marke: 'Gehorsam' },
  { id: 'ausdauer', marke: 'Ausdauer' },
  { id: 'beherrschung', marke: 'Beherrschung' },
  { id: 'mut', marke: 'Mut' },
  { id: 'aufmerksamkeit', marke: 'Aufmerksamkeit' },
  { id: 'hingabe', marke: 'Hingabe' },
];

/* Die Schwellen wachsen, damit die frühen Stufen schnell kommen und die
   späten etwas bedeuten. */
function stufeAus(xp) {
  let stufe = 1;
  let schwelle = 100;
  let uebrig = xp || 0;
  while (uebrig >= schwelle) {
    uebrig -= schwelle;
    stufe++;
    schwelle = Math.round(schwelle * 1.35);
  }
  return { stufe, imLevel: uebrig, bisNaechste: schwelle };
}

SEITEN.wachsen = function (seite) {
  seite.append(kopfzeile('Wachsen',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));

  const standplatz = el('div', { class: 'abschnitt' });
  const werteplatz = el('div', { class: 'abschnitt' });
  const karmaplatz = el('div', { class: 'abschnitt' });
  const ehrenplatz = el('div', { class: 'abschnitt' });
  seite.append(standplatz, werteplatz, karmaplatz, ehrenplatz);

  const zeichnen = async () => {
    const stand = await datenLies('wachsen/stand', {});
    standZeichnen(standplatz, stand);
    const paarstand = await datenLies('paarstand', { xp: 0 });
    paarKarte(standplatz, paarstand);
    werteZeichnen(werteplatz, stand);
    karmaZeichnen(karmaplatz, stand);
  };

  zeichnen();
  const s1 = ablageHorch('wachsen/stand', zeichnen);
  const s2 = datenHorch('ehren', (liste) => ehrenZeichnen(ehrenplatz, liste));

  beimVerlassen(() => { s1.then((f) => f && f()).catch(() => {}); });
  beimVerlassen(s2);
};

/* --- Stufe und Rang ------------------------------------------------------- */

function standZeichnen(platz, stand) {
  const { stufe, imLevel, bisNaechste } = stufeAus(stand.xp);
  const raenge = stand.raenge || {};
  const rang = raenge[String(stufe)] || '';
  const anteil = Math.max(0, Math.min(1, imLevel / bisNaechste));

  platz.innerHTML = '';
  platz.append(
    el('div', { class: 'karte glimmt', style: { textAlign: 'center' } },
      el('p', { class: 'winzig still' }, nameVon('sub')),
      el('div', { class: 'zier glutschrift', style: { fontSize: '52px', lineHeight: '1.1', margin: '4px 0' } },
        String(stufe)),
      el('p', { class: 'zier', style: { fontSize: '19px', minHeight: '25px' } }, rang || 'Stufe ' + stufe),

      /* Der Balken bis zur nächsten Stufe. */
      el('div', {
        style: {
          height: '7px', borderRadius: '4px', margin: '17px 0 7px',
          background: 'var(--grund2)', overflow: 'hidden',
          boxShadow: 'inset 0 0 0 1px var(--kante)',
        },
      }, el('div', {
        style: {
          height: '100%', width: (anteil * 100) + '%',
          background: 'var(--verlauf)', borderRadius: '4px',
          transition: 'width .6s cubic-bezier(.2,.8,.3,1)',
          boxShadow: '0 0 12px var(--schein)',
        },
      })),
      el('p', { class: 'winzig still' }, imLevel + ' / ' + bisNaechste),

      istDomme() ? el('div', { class: 'knopfreihe', style: { marginTop: '17px' } },
        el('button', { class: 'knopf leer', style: { minHeight: '40px', fontSize: '13px' }, onclick: () => raengeBenennen(stand) }, 'Ränge'),
        el('button', { class: 'knopf glut', style: { minHeight: '40px', fontSize: '13px' }, onclick: () => xpVergeben(stand) }, 'Vergeben')
      ) : null
    )
  );
}

/* --- Die Werte ------------------------------------------------------------ */

/* Als Balken, nicht als Netzdiagramm: Ein Netz sieht in einer Vorführung
   gut aus, aber auf einem Handy liest man Balken schneller. */
function werteZeichnen(platz, stand) {
  const werte = stand.werte || {};
  const groesster = Math.max(20, ...WERTE.map((w) => werte[w.id] || 0));

  platz.innerHTML = '';
  platz.append(kopfzeile('Werte'));

  const karte = el('div', { class: 'karte' });
  WERTE.forEach((w, i) => {
    const wert = werte[w.id] || 0;
    karte.append(el('div', { style: { marginTop: i ? '13px' : '0' } },
      el('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '5px' } },
        el('span', { class: 'klein' }, w.marke),
        el('span', { class: 'klein', style: { color: 'var(--glut-hell)', fontVariantNumeric: 'tabular-nums' } }, String(wert))
      ),
      el('div', {
        style: { height: '5px', borderRadius: '3px', background: 'var(--grund2)', overflow: 'hidden' },
      }, el('div', {
        style: {
          height: '100%', width: ((wert / groesster) * 100) + '%',
          background: 'var(--verlauf)', borderRadius: '3px',
          transition: 'width .6s cubic-bezier(.2,.8,.3,1)',
        },
      }))
    ));
  });

  if (istDomme()) langerDruck(karte, () => werteSetzen(stand));
  platz.append(karte);
  if (istDomme()) {
    platz.append(el('p', { class: 'winzig still mitte', style: { marginTop: '9px' } },
      'Lang drücken zum Ändern'));
  }
}

/* --- Karma ---------------------------------------------------------------- */

function karmaZeichnen(platz, stand) {
  const karma = stand.karma || 0;
  const marken = stand.marken || 0;
  const schwelle = stand.markenSchwelle || 20;

  platz.innerHTML = '';
  platz.append(kopfzeile('Karma'));

  platz.append(
    el('div', { class: 'karte', style: { display: 'flex', alignItems: 'center', gap: '18px' } },
      el('div', { style: { textAlign: 'center', minWidth: '78px' } },
        el('div', {
          class: 'zier',
          style: {
            fontSize: '34px',
            color: karma < 0 ? 'var(--rot)' : karma > 0 ? 'var(--glut-hell)' : 'var(--schrift-leise)',
          },
        }, (karma > 0 ? '+' : '') + karma),
        el('div', { class: 'winzig still' }, 'Punkte')
      ),
      el('div', { style: { flex: '1' } },
        marken > 0
          ? el('div', { class: 'zier', style: { fontSize: '17px', color: 'var(--glut-hell)' } },
              marken + (marken === 1 ? ' Wunsch offen' : ' Wünsche offen'))
          : el('p', { class: 'leise klein' },
              'Bei ' + schwelle + ' Punkten wird ein Wunsch frei.'),
        marken > 0 && !istDomme()
          ? el('button', {
              class: 'knopf glut breit', style: { marginTop: '11px', minHeight: '40px', fontSize: '13px' },
              onclick: () => wunschAeussern(stand),
            }, 'Wünschen')
          : null
      )
    )
  );

  if (istDomme()) {
    platz.append(el('div', { class: 'knopfreihe', style: { marginTop: '9px' } },
      el('button', { class: 'knopf leer', style: { minHeight: '40px' }, onclick: () => karmaAendern(stand, -1) }, '−'),
      el('button', { class: 'knopf leer', style: { minHeight: '40px' }, onclick: () => karmaAendern(stand, +1) }, '+')
    ));
  }
}

async function karmaAendern(stand, richtung) {
  const karma = (stand.karma || 0) + richtung;
  const schwelle = stand.markenSchwelle || 20;

  const neu = { ...stand, karma };

  /* Die Schwelle löst von selbst aus — sie soll nicht daran hängen, ob
     jemand daran denkt. */
  if (karma >= schwelle) {
    neu.karma = karma - schwelle;
    neu.marken = (stand.marken || 0) + 1;
    meldung('Ein Wunsch ist frei geworden.');
    pushSenden('sub', 'hinweis', 'Etwas hat sich freigeschaltet.');
  } else {
    meldung((richtung > 0 ? '+1' : '−1') + ' · jetzt ' + karma);
  }

  await datenSchreib('wachsen/stand', neu);
  puls(richtung > 0 ? 'antwortJa' : 'antwortNein');
}

function wunschAeussern(stand) {
  eingabeBlatt({
    titel: 'Ein Wunsch',
    hinweis: 'Sie sieht ihn. Ob sie ihn erfüllt, steht auf einem anderen Blatt.',
    platzhalter: 'Ich wünsche mir …',
    mehrzeilig: true,
    jaText: 'Äußern',
  }, async (text) => {
    await datenAnhaengen('wuensche', { text, art: 'token', erfuellt: false });
    await datenSchreib('wachsen/stand', { ...stand, marken: Math.max(0, (stand.marken || 0) - 1) });
    pushSenden('domme', 'hinweis', 'Er hat sich etwas gewünscht.');
    meldung('Sie weiß es.');
  });
}

/* --- Auszeichnungen ------------------------------------------------------- */

function ehrenZeichnen(platz, liste) {
  platz.innerHTML = '';
  platz.append(kopfzeile('Auszeichnungen',
    istDomme() ? el('button', { class: 'winzig still', onclick: ehreAnlegen }, '+ Neu') : null
  ));

  const verliehen = liste.filter((e) => e.verliehen);
  const offen = liste.filter((e) => !e.verliehen);

  if (!liste.length) {
    platz.append(leerlauf('Noch keine',
      istDomme() ? 'Denk dir welche aus — und verleih sie, wenn es so weit ist.' : 'Noch nichts verdient.'));
    return;
  }

  if (verliehen.length) {
    platz.append(el('div', {
      style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(96px, 1fr))', gap: '9px' },
    }, ...verliehen.map((e) => {
      const kachel = el('div', {
        class: 'karte glimmt',
        style: { textAlign: 'center', padding: '14px 8px' },
      },
        el('div', { style: { fontSize: '27px', lineHeight: '1.1' } }, e.zeichen || '✦'),
        el('div', { class: 'klein', style: { marginTop: '6px', lineHeight: '1.25' } }, e.titel),
        el('div', { class: 'winzig still', style: { marginTop: '3px' } }, vorZeit(e.verliehenWann || e.wann))
      );
      langerDruck(kachel, () => ehreAnsehen(e));
      return kachel;
    })));
  }

  /* Was noch aussteht, sieht nur sie — sonst wäre die Überraschung weg. */
  if (istDomme() && offen.length) {
    platz.append(el('p', { class: 'winzig still', style: { margin: '17px 0 8px' } }, 'Noch nicht verliehen'));
    offen.forEach((e) => {
      platz.append(el('div', { class: 'karte', style: { display: 'flex', alignItems: 'center', gap: '13px', padding: '12px 14px' } },
        el('div', { style: { fontSize: '21px', opacity: '.5' } }, e.zeichen || '✦'),
        el('div', { style: { flex: '1' } },
          el('div', {}, e.titel),
          e.text ? el('div', { class: 'still klein' }, e.text) : null),
        el('button', {
          class: 'winzig', style: { color: 'var(--glut-hell)', padding: '8px' },
          onclick: () => ehreVerleihen(e),
        }, 'Verleihen')
      ));
    });
  } else if (!istDomme() && offen.length) {
    platz.append(el('p', { class: 'winzig still mitte', style: { marginTop: '15px' } },
      offen.length + ' weitere warten darauf, verdient zu werden.'));
  }
}

async function ehreVerleihen(e) {
  await datenAendern('ehren', e.id, { verliehen: true, verliehenWann: jetzt() });
  pushSenden('sub', 'hinweis', 'Du hast dir etwas verdient.');
  puls('antwortJa');
  meldung('Verliehen.');
}

function ehreAnsehen(e) {
  blatt(
    el('div', { class: 'mitte', style: { padding: '10px 0 4px' } },
      el('div', { style: { fontSize: '54px' } }, e.zeichen || '✦'),
      el('div', { class: 'zier', style: { fontSize: '22px', marginTop: '10px' } }, e.titel),
      e.text ? el('p', { class: 'leise', style: { marginTop: '9px' } }, e.text) : null,
      el('p', { class: 'winzig still', style: { marginTop: '15px' } },
        'Verliehen am ' + new Date(e.verliehenWann || e.wann).toLocaleDateString('de-DE',
          { day: 'numeric', month: 'long', year: 'numeric' }))
    )
  );
}

function ehreAnlegen() {
  const zeichen = el('input', {
    class: 'feld', maxlength: '3', placeholder: '✦',
    style: { textAlign: 'center', fontSize: '26px' },
  });
  const titel = el('input', { class: 'feld', placeholder: 'Wofür?', style: { marginTop: '9px' } });
  const text = el('textarea', { class: 'feld', rows: 2, placeholder: 'Genauer, wenn du magst.', style: { marginTop: '9px' } });

  const b = blatt(
    el('h2', {}, 'Eine Auszeichnung'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Du legst sie an und verleihst sie später — er sieht sie erst dann.'),
    zeichen, titel, text,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!titel.value.trim()) return meldung('Ein Titel fehlt.');
          b.schliessen();
          await datenAnhaengen('ehren', {
            zeichen: zeichen.value.trim() || '✦',
            titel: titel.value.trim(),
            text: text.value.trim(),
            verliehen: false,
          });
          meldung('Angelegt.');
        },
      }, 'Anlegen')
    )
  );
}

/* --- Vergeben (nur sie) --------------------------------------------------- */

function xpVergeben(stand) {
  let punkte = 25;
  const wertwahl = {};

  const knopfreihe = el('div', { style: { display: 'flex', gap: '7px', marginTop: '4px' } });
  const zeichnePunkte = () => {
    knopfreihe.innerHTML = '';
    [10, 25, 50, 100].forEach((p) => {
      knopfreihe.append(el('button', {
        class: 'knopf' + (punkte === p ? ' glut' : ' leer'),
        style: { flex: '1', minHeight: '40px', fontSize: '13px' },
        onclick: () => { punkte = p; zeichnePunkte(); },
      }, '+' + p));
    });
  };
  zeichnePunkte();

  const werteReihe = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' } });
  WERTE.forEach((w) => {
    const knopf = el('button', {
      class: 'knopf leer',
      style: { minHeight: '36px', padding: '6px 12px', fontSize: '12.5px' },
      onclick: () => {
        wertwahl[w.id] = !wertwahl[w.id];
        knopf.className = 'knopf' + (wertwahl[w.id] ? ' glut' : ' leer');
      },
    }, w.marke);
    werteReihe.append(knopf);
  });

  const grund = el('input', { class: 'feld', placeholder: 'Wofür? (freiwillig)', style: { marginTop: '4px' } });

  const b = blatt(
    el('h2', {}, 'Vergeben'),
    el('p', { class: 'winzig still', style: { margin: '14px 0 0' } }, 'Erfahrung'),
    knopfreihe,
    el('p', { class: 'winzig still', style: { margin: '16px 0 0' } }, 'Und worin er gewachsen ist'),
    werteReihe,
    el('p', { class: 'winzig still', style: { margin: '16px 0 0' } }, 'Anlass'),
    grund,
    el('div', { class: 'knopfreihe', style: { marginTop: '18px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          b.schliessen();
          const vorher = stufeAus(stand.xp).stufe;
          const werte = { ...(stand.werte || {}) };
          Object.keys(wertwahl).filter((k) => wertwahl[k]).forEach((k) => {
            werte[k] = (werte[k] || 0) + Math.round(punkte / 5);
          });

          const neu = { ...stand, xp: (stand.xp || 0) + punkte, werte };
          await datenSchreib('wachsen/stand', neu);

          const nachher = stufeAus(neu.xp).stufe;
          if (nachher > vorher) {
            await datenAnhaengen('log', {
              tag: tagstempel(), flammen: 3, stimmung: '✦',
              satz: 'Stufe ' + nachher + ' erreicht.',
            });
            pushSenden('sub', 'hinweis', 'Eine Stufe weiter.');
            stufeAufFeiern(nachher, (neu.raenge || {})[String(nachher)]);
          } else {
            pushSenden('sub', 'hinweis', 'Etwas ist dazugekommen.');
          }
          meldung('+' + punkte + (grund.value.trim() ? ' · ' + grund.value.trim() : ''));
        },
      }, 'Vergeben')
    )
  );
}

/* Ein Aufstieg soll sich nach etwas anfühlen — auch für die, die vergibt. */
function stufeAufFeiern(stufe, rang) {
  puls('befehl');
  const schirm = el('div', {
    style: {
      position: 'fixed', inset: '0', zIndex: '790', display: 'grid', placeItems: 'center',
      background: 'radial-gradient(circle at 50% 45%, rgba(196,120,90,.3), rgba(6,4,3,.94) 68%)',
      animation: 'deckelAn .45s ease',
    },
    onclick: () => schirm.remove(),
  },
    el('div', { class: 'mitte' },
      el('div', { class: 'winzig', style: { color: 'var(--glut-hell)', letterSpacing: '.3em' } }, 'Stufe'),
      el('div', {
        class: 'zier glutschrift',
        style: { fontSize: '84px', lineHeight: '1.05', animation: 'funkeln 1.6s ease-in-out infinite' },
      }, String(stufe)),
      rang ? el('div', { class: 'zier', style: { fontSize: '23px', marginTop: '6px' } }, rang) : null,
      el('p', { class: 'still klein', style: { marginTop: '22px' } }, 'Tippen zum Schließen')
    )
  );
  document.body.append(schirm);
  setTimeout(() => { if (schirm.isConnected) schirm.remove(); }, 6000);
}

function raengeBenennen(stand) {
  const raenge = { ...(stand.raenge || {}) };
  const jetztStufe = stufeAus(stand.xp).stufe;

  const felder = [];
  for (let s = 1; s <= jetztStufe + 4; s++) {
    const feld = el('input', {
      class: 'feld', value: raenge[String(s)] || '',
      placeholder: 'Stufe ' + s,
      style: { marginTop: '7px' },
    });
    felder.push({ stufe: s, feld });
  }

  const b = blatt(
    el('h2', {}, 'Ränge'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 10px' } },
      'Wie heißt er auf welcher Stufe? Leere Zeilen bleiben namenlos. Er sieht nur den Namen seiner eigenen Stufe.'),
    ...felder.map((f) => el('div', {},
      el('span', { class: 'winzig still' }, 'Stufe ' + f.stufe + (f.stufe === jetztStufe ? ' · jetzt' : '')),
      f.feld
    )),
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '16px' },
      onclick: async () => {
        felder.forEach((f) => {
          const w = f.feld.value.trim();
          if (w) raenge[String(f.stufe)] = w;
          else delete raenge[String(f.stufe)];
        });
        b.schliessen();
        await datenSchreib('wachsen/stand', { ...stand, raenge });
        meldung('Benannt.');
      },
    }, 'Sichern')
  );
}

function werteSetzen(stand) {
  const werte = { ...(stand.werte || {}) };
  const felder = WERTE.map((w) => {
    const feld = el('input', {
      class: 'feld', type: 'number', min: '0', max: '999',
      value: String(werte[w.id] || 0), style: { marginTop: '7px' },
    });
    return { id: w.id, marke: w.marke, feld };
  });

  const b = blatt(
    el('h2', {}, 'Werte'),
    el('div', { style: { height: '8px' } }),
    ...felder.map((f) => el('div', {}, el('span', { class: 'winzig still' }, f.marke), f.feld)),
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '16px' },
      onclick: async () => {
        felder.forEach((f) => { werte[f.id] = Math.max(0, parseInt(f.feld.value, 10) || 0); });
        b.schliessen();
        await datenSchreib('wachsen/stand', { ...stand, werte });
        meldung('Gesetzt.');
      },
    }, 'Sichern')
  );
}
