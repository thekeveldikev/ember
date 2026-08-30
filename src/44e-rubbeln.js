/* ==========================================================================
   44e-rubbeln.js — Rubbellose.

   Sie legt etwas darunter, er rubbelt es frei. Das Haptische ist der
   Punkt: Ein Knopf, der dasselbe enthüllt, fühlt sich nicht annähernd
   gleich an.

   Seit dem Vorrat ist es ein richtiges Losspiel: ein Tageslos je Tag,
   Seltenheiten von Grau bis Rotgold (2 % Jackpot), und nicht jedes Los
   ist ein Gewinn — es gibt Nieten, Fallen, Gutscheine fürs Portemonnaie,
   Zeitschlösser und Blindlose, bei denen sie erst schreibt, WENN er
   gerubbelt hat. Sie kann die Serie wählen und Lose präparieren, ohne
   dass er es merkt.
   ========================================================================== */

SEITEN.rubbeln = function (seite) {
  seite.append(kopfzeile('Lose',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('spiel') }, 'Zurück')
  ));

  seite.append(el('p', { class: 'leise klein', style: { marginBottom: '14px' } },
    istDomme()
      ? 'Du legst Lose an, er rubbelt sie frei. Was drunter liegt, weißt bis dahin nur du.'
      : 'Freirubbeln, was drunter liegt — nicht jedes Los ist ein Gewinn.'));

  const blindplatz = el('div');
  const tagesplatz = el('div');
  const platz = el('div');
  seite.append(blindplatz, tagesplatz, platz);

  blindlosKarte(blindplatz);
  tageslosKarte(tagesplatz);

  const stopp = datenHorch('lose', (lose) => loseZeichnen(platz, lose));
  beimVerlassen(stopp);
};

/* --- Das Tageslos ---------------------------------------------------------- */

async function tageslosKarte(platz) {
  platz.innerHTML = '';
  if (istDomme() || !vorratAn()) return;

  const heute = tagstempel();
  if (Gerät.lies('tageslosTag') === heute) return;

  platz.append(el('div', { class: 'karte glimmt', style: { textAlign: 'center', marginBottom: '12px' } },
    el('p', { class: 'winzig still', style: { marginBottom: '4px' } }, 'Dein Tageslos'),
    el('p', { class: 'leise klein', style: { marginBottom: '12px' } },
      'Eins pro Tag. Was drunter liegt, weißt du erst, wenn du rubbelst — nicht jedes ist ein Gewinn.'),
    el('button', {
      class: 'knopf glut breit',
      onclick: async () => {
        /* Ein präpariertes Los schlägt den Zufall — und er merkt nichts. */
        let gezogen = await datenLies('losPraepariert').catch(() => null);
        if (gezogen) {
          datenLoesch('losPraepariert').catch(() => {});
        } else {
          const serie = await datenLies('einst/losSerie', 'basis').catch(() => 'basis');
          gezogen = vorratLosZiehen(0, serie);
        }
        if (!gezogen) return meldung('Heute liegt nichts im Topf.');

        Gerät.schreib('tageslosTag', heute);
        const id = await datenAnhaengen('lose', {
          titel: 'Tageslos',
          text: gezogen.text,
          typ: gezogen.typ || 'sofort',
          seltenheit: gezogen.seltenheit || 1,
          bedingung: gezogen.bedingung || null,
          verweis: gezogen.verweis || null,
          aufgedeckt: false,
        });
        platz.innerHTML = '';
        losOeffnen({ id, titel: 'Tageslos', ...gezogen, aufgedeckt: false });
      },
    }, 'Ziehen und rubbeln')
  ));
}

/* --- Blindlos: sie schreibt, nachdem er gerubbelt hat ---------------------- */

async function blindlosKarte(platz) {
  platz.innerHTML = '';
  const offen = await datenLies('blindlos').catch(() => null);
  if (!offen || !istDomme()) return;

  const feld = el('textarea', { class: 'feld', rows: 2, placeholder: 'Was gilt? Schreib das Erste, das kommt.' });
  const uhr = el('span', { class: 'zier', style: { color: 'var(--glut-hell)', fontVariantNumeric: 'tabular-nums' } });

  const karte = el('div', { class: 'karte glimmt', style: { marginBottom: '12px' } },
    el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } },
      el('p', { class: 'winzig still' }, 'Blindlos — er wartet'),
      uhr
    ),
    el('p', { class: 'leise klein', style: { margin: '6px 0 10px' } },
      'Er hat ein Blindlos gerubbelt. Was du jetzt schreibst, steht darunter.'),
    feld,
    el('button', {
      class: 'knopf glut breit', style: { marginTop: '11px' },
      onclick: async () => {
        const text = feld.value.trim();
        if (!text) return meldung('Da steht noch nichts.');
        await datenAendern('lose', offen.losId, { text, blindWartet: false });
        await datenLoesch('blindlos');
        pushSenden('sub', 'antwort', 'Es steht fest.');
        meldung('Er liest es jetzt.');
        zeigeSeite('rubbeln');
      },
    }, 'So gilt es')
  );

  /* Die 60 Sekunden sind Ansporn, kein Gesetz — danach gilt trotzdem,
     was sie schreibt. Aber die Uhr macht es zu ihrem Spiel. */
  const ende = (offen.wann || jetzt()) + 60000;
  const tick = setInterval(() => {
    if (!karte.isConnected) return clearInterval(tick);
    const uebrig = ende - jetzt();
    uhr.textContent = uebrig > 0 ? Math.ceil(uebrig / 1000) + ' s' : 'Zeit ist um — schreib trotzdem.';
  }, 500);

  platz.append(karte);
  setTimeout(() => feld.focus(), 300);
}

/* --- Die Liste ------------------------------------------------------------- */

function loseZeichnen(platz, lose) {
  platz.innerHTML = '';

  const offen = lose.filter((l) => !l.aufgedeckt);
  const boerse = lose.filter((l) => l.aufgedeckt && l.typ === 'gutschein' && !l.eingeloest);
  const alte = lose.filter((l) => l.aufgedeckt && !(l.typ === 'gutschein' && !l.eingeloest));

  if (!offen.length && !boerse.length && istDomme()) {
    platz.append(leerlauf('Keine Lose', 'Leg eins an — er sieht nur, dass es da ist.'));
  }

  offen.forEach((los) => {
    const karte = el('button', {
      class: 'karte glimmt',
      style: {
        width: '100%', display: 'flex', alignItems: 'center', gap: '14px',
        textAlign: 'left', marginTop: '9px',
      },
      onclick: () => losOeffnen(los),
    },
      el('div', {
        style: {
          width: '46px', height: '46px', flex: 'none', borderRadius: '11px',
          background: 'var(--verlauf)', display: 'grid', placeItems: 'center',
          fontSize: '20px',
        },
      }, '✦'),
      el('div', { style: { flex: '1' } },
        el('div', { class: 'zier', style: { fontSize: '17px' } }, los.titel || 'Ein Los'),
        el('div', { class: 'still klein' }, 'noch zugedeckt')
      )
    );
    if (istDomme()) langerDruck(karte, async () => {
      const weg = await frage('Los wegnehmen?', los.titel || '', 'Wegnehmen', true);
      if (weg) await datenEintragLoeschen('lose', los.id);
    });
    platz.append(karte);
  });

  /* --- Das Portemonnaie: Gutscheine, die noch gelten --- */
  if (boerse.length) {
    platz.append(el('p', { class: 'winzig still', style: { margin: '16px 0 7px 2px' } }, 'Portemonnaie'));
    boerse.forEach((los) => {
      const s = LOS_SELTENHEIT[(los.seltenheit || 1) - 1];
      const karte = el('div', {
        class: 'karte',
        style: { marginTop: '8px', borderLeft: '3px solid ' + s.farbe },
      },
        el('p', { class: 'winzig still', style: { marginBottom: '4px' } }, 'Gutschein · ' + s.name),
        el('div', {}, los.text),
        los.einloeseWunsch
          ? (istDomme()
              ? el('div', { class: 'knopfreihe', style: { marginTop: '11px' } },
                  el('button', {
                    class: 'knopf leer', style: { minHeight: '38px', fontSize: '13px' },
                    onclick: async () => { await datenAendern('lose', los.id, { einloeseWunsch: false }); meldung('Er wartet weiter.'); },
                  }, 'Noch nicht'),
                  el('button', {
                    class: 'knopf glut', style: { minHeight: '38px', fontSize: '13px' },
                    onclick: async () => {
                      await datenAendern('lose', los.id, { eingeloest: true, eingeloestWann: jetzt() });
                      pushSenden('sub', 'antwort', 'Eingelöst.');
                      meldung('Eingelöst — jetzt gilt es.');
                    },
                  }, 'Einlösen')
                )
              : el('p', { class: 'still klein', style: { marginTop: '8px' } }, 'Zum Einlösen vorgelegt. Sie entscheidet.'))
          : (!istDomme()
              ? el('button', {
                  class: 'knopf leer breit', style: { marginTop: '11px', minHeight: '38px', fontSize: '13px' },
                  onclick: async () => {
                    await datenAendern('lose', los.id, { einloeseWunsch: true, einloeseWann: jetzt() });
                    pushSenden('domme', 'bitte', 'Er will einen Gutschein einlösen.');
                    meldung('Vorgelegt. Sie entscheidet.');
                  },
                }, 'Einlösen')
              : null)
      );
      platz.append(karte);
    });
  }

  if (istDomme()) {
    platz.append(el('button', {
      class: 'knopf leer breit', style: { marginTop: '12px' },
      onclick: losAnlegen,
    }, '+ Eigenes Los hinlegen'));

    platz.append(el('div', { style: { display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '12px' } },
      el('button', { class: 'winzig still', onclick: losSerieWaehlen }, 'Serie wählen'),
      el('button', { class: 'winzig still', onclick: losPraeparieren }, 'Ein Los präparieren')
    ));
  }

  if (alte.length) {
    platz.append(el('div', { class: 'trenner' }),
      el('p', { class: 'winzig still', style: { marginBottom: '9px' } }, 'Schon aufgedeckt'));
    alte.slice(-6).reverse().forEach((los) => {
      platz.append(el('div', { class: 'karte', style: { padding: '11px 13px', opacity: los.typ === 'niete' ? '.55' : '1' } },
        el('div', {}, los.text),
        el('p', { class: 'winzig still', style: { marginTop: '5px' } },
          (los.typ && los.typ !== 'sofort' ? los.typ + ' · ' : '') + vorZeit(los.aufgedecktWann || los.wann))
      ));
    });
  }
}

/* --- Serie und Präparieren (nur sie) --------------------------------------- */

function losSerieWaehlen() {
  const SERIEN = [
    { key: 'basis', name: 'Standard', text: 'Alles kann kommen — auch Nieten und Fallen.' },
    { key: 'belohnung', name: 'Belohnung', text: 'Nur Gutes. Keine Fallen, keine Nieten.' },
    { key: 'grausam', name: 'Grausam', text: 'Doppelt so viele Fallen und Nieten.' },
    { key: 'sanft', name: 'Sanft', text: 'Ruhig und harmlos — für stille Tage.' },
  ];
  const b = blatt(
    el('h2', {}, 'Welche Serie?'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 10px' } },
      'Bestimmt, aus welchem Topf sein Tageslos kommt. Er erfährt es nicht.'),
    ...SERIEN.map((s) => el('button', {
      class: 'karte', style: { width: '100%', textAlign: 'left', marginTop: '9px' },
      onclick: async () => {
        b.schliessen();
        await datenSchreib('einst/losSerie', s.key);
        meldung('Ab jetzt: ' + s.name + '.');
      },
    },
      el('div', { style: { fontWeight: '500' } }, s.name),
      el('div', { class: 'still klein' }, s.text)
    ))
  );
}

function losPraeparieren() {
  eingabeBlatt({
    titel: 'Ein Los präparieren',
    hinweis: 'Sein nächstes Tageslos ist dann genau das hier — er hält es für Zufall.',
    platzhalter: 'Was unter der Schicht stehen soll …',
    mehrzeilig: true,
    jaText: 'Unterschieben',
  }, async (text) => {
    await datenSchreib('losPraepariert', { text, typ: 'sofort', seltenheit: 4 });
    meldung('Liegt bereit. Er merkt nichts.');
  });
}

/* --- Das Rubbeln ----------------------------------------------------------- */

function losOeffnen(los) {
  const breite = 320;
  const hoehe = 190;

  const seltenheit = LOS_SELTENHEIT[(los.seltenheit || 1) - 1];
  const blind = los.typ === 'blind';
  const niete = los.typ === 'niete';

  const inhaltText = blind ? 'Sie schreibt es JETZT — gleich steht es hier.' : los.text;

  const textEl = el('div', {
    class: 'zier',
    style: {
      fontSize: '20px', lineHeight: '1.3',
      color: niete ? 'var(--schrift-still)' : 'inherit',
    },
  }, inhaltText);

  const darunter = el('div', {
    style: {
      position: 'absolute', inset: '0', display: 'grid', placeItems: 'center',
      padding: '22px', textAlign: 'center', borderRadius: '16px',
      background: 'var(--flaeche-hoch)',
    },
  }, los.bild
      ? el('img', { src: los.bild, style: { maxWidth: '100%', maxHeight: '150px', borderRadius: '10px' } })
      : textEl);

  const tafel = el('canvas', {
    width: String(breite * 2), height: String(hoehe * 2),
    style: {
      position: 'absolute', inset: '0', width: '100%', height: '100%',
      borderRadius: '16px', touchAction: 'none', cursor: 'grab',
    },
  });

  /* Ein Lichtstreifen wandert über die unberührte Schicht — Metall,
     das auf den Daumen wartet. Beim ersten Kratzer verschwindet er. */
  const glanz = el('div', {
    style: {
      position: 'absolute', inset: '0', borderRadius: '16px',
      pointerEvents: 'none', zIndex: '2', overflow: 'hidden',
    },
  }, el('div', { class: 'losglanz' }));

  const rahmen = el('div', {
    style: {
      position: 'relative', width: '100%', maxWidth: breite + 'px',
      height: hoehe + 'px', margin: '6px auto 0',
      borderRadius: '16px', overflow: 'hidden',
      boxShadow: '0 8px 30px -10px var(--schein)',
      border: '1px solid transparent',
      transition: 'border-color .5s ease, box-shadow .5s ease',
    },
  }, darunter, tafel, glanz);

  const hinweis = el('p', { class: 'still klein mitte', style: { marginTop: '14px' } }, 'Rubbel es frei.');
  const nachspiel = el('div');

  const b = blatt(
    el('p', { class: 'winzig still mitte', style: { marginBottom: '4px' } }, los.titel || 'Ein Los'),
    rahmen, hinweis, nachspiel
  );

  /* Die Deckschicht: warmes Metall mit ein wenig Unruhe. */
  const stift = tafel.getContext('2d');
  const verlauf = stift.createLinearGradient(0, 0, tafel.width, tafel.height);
  verlauf.addColorStop(0, '#8f5539');
  verlauf.addColorStop(0.5, '#c4785a');
  verlauf.addColorStop(1, '#7a4630');
  stift.fillStyle = verlauf;
  stift.fillRect(0, 0, tafel.width, tafel.height);

  stift.globalAlpha = 0.12;
  for (let i = 0; i < 900; i++) {
    stift.fillStyle = i % 2 ? '#000' : '#fff';
    stift.fillRect(Math.random() * tafel.width, Math.random() * tafel.height, 3, 3);
  }
  stift.globalAlpha = 1;

  stift.fillStyle = 'rgba(27,15,9,.55)';
  stift.font = '600 30px Inter, system-ui, sans-serif';
  stift.textAlign = 'center';
  stift.fillText('rubbeln', tafel.width / 2, tafel.height / 2 + 10);

  stift.globalCompositeOperation = 'destination-out';

  let rubbelt = false;
  let fertig = false;
  let letzte = null;
  let letzteFlocke = 0;
  let letztePruefung = 0;

  const stelle = (e) => {
    const kasten = tafel.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return {
      x: (p.clientX - kasten.left) / kasten.width * tafel.width,
      y: (p.clientY - kasten.top) / kasten.height * tafel.height,
      seiteX: p.clientX, seiteY: p.clientY,
    };
  };

  /* Kleine Kupferflocken springen vom Daumen weg — höchstens alle 70 ms
     eine, sonst frisst die Deko das Rubbeln auf. */
  const flocke = (x, y) => {
    const nun = performance.now();
    if (nun - letzteFlocke < 70) return;
    letzteFlocke = nun;
    const teil = el('div', { class: 'kruemel' });
    teil.style.left = (x + (Math.random() * 14 - 7)) + 'px';
    teil.style.top = y + 'px';
    teil.style.width = teil.style.height = (2 + Math.random() * 3) + 'px';
    teil.style.background = Math.random() < 0.5 ? '#c4785a' : '#8f5539';
    teil.style.setProperty('--kx', (Math.random() * 50 - 25) + 'px');
    teil.style.setProperty('--ky', (24 + Math.random() * 40) + 'px');
    teil.style.animationDuration = '.55s';
    document.body.append(teil);
    setTimeout(() => teil.remove(), 600);
  };

  const kratzen = (e) => {
    if (!rubbelt || fertig) return;
    e.preventDefault();
    const p = stelle(e);

    stift.lineWidth = 54;
    stift.lineCap = 'round';
    stift.lineJoin = 'round';
    stift.beginPath();
    if (letzte) { stift.moveTo(letzte.x, letzte.y); stift.lineTo(p.x, p.y); }
    else { stift.moveTo(p.x, p.y); stift.lineTo(p.x + 0.1, p.y); }
    stift.stroke();

    /* Die Kratz-Spur klingt so laut, wie sich der Finger bewegt. */
    if (letzte) {
      const weg = Math.hypot(p.x - letzte.x, p.y - letzte.y);
      kratzenPegel(Math.min(0.16, weg / 260));
      if (weg > 5) flocke(p.seiteX, p.seiteY);
    }
    letzte = p;

    if (Math.random() < 0.13) puls('hinweis');
    const nun = performance.now();
    if (nun - letztePruefung > 320) { letztePruefung = nun; pruefen(); }
  };

  function pruefen() {
    const daten = stift.getImageData(0, 0, tafel.width, tafel.height).data;
    let leer = 0, gezaehlt = 0;
    for (let i = 3; i < daten.length; i += 4 * 220) {
      gezaehlt++;
      if (daten[i] < 40) leer++;
    }
    if (gezaehlt && leer / gezaehlt > 0.52) enthuellen();
  }

  async function enthuellen() {
    if (fertig) return;
    fertig = true;
    kratzenStopp();
    tafel.style.transition = 'opacity .5s ease';
    tafel.style.opacity = '0';
    hinweis.textContent = '';
    setTimeout(() => tafel.remove(), 520);

    /* Ein kurzer Lichtblitz aus der Mitte und ein Glanz, der über den
       Inhalt streicht — die Enthüllung soll sich verdient anfühlen. */
    const blitz = el('div', {
      style: {
        position: 'absolute', inset: '0', borderRadius: '16px', zIndex: '3',
        pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(255,236,200,.55), transparent 65%)',
        animation: 'losBlitz .6s ease-out forwards',
      },
    });
    const streich = el('div', {
      style: {
        position: 'absolute', inset: '0', borderRadius: '16px', zIndex: '3',
        pointerEvents: 'none', overflow: 'hidden',
      },
    }, el('div', { class: 'losglanz', style: { animationDuration: '.9s', animationIterationCount: '1' } }));
    rahmen.append(blitz, streich);
    setTimeout(() => { blitz.remove(); streich.remove(); }, 950);

    await datenAendern('lose', los.id, { aufgedeckt: true, aufgedecktWann: jetzt(), blindWartet: blind });
    if (!istDomme() && !blind) pushSenden('domme', 'hinweis', 'Er hat gerubbelt.');

    /* Jetzt zeigt sich, was für ein Los es war. */
    const s = los.seltenheit || 1;
    if (s >= 3 && !niete) {
      rahmen.style.borderColor = seltenheit.farbe;
      rahmen.style.boxShadow = '0 0 34px -6px ' + seltenheit.farbe;
      nachspiel.append(el('p', {
        class: 'winzig mitte',
        style: { marginTop: '10px', color: seltenheit.farbe, letterSpacing: '.2em' },
      }, seltenheit.name.toUpperCase()));
    }

    if (los.typ === 'jackpot' || s === 5) {
      tonSpielen('schimmer');
      puls('belohnung');
      konfetti();
      setTimeout(konfetti, 350);
    } else if (niete) {
      puls('antwortNein');
      nachspiel.append(el('p', { class: 'still klein mitte', style: { marginTop: '10px' } }, 'So ist das mit Losen.'));
    } else if (los.typ === 'falle') {
      tonSpielen('tief');
      puls('antwortNein');
      if (!istDomme()) {
        await datenAnhaengen('strafen', { text: 'Fallen-Los: ' + los.text, enthuellt: true, erledigt: false }).catch(() => {});
      }
      nachspiel.append(el('p', { class: 'winzig mitte', style: { marginTop: '10px', color: 'var(--rot)', letterSpacing: '.2em' } }, 'EINE FALLE'));
    } else if (los.typ === 'gutschein') {
      tonSpielen('weich');
      puls('antwortJa');
      nachspiel.append(el('p', { class: 'still klein mitte', style: { marginTop: '10px' } }, 'Liegt jetzt in deinem Portemonnaie — einlösen, wann du dich traust.'));
    } else if (los.typ === 'zeitschloss') {
      nachspiel.append(el('p', { class: 'still klein mitte', style: { marginTop: '10px' } }, 'Ein Zeitschloss — es gilt, wenn die Zeit reif ist. Steht im Text.'));
    } else if (los.typ === 'bedingt' && los.bedingung) {
      nachspiel.append(el('p', { class: 'still klein mitte', style: { marginTop: '10px' } }, 'Nur wenn: ' + los.bedingung));
    } else if (los.typ === 'wildcard' && los.verweis) {
      const ziel = /rad/i.test(los.verweis) ? 'rad' : /deck|karte/i.test(los.verweis) ? 'spiel' : null;
      if (ziel) {
        nachspiel.append(el('button', {
          class: 'knopf glut breit', style: { marginTop: '12px' },
          onclick: () => { b.schliessen(); zeigeSeite(ziel); },
        }, 'Dann los'));
      }
    } else if (blind) {
      await datenSchreib('blindlos', { losId: los.id, wann: jetzt() });
      pushSenden('domme', 'befehl', 'Blindlos! 60 Sekunden — schreib.');
      nachspiel.append(el('p', { class: 'still klein mitte', style: { marginTop: '10px' } },
        'Sie hat 60 Sekunden. Lass das Blatt offen — es füllt sich von selbst.'));
      /* Und wirklich live: sobald ihr Text da ist, erscheint er hier. */
      const horch = ablageHorch('lose/' + los.id, async () => {
        const frisch = await datenLies('lose/' + los.id).catch(() => null);
        if (frisch && frisch.text && !frisch.blindWartet) {
          textEl.textContent = frisch.text;
          textEl.style.animation = 'einblenden .4s ease';
          tonSpielen('weich');
          puls('befehl');
          horch.then((f) => f && f()).catch(() => {});
        }
      });
    } else {
      puls('antwortJa');
    }
  }

  tafel.addEventListener('pointerdown', (e) => {
    rubbelt = true; letzte = null;
    glanz.remove();
    kratzenStart();
    kratzen(e);
  });
  tafel.addEventListener('pointermove', kratzen);
  tafel.addEventListener('pointerup', () => { rubbelt = false; letzte = null; kratzenStopp(); pruefen(); });
  tafel.addEventListener('pointerleave', () => { rubbelt = false; letzte = null; kratzenStopp(); });
  tafel.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}

/* Ein kurzer, warmer Funkenregen — für die zwei Prozent. */
function konfetti() {
  for (let i = 0; i < 26; i++) {
    const teil = el('div', { class: 'kruemel' });
    teil.style.left = (window.innerWidth / 2 + (Math.random() * 60 - 30)) + 'px';
    teil.style.top = (window.innerHeight * 0.35) + 'px';
    teil.style.width = teil.style.height = (3 + Math.random() * 4) + 'px';
    teil.style.background = ['#e8a87c', '#c4785a', '#e0b45a', '#f0e6d3'][i % 4];
    teil.style.setProperty('--kx', (Math.random() * 260 - 130) + 'px');
    teil.style.setProperty('--ky', (Math.random() * 200 - 40) + 'px');
    teil.style.animationDuration = (0.7 + Math.random() * 0.5) + 's';
    document.body.append(teil);
    setTimeout(() => teil.remove(), 1300);
  }
}

/* --- Anlegen -------------------------------------------------------------- */

function losAnlegen() {
  let bild = null;
  const titel = el('input', { class: 'feld', placeholder: 'Was steht außen drauf?' });
  const text = el('textarea', { class: 'feld', rows: 3, placeholder: 'Was liegt darunter?', style: { marginTop: '9px' } });
  const vorschau = el('div');

  const dateiwahl = el('input', {
    type: 'file', accept: 'image/*', hidden: true,
    onchange: async (e) => {
      const datei = e.target.files[0];
      if (!datei) return;
      meldung('Verkleinere …');
      try {
        bild = await bildVerkleinern(datei, 900, 0.75);
        vorschau.innerHTML = '';
        vorschau.append(el('img', { src: bild, style: { width: '100%', borderRadius: '11px', marginTop: '10px' } }));
      } catch { meldung('Das Bild ließ sich nicht lesen.'); }
    },
  });

  const b = blatt(
    el('h2', {}, 'Neues Los'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Er sieht nur den Titel — bis er rubbelt.'),
    titel, text, vorschau, dateiwahl,
    el('button', { class: 'knopf leer breit', style: { marginTop: '11px' }, onclick: () => dateiwahl.click() },
      'Ein Bild darunter'),
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!text.value.trim() && !bild) return meldung('Darunter ist noch nichts.');
          b.schliessen();
          await datenAnhaengen('lose', {
            titel: titel.value.trim() || 'Ein Los',
            text: text.value.trim(),
            bild,
            typ: 'sofort',
            seltenheit: 4,
            aufgedeckt: false,
          });
          pushSenden('sub', 'hinweis', 'Ein Los liegt bereit.');
          meldung('Liegt bereit.');
        },
      }, 'Hinlegen')
    )
  );
  setTimeout(() => titel.focus(), 260);
}
