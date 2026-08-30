/* ==========================================================================
   44c-szenario.js — Der Baukasten.

   Sechs Fächer, in die ihr Bausteine legt: Wer, Was, Wo, Wie, Regel, Zeit.
   Der Baukasten würfelt daraus eine Zusammenstellung. Je mehr drin liegt,
   desto unwahrscheinlicher wird, dass zweimal dasselbe herauskommt.

   Beide dürfen Bausteine hineinlegen — das ist einer der wenigen Orte, an
   denen er mitschreiben darf. Was daraus wird, entscheidet trotzdem sie.
   ========================================================================== */

const BAUFAECHER = [
  { id: 'wer', marke: 'Wer', beispiel: 'z. B. eine Rolle' },
  { id: 'was', marke: 'Was', beispiel: 'die Handlung' },
  { id: 'wo', marke: 'Wo', beispiel: 'der Ort' },
  { id: 'wie', marke: 'Wie', beispiel: 'die Art' },
  { id: 'regel', marke: 'Regel', beispiel: 'die Bedingung' },
  { id: 'zeit', marke: 'Zeit', beispiel: 'wie lange' },
];

SEITEN.szenario = function (seite) {
  seite.append(kopfzeile('Baukasten',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('spiel') }, 'Zurück')
  ));

  const generatorplatz = el('div', { class: 'abschnitt' });
  const wuerfelplatz = el('div', { class: 'abschnitt' });
  const faecherplatz = el('div', { class: 'abschnitt' });
  seite.append(generatorplatz, wuerfelplatz, faecherplatz);

  /* Der Generator aus dem Vorrat: ganze Sätze statt Stichworte. */
  if (vorratAn() && vorratSzenario()) {
    generatorplatz.append(el('div', { class: 'karte glimmt', style: { textAlign: 'center', padding: '18px 16px' } },
      el('p', { class: 'winzig still', style: { marginBottom: '4px' } }, 'Der Generator'),
      el('p', { class: 'leise klein', style: { marginBottom: '13px' } },
        'Würfelt ein ganzes Szenario — über eine Milliarde Möglichkeiten.'),
      el('button', { class: 'knopf glut breit', onclick: szenarioGenerieren }, 'Würfeln')
    ));
  }

  const stopp = datenHorch('bausteine', (steine) => {
    wuerfelplatz.innerHTML = '';
    faecherplatz.innerHTML = '';

    const nachFach = {};
    BAUFAECHER.forEach((f) => { nachFach[f.id] = steine.filter((s) => s.fach === f.id); });
    const gefuellt = BAUFAECHER.filter((f) => nachFach[f.id].length);

    if (gefuellt.length < 2) {
      wuerfelplatz.append(leerlauf('Der Kasten ist fast leer',
        'Leg in mindestens zwei Fächer etwas hinein — dann lässt sich würfeln.'));
    } else {
      wuerfelplatz.append(el('button', {
        class: 'knopf glut breit',
        onclick: () => szenarioWuerfeln(nachFach),
      }, 'Würfeln'));
    }

    BAUFAECHER.forEach((f) => {
      const drin = nachFach[f.id];
      const karte = el('div', { class: 'karte', style: { marginTop: '9px' } },
        el('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' } },
          el('div', { class: 'zier', style: { fontSize: '17px' } }, f.marke),
          el('button', {
            class: 'winzig still', style: { padding: '4px 0 4px 12px' },
            onclick: () => bausteinAnlegen(f),
          }, '+')
        ),
        drin.length
          ? el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '10px' } },
              ...drin.map((s) => {
                const marke = el('span', {
                  style: {
                    fontSize: '13px', padding: '5px 10px', borderRadius: '9px',
                    background: 'var(--grund2)', border: '1px solid var(--kante)',
                  },
                }, s.text);
                langerDruck(marke, async () => {
                  const weg = await frage('Baustein wegnehmen?', s.text, 'Wegnehmen', true);
                  if (weg) await datenEintragLoeschen('bausteine', s.id);
                });
                return marke;
              }))
          : el('p', { class: 'still klein', style: { marginTop: '6px' } }, f.beispiel)
      );
      faecherplatz.append(karte);
    });
  });

  beimVerlassen(stopp);
};

function bausteinAnlegen(fach) {
  eingabeBlatt({
    titel: fach.marke,
    hinweis: 'Kurz halten — es wird mit anderen zusammengesetzt.',
    platzhalter: fach.beispiel,
    jaText: 'Hineinlegen',
  }, async (text) => {
    await datenAnhaengen('bausteine', { fach: fach.id, text });
    meldung('Liegt drin.');
  });
}

/* --- Der Generator aus dem Vorrat ------------------------------------------ */

function szenarioGenerieren() {
  let aktuell = vorratSzenario();
  if (!aktuell) return meldung('Der Vorrat gibt gerade nichts her.');

  const anzeige = el('p', {
    class: 'zier',
    style: { fontSize: '19px', lineHeight: '1.45', padding: '4px 4px 8px', animation: 'einblenden .3s ease' },
  }, aktuell.text);
  puls('hinweis');
  tonSpielen('tick');

  const b = blatt(
    el('p', { class: 'winzig still', style: { marginBottom: '10px' } }, 'Gewürfelt'),
    anzeige,
    el('div', { class: 'knopfreihe', style: { marginTop: '16px' } },
      el('button', {
        class: 'knopf leer',
        onclick: () => {
          const neu = vorratSzenario();
          if (!neu) return;
          aktuell = neu;
          anzeige.textContent = neu.text;
          anzeige.style.animation = 'none';
          requestAnimationFrame(() => { anzeige.style.animation = 'einblenden .3s ease'; });
          puls('hinweis');
          tonSpielen('tick');
        },
      }, 'Noch mal'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          b.schliessen();
          await datenAnhaengen('auftraege', {
            titel: aktuell.text, text: '', fach: 'Generator',
            art: 'szenario', erledigt: false, bestaetigt: false,
          });
          pushSenden(istDomme() ? 'sub' : 'domme', 'auftrag');
          meldung('Liegt bei den Aufträgen.');
        },
      }, istDomme() ? 'Nehmen' : 'Vorschlagen')
    ),
    istDomme() ? el('button', {
      class: 'winzig still', style: { display: 'block', margin: '14px auto 0' },
      onclick: () => {
        b.schliessen();
        eingabeBlatt({
          titel: 'Vorher ändern', mehrzeilig: true, wert: aktuell.text, jaText: 'Nehmen',
        }, async (text) => {
          await datenAnhaengen('auftraege', {
            titel: text, text: '', fach: 'Generator',
            art: 'szenario', erledigt: false, bestaetigt: false,
          });
          pushSenden('sub', 'auftrag');
          meldung('Liegt bei ihm.');
        });
      },
    }, 'Erst ändern') : null
  );
}

/* --- Würfeln -------------------------------------------------------------- */

function szenarioWuerfeln(nachFach) {
  const bauen = () => BAUFAECHER
    .map((f) => {
      const drin = nachFach[f.id];
      return drin && drin.length ? { marke: f.marke, text: zufall(drin).text } : null;
    })
    .filter(Boolean);

  let zusammenstellung = bauen();

  const anzeige = el('div');
  const zeichnen = () => {
    anzeige.innerHTML = '';
    zusammenstellung.forEach((teil, i) => {
      anzeige.append(el('div', {
        style: {
          display: 'flex', gap: '12px', alignItems: 'baseline',
          padding: '9px 0',
          borderTop: i ? '1px solid var(--kante)' : 'none',
          animation: 'einblenden .3s ease ' + (i * 0.06) + 's both',
        },
      },
        el('span', { class: 'winzig still', style: { minWidth: '48px' } }, teil.marke),
        el('span', { class: 'zier', style: { fontSize: '18px', lineHeight: '1.3' } }, teil.text)
      ));
    });
  };
  zeichnen();
  puls('hinweis');

  const b = blatt(
    el('p', { class: 'winzig still', style: { marginBottom: '4px' } }, 'Gewürfelt'),
    anzeige,
    el('div', { class: 'knopfreihe', style: { marginTop: '18px' } },
      el('button', {
        class: 'knopf leer',
        onclick: () => { zusammenstellung = bauen(); zeichnen(); puls('hinweis'); },
      }, 'Noch mal'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          b.schliessen();
          await datenAnhaengen('auftraege', {
            titel: zusammenstellung.map((t) => t.text).join(' · '),
            text: zusammenstellung.map((t) => t.marke + ': ' + t.text).join('\n'),
            fach: 'Gewürfelt',
            art: 'szenario', erledigt: false, bestaetigt: false,
          });
          pushSenden(istDomme() ? 'sub' : 'domme', 'auftrag');
          meldung('Liegt bei den Aufträgen.');
        },
      }, istDomme() ? 'Nehmen' : 'Vorschlagen')
    ),
    istDomme() ? el('button', {
      class: 'winzig still', style: { display: 'block', margin: '14px auto 0' },
      onclick: () => {
        b.schliessen();
        eingabeBlatt({
          titel: 'Vorher ändern',
          mehrzeilig: true,
          wert: zusammenstellung.map((t) => t.text).join(' · '),
          jaText: 'Nehmen',
        }, async (text) => {
          await datenAnhaengen('auftraege', {
            titel: text, text: '', fach: 'Gewürfelt',
            art: 'szenario', erledigt: false, bestaetigt: false,
          });
          pushSenden('sub', 'auftrag');
          meldung('Liegt bei ihm.');
        });
      },
    }, 'Erst ändern') : null
  );
}
