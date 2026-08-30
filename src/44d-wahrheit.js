/* ==========================================================================
   44d-wahrheit.js — Wahrheit oder Pflicht.

   Abwechselnd, aus Töpfen — den eigenen und dem Vorrat (159 Karten in
   drei Stufen, gefiltert nach ihrer Obergrenze). Der Unterschied zum
   Kinderspiel: Es eskaliert. Nach sechs Zügen öffnet sich Stufe zwei,
   nach zwölf Stufe drei — und was auf Stufe drei liegt, hat vorher
   niemand gesehen.

   Passen ist erlaubt, kostet aber: einen Karma-Punkt und einen Eintrag
   ins Ausstehende. Dreimal gepasst, und die Runde ist vorbei.

   Die Runde lebt nur in dieser Sitzung. Was bleiben soll, wandert von
   selbst ins Buch.
   ========================================================================== */

const STUFEN_NAMEN = ['Warm', 'Wärmer', 'Heiß'];

const WUP_MODI = [
  { key: 'klassisch', name: 'Klassisch', hinweis: 'Wer dran ist, wählt selbst.' },
  { key: 'ihreWahl', name: 'Ihre Wahl', hinweis: 'Sie entscheidet auch für ihn.' },
  { key: 'zufall', name: 'Zufall', hinweis: 'Die App entscheidet für beide.' },
  { key: 'nurWahrheit', name: 'Nur Wahrheit', hinweis: 'Zum Reden.' },
  { key: 'nurPflicht', name: 'Nur Pflicht', hinweis: 'Ohne Worte.' },
];

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

function _wupTopf(art, stufe, dran, eigene) {
  const eigenePassend = eigene
    .filter((e) => e.art === art && (e.stufe || 1) <= stufe);
  const vorrat = vorratWup(art, stufe, dran).map((w) => ({
    id: 'v-' + w.id, art: w.typ, stufe: w.stufe, text: w.text,
    kategorie: w.kategorie, dauer: w.dauer_min, vorrat: true,
  }));
  /* Eigene zählen doppelt — sie treffen den eigenen Ton. */
  return [...eigenePassend, ...eigenePassend, ...vorrat];
}

function zeichnen(platz, eintraege) {
  platz.innerHTML = '';

  if (_runde) {
    platz.append(rundeKarte(eintraege));
  } else {
    const probeW = _wupTopf('wahrheit', 3, 'sub', eintraege).length;
    const probeP = _wupTopf('pflicht', 3, 'sub', eintraege).length;

    let modus = 'klassisch';
    const modusreihe = el('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '4px 0 14px' } });
    const modusHinweis = el('p', { class: 'still klein', style: { marginBottom: '14px' } });
    const zeichneModi = () => {
      modusreihe.innerHTML = '';
      WUP_MODI.forEach((m) => {
        modusreihe.append(el('button', {
          class: 'knopf' + (modus === m.key ? ' glut' : ' leer'),
          style: { minHeight: '36px', padding: '6px 12px', fontSize: '12.5px' },
          onclick: () => { modus = m.key; zeichneModi(); },
        }, m.name));
      });
      modusHinweis.textContent = WUP_MODI.find((m) => m.key === modus).hinweis;
    };
    zeichneModi();

    platz.append(
      el('div', { class: 'karte glimmt', style: { textAlign: 'center' } },
        el('div', { class: 'zier', style: { fontSize: '20px', marginBottom: '4px' } }, 'Eine Runde?'),
        el('p', { class: 'still klein', style: { marginBottom: '12px' } },
          probeW + ' Wahrheiten · ' + probeP + ' Pflichten im Spiel'),
        modusreihe, modusHinweis,
        el('button', {
          class: 'knopf glut breit',
          onclick: () => {
            if (!probeW && !probeP) return meldung('Alles leer — erst füllen oder den Vorrat anschalten.');
            _runde = { zug: 0, dran: 'sub', gezogen: [], gepasst: 0, modus };
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
      'Warm ab Beginn · Wärmer ab dem 7. Zug · Heiß ab dem 13. — eigene Karten zählen doppelt.')
  );

  if (eintraege.length) {
    platz.append(el('button', {
      class: 'winzig still', style: { display: 'block', margin: '16px auto 0' },
      onclick: () => wupVerwalten(eintraege),
    }, 'Eigene Karten ansehen'));
  }
}

/* --- Die Runde ------------------------------------------------------------ */

function stufeJetzt() {
  if (!_runde) return 1;
  const grund = _runde.zug >= 12 ? 3 : _runde.zug >= 6 ? 2 : 1;
  return Math.max(grund, _runde.sprung || 1);
}

function rundeKarte(eintraege) {
  const stufe = stufeJetzt();
  const dran = _runde.dran;
  const modus = _runde.modus || 'klassisch';

  /* Wer wählt? Im Modus „Ihre Wahl" entscheidet sie auch seinen Zug. */
  const sieWaehlt = modus === 'ihreWahl' && dran === 'sub';

  const fortschritt = stufe < 3
    ? el('div', { style: { height: '3px', borderRadius: '2px', background: 'var(--grund2)', margin: '12px 0 0', overflow: 'hidden' } },
        el('div', { style: {
          height: '100%', borderRadius: '2px', background: 'var(--verlauf)',
          width: Math.min(100, ((_runde.zug % 6) / 6) * 100) + '%',
          transition: 'width .4s ease',
        } }))
    : null;

  const karte = el('div', { class: 'karte glimmt', style: { textAlign: 'center' } },
    el('p', { class: 'winzig still' },
      'Zug ' + (_runde.zug + 1) + ' · ' + STUFEN_NAMEN[stufe - 1] +
      (_runde.gepasst ? ' · ' + _runde.gepasst + '× gepasst' : '')),
    el('div', { class: 'zier', style: { fontSize: '23px', margin: '10px 0 4px' } },
      nameVon(dran) + ' ist dran'),
    sieWaehlt ? el('p', { class: 'still klein', style: { marginBottom: '12px' } }, nameVon('domme') + ' entscheidet, was er bekommt.') : el('div', { style: { height: '12px' } }),
    modus === 'zufall'
      ? el('button', { class: 'knopf glut breit', onclick: () => ziehen(Math.random() < 0.5 ? 'wahrheit' : 'pflicht') }, 'Ziehen')
      : modus === 'nurWahrheit'
        ? el('button', { class: 'knopf breit', onclick: () => ziehen('wahrheit') }, 'Wahrheit')
        : modus === 'nurPflicht'
          ? el('button', { class: 'knopf glut breit', onclick: () => ziehen('pflicht') }, 'Pflicht')
          : el('div', { class: 'knopfreihe' },
              el('button', { class: 'knopf', onclick: () => ziehen('wahrheit') }, 'Wahrheit'),
              el('button', { class: 'knopf glut', onclick: () => ziehen('pflicht') }, 'Pflicht')
            ),
    fortschritt,
    el('div', { style: { display: 'flex', justifyContent: 'center', gap: '18px', marginTop: '15px' } },
      istDomme() && stufe < 3 ? el('button', {
        class: 'winzig still',
        onclick: () => { _runde.sprung = stufe + 1; zeigeSeite('wahrheit'); meldung(STUFEN_NAMEN[stufe] + '. Du hast es so entschieden.'); puls('befehl'); },
      }, 'Stufe überspringen') : null,
      el('button', {
        class: 'winzig still',
        onclick: () => { _runde = null; zeigeSeite('wahrheit'); },
      }, 'Runde beenden')
    )
  );

  function ziehen(art) {
    const topf = _wupTopf(art, stufe, dran, eintraege)
      .filter((e) => !_runde.gezogen.includes(e.id));

    if (!topf.length) {
      const alle = _wupTopf(art, stufe, dran, eintraege);
      if (!alle.length) return meldung('Dafür liegt auf dieser Stufe nichts bereit.');
      _runde.gezogen = [];
      return zeigeGezogenes(zufall(alle), art);
    }
    zeigeGezogenes(zufall(topf), art);
  }

  function zeigeGezogenes(eintrag, art) {
    _runde.gezogen.push(eintrag.id);
    puls('hinweis');
    tonSpielen('papier');

    const wahrheit = art === 'wahrheit';
    const b = blatt(
      el('p', {
        class: 'winzig mitte',
        style: { color: wahrheit ? '#8d99ae' : 'var(--glut-hell)', letterSpacing: '.2em' },
      }, (wahrheit ? 'WAHRHEIT' : 'PFLICHT') + ' · für ' + nameVon(dran)),
      el('p', {
        class: 'zier mitte',
        style: { fontSize: '24px', lineHeight: '1.32', padding: '18px 6px 10px' },
      }, eintrag.text),
      eintrag.dauer ? el('p', { class: 'still klein mitte', style: { marginBottom: '8px' } }, '~' + eintrag.dauer + ' Minuten') : null,
      el('div', { class: 'knopfreihe', style: { marginTop: '12px' } },
        el('button', {
          class: 'knopf leer',
          onclick: () => { b.schliessen(); weiter(false); },
        }, 'Passen'),
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

    if (!gemacht) {
      _runde.gepasst++;
      /* Passen hat einen Preis — bei ihm einen echten, bei ihr einen
         symbolischen. Und dreimal gepasst heißt: Es reicht für heute. */
      if (dran === 'sub') {
        try {
          const stand = await datenLies('wachsen/stand', {});
          await datenSchreib('wachsen/stand', { ...stand, karma: (stand.karma || 0) - 1 });
          await datenAnhaengen('strafen', { text: 'Gepasst bei Wahrheit oder Pflicht', enthuellt: false, erledigt: false });
        } catch { /* dann eben nur das Zählen */ }
      }
      if (_runde.gepasst >= 3) {
        _runde = null;
        zeigeSeite('wahrheit');
        meldung('Dreimal gepasst — die Runde ist vorbei. ' + nameVon('domme') + ' entscheidet, was das heißt.', 5000);
        puls('antwortNein');
        return;
      }
    }

    zeigeSeite('wahrheit');
    if (stufeJetzt() > vorher) {
      setTimeout(() => meldung(STUFEN_NAMEN[stufeJetzt() - 1] + '. Neue Karten sind jetzt dabei.', 4200), 400);
      puls('befehl');
      tonSpielen('weich');
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
      'Die Stufe entscheidet, ab wann sie im Spiel auftauchen kann. Eigene Karten kommen doppelt so oft wie die aus dem Vorrat.'),
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
    el('h2', {}, 'Eure eigenen Karten'),
    el('p', { class: 'leise klein', style: { margin: '7px 0 14px' } },
      'Langer Druck nimmt einen Eintrag heraus. Der Vorrat bleibt davon unberührt.'),
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
