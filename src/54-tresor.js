/* ==========================================================================
   54-tresor.js — Der Tresor.

   Bilder, die sie nach und nach freigibt. Er sieht, dass etwas da ist —
   wie viel, und dass es wartet. Was darauf zu sehen ist, entscheidet sie.

   Ein Bild kann sofort offen sein, ab einem Zeitpunkt aufgehen, oder
   verschlossen bleiben, bis sie es öffnet.
   ========================================================================== */

SEITEN.tresor = function (seite) {
  seite.append(kopfzeile('Tresor',
    istDomme()
      ? el('button', { class: 'winzig still', onclick: () => tresorHinzufuegen() }, '+ Bild')
      : el('button', { class: 'winzig still', onclick: () => zeigeSeite('ich') }, 'Zurück')
  ));

  if (istDomme()) {
    seite.append(el('button', {
      class: 'winzig still', style: { display: 'block', marginBottom: '14px' },
      onclick: () => zeigeSeite('ich'),
    }, '‹ Zurück'));
  }

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('tresor', (bilder) => tresorZeichnen(platz, bilder));
  beimVerlassen(stopp);
};

function tresorZeichnen(platz, bilder) {
  platz.innerHTML = '';

  const offen = bilder.filter((b) => tresorOffen(b));
  const zu = bilder.filter((b) => !tresorOffen(b));

  if (!bilder.length) {
    platz.append(leerlauf('Der Tresor ist leer',
      istDomme() ? 'Leg etwas hinein. Du bestimmst, wann er es sieht.' : 'Noch nichts drin.'));
    return;
  }

  /* Was noch zu ist, erscheint als Zahl — nicht als Vorschau. */
  if (zu.length) {
    if (istDomme()) {
      platz.append(el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Noch verschlossen'));
      zu.forEach((b) => platz.append(tresorVerwaltung(b)));
      platz.append(el('div', { class: 'trenner' }));
    } else {
      platz.append(el('div', { class: 'karte glimmt', style: { textAlign: 'center', marginBottom: '16px' } },
        el('div', { class: 'zier glutschrift', style: { fontSize: '40px' } }, String(zu.length)),
        el('p', { class: 'leise klein', style: { marginTop: '3px' } },
          zu.length === 1 ? 'wartet auf dich' : 'warten auf dich'),
        zu.some((b) => b.ab)
          ? el('p', { class: 'still klein', style: { marginTop: '9px' } },
              'Das nächste öffnet in ' + bisText(Math.min(...zu.filter((b) => b.ab).map((b) => b.ab))))
          : el('p', { class: 'still klein', style: { marginTop: '9px' } }, 'Wann, entscheidet sie.')
      ));
    }
  }

  if (!offen.length) return;

  platz.append(el('p', { class: 'winzig still', style: { margin: '0 0 9px 2px' } }, 'Offen'));
  platz.append(el('div', {
    style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))', gap: '7px' },
  }, ...offen.slice().reverse().map((b) => {
    const kachel = el('button', {
      style: {
        position: 'relative', aspectRatio: '1', borderRadius: '11px',
        overflow: 'hidden', border: '1px solid var(--kante)', padding: '0',
      },
      onclick: () => tresorAnsehen(b, offen),
    },
      el('img', {
        src: b.bild,
        style: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
      }),
      b.titel ? el('div', {
        style: {
          position: 'absolute', left: '0', right: '0', bottom: '0',
          padding: '16px 7px 6px', fontSize: '11px', textAlign: 'left',
          background: 'linear-gradient(to top, rgba(0,0,0,.8), transparent)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        },
      }, b.titel) : null,
      /* Ihr Blick sieht alles — aber sie soll SEHEN, was für ihn noch
         zu ist. Ohne die Marke wirkte hier alles gleich offen. */
      istDomme() && !b.frei && !(b.ab && b.ab <= jetzt())
        ? el('div', {
            style: {
              position: 'absolute', top: '5px', right: '5px', width: '24px', height: '24px',
              borderRadius: '8px', display: 'grid', placeItems: 'center',
              background: 'rgba(10,8,6,.72)', color: 'var(--glut-hell)',
            },
          }, sinnbild('schloss', 13))
        : null
    );
    if (istDomme()) langerDruck(kachel, () => tresorVerwalten(b));
    return kachel;
  })));
}

/* Offen ist, was ohne Bedingung hineingelegt wurde, was sie geöffnet hat,
   oder was seinen Zeitpunkt erreicht hat. */
function tresorOffen(b) {
  if (istDomme()) return true;
  if (b.frei) return true;
  if (b.ab && b.ab <= jetzt()) return true;
  return false;
}

function tresorVerwaltung(b) {
  return el('div', {
    class: 'karte',
    style: { display: 'flex', gap: '13px', alignItems: 'center', padding: '10px 12px', marginTop: '8px' },
  },
    el('img', {
      src: b.bild,
      style: { width: '52px', height: '52px', objectFit: 'cover', borderRadius: '9px', flex: 'none' },
    }),
    el('div', { style: { flex: '1', minWidth: '0' } },
      el('div', { style: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } },
        b.titel || 'Ohne Titel'),
      el('div', { class: 'still klein' },
        b.ab ? 'öffnet ' + bisText(b.ab) : 'wartet auf dich')
    ),
    el('button', {
      class: 'winzig', style: { color: 'var(--glut-hell)', padding: '9px', flex: 'none' },
      onclick: async () => {
        await datenAendern('tresor', b.id, { frei: true, freiWann: jetzt() });
        pushSenden('sub', 'hinweis', 'Etwas ist offen.');
        puls('antwortJa');
        meldung('Offen.');
      },
    }, 'Öffnen')
  );
}

/* --- Ansehen -------------------------------------------------------------- */

/* Durchblättern statt einzeln öffnen — mit Wischen, wie man es erwartet. */
function tresorAnsehen(bild, alle) {
  const reihe = alle.slice().reverse();
  let stelle = reihe.findIndex((b) => b.id === bild.id);

  const anzeige = el('img', {
    style: { maxWidth: '100%', maxHeight: '74vh', borderRadius: '13px', display: 'block', margin: '0 auto' },
  });
  const beschriftung = el('p', { class: 'leise klein mitte', style: { marginTop: '13px', minHeight: '19px' } });
  const zaehler = el('p', { class: 'winzig still mitte', style: { marginTop: '5px' } });

  const zeigen = () => {
    const b = reihe[stelle];
    anzeige.src = b.bild;
    beschriftung.textContent = b.titel || '';
    zaehler.textContent = (stelle + 1) + ' von ' + reihe.length;
  };
  zeigen();

  const deckel = el('div', {
    class: 'deckel',
    style: { alignItems: 'center', padding: '20px', flexDirection: 'column', justifyContent: 'center' },
    onclick: (e) => { if (e.target === deckel) deckel.remove(); },
  }, anzeige, beschriftung, zaehler);

  /* Wischen zum Blättern. */
  let start = null;
  deckel.addEventListener('pointerdown', (e) => { start = e.clientX; });
  deckel.addEventListener('pointerup', (e) => {
    if (start === null) return;
    const weg = e.clientX - start;
    start = null;
    if (Math.abs(weg) < 44) return;
    stelle = (stelle + (weg < 0 ? 1 : -1) + reihe.length) % reihe.length;
    zeigen();
    puls('hinweis');
  });

  document.body.append(deckel);
}

/* --- Hineinlegen ---------------------------------------------------------- */

function tresorHinzufuegen() {
  let bild = null;
  let wann = 'sofort';

  const titel = el('input', { class: 'feld', placeholder: 'Beschriftung (freiwillig)' });
  const vorschau = el('div', { style: { marginTop: '11px' } });
  const zeitfeld = el('input', { class: 'feld', type: 'datetime-local', style: { marginTop: '9px', display: 'none' } });

  const dateiwahl = el('input', {
    type: 'file', accept: 'image/*', hidden: true,
    onchange: async (e) => {
      const datei = e.target.files[0];
      if (!datei) return;
      meldung('Verkleinere …');
      try {
        bild = await bildVerkleinern(datei, 1500, 0.8);
        vorschau.innerHTML = '';
        vorschau.append(el('img', { src: bild, style: { width: '100%', borderRadius: '11px', display: 'block' } }));
      } catch { meldung('Das Bild ließ sich nicht lesen.'); }
    },
  });

  const wahlreihe = el('div', { style: { display: 'flex', gap: '7px', marginTop: '4px' } });
  const zeichneWahl = () => {
    wahlreihe.innerHTML = '';
    [
      { id: 'sofort', marke: 'Sofort offen' },
      { id: 'zu', marke: 'Verschlossen' },
      { id: 'zeit', marke: 'Ab Zeitpunkt' },
    ].forEach((w) => {
      wahlreihe.append(el('button', {
        class: 'knopf' + (wann === w.id ? ' glut' : ' leer'),
        style: { flex: '1', minHeight: '40px', fontSize: '12.5px', padding: '8px 6px' },
        onclick: () => { wann = w.id; zeitfeld.style.display = w.id === 'zeit' ? '' : 'none'; zeichneWahl(); },
      }, w.marke));
    });
  };
  zeichneWahl();

  const b = blatt(
    el('h2', {}, 'In den Tresor'),
    el('div', { style: { height: '12px' } }),
    el('button', { class: 'knopf leer breit', onclick: () => dateiwahl.click() }, 'Bild wählen'),
    vorschau, dateiwahl, titel,
    el('p', { class: 'winzig still', style: { margin: '16px 0 0' } }, 'Wann sieht er es?'),
    wahlreihe, zeitfeld,
    el('div', { class: 'knopfreihe', style: { marginTop: '18px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!bild) return meldung('Erst ein Bild wählen.');
          if (wann === 'zeit' && !zeitfeld.value) return meldung('Wann soll es aufgehen?');
          b.schliessen();
          await datenAnhaengen('tresor', {
            bild,
            titel: titel.value.trim(),
            frei: wann === 'sofort',
            ab: wann === 'zeit' ? new Date(zeitfeld.value).getTime() : null,
          });
          if (wann === 'sofort') pushSenden('sub', 'hinweis', 'Etwas Neues ist da.');
          else pushSenden('sub', 'hinweis', 'Etwas wartet im Tresor.');
          meldung('Liegt drin.');
        },
      }, 'Hineinlegen')
    )
  );
}

function tresorVerwalten(b) {
  const blattRef = blatt(
    el('img', { src: b.bild, style: { width: '100%', borderRadius: '12px', display: 'block' } }),
    el('p', { class: 'leise', style: { margin: '13px 0 16px' } }, b.titel || 'Ohne Titel'),
    el('div', { class: 'knopfreihe' },
      el('button', {
        class: 'knopf leer warnend',
        onclick: async () => {
          blattRef.schliessen();
          const weg = await frage('Aus dem Tresor nehmen?', '', 'Wegnehmen', true);
          if (weg) await datenEintragLoeschen('tresor', b.id);
        },
      }, 'Wegnehmen'),
      b.frei
        ? el('button', {
            class: 'knopf',
            onclick: async () => {
              blattRef.schliessen();
              await datenAendern('tresor', b.id, { frei: false, ab: null });
              meldung('Wieder verschlossen.');
            },
          }, 'Verschließen')
        : el('button', {
            class: 'knopf glut',
            onclick: async () => {
              blattRef.schliessen();
              await datenAendern('tresor', b.id, { frei: true, freiWann: jetzt() });
              pushSenden('sub', 'hinweis', 'Etwas ist offen.');
              meldung('Offen.');
            },
          }, 'Öffnen')
    )
  );
}
