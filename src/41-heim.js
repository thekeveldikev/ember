/* ==========================================================================
   41-heim.js — Die erste Seite.

   Oben, was heute gilt. In der Mitte der Knopf. Unten das Stille.
   Beide Rollen sehen dieselbe Seite, aber nicht dasselbe.
   ========================================================================== */

SEITEN.heim = function (seite) {
  seite.append(
    el('div', { style: { display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' } },
      (() => {
        /* Der Weg in die Tarnung hängt am Schriftzug — und muss es bei
           jedem Zeichnen aufs Neue, weil die Seite jedes Mal neu entsteht. */
        const zug = el('div', { class: 'zier glutschrift', style: { fontSize: '26px', letterSpacing: '.1em' } }, 'EMBER');
        tippenDreimal(zug, tarnungAn);
        return zug;
      })(),
      el('button', {
        class: 'winzig still',
        style: { padding: '6px 2px' },
        onclick: () => ampelBlatt(),
      }, ampelWort(D.ampel[D.rolle]))
    )
  );

  const sperrplatz = el('div');
  const fotoplatz = el('div');
  const tagesplatz = el('div');
  const knopfplatz = el('div');
  const untenplatz = el('div');
  seite.append(sperrplatz, fotoplatz, tagesplatz, knopfplatz, untenplatz);

  knopfBuehneBauen(knopfplatz);
  sperreKarte(sperrplatz);
  fotoAuftragKarte(fotoplatz);
  tagesNachrichtLaden(tagesplatz);
  untenBauen(untenplatz);
};

/* --- Die Nachricht des Tages ---------------------------------------------- */

/* Sie steht unter dem Datum, nicht in einer Liste. Dadurch gibt es je Tag
   genau eine — und die von gestern ist von selbst weg. */

async function tagesNachrichtLaden(platz) {
  const heute = tagstempel();
  platz.innerHTML = '';

  const nachricht = await datenLies('tag/' + heute + '/nachricht');

  if (nachricht) {
    const karte = el('div', { class: 'karte glimmt', style: { marginBottom: '6px' } },
      el('p', { class: 'winzig still', style: { marginBottom: '9px' } }, 'Heute'),
      nachricht.bild ? el('img', {
        src: nachricht.bild,
        style: { width: '100%', borderRadius: '12px', marginBottom: nachricht.text ? '11px' : '0', display: 'block' },
      }) : null,
      nachricht.text ? el('p', {
        class: 'zier',
        style: { fontSize: '19px', lineHeight: '1.35' },
      }, nachricht.text) : null
    );

    if (istDomme()) {
      karte.append(el('button', {
        class: 'winzig still', style: { marginTop: '12px' },
        onclick: () => tagesNachrichtSetzen(platz),
      }, 'Ändern'));
    }
    platz.append(karte);

    /* Beim ersten Öffnen des Tages einmal groß, danach nur noch als Karte. */
    if (!istDomme() && Gerät.lies('tagGesehen') !== heute) {
      Gerät.schreib('tagGesehen', heute);
      setTimeout(() => tagesNachrichtGross(nachricht), 500);
    }
  } else if (istDomme()) {
    platz.append(el('button', {
      class: 'knopf leer breit',
      style: { marginBottom: '6px' },
      onclick: () => tagesNachrichtSetzen(platz),
    }, 'Etwas für heute hinterlegen'));
  }
}

function tagesNachrichtGross(nachricht) {
  const b = blatt(
    el('p', { class: 'winzig still mitte', style: { marginBottom: '18px' } }, 'Von ' + nameVon('domme')),
    nachricht.bild ? el('img', {
      src: nachricht.bild,
      style: { width: '100%', borderRadius: '14px', marginBottom: '16px', display: 'block' },
    }) : null,
    nachricht.text ? el('p', {
      class: 'zier mitte',
      style: { fontSize: '25px', lineHeight: '1.34', padding: '0 8px 8px' },
    }, nachricht.text) : null,
    el('button', { class: 'knopf glut breit', style: { marginTop: '18px' }, onclick: () => b.schliessen() }, 'Gelesen')
  );
  puls('hinweis');
}

function tagesNachrichtSetzen(platz) {
  let bild = null;

  const feld = el('textarea', { class: 'feld', rows: 3, placeholder: 'Was sie heute wissen soll …' });
  const vorschau = el('div');
  const dateiwahl = el('input', {
    type: 'file', accept: 'image/*', hidden: true,
    onchange: async (e) => {
      const datei = e.target.files[0];
      if (!datei) return;
      meldung('Verkleinere …');
      try {
        bild = await bildVerkleinern(datei, 1200, 0.76);
        vorschau.innerHTML = '';
        vorschau.append(el('img', { src: bild, style: { width: '100%', borderRadius: '12px', marginTop: '11px', display: 'block' } }));
      } catch { meldung('Das Bild ließ sich nicht lesen.'); }
    },
  });

  const b = blatt(
    el('h2', {}, 'Für heute'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Erscheint bei ihm einmal groß, sobald er die App heute zum ersten Mal öffnet.'),
    feld, vorschau, dateiwahl,
    el('button', { class: 'knopf leer breit', style: { marginTop: '11px' }, onclick: () => dateiwahl.click() }, 'Ein Bild dazu'),
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          const text = feld.value.trim();
          if (!text && !bild) return meldung('Da ist noch nichts.');
          b.schliessen();
          await datenSchreib('tag/' + tagstempel() + '/nachricht', { text, bild });
          pushSenden('sub', 'hinweis', 'Etwas für heute.');
          meldung('Liegt bereit.');
          tagesNachrichtLaden(platz);
        },
      }, 'Hinterlegen')
    )
  );
  setTimeout(() => feld.focus(), 260);
}

/* --- Der stille Teil ------------------------------------------------------ */

function untenBauen(platz) {
  platz.innerHTML = '';

  const funkenKnopf = el('button', {
    class: 'knopf leer', style: { fontSize: '13.5px', padding: '12px 8px' },
    onclick: funkeSenden,
  }, 'Funke');
  /* Langer Druck auf den Funken-Knopf: den eigenen Topf füllen. */
  langerDruck(funkenKnopf, funkenPflegen);

  platz.append(
    el('div', { class: 'knopfreihe', style: { marginTop: '8px' } },
      el('button', {
        class: 'knopf leer',
        style: { fontSize: '13.5px', padding: '12px 8px' },
        onclick: async () => {
          puls('denkAnDich');
          await datenSchreib('puls/' + andereRolle(), { wann: jetzt() });
          pushSenden(andereRolle(), 'denkAnDich');
          meldung('Angekommen.');
        },
      }, 'Denk an dich'),
      funkenKnopf,
      el('button', {
        class: 'knopf leer', style: { fontSize: '13.5px', padding: '12px 8px' },
        onclick: () => ampelBlatt(),
      }, 'Ampel')
    )
  );

  const keksplatz = el('div', { style: { marginTop: '14px' } });
  platz.append(keksplatz);
  gluecksKeksLaden(keksplatz);
}

/* --- Das Glückskeks ------------------------------------------------------- */

/* Einer je Tag, und beide sehen denselben. Deshalb wird nicht gewürfelt,
   sondern aus dem Datum gerechnet — ohne dass jemand etwas speichern muss. */

async function gluecksKeksLaden(platz) {
  const sprueche = await datenListe('keks');
  platz.innerHTML = '';

  if (!sprueche.length) {
    if (istDomme()) {
      platz.append(el('button', {
        class: 'winzig still', style: { display: 'block', margin: '0 auto', padding: '10px' },
        onclick: () => keksSchreiben(platz),
      }, 'Sprüche anlegen'));
    }
    return;
  }

  const heute = tagstempel();
  let summe = 0;
  for (const z of heute) summe = (summe * 31 + z.charCodeAt(0)) >>> 0;
  const spruch = sprueche[summe % sprueche.length];

  const karte = el('div', {
    class: 'karte',
    style: { textAlign: 'center', background: 'transparent', border: '1px dashed var(--kante-stark)', boxShadow: 'none' },
  },
    el('p', { class: 'zier leise', style: { fontSize: '16px', fontStyle: 'italic', lineHeight: '1.45' } }, spruch.text)
  );

  if (istDomme()) langerDruck(karte, () => keksSchreiben(platz));
  platz.append(karte);
}

function keksSchreiben(platz) {
  eingabeBlatt({
    titel: 'Ein Spruch',
    hinweis: 'Einer je Tag, zufällig gewählt. Beide sehen denselben.',
    platzhalter: '…',
    mehrzeilig: true,
  }, async (text) => {
    await datenAnhaengen('keks', { text });
    meldung('Liegt im Glas.');
    gluecksKeksLaden(platz);
  });
}
