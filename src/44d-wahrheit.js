/* ==========================================================================
   44d-wahrheit.js — Wahrheit oder Pflicht.

   Abwechselnd, aus Töpfen, die ihr selbst füllt. Der Unterschied zum
   Kinderspiel: Es eskaliert. Nach fünf Zügen öffnet sich Stufe zwei, nach
   zehn Stufe drei — und was auf Stufe drei liegt, hat vorher niemand
   gesehen.

   Die Runde lebt nur in dieser Sitzung. Was bleiben soll, wandert von
   selbst ins Buch.
   ========================================================================== */

const STUFEN_NAMEN = ['Warm', 'Wärmer', 'Heiß'];

let _runde = null;

SEITEN.wahrheit = function (seite) {
  seite.append(kopfzeile('Wahrheit oder Pflicht',
    el('button', { class: 'winzig still', onclick: () => zeigeSeite('spiel') }, 'Zurück')
  ));

  const platz = el('div');
  seite.append(platz);

  const stopp = datenHorch('wup', (eintraege) => zeichnen(platz, eintraege));
  beimVerlassen(stopp);
};

function zeichnen(platz, eintraege) {
  platz.innerHTML = '';

  const wahrheiten = eintraege.filter((e) => e.art === 'wahrheit');
  const pflichten = eintraege.filter((e) => e.art === 'pflicht');

  if (!wahrheiten.length && !pflichten.length) {
    platz.append(leerlauf('Die Töpfe sind leer',
      'Beide dürfen füllen. Fragt euch etwas, das ihr sonst nicht fragt.'));
  }

  if (_runde) {
    platz.append(rundeKarte(wahrheiten, pflichten));
  } else {
    platz.append(
      el('div', { class: 'karte glimmt', style: { textAlign: 'center' } },
        el('div', { class: 'zier', style: { fontSize: '20px', marginBottom: '4px' } }, 'Eine Runde?'),
        el('p', { class: 'still klein', style: { marginBottom: '14px' } },
          wahrheiten.length + ' Wahrheiten · ' + pflichten.length + ' Pflichten'),
        el('button', {
          class: 'knopf glut breit',
          onclick: () => {
            if (!wahrheiten.length && !pflichten.length) return meldung('Erst füllen.');
            _runde = { zug: 0, dran: 'sub', gezogen: [] };
            zeigeSeite('wahrheit');
          },
        }, 'Anfangen')
      )
    );
  }

  /* --- Töpfe füllen --- */
  platz.append(
    el('div', { class: 'trenner' }),
    el('div', { class: 'knopfreihe' },
      el('button', { class: 'knopf leer', onclick: () => wupAnlegen('wahrheit') }, '+ Wahrheit'),
      el('button', { class: 'knopf leer', onclick: () => wupAnlegen('pflicht') }, '+ Pflicht')
    ),
    el('p', { class: 'still klein mitte', style: { marginTop: '11px' } },
      'Stufe 1 ab Beginn · Stufe 2 ab dem 5. Zug · Stufe 3 ab dem 10.')
  );

  if (eintraege.length) {
    platz.append(el('button', {
      class: 'winzig still', style: { display: 'block', margin: '16px auto 0' },
      onclick: () => wupVerwalten(eintraege),
    }, 'Töpfe ansehen'));
  }
}

/* --- Die Runde ------------------------------------------------------------ */

function stufeJetzt() {
  if (!_runde) return 1;
  if (_runde.zug >= 10) return 3;
  if (_runde.zug >= 5) return 2;
  return 1;
}

function rundeKarte(wahrheiten, pflichten) {
  const stufe = stufeJetzt();
  const dran = _runde.dran;

  const karte = el('div', { class: 'karte glimmt', style: { textAlign: 'center' } },
    el('p', { class: 'winzig still' }, 'Zug ' + (_runde.zug + 1) + ' · ' + STUFEN_NAMEN[stufe - 1]),
    el('div', { class: 'zier', style: { fontSize: '23px', margin: '10px 0 16px' } },
      nameVon(dran) + ' ist dran'),
    el('div', { class: 'knopfreihe' },
      el('button', { class: 'knopf', onclick: () => ziehen('wahrheit') }, 'Wahrheit'),
      el('button', { class: 'knopf glut', onclick: () => ziehen('pflicht') }, 'Pflicht')
    ),
    el('button', {
      class: 'winzig still', style: { marginTop: '15px' },
      onclick: () => { _runde = null; zeigeSeite('wahrheit'); },
    }, 'Runde beenden')
  );

  function ziehen(art) {
    const topf = (art === 'wahrheit' ? wahrheiten : pflichten)
      .filter((e) => (e.stufe || 1) <= stufe)
      .filter((e) => !_runde.gezogen.includes(e.id));

    if (!topf.length) {
      /* Lieber wiederholen als abbrechen — aber ehrlich sagen, dass es so ist. */
      const alle = (art === 'wahrheit' ? wahrheiten : pflichten).filter((e) => (e.stufe || 1) <= stufe);
      if (!alle.length) return meldung('Dafür liegt auf dieser Stufe nichts bereit.');
      _runde.gezogen = [];
      return zeigeGezogenes(zufall(alle), art);
    }

    zeigeGezogenes(zufall(topf), art);
  }

  function zeigeGezogenes(eintrag, art) {
    _runde.gezogen.push(eintrag.id);
    puls('hinweis');

    const b = blatt(
      el('p', { class: 'winzig still mitte' },
        (art === 'wahrheit' ? 'Wahrheit' : 'Pflicht') + ' · für ' + nameVon(dran)),
      el('p', {
        class: 'zier mitte',
        style: { fontSize: '24px', lineHeight: '1.32', padding: '18px 6px 22px' },
      }, eintrag.text),
      el('div', { class: 'knopfreihe' },
        el('button', {
          class: 'knopf leer',
          onclick: () => { b.schliessen(); weiter(false); },
        }, 'Ausgelassen'),
        el('button', {
          class: 'knopf glut',
          onclick: () => { b.schliessen(); weiter(true); },
        }, 'Gemacht')
      )
    );
  }

  async function weiter(gemacht) {
    _runde.zug++;
    _runde.dran = _runde.dran === 'sub' ? 'domme' : 'sub';

    const vorher = stufeJetzt();
    if (!gemacht && dran === 'sub' && istDomme()) {
      /* Ausgelassenes landet in der Warteschlange — ohne Aufhebens. */
      await datenAnhaengen('strafen', { text: 'Ausgelassen bei Wahrheit oder Pflicht', enthuellt: false, erledigt: false });
    }

    zeigeSeite('wahrheit');
    if (stufeJetzt() > vorher || (_runde.zug === 5 || _runde.zug === 10)) {
      setTimeout(() => meldung(STUFEN_NAMEN[stufeJetzt() - 1] + '. Neue Karten sind jetzt dabei.', 4200), 400);
      puls('befehl');
    }
  }

  return karte;
}

/* --- Töpfe ---------------------------------------------------------------- */

function wupAnlegen(art) {
  let stufe = 1;

  const feld = el('textarea', {
    class: 'feld', rows: 3,
    placeholder: art === 'wahrheit' ? 'Was willst du wissen?' : 'Was soll geschehen?',
  });

  const stufreihe = el('div', { style: { display: 'flex', gap: '7px', marginTop: '13px' } });
  const zeichneStufen = () => {
    stufreihe.innerHTML = '';
    STUFEN_NAMEN.forEach((n, i) => {
      stufreihe.append(el('button', {
        class: 'knopf' + (stufe === i + 1 ? ' glut' : ' leer'),
        style: { flex: '1', minHeight: '40px', fontSize: '13px' },
        onclick: () => { stufe = i + 1; zeichneStufen(); },
      }, n));
    });
  };
  zeichneStufen();

  const b = blatt(
    el('h2', {}, art === 'wahrheit' ? 'Eine Wahrheit' : 'Eine Pflicht'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Die Stufe entscheidet, ab wann sie im Spiel auftauchen kann.'),
    feld, stufreihe,
    el('div', { class: 'knopfreihe', style: { marginTop: '18px' } },
      el('button', { class: 'knopf leer', onclick: () => b.schliessen() }, 'Abbrechen'),
      el('button', {
        class: 'knopf glut',
        onclick: async () => {
          if (!feld.value.trim()) return meldung('Da steht noch nichts.');
          b.schliessen();
          await datenAnhaengen('wup', { art, stufe, text: feld.value.trim() });
          meldung('Im Topf.');
        },
      }, 'Hineinlegen')
    )
  );
  setTimeout(() => feld.focus(), 260);
}

function wupVerwalten(eintraege) {
  const b = blatt(
    el('h2', {}, 'Die Töpfe'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Langer Druck nimmt einen Eintrag heraus.'),
    ...eintraege.map((e) => {
      const zeile = el('div', {
        class: 'karte',
        style: { padding: '11px 13px', marginTop: '8px' },
      },
        el('p', { class: 'winzig still', style: { marginBottom: '4px' } },
          (e.art === 'wahrheit' ? 'Wahrheit' : 'Pflicht') + ' · ' + STUFEN_NAMEN[(e.stufe || 1) - 1] +
          ' · von ' + nameVon(e.von)),
        el('div', {}, e.text)
      );
      langerDruck(zeile, async () => {
        const weg = await frage('Herausnehmen?', e.text, 'Herausnehmen', true);
        if (weg) { await datenEintragLoeschen('wup', e.id); b.schliessen(); }
      });
      return zeile;
    })
  );
}
